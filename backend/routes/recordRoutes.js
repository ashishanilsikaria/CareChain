import express from "express";
import crypto from "crypto";
import axios from "axios";
import Record from "../models/Record.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { decryptBuffer } from "../utils/encrypt.js";

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
 * @route   GET /records/:id/download
 * @desc    Fetch encrypted ciphertext from IPFS, decrypt with AES-256-GCM, and stream to client
 */
router.get("/:id/download", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Role-based access validation
    const userId = req.user.id;
    const isOwner = record.userId.toString() === userId || record.uploadedBy?.toString() === userId;
    const isSharedDoctor = record.sharedWith.some(
      (s) => s.doctor?.toString() === userId || (req.user.walletAddress && s.doctorAddress?.toLowerCase() === req.user.walletAddress.toLowerCase())
    );
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isSharedDoctor && !isAdmin) {
      return res.status(403).json({ error: "Access denied. You do not have active cryptographic permission for this record." });
    }

    // Fetch ciphertext payload from IPFS Gateway
    const gateway = process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
    const ipfsUrl = `${gateway.replace(/\/+$/, "")}/${record.cid}`;

    let response;
    try {
      response = await axios.get(ipfsUrl, { responseType: "arraybuffer", timeout: 15000 });
    } catch (ipfsErr) {
      console.error("IPFS Fetch Error:", ipfsErr.message);
      return res.status(502).json({ error: "Failed to fetch encrypted document from IPFS gateway", details: ipfsErr.message });
    }

    // Decrypt ciphertext using stored symmetric key & IV
    if (!record.key || !record.iv) {
      return res.status(500).json({ error: "Decryption key or IV missing for this record" });
    }

    const decryptedBuffer = decryptBuffer(
      Buffer.from(response.data),
      record.key,
      record.iv,
      record.tag
    );

    res.setHeader("Content-Type", record.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(record.name)}"`);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

    return res.send(decryptedBuffer);
  } catch (err) {
    console.error("Record Decrypt & Download Error:", err);
    return res.status(500).json({ error: "Decryption failed", details: err.message });
  }
});

/**
 * @route   POST /records/simulate
 * @desc    Record an uploaded IPFS document on simulated blockchain with cryptographic TxHash
 */
router.post("/simulate", async (req, res) => {
  try {
    const { recordId, name, title, recordType, note, cid, key, iv, tag, patientAddress, patientId } = req.body;
    if (!name || !cid) {
      return res.status(400).json({ error: "Record name and IPFS CID are required" });
    }

    const fakeTxHash = "0x" + crypto.randomBytes(32).toString("hex");
    const targetUserId = req.user.role === "doctor" && patientId ? patientId : req.user.id;

    let record;
    if (recordId) {
      record = await Record.findOneAndUpdate(
        { _id: recordId, userId: targetUserId },
        {
          $set: {
            patientAddress: patientAddress || req.user.walletAddress || null,
            name,
            title: title || name,
            recordType: recordType || "General",
            note: note || "Encrypted medical upload",
            cid,
            key: key || "",
            iv: iv || "",
            tag: tag || "",
            txHash: fakeTxHash,
          },
        },
        { new: true }
      );
    }

    if (!record) {
      record = await Record.create({
        userId: targetUserId,
        uploadedBy: req.user.id,
        patientAddress: patientAddress || req.user.walletAddress || null,
        name,
        title: title || name,
        recordType: recordType || "General",
        note: note || "Encrypted medical upload",
        cid,
        key: key || "",
        iv: iv || "",
        tag: tag || "",
        txHash: fakeTxHash,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Medical record securely recorded on simulated blockchain",
      record,
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

    const doctorObjectId = doctorId ? doctorId.toString() : null;
    const normalizedDoctorAddress = doctorAddress ? doctorAddress.toLowerCase().trim() : null;
    const sharedWithMatch = {
      $or: [
        ...(doctorObjectId ? [{ doctor: doctorObjectId }] : []),
        ...(normalizedDoctorAddress ? [{ doctorAddress: normalizedDoctorAddress }] : []),
      ],
    };

    if (recordId) {
      await Record.findOneAndUpdate(
        { _id: recordId, userId: req.user.id },
        { $pull: { sharedWith: sharedWithMatch } }
      );
    } else {
      await Record.updateMany(
        { userId: req.user.id },
        { $pull: { sharedWith: sharedWithMatch } }
      );
    }

    return res.json({ success: true, message: "Doctor access revoked successfully" });
  } catch (err) {
    console.error("Revoke Share Error:", err);
    return res.status(500).json({ error: "Failed to revoke access" });
  }
});

router.delete("/:id", allowRoles("patient"), async (req, res) => {
  try {
    const deletedRecord = await Record.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found or you do not have permission to delete it" });
    }

    return res.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete Record Error:", err);
    return res.status(500).json({ error: "Failed to delete record" });
  }
});

export default router;
