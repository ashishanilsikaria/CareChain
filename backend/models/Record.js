import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    patientAddress: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
    },
    recordType: {
      type: String,
      enum: ["General", "Diagnostic", "Prescription", "LabReport", "Radiology", "Surgery"],
      default: "General",
    },
    note: {
      type: String,
      default: "",
    },
    cid: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      default: "",
    },
    iv: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "application/pdf",
    },
    txHash: {
      type: String,
      default: null,
    },
    // List of Doctor User IDs who have been granted access
    sharedWith: [
      {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        doctorAddress: { type: String, lowercase: true },
        grantedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "archived", "revoked"],
      default: "active",
    },
  },
  { timestamps: true }
);

recordSchema.index({ userId: 1, createdAt: -1 });
recordSchema.index({ "sharedWith.doctor": 1 });
recordSchema.index({ patientAddress: 1 });

const RecordModel = mongoose.model("Record", recordSchema);

import { memoryRecordStore } from "../utils/memoryStore.js";

const Record = new Proxy(RecordModel, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return Reflect.get(target, prop);
    }
    if (prop in memoryRecordStore) {
      return memoryRecordStore[prop];
    }
    return Reflect.get(target, prop);
  },
});

export default Record;
