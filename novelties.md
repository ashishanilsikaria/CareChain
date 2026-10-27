# CareChain: Candidate Novelties for Patent Filing

> **Read this first.** The general idea of patient-controlled blockchain EHR with encrypted IPFS storage is already covered by prior patents and papers (see `researchwork.md`). The novelties below are specific technical mechanisms and combinations. Whether any of them is truly novel and non-obvious must be confirmed by a deeper prior-art search and a registered patent attorney or agent. This file is not legal advice.
>
> Items marked **[In current design]** appear in the CareChain project document. Items marked **[Needs to be built]** are additions that would strengthen the application but do not exist in the described system yet. Do not claim a feature in a filing unless it is actually described and enabled in your specification.

---

## 1. Strength Ranking

| # | Novelty | Status | Estimated strength |
| :--- | :--- | :--- | :--- |
| N1 | Dual-gate decrypt-and-stream with live on-chain permission check | In current design | Medium to strong |
| N2 | Verified-practitioner gating of patient delegation | In current design | Medium |
| N3 | On-chain/off-chain permission reconciliation | Needs to be built | Medium to strong |
| N4 | Dual integrity chain (GCM tag plus on-chain CID anchor) | Partly in design | Medium |
| N5 | Crypto-shredding with on-chain erasure proof | Partly in design | Medium |
| N6 | Per-record key wrapping to doctor public keys | Needs to be built | Strong (biggest differentiator) |
| N7 | Read/decrypt event logging, time or count-limited grants, break-glass access | Needs to be built | Medium |
| N8 | Zero-config graceful-degradation mode | In current design | Weak (dependent claim only) |

---

## 2. Detailed Novelties

### N1. Dual-gate decrypt-and-stream with live on-chain permission check [In current design]

**Technical problem:** In many Web3 EHR systems, on-chain permissions and the actual decryption step are loosely coupled, so a compromised or misconfigured server can serve data the chain does not authorize.

**Proposed solution:** On a download request, the gateway (a) authenticates the session token, (b) queries the smart contract for the current doctor-to-record permission, and only if both pass, (c) fetches the ciphertext from IPFS, (d) decrypts it in memory and streams plaintext to the client without ever writing it to disk. The claim is the **ordered binding** of the live on-chain permission check to the decryption step plus the no-persistence streaming.

**Why it may be inventive:** The prior art found in this search describes on-chain access control and encrypted storage separately; this specific enforced ordering with no plaintext persistence was not found. Verify.

**To strengthen:** Make the contract read explicit in the download path (it is currently shown as an "ACL check" in your diagram), and describe failure behavior (chain unreachable, revoked mid-stream).

---

### N2. Verified-practitioner gating of patient delegation [In current design]

**Technical problem:** Patients can grant access to anyone, including unverified or impersonating accounts.

**Proposed solution:** A single contract maintains both a doctor verification registry (set by an administrative authority) and the patient-to-doctor permission matrix. A patient grant is accepted only if the target address is currently verified, and a later revocation of the doctor's verified status automatically blocks further access without any action by each patient.

**Why it may be inventive:** Related "trusted issuer" ideas exist (see US12235984B1), so the claim must be narrowly drawn around the **live coupling of the licence registry to the grant and access check**.

**To strengthen:** Specify whether access enforcement checks verification status at read time, not only at grant time.

---

### N3. On-chain/off-chain permission reconciliation [Needs to be built]

**Technical problem:** Hybrid systems keep permissions on-chain and metadata (such as a `sharedWith` list) in a database. The two can diverge, causing either unauthorized access or lockouts.

**Proposed solution:** A reconciliation service listens to `AccessGranted` and `AccessRevoked` events and updates the off-chain share list, treating the chain as the authoritative source. On divergence, access is denied by default and the discrepancy is logged.

**Why it may be inventive:** It addresses a concrete consistency problem specific to hybrid architectures. Search for similar "event-driven synchronization of access control lists" before filing.

---

### N4. Dual integrity chain [Partly in design]

**Technical problem:** Stored files can be tampered with at either the storage layer or the metadata layer.

**Proposed solution:** On download, two independent checks must pass: (a) the AES-GCM authentication tag verifies the ciphertext, and (b) the CID or hash retrieved matches the value anchored on-chain by the patient-signed record-registration transaction. Failure of either blocks delivery.

**To strengthen:** Describe the binding between the patient's wallet signature, the CID and the record identifier.

---

### N5. Crypto-shredding with on-chain erasure proof [Partly in design]

**Technical problem:** Erasure requests (GDPR Article 17) conflict with immutable storage.

**Proposed solution:** Keys are stored separately from ciphertext. On erasure, the key is destroyed and an on-chain "erasure" event is emitted, giving verifiable evidence that the data became permanently undecipherable.

**Why it may be inventive:** Crypto-shredding alone is a known technique. The claim must rest on the **verifiable on-chain erasure attestation** tied to the specific record.

