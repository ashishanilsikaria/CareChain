import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route   GET /users/doctors
 * @desc    Get list of registered and verified doctors for patient directory
 */
router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("name email walletAddress specialization hospitalName doctorId isVerified")
      .sort({ name: 1 })
      .lean();

    return res.json({ success: true, count: doctors.length, doctors });
  } catch (err) {
    console.error("Fetch Doctors Error:", err);
    return res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

/**
 * @route   GET /users/admin/all
 * @desc    Admin endpoint to view all system users
 */
router.get("/admin/all", authMiddleware, allowRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-nonce").sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Admin Fetch Users Error:", err);
    return res.status(500).json({ error: "Failed to fetch all users" });
  }
});

/**
 * @route   PATCH /users/admin/verify/:userId
 * @desc    Admin endpoint to toggle verification status for doctor/hospital
 */
router.patch("/admin/verify/:userId", authMiddleware, allowRoles("admin"), async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: isVerified !== undefined ? isVerified : true },
      { new: true }
    ).select("-nonce");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ success: true, message: "User verification status updated", user });
  } catch (err) {
    console.error("Verification Error:", err);
    return res.status(500).json({ error: "Failed to update verification status" });
  }
});

export default router;
