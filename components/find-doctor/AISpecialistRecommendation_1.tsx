"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  AlertTriangle,
  ChevronRight,
  Clock,
  Building2,
  MapPin,
  Zap,
  Heart,
  Activity,
  Shield,
  CheckCircle2,
  Info,
  Loader2,
  TrendingUp,
} from "lucide-react";

/* ─── Types ─── */
type Severity = "Low" | "Medium" | "High" | "Critical";

type RecommendationResult = {
  specialist: string;
  confidence: number;
  reason: string;
  waitTime: string;
  hospital: string;
  distance: string;
  action: string;
  actionColor: string;
  actionBg: string;
  specialistIcon: React.ReactNode;
  specialistColor: string;
  specialistBg: string;
  insights: { icon: React.ReactNode; label: string; value: string; color: string }[];
};

/* ─── Severity config ─── */
const severityConfig: Record<
  Severity,
  { color: string; bg: string; border: string; dot: string; label: string; icon: React.ReactNode }
> = {
  Low: {
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    dot: "#10B981",
    label: "Low",
    icon: <Shield size={13} />,
  },
  Medium: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    dot: "#F59E0B",
    label: "Medium",
    icon: <Activity size={13} />,
  },
  High: {
    color: "#DC2626",
    bg: "#FFF1F2",
    border: "#FECDD3",
    dot: "#EF4444",
    label: "High",
    icon: <AlertTriangle size={13} />,
  },
  Critical: {
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    dot: "#8B5CF6",
    label: "Critical",
    icon: <Zap size={13} />,
  },
};

/* ─── Mock AI result ─── */
const mockResult: RecommendationResult = {
  specialist: "Cardiologist",
  confidence: 92,
  reason:
    "Your symptoms indicate a possible heart-related condition. Chest pain combined with reported discomfort may require urgent cardiac evaluation.",
  waitTime: "15–20 min",
  hospital: "City Heart Hospital",
  distance: "1.8 km",
  action: "Consult Soon",
  actionColor: "#D97706",
  actionBg: "#FFFBEB",
  specialistIcon: <Heart size={20} />,
  specialistColor: "#2563EB",
  specialistBg: "#EFF6FF",
  insights: [
    { icon: <Clock size={14} />, label: "Estimated Wait Time", value: "15–20 min", color: "#2563EB" },
    { icon: <Building2 size={14} />, label: "Nearest Hospital", value: "City Heart Hospital", color: "#059669" },
    { icon: <MapPin size={14} />, label: "Distance", value: "1.8 km away", color: "#7C3AED" },
    { icon: <TrendingUp size={14} />, label: "Action Suggested", value: "Consult Soon", color: "#D97706" },
  ],
};

