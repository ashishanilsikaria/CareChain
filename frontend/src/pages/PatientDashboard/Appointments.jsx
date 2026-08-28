import React, { useState } from "react";
import { Calendar, Clock, Plus, Video, MapPin, X } from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      hospital: "Metropolitan Heart Center",
      date: "2026-09-04",
      time: "10:30 AM",
      type: "In-Person",
      status: "Confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chang",
      specialty: "Neurology",
      hospital: "Apex Neuro Clinic",
      date: "2026-09-12",
      time: "02:15 PM",
      type: "Telehealth Video",
      status: "Confirmed",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor: "Dr. Sarah Jenkins",
    date: "",
    time: "09:00 AM",
    type: "In-Person",
    reason: "",
  });

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!formData.date) return alert("Please select an appointment date.");

    const newAppt = {
      id: Date.now(),
      doctor: formData.doctor,
      specialty: "General Consultation",
      hospital: "City Medical Center",
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: "Confirmed",
    };

    setAppointments((prev) => [newAppt, ...prev]);
    setModalOpen(false);
    setFormData({ doctor: "Dr. Sarah Jenkins", date: "", time: "09:00 AM", type: "In-Person", reason: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Consultations & Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Manage upcoming clinical reviews and telehealth video sessions
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Book Consultation
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  {appt.type.includes("Video") ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{appt.doctor}</h3>
                  <p className="text-xs text-slate-500">{appt.specialty} • {appt.hospital}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                {appt.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 text-xs font-semibold text-slate-700 mt-4 border border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>{appt.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>{appt.time}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{appt.type} Session</span>
              <button className="text-sky-600 font-semibold hover:underline">
                View Access Token
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

            <h3 className="text-base font-bold text-slate-900 mb-4">Book Doctor Consultation</h3>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                  <option value="Dr. Michael Chang">Dr. Michael Chang (Neurology)</option>
                  <option value="Dr. Emily Watson">Dr. Emily Watson (Pediatrics)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {["In-Person", "Telehealth Video"].map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setFormData({ ...formData, type: mode })}
                      className={`py-2 rounded-xl border text-center font-semibold transition-all ${
                        formData.type === mode
                          ? "border-sky-600 bg-sky-50 text-sky-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
