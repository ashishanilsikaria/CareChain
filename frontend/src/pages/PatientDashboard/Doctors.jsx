import React, { useEffect, useState } from "react";
import { getDoctorsList, shareRecordWithDoctor, revokeRecordDoctorAccess } from "../../api";
import {
  Stethoscope,
  Search,
  ShieldCheck,
  Building2,
  Share2,
  UserX,
  Wallet,
} from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionStatus, setActionStatus] = useState({});

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const docs = await getDoctorsList();
      setDoctors(docs);
    } catch (err) {
      console.error("Fetch doctors error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleGrantFullAccess = async (doctor) => {
    try {
      setActionStatus((prev) => ({ ...prev, [doctor._id]: "Granting..." }));
      await shareRecordWithDoctor({
        doctorId: doctor._id,
        doctorAddress: doctor.walletAddress,
      });
      await fetchDoctors();
      setActionStatus((prev) => ({ ...prev, [doctor._id]: "Access Granted ✅" }));
      setTimeout(() => {
        setActionStatus((prev) => ({ ...prev, [doctor._id]: null }));
      }, 2500);
    } catch (err) {
      alert("Failed to grant access: " + err.message);
      setActionStatus((prev) => ({ ...prev, [doctor._id]: null }));
    }
  };

  const handleRevokeFullAccess = async (doctor) => {
    try {
      setActionStatus((prev) => ({ ...prev, [doctor._id]: "Revoking..." }));
      await revokeRecordDoctorAccess({
        doctorId: doctor._id,
        doctorAddress: doctor.walletAddress,
      });
      await fetchDoctors();
      setActionStatus((prev) => ({ ...prev, [doctor._id]: "Revoked ❌" }));
      setTimeout(() => {
        setActionStatus((prev) => ({ ...prev, [doctor._id]: null }));
      }, 2500);
    } catch (err) {
      alert("Failed to revoke access: " + err.message);
      setActionStatus((prev) => ({ ...prev, [doctor._id]: null }));
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.hospitalName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Doctor Directory & Access Control
          </h1>
          <p className="text-xs text-slate-500">
            Search verified healthcare practitioners and grant or revoke access to your health record vault
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by doctor or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
          />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading registered doctors...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No doctors found</h3>
          <p className="text-xs text-slate-400 mt-1">Try another search or invite your practitioner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  {doc.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Pending
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                <p className="text-xs font-semibold text-sky-700 mt-0.5">
                  {doc.specialization || "General Medicine"}
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.hospitalName || "General Healthcare Facility"}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {doc.walletAddress
                        ? `${doc.walletAddress.slice(0, 8)}...${doc.walletAddress.slice(-4)}`
                        : "Off-chain ID"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleGrantFullAccess(doc)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{actionStatus[doc._id] || "Grant Vault Access"}</span>
                </button>
                <button
                  onClick={() => handleRevokeFullAccess(doc)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                  title="Revoke all access"
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