/* ─── Animations ─── */
const sectionFadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const resultEntrance = {
  hidden: { opacity: 0, x: 20, scale: 0.97 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Confidence Bar ─── */
function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#64748B] font-medium">Confidence Score</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm font-bold text-[#2563EB]"
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function AISpecialistRecommendation() {
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const canAnalyze = symptoms.trim().length > 0 && severity !== null;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setIsAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzing(false);
    setResult(mockResult);
  };

  return (
    <motion.section
      variants={sectionFadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="w-full bg-[#F8FAFC] px-6 py-8"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Section Label ── */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-6"
        >
          <motion.div variants={childFadeUp} className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold">
              <Sparkles size={11} />
              AI-Powered Analysis
            </span>
          </motion.div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ════════════════════════════
              LEFT — Input Panel
          ════════════════════════════ */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-6 flex flex-col gap-5 shadow-sm"
          >
            {/* Header */}
            <motion.div variants={childFadeUp}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                  <Brain size={20} className="text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1E293B]">AI Specialist Recommendation</h2>
                  <p className="text-xs text-[#64748B]">Powered by LifeLine AI Engine</p>
                </div>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Describe your symptoms and our AI will recommend the most suitable specialist for your condition.
              </p>
            </motion.div>

            {/* Divider */}
            <div className="border-t border-[#F1F5F9]" />

            {/* Symptoms Textarea */}
            <motion.div variants={childFadeUp}>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
                What are you experiencing?
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain, headache, fever, back pain..."
                rows={4}
                className="w-full border border-[#E2E8F0] rounded-2xl px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] bg-[#F8FAFC] resize-none focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all leading-relaxed"
              />
              <p className="text-[11px] text-[#94A3B8] mt-1.5 ml-1">
                Be as specific as possible for a more accurate recommendation.
              </p>
            </motion.div>

            {/* Severity Selection */}
            <motion.div variants={childFadeUp}>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-3">
                Select Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["Low", "Medium", "High", "Critical"] as Severity[]).map((s) => {
                  const cfg = severityConfig[s];
                  const active = severity === s;
                  return (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSeverity(s)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-xs font-semibold"
                      style={
                        active
                          ? {
                              background: cfg.bg,
                              borderColor: cfg.color,
                              color: cfg.color,
                            }
                          : {
                              background: "#F8FAFC",
                              borderColor: "#E2E8F0",
                              color: "#94A3B8",
                            }
                      }
                    >
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-xl"
                        style={
                          active
                            ? { background: cfg.color + "1A", color: cfg.color }
                            : { background: "#E2E8F0", color: "#94A3B8" }
                        }
                      >
                        {cfg.icon}
                      </span>
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Info notice */}
            <motion.div
              variants={childFadeUp}
              className="flex items-start gap-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl px-4 py-3"
            >
              <Info size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-xs text-[#3B82F6] leading-relaxed">
                This AI recommendation is for guidance only. Always consult a qualified medical professional for diagnosis and treatment.
              </p>
            </motion.div>

            {/* Analyze Button */}
            <motion.div variants={childFadeUp}>
              <motion.button
                whileHover={canAnalyze ? { scale: 1.02 } : {}}
                whileTap={canAnalyze ? { scale: 0.97 } : {}}
                onClick={handleAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  canAnalyze && !isAnalyzing
                    ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-100"
                    : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing Symptoms…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze Symptoms
                    <ChevronRight size={15} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ════════════════════════════
              RIGHT — Result Panel
          ════════════════════════════ */}
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-dashed border-[#BFDBFE] rounded-3xl flex-1 flex flex-col items-center justify-center py-16 px-8 text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-[#EFF6FF] flex items-center justify-center">
                    <Brain size={28} className="text-[#BFDBFE]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#94A3B8] mb-1">AI Recommendation</p>
                    <p className="text-xs text-[#C4D4E8]">
                      Describe your symptoms and select a severity level, then click "Analyze Symptoms" to get your recommendation.
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["Chest Pain", "Fever", "Headache", "Back Pain"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${s}` : s))}
                        className="px-3 py-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-[#E2E8F0] rounded-3xl flex-1 flex flex-col items-center justify-center py-16 gap-5 shadow-sm"
                >
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-[#EFF6FF]" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2563EB]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain size={26} className="text-[#2563EB]" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1E293B] mb-1">Analyzing Symptoms</p>
                    <p className="text-xs text-[#94A3B8]">AI is processing your input…</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full bg-[#2563EB]"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {result && !isAnalyzing && (
                <motion.div
                  key="result"
                  variants={resultEntrance}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-4"
                >
                  {/* ── Main Recommendation Card ── */}
                  <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        <span className="text-xs font-semibold text-[#64748B]">AI Recommendation</span>
                      </div>
                      <motion.span
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold"
                      >
                        <CheckCircle2 size={12} />
                        High Confidence
                      </motion.span>
                    </div>

                    {/* Specialist + Confidence */}
                    <div className="flex items-center gap-4 mb-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: result.specialistBg }}
                      >
                        <span style={{ color: result.specialistColor }}>{result.specialistIcon}</span>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#94A3B8] mb-0.5">Recommended Specialist</p>
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 }}
                          className="text-xl font-bold text-[#1E293B]"
                        >
                          {result.specialist}
                        </motion.p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-[#94A3B8] mb-0.5">Confidence</p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="text-2xl font-bold text-[#2563EB]"
                        >
                          {result.confidence}%
                        </motion.p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="mb-5">
                      <ConfidenceBar value={result.confidence} />
                    </div>

                    {/* Reason */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Reason</p>
                      <p className="text-sm text-[#475569] leading-relaxed">{result.reason}</p>
                    </div>
                  </div>

                  {/* ── Insights Grid ── */}
                  <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-3"
                  >
                    {result.insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        variants={childFadeUp}
                        whileHover={{ y: -3, transition: { duration: 0.18 } }}
                        className="bg-white border border-[#E2E8F0] rounded-2xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: insight.color + "12", color: insight.color }}
                        >
                          {insight.icon}
                        </div>
                        <p className="text-[10px] text-[#94A3B8] font-medium mb-0.5">{insight.label}</p>
                        <p className="text-sm font-bold text-[#1E293B] leading-tight">{insight.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* ── Book Now CTA ── */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-2xl text-sm font-bold transition-colors shadow-md shadow-blue-100"
                  >
                    <CheckCircle2 size={16} />
                    Book Recommended Specialist
                    <ChevronRight size={15} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
