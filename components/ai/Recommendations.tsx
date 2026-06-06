"use client";
// ============================================================
// components/ai/Recommendations.tsx
// Displays AI-generated actionable health recommendations
// ============================================================

import React from "react";

interface RecommendationsProps {
  recommendations: string[];
}

const iconForIndex = (i: number) =>
  ["🥗", "💧", "🏃", "😴", "🧘", "🚭", "🫀", "🧬"][i % 8];

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        AI Recommendations
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white transition-all group"
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{iconForIndex(i)}</span>
            <div>
              <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}