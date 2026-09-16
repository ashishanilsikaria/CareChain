# 🩺 CareChain – Decentralized Electronic Health Record (EHR) Platform

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![IPFS](https://img.shields.io/badge/Storage-IPFS%20Pinata-65C2CB.svg)](https://pinata.cloud/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

CareChain is a secure, patient-centric, decentralized medical record management platform. It combines Ethereum/Polygon smart contracts, AES-256-GCM symmetric encryption, decentralized IPFS storage, and role-based access control (RBAC) to ensure total patient sovereignty over electronic health data.

---

## 🌟 Core Features

- **🧑‍⚕️ Patient Sovereignty & Access Control**: Patients own their medical vaults and selectively grant or revoke access to verified practitioners via on-chain smart contracts.
- **🔐 End-to-End Encryption (AES-256-GCM)**: All medical records are encrypted with unique cryptographic keys before transmission.
- **🌐 Decentralized Storage (IPFS)**: Encrypted payloads are pinned across IPFS nodes, generating tamper-proof Content Identifiers (CIDs).
- **👨‍⚕️ Clinical Practitioner Portal**: Licensed doctors can look up authorized patient histories, issue verifiable diagnostic reports, and write prescriptions.
- **🛠️ Hospital & Admin Governance**: Verifies practitioner licenses, monitors network telemetry, and maintains compliance audit trails.
- **👛 MetaMask Web3 Integration**: Supports direct wallet-based signing alongside simulated off-chain development modes.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Smart Contracts** | Solidity (`0.8.20`), Hardhat | Patient access control lists, doctor registry, audit logs |
| **Blockchain Networks** | Hardhat Local, Polygon Amoy, Ethereum Sepolia | Decentralized execution and consensus |
| **Decentralized Storage**| IPFS via Pinata Gateway | Encrypted medical file and diagnostic scan storage |
| **Encryption** | AES-256-GCM, Cryptographic IVs | Symmetric file payload encryption |
| **Backend Gateway** | Node.js, Express, MongoDB, JWT | REST APIs, authentication, IPFS pinning gateway |
| **Frontend Web App** | React 18, React Router v6, Tailwind CSS, Lucide Icons | Responsive role-based portals (Patient, Doctor, Admin) |
| **Web3 Client** | Ethers.js v6, MetaMask Provider | Wallet connectivity and contract interaction |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- Git
- MetaMask Browser Extension (Optional for Web3 mode)

### 1. Install Dependencies
Because CareChain uses Bun workspaces, install all dependencies (root, backend, and frontend) in one single command from the root directory:
```bash
bun install
```

### 2. Run Everything (One Command ⚡)

#### Option A: One-Command Local Dev (Backend + Frontend)
```bash
bun start
# or: bun run dev
```
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000

#### Option B: One-Command Full Stack (Blockchain Node + Backend + Frontend)
```bash
bun run dev:all
```

#### Option C: One-Command Docker Setup (MongoDB + Backend + Frontend)
```bash
docker-compose up --build
```

---

### 3. Smart Contracts & Testing (Optional)
```bash
# Compile contracts
bun run compile

# Run smart contract unit tests
bun run test:contracts

# Deploy to local network & export ABIs
bun run deploy:local
```

---

## 📚 Documentation & Academic Deliverables

- [System Architecture Guide](./docs/ARCHITECTURE.md)
- [Security & HIPAA/GDPR Compliance](./docs/SECURITY.md)
- [REST API Reference](./docs/API.md)
- [Multi-Agent Operations Guide (AGENTS.md)](./AGENTS.md)
- [Review 1 Academic Package](./docs/reviews/Review%201/)
- [Review 2 Finalized Report & Presentation](./docs/reviews/Review%202/)

---

## 📄 License
This project is licensed under the MIT License.
