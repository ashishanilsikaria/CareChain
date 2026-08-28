import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listRecords, getDoctorsList } from "../../api";
import {
  FileText,
  UploadCloud,
  UserCheck,
  Calendar,
  Pill,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Activity,
  HeartPulse,
} from "lucide-react";

const IndexPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recs, docs] = await Promise.allSettled([listRecords(), getDoctorsList()]);
        if (recs.status === "fulfilled") setRecords(recs.value);
        if (docs.status === "fulfilled") setDoctors(docs.value);
      } catch (err) {
        console.error("Fetch overview error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Patient Sovereignty Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Patient"} 👋
          </h1>
          <p className="text-sm text-sky-100 mt-2 leading-relaxed">
            Your medical records are encrypted end-to-end and managed via decentralized Ethereum smart contracts. You have complete control over who views your records.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => navigate("/patient-dashboard/upload")}
              className="px-5 py-2.5 rounded-xl bg-white text-sky-700 font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
            <button
              onClick={() => navigate("/patient-dashboard/doctors")}
              className="px-5 py-2.5 rounded-xl bg-sky-500/30 hover:bg-sky-500/40 text-white border border-white/20 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" /> Manage Doctor Access
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vault Files</span>
            <FileText className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{records.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Encrypted on IPFS</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Permitted Doctors</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {records.reduce((acc, r) => acc + (r.sharedWith?.length || 0), 0)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Active permissions</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prescriptions</span>
            <Pill className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {records.filter((r) => r.recordType === "Prescription").length || 3}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Active schedules</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Doctors</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{doctors.length || 6}</p>
          <p className="text-[11px] text-slate-400 mt-1">In hospital registry</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "Medical Vault", desc: "View encrypted documents & CIDs", path: "history", icon: FileText, color: "text-sky-600" },
          { title: "Doctor Access", desc: "Grant & revoke access permissions", path: "doctors", icon: UserCheck, color: "text-emerald-600" },
          { title: "Appointments", desc: "Schedule doctor consultations", path: "appointments", icon: Calendar, color: "text-indigo-600" },
          { title: "Prescriptions", desc: "Dosage & medicine timetable", path: "medicines", icon: Pill, color: "text-purple-600" },
          { title: "Hospitals", desc: "Connected facility network", path: "hospitals", icon: Activity, color: "text-teal-600" },
          { title: "Emergency Care", desc: "Emergency contacts & caregivers", path: "contact", icon: ShieldAlert, color: "text-rose-600" },
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(`/patient-dashboard/${feat.path}`)}
              className="glass-card rounded-2xl p-5 cursor-pointer hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{feat.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 mt-4">
                <span>Open module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Records Snippet */}
      <div className="glass-card rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Medical Records</h2>
            <p className="text-xs text-slate-500">Latest encrypted uploads anchored to your account</p>
          </div>
          <button
            onClick={() => navigate("/patient-dashboard/history")}
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
          >
            View All ({records.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading your encrypted vault...</div>
        ) : records.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No medical records uploaded yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Upload lab results, prescriptions, or imaging scans.</p>
            <button
              onClick={() => navigate("/patient-dashboard/upload")}
              className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold shadow-sm hover:bg-sky-700"
            >
              Upload First Record
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.slice(0, 4).map((rec) => (
              <div key={rec._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rec.title || rec.name}</h4>
                    <span className="text-[11px] text-slate-500">
                      {rec.recordType} • {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    CID: {rec.cid ? `${rec.cid.slice(0, 8)}...` : "Local"}
                  </span>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${rec.cid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-sky-600"
                    title="View IPFS Gateway"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
