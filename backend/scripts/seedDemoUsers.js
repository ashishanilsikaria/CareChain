import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User.js";

dotenv.config({ path: new URL("../../atlas-credentials.env", import.meta.url) });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const demoUsers = [
  {
    name: "Demo Patient",
    email: "patient@demo.com",
    password: "Demo@1234",
    role: "patient",
    isVerified: true,
  },
  {
    name: "Demo Doctor",
    email: "doctor@demo.com",
    password: "Demo@1234",
    role: "doctor",
    specialization: "General Medicine",
    hospitalName: "CareChain Demo Hospital",
    doctorId: "DOC-DEMO-001",
    isVerified: true,
  },
  {
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "Demo@1234",
    role: "admin",
    isVerified: true,
  },
];

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is required. Set it in atlas-credentials.env or the process environment.");
}

try {
  await mongoose.connect(MONGO_URI, { dbName: "carechain" });

  for (const { password, ...user } of demoUsers) {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log(`↷ Demo user already exists: ${user.email}`);
      continue;
    }

    await User.create({ ...user, password: await bcrypt.hash(password, 10) });
    console.log(`✓ Demo user created: ${user.email} [${user.role}]`);
  }
} finally {
  await mongoose.disconnect();
}
