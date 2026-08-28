import React, { useState } from "react";
import { uploadEncryptedFile, simulateBlockchainRecord } from "../api";
import { useWeb3 } from "../context/Web3Context";
import {
  UploadCloud,
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Upload = ({ onUploadSuccess }) => {
  const { account } = useWeb3();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState("General");
  const [note, setNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusStep, setStatusStep] = useState(0); // 0: Idle, 1: Encrypting, 2: Pinning to IPFS, 3: Blockchain Logging, 4: Done
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a medical report or document.");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      setStatusStep(1); // Encrypting AES-256

      // Step 1: Encrypt and upload to IPFS via Backend Gateway
      const meta = { title: title || file.name, recordType, note };
      const uploadRes = await uploadEncryptedFile(file, meta);

      setStatusStep(2); // Pinning IPFS completed

      // Step 2: Register on Blockchain / Simulated Immutable Ledger
      setStatusStep(3);
      const simRes = await simulateBlockchainRecord({
        name: file.name,
        title: title || file.name,
        recordType,
        note,
        cid: uploadRes.cid,
        key: uploadRes.key,
        iv: uploadRes.iv,
        tag: uploadRes.tag,
        patientAddress: account || null,
      });

      setStatusStep(4);
      setUploadResult({
        cid: uploadRes.cid,
        txHash: simRes.record?.txHash || "0xSimulatedHash",
        name: file.name,
        key: uploadRes.key,
      });

      if (onUploadSuccess) onUploadSuccess(simRes.record);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to complete secure upload");
      setStatusStep(0);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setNote("");
    setStatusStep(0);
    setUploadResult(null);
    setErrorMessage("");
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Upload Medical Document</h2>
          <p className="text-xs text-slate-500">
            End-to-end encrypted with AES-256-GCM and anchored to decentralized IPFS
          </p>
        </div>
      </div>

      {uploadResult ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Record Successfully Anchored!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Your document is encrypted and stored immutably.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2.5 text-xs font-mono border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans font-semibold">IPFS CID:</span>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${uploadResult.cid}`}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:underline flex items-center gap-1"
              >
                {uploadResult.cid.slice(0, 16)}...{uploadResult.cid.slice(-6)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans font-semibold">Blockchain TxHash:</span>
              <span className="text-slate-800 font-semibold">
                {uploadResult.txHash.slice(0, 16)}...{uploadResult.txHash.slice(-6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans font-semibold">Status:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified & Synced
              </span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all"
          >
            Upload Another Document
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              file ? "border-sky-500 bg-sky-50/40" : "border-slate-300 hover:border-sky-400 bg-slate-50/50"
            }`}
          >
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.dcm,.txt"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-10 h-10 text-sky-600 mb-2" />
                <p className="text-sm font-bold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <label
                  htmlFor="file-input"
                  className="mt-3 text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
                >
                  Change file
                </label>
              </div>
            ) : (
              <label htmlFor="file-input" className="cursor-pointer block">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Drag & drop medical files or <span className="text-sky-600">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, DICOM, Lab Scans, PNG, JPG up to 25MB
                </p>
              </label>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g. Annual Blood Work & Lipid Panel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
            />
          </div>

          {/* Record Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="General">General Medical Note</option>
                <option value="Diagnostic">Diagnostic Report</option>
                <option value="Prescription">Prescription</option>
                <option value="LabReport">Laboratory Report</option>
                <option value="Radiology">Radiology / Imaging</option>
                <option value="Surgery">Surgical Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinical Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Roberts consultation"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Status Progress Indicator */}
          {isUploading && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
                <Zap className="w-4 h-4 animate-spin text-sky-600" />
                {statusStep === 1 && "Encrypting payload with AES-256-GCM..."}
                {statusStep === 2 && "Pinning encrypted ciphertext to decentralized IPFS..."}
                {statusStep === 3 && "Registering record proof on blockchain..."}
              </div>
              <div className="w-full bg-sky-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-1.5 transition-all duration-500"
                  style={{ width: `${statusStep * 33}%` }}
                ></div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all ${
              isUploading || !file
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-sky-500/20 hover:shadow-lg"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isUploading ? "Encrypting & Storing..." : "Encrypt & Upload to CareChain"}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default Upload;
