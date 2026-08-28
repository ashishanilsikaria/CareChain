import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../api";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import {
  Activity,
  Stethoscope,
  Building2,
  Wallet,
  AlertCircle,
} from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    sex: "Other",
    bloodGroup: "O+",
    licenseNumber: "",
    specialization: "General Practitioner",
    hospitalName: "",
    walletAddress: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
  };

  const handleFillWallet = async () => {
    if (account) {
      setFormData((prev) => ({ ...prev, walletAddress: account }));
    } else {
      const active = await connectWallet();
      if (active) {
        setFormData((prev) => ({ ...prev, walletAddress: active }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        role,
        walletAddress: formData.walletAddress || account || undefined,
      };

      const res = await registerUser(payload);
      login(res.token, res.user);

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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create CareChain Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your profile type to register your decentralized medical identity
          </p>
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
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                required
              />
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

          {/* Web3 Wallet Association (Optional) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Ethereum Wallet Address (Optional)</label>
              <button
                type="button"
                onClick={handleFillWallet}
                className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <Wallet className="w-3 h-3" /> Auto-fill MetaMask
              </button>
            </div>
            <input
              type="text"
              name="walletAddress"
              placeholder="0x71C... (for on-chain signing)"
              value={formData.walletAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white font-mono text-[11px]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md shadow-sky-500/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "Creating Sovereign Profile..." : `Complete ${role.toUpperCase()} Registration`}
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
