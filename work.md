# CareChain – Comprehensive Project Overview & Work Guide

> **CareChain** is an enterprise-grade, decentralized, patient-centric Electronic Health Record (EHR) and medical document management platform built on Ethereum/Polygon, IPFS, and modern Web3 technologies.

---

## 1. Executive Summary

Traditional Electronic Health Record (EHR) systems suffer from fragmented architectures, vulnerable centralized databases, opaque audit logs, and an absence of patient sovereignty. Patients routinely lack direct control over who accesses their confidential health records, while hospitals face severe compliance and ransomware risks.

**CareChain solves these problems through a hybrid Web2/Web3 architecture:**
- **Patient Sovereignty**: Access control is enforced by smart contracts on-chain. Records can only be accessed or decrypted if the patient has explicitly signed an access grant.
- **Client-Side/Gateway Cryptography**: Medical files are encrypted with **AES-256-GCM** before leaving the client/gateway. Symmetric keys and authentication tags are decoupled from raw storage.
- **Decentralized Storage**: Encrypted files are stored on the **InterPlanetary File System (IPFS)** via Pinata, producing tamper-proof cryptographic Content Identifiers (CIDs).
- **Passwordless Web3 Authentication**: Users authenticate using their Ethereum wallets via **EIP-191 challenge-response signatures**, completely eliminating password-related attack vectors.
- **Immutable Audit Trails**: Every critical event (`RecordAdded`, `AccessGranted`, `AccessRevoked`, `DoctorVerificationUpdated`) emits indexed blockchain events for auditable compliance.

---

## 2. Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Blockchain / Smart Contracts** | Solidity (`^0.8.20`), Hardhat, Ethers.js (v6), Chai | Access control matrix, doctor licensing verification, event logs |
| **Decentralized Storage** | IPFS, Pinata Gateway & API | Content-addressed storage for encrypted medical files |
| **Backend API Gateway** | Node.js, Express 5, Mongoose 9, Multer, JWT | Middleware authentication, file encryption/decryption, rate limiting |
| **Database & Fallback** | MongoDB Atlas + In-Memory Proxy Store | Metadata storage with automatic fallback for zero-config offline dev |
| **Frontend Web Application** | React 19, React Router 7, Tailwind CSS, Lucide Icons | Responsive glassmorphic UI, role-based dashboards, wallet connection |
| **Cryptography** | AES-256-GCM, SHA-256, EIP-191 personal_sign | Payload confidentiality, integrity authentication tags, signature verification |
| **Package Management** | Bun / npm workspaces | Monorepo package orchestration |

---

## 3. High-Level System Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (React 19 & Ethers v6)"]
        P[Patient Portal]
        D[Doctor Portal]
        A[Admin Console]
        W[Web3 Wallet / MetaMask]
    end

    subgraph Gateway ["Backend Gateway & Cryptography Layer"]
        API[Express API Gateway]
        AUTH[EIP-191 Signature Verifier]
        AES[AES-256-GCM Encrypt/Decrypt Engine]
    end

    subgraph Storage ["Storage & Database Layer"]
        IPFS[Pinata IPFS Gateway (Encrypted Ciphertext)]
        DB[(MongoDB Atlas / In-Memory Store)]
    end

    subgraph Blockchain ["Ethereum / Polygon Amoy / Hardhat"]
        SC[MedicalRecord.sol]
        ACL[doctorPermissions Matrix]
        REG[Doctor Verification Registry]
        EVT[Immutable Event Logs]
    end

    %% Workflows
    P -->|1. Connect & Sign Nonce| AUTH
    AUTH -->|2. Issue JWT| P
    P -->|3. Upload Medical File| API
    API -->|4. Encrypt with AES-256-GCM| AES
    AES -->|5. Pin Ciphertext| IPFS
    API -->|6. Save Metadata & CIDs| DB
    P -->|7. addRecord() Transaction| W
    W -->|8. Execute on-chain| SC
    SC --> ACL
    SC --> REG
    SC --> EVT
    D -->|9. View / Decrypt Record| API
    API -->|10. Check ACL & Stream Decrypted| IPFS