---

### N6. Per-record key wrapping to doctor public keys [Needs to be built]

**Technical problem:** Today the gateway generates and holds the encryption keys (your `Record` schema stores them), so the gateway can read all plaintext. This also makes the "zero-knowledge" label inaccurate.

**Proposed solution:** The patient's client encrypts each record with a random symmetric key, then wraps that key for each authorized doctor using the doctor's public key. Wrapped keys are stored off-chain with the pointer on-chain. Revocation removes the doctor's wrapped key and permission together.

**Why it matters:** This is the strongest way to differentiate from gateway-key designs, and it gives a true patient-sovereign encryption story. Prior art exists for re-encryption schemes (for example NuCypher-based work), so claims should focus on how wrapping integrates with the verified-practitioner registry (N2) and the on-chain permission matrix.

---

### N7. Read-event logging, limited grants and break-glass access [Needs to be built]

**Possible features:**
- Log every decrypt/read event on-chain (or as a hash commitment), not only grants and revocations.
- Time-bound and access-count-limited grants. Note that time-bound permissions already appear in prior art, so combine with other elements.
- Emergency "break-glass" access with automatic patient notification and a mandatory on-chain record.

---

### N8. Zero-config graceful-degradation mode [In current design]

The in-memory fallback store with pre-seeded accounts mirroring known chain addresses lets the full flow run without a database or chain. This is an engineering convenience with low inventive weight. If mentioned at all, make it a dependent claim or leave it in the description.

---

## 3. Suggested Claim Structure (illustrative only)

An attorney must draft the real claims. The structure below shows how the novelties could fit together.

**Independent claim 1 (system):** A system comprising a smart contract storing (i) a practitioner verification registry and (ii) a permission matrix mapping patient records to practitioner addresses; a gateway configured to, in response to a request from a practitioner for a record, authenticate the practitioner, query the smart contract to confirm that the practitioner is currently verified and holds permission for the record, retrieve a ciphertext from decentralized storage using a content identifier, decrypt the ciphertext in volatile memory, and stream plaintext to the practitioner without persisting the plaintext to non-volatile storage. (N1 + N2)

**Dependent claims:**
- Verification of both a GCM authentication tag and a match of the content identifier against an on-chain anchor. (N4)
- Event-driven synchronization of an off-chain share list with on-chain events, with deny-by-default on divergence. (N3)
- Key wrapping to practitioner public keys with revocation removing the wrapped key and on-chain permission together. (N6)
- Erasure of keys with emission of an on-chain erasure event. (N5)
- On-chain logging of decrypt events, time/count-limited grants, break-glass access. (N7)
- Challenge-response wallet authentication with single-use nonce rotation. (supporting; likely not inventive alone)

**Method and computer-readable medium claims** mirroring the system claim.

---

## 4. Things That Are NOT Novel (do not claim alone)

- Using blockchain for patient-controlled medical record access
- Storing encrypted files on IPFS with the CID on-chain
- AES-256-GCM encryption
- Patient grant and revoke of doctor access
- Immutable audit event logs
- EIP-191 `personal_sign` login with nonce
- Role-based patient/doctor/admin portals
- Time-bounded permissions on their own

---

## 5. Gaps and Risks to Fix Before Filing

1. **"Zero-knowledge upload" wording.** In the current design the gateway sees plaintext and stores keys. Either rename it (gateway-side encryption) or implement N6.
2. **Key storage.** Keys stored in the database next to metadata weaken the security claim. Describe key management (HSM, KMS, wrapping) if you want strong claims.
3. **Chain availability.** Define behavior if the chain or RPC is unreachable (deny by default is recommended).
4. **Technical effect.** For Indian law (Section 3(k)), describe measurable technical improvements such as tamper detection, prevention of unauthorized decryption, consistency between stores, and latency or gas cost, ideally with test data.
5. **Evidence.** Collect experimental results: gas costs, download latency, tamper-detection tests, revocation propagation time. Your 11 passing contract tests are useful supporting data.
6. **Prior disclosure.** Confirm nothing in N1 to N7 has been made public (papers, repositories, slides, demos) before you file.

---

## 6. Filing Checklist

- [ ] Read claims of US12235984B1 and its family; note differences
- [ ] Complete a deeper prior-art search (Google Patents, Espacenet, InPASS, PATENTSCOPE)
- [ ] Decide which novelties to implement (N3, N6, N7 are the main additions)
- [ ] Prepare architecture diagrams, sequence diagrams and a flowchart for each independent claim
- [ ] Gather experimental data
- [ ] Engage a registered patent agent or attorney
- [ ] File a provisional specification to lock the priority date
- [ ] File the complete specification within 12 months
- [ ] Request early publication if you want it published sooner (Form 9 in India)
- [ ] Check institutional IP policy and inventor/applicant details

---

*Working notes for discussion with a patent professional. Not legal advice.*