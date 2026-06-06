"use client";
// ============================================================
// components/ai/HealthInsights.tsx
// Displays AI health summary, strengths, concerns, future risks
// ============================================================

import React from "react";
import { AIHealthAnalysis } from "@/lib/groq";

interface HealthInsightsProps {
  analysis: AIHealthAnalysis;
}

export default function HealthInsights({ analysis }: HealthInsightsProps) {
  const riskColor: Record<string, string> = {
    Low: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Moderate: "text-amber-600 bg-amber-50 border-amber-200",
    High: "text-orange-600 bg-orange-50 border-orange-200",
    Critical: "text-red-600 bg-red-50 border-red-200",
  };

  const riskClass = riskColor[analysis.riskLevel] ?? riskColor.Moderate;

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Health Summary
          </h3>
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${riskClass}`}>
            {analysis.riskLevel} Risk
          </span>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Strengths & Concerns side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4 flex items-center gap-2">
            <span>✦</span> Strengths
          </h4>
          <ul className="space-y-2.5">
            {analysis.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex-shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm text-slate-700">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concerns */}
        <div className="bg-white border border-amber-200 rounded-3xl p-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-4 flex items-center gap-2">
            <span>⚠</span> Concerns
          </h4>
          <ul className="space-y-2.5">
            {analysis.concerns?.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex-shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </span>
                <span className="text-sm text-slate-700">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Future Risks */}
      <div className="bg-white border border-rose-200 rounded-3xl p-6">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600 mb-4 flex items-center gap-2">
          <span>◈</span> Future Risk Predictions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.futureRisks?.map((risk, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3"
            >
              <span className="text-rose-500 text-sm flex-shrink-0">⬡</span>
              <span className="text-sm text-slate-700">{risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}