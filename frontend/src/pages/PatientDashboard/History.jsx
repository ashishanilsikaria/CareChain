import React, { useEffect, useState } from "react";
import { listRecords, getDoctorsList, shareRecordWithDoctor, revokeRecordDoctorAccess, downloadDecryptedRecord } from "../../api";
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Share2,
  Download,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";

const History = () => {
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");
  const [shareError, setShareError] = useState("");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [recs, docs] = await Promise.allSettled([listRecords(), getDoctorsList()]);
      if (recs.status === "fulfilled") setRecords(recs.value);
      if (docs.status === "fulfilled") setDoctors(docs.value);
    } catch (err) {
      console.error("Fetch records error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleOpenShare = (record) => {
    setSelectedRecord(record);
    setSelectedDoctorId(doctors[0]?._id || "");
    setShareSuccess("");
    setShareError("");
    setShareModalOpen(true);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setShareError("Please select a doctor to share with.");
      return;
    }

    try {
      setShareError("");
      await shareRecordWithDoctor({
        doctorId: selectedDoctorId,
        recordId: selectedRecord?._id,
      });
      setShareSuccess("Access granted to doctor successfully!");
      fetchRecords();
      setTimeout(() => {
        setShareModalOpen(false);
        setShareSuccess("");
      }, 1500);
    } catch (err) {
      setShareError(err.message || "Failed to share access");
    }
  };

  const handleRevokeShare = async (recordId, doctorId) => {
    if (!window.confirm("Are you sure you want to revoke access from this doctor?")) return;
    try {
      await revokeRecordDoctorAccess({ recordId, doctorId });
      fetchRecords();
    } catch (err) {
      alert("Failed to revoke: " + err.message);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      (r.title || r.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.note || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.cid || "").toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All" || r.recordType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Encrypted Medical Vault
          </h1>
          <p className="text-xs text-slate-500">
            Immutable, patient-governed electronic health records stored on IPFS
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          {records.length} Total Records
        </span>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search records, diagnosis, CID..."
            className="w-full pl-10 pr-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-medium"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Prescription">Prescription</option>
            <option value="LabReport">Lab Report</option>
            <option value="Radiology">Radiology</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading records...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No records found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or upload a new record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Document / Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">IPFS CID</th>
                  <th className="py-3 px-4">Blockchain Proof</th>
                  <th className="py-3 px-4">Doctor Access</th>
                  <th className="py-3 px-4">Date Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{r.title || r.name}</p>
                          <p className="text-[10px] text-slate-400">{r.note || r.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                        {r.recordType || "General"}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {r.cid ? (
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${r.cid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 hover:underline flex items-center gap-1"
                        >
                          {r.cid.slice(0, 8)}...{r.cid.slice(-4)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {r.txHash ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {r.txHash.slice(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-slate-400">Off-chain</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {r.sharedWith && r.sharedWith.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.sharedWith.map((sw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                            >
                              <span>{sw.doctor?.name || "Doctor"}</span>
                              <button
                                onClick={() => handleRevokeShare(r._id, sw.doctor?._id)}
                                className="text-slate-400 hover:text-rose-600"
                                title="Revoke access"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Private</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={async () => {
                          try {
                            await downloadDecryptedRecord(r._id, r.name);
                          } catch (err) {
                            alert(err.message || "Failed to download decrypted document");
                          }
                        }}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-semibold inline-flex items-center gap-1"
                        title="Decrypt and Download Record"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Download</span>
                      </button>
                      <button
                        onClick={() => handleOpenShare(r)}
                        className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 font-semibold inline-flex items-center gap-1"
                        title="Share with Doctor"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Share</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Share with Doctor Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Grant Doctor Access</h3>
                <p className="text-xs text-slate-500">Authorize a medical practitioner to view this document</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-xs">
              <span className="font-bold text-slate-700">Record:</span> {selectedRecord?.title || selectedRecord?.name}
            </div>

            {shareSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{shareSuccess}</span>
              </div>
            )}

            {shareError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{shareError}</span>
              </div>
            )}

            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Registered Doctor
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-medium"
                >
                  {doctors.length === 0 ? (
                    <option value="">No registered doctors found</option>
                  ) : (
                    doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specialization || "Physician"} - {d.hospitalName || "Hospital"})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={doctors.length === 0}
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm"
                >
                  Confirm Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
