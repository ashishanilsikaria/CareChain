import React from "react";
import { Building2, MapPin, Phone, ShieldCheck, ExternalLink } from "lucide-react";

const Hospitals = () => {
  const hospitals = [
    {
      id: 1,
      name: "Metropolitan General Hospital",
      city: "San Francisco, CA",
      address: "1001 Potrero Ave, SF, CA 94110",
      phone: "(415) 206-8000",
      type: "Level 1 Trauma Center",
      departments: ["Cardiology", "Trauma", "Neurology", "Pediatrics"],
      status: "Integrated Network",
      smartContractVerified: true,
    },
    {
      id: 2,
      name: "St. Jude Medical Research Pavilion",
      city: "Memphis, TN",
      address: "262 Danny Thomas Pl, Memphis, TN 38105",
      phone: "(866) 278-5833",
      type: "Research & Oncology",
      departments: ["Oncology", "Hematology", "Genomics", "Immunology"],
      status: "Integrated Network",
      smartContractVerified: true,
    },
    {
      id: 3,
      name: "Apex Specialized Neuro & Spine Center",
      city: "Boston, MA",
      address: "55 Fruit St, Boston, MA 02114",
      phone: "(617) 726-2000",
      type: "Specialized Surgical Center",
      departments: ["Neurosurgery", "Spine Care", "Orthopedics"],
      status: "Integrated Network",
      smartContractVerified: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Connected Healthcare Facilities & Hospital Network
        </h1>
        <p className="text-xs text-slate-500">
          Hospitals and medical centers authorized to verify practitioner credentials and sync interoperable EMRs
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {hospitals.map((hosp) => (
          <div key={hosp.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                {hosp.smartContractVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    <ShieldCheck className="w-3 h-3 text-sky-600" /> On-Chain Node
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">{hosp.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{hosp.type}</p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hosp.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hosp.phone}</span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {hosp.departments.map((dept, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
              </span>
              <button className="text-sky-600 hover:underline flex items-center gap-1">
                Facility Portal <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
