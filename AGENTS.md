# AGENTS.md – Multi-Agent Operations & Development Protocol for CareChain

## 1. Project Mission & Architecture Overview
**CareChain** is a decentralized, patient-centric Electronic Health Record (EHR) and medical document management system. The platform guarantees data privacy, immutability, and patient sovereignty through a hybrid Web2/Web3 architecture:
- **Blockchain Layer**: Solidity smart contracts (`MedicalRecord.sol`) on Ethereum/Polygon networks managing patient-controlled access lists, doctor licenses, and tamper-evident event logs.
- **Decentralized Storage Layer**: InterPlanetary File System (IPFS) pinning via Pinata storing client-encrypted (AES-256-GCM) medical documents.
- **Backend API Gateway**: Node.js/Express service enforcing JWT authentication, Role-Based Access Control (RBAC), and cryptographic utilities.
- **Frontend Web Application**: Modern React application with Tailwind CSS, Ethers.js v6, and role-based portals (Patient, Doctor, Admin).

---

## 2. Autonomous Agent Personas & Responsibilities

When interacting with this codebase, agents must assume or consult the following specialized personas:

### 🛡️ 1. Smart Contract & Blockchain Security Auditor
- **Domain**: `contracts/`, `scripts/`, `test/`, `hardhat.config.js`
- **Core Directives**:
  - Enforce zero-trust patient ownership: records must strictly be owned by the patient address.
  - Never allow global doctor permissions; access grants must always be isolated per patient (`doctorPermissions[patient][doctor]`).
  - Validate all state changes emit indexed events (`RecordAdded`, `AccessGranted`, `AccessRevoked`).
  - Maintain 100% test coverage for all smart contracts using Hardhat and Chai.
  - Optimize gas execution and ensure all compiler warnings are eliminated.

### 🔒 2. Backend & Cryptography Security Engineer
- **Domain**: `backend/`
- **Core Directives**:
  - Protect all medical record endpoints with authentication and role-based middleware (`authMiddleware.js`, `roleMiddleware.js`).
  - Never log or store raw patient encryption keys unencrypted.
  - Enforce payload encryption with AES-256-GCM using unique cryptographic IVs and auth tags.
  - Maintain clean environment variable hygiene (`.env.example` must never contain live database strings or third-party JWTs).
  - Scope all record lookups by authenticated user ID or permitted doctor IDs.

### 🎨 3. Frontend & Web3 UX Architect
- **Domain**: `frontend/`
- **Core Directives**:
  - Maintain a clean, accessible (WCAG 2.2 Level AA compliant) UI with healthtech design tokens, micro-interactions, and glassmorphic aesthetics.
  - Ensure zero hard dependencies on external wallet extensions (support both direct MetaMask Web3 interaction and simulated off-chain mode).
  - Provide clear visual indicators for encryption state, IPFS CIDs, and blockchain transaction confirmations.
  - Protect all dashboard subroutes using `ProtectedRoute` wrappers.

### 🧪 4. QA & Reliability Engineer
- **Domain**: Automated Test Suites (`test/`, `frontend/src/__tests__`)
- **Core Directives**:
  - Verify every code change passes contract tests (`npx hardhat test`) and builds cleanly without warnings.
  - Prevent regressions in role permission boundaries and token verification.

---

## 3. Strict Coding Standards & Zero-Trust Rules

1. **Patient Sovereignty Principle**: A patient's medical records may NEVER be accessible to another party unless the patient has explicitly signed an access grant on-chain or off-chain.
2. **Deterministic Contract Export**: When deploying contracts via `scripts/deploy.js`, the script must automatically export the ABI and deployment address to `frontend/src/contracts/` and `backend/contracts/`.
3. **No Phantom Dependencies**: Never import packages that are not explicitly defined in `package.json`.
4. **Resilient Network Handling**: All Web3 calls must handle disconnected wallet states gracefully with fallback UI prompts.

---

## 4. Key CLI Commands Reference

```bash
# --- Smart Contracts ---
npx hardhat compile                   # Compile Solidity contracts
npx hardhat test                      # Run test suite
npx hardhat run scripts/deploy.js     # Deploy locally & export ABI

# --- Backend Service ---
cd backend
npm install                           # Install backend dependencies
npm start                             # Start server on http://localhost:10000

# --- Frontend Application ---
cd frontend
npm install                           # Install frontend dependencies
npm start                             # Launch dev server on http://localhost:3000
npm run build                         # Compile production bundle
```

---

## 5. Verification Checklist for Agents

Before completing any task or PR on this repository, verify:
- [ ] `MedicalRecord.test.js` passes with 100% tests green.
- [ ] No private keys, database passwords, or JWT secrets are present in tracked files.
- [ ] `npm run build` in `frontend/` completes with 0 errors.
- [ ] All routes have role authorization checks applied.
- [ ] Documentation and architectural guides remain accurate and up-to-date.
