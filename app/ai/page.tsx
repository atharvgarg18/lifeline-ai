"use client";
// ============================================================
// app/ai-assistant/page.tsx
// LifeLine AI — Main AI Health Assistant page
// ============================================================

import React, { useEffect, useState } from "react";
import HealthForm from "@/components/ai/HealthForm";
import HealthScoreCard from "@/components/ai/HealthScoreCard";
import MetricCard from "@/components/ai/MetricCard";
import Recommendations from "@/components/ai/Recommendations";
import HealthInsights from "@/components/ai/HealthInsights";
import { HealthInput, HealthMetrics } from "@/lib/healthCalculations";
import { AIHealthAnalysis } from "@/lib/groq";
import { useAuth } from "@/context/AuthContext";
import { getProfile } from "@/lib/patientApi";

// ── Types ─────────────────────────────────────────────────────
interface AnalysisResult {
  metrics: HealthMetrics;
  aiAnalysis: AIHealthAnalysis;
  generatedAt: string;
}

const DEFAULT_INPUT: HealthInput = {
  name: "You",
  age: 25,
  gender: "male",
  height: 170,
  weight: 70,
  bloodGroup: "O+",
  sleepHours: 7,
  waterIntake: 2,
  exerciseFrequency: 3,
  smokingStatus: "never",
  alcoholUsage: "none",
  stressLevel: 5,
  existingDiseases: [],
  allergies: [],
  medications: [],
  familyHistory: [],
};

// ── Skeleton loader ───────────────────────────────────────────
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-2xl ${className}`} />
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<HealthInput>>({});
  const [autoRan, setAutoRan] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      const values: Partial<HealthInput> = {};
      if (user?.name) values.name = user.name;

      try {
        const profile = await getProfile();
        if (profile?.bloodGroup) values.bloodGroup = profile.bloodGroup;
        if (profile?.allergies?.length) values.allergies = profile.allergies;
        if (profile?.chronicDiseases?.length) values.existingDiseases = profile.chronicDiseases;
        if (profile?.medications?.length) {
          values.medications = profile.medications
            .map((m: { name?: string }) => m.name)
            .filter(Boolean) as string[];
        }
      } catch {
        // Profile may not exist yet
      }

      if (active) setInitialValues(values);
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [user?.name]);

  useEffect(() => {
    if (autoRan || isLoading) return;

    const merged: HealthInput = {
      ...DEFAULT_INPUT,
      ...initialValues,
      existingDiseases: initialValues.existingDiseases ?? DEFAULT_INPUT.existingDiseases,
      allergies: initialValues.allergies ?? DEFAULT_INPUT.allergies,
      medications: initialValues.medications ?? DEFAULT_INPUT.medications,
      familyHistory: initialValues.familyHistory ?? DEFAULT_INPUT.familyHistory,
    };

    setAutoRan(true);
    handleFormSubmit(merged);
    setUserName(merged.name || "You");
  }, [initialValues, autoRan, isLoading]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Health Assistant
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            LifeLine <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Fill in your health profile and receive personalized AI-powered
            insights, scores, and recommendations — instantly.
          </p>
        </div>

        {/* ── Form card ── */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg">
            <HealthForm onSubmit={handleSubmitWithName} isLoading={isLoading} initialValues={initialValues} />
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && <ResultsSkeleton />}

        {/* ── Results ── */}
        {result && m && ai && !isLoading && (
          <section id="results-section" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Using your available profile data. You can update details any time.
              </p>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-500"
              >
                {showForm ? "Hide inputs" : "Edit inputs"}
              </button>
            </div>
            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Your Health Report
              </span>
              <div className="h-px flex-1 bg-slate-200" />
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
            <p className="text-center text-slate-400 text-xs">
              Report generated on{" "}
              {new Date(result.generatedAt).toLocaleString()}
            </p>
          </section>
        )}

        {/* ── Disclaimer ── */}
        <div className="border border-slate-200 bg-white rounded-2xl p-4 text-center">
          <p className="text-slate-500 text-xs leading-relaxed">
            ⚕ This AI assistant provides informational insights only and is
            not a substitute for professional medical advice. Always consult a
            qualified healthcare provider for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}