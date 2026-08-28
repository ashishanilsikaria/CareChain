# CareChain Security & Compliance Specification

## 1. Security Philosophy
CareChain operates under a **Zero-Trust Healthcare Framework**:
- **Patient Sovereignty**: No central entity (hospital, government, insurer, or platform admin) has unilateral decryption authority over patient medical files without explicit patient cryptographic grant.
- **Data Minimization**: Only Content Identifiers (CIDs) and cryptographic verification proofs are stored on the public blockchain. No Protected Health Information (PHI) is ever exposed unencrypted.
- **Immutability & Non-Repudiation**: Access grants and doctor authorizations are recorded on-chain, preventing retroactive alteration or falsification of diagnostic records.

---

## 2. Threat Modeling & Safeguards

| Threat Vector | Potential Impact | CareChain Safeguard |
| :--- | :--- | :--- |
| **Unauthorized Doctor Snooping** | Doctor views unauthorized patient records | Granular smart contract mapping `doctorPermissions[patient][doctor]` prevents unauthorized callers from executing `getPatientRecords`. |
| **IPFS Public Interception** | Malicious actor scrapes IPFS nodes | All IPFS payloads are pre-encrypted with AES-256-GCM prior to network transmission. Raw files cannot be read without symmetric keys. |
| **Tampering with Medical History** | Alteration of diagnostic notes or lab data | IPFS Content Identifiers (CIDs) are cryptographic SHA-256 / Blake2b hashes of the encrypted content. Any bit alteration changes the CID and invalidates the smart contract pointer. |
| **Secret Leaks / Key Exposure** | Sensitive database credentials exposed in git | Environment variable hygiene strictly enforced; `.env.example` contains sanitized placeholders. |
| **Privilege Escalation** | Patient executes admin/doctor routes | Multi-tier RBAC middleware (`roleMiddleware.js`) validates JWT claims and database role checks on every request. |

---

## 3. Regulatory Alignment

### HIPAA (Health Insurance Portability and Accountability Act)
- **Security Rule (§ 164.312)**:
  - *Access Control*: Role-Based Access Control (RBAC) + Ethereum Public Key Cryptography.
  - *Audit Controls*: Immutable blockchain event logs (`RecordAdded`, `AccessGranted`, `AccessRevoked`).
  - *Integrity & Transmission Security*: TLS 1.3 for API communication; AES-256-GCM for off-chain storage.

### GDPR (General Data Protection Regulation)
- **Article 5 (Integrity and Confidentiality)**: Cryptographic protection of special category health data.
- **Article 6 (Consent Management)**: Explicit, granular patient-authorized access that can be revoked on demand.
- **Article 17 (Right to Erasure)**: Encrypted files stored off-chain can have their symmetric decryption keys erased, rendering ciphertext permanently unrecoverable ("crypto-shredding").
