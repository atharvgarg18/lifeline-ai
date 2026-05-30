"use client";
// ============================================================
// components/ai/HealthScoreCard.tsx
// Circular animated health score display
// ============================================================

import React, { useEffect, useState } from "react";

interface HealthScoreCardProps {
  score: number;
  name: string;
}

function getCategory(score: number): { label: string; color: string; glow: string } {
  if (score >= 80) return { label: "Excellent", color: "#34d399", glow: "0 0 40px rgba(52,211,153,0.4)" };
  if (score >= 65) return { label: "Good", color: "#60a5fa", glow: "0 0 40px rgba(96,165,250,0.4)" };
  if (score >= 45) return { label: "Moderate", color: "#fbbf24", glow: "0 0 40px rgba(251,191,36,0.4)" };
  return { label: "Poor", color: "#f87171", glow: "0 0 40px rgba(248,113,113,0.4)" };
}

export default function HealthScoreCard({ score, name }: HealthScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { label, color, glow } = getCategory(score);

  // Animate count up on mount
  useEffect(() => {
    let current = 0;
    const step = score / 60;
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(interval);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  // SVG circle math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl p-8 overflow-hidden">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">
        Health Score
      </p>

      {/* Circular progress */}
      <div className="relative" style={{ filter: `drop-shadow(${glow})` }}>
        <svg width="180" height="180" className="-rotate-90">
          {/* Track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>

        {/* Score text inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-slate-900 leading-none tabular-nums">
            {animatedScore}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">/ 100</span>
        </div>
      </div>

      {/* Category badge */}
      <div
        className="mt-6 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
        style={{
          background: `${color}22`,
          color,
          border: `1px solid ${color}44`,
        }}
      >
        {label}
      </div>

      <p className="mt-3 text-slate-500 text-xs text-center">
        {name}&apos;s overall health
      </p>
    </div>
  );
}