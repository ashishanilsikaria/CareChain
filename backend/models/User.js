import mongoose from "mongoose";
import { randomBytes } from "node:crypto";

export function newAuthNonce() {
  return randomBytes(32).toString("hex");
}

// Identity is the blockchain wallet. Mongo stores only the profile and the
// login challenge — never a password or any credential that can log in.
const userSchema = new mongoose.Schema(
  {
    // Canonical EIP-55-agnostic identity (always lowercase). Required + unique.
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^0x[a-f0-9]{40}$/,
    },
    // Single-use login challenge, rotated after every successful verification.
    nonce: { type: String, required: true, default: newAuthNonce },
    authMethod: { type: String, enum: ["wallet"], default: "wallet" },
    // Optional contact info — never used as a login credential.
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    // Role-specific profile metadata
    phone: { type: String, default: "" },
    age: { type: Number, default: null },
    sex: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    dob: { type: String, default: "" },
    specialization: { type: String, default: "" },
    hospitalName: { type: String, default: "" },
    doctorId: { type: String, default: "" },
    hospitalId: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for search & fast lookups
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
