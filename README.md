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

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/CareChain.git
cd CareChain

# Install Root (Smart Contract) dependencies
npm install

# Install Backend dependencies
cd backend && npm install && cd ..

# Install Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Smart Contract Testing & Deployment
```bash
# Compile contracts
npx hardhat compile

# Run smart contract unit tests
npx hardhat test

# Deploy to local network & export ABIs to frontend/backend
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Start Backend Gateway
```bash
cd backend
cp .env.example .env
npm start
# Backend runs on http://localhost:10000
```

### 4. Start Frontend Application
```bash
cd frontend
npm start
# Frontend opens at http://localhost:3000
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
