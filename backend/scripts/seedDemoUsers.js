import { ethers } from "ethers";
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User.js";

dotenv.config({ path: new URL("../../atlas-credentials.env", import.meta.url) });
dotenv.config({ path: new URL("../../.env", import.meta.url) });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// Deterministic Hardhat test accounts. Identity is the wallet itself — there is
// no password to seed; these wallets simply sign a challenge to log in.
const MNEMONIC = process.env.DEMO_MNEMONIC || "test test test test test test test test test test test junk";
const walletFor = (index) =>
  ethers.HDNodeWallet.fromPhrase(MNEMONIC, `m/44'/60'/0'/0/${index}`).address.toLowerCase();

const demoUsers = [
  {
    walletAddress: walletFor(0),
    name: "Demo Patient",
    email: "patient@demo.com",
    role: "patient",
    isVerified: true,
  },
  {
    walletAddress: walletFor(1),
    name: "Demo Doctor",
    email: "doctor@demo.com",
    role: "doctor",
    specialization: "General Medicine",
    hospitalName: "CareChain Demo Hospital",
    doctorId: "DOC-DEMO-001",
    isVerified: true,
  },
  {
    walletAddress: walletFor(2),
    name: "Demo Admin",
    email: "admin@demo.com",
    role: "admin",
    isVerified: true,
  },
];

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is required. Set it in atlas-credentials.env or the process environment.");
}

try {
  await mongoose.connect(MONGO_URI, { dbName: "carechain" });

  for (const user of demoUsers) {
    const existingUser = await User.findOne({ walletAddress: user.walletAddress });
    if (existingUser) {
      console.log(`↷ Demo user already exists: ${user.walletAddress} (${user.role})`);
      continue;
    }

    await User.create(user);
    console.log(`✓ Demo user created: ${user.walletAddress} [${user.role}]`);
  }
} finally {
  await mongoose.disconnect();
}
