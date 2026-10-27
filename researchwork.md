# CareChain: Prior Art Research Work

> **Purpose:** Preliminary prior-art landscape for a patent application on CareChain, a patient-centric, blockchain-based EHR and medical document management platform (Ethereum/Polygon, IPFS, AES-256-GCM, EIP-191 wallet authentication).
>
> **Date of research:** 21 October 2026
>
> **Important:** This is a preliminary, informal search, not a formal patentability or freedom-to-operate opinion. Patent numbers, legal status, claims and assignees must be verified on Google Patents, Espacenet, WIPO PATENTSCOPE and the Indian Patent Office (InPASS) before relying on them. Consult a registered patent attorney or agent before filing.

---

## 1. Summary of Findings

The general concept of CareChain is **already heavily covered** by prior patents and academic literature:

- Patient-controlled access to medical records via smart contracts
- Encrypted files stored off-chain (IPFS or cloud) with hashes or CIDs on-chain
- Grant and revoke of doctor access
- Immutable audit logs of access events
- Role-based users (patient, doctor, admin)

A claim to the concept as a whole would very likely be rejected for lack of novelty or inventive step. Any patent must therefore focus on **specific technical mechanisms and their combination** (see `novelties.md`).

---

## 2. Search Method

Searches were run on Google Patents, the USPTO public search PDF server, arXiv, PubMed Central and other publication sources, using combinations of these keywords:

- blockchain electronic health record patient access control
- smart contract medical records IPFS encrypted
- patient grants doctor access revoke blockchain
- healthcare provider credential / licence verification blockchain
- patient consent management smart contract audit log

Relevant classification codes observed on the results:

| CPC Code | Meaning |
| :--- | :--- |
| G16H 10/60 | ICT for patient-specific data, e.g. electronic patient records |
| G06F 21/62 | Protecting access to data via a platform (keys or access control rules) |
| G06F 21/6218 | Protecting access to a system of files or objects (e.g. medical) |

Use these codes for any further classification-based searching.

---

## 3. Patent Prior Art (9 documents)

### 3.1 US11244059B2: Blockchain for managing access to medical data
- **Link:** https://patents.google.com/patent/US11244059
- **Assignee shown:** Merative US L.P. (after assignment)
- **Summary:** A system for managing access to sensitive medical information using a blockchain (a type of distributed ledger).
- **Overlap with CareChain:** Blockchain-controlled access to medical data. This is the broadest ancestor of the access-control concept.
- **Possible differentiation:** Gateway-side decrypt-and-stream gated by a live on-chain permission check; verified-practitioner gating (see novelties).

### 3.2 US11777940B2: Storing and accessing medical datasets on the blockchain
- **Link:** https://patents.google.com/patent/US11777940
- **Summary:** A method that sets up a microservice holding a medical dataset in encrypted form, with access logic based on accessing-entity information that grants access when access conditions are met.
- **Overlap with CareChain:** Encrypted medical data plus conditional access logic.
- **Possible differentiation:** CareChain's permission model is a contract-level doctor-to-record matrix tied to a licence registry, not per-dataset microservices.

### 3.3 US12272432B2: Blockchain-based distribution of medical data records
- **Link:** https://patents.google.com/patent/US12272432
- **Summary:** Regulates access to medical data records so that only entities authorized by the relevant patient can access them; also contemplates compensation for the patient.
- **Overlap with CareChain:** Patient-authorized access to records held across institutions.
- **Possible differentiation:** CareChain has no compensation or marketplace element; focus on the cryptographic and verification mechanisms.

### 3.4 US12292997B2: Inter-hospital electronic medical record access authentication protocol based on blockchains
- **Link:** https://patents.google.com/patent/US12292997
- **Summary:** An access authentication protocol for EMRs between hospitals, involving patient, doctor and medical server entities.
- **Overlap with CareChain:** Doctor and patient authentication for record access using blockchain.
- **Possible differentiation:** CareChain uses EIP-191 wallet challenge-response with single-use nonce rotation and JWT sessions rather than an inter-hospital protocol.

