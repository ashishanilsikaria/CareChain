// frontend/src/components/app.jsx (Compatibility Layer)
export * from "../api.js";

export function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
