import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    walletAddress: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
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
  },
  { timestamps: true }
);

// Index for search & fast lookups
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
