import express from "express";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import User, { newAuthNonce } from "../models/User.js";
import WalletChallenge from "../models/WalletChallenge.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "carechain_super_secret_jwt_key_change_in_production_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const CHALLENGE_MAX_AGE_MS = 10 * 60 * 1000; // signed messages older than 10 min are rejected

/**
 * Builds the deterministic, human-readable "sign-in" message that the wallet is
 * asked to sign. The random server nonce embedded here is what binds a captured
 * signature to a single, fresh authentication attempt.
 */
function buildAuthMessage({ address, nonce, chainId }) {
  const issuedAt = new Date().toISOString();
  const lines = [
    "CareChain wants you to sign in with your Ethereum account:",
    address,
    "",
    `Nonce: ${nonce}`,
    `Issued: ${issuedAt}`,
  ];
  if (chainId) lines.push(`Chain ID: ${chainId}`);
  return lines.join("\n");
}

function extractField(message, label) {
  const match = message.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : null;
}

/**
 * Normalizes an EVM address (throws if invalid) and returns
 * `{ checksummed, lowercase }`.
 */
function normalizeAddress(walletAddress) {
  if (!walletAddress || typeof walletAddress !== "string") {
    throw new Error("Wallet address is required");
  }
  const checksummed = ethers.getAddress(walletAddress.trim()); // validates + EIP-55
  return { checksummed, lowercase: checksummed.toLowerCase() };
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, walletAddress: user.walletAddress },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress,
    isVerified: user.isVerified,
    specialization: user.specialization,
    hospitalName: user.hospitalName,
  };
}

/**
 * Verifies that `signature` is a valid, fresh proof of key ownership for
 * `lowercaseAddress` against the expected server `expectedNonce`.
 * Returns the checksummed address on success, or throws with a reason.
 */
function verifySignature({ walletAddress, signature, message, expectedNonce }) {
  if (!signature || !message) throw new Error("Signature and signed message are required");
  if (typeof message !== "string" || !message.includes("CareChain")) {
    throw new Error("Message is not a valid CareChain sign-in request");
  }
  const messageNonce = extractField(message, "Nonce");
  if (!messageNonce || messageNonce !== expectedNonce) {
    throw new Error("Challenge mismatch: request a fresh nonce and try again");
  }
  const issued = new Date(extractField(message, "Issued") || "");
  if (Number.isNaN(issued.getTime())) throw new Error("Challenge is missing a valid timestamp");
  if (Date.now() - issued.getTime() > CHALLENGE_MAX_AGE_MS) {
    throw new Error("Challenge expired: request a fresh nonce and try again");
  }
  const recovered = ethers.verifyMessage(message, signature);
  if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new Error("Signature does not match the provided wallet address");
  }
  return recovered;
}

/**
 * @route   POST /auth/nonce
 * @desc    Issue a single-use challenge message to sign for a wallet.
 *          Existing accounts reuse their stored nonce; unknown wallets get a
 *          short-lived pending challenge so they can register.
 */
router.post("/nonce", async (req, res) => {
  try {
    const { checksummed, lowercase } = normalizeAddress(req.body.walletAddress);
    const chainId = req.body.chainId ?? process.env.CHAIN_ID ?? null;

    const existing = await User.findOne({ walletAddress: lowercase });
    if (existing) {
      const message = buildAuthMessage({ address: checksummed, nonce: existing.nonce, chainId });
      return res.json({ success: true, registered: true, nonce: existing.nonce, message });
    }

    // Upsert a fresh pending challenge (unique per wallet, TTL-expiring).
    const challenge = await WalletChallenge.findOneAndUpdate(
      { walletAddress: lowercase },
      { $set: { nonce: newAuthNonce() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const message = buildAuthMessage({ address: checksummed, nonce: challenge.nonce, chainId });
    return res.json({ success: true, registered: false, nonce: challenge.nonce, message });
  } catch (err) {
    console.error("Nonce Error:", err);
    return res.status(400).json({ error: "Failed to issue challenge", details: err.message });
  }
});

/**
 * @route   POST /auth/register
 * @desc    Create a profile for a wallet after it signs the issued challenge.
 */
router.post("/register", async (req, res) => {
  let consumedChallengeId = null;
  try {
    const {
      walletAddress,
      signature,
      message,
      name,
      role = "patient",
      email,
      phone,
      age,
      sex,
      dob,
      specialization,
      hospitalName,
      doctorId,
      hospitalId,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!["patient", "doctor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const { lowercase } = normalizeAddress(walletAddress);

    const existing = await User.findOne({ walletAddress: lowercase });
    if (existing) {
      return res.status(409).json({ error: "A profile already exists for this wallet. Please sign in instead." });
    }

    // Registration requires a pending challenge issued via POST /auth/nonce.
    const challenge = await WalletChallenge.findOne({ walletAddress: lowercase });
    if (!challenge) {
      return res.status(400).json({ error: "Request a fresh sign-in challenge before registering" });
    }
    consumedChallengeId = challenge._id;

    verifySignature({ walletAddress: lowercase, signature, message, expectedNonce: challenge.nonce });

    const user = await User.create({
      walletAddress: lowercase,
      name,
      role,
      nonce: newAuthNonce(),
      email: email ? email.toLowerCase() : null,
      phone: phone || "",
      age: age || null,
      sex: sex || "",
      dob: dob || "",
      specialization: specialization || "",
      hospitalName: hospitalName || "",
      doctorId: doctorId || "",
      hospitalId: hospitalId || "",
      isVerified: role === "patient", // Doctors/Admins default to pending admin verification
      lastLoginAt: new Date(),
    });

    await WalletChallenge.deleteOne({ _id: consumedChallengeId });

    return res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (err) {
    if (consumedChallengeId) {
      await WalletChallenge.deleteOne({ _id: consumedChallengeId }).catch(() => {});
    }
    // Duplicate wallet race -> treat as conflict
    if (err && err.code === 11000) {
      return res.status(409).json({ error: "A profile already exists for this wallet. Please sign in instead." });
    }
    const status = err && err.message && /Signature|Challenge|nonce|address|message/i.test(err.message) ? 401 : 500;
    console.error("Register Error:", err);
    return res.status(status).json({ error: "Registration failed", details: err.message });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Sign in by proving ownership of a registered wallet's key.
 */
router.post("/login", async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    const { lowercase } = normalizeAddress(walletAddress);

    const user = await User.findOne({ walletAddress: lowercase });
    if (!user) {
      return res.status(404).json({ error: "No account found for this wallet. Please register first." });
    }

    verifySignature({ walletAddress: lowercase, signature, message, expectedNonce: user.nonce });

    // Single-use: rotate the nonce so the captured signature cannot be replayed.
    user.nonce = newAuthNonce();
    user.lastLoginAt = new Date();
    await user.save();

    return res.json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (err) {
    const status = err && err.message && /Signature|Challenge|nonce|address|message|Wallet/i.test(err.message) ? 401 : 500;
    console.error("Login Error:", err);
    return res.status(status).json({ error: "Login failed", details: err.message });
  }
});

/**
 * @route   GET /auth/me
 * @desc    Fetch authenticated user's profile
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-nonce");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Fetch Profile Error:", err);
    return res.status(500).json({ error: "Failed to retrieve user profile" });
  }
});

export default router;
