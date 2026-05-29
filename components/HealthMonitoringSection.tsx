"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Heart, Activity, Wind, Thermometer, Clock, ChevronRight,
  Phone, MessageSquare, User, Brain, CheckCircle, Calendar,
  Pill, ShoppingCart, Home, FlaskConical, Package,
  AlertCircle, Zap, Video, Search, Star, MapPin,
  TrendingUp, Shield, Bell, ArrowRight, Plus, Check,
} from "lucide-react";

/* ────────────────────────────────────────────
   SHARED PRIMITIVES
──────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

function GlassCard({
  children, className = "", glow = "cyan", delay = 0, style = {},
}: {
  children: React.ReactNode; className?: string;
  glow?: "cyan" | "red" | "purple" | "green" | "none";
  delay?: number; style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  const glowMap: Record<string, string> = {
    cyan:   "rgba(6,182,212,0.18)",
    red:    "rgba(239,68,68,0.18)",
    purple: "rgba(167,139,250,0.18)",
    green:  "rgba(34,197,94,0.18)",
    none:   "transparent",
  };
  const borderMap: Record<string, string> = {
    cyan:   "rgba(6,182,212,0.35)",
    red:    "rgba(239,68,68,0.35)",
    purple: "rgba(167,139,250,0.35)",
    green:  "rgba(34,197,94,0.35)",
    none:   "rgba(30,58,95,0.7)",
  };
  const color = glowMap[glow] ?? glowMap.cyan;
  const border = borderMap[glow] ?? borderMap.cyan;
  return (
    <motion.div
      {...fadeUp(delay)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3 }}
      className={`relative rounded-3xl overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(145deg,rgba(10,20,46,0.97) 0%,rgba(5,11,23,0.99) 100%)",
        border: `1px solid ${hovered ? border : "rgba(30,58,95,0.8)"}`,
        boxShadow: hovered
          ? `0 0 40px ${color}, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 6px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)`,
        transition: "border 0.3s, box-shadow 0.3s",
        ...style,
      }}
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ background: `radial-gradient(ellipse at 10% 10%, ${color} 0%, transparent 55%)`, opacity: hovered ? 0.8 : 0.3, transition: "opacity 0.4s" }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-5">
      <div className="flex items-center gap-2">
        <motion.div className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(6,182,212,0.4),transparent)" }} />
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   1. REAL-TIME HEALTH MONITOR
──────────────────────────────────────────── */
function HeartbeatLine() {
  return (
    <svg viewBox="0 0 120 32" className="w-full h-8">
      <motion.polyline
        points="0,16 10,16 15,6 20,26 25,4 30,28 35,16 120,16"
        fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.8))" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

function VitalRow({ icon: Icon, label, value, unit, color, normal }: {
  icon: any; label: string; value: string; unit: string; color: string; normal?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/50 last:border-0">
      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={13} style={{ color }} />
      </div>
      <span className="text-slate-400 text-xs flex-1">{label}</span>
      <span className="font-black text-sm" style={{ color, fontFamily: "Rajdhani, sans-serif" }}>{value}</span>
      <span className="text-slate-500 text-xs w-10 text-right">{unit}</span>
    </div>
  );
}

