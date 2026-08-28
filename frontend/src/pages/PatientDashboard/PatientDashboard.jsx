import React from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWeb3 } from "../../context/Web3Context";
import IndexPage from "./IndexPage";
import History from "./History";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import Medicines from "./Medicines";
import Hospitals from "./Hospitals";
import Contacts from "./Contacts";
import Upload from "../../components/Upload";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  UserCheck,
  Calendar,
  Pill,
  Building,
  PhoneCall,
  Wallet,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const PatientDashboard = () => {
  const { user } = useAuth();
  const { isWalletConnected, shortAddress, connectWallet } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Overview", path: "/patient-dashboard", icon: LayoutDashboard, exact: true },
    { label: "Medical Vault", path: "/patient-dashboard/history", icon: FileText },
    { label: "Upload Document", path: "/patient-dashboard/upload", icon: UploadCloud },
    { label: "Doctor Access", path: "/patient-dashboard/doctors", icon: UserCheck },
    { label: "Appointments", path: "/patient-dashboard/appointments", icon: Calendar },
    { label: "Prescriptions", path: "/patient-dashboard/medicines", icon: Pill },
    { label: "Hospitals", path: "/patient-dashboard/hospitals", icon: Building },
    { label: "Emergency Contacts", path: "/patient-dashboard/contact", icon: PhoneCall },
  ];

  const isNavActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
        <div>
          {/* Patient Profile Card */}
          <div className="p-3.5 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-2xl mb-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name || "Patient"}</h3>
              <p className="text-xs text-sky-700 font-medium">Vault ID #{user?.id ? user.id.slice(-5) : "001"}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security & Web3 Status Box */}
        <div className="pt-6 border-t border-slate-100 mt-6">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Vault Security
              </span>
              <span className="text-emerald-700 font-bold">AES-256</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-sky-500" /> Web3 State
              </span>
              {isWalletConnected ? (
                <span className="text-slate-700 font-mono text-[10px] font-bold">{shortAddress}</span>
              ) : (
                <button
                  onClick={connectWallet}
                  className="text-sky-600 hover:underline font-bold text-[11px]"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/upload" element={<Upload onUploadSuccess={() => navigate("/patient-dashboard/history")} />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/contact" element={<Contacts />} />
        </Routes>
      </main>
    </div>
  );
};

export default PatientDashboard;