### 3.5 US12235984B1: Patient-empowered data management: a secure blockchain architecture with decentralized ownership (CLOSEST PRIOR ART)
- **Link:** https://patents.google.com/patent/US12235984
- **Related filings:** US20250265365A1; WO2025250373A1 (PCT)
- **Summary:** Smart contracts control access; patients can revoke permissions at any time, with revocation time and revoking patient permanently recorded on-chain; includes an immutable audit trail and "trusted issuer" healthcare providers.
- **Overlap with CareChain:** Revocation, immutable audit trail, trusted provider concept. This is the document to read most carefully, claim by claim.
- **Possible differentiation:** Dual-gate decrypt-and-stream, on-chain/off-chain reconciliation, ciphertext integrity chain, key-wrapping design (if implemented).

### 3.5a Related note on 3.5
Its continuation and PCT family members may contain broader or narrower claims. Review all family members.

### 3.6 CN112863629B: Blockchain-based medical electronic medical record distributed management system
- **Link:** https://patents.google.com/patent/CN112863629B/en
- **Summary:** An IPFS cloud storage system, access front end, local encrypted storage for backup, and a blockchain recording interactions and managing IPFS node information; access permissions are attribute-level.
- **Overlap with CareChain:** Blockchain plus IPFS plus encryption for medical records.
- **Possible differentiation:** Different encryption architecture and permission model (contract-level doctor-to-record matrix).

### 3.7 CN109934012A: Secure storage and access method of medical records based on blockchain network
- **Link:** https://patents.google.com/patent/CN109934012A/en
- **Summary:** An EMR storage and management framework on blockchain addressing secure storage, real-time upload, access control and cross-domain download.
- **Overlap with CareChain:** General secure storage and access of EMR on blockchain.
- **Possible differentiation:** As above.

### 3.8 US11837344B2: Systems and methods for securely storing patient information and providing access thereto
- **Link:** https://patents.google.com/patent/US11837344
- **Summary:** Patient information (questionnaire responses, derived scores) is packaged for storage on a blockchain or distributed ledger and access is provided.
- **Overlap with CareChain:** Patient data stored via blockchain. Peripheral prior art.

### 3.9 US10510441B2: Distributed systems for secure storage and retrieval of encrypted biological specimen data
- **Link:** https://patents.google.com/patent/US10510441
- **Family:** US11429938B2; US20230015147A1
- **Summary:** Blockchains in peer-to-peer networks for storage and retrieval of encrypted data relating to biological specimens.
- **Overlap with CareChain:** Encrypted data on a distributed network. Peripheral prior art.

---

## 4. Non-Patent Literature (also counts as prior art)

| # | Title / Source | Link | Relevance |
| :--- | :--- | :--- | :--- |
| 1 | A Patient-Centric Blockchain Framework for Secure EHR Management: Decoupling Data Storage from Access Control (arXiv 2511.17464) | https://arxiv.org/abs/2511.17464 | Off-chain encrypted storage; on-chain patient-signed, time-bounded permissions (EIP-712); revocation; event-log auditability; one contract per patient |
| 2 | Blockchain-Based Access Control Scheme for Secure Shared PHRs over Decentralised Storage (PMC8038200) | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8038200/ | IPFS storage with encrypted PHRs and smart-contract attribute-based searchable encryption |
| 3 | Patient Health Records Sharing using Ethereum smart contracts, IPFS and NuCypher (NSF PAR 10303705) | https://par.nsf.gov/servlets/purl/10303705 | Ethereum access control, IPFS, NuCypher re-encryption, time-based policies |
| 4 | Blockchain inspired secure and reliable data exchange architecture for cyber-physical healthcare system 4.0 (arXiv 2307.13603) | https://arxiv.org/abs/2307.13603 | AES-256 encryption, IPFS storage, CID on blockchain, patient grant and revoke to doctor |
| 5 | MediChain: A Secure Decentralized Medical Data Asset Management System (arXiv 1901.10645) | https://arxiv.org/abs/1901.10645 | Blockchain access control module, off-chain storage, hash of URI on-chain (authors describe it as patent-pending) |
| 6 | Blockchain-Based Framework for Privacy Preservation and Securing EHR with Patient-Centric Access Control, Acta Informatica Pragensia 13(1), 2024 | https://doi.org/10.18267/j.aip.225 | IPFS with hybrid encryption and smart-contract patient-centric access control |
| 7 | A Secure and Interoperable Architecture for EHR Access Control and Sharing (arXiv 2602.20830) | https://arxiv.org/abs/2602.20830 | Private blockchain plus IPFS with patient-only control, GDPR alignment |
| 8 | Healthcare Policy Compliance: A Blockchain Smart Contract-Based Approach (arXiv 2312.10214) | https://arxiv.org/abs/2312.10214 | Consent smart contracts, conditional and access-frequency-limited consent |

