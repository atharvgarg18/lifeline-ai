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
    <div className="bg-white/3 border border-white/8 rounded-3xl p-6">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
        AI Recommendations
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-2xl p-4 hover:bg-white/6 hover:border-emerald-400/30 transition-all group"
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{iconForIndex(i)}</span>
            <div>
              <p className="text-sm text-white/80 leading-relaxed">{rec}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}