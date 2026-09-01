// backend/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";

import Record from "./models/Record.js";
import User from "./models/User.js";
import { authMiddleware, protect } from "./middleware/authMiddleware.js";
import { allowRoles } from "./middleware/roleMiddleware.js";
import { encryptBuffer } from "./utils/encrypt.js";
import { pinToIPFS } from "./utils/pinata.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const JSON_LIMIT = process.env.JSON_LIMIT || "10mb";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const MONGO_URI = process.env.MONGODB_URI || "";
const PINATA_JWT = process.env.PINATA_JWT || "";

// ---------- Middleware ----------
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (CORS_ORIGIN === "*" || origin.includes("localhost") || origin === CORS_ORIGIN) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));

app.use((req, _res, next) => {
  req.headers["cache-control"] = "no-store";
  next();
});

app.use(morgan("dev"));

// ---------- Database Connection ----------
async function connectDB() {
  const uri = MONGO_URI;
  if (uri) {
    await mongoose.connect(uri, { dbName: "carechain" });
    console.log("✅ MongoDB connected:", uri);
  } else {
    console.warn("⚠️  No MONGODB_URI set – starting embedded in-memory MongoDB for development.");
    const memServer = await MongoMemoryServer.create({ instance: { dbName: "carechain" } });
    const memUri = memServer.getUri();
    await mongoose.connect(memUri);
    console.log("✅ In-memory MongoDB ready at:", memUri);
  }
}

// ---------- Demo User Seeder ----------
async function seedDemoUsers() {
  try {
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

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
        console.log(`✅ Demo user seeded: ${u.email} [${u.role}]`);
      }
    }
    console.log("🌱 Demo users ready — patient@demo.com / doctor@demo.com / admin@demo.com (password: Demo@1234)");
  } catch (err) {
    console.warn("⚠️  Demo user seeding failed:", err.message);
  }
}

connectDB()
  .then(() => seedDemoUsers())
  .catch((e) => {
    console.error("❌ Database startup failed:", e.message);
    process.exit(1);
  });

// ---------- Health Check ----------
app.get("/healthz", async (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1,
    time: new Date().toISOString(),
    service: "CareChain Health & Blockchain Gateway API",
    version: "2.0.0",
  });
});

// ---------- Register Modular Routes ----------
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);

// ---------- Secure Upload Route (AES-256-GCM + IPFS Pinata) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const { originalname, buffer, mimetype, size } = req.file;

    // Encrypt the uploaded file with AES-256-GCM
    const { encrypted, key, iv, tag } = encryptBuffer(buffer);
    const encName = `${originalname}.enc`;

    // Combine encrypted data and tag for verification
    const payload = Buffer.concat([encrypted, Buffer.from(tag, "hex")]);

    // Upload encrypted payload to IPFS (Pinata) if JWT available, else create mock CID for local dev
    let cid = `QmDevMock${Date.now().toString(16)}${Math.random().toString(36).substring(2, 10)}`;
    if (PINATA_JWT && PINATA_JWT !== "your_pinata_jwt_token_here") {
      try {
        const pin = await pinToIPFS(payload, encName, PINATA_JWT);
        if (pin.cid) cid = pin.cid;
      } catch (pinErr) {
        console.warn("Pinata upload warning (fallback to local mock CID):", pinErr.message);
      }
    }

    // Save record metadata to database
    let saved = null;
    if (mongoose.connection.readyState === 1) {
      saved = await Record.create({
        userId: req.user.id,
        uploadedBy: req.user.id,
        name: originalname,
        title: req.body.title || originalname,
        recordType: req.body.recordType || "General",
        note: req.body.note || "Encrypted medical upload",
        cid,
        key,
        iv,
        tag,
        fileSize: size,
        mimeType: mimetype,
      });
    }

    return res.json({
      success: true,
      cid,
      key,
      iv,
      tag,
      gateway: `https://gateway.pinata.cloud/ipfs/${cid}`,
      id: saved ? saved._id : "mock-id",
    });
  } catch (err) {
    console.error("POST /upload error:", err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ---------- Doctor & Admin Aggregation APIs ----------
app.get("/admin/stats", authMiddleware, allowRoles("admin"), async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const verifiedDoctors = await User.countDocuments({ role: "doctor", isVerified: true });
    const totalRecords = await Record.countDocuments();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        verifiedDoctors,
        totalRecords,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ---------- Root & 404 Handler ----------
app.get("/", (_req, res) =>
  res.json({
    message: "🚀 CareChain Decentralized Healthcare Gateway API is online",
    version: "2.0.0",
    docs: "/healthz",
  })
);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.path });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 CareChain Backend running on port ${PORT}`);
});

export default app;
