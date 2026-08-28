import React, { useState } from "react";
import { Pill, Clock, Plus, ShieldCheck, X } from "lucide-react";

const Medicines = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      name: "Atorvastatin Calcium",
      dosage: "20 mg",
      frequency: "Once daily at bedtime",
      prescribedBy: "Dr. Sarah Jenkins",
      duration: "90 Days (Active)",
      status: "Active",
    },
    {
      id: 2,
      name: "Metformin HCl",
      dosage: "500 mg",
      frequency: "Twice daily with meals",
      prescribedBy: "Dr. Michael Chang",
      duration: "60 Days (Active)",
      status: "Active",
    },
    {
      id: 3,
      name: "Amoxicillin Trihydrate",
      dosage: "250 mg",
      frequency: "Every 8 hours",
      prescribedBy: "Dr. Emily Watson",
      duration: "Completed (Aug 2026)",
      status: "Completed",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    prescribedBy: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return alert("Please fill in medicine name and dosage.");

    const newMed = {
      id: Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency || "Once daily",
      prescribedBy: formData.prescribedBy || "Dr. Self-Tracked",
      duration: "Ongoing",
      status: "Active",
    };

    setPrescriptions((prev) => [newMed, ...prev]);
    setModalOpen(false);
    setFormData({ name: "", dosage: "", frequency: "", prescribedBy: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Prescriptions & Medication Timetable
          </h1>
          <p className="text-xs text-slate-500">
            Track active pharmaceutical regimens verified by attending doctors
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Medication
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {prescriptions.map((med) => (
          <div key={med.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    med.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {med.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{med.name}</h3>
              <p className="text-xs font-semibold text-purple-700 mt-0.5">Dosage: {med.dosage}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <p className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{med.frequency}</span>
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rx: {med.prescribedBy}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{med.duration}</span>
              <button className="text-sky-600 font-semibold hover:underline">Log Dose</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Prescription</h3>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medication Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Lisinopril"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g. Once daily"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                />
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
                  className="w-1/2 py-2.5 rounded-xl bg-sky-600 text-white font-semibold shadow-sm hover:bg-sky-700"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
