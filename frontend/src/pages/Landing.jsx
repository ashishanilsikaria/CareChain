import React from "react";
import { Link } from "react-router-dom";
import RoleCard from "../components/RoleCard";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import {
  Lock,
  Database,
  Activity,
  Building2,
  Stethoscope,
  ArrowRight,
  Cpu,
  Share2,
  Fingerprint,
} from "lucide-react";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const { isWalletConnected, shortAddress, connectWallet } = useWeb3();

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Abstract Background Gradients */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-60 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Live Network Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-sky-200/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-slate-700">
                Ethereum & IPFS Encrypted Medical Protocol
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Sovereign Health Records,{" "}
              <span className="gradient-text">Decentralized & Tamper-Proof.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              CareChain puts patients in complete control of their electronic health data.
              Encrypted with AES-256, pinned to IPFS, and governed by immutable smart contract access permissions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={isAuthenticated ? (user?.role === "doctor" ? "/doctor-dashboard" : user?.role === "admin" ? "/admin-dashboard" : "/patient-dashboard") : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{isAuthenticated ? "Launch Dashboard" : "Create Patient Vault"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={connectWallet}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4 text-sky-600" />
                <span>{isWalletConnected ? `Connected: ${shortAddress}` : "Connect Web3 Wallet"}</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-200/80">
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 text-center">
                <p className="text-2xl font-extrabold text-sky-600">256-bit</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">AES-GCM Encryption</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 text-center">
                <p className="text-2xl font-extrabold text-indigo-600">100%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Patient Owned</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 text-center">
                <p className="text-2xl font-extrabold text-emerald-600">IPFS</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Distributed Storage</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 text-center">
                <p className="text-2xl font-extrabold text-purple-600">Smart</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Contract RBAC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROLE SELECTION SECTION ===== */}
      <section className="py-16 bg-white relative border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tailored Portals for Every Healthcare Participant
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select your role to access specialized medical record management tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Patient Card */}
            <RoleCard
              role="Patient"
              title="Patient Health Vault"
              subtitle="Upload encrypted reports, review diagnostic history, and grant or revoke doctor access on-chain."
              icon={Activity}
              badgeText="Primary User"
              gradient="from-sky-600 to-blue-600"
              accentColor="sky"
              features={[
                "End-to-End encrypted report storage",
                "Granular Doctor Authorization Matrix",
                "Decentralized IPFS CID tracking",
                "Prescription & appointment scheduling",
              ]}
              primaryPath="/patient-dashboard"
              secondaryPath="/register"
            />

            {/* Doctor Card */}
            <RoleCard
              role="Doctor"
              title="Clinical Practitioner"
              subtitle="Review authorized patient health histories, append diagnostic observations, and verify medical reports."
              icon={Stethoscope}
              badgeText="Verified Medical"
              gradient="from-emerald-600 to-teal-600"
              accentColor="emerald"
              features={[
                "Instant lookup of authorized patient records",
                "Verified digital clinical notes upload",
                "Zero-knowledge patient privacy enforcement",
                "Direct prescription issuance",
              ]}
              primaryPath="/doctor-dashboard"
              secondaryPath="/register"
            />

            {/* Admin Card */}
            <RoleCard
              role="Admin"
              title="Hospital & System Authority"
              subtitle="Verify practitioner medical licenses, monitor smart contract activity, and maintain system compliance."
              icon={Building2}
              badgeText="Governance"
              gradient="from-purple-600 to-indigo-600"
              accentColor="purple"
              features={[
                "Doctor license verification & verification toggles",
                "Real-time system telemetry & analytics",
                "Smart contract registry management",
                "HIPAA & GDPR audit trail exports",
              ]}
              primaryPath="/admin-dashboard"
              secondaryPath="/login"
            />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS / ARCHITECTURE ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Protocol Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              How CareChain Protects Your Health Data
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-sky-600" /> Client Encryption
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Medical documents are encrypted with unique AES-256-GCM symmetric keys prior to storage.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" /> IPFS Pinning
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encrypted ciphertexts are distributed across decentralized IPFS nodes, generating immutable CIDs.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" /> Smart Contract RBAC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Ethereum smart contract stores pointers and enforces patient-authorized access rules.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-purple-600" /> Consent Sharing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients grant time-bounded or permanent access to specific practitioner wallet addresses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
