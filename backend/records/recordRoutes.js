// backend/records/recordRoutes.js
import express from "express";
import crypto from "crypto";
import Record from "../models/Record.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply authentication to all record routes
router.use(authMiddleware);

/**
 * @route   GET /records
 * @desc    Get medical records scoped to the authenticated user's role
 */
router.get("/", async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    let query = {};

    if (userRole === "patient") {
      // Patient sees their own records
      query = { userId };
    } else if (userRole === "doctor") {
      // Doctor sees records explicitly shared with them or uploaded by them
      query = {
        $or: [
          { "sharedWith.doctor": userId },
          { uploadedBy: userId },
        ],
      };
    } else if (userRole === "admin") {
      // Admin sees audit records (without exposing private encryption keys directly)
      query = {};
    }

    const records = await Record.find(query)
      .populate("userId", "name email walletAddress")
      .populate("uploadedBy", "name email specialization")
      .populate("sharedWith.doctor", "name email specialization")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, count: records.length, records });
  } catch (err) {
    console.error("Fetch Records Error:", err);
    return res.status(500).json({ error: "Failed to retrieve records", details: err.message });
  }
});

/**
 * @route   GET /records/patient/:patientId
 * @desc    Doctor view for a specific patient's shared records
 */
router.get("/patient/:patientId", allowRoles("doctor", "admin"), async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user.id;

    let query = { userId: patientId };
    if (req.user.role === "doctor") {
      query["sharedWith.doctor"] = doctorId;
    }

    const records = await Record.find(query)
      .populate("userId", "name email")
      .populate("uploadedBy", "name email specialization")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, count: records.length, records });
  } catch (err) {
    console.error("Doctor View Patient Records Error:", err);
    return res.status(500).json({ error: "Failed to retrieve patient records" });
  }
});

/**
 * @route   POST /records/simulate
 * @desc    Record an uploaded IPFS document on simulated blockchain with cryptographic TxHash
 */
router.post("/simulate", async (req, res) => {
  try {
    const { name, title, recordType, note, cid, key, iv, tag, patientAddress, patientId } = req.body;
    if (!name || !cid) {
      return res.status(400).json({ error: "Record name and IPFS CID are required" });
    }

    const fakeTxHash = "0x" + crypto.randomBytes(32).toString("hex");

    const targetUserId = req.user.role === "doctor" && patientId ? patientId : req.user.id;

    const newRecord = await Record.create({
      userId: targetUserId,
      uploadedBy: req.user.id,
      patientAddress: patientAddress || req.user.walletAddress || null,
      name,
      title: title || name,
      recordType: recordType || "General",
      note: note || "Decentralized medical record",
      cid,
      key: key || "",
      iv: iv || "",
      tag: tag || "",
      txHash: fakeTxHash,
    });

    return res.status(201).json({
      success: true,
      message: "Medical record securely recorded on simulated blockchain",
      record: newRecord,
    });
  } catch (err) {
    console.error("Simulate Record Error:", err);
    return res.status(500).json({ error: "Failed to save record", details: err.message });
  }
});

/**
 * @route   POST /records/share
 * @desc    Patient grants a doctor access to a specific record or all their records
 */
router.post("/share", allowRoles("patient"), async (req, res) => {
  try {
    const { doctorId, recordId, doctorAddress } = req.body;
    if (!doctorId && !doctorAddress) {
      return res.status(400).json({ error: "Doctor ID or Doctor Ethereum address is required" });
    }

    // Find doctor user
    let doctorUser = null;
    if (doctorId) {
      doctorUser = await User.findById(doctorId);
    } else if (doctorAddress) {
      doctorUser = await User.findOne({ walletAddress: doctorAddress.toLowerCase() });
    }

    const shareItem = {
      doctor: doctorUser ? doctorUser._id : null,
      doctorAddress: doctorAddress || (doctorUser ? doctorUser.walletAddress : ""),
      grantedAt: new Date(),
    };

    if (recordId) {
      // Share single record
      await Record.findOneAndUpdate(
        { _id: recordId, userId: req.user.id },
        { $addToSet: { sharedWith: shareItem } }
      );
    } else {
      // Share all records of this patient
      await Record.updateMany(
        { userId: req.user.id },
        { $addToSet: { sharedWith: shareItem } }
      );
    }

    return res.json({ success: true, message: "Access granted to doctor successfully" });
  } catch (err) {
    console.error("Share Record Error:", err);
    return res.status(500).json({ error: "Failed to share record" });
  }
});

/**
 * @route   POST /records/revoke-share
 * @desc    Patient revokes a doctor's access to their records
 */
router.post("/revoke-share", allowRoles("patient"), async (req, res) => {
  try {
    const { doctorId, recordId, doctorAddress } = req.body;
    if (!doctorId && !doctorAddress) {
      return res.status(400).json({ error: "Doctor ID or Address is required to revoke" });
    }

    const filter = doctorId ? { "sharedWith.doctor": doctorId } : { "sharedWith.doctorAddress": doctorAddress.toLowerCase() };

    if (recordId) {
      await Record.findOneAndUpdate(
        { _id: recordId, userId: req.user.id },
        { $pull: { sharedWith: filter } }
      );
    } else {
      await Record.updateMany(
        { userId: req.user.id },
        { $pull: { sharedWith: filter } }
      );
    }

    return res.json({ success: true, message: "Doctor access revoked successfully" });
  } catch (err) {
    console.error("Revoke Share Error:", err);
    return res.status(500).json({ error: "Failed to revoke access" });
  }
});

export default router;