function BodySVG() {
  return (
    <div className="relative flex items-center justify-center" style={{ height: "140px" }}>
      {/* Glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-36 rounded-full" style={{ background: "radial-gradient(ellipse,rgba(6,182,212,0.12) 0%,transparent 70%)" }} />
      </div>
      <svg viewBox="0 0 120 220" className="h-36 relative z-10" style={{ filter: "drop-shadow(0 0 12px rgba(6,182,212,0.35))" }}>
        {/* Body outline */}
        <ellipse cx="60" cy="28" rx="20" ry="22" fill="none" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" />
        {/* Neck */}
        <rect x="53" y="48" width="14" height="12" rx="4" fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" />
        {/* Torso */}
        <path d="M28 60 Q20 75 22 130 L38 140 L82 140 L98 130 Q100 75 92 60 Z" fill="none" stroke="rgba(6,182,212,0.55)" strokeWidth="1.5" />
        {/* Arms */}
        <path d="M28 62 Q10 80 8 115 Q8 125 14 128" fill="none" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M92 62 Q110 80 112 115 Q112 125 106 128" fill="none" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Legs */}
        <path d="M42 140 Q36 165 34 195 Q34 205 42 206" fill="none" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M78 140 Q84 165 86 195 Q86 205 78 206" fill="none" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Grid scan lines */}
        {[70, 85, 100, 115].map((y) => (
          <motion.line key={y} x1="25" y1={y} x2="95" y2={y} stroke="rgba(6,182,212,0.08)" strokeWidth="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: y / 100 }} />
        ))}
        {/* Heart */}
        <motion.path d="M52 85 Q52 78 60 83 Q68 78 68 85 Q68 92 60 99 Q52 92 52 85Z"
          fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="1.5"
          animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: "60px 88px", filter: "drop-shadow(0 0 6px rgba(239,68,68,0.8))" }}
        />
        {/* Lungs highlight */}
        <ellipse cx="50" cy="95" rx="10" ry="13" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1"
          style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.4))" }} />
        <ellipse cx="70" cy="95" rx="10" ry="13" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1"
          style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.4))" }} />
        {/* Spine dots */}
        {[110, 120, 130].map((y) => (
          <circle key={y} cx="60" cy={y} r="1.5" fill="rgba(6,182,212,0.5)" />
        ))}
        {/* Scan line */}
        <motion.line x1="22" y1="60" x2="98" y2="60" stroke="rgba(6,182,212,0.6)" strokeWidth="1"
          animate={{ y1: [60, 200, 60], y2: [60, 200, 60] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.9))" }}
        />
      </svg>
    </div>
  );
}