---

## 5. Feature-by-Feature Overlap Matrix

| CareChain feature | Covered by prior art? | Evidence |
| :--- | :--- | :--- |
| Smart-contract patient-controlled access | Yes (heavily) | 3.1, 3.3, 3.5; NPL 1, 3, 6, 7 |
| Encrypted files on IPFS with CID on-chain | Yes (heavily) | 3.6; NPL 2, 4, 5 |
| AES-256-GCM / AES-256 symmetric encryption | Yes | NPL 4; common practice |
| Patient grant and revoke | Yes | 3.5; NPL 1, 4 |
| Immutable on-chain audit events | Yes | 3.5; NPL 1 |
| Time-bounded permissions | Yes | NPL 1, 3, 8 |
| EIP-191 / signature-based wallet login | Likely common | Standard practice; verify |
| Role-based portals (patient/doctor/admin) | Common | General |
| Doctor licence verification on-chain | Partially | "Trusted issuer" in 3.5; verify claims |
| Crypto-shredding for GDPR Art. 17 | Known technique | General literature |
| Gateway decrypt-and-stream gated by live on-chain check, no disk persistence | Not found in this search | Needs deeper search |
| Verified-practitioner status gating the patient's share list in one contract | Not found in this exact form | Needs deeper search |
| On-chain/off-chain permission reconciliation | Not found in this exact form | Needs deeper search |
| Dual integrity chain (GCM tag plus on-chain CID anchor) | Not found in this exact form | Needs deeper search |

"Not found" only means not found in this limited search. It does not mean novel.

---

## 6. Recommended Next Steps

1. Read the full claims of **US12235984B1** and its family (US20250265365A1, WO2025250373A1) and check whether any claim covers your core flow.
2. Run a deeper search on Google Patents, Espacenet and InPASS using the CPC codes above and keywords such as "decrypt", "stream", "verified practitioner", "licence registry", "reconcile", "permission synchronization".
3. Search citing and cited-by references of each patent in Section 3 (forward and backward citations).
4. Search non-English filings, especially Chinese, Korean and Indian applications.
5. Consider a professional prior-art search service or a patent attorney's search report.
6. Do **not** publicly disclose new details (papers, GitHub, presentations, demos) before filing. Your repository includes presentation and report generators, so check whether any earlier public disclosure already exists.

---

## 7. Indian Filing Notes (applicant based in India)

- **Section 3(k), Patents Act, 1970:** "computer programme per se" and mere algorithms are not patentable. Draft claims around the technical system and the technical effect (security, integrity, access enforcement), not just software logic.
- A **provisional specification** secures an early priority date; the complete specification must follow within 12 months.
- Applications are published after 18 months by default; **early publication** can be requested (Form 9).
- Check whether your institution has an IP cell or policy that affects ownership and filing.
- Confirm current forms, fees and timelines with the Indian Patent Office or a registered patent agent.

---

*Prepared as working notes for discussion with a patent professional. Not legal advice.*