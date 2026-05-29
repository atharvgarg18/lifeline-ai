"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
   Navigation, Activity,
  Brain, Star, CheckCircle2, TrendingUp, Clock,
  Heart, Building2, Shield, ChevronRight,
  Signal, Zap, AlertTriangle, Wind, BarChart3,
  Users, Phone, ArrowUp,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   SHARED PRIMITIVES
───────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

function GlassCard({
  children,
  className = "",
  glowColor = "rgba(83,115,165,0.10)",
  borderColor = "rgba(180,165,145,0.35)",
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2 }}
      className={`relative rounded-[30px] overflow-hidden backdrop-blur-xl ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(233,225,214,0.96) 0%, rgba(217,206,192,0.98) 100%)",

        border: `1px solid ${
          hovered
            ? "rgba(83,115,165,0.28)"
            : borderColor
        }`,

        boxShadow: hovered
          ? `0 18px 45px rgba(91,74,57,0.14),
             0 0 0 1px rgba(83,115,165,0.08),
             inset 0 1px 0 rgba(255,255,255,0.4)`
          : `0 10px 30px rgba(91,74,57,0.10),
             inset 0 1px 0 rgba(255,255,255,0.35)`,

        transition: "all .35s ease",
        ...style,
      }}
    >
      {/* soft grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* top glow */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(83,115,165,0.35), transparent)",
        }}
      />

      {/* ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at top left,
              rgba(255,255,255,0.45) 0%,
              transparent 55%
            )
          `,
          opacity: hovered ? 1 : 0.7,
          transition: "opacity .4s ease",
        }}
      />

      <div
        className="
          relative z-10
          before:absolute before:inset-0
          before:rounded-[inherit]
          before:border before:border-white/[0.10]
          before:pointer-events-none
        "
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   LIVE MAP SECTION
───────────────────────────────────────────── */
function LiveMapCard() {
  const ambulanceX = useRef(0);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((p) => (p >= 1 ? 0 : p + 0.004));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Path: user(100,280) → curve → hospital(510,200)
  const pathPoints = {
    x: 100 + (510 - 100) * pos,
    y: 280 + Math.sin(pos * Math.PI) * -90,
  };

  const trafficItems = [
    { color: "#22c55e", label: "Low" },
    { color: "#eab308", label: "Moderate" },
    { color: "#f97316", label: "High" },
    { color: "#ef4444", label: "Severe" },
    { color: "#5373a5", label: "Green Corridor", dashed: true },
  ];

  return (
    <GlassCard delay={0} glowColor="rgba(6,182,212,0.15)" className="h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.25)" }}>
            <Navigation size={15} className="text-[#5373a5]" />
          </div>
          <div>
            <h2 className="text-[#2f2a24] font-bold text-base leading-tight" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.5px" }}>
              Live Emergency Map
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7d7468] hover:text-[#5373a5] transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-lg font-bold leading-none mb-0.5">+</span>
          </button>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7d7468] hover:text-[#5373a5] transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-lg font-bold leading-none mb-0.5">−</span>
          </button>
        </div>
      </div>

      {/* Map body */}
      <div className="relative mx-4 mb-4 rounded-2xl overflow-hidden" style={{ height: "290px" }}>
        {/* Dark map background */}
        <svg width="100%" height="100%" viewBox="0 0 640 340" className="absolute inset-0">
          {/* dark bg */}
          <rect width="640" height="340" fill="#d8cec1" />
          {/* grid */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 48} y1="0" x2={i * 48} y2="340" stroke="rgba(6,182,212,0.04)" strokeWidth="1" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 48} x2="640" y2={i * 48} stroke="rgba(6,182,212,0.04)" strokeWidth="1" />
          ))}

          {/* Road network - subtle */}
          {[
            "M 0 170 Q 200 160 320 180 Q 440 200 640 170",
            "M 0 260 L 640 240",
            "M 200 0 L 180 340",
            "M 400 0 L 420 340",
            "M 320 0 Q 310 170 300 340",
            "M 80 0 L 70 340",
            "M 550 0 L 540 340",
            "M 0 90 L 640 80",
            "M 0 310 L 640 295",
          ].map((d, i) => (
            <path key={i} d={d} stroke="rgba(120,105,90,0.22)" strokeWidth="6" fill="none" />
          ))}
          {[
            "M 0 170 Q 200 160 320 180 Q 440 200 640 170",
            "M 0 260 L 640 240",
            "M 200 0 L 180 340",
            "M 400 0 L 420 340",
          ].map((d, i) => (
            <path key={`r2-${i}`} d={d} stroke="rgba(120,105,90,0.15)" strokeWidth="3" fill="none" />
          ))}

          {/* Road labels */}
          {[
            { x: 60, y: 155, label: "MG Road" },
            { x: 430, y: 155, label: "Park Street" },
            { x: 195, y: 120, label: "Forest Road" },
          ].map(({ x, y, label }) => (
            <text key={label} x={x} y={y} fill="rgba(100,140,200,0.5)" fontSize="9" fontFamily="monospace">{label}</text>
          ))}

          {/* GREEN CORRIDOR glowing route */}
          <motion.path
            d="M 100 280 Q 200 200 300 240 Q 380 270 510 200"
            stroke="rgba(6,182,212,0.15)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            d="M 100 280 Q 200 200 300 240 Q 380 270 510 200"
            stroke="#22c55e"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8 4"
            animate={{ strokeDashoffset: [0, -48] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 100 280 Q 200 200 300 240 Q 380 270 510 200"
            stroke="rgba(34,197,94,0.5)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />

          {/* User location */}
          <motion.circle cx="100" cy="280" r="16" fill="rgba(59,130,246,0.15)"
            animate={{ r: [16, 22, 16] }} transition={{ duration: 2, repeat: Infinity }} />
          <circle cx="100" cy="280" r="9" fill="#3b82f6" />
          <circle cx="100" cy="280" r="4" fill="white" />

          {/* Hospital marker */}
          <motion.circle cx="510" cy="200" r="18" fill="rgba(239,68,68,0.15)"
            animate={{ r: [18, 24, 18] }} transition={{ duration: 1.8, repeat: Infinity }} />
          <rect x="495" y="185" width="30" height="30" rx="8" fill="#dc2626" />
          <text x="510" y="205" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">H</text>

          {/* Moving ambulance */}
          <g transform={`translate(${pathPoints.x - 14}, ${pathPoints.y - 9})`}>
            <motion.rect width="28" height="18" rx="5" fill="#0f2040" stroke="#5373a5" strokeWidth="1.5" />
            <rect x="2" y="5" width="24" height="3" fill="#dc2626" />
            <text x="14" y="14" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">🚑</text>
            <motion.rect x="4" y="1" width="8" height="4" rx="2" fill="#dc2626"
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
            <motion.rect x="16" y="1" width="8" height="4" rx="2" fill="#5373a5"
              animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.5, repeat: Infinity }} />
          </g>

          {/* Glow under ambulance */}
          <motion.ellipse cx={pathPoints.x} cy={pathPoints.y + 12} rx="18" ry="5"
            fill="rgba(6,182,212,0.25)"
            animate={{ rx: [18, 22, 18] }} transition={{ duration: 1.2, repeat: Infinity }} />
        </svg>

        {/* Legend overlay */}
        <div className="absolute bottom-3 left-3 rounded-xl p-3"
          style={{ background: "rgba(244,238,230,0.92)", border: "1px solid rgba(120,105,90,0.16)", backdropFilter: "blur(8px)" }}>
          <div className="flex flex-col gap-1.5">
            {[
              { color: "#3b82f6", label: "Your Location", shape: "circle" },
              { color: "#5373a5", label: "Ambulance", shape: "rect" },
              { color: "#dc2626", label: "Hospital", shape: "rect" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[#7d7468] text-xs">{label}</span>
              </div>
            ))}
            <div className="mt-1 pt-1 border-t border-slate-800">
              <p className="text-[#6f6559] text-xs mb-1 font-semibold uppercase tracking-wide">Traffic</p>
              {trafficItems.map(({ color, label, dashed }) => (
                <div key={label} className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-1.5 rounded-full flex-shrink-0" style={{ background: dashed ? "transparent" : color, border: dashed ? `1.5px dashed ${color}` : "none" }} />
                  <span className="text-[#7d7468] text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Emergency Panel - floating right inside map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 right-3 rounded-2xl p-4"
          style={{
            background: "rgba(244,238,230,0.95)",
            border: "1px solid rgba(34,197,94,0.35)",
            backdropFilter: "blur(12px)",
            width: "190px",
            boxShadow: "0 0 24px rgba(34,197,94,0.12)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }} />
            <span className="text-emerald-400 text-xs font-bold tracking-wide">Active Emergency</span>
          </div>
          <p className="text-[#7d7468] text-xs mb-1">Ambulance is on the way</p>
          <p className="text-[#2f2a24] text-3xl font-black mb-0.5" style={{ fontFamily: "Rajdhani, sans-serif" }}>6 mins</p>
          <p className="text-[#6f6559] text-xs mb-3">Estimated Arrival Time</p>

          <div className="border-t border-slate-800 pt-3">
            <p className="text-[#6f6559] text-xs mb-1">Patient</p>
            <p className="text-[#2f2a24] text-sm font-bold">Rohan Verma, 24 M</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-3 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-[#2f2a24]"
            style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}
          >
            View Details <ChevronRight size={11} />
          </motion.button>

          <div className="mt-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[#6f6559] text-xs">Green Corridor</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} className="w-1 rounded-full bg-emerald-400"
                    style={{ height: `${4 + i * 3}px` }}
                    animate={{ scaleY: [1, 1.4, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
            <p className="text-emerald-400 text-xs font-bold">Active</p>
            <p className="text-[#6f6559] text-xs">Traffic signals optimized ahead</p>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────────────────
   AI TRIAGE CARD
───────────────────────────────────────────── */
function CircularProgress({ value, size = 90, strokeWidth = 7, color = "#5373a5" }: {
  value: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(30,58,95,0.6)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-xl font-black text-[#2f2a24]"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {value}%
        </motion.span>
        <span className="text-[#6f6559] text-xs">confidence</span>
      </div>
    </div>
  );
}

function AITriageCard() {
  const symptoms = [
    { label: "Chest Pain", color: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.4)", text: "#fca5a5" },
    { label: "Shortness of Breath", color: "rgba(249,115,22,0.2)", border: "rgba(249,115,22,0.35)", text: "#fdba74" },
    { label: "Dizziness", color: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.35)", text: "#c4b5fd" },
  ];

  return (
    <GlassCard delay={0.1} className="min-h-[360px]" glowColor="rgba(239,68,68,0.12)" borderColor="rgba(239,68,68,0.2)">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              animate={{ boxShadow: ["0 0 0px rgba(239,68,68,0.3)", "0 0 16px rgba(239,68,68,0.5)", "0 0 0px rgba(239,68,68,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain size={18} className="text-red-400" />
            </motion.div>
            <div>
              <h3 className="text-[#2f2a24] font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.5px" }}>
                AI Triage Assessment
              </h3>
              <p className="text-[#6f6559] text-xs">Based on your symptoms</p>
            </div>
          </div>
          {/* High Priority Badge */}
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}
            animate={{ boxShadow: ["0 0 0px rgba(239,68,68,0.3)", "0 0 12px rgba(239,68,68,0.5)", "0 0 0px rgba(239,68,68,0.3)"] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
            <span className="text-red-400 text-xs font-black tracking-wide uppercase">High Priority</span>
          </motion.div>
        </div>

        {/* Cyber HUD scan line */}
        <div className="relative rounded-2xl mb-4 overflow-hidden p-4"
          style={{ background: "rgba(6,182,212,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
          <motion.div
            className="absolute left-0 right-0 h-0.5 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#7d7468] text-xs font-semibold uppercase tracking-[0.22em] mb-3">Symptoms Detected</p>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(({ label, color, border, text }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: color, border: `1px solid ${border}`, color: text }}
              >
                {label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Confidence + Specialist */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[#6f6559] text-xs uppercase tracking-[0.22em] mb-2">Recommended Specialist</p>
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart size={18} className="text-[#5373a5]" />
              </motion.div>
              <div>
                <p className="text-[#2f2a24] font-bold text-sm">Cardiologist</p>
                <p className="text-emerald-400 text-xs">Available Now</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[#6f6559] text-xs uppercase tracking-[0.22em] mb-1">AI Confidence</p>
            <CircularProgress value={92} size={84} color="#5373a5" />
          </div>
        </div>

        {/* Vitals mini grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "Heart Rate", value: "118", unit: "bpm", color: "#ef4444", Icon: Activity },
            { label: "SpO2", value: "94", unit: "%", color: "#5373a5", Icon: Wind },
            { label: "BP", value: "148/92", unit: "mmHg", color: "#f97316", Icon: BarChart3 },
          ].map(({ label, value, unit, color, Icon }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Icon size={13} className="mx-auto mb-1" style={{ color }} />
              <p className="text-[#2f2a24] font-black text-base leading-tight" style={{ fontFamily: "Rajdhani, sans-serif", color }}>{value}</p>
              <p className="text-[#6f6559] text-xs">{unit}</p>
              <p className="text-[#6f6559] text-xs leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────────────────
   DOCTOR & NURSE ASSIGNMENT CARD
───────────────────────────────────────────── */
function Avatar({ initials, color, size = 56 }: { initials: string; color: string; size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className="rounded-full flex items-center justify-center font-black text-[#2f2a24] relative"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}dd 0%, ${color}88 100%)`,
        border: `2px solid ${color}66`,
        boxShadow: `0 0 16px ${color}44`,
        fontSize: size / 3,
        fontFamily: "Rajdhani, sans-serif",
      }}
    >
      {initials}
      <motion.div
        className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11}
          className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-700"}
          fill={i < Math.floor(rating) ? "#fbbf24" : "transparent"}
        />
      ))}
      <span className="text-amber-400 text-xs font-bold ml-1">{rating}</span>
    </div>
  );
}

function PersonnelCard({
  role, name, specialty, rating, initials, avatarColor, delay,
}: {
  role: string; name: string; specialty: string; rating: number;
  initials: string; avatarColor: string; delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay ?? 0 }}
      whileHover={{ y: -1.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.18)",
        border: hovered ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(120,105,90,0.16)",
        boxShadow: hovered ? "0 0 20px rgba(6,182,212,0.1)" : "none",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      <p className="text-[#6f6559] text-xs uppercase tracking-[0.22em] mb-3 font-semibold">{role}</p>
      <div className="flex items-center gap-3">
        <Avatar initials={initials} color={avatarColor} />
        <div className="flex-1">
          <p className="text-[#2f2a24] font-bold text-sm">{name}</p>
          <p className="text-[#7d7468] text-xs mb-1">{specialty}</p>
          <StarRating rating={rating} />
        </div>
        <motion.div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
          animate={{ boxShadow: hovered ? "0 0 12px rgba(6,182,212,0.4)" : "none" }}
          transition={{ duration: 0.3 }}
        >
          <Phone size={13} className="text-[#5373a5]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DoctorNurseCard() {
  return (
    <GlassCard delay={0.2} className="min-h-[360px]" glowColor="rgba(6,182,212,0.1)">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
            <Users size={18} className="text-[#5373a5]" />
          </div>
          <div>
            <h3 className="text-[#2f2a24] font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.5px" }}>
              Doctor & Nurse Assignment
            </h3>
            <p className="text-[#6f6559] text-xs">Emergency Response Team</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <PersonnelCard
            role="Assigned Doctor" name="Dr. Arjun Mehta" specialty="Cardiologist"
            rating={4.8} initials="AM" avatarColor="#0891b2" delay={0.25}
          />
          <PersonnelCard
            role="Assigned Nurse" name="Nurse Priya Singh" specialty="ER Nurse"
            rating={4.7} initials="PS" avatarColor="#7c3aed" delay={0.35}
          />
        </div>

        {/* Status banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.25)",
            boxShadow: "0 0 16px rgba(34,197,94,0.06)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
          </motion.div>
          <p className="text-emerald-300 text-xs font-semibold leading-snug">
            Team notified and preparing for arrival
          </p>
        </motion.div>

        {/* ETA mini timeline */}
        <div className="mt-auto pt-3 border-t border-slate-800">
          <p className="text-[#6f6559] text-xs uppercase tracking-[0.22em] mb-3 font-semibold">Response Timeline</p>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: "linear-gradient(180deg, #5373a5, #22c55e)" }} />
            {[
              { label: "Emergency Reported", time: "08:21", done: true },
              { label: "Team Dispatched", time: "08:23", done: true },
              { label: "ETA: 6 mins", time: "08:29", done: false },
            ].map(({ label, time, done }, i) => (
              <div key={label} className="flex items-center gap-4 mb-3 pl-8 relative">
                <div className="absolute left-1.5 w-3 h-3 rounded-full border-2 flex items-center justify-center"
                  style={{
                    background: done ? "#22c55e" : "rgba(6,182,212,0.2)",
                    borderColor: done ? "#22c55e" : "#5373a5",
                    boxShadow: done ? "0 0 8px rgba(34,197,94,0.6)" : "0 0 8px rgba(6,182,212,0.4)",
                  }} />
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${done ? "text-[#2f2a24]" : "text-[#5373a5]"}`}>{label}</p>
                </div>
                <span className="text-[#6f6559] text-xs">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────────────────
   BOTTOM ANALYTICS ROW
───────────────────────────────────────────── */
const analyticsData = [
  { label: "Total Emergencies", value: "1,248", unit: "Today", icon: AlertTriangle, color: "#ef4444", trend: "+12%", iconBg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.2)" },
  { label: "Response Time", value: "08:24", unit: "Avg. Time", icon: Clock, color: "#5373a5", trend: "-0:42", iconBg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.2)" },
  { label: "Ambulances Active", value: "32", unit: "On Duty", icon: Zap, color: "#22c55e", trend: "+4", iconBg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.2)" },
  { label: "Hospitals Online", value: "98", unit: "Connected", icon: Building2, color: "#a78bfa", trend: "100%", iconBg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.2)" },
  { label: "Lives Saved", value: "12,540", unit: "This Month", icon: Heart, color: "#f43f5e", trend: "+284", iconBg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.2)" },
  { label: "Success Rate", value: "96.8%", unit: "This Month", icon: TrendingUp, color: "#5373a5", trend: "+2.1%", iconBg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.2)" },
];

function AnalyticsCard({ label, value, unit, icon: Icon, color, trend, iconBg, border, delay }: {
  label: string; value: string; unit: string; icon: any;
  color: string; trend: string; iconBg: string; border: string; delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-3xl p-4 overflow-hidden cursor-pointer min-h-[115px]"
      style={{
        background:
  "linear-gradient(145deg, rgba(244,238,230,0.95) 0%, rgba(226,216,203,0.98) 100%)",
        border: `1px solid ${hovered ? color + "55" : border}`,
        boxShadow: hovered
          ? `0 0 32px ${color}22, 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)`,
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* ambient */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ background: `radial-gradient(circle at 20% 80%, ${color}0a 0%, transparent 60%)`, opacity: hovered ? 1 : 0.4, transition: "opacity 0.4s" }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: iconBg, border: `1px solid ${color}33` }}
            animate={hovered ? { boxShadow: `0 0 20px ${color}44` } : { boxShadow: "none" }}
            transition={{ duration: 0.3 }}
          >
            <Icon size={20} style={{ color }} />
          </motion.div>
          <motion.div
            className="flex items-center gap-1 px-2 py-1 rounded-xl"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
          >
            <ArrowUp size={10} style={{ color }} />
            <span className="text-xs font-bold" style={{ color }}>{trend}</span>
          </motion.div>
        </div>

        <motion.p
          className="text-2xl font-black text-[#2f2a24] mb-0.5"
          style={{ fontFamily: "Rajdhani, sans-serif", color: hovered ? color : "#2f2a24", transition: "color 0.3s" }}
        >
          {value}
        </motion.p>
        <p className="text-[#6f6559] text-xs mb-0.5">{unit}</p>
        <p className="text-[#7d7468] text-xs font-medium">{label}</p>

        {/* subtle bar */}
        <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
            initial={{ width: "0%" }}
            animate={{ width: "72%" }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   RIGHT SIDEBAR CARDS (Quick Services + Recent Alerts)
───────────────────────────────────────────── */
function QuickServicesCard() {
  const services = [
    { label: "Blood Bank", color: "#ef4444", bg: "rgba(239,68,68,0.15)", Icon: Droplets },
    { label: "Pharmacy", color: "#22c55e", bg: "rgba(34,197,94,0.15)", Icon: PillIcon },
    { label: "Video Call Doctor", color: "#a78bfa", bg: "rgba(167,139,250,0.15)", Icon: VideoIcon },
    { label: "First Aid Guide", color: "#f43f5e", bg: "rgba(244,63,94,0.15)", Icon: Shield },
  ];

  return (
    <GlassCard delay={0.15} glowColor="rgba(6,182,212,0.08)">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#2f2a24] font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Quick Services
            </h3>
          <Zap size={14} className="text-[#5373a5]" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {services.map(({ label, color, bg, Icon }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.08, y: -1.5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 p-2 rounded-2xl"
              style={{ background: bg, border: `1px solid ${color}33` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}22` }}>
                <Icon size={18} color={color} />
              </div>
              <span className="text-xs text-[#4B5563] text-center leading-tight font-medium" style={{ fontSize: "9px" }}>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// Mini icon components (inline SVG stand-ins)
function Droplets({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}

function PillIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

function VideoIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

function RecentAlertsCard() {
  const alerts = [
    { icon: AlertTriangle, label: "Accident Reported", sub: "Ring Road, Sector 12", time: "2 min ago", color: "#ef4444" },
    { icon: Signal, label: "High Traffic", sub: "MG Road", time: "5 min ago", color: "#f97316" },
    { icon: Building2, label: "Hospital Full", sub: "City Care Hospital", time: "10 min ago", color: "#eab308" },
  ];

  return (
    <GlassCard delay={0.25} glowColor="rgba(239,68,68,0.08)" borderColor="rgba(239,68,68,0.15)">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#2f2a24] font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Recent Alerts
            </h3>
          <button className="text-[#5373a5] text-xs font-semibold flex items-center gap-0.5 hover:text-[#6d86ad] transition-colors">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {alerts.map(({ icon: Icon, label, sub, time, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2f2a24] text-xs font-semibold truncate">{label}</p>
                <p className="text-[#6f6559] text-xs truncate">{sub}</p>
              </div>
              <span className="text-slate-600 text-xs whitespace-nowrap flex-shrink-0">{time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────── */
export default function EmergencyCommandCenter() {
  return (
    <section
  className="relative overflow-hidden w-full px-0 md:px-0 space-y-5"

      style={{
        background: "transparent",
      }}
    >
      {/* premium overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0.04), rgba(0,0,0,0.02))",
        }}
      />

      {/* ambient glow */}
      <div
        className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(83,115,165,0.22), transparent 70%)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)",
        }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center gap-3 mb-4 px-1"
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#5373a5" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />

          <span
            className="text-xs font-black uppercase tracking-[0.22em]"
            style={{ color: "#3b4d68" }}
          >
            Live Emergency Command Center
          </span>
        </div>

        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(83,115,165,0.45), transparent)",
          }}
        />
      </motion.div>

      {/* Analytics */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-4">
        {analyticsData.map((item, i) => (
          <AnalyticsCard
            key={item.label}
            {...item}
            delay={0.35 + i * 0.07}
          />

        ))}
      {/* Main Grid */}
      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

  <div className="xl:col-span-8">
    <LiveMapCard />
  </div>

  <div className="xl:col-span-4 flex flex-col gap-4">
    <QuickServicesCard />
    <RecentAlertsCard />
  </div>

</div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">
          <AITriageCard />
          <DoctorNurseCard />
        </div>
      </div>
      
      </div>
    </section>
  );
}
