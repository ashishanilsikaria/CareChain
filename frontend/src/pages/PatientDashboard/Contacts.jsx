import React, { useState } from "react";
import { PhoneCall, ShieldAlert, Plus, Heart, X } from "lucide-react";

const Contacts = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Eleanor Vance",
      relation: "Spouse / Primary Caregiver",
      phone: "+1 (555) 234-5678",
      emergencyAccess: true,
    },
    {
      id: 2,
      name: "Robert Vance",
      relation: "Brother / Emergency Contact",
      phone: "+1 (555) 876-5432",
      emergencyAccess: false,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
    emergencyAccess: false,
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Name and phone number required.");

    setContacts((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...formData,
      },
    ]);
    setModalOpen(false);
    setFormData({ name: "", relation: "", phone: "", emergencyAccess: false });
  };

  const toggleEmergency = (id) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, emergencyAccess: !c.emergencyAccess } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Emergency Contacts & Caregiver Consent
          </h1>
          <p className="text-xs text-slate-500">
            Configure designated guardians who receive critical health alerts or break-glass access
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Emergency Contact
        </button>
      </div>

      {/* Emergency Notice */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Break-Glass Emergency Protocol</p>
          <p className="text-rose-700 mt-0.5">
            Contacts marked with "Emergency Access" can be notified by emergency trauma personnel and unlock essential blood type/allergy summaries in life-threatening scenarios.
          </p>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <div key={c.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                {c.emergencyAccess ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    Break-Glass Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Standard Contact
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
              <p className="text-xs font-semibold text-slate-500">{c.relation}</p>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-700 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                <span>{c.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Emergency Override:</span>
              <button
                onClick={() => toggleEmergency(c.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  c.emergencyAccess
                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {c.emergencyAccess ? "Enabled (Click to Revoke)" : "Enable Break-Glass"}
              </button>
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

            <h3 className="text-base font-bold text-slate-900 mb-4">Add Contact</h3>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Sibling / Parent"
                  value={formData.relation}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="em-access"
                  checked={formData.emergencyAccess}
                  onChange={(e) => setFormData({ ...formData, emergencyAccess: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="em-access" className="font-semibold text-slate-700">
                  Grant Break-Glass Emergency Access
                </label>
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
