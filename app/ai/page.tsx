"use client";
// ============================================================
// app/ai-assistant/page.tsx
// LifeLine AI — Main AI Health Assistant page
// ============================================================

import React, { useState } from "react";
import HealthForm from "@/components/ai/HealthForm";
import HealthScoreCard from "@/components/ai/HealthScoreCard";
import MetricCard from "@/components/ai/MetricCard";
import Recommendations from "@/components/ai/Recommendations";
import HealthInsights from "@/components/ai/HealthInsights";
import { HealthInput, HealthMetrics } from "@/lib/healthCalculations";
import { AIHealthAnalysis } from "@/lib/groq";

// ── Types ─────────────────────────────────────────────────────
interface AnalysisResult {
  metrics: HealthMetrics;
  aiAnalysis: AIHealthAnalysis;
  generatedAt: string;
}

// ── Skeleton loader ───────────────────────────────────────────
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonBlock className="h-72" />
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-32" />
          ))}
        </div>
      </div>
      <SkeletonBlock className="h-48" />
      <SkeletonBlock className="h-64" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFormSubmit(data: HealthInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/health/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Analysis failed. Please try again.");
      }

      setResult(json);

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  const m = result?.metrics;
  const ai = result?.aiAnalysis;

  // Determine name from scroll (stored in form state is not accessible here;
  // we read name from aiAnalysis summary or use a fallback)
  // We pass the name separately via a ref-ish trick below
  const [userName, setUserName] = useState("You");

  function handleSubmitWithName(data: HealthInput) {
    setUserName(data.name || "You");
    handleFormSubmit(data);
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-emerald-500/4 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Health Assistant
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            LifeLine{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Fill in your health profile and receive personalized AI-powered
            insights, scores, and recommendations — instantly.
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="bg-white/[0.02] border border-white/8 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <HealthForm onSubmit={handleSubmitWithName} isLoading={isLoading} />
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && <ResultsSkeleton />}

        {/* ── Results ── */}
        {result && m && ai && !isLoading && (
          <section id="results-section" className="space-y-6">
            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">
                Your Health Report
              </span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            {/* Score + Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circular score */}
              <HealthScoreCard
                score={m.overallHealthScore}
                name={userName}
              />

              {/* Metric cards */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <MetricCard
                  label="BMI"
                  value={m.bmi}
                  subtitle={m.bmiCategory}
                  icon="⚖"
                  accentColor="cyan"
                />
                <MetricCard
                  label="Daily Calories"
                  value={m.dailyCalories}
                  unit="kcal"
                  icon="🔥"
                  accentColor="amber"
                />
                <MetricCard
                  label="Sleep Quality"
                  value={m.sleepScore}
                  unit="/100"
                  icon="🌙"
                  accentColor="violet"
                  score={m.sleepScore}
                />
                <MetricCard
                  label="Hydration"
                  value={m.hydrationScore}
                  unit="/100"
                  icon="💧"
                  accentColor="sky"
                  score={m.hydrationScore}
                />
                <MetricCard
                  label="Lifestyle"
                  value={m.lifestyleScore}
                  unit="/100"
                  icon="✦"
                  accentColor="emerald"
                  score={m.lifestyleScore}
                />
                <MetricCard
                  label="Obesity Risk"
                  value={m.obesityRisk}
                  icon="📊"
                  accentColor={
                    m.obesityRisk === "Low"
                      ? "emerald"
                      : m.obesityRisk === "Moderate"
                      ? "amber"
                      : "rose"
                  }
                />
              </div>
            </div>

            {/* AI Insights */}
            <HealthInsights analysis={ai} />

            {/* Recommendations */}
            <Recommendations recommendations={ai.recommendations} />

            {/* Generated timestamp */}
            <p className="text-center text-white/20 text-xs">
              Report generated on{" "}
              {new Date(result.generatedAt).toLocaleString()}
            </p>
          </section>
        )}

        {/* ── Disclaimer ── */}
        <div className="border border-white/6 bg-white/2 rounded-2xl p-4 text-center">
          <p className="text-white/25 text-xs leading-relaxed">
            ⚕ This AI assistant provides informational insights only and is
            not a substitute for professional medical advice. Always consult a
            qualified healthcare provider for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}