function HealthMonitorCard() {
  return (
    <GlassCard glow="cyan" delay={0}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}>
              <Activity size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.5px" }}>
                Real-time Health Monitor
              </h3>
              <p className="text-slate-500 text-xs">Live Vitals</p>
            </div>
          </div>
          <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        </div>

        <BodySVG />

        <div className="mt-3">
          <VitalRow icon={Heart} label="Heart Rate" value="92" unit="bpm" color="#ef4444" />
          <VitalRow icon={Activity} label="Blood Pressure" value="120/80" unit="mmHg" color="#06b6d4" />
          <VitalRow icon={Wind} label="Oxygen Level" value="98%" unit="SpO₂" color="#22c55e" />
          <VitalRow icon={TrendingUp} label="Respiratory Rate" value="18" unit="/min" color="#a78bfa" />
        </div>

        <div className="mt-3">
          {/* <HeartbeatLine /> */}
          <div className="h-4" />
        </div>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   2. MEDICINE REMINDER
──────────────────────────────────────────── */
function MedicineReminderCard() {
  const meds = [
    { name: "Augmentin 625", dose: "1 Tablet after food", time: "09:00 AM", done: false, color: "#06b6d4" },
    { name: "Montelukast 10mg", dose: "1 Tablet at night", time: "09:00 PM", done: false, color: "#a78bfa" },
  ];
  return (
    <GlassCard glow="purple" delay={0.08}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
              <Pill size={16} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>Medicine Reminder</h3>
            </div>
          </div>
          <Bell size={14} className="text-slate-500" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
            animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          <span className="text-amber-400 text-xs font-bold">2 Pending Reminders</span>
        </div>

        {/* Brain / DNA visual */}
        <div className="relative rounded-2xl mb-4 overflow-hidden flex items-center justify-center"
          style={{ height: "60px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
          <svg viewBox="0 0 200 100" className="w-full h-auto opacity-60">
            {/* DNA helix */}
            {Array.from({ length: 10 }).map((_, i) => {
              const x = i * 20 + 5;
              const y1 = 50 + Math.sin(i * 0.8) * 30;
              const y2 = 50 - Math.sin(i * 0.8) * 30;
              return (
                <g key={i}>
                  <motion.circle cx={x} cy={y1} r="4" fill="rgba(167,139,250,0.7)"
                    animate={{ cy: [y1, y2, y1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} />
                  <motion.circle cx={x} cy={y2} r="4" fill="rgba(6,182,212,0.7)"
                    animate={{ cy: [y2, y1, y2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} />
                  <motion.line x1={x} y1={y1} x2={x} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                    animate={{ y1: [y1, y2, y1], y2: [y2, y1, y2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} />
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse,rgba(167,139,250,0.08) 0%,transparent 70%)" }} />
        </div>

        <div className="flex flex-col gap-2">
          {meds.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${m.color}18`, border: `1px solid ${m.color}35` }}>
                <Pill size={15} style={{ color: m.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{m.name}</p>
                <p className="text-slate-500 text-xs truncate">{m.dose}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: m.color }}>{m.time}</p>
                <ChevronRight size={12} className="text-slate-600 ml-auto mt-0.5" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(167,139,250,0.25)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-4 py-2.5 rounded-2xl text-xs font-bold text-purple-300 transition-all"
          style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}
        >
          View All Medicines
        </motion.button>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   3. EMERGENCY CONTACTS
──────────────────────────────────────────── */
function ContactAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0 relative"
      style={{ background: `linear-gradient(135deg,${color}dd,${color}66)`, border: `2px solid ${color}55`, fontFamily: "Rajdhani, sans-serif" }}>
      {initials}
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
    </div>
  );
}

function EmergencyContactsCard() {
  const contacts = [
    { name: "Rahul Verma", role: "Brother", initials: "RV", color: "#06b6d4" },
    { name: "Neha Verma", role: "Sister", initials: "NV", color: "#a78bfa" },
    { name: "Dr. Arjun Mehta", role: "Cardiologist", initials: "AM", color: "#22c55e" },
  ];
  return (
    <GlassCard glow="cyan" delay={0.16}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}>
              <User size={16} className="text-cyan-400" />
            </div>
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>Emergency Contacts</h3>
          </div>
          <button className="text-cyan-400 text-xs font-semibold flex items-center gap-0.5">
            View All <ChevronRight size={11} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {contacts.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <ContactAvatar initials={c.initials} color={c.color} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{c.name}</p>
                <p className="text-slate-500 text-xs">{c.role}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {[Phone, MessageSquare].map((Icon, j) => (
                  <motion.button key={j} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
                    className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <Icon size={12} className="text-cyan-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   4. HEALTH HISTORY TIMELINE
──────────────────────────────────────────── */
function HealthHistoryCard() {
  const events = [
 {
   date:"15 May 2025",
   label:"ECG Test",
   status:"Normal",
   color:"#22c55e"
 },
 {
   date:"12 May 2025",
   label:"Blood Test",
   status:"Normal",
   color:"#22c55e"
 }
]
  return (
    <GlassCard glow="green" delay={0.24}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <Calendar size={16} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>Health History Timeline</h3>
          </div>
          <button className="text-cyan-400 text-xs font-semibold flex items-center gap-0.5">
            View All <ArrowRight size={11} />
          </button>
        </div>

        <div className="relative pl-6">
          {/* timeline spine */}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: "linear-gradient(180deg,#22c55e,rgba(34,197,94,0.1))" }} />

          {events.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="relative mb-4 last:mb-0"
            >
              <div className="absolute -left-4 w-3 h-3 rounded-full border-2 border-emerald-400 bg-slate-900"
                style={{ boxShadow: "0 0 8px rgba(34,197,94,0.6)", top: "2px" }} />
              <div className="p-3 rounded-2xl"
                style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-bold">{e.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{e.date}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-bold"
                    style={{ background: `${e.color}18`, color: e.color, border: `1px solid ${e.color}30` }}>
                    {e.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   5. AI HEALTH RECOMMENDATIONS
──────────────────────────────────────────── */
function AIHealthCard() {
  const recs = [
    { label: "Reduce salt intake", sub: "Low Sodium Diet", match: 88, color: "#ef4444", icon: Heart },
    { label: "Daily 30 min Walk", sub: "Cardio Exercise", match: 76, color: "#06b6d4", icon: Activity },
    { label: "Regular Sleep", sub: "7-8 Hours Daily", match: 92, color: "#22c55e", icon: Shield },
  ];
  return (
    <GlassCard glow="purple" delay={0.32}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-5">
          <motion.div className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}
            animate={{ boxShadow: ["0 0 0 rgba(167,139,250,0.3)", "0 0 14px rgba(167,139,250,0.5)", "0 0 0 rgba(167,139,250,0.3)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            <Brain size={16} className="text-purple-400" />
          </motion.div>
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>AI Health Recommendations</h3>
        </div>

        {/* AI brain visual */}
        <div className="relative rounded-2xl mb-4 overflow-hidden flex items-center justify-center"
          style={{ height: "55px", background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)" }}>
          <svg viewBox="0 0 200 90" className="w-full h-auto opacity-50">
            {/* neural network nodes */}
            {[[30,45],[60,20],[60,70],[90,45],[120,20],[120,70],[150,45],[170,30],[170,60]].map(([x,y],i) => (
              <motion.circle key={i} cx={x} cy={y} r="5" fill="rgba(167,139,250,0.7)"
                animate={{ opacity: [0.4,1,0.4], r:[4,6,4] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.18 }} />
            ))}
            {/* connections */}
            {[[30,45,60,20],[30,45,60,70],[60,20,90,45],[60,70,90,45],[90,45,120,20],[90,45,120,70],[120,20,150,45],[120,70,150,45],[150,45,170,30],[150,45,170,60]].map(([x1,y1,x2,y2],i) => (
              <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(167,139,250,0.25)" strokeWidth="1"
                animate={{ opacity:[0.2,0.6,0.2] }} transition={{ duration:2, repeat:Infinity, delay:i*0.1 }} />
            ))}
          </svg>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse,rgba(167,139,250,0.1) 0%,transparent 70%)" }} />
        </div>

        <div className="flex flex-col gap-3">
          {recs.map((r, i) => (
            <motion.div key={r.label}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:`${r.color}18`, border:`1px solid ${r.color}30` }}>
                <r.icon size={14} style={{ color:r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{r.label}</p>
                <p className="text-slate-500 text-xs">{r.sub}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="relative w-10 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.08)" }}>
                  <motion.div className="absolute h-auto rounded-full" style={{ background: r.color }}
                    initial={{ width:"0%" }} animate={{ width:`${r.match}%` }}
                    transition={{ duration:1.2, delay:0.5 + i*0.1 }} />
                </div>
                <span className="text-xs font-black" style={{ color:r.color, fontFamily:"Rajdhani,sans-serif" }}>{r.match}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   6. PHARMACY & SERVICES
──────────────────────────────────────────── */
function PharmacyCard() {
  const services = [
    { label:"Order Medicine", icon:ShoppingCart, color:"#06b6d4", bg:"rgba(6,182,212,0.12)" },
    { label:"Home Delivery", icon:Home,          color:"#22c55e", bg:"rgba(34,197,94,0.12)" },
    { label:"Lab Tests",     icon:FlaskConical,  color:"#a78bfa", bg:"rgba(167,139,250,0.12)" },
    { label:"Health Packages",icon:Package,      color:"#f43f5e", bg:"rgba(244,63,94,0.12)" },
  ];
  return (
    <GlassCard glow="cyan" delay={0.40}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background:"rgba(6,182,212,0.15)", border:"1px solid rgba(6,182,212,0.3)" }}>
            <ShoppingCart size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm" style={{ fontFamily:"Rajdhani,sans-serif" }}>Pharmacy & Services</h3>
            <p className="text-slate-500 text-xs">Quick Access</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.2, repeat:Infinity }} />
          <span className="text-cyan-400 text-xs font-semibold">Quick Access</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {services.map(({ label, icon:Icon, color, bg }) => (
            <motion.button key={label}
              whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.96 }}
              className="flex flex-col items-center gap-2 p-2.5 rounded-2xl"
              style={{ background:bg, border:`1px solid ${color}25` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background:`${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-slate-300 font-medium leading-tight text-center" style={{ fontSize:"10px" }}>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   7. QUICK ACTIONS
──────────────────────────────────────────── */
function QuickActionsCard() {
  return (
    <GlassCard glow="red" delay={0.48}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)" }}>
            <Zap size={16} className="text-red-400" />
          </div>
          <h3 className="text-white font-bold text-sm" style={{ fontFamily:"Rajdhani,sans-serif" }}>Quick Actions</h3>
        </div>

        {/* Emergency SOS Big Button */}
        <motion.button
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
          className="w-full flex items-center gap-3 px-4 py-3rounded-2xl mb-3 relative overflow-hidden"
          style={{
            background:"linear-gradient(135deg,#dc2626 0%,#991b1b 100%)",
            border:"1px solid rgba(255,100,100,0.35)",
            boxShadow:"0 0 24px rgba(239,68,68,0.35)",
          }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{ background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.35) 50%,transparent 60%)" }} />
          <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15"
            animate={{ scale:[1,1.12,1] }} transition={{ duration:1.4, repeat:Infinity }}>
            <AlertCircle size={20} className="text-white" />
          </motion.div>
          <div className="text-left">
            <p className="text-red-200 text-xs font-semibold">Emergency</p>
            <p className="text-white text-lg
             font-black leading-tight" style={{ fontFamily:"Rajdhani,sans-serif" }}>SOS</p>
          </div>
          <motion.div className="ml-auto w-2 h-2 rounded-full bg-white"
            animate={{ opacity:[1,0.3,1] }} transition={{ duration:0.7, repeat:Infinity }} />
        </motion.button>

        {[
          { label:"Video Call Doctor", icon:Video,  color:"#06b6d4", bg:"rgba(6,182,212,0.12)", border:"rgba(6,182,212,0.25)" },
          { label:"Find Ambulance",    icon:Search, color:"#22c55e", bg:"rgba(34,197,94,0.12)", border:"rgba(34,197,94,0.25)" },
        ].map(({ label, icon:Icon, color, bg, border }) => (
          <motion.button key={label}
            whileHover={{ scale:1.02, boxShadow:`0 0 16px ${color}33` }} whileTap={{ scale:0.97 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 last:mb-0"
            style={{ background:bg, border:`1px solid ${border}` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:`${color}20` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <span className="text-white text-sm font-semibold">{label}</span>
            <ChevronRight size={13} className="text-slate-500 ml-auto" />
          </motion.button>
        ))}
      </div>
    </GlassCard>
  );
}

/* ────────────────────────────────────────────
   ROOT EXPORT
──────────────────────────────────────────── */
export default function HealthMonitoringSection() {
  return (
    <section className="w-full pt-4"
      style={{ background:"transparent" }}>

      <SectionLabel label="Health Monitoring & Quick Access" />

      {/* ROW 1: Health Monitor | Medicine Reminder | Emergency Contacts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

  <div className="xl:col-span-4">
    <HealthMonitorCard />
  </div>

  <div className="xl:col-span-4">
    <MedicineReminderCard />
  </div>

  <div className="xl:col-span-4">
    <EmergencyContactsCard />
  </div>

  <div className="xl:col-span-3">
    <HealthHistoryCard />
  </div>

  <div className="xl:col-span-3">
    <AIHealthCard />
  </div>

  <div className="xl:col-span-3">
    <PharmacyCard />
  </div>

  <div className="xl:col-span-3">
    <QuickActionsCard />
  </div>

</div>
    </section>
  );
}
