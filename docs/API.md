# CareChain REST API Reference

Base URL: `http://localhost:10000` (or configured `PORT`)

All protected routes require a Bearer token in the request header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
Register a new patient, doctor, or hospital admin.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123",
    "role": "patient",
    "walletAddress": "0x71C...438",
    "phone": "+1 (555) 123-4567",
    "age": 30,
    "sex": "Female"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "66ce...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "patient",
      "walletAddress": "0x71c...438"
    }
  }
  ```

### `POST /auth/login`
Authenticate existing user and obtain session JWT.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { ... }
  }
  ```

### `GET /auth/me`
Retrieve authenticated user profile. Requires Bearer token.

### `PATCH /auth/wallet`
Link or update user's Ethereum wallet address.

---

## 2. Medical Record Endpoints (`/records`)

### `GET /records`
Retrieve medical records scoped by the caller's role:
- **Patient**: Returns all personal encrypted records.
- **Doctor**: Returns all records explicitly shared by patients.
- **Admin**: Returns network audit logs.

### `POST /upload` (Multipart Form)
Encrypts file with AES-256-GCM and pins payload to IPFS.
- **Form Data**:
  - `file`: Binary file (PDF, PNG, JPG, DICOM)
  - `title`: Record title
  - `recordType`: `General | Diagnostic | Prescription | LabReport | Radiology | Surgery`
  - `note`: Clinical observation
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "cid": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    "gateway": "https://gateway.pinata.cloud/ipfs/QmXoy...",
    "id": "66ce..."
  }
  ```

### `POST /records/simulate`
Registers cryptographic proof and transaction hash on immutable ledger.

### `POST /records/share`
Grants a specific doctor access to patient records.
- **Request Body**:
  ```json
  {
    "doctorId": "66cf...",
    "recordId": "66ce..."
  }
  ```

### `POST /records/revoke-share`
Revokes doctor access to specified record or vault.

---

## 3. Directory & Admin Endpoints (`/users`)

### `GET /users/doctors`
Fetch directory of registered and verified healthcare practitioners.

### `GET /users/admin/all`
(Admin Only) List all registered platform users.

### `PATCH /users/admin/verify/:userId`
(Admin Only) Approve or revoke doctor license verification.
