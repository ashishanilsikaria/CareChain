import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { requestNonce } from "../api";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import {
  Activity,
  Stethoscope,
  Building2,
  Wallet,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    sex: "Other",
    bloodGroup: "O+",
    licenseNumber: "",
    specialization: "General Practitioner",
    hospitalName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { account, chainId, connectWallet, signMessage, isConnecting } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    // Identity is the wallet: prompt for it immediately if not connected.
    if (!account) connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("Full name is required.");
      return;
    }
    if (!["patient", "doctor", "admin"].includes(role)) {
      setError("Please choose a valid role.");
      return;
    }

    try {
      setLoading(true);

      // 1. Identity = wallet. Connect if needed.
      let activeAccount = account;
      if (!activeAccount) {
        activeAccount = await connectWallet();
        if (!activeAccount) {
          setError("A Web3 wallet is required to register.");
          return;
        }
      }

      // 2. Fetch the single-use challenge message tied to this wallet.
      const challenge = await requestNonce(activeAccount, chainId);
      if (challenge.registered) {
        setError("This wallet is already registered. Please sign in instead.");
        return;
      }

      // 3. Sign the challenge to prove key ownership (no password).
      const signature = await signMessage(challenge.message);

      // 4. Create the profile.
      const payload = {
        ...formData,
        role,
        walletAddress: activeAccount,
        message: challenge.message,
        signature,
      };

      const res = await register(payload);

      if (role === "doctor") navigate("/doctor-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else navigate("/patient-dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-sky-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create CareChain Identity</h1>
          <p className="text-xs text-slate-500 mt-1">
            Your Ethereum wallet is your identity — sign a message to claim your decentralized medical profile
          </p>
        </div>

        {/* Wallet Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 mb-6">
          <div className="flex items-center gap-2 text-xs">
            <Wallet className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-700">Connected Wallet</span>
          </div>
          {account ? (
            <span className="font-mono text-[11px] text-slate-700">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              disabled={isConnecting}
              className="text-[11px] font-bold text-sky-600 hover:underline disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("patient")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === "patient"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" /> Patient
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("doctor")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === "doctor"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === "admin"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" /> Hospital Admin
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email (optional)</label>
              <input
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>

          {/* Role-Specific Fields */}
          {role === "patient" && (
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="30"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {role === "doctor" && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Medical License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="e.g. MD-982341"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g. Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Affiliated Medical Center</label>
                <input
                  type="text"
                  name="hospitalName"
                  placeholder="e.g. Metropolitan General Hospital"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital / Institution Name *</label>
                <input
                  type="text"
                  name="hospitalName"
                  placeholder="e.g. City Health Authority"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            On submit you&apos;ll sign a free, single-use message. No password is ever created or stored.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !account}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md shadow-sky-500/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading
              ? "Awaiting signature..."
              : account
                ? `Register ${role.charAt(0).toUpperCase() + role.slice(1)} & Sign`
                : "Connect a wallet to register"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{" "}
          <Link to={`/login?role=${role}`} className="font-bold text-sky-600 hover:underline">
            Sign in to your portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
