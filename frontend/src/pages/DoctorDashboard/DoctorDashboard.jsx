import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWeb3 } from "../../context/Web3Context";
import { listRecords, uploadEncryptedFile, simulateBlockchainRecord } from "../../api";
import {
  Stethoscope,
  ShieldCheck,
  Search,
  FilePlus,
  FileText,
  ExternalLink,
  Wallet,
  X,
} from "lucide-react";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { isWalletConnected, connectWallet, shortAddress } = useWeb3();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Diagnostic Upload Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientWallet, setPatientWallet] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("Diagnostic");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await listRecords();
      setRecords(data);
    } catch (err) {
      console.error("Fetch doctor records error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUploadDiagnostic = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a diagnostic file or report.");

    try {
      setUploading(true);
      setUploadStatus("Encrypting with AES-256 and uploading to IPFS...");

      const uploadRes = await uploadEncryptedFile(selectedFile, {
        title: reportTitle || selectedFile.name,
        recordType: reportType,
        note: clinicalNotes || `Attending Doctor: ${user?.name}`,
      });

      setUploadStatus("Anchoring diagnostic record to blockchain...");
      await simulateBlockchainRecord({
        name: selectedFile.name,
        title: reportTitle || selectedFile.name,
        recordType: reportType,
        note: clinicalNotes,
        cid: uploadRes.cid,
        key: uploadRes.key,
        iv: uploadRes.iv,
        tag: uploadRes.tag,
        patientAddress: patientWallet || null,
      });

      setUploadStatus("Diagnostic Report Recorded Successfully ✅");
      fetchRecords();
      setTimeout(() => {
        setModalOpen(false);
        setSelectedFile(null);
        setReportTitle("");
        setClinicalNotes("");
        setUploadStatus("");
      }, 1500);
    } catch (err) {
      console.error("Doctor upload error:", err);
      setUploadStatus("Failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (r.title || r.name || "").toLowerCase().includes(query) ||
      (r.userId?.name || "").toLowerCase().includes(query) ||
      (r.userId?.email || "").toLowerCase().includes(query) ||
      (r.patientAddress || "").toLowerCase().includes(query);

    const matchesTab = activeTab === "all" || r.recordType?.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner: Doctor Profile */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold">{user?.name || "Dr. Practitioner"}</h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Licensed Practitioner
              </span>
            </div>
            <p className="text-xs text-emerald-100 flex items-center gap-2">
              <span>{user?.specialization || "Clinical Specialist"}</span> •{" "}
              <span>{user?.hospitalName || "Affiliated Medical Center"}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5"
          >
            <FilePlus className="w-4 h-4" /> Issue Clinical Report
          </button>
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              className="px-4 py-2.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/70 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Wallet className="w-4 h-4" /> Connect Signer Wallet
            </button>
          ) : (
            <span className="px-3.5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-200 text-xs font-mono font-semibold border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {shortAddress}
            </span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Records</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{records.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Encrypted EHRs shared</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Patients</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            {new Set(records.map((r) => r.userId?._id || r.userId)).size || 1}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Assigned to your care</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prescriptions Issued</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1">
            {records.filter((r) => r.recordType === "Prescription").length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Signed by this wallet</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">License Status</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 mt-1">Verified</p>
          <p className="text-[11px] text-slate-400 mt-0.5">State Board of Medicine</p>
        </div>
      </div>

      {/* Search and Tab Filter */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search patient, diagnosis, or CID..."
            className="w-full pl-10 pr-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
          {[
            { id: "all", label: "All Records" },
            { id: "diagnostic", label: "Diagnostics" },
            { id: "labreport", label: "Lab Reports" },
            { id: "prescription", label: "Prescriptions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Records Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Authorized Patient Records</h3>
          <span className="text-xs text-slate-500">{filteredRecords.length} records available</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading authorized records...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No matching patient records found</h4>
            <p className="text-xs text-slate-400 mt-1">
              Ask your patients to grant access to your practitioner profile in their portal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Document / Record</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">IPFS CID</th>
                  <th className="py-3 px-4">Recorded Date</th>
                  <th className="py-3 px-4 text-right">Gateway Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {r.userId?.name ? r.userId.name.charAt(0) : "P"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{r.userId?.name || "Patient Record"}</p>
                          <p className="text-[10px] text-slate-400">{r.userId?.email || r.patientAddress || "Anonymous"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{r.title || r.name}</p>
                      <p className="text-[10px] text-slate-500">{r.note || "-"}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                          {r.cid.slice(0, 10)}...{r.cid.slice(-4)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {r.cid && (
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${r.cid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold rounded-lg inline-flex items-center gap-1"
                        >
                          <span>Open IPFS</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Diagnostic Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Issue Clinical Report</h3>
                <p className="text-xs text-slate-500">Upload encrypted consultation or lab document</p>
              </div>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl mb-4 font-semibold">
                {uploadStatus}
              </div>
            )}

            <form onSubmit={handleUploadDiagnostic} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select File *</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Report Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Post-Op Cardiac Evaluation"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="LabReport">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Radiology">Radiology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Wallet / Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={patientWallet}
                    onChange={(e) => setPatientWallet(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Notes & Observations</label>
                <textarea
                  rows="3"
                  placeholder="Clinical assessment, dosage recommendations, prognosis..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {uploading ? "Encrypting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
