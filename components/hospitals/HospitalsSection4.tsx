"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  MapPin,
  Clock,
  BedDouble,
  HeartPulse,
  Star,
  Phone,
  Navigation,
  ChevronRight,
  ShieldAlert,
  Activity,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Animated Confidence Bar ──────────────────────────────────────────────────
function ConfidenceBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 400 + delay * 120);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-700">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.9, delay: 0.5 + delay * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Pulse Ring ───────────────────────────────────────────────────────────────
function PulseRing({ color }: { color: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }} />
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HospitalsSection4() {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="w-full mt-8">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">AI Recommended Hospitals</h2>
        </div>
        {/* Glow badge */}
        <motion.div
          animate={{ boxShadow: hovered ? "0 0 20px rgba(37,99,235,0.45)" : "0 0 10px rgba(37,99,235,0.25)" }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />
          <Sparkles size={10} />
          AI Recommended
        </motion.div>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
        style={{
          boxShadow: hovered
            ? "0 20px 60px rgba(37,99,235,0.10), 0 4px 20px rgba(37,99,235,0.06)"
            : "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-600 to-violet-500" />

        <div className="flex gap-0 divide-x divide-slate-100">

          {/* ══ LEFT — AI Analysis ══ */}
          <div className="flex-1 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md"
              >
                <Brain size={15} className="text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-slate-900">AI Analysis Summary</p>
                <p className="text-[11px] text-slate-400">Real-time assessment</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                <PulseRing color="#10B981" />
                Live
              </div>
            </div>

            {/* Condition + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Condition Detected</p>
                <div className="flex items-center gap-1.5">
                  <Activity size={13} className="text-red-500" />
                  <p className="text-sm font-bold text-slate-800">Cardiac Event</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Chest pain · High BP</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5">
                <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wide mb-1">Priority Level</p>
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={13} className="text-red-600" />
                  <p className="text-sm font-bold text-red-700">Critical</p>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map((d) => (
                    <div key={d} className={`h-1.5 flex-1 rounded-full ${d <= 5 ? "bg-red-500" : "bg-red-100"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested care level */}
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <HeartPulse size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide">Suggested Care Level</p>
                <p className="text-sm font-bold text-blue-800">Intensive Care Unit (ICU)</p>
              </div>
              <div className="ml-auto text-[11px] font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-xl">
                Level 1
              </div>
            </div>

            {/* Confidence bars */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Confidence Scores</p>
              <ConfidenceBar label="Emergency Severity Match" value={94} color="linear-gradient(90deg,#3B82F6,#2563EB)" delay={0} />
              <ConfidenceBar label="Distance & Availability" value={88} color="linear-gradient(90deg,#10B981,#059669)" delay={1} />
              <ConfidenceBar label="Specialist Match" value={91} color="linear-gradient(90deg,#8B5CF6,#7C3AED)" delay={2} />
              <ConfidenceBar label="ICU Readiness" value={85} color="linear-gradient(90deg,#F59E0B,#D97706)" delay={3} />
            </div>

            {/* Overall score */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl px-4 py-3">
              <div>
                <p className="text-[10px] text-blue-100 font-semibold uppercase tracking-wide">Overall Confidence</p>
                <p className="text-xl font-black text-white">92%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <Zap size={22} className="text-white" />
              </div>
            </div>
          </div>

          {/* ══ RIGHT — Hospital Card ══ */}
          <div className="w-[340px] flex-shrink-0 p-6 flex flex-col gap-4">
            {/* Top badge */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Best Match</p>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(37,99,235,0)",
                    "0 0 16px rgba(37,99,235,0.5)",
                    "0 0 0px rgba(37,99,235,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
              >
                <Sparkles size={10} />
                #1 AI Pick
              </motion.div>
            </div>

            {/* Hospital image */}
            <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop"
                alt="Apollo Hospital"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Recommendation score */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg">
                <Star size={11} className="text-amber-400" fill="#FBBF24" />
                <span className="text-xs font-black text-slate-800">4.7</span>
                <span className="text-[10px] text-slate-400">(1284)</span>
              </div>
              {/* AI score badge */}
              <div className="absolute top-3 left-3 bg-blue-600 text-white rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-lg">
                <Brain size={10} />
                <span className="text-[11px] font-black">Score 9.4/10</span>
              </div>
            </div>

            {/* Name + address */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-black text-slate-900 text-base">Apollo Hospital</p>
                <BadgeCheck size={15} className="text-blue-500" fill="#DBEAFE" />
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin size={11} />
                <p className="text-[11px]">Shankar Nagar, Raipur, CG</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: MapPin, label: "Distance", value: "1.2 km", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Clock, label: "ETA", value: "4 mins", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: BedDouble, label: "ICU Beds", value: "12 Free", color: "text-violet-600", bg: "bg-violet-50" },
                { icon: HeartPulse, label: "Emrg. Team", value: "On Standby", color: "text-red-500", bg: "bg-red-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl px-3 py-2.5 flex items-center gap-2`}>
                  <s.icon size={13} className={s.color} />
                  <div>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide leading-none">{s.label}</p>
                    <p className={`text-xs font-black ${s.color} leading-tight mt-0.5`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(37,99,235,0.28)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-2xl transition-colors"
              >
                <Navigation size={14} />
                Navigate Now
              </motion.button>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 bg-white text-slate-700 font-semibold text-xs py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  <ChevronRight size={13} />
                  View Hospital
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-xs py-2.5 rounded-xl hover:bg-emerald-100 transition-all"
                >
                  <Phone size={12} />
                  Call Hospital
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
