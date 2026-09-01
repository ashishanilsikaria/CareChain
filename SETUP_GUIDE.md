# 🏥 CareChain — Complete Setup & Run Guide

> **CareChain** is a decentralized, patient-centric Electronic Health Record (EHR) system combining **Ethereum Smart Contracts**, **AES-256-GCM client encryption**, and **IPFS decentralized storage**.

---

## 🛠️ 1. Prerequisites (Install Before Starting)

Ensure the following tools are installed on your machine:

1. **[Node.js (v18 or higher)](https://nodejs.org)** (Includes `npm`)
2. **[Git](https://git-scm.com/)**
3. **[MetaMask Browser Extension](https://metamask.io/)** (Chrome, Brave, Edge, or Firefox)
4. **A MongoDB Connection String**:
   - Free cloud database via **[MongoDB Atlas](https://www.mongodb.com/atlas)** *(Recommended)*
   - *OR* Local MongoDB running on `mongodb://127.0.0.1:27017/carechain`

---

## 📥 2. Clone & Install Dependencies

Open your terminal in the project directory:

```bash
# 1. Install root dependencies (Hardhat, Ethers, Concurrently)
npm install

# 2. Install backend dependencies
cd backend
npm install
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## ⚙️ 3. Environment Variables Configuration

Create a file named **`.env`** in the root folder of the project (`CareChain/.env`) and paste the following:

```env
# MongoDB Database Connection URL (Replace with your Atlas or Local URL)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.0747qrg.mongodb.net/carechain

# JWT Secret for backend authentication
JWT_SECRET=carechain_super_secret_jwt_key_change_in_production_2026

# Pinata IPFS Credentials (Required for real IPFS uploads)
# Get a free JWT from: https://app.pinata.cloud/developers/api-keys
PINATA_JWT=your_pinata_jwt_token_here
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Blockchain Configuration (Pre-configured for local & testnet)
ETHERSCAN_API_KEY=HQMA7A9D479M9UVJT3XBKPJQXN4ZCWSKSB
SEPOLIA_RPC_URL=https://rpc.sepolia.org
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
```

> ⚠️ **Important MongoDB Atlas Note**:
> If using MongoDB Atlas, go to **Network Access** in your Atlas dashboard and click **Add IP Address** → **Allow Access from Anywhere (`0.0.0.0/0`)** so your computer is allowed to connect.

---

## 🚀 4. Compile & Start the Application

Open **3 separate terminal tabs/windows** in the project root:

### **Terminal 1: Local Blockchain Node**
```powershell
# Start local Ethereum blockchain node (runs at http://127.0.0.1:8545)
npx hardhat node
```
*(Leave this terminal running. It generates 20 pre-funded test accounts with 10,000 ETH each).*

---

### **Terminal 2: Deploy Smart Contract & Start Backend**
```powershell
# 1. Compile smart contracts
npm run compile

# 2. Deploy MedicalRecord contract to local node
npm run deploy:local

# 3. Seed demo accounts (Patient, Doctor, Admin)
npm run seed:demo

# 4. Start the backend API server (runs at http://localhost:5000)
npm run start:backend
```

---

### **Terminal 3: Start Frontend Client**
```powershell
# Start the React frontend application
npm run start:frontend
```
*Your browser will automatically open **http://localhost:3000**.*

---

## 🦊 5. MetaMask Setup (One-Time)

To interact with the smart contract via the web UI:

### A. Add the Localhost Network:
1. Open MetaMask → Click the network dropdown (top-left) → **Add Network** → **Add a network manually**.
2. Enter:
   - **Network Name**: `Hardhat Localhost`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
3. Click **Save** and switch to this network.

### B. Import Test Accounts into MetaMask:
Click the **Account dropdown** at top center → **Add account or hardware wallet** → **Import account** → select **Private Key**:

- **Account 0 (Patient)**:
  ```text
  0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```
  *(Rename to `Hardhat Patient`)*

- **Account 1 (Doctor)**:
  ```text
  0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
  ```
  *(Rename to `Hardhat Doctor`)*

---

## 👥 6. Demo Accounts & Credentials

| Role | Email | Password |
|---|---|---|
| **Patient** | `patient@demo.com` | `Demo@1234` |
| **Doctor** | `doctor@demo.com` | `Demo@1234` |
| **Admin** | `admin@demo.com` | `Demo@1234` |

---

## 🧪 7. Live Demo Walkthrough (End-to-End Test)

### Step 1: Patient Actions (Window 1)
1. Open `http://localhost:3000` and log in as `patient@demo.com` / `Demo@1234`.
2. Connect MetaMask with **`Hardhat Patient`** account.
3. Click **Upload Document**, choose any PDF/Image, and click **Submit**.  
   *(The document is encrypted with AES-256-GCM, pinned to IPFS, and logged on the blockchain).*
4. In **Records / History**, click **Share** next to the record and choose **`Demo Doctor`**.

### Step 2: Doctor Actions (Incognito / Window 2)
1. Open an **Incognito / Private Window** at `http://localhost:3000`.
2. Log in as `doctor@demo.com` / `Demo@1234`.
3. Connect MetaMask with **`Hardhat Doctor`** account.
4. Go to **Patient Records** tab → You will see the shared record.
5. Click **`Decrypt & View`** to decrypt and view the clean document!
6. Click **`Raw IPFS`** to see that the public IPFS file is 100% encrypted ciphertext.

### Step 3: Revoke Access (Window 1)
1. Return to the Patient window and click **Revoke Access** on that doctor.
2. Refresh the Doctor window → Access is instantly denied on-chain!

---

## 🐛 Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `Port 8545 / 5000 / 3000 in use` | Old background node process | Run `taskkill /IM node.exe /F` (Windows) or `killall node` (Mac/Linux). |
| `Could not connect to any servers in your MongoDB Atlas cluster` | IP not whitelisted on Atlas | Go to MongoDB Atlas → **Network Access** → Add `0.0.0.0/0`. |
| `Contract not deployed` | Smart contract address mismatch | Run `npm run deploy:local` while `npx hardhat node` is active. |
| `Nonce too high / Transaction error` | MetaMask nonce desync | In MetaMask: Settings → Advanced → **Clear activity tab data**. |