```

---

## 4. Core User Roles & Capabilities

### 🧑‍⚕️ 1. Patient Portal
- **Sovereign Records Vault**: View complete medical history, lab diagnostics, imaging reports, and prescriptions.
- **Zero-Knowledge Upload**: Encrypt medical files (PDF, DICOM, JPG, PNG) with AES-256-GCM and store on IPFS with verified blockchain transaction proofs.
- **Granular Access Delegation**: Select verified physicians from the hospital directory and grant or revoke access in real time.
- **Decrypted Document Retrieval**: Download original decrypted files on demand with verified integrity tags.

### 🩺 2. Doctor / Clinician Portal
- **Shared Patient Records**: View health documents exclusively for patients who have granted explicit cryptographic authorization.
- **Clinical Upload**: Add diagnostic summaries, lab reports, or consultation notes directly to an authorized patient's vault.
- **Practitioner Registry**: Maintain profile metadata (specialization, hospital affiliation, medical license ID) verified by the administrative authority.

### 🏛️ 3. Hospital Admin Portal
- **Medical License Governance**: Review practitioner registrations and grant/revoke verified doctor status on-chain.
- **Network Telemetry**: Real-time overview of total registered patients, clinicians, verified doctors, and encrypted records stored across the network.
- **User Directory**: Searchable, role-filterable management console for system accounts.

---

## 5. Security & Cryptographic Protocol

### 🔑 EIP-191 Challenge-Response Authentication Flow
1. **Nonce Request**: Client calls `POST /auth/nonce` with their Ethereum wallet address.
2. **Challenge Creation**: The server generates a single-use random 256-bit hexadecimal nonce with an issue timestamp.
3. **Wallet Signing**: The user signs the challenge message (`personal_sign`) with their private key in MetaMask.
4. **Key Verification**: The backend extracts the signer using `ethers.verifyMessage()`.
5. **Nonce Rotation**: The nonce is immediately rotated to prevent replay attacks, and a JWT session token is returned.

### 🛡️ AES-256-GCM Document Encryption Flow
1. Gateway generates a cryptographically secure 256-bit symmetric key (`crypto.randomBytes(32)`) and 96-bit initialization vector (`crypto.randomBytes(12)`).
2. The file buffer is encrypted using `aes-256-gcm`, producing ciphertext and a 16-byte authentication tag.
3. The encrypted payload is pinned to IPFS, generating an immutable Content Identifier (CID).
4. On download, access rights are validated before streaming the decrypted buffer, ensuring unencrypted files never touch disk storage.

### ⚖️ Regulatory Alignment
- **HIPAA § 164.312**: Access control (public-key cryptography), transmission security (AES-256-GCM + TLS), and immutable audit controls (on-chain events).
- **GDPR Article 5 & 17**: Special category data protection and crypto-shredding (erasing keys renders ciphertext permanently undecipherable).

---

## 6. Repository Layout & File Guide

```
CareChain/
├── contracts/
│   └── MedicalRecord.sol       # Solidity smart contract (access matrix, doctor verification, event logs)
├── test/
│   └── MedicalRecord.test.js   # Automated Hardhat/Chai test suite (11 unit tests, 100% green)
├── scripts/
│   ├── deploy.js               # Deploys contract and automatically exports ABI/addresses to frontend & backend
│   ├── deploy-and-verify.js    # Hardhat deployment script with automated Block Explorer verification
│   ├── build_presentation.py   # Automated slide deck generation script
│   └── build_review2_report.py # Automated academic review & technical documentation generator
├── backend/
│   ├── server.js               # Express application entrypoint, CORS, rate-limiting, and upload pipeline
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT authentication verification
│   │   └── roleMiddleware.js   # Role-Based Access Control (RBAC) guard
│   ├── models/
│   │   ├── User.js             # User identity schema (wallet address, nonce, role, profile)
│   │   ├── Record.js           # Medical record schema (CIDs, encryption keys, sharedWith list)
│   │   └── WalletChallenge.js  # Short-lived pending nonces for new wallet registrations
│   ├── routes/
│   │   ├── authRoutes.js       # Nonce issuance, registration, and wallet login routes
│   │   ├── recordRoutes.js     # Record retrieval, streaming decrypt download, share & revoke
│   │   └── userRoutes.js       # Doctor directory listing and admin verification toggles
│   ├── utils/
│   │   ├── encrypt.js          # AES-256-GCM buffer encryption and decryption helpers
│   │   ├── memoryStore.js      # Zero-config in-memory mock store with pre-configured demo accounts
│   │   └── pinata.js           # Pinata IPFS pinning service integration
│   └── package.json            # Backend dependencies and run scripts
├── frontend/
│   ├── src/
│   │   ├── App.js              # Route registry and ProtectedRoute role enforcement
│   │   ├── api.js              # Centralized frontend API client
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Authentication provider and user state management
│   │   │   └── Web3Context.jsx # Web3 provider, wallet listener, and EIP-191 signing helper
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar with wallet status and role links
│   │   │   ├── Footer.jsx      # Compliance information and footer links
│   │   │   ├── RoleCard.jsx    # Visual role selector component
│   │   │   └── Upload.jsx      # Encrypted drag-and-drop document upload component
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Marketing landing page with hero, stats, and workflows
│   │   │   ├── Login.jsx       # Passwordless wallet authentication page
│   │   │   ├── Register.jsx    # Profile registration page with role selection
│   │   │   ├── Dashboard.jsx   # Role-based route dispatcher
│   │   │   ├── PatientDashboard/ # Patient portal (Vault, History, Doctors, Prescriptions, Appointments)
│   │   │   ├── DoctorDashboard/  # Clinician portal (Shared files, Diagnostic uploads)
│   │   │   └── AdminDashboard/   # Hospital admin telemetry and practitioner verification console
│   │   └── contracts/
│   │       └── MedicalRecord.json # Synchronized contract ABI and deployed addresses
│   └── package.json            # Frontend dependencies and scripts
├── docs/                       # Architecture, Security, and API specifications
├── hardhat.config.js           # Hardhat config (Solidity 0.8.20, optimizer, Sepolia, Polygon Amoy)
├── AGENTS.md                   # Multi-agent operations protocol and developer guidelines
├── docker-compose.yml          # Container configuration for full-stack deployment
└── package.json                # Monorepo root configuration and concurrent execution scripts
```

---

## 7. Getting Started & Command Reference

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v18+)
- [MetaMask](https://metamask.io/) browser extension

### Step-by-Step Setup

1. **Install All Monorepo Dependencies**:
   ```bash
   bun install
   ```

2. **Compile Smart Contracts**:
   ```bash
   bunx hardhat compile
   ```

3. **Run Smart Contract Unit Tests**:
   ```bash
   bunx hardhat test
   ```
   *(Expected output: 11 passing tests)*

4. **Launch Local Blockchain & Deploy**:
   ```bash
   # Terminal 1: Start local Ethereum node
   bunx hardhat node

   # Terminal 2: Deploy contract to local network
   bun run deploy:local
   ```

5. **Start Full Stack Development Environment**:
   ```bash
   # Runs both backend (:5000) and frontend (:3000) concurrently
   bun run dev
   ```

---

## 8. Pre-Seeded Demo Accounts (Local / Hardhat)

The backend in-memory fallback automatically provisions the following default demo identities matching standard Hardhat test accounts:

| Role | Address | Demo Name | Specialization / Scope |
| :--- | :--- | :--- | :--- |
| **Patient** | `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266` | Demo Patient | Sovereign vault owner |
| **Doctor** | `0x70997970c51812dc3a010c7d01b50e0d17dc79c8` | Demo Doctor | General Medicine (Verified) |
| **Admin** | `0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc` | Demo Admin | Contract Owner / Hospital Authority |

---

## 9. Key API Endpoints Reference

### Authentication (`/auth`)
- `POST /auth/nonce`: Requests a fresh single-use EIP-191 challenge nonce for an address.
- `POST /auth/register`: Creates a profile after validating wallet signature.
- `POST /auth/login`: Verifies signed challenge and issues a JWT token.
- `GET /auth/me`: Retrieves current authenticated user profile.

### Medical Records (`/records` & `/upload`)
- `POST /upload`: Uploads a file, performs AES-256-GCM encryption, and pins to IPFS via Pinata.
- `POST /records/simulate`: Records uploaded IPFS document on immutable ledger.
- `GET /records`: Retrieves records scoped to user role (patient sees own; doctor sees shared).
- `GET /records/:id/download`: Fetches encrypted ciphertext from IPFS, decrypts, and streams file.
- `POST /records/share`: Patient grants doctor access to a single or all records.
- `POST /records/revoke-share`: Patient revokes doctor access.
- `DELETE /records/:id`: Patient deletes a record from their vault.

### Users & Administration (`/users` & `/admin`)
- `GET /users/doctors`: Directory of registered and verified physicians.
- `GET /users/admin/all`: List of all registered network users (Admin only).
- `PATCH /users/admin/verify/:userId`: Approves or revokes medical practitioner credentials.
- `GET /admin/stats`: Telemetry data on users, patients, doctors, and stored records.
