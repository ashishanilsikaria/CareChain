import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const RoleCard = ({
  role,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  gradient,
  accentColor,
  features = [],
  primaryPath,
  secondaryPath,
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {badgeText}
          </span>
        </div>

        {/* Title & Desc */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-sky-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {subtitle}
        </p>

        {/* Feature List */}
        <ul className="space-y-2.5 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <Link
          to={primaryPath}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${gradient} hover:opacity-95 flex items-center justify-center gap-2 shadow-md transition-all group-hover:shadow-lg`}
        >
          <span>Enter as {role}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        {secondaryPath && (
          <Link
            to={secondaryPath}
            className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-sky-600 block transition-colors"
          >
            Register new account
          </Link>
        )}
      </div>
    </div>
  );
};

export default RoleCard;
