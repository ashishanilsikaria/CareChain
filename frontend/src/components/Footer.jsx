import React from "react";
import { Activity, ShieldCheck, Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Care<span className="text-sky-400">Chain</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Decentralized, patient-centric electronic health records anchored by Ethereum smart contracts and AES-256 encrypted IPFS storage.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> HIPAA & GDPR Compliant Architecture
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="/login?role=patient" className="hover:text-white transition-colors">Patient Health Vault</a></li>
              <li><a href="/login?role=doctor" className="hover:text-white transition-colors">Practitioner Portal</a></li>
              <li><a href="/login?role=admin" className="hover:text-white transition-colors">Hospital Administration</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Register Decentralized ID</a></li>
            </ul>
          </div>

          {/* Technology Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Protocol</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1">
                <span>Solidity Smart Contracts</span>
              </li>
              <li className="flex items-center gap-1">
                <span>InterPlanetary File System (IPFS)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>AES-256-GCM Encryption</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Ethers.js v6 Web3 Provider</span>
              </li>
            </ul>
          </div>

          {/* Network Status */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Network Status</h4>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Contract State:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">IPFS Gateway:</span>
                <span className="text-emerald-400 font-bold">Online</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Encryption:</span>
                <span className="text-sky-400 font-bold">256-bit GCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CareChain Protocol. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built for patient data sovereignty with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
