// frontend/src/api.js
const API_BASE =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "http://localhost:5000");

export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- Auth APIs (wallet-signature based) ----------

// Ask the server for a single-use challenge message to sign with the wallet.
// `registered` tells the caller whether to sign in or register.
export async function requestNonce(walletAddress, chainId) {
  const res = await fetch(`${API_BASE}/auth/nonce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, chainId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to request sign-in challenge");
  return data; // { success, registered, nonce, message }
}

// Prove key ownership: send back the exact signed message + signature.
export async function loginWithWallet({ walletAddress, message, signature }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, message, signature }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  if (data.token) localStorage.setItem("token", data.token);
  return data;
}

export async function registerWithWallet(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  if (data.token) localStorage.setItem("token", data.token);
  return data;
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
  return data.user;
}

// ---------- Record APIs ----------
export async function uploadEncryptedFile(file, metadata = {}) {
  const form = new FormData();
  form.append("file", file);
  if (metadata.title) form.append("title", metadata.title);
  if (metadata.recordType) form.append("recordType", metadata.recordType);
  if (metadata.note) form.append("note", metadata.note);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
}

export async function simulateBlockchainRecord(payload) {
  const res = await fetch(`${API_BASE}/records/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Simulation failed");
  return data;
}

export async function listRecords() {
  const res = await fetch(`${API_BASE}/records`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch records");
  return data.records || [];
}

export async function shareRecordWithDoctor(payload) {
  const res = await fetch(`${API_BASE}/records/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to share access");
  return data;
}

export async function revokeRecordDoctorAccess(payload) {
  const res = await fetch(`${API_BASE}/records/revoke-share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to revoke access");
  return data;
}

export async function deletePatientRecord(recordId) {
  const res = await fetch(`${API_BASE}/records/${recordId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete record");
  return data;
}

// ---------- User & Doctor APIs ----------
export async function getDoctorsList() {
  const res = await fetch(`${API_BASE}/users/doctors`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch doctors");
  return data.doctors || [];
}

export async function getAdminAllUsers() {
  const res = await fetch(`${API_BASE}/users/admin/all`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch users");
  return data.users || [];
}

export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { ...getAuthHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch stats");
  return data.stats || {};
}

export async function toggleUserVerification(userId, isVerified) {
  const res = await fetch(`${API_BASE}/users/admin/verify/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ isVerified }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update verification");
  return data;
}

export async function downloadDecryptedRecord(recordId, filename) {
  const res = await fetch(`${API_BASE}/records/${recordId}/download`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to download decrypted record");
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "medical-record";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

