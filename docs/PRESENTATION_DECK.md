# CareChain — Executive Presentation Deck
**Decentralized, Patient-Centric Electronic Health Record (EHR) Protocol**

---

## Institutional, Student & Project Metadata

| Attribute | Details |
| :--- | :--- |
| **Project Title** | **CareChain** |
| **Student Name** | **Ashish Anil Sikaria** |
| **Register Number** | **23BCI0218** |
| **Course** | **BCSE497J - Project - I** |
| **Semester** | **Fall Semester 2026-27** |
| **Course Option / Duration** | Regular • 6 (Months) |
| **Project Option** | General |
| **Registration Status** | Registered and Approved by Guide |
| **Faculty Guide Name** | **Prof. SELVI M** |
| **Guide Designation** | Associate Professor Grade 2 |
| **Guide Employee ID** | 16106 |
| **School / Department** | **SCOPE (School of Computer Science and Engineering)** |

---

## Slide 1: Title & Academic Project Profile
### CareChain: Sovereign Health Records, Decentralized & Tamper-Proof
- **Student**: **Ashish Anil Sikaria** (Reg No: **23BCI0218**)
- **Course**: **BCSE497J - Project - I** | **Semester**: **Fall Semester 2026-27**
- **Faculty Guide**: **Prof. SELVI M** (Emp ID: **16106**, Associate Professor Grade 2, **SCOPE**)
- **School**: School of Computer Science and Engineering (SCOPE)
- **Status**: Registered and Approved by Guide • Regular (6 Months)
- **Keywords**: Web3 Healthtech, Zero-Trust Architecture, Patient Sovereignty, IPFS, Smart Contract RBAC.

---

## Slide 2: Academic & Institutional Framework
### Project Profile & Governance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PROJECT TITLE: CareChain                                                   │
│  STUDENT: Ashish Anil Sikaria (Register No: 23BCI0218)                      │
│  COURSE: BCSE497J - Project - I | SEMESTER: Fall Semester 2026-27           │
│  DURATION: 6 Months (Regular) | PROJECT OPTION: General                     │
│  SCHOOL: SCOPE (School of Computer Science and Engineering)                 │
│  REGISTRATION STATUS: Registered and Approved by Guide                      │
│  FACULTY GUIDE: Prof. SELVI M [Emp ID: 16106, Associate Professor Grade 2]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Slide 3: The Critical Problem in Modern Healthcare
### The Crisis of Centralized Electronic Health Records (EHRs)
1. **Rampant Data Breaches**: Over 133 million healthcare records breached in 2023–2025 alone due to centralized hospital server vulnerabilities.
2. **Zero Patient Sovereignty**: Patient health data is commoditized and shared across insurance brokers without explicit patient consent.
3. **Data Silos & Fragmented Care**: Lack of interoperability leads to missing medical histories during critical emergency care.
4. **Retroactive Tampering**: Centralized databases lack cryptographic immutability, enabling unauthorized alterations of diagnostic records.

---

## Slide 4: The CareChain Solution
### A Hybrid Web2/Web3 Zero-Trust Healthcare Architecture
- **Cryptographic Encryption**: Client-side AES-256-GCM symmetric encryption before files ever leave the browser.
- **Decentralized Storage**: Encrypted payloads pinned to IPFS nodes, generating immutable Content Identifiers (CIDs).
- **On-Chain Access Matrix**: Granular patient-controlled access lists (`doctorPermissions[patient][doctor]`) executed by Solidity smart contracts.
- **Multi-Role Experience**: Tailored, accessible portals for **Patients**, **Licensed Doctors**, and **Hospital Governance Administrators**.

---

## Slide 5: System Architecture & Technical Flow
### End-to-End Cryptographic Lifecycle
```
[ Patient Client ] ──(AES-256-GCM)──> [ Encrypted Payload ] ──> [ IPFS Network (Pinata CID) ]
         │                                                                   │
         └──(Sign Web3 Tx)──> [ MedicalRecord.sol ] <────────────────────────┘
                                      │
                         [ Granular RBAC Permissions ]
                                      │
                     [ Authorized Doctor Decryption ]
```
- **Symmetric Key Isolation**: Unique IV (12-byte) and authentication tag (16-byte) generated per document.
- **Zero-Knowledge Privacy**: No Protected Health Information (PHI) is ever exposed on the public blockchain ledger.

---

## Slide 6: UN Sustainable Development Goals (SDGs) Alignment
### How CareChain Accelerates Global Impact

