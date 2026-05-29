"use client";
// ============================================================
// components/ai/MetricCard.tsx
// Reusable metric display card for BMI, Sleep, Hydration, etc.
// ============================================================

import React from "react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor: string; // Tailwind color class e.g. "cyan" | "violet" | "emerald" | "amber" | "rose"
  score?: number; // Optional 0-100 bar
}

const colorMap: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  cyan:   { bg: "bg-cyan-400/10",   border: "border-cyan-400/20",   text: "text-cyan-400",   bar: "bg-cyan-400" },
  violet: { bg: "bg-violet-400/10", border: "border-violet-400/20", text: "text-violet-400", bar: "bg-violet-400" },
  emerald:{ bg: "bg-emerald-400/10",border: "border-emerald-400/20",text: "text-emerald-400",bar: "bg-emerald-400" },
  amber:  { bg: "bg-amber-400/10",  border: "border-amber-400/20",  text: "text-amber-400",  bar: "bg-amber-400" },
  rose:   { bg: "bg-rose-400/10",   border: "border-rose-400/20",   text: "text-rose-400",   bar: "bg-rose-400" },
  sky:    { bg: "bg-sky-400/10",    border: "border-sky-400/20",    text: "text-sky-400",    bar: "bg-sky-400" },
};

export default function MetricCard({
  label,
  value,
  unit,
  subtitle,
  icon,
  accentColor,
  score,
}: MetricCardProps) {
  const c = colorMap[accentColor] ?? colorMap.cyan;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${c.border} bg-white/3 p-5 flex flex-col gap-3 hover:bg-white/5 transition-colors group`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.text} text-lg flex-shrink-0`}>
        {icon}
      </div>

      {/* Value */}
      <div>
        <div className="flex items-end gap-1.5">
          <span className={`text-2xl font-black text-white leading-none`}>{value}</span>
          {unit && <span className="text-white/40 text-xs mb-0.5">{unit}</span>}
        </div>
        <p className="text-xs text-white/40 mt-1 font-medium uppercase tracking-widest">{label}</p>
        {subtitle && <p className={`text-xs mt-0.5 font-semibold ${c.text}`}>{subtitle}</p>}
      </div>

      {/* Optional score bar */}
      {score !== undefined && (
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full ${c.bar} rounded-full transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}

      {/* Subtle corner accent */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
    </div>
  );
}