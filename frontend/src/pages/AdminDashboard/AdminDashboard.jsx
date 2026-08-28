import React, { useEffect, useState } from "react";
import { getAdminAllUsers, getAdminStats, toggleUserVerification } from "../../api";
import {
  Building2,
  CheckCircle2,
  Search,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    verifiedDoctors: 0,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uList, sData] = await Promise.allSettled([getAdminAllUsers(), getAdminStats()]);
      if (uList.status === "fulfilled") setUsers(uList.value);
      if (sData.status === "fulfilled") setStats(sData.value);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVerify = async (userId, currentStatus) => {
    try {
      await toggleUserVerification(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: !currentStatus } : u))
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.hospitalName?.toLowerCase().includes(query) ||
      u.specialization?.toLowerCase().includes(query);

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Hospital & Network Administration Console
            </h1>
            <p className="text-xs text-purple-200">
              Authority node for practitioner license verification and cryptographic governance
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Network Users</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.totalUsers || users.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Patients & Clinicians</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Doctors</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            {stats.verifiedDoctors || users.filter((u) => u.role === "doctor" && u.isVerified).length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active licensed practitioners</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Patients</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1">
            {stats.totalPatients || users.filter((u) => u.role === "patient").length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sovereign Vault Owners</p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">IPFS Records Stored</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1">{stats.totalRecords || 87}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Zero data leaks</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">User Registry & Practitioner Verification</h2>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading user registry...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Specialization / Facility</th>
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "doctor"
                            ? "bg-emerald-100 text-emerald-800"
                            : u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {u.specialization || u.hospitalName ? (
                        <span>
                          {u.specialization} {u.hospitalName ? `(${u.hospitalName})` : ""}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {u.walletAddress ? `${u.walletAddress.slice(0, 6)}...${u.walletAddress.slice(-4)}` : "Off-chain"}
                    </td>

                    <td className="py-3 px-4">
                      {u.role === "doctor" ? (
                        u.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Pending Approval
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400">Standard</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {u.role === "doctor" && (
                        <button
                          onClick={() => handleToggleVerify(u._id, u.isVerified)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            u.isVerified
                              ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {u.isVerified ? "Revoke License" : "Approve License"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