| UN SDG | Target | CareChain Contribution |
| :--- | :--- | :--- |
| **SDG 3: Good Health & Well-Being** | **Target 3.8**: Achieve universal health coverage and access to quality essential healthcare services | Provides portable, tamper-proof medical history across hospitals and cross-border consultations, reducing diagnostic errors and duplicate procedures. |
| **SDG 9: Industry, Innovation & Infrastructure** | **Target 9.5**: Enhance scientific research & upgrade technological capabilities | Replaces legacy, vulnerable health silos with resilient decentralized infrastructure combining cryptographic ledger security with IPFS. |
| **SDG 10: Reduced Inequalities** | **Target 10.2**: Empower and promote social, economic, and political inclusion for all | Democratizes health data ownership regardless of socioeconomic background, ensuring patients own their medical records rather than corporations. |
| **SDG 16: Peace, Justice & Strong Institutions** | **Target 16.6**: Develop effective, accountable, and transparent institutions | Implements immutable audit trails on-chain for medical approvals and doctor licensing, eliminating fraudulent malpractice and unauthorized data sales. |

---

## Slide 7: Technology Readiness Level (TRL) Assessment
### Current Status: **TRL 6 (Demonstration in Relevant Environment)**

```
[ TRL 1-3: Research ] ──> [ TRL 4-5: Lab Validation ] ──> [ ★ TRL 6: Working Prototype ★ ] ──> [ TRL 7-9: Clinical Deployment ]
```

### Current Achievements (TRL 6 Verified):
- ✅ **Smart Contracts Deployed & Tested**: `MedicalRecord.sol` with 100% automated test coverage (11/11 Hardhat unit tests passing).
- ✅ **Cryptographic Pipeline Active**: AES-256-GCM symmetric buffer encryption and IPFS gateway pinning functional.
- ✅ **Full-Stack Integrated Prototype**: Complete role-based portals for Patients, Practitioners, and Hospital Admins with MetaMask wallet syncing.
- ✅ **Enterprise Codebase**: Monorepo with CI/CD automation, Docker multi-container support, and strict RBAC middleware.

### Roadmap to TRL 9 (Commercial & Clinical Production):
1. **TRL 7 (Operational Environment Demonstration)**: Multi-hospital sandbox pilot with HL7 FHIR structured data integration and gasless Account Abstraction (ERC-4337).
2. **TRL 8 (System Complete & Qualified)**: Formal smart contract security audits by CertiK/OpenZeppelin and HIPAA/GDPR third-party certification.
3. **TRL 9 (Full Clinical Deployment)**: Live mainnet deployment across participating healthcare hospital networks and insurance validation nodes.

---

## Slide 8: Cutting-Edge Innovations & Differentiators
### Moving Beyond Generic Student Projects
1. **"Break-Glass" Emergency Override Protocol**: Time-delayed cryptographic challenges with trusted guardian approvals for unconscious trauma patients.
2. **Zero-Knowledge (ZK) Health Claims**: zk-SNARK circuits allowing patients to prove age, lab threshold, or vaccination status without revealing raw medical files.
3. **Account Abstraction & WebAuthn Passkeys**: Biometric (FaceID/TouchID) signing with zero gas token friction for doctors and patients.
4. **Soulbound Tokens (ERC-5192) for Medical Licenses**: Non-transferable on-chain credentials issued by state medical boards.

---

## Slide 9: Business Model & Healthcare Ecosystem Impact
### Value Proposition Across Stakeholders
- **For Patients**: Total ownership, zero data exploitation, instant portability.
- **For Healthcare Providers**: Reduced malpractice liability, instant verified medical history, HIPAA-compliant sharing.
- **For Medical Researchers**: Opt-in privacy-preserving Compute-to-Data research pools with automated patient micro-incentives.
- **For Insurers**: Tamper-proof claims verification with verifiable cryptographic audit logs.

---

## Slide 10: Conclusion & Project Governance
### CareChain: Setting the Standard for Web3 Healthcare
- **Student**: **Ashish Anil Sikaria** (Reg No: **23BCI0218**)
- **Course**: **BCSE497J - Project - I** | **Semester**: **Fall Semester 2026-27**
- **Faculty Guide**: **Prof. SELVI M** (Emp ID: **16106**, Associate Professor Grade 2, **SCOPE**)
- **Status**: Registered and Approved by Guide
- **Live Demo**: Fully functional web application with Web3 MetaMask connectivity.
- **Open-Source Repository**: Enterprise monorepo with CI/CD, documentation, and automated tests.
- **Contact & Links**: [Documentation](file:///e:/dev/Project%201/MediBlock/docs/ARCHITECTURE.md) | [Security Guide](file:///e:/dev/Project%201/MediBlock/docs/SECURITY.md)
