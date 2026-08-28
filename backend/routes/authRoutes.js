import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "carechain_super_secret_jwt_key_change_in_production_2026";

/**
 * @route   POST /auth/register
 * @desc    Register a new user (patient, doctor, or admin)
 */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "patient",
      walletAddress,
      phone,
      age,
      sex,
      dob,
      specialization,
      hospitalName,
      doctorId,
      hospitalId,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email address" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      walletAddress: walletAddress ? walletAddress.toLowerCase() : null,
      phone: phone || "",
      age: age || null,
      sex: sex || "",
      dob: dob || "",
      specialization: specialization || "",
      hospitalName: hospitalName || "",
      doctorId: doctorId || "",
      hospitalId: hospitalId || "",
      isVerified: role === "patient", // Doctors/Admins default to pending admin verification
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        specialization: user.specialization,
        hospitalName: user.hospitalName,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login with email and password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        specialization: user.specialization,
        hospitalName: user.hospitalName,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Login failed", details: err.message });
  }
});

/**
 * @route   GET /auth/me
 * @desc    Fetch authenticated user's profile
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Fetch Profile Error:", err);
    return res.status(500).json({ error: "Failed to retrieve user profile" });
  }
});

/**
 * @route   PATCH /auth/wallet
 * @desc    Link or update Ethereum wallet address
 */
router.patch("/wallet", authMiddleware, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { walletAddress: walletAddress.toLowerCase() },
      { new: true }
    ).select("-password");

    return res.json({ success: true, message: "Wallet linked successfully", user });
  } catch (err) {
    console.error("Update Wallet Error:", err);
    return res.status(500).json({ error: "Failed to link wallet address" });
  }
});

export default router;
