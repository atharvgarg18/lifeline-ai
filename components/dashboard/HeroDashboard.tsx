"use client";

import EmergencyCommandCenter from "../EmergencyCommandCenter"; 
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Phone,
  // MapPin,
  Building2,
  Shield,
  Users,
  MessageCircle,
  ChevronRight,
  Droplets,
  Pill,
  Activity,
  AlertCircle,
  Zap,
} from "lucide-react";
import HealthMonitoringSection from "../HealthMonitoringSection";
import RecentAlerts from "./RecentAlerts";
import BloodBank from "./BloodBank";
import NearbyHospitals from "./NearbyHospitals";

/* ─────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────── */
const pulse = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatY = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: "easeOut" } },
});

/* ─────────────────────────────────────────────
   Radar rings (SVG, pure decorative)
───────────────────────────────────────────── */
function RadarRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-500/20"
          style={{ width: `${i * 160}px`, height: `${i * 160}px` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {/* location pin glow */}
      <motion.div
        className="absolute w-5 h-5 rounded-full bg-red-500 shadow-[0_0_20px_6px_rgba(239,68,68,0.7)]"
        animate={{ scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Ambulance SVG illustration (inline, no img dependency)
───────────────────────────────────────────── */
function AmbulanceSVG() {
  return (
    <motion.svg
      viewBox="0 0 340 160"
      className="w-full h-full drop-shadow-[0_0_32px_rgba(239,68,68,0.55)]"
      {...floatY}
    >
      {/* glow base */}
      <ellipse cx="170" cy="145" rx="130" ry="14" fill="rgba(239,68,68,0.18)" />

      {/* body */}
      <rect x="30" y="60" width="200" height="80" rx="12" fill="#0f1c35" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* cab */}
      <path d="M230 85 L268 85 Q285 85 288 100 L290 140 L230 140 Z" fill="#0d1a30" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* red stripe */}
      <rect x="30" y="88" width="200" height="8" fill="#dc2626" />
      {/* cross */}
      <rect x="140" y="68" width="28" height="8" rx="2" fill="white" />
      <rect x="150" y="58" width="8" height="28" rx="2" fill="white" />
      {/* windows */}
      <rect x="46" y="68" width="50" height="32" rx="5" fill="#0a2040" stroke="#1e4070" strokeWidth="1" />
      <rect x="106" y="68" width="50" height="32" rx="5" fill="#0a2040" stroke="#1e4070" strokeWidth="1" />
      {/* cab window */}
      <rect x="238" y="88" width="40" height="30" rx="5" fill="#0a2040" stroke="#1e4070" strokeWidth="1" />
      {/* wheels */}
      {[75, 185, 258].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="148" r="18" fill="#111827" stroke="#374151" strokeWidth="2" />
          <circle cx={cx} cy="148" r="9" fill="#1f2937" />
          <circle cx={cx} cy="148" r="4" fill="#374151" />
        </g>
      ))}
      {/* siren lights */}
      <motion.rect x="80" y="52" width="22" height="10" rx="3" fill="#dc2626"
        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
      <motion.rect x="116" y="52" width="22" height="10" rx="3" fill="#06b6d4"
        animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.6, repeat: Infinity }} />
      {/* LIFELINE text */}
      <text x="50" y="82" fill="white" fontSize="11" fontWeight="700" fontFamily="monospace" letterSpacing="2">LIFELINE AI</text>
      {/* speed lines */}
      {[95, 108, 121].map((y, i) => (
        <motion.line key={y} x1="10" y1={y} x2={20 - i * 2} y2={y}
          stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"
          animate={{ x1: [10, -10, 10], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} />
      ))}
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   AI Robot SVG
───────────────────────────────────────────── */
function RobotSVG() {
  return (
    <motion.svg viewBox="0 0 100 120" className="w-24 h-28" {...floatY}>
      {/* glow halo */}
      <circle cx="50" cy="45" r="38" fill="rgba(6,182,212,0.08)" />
      {/* head */}
      <rect x="22" y="18" width="56" height="46" rx="14" fill="#0f2040" stroke="#06b6d4" strokeWidth="1.5" />
      {/* eyes */}
      <motion.circle cx="37" cy="38" r="7" fill="#06b6d4"
        animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <motion.circle cx="63" cy="38" r="7" fill="#06b6d4"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <circle cx="37" cy="38" r="3" fill="white" />
      <circle cx="63" cy="38" r="3" fill="white" />
      {/* smile */}
      <path d="M38 52 Q50 60 62 52" stroke="#06b6d4" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* antenna */}
      <line x1="50" y1="18" x2="50" y2="8" stroke="#06b6d4" strokeWidth="2" />
      <motion.circle cx="50" cy="6" r="4" fill="#06b6d4"
        animate={{ r: [4, 5.5, 4], opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      {/* body */}
      <rect x="28" y="66" width="44" height="32" rx="8" fill="#0a1a30" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* chest cross */}
      <rect x="46" y="74" width="8" height="16" rx="2" fill="#dc2626" />
      <rect x="40" y="80" width="20" height="6" rx="2" fill="#dc2626" />
      {/* arms */}
      <rect x="10" y="68" width="16" height="8" rx="4" fill="#0f2040" stroke="#1e3a5f" strokeWidth="1" />
      <rect x="74" y="68" width="16" height="8" rx="4" fill="#0f2040" stroke="#1e3a5f" strokeWidth="1" />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */


interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  action?: string;
  delay?: number;
  type?: "default" | "hospital" | "health" | "contacts";
}

function StatCard({
  icon,
  label,
  value,
  sub,
  subColor = "text-cyan-400",
  action,
  delay = 0,
  type = "default",
}: StatCardProps) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{
        y: -5,
        scale: 1.015,
      }}
      className="
relative overflow-hidden rounded-[28px] p-6 min-h-[145px]
before:absolute before:inset-0 before:rounded-[inherit]
before:border before:border-white/[0.03]
before:pointer-events-none
"
      style={{
        background:
          "linear-gradient(135deg, rgba(4,10,24,0.98) 0%, rgba(2,6,18,1) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 10px 35px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* glow */}
      <div
        className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{
          background: "rgba(0,217,255,0.12)",
        }}
      />

      {/* top border glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,217,255,.5), transparent)",
        }}
      />

      {/* CONTENT */}
      <div className="relative flex flex-col h-full">
        {/* TOP */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500 font-semibold mb-5 leading-relaxed">
              {label}
            </p>

            {/* DEFAULT */}
            {type === "default" && (
              <h2 className="text-[42px] leading-none font-black text-white tracking-tight">
                {value}
              </h2>
            )}

            {/* HOSPITAL */}
            {type === "hospital" && (
              <h2 className="text-[36px] leading-[0.95] font-black text-white tracking-tight">
                Apollo
                <br />
                Hospital
              </h2>
            )}

            {/* HEALTH */}
            {type === "health" && (
              <div className="text-[34px] leading-[0.9] font-black text-white tracking-tight">
                <div>LHID-</div>
                <div>2024-</div>
                <div>7845</div>
              </div>
            )}

            {/* CONTACTS */}
            {type === "contacts" && (
              <div>
                <div className="text-[42px] leading-none font-black text-white">
                  3
                </div>

                <div className="text-[30px] leading-none font-black text-white mt-1">
                  Contacts
                </div>
              </div>
            )}

            {sub && (
              <p className={`text-lg font-bold mt-4 ${subColor}`}>
                {sub}
              </p>
            )}
          </div>

          {/* ICON */}
          <div
            className="flex items-center justify-center rounded-[24px] flex-shrink-0"
            style={{
          width: 74,
              height: 74,
              background:
                "linear-gradient(180deg, rgba(0,217,255,0.14), rgba(0,217,255,0.05))",
              border: "1px solid rgba(0,217,255,0.18)",
              boxShadow: "0 0 25px rgba(0,217,255,0.08)",
            }}
          >
            {icon}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-auto pt-5">
          {action && (
            <button className="flex items-center gap-1 text-cyan-400 text-lg font-semibold hover:text-cyan-300 transition">
              {action}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero Dashboard
───────────────────────────────────────────── */
export default function HeroDashboard() {
  const [sosActive, setSosActive] = useState(false);

  return (
    <div
  className="w-full px-4 pt-2 pb-10 lg:px-6 lg:pl-6 space-y-5"
  style={{
    background:
      "linear-gradient(135deg, rgba(5,10,24,0.98) 0%, rgba(2,6,23,1) 50%, rgba(8,15,35,0.98) 100%)",
  }}
>
      {/* subtle grid texture */}
      {/* <div
  className="fixed inset-0 pointer-events-none opacity-[0.04]"
  style={{
    backgroundImage:
      "linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)",
    backgroundSize: "72px 72px",
    maskImage:
      "radial-gradient(circle at center, black 30%, transparent 100%)",
  }}
/> */}

      {/* ── Top row: SOS Hero + AI Assistant + Patient Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px] gap-4 gap-4 items-stretch">

        {/* ── Left: SOS Hero Card ── */}
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-[32px] overflow-hidden backdrop-blur-xl min-h-[360px]"
          style={{
            background: `
radial-gradient(circle at 15% 20%, rgba(255,59,92,.08), transparent 22%),
radial-gradient(circle at 85% 10%, rgba(0,217,255,.06), transparent 20%),
linear-gradient(135deg, #050B17 0%, #020817 45%, #07111F 100%)
`,
            border: "1px solid rgba(255,59,92,.22)",
boxShadow:
  "0 0 0 1px rgba(255,59,92,.04), 0 20px 60px rgba(0,0,0,.45)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* red ambient top-left */}
          <div className="absolute top-0 left-0 w-72 h-56 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
          {/* cyan ambient bottom-right */}
          <div className="absolute bottom-0 right-56 w-64 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)", transform: "translate(20%, 30%)" }} />

          {/* LIVE badge */}
          <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/30">
            <motion.div className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <span className="text-xs font-bold text-red-400 tracking-wider">LIVE</span>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-6 lg:py-6 h-full">
            {/* text + button */}
            <div className="flex-1 lg:pt-2">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl lg:text-[58px] font-black text-white mb-2 leading-tight tracking-tight"
                style={{ fontFamily: "'Rajdhani', 'Orbitron', sans-serif", letterSpacing: "-0.5px" }}
              >
                Emergency{" "}
<span
  className="text-red-500"
  style={{
    textShadow: "0 0 18px rgba(239,68,68,0.55)",
  }}
>
  SOS
</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-base mb-6 max-w-xs leading-relaxed"
              >
                One tap for help. We are always<br />ready to save lives.
              </motion.p>

              {/* SOS Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSosActive(!sosActive)}
                className="relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg text-white tracking-wide overflow-hidden"
                style={{
                  background:
  "linear-gradient(135deg,#ff4b5c 0%, #ff3131 45%, #b91c1c 100%)",
boxShadow:
  "0 14px 40px rgba(255,59,92,.32), inset 0 1px 0 rgba(255,255,255,.18)",
border:
  "1px solid rgba(255,255,255,.12)",
                  transition: "box-shadow 0.3s",
                  letterSpacing: "0.5px",
                }}
              >
                {/* shimmer */}
                <div className="absolute inset-0 opacity-20"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)" }} />
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}>
                  <Phone size={22} fill="white" />
                </motion.div>
                Tap to SOS
              </motion.button>

              {/* avatars + label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mt-5"
              >
                <div className="flex -space-x-2">
                  {["#dc2626", "#059669", "#7c3aed"].map((bg, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: bg, zIndex: 3 - i }}>
                      {["R", "D", "N"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-slate-400 text-sm">24/7 Active Response</span>
              </motion.div>
            </div>

            {/* Ambulance illustration with radar */}
            <div className="relative flex-shrink-0 w-[320px] h-[220px] lg:w-[430px] lg:h-[260px] lg:-mr-2">
  
  <div
    className="absolute right-10 top-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-[7px]"
    style={{
      background:
        "radial-gradient(circle, rgba(255,59,92,.22) 0%, rgba(0,217,255,.08) 45%, transparent 75%)",
    }}
  />
              <RadarRings />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full">
                  <AmbulanceSVG />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right column: AI Assistant + Patient Summary ── */}
        <div className="flex flex-col gap-4 h-full">

          {/* AI Assistant Card */}
          <motion.div
            {...fadeUp(0.15)}
            className="
relative rounded-2xl p-5 overflow-hidden
before:absolute before:inset-0 before:rounded-[inherit]
before:border before:border-white/[0.03]
before:pointer-events-none
 min-h-[210px]"
            style={{
              background: "linear-gradient(135deg, rgba(10,20,44,0.97) 0%, rgba(6,12,28,0.99) 100%)",
              border: "1px solid rgba(6,182,212,0.2)",
              boxShadow: "0 0 30px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
              backdropFilter: "blur(18px)",
            }}
          >
            {/* cyan glow */}
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", transform: "translate(25%, -25%)" }} />

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-base">AI Assistant</h3>
                  <motion.div className="flex items-center gap-1 bg-emerald-500/15 rounded-full px-2 py-0.5 border border-emerald-500/30"
                    animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 text-xs font-semibold">Online</span>
                  </motion.div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[150px]">
                  Hello! I'm your AI health assistant. How can I help you?
                </p>
              </div>
              <RobotSVG />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(6,182,212,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
              style={{
                background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                border: "1px solid rgba(6,182,212,0.4)",
                boxShadow: "0 0 16px rgba(6,182,212,0.2)",
              }}
            >
              <MessageCircle size={16} />
              Chat Now
            </motion.button>
          </motion.div>

          {/* Patient Summary Card */}
          <motion.div
            {...fadeUp(0.25)}
            className="
relative rounded-2xl p-5 flex-1 overflow-hidden
before:absolute before:inset-0 before:rounded-[inherit]
before:border before:border-white/[0.03]
before:pointer-events-none
"
            style={{
              background: "linear-gradient(135deg, rgba(10,20,44,0.97) 0%, rgba(6,12,28,0.99) 100%)",
              border: "1px solid rgba(30,58,95,0.8)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
              backdropFilter: "blur(18px)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-base">Patient Summary</h3>
              <Shield size={16} className="text-cyan-400" />
            </div>

            <div className="space-y-2">
              {[
                { icon: <Droplets size={13} className="text-red-400" />, label: "Blood Group", value: "O+", valueColor: "text-red-400" },
                { icon: <AlertCircle size={13} className="text-amber-400" />, label: "Allergies", value: "Penicillin", valueColor: "text-amber-300" },
                { icon: <Activity size={13} className="text-orange-400" />, label: "Chronic Conditions", value: "Asthma", valueColor: "text-orange-300" },
                { icon: <Pill size={13} className="text-purple-400" />, label: "Current Medications", value: "2", valueColor: "text-purple-300" },
              ].map(({ icon, label, value, valueColor }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(30,58,95,0.6)" }}>
                      {icon}
                    </div>
                    <span className="text-slate-400 text-sm">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${valueColor}`}>{value}</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-1.5 text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
              View Full History <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      {/* ───────────────── STATS ROW ───────────────── */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4 max-w-[1700px] mx-auto">

  <StatCard
    delay={0.35}
    type="default"
    icon={
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap size={34} className="text-cyan-400" />
      </motion.div>
    }
    label="Nearest Ambulance"
    value="3.2 km"
    sub="ETA: 6 mins"
    subColor="text-emerald-400"
  />

  <StatCard
    delay={0.42}
    type="hospital"
    icon={<Building2 size={34} className="text-cyan-400" />}
    label="Nearest Hospital"
    value=""
    sub="2.8 km"
    subColor="text-emerald-400"
  />

  <StatCard
    delay={0.49}
    type="health"
    icon={<Shield size={34} className="text-cyan-400" />}
    label="Your Health ID"
    value=""
    action="View Profile"
  />

  <StatCard
    delay={0.56}
    type="contacts"
    icon={<Users size={34} className="text-cyan-400" />}
    label="Emergency Contacts"
    value=""
    action="View All"
  />
</div>

{/* ───────────────── MAIN DASHBOARD ───────────────── */}
<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_330px] gap-4 items-start">

  {/* LEFT SIDE */}
  <div className="space-y-4">

    <EmergencyCommandCenter />

    <HealthMonitoringSection />

  </div>

  {/* RIGHT SIDE */}
  <div className="space-y-5">

    <RecentAlerts />

    <BloodBank />

    <NearbyHospitals />

  </div>
</div>

</div>

  );
}
