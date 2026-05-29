"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Users,
  Activity,
  Heart,
  Pill,
  AlertCircle,
  Shield,
  ZoomIn,
  ZoomOut,
  Crosshair,
  CheckCircle,
  TrendingUp,
  Lungs,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

// ── Pulse ring component ──────────────────────────────────────────────────────
const PulseRing = ({ delay = 0, size = 1 }) => (
  <motion.div
    className="absolute rounded-full border-2 border-red-400/40"
    style={{
      width: `${120 * size}px`,
      height: `${120 * size}px`,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
    initial={{ scale: 0.8, opacity: 0.7 }}
    animate={{ scale: 1.6, opacity: 0 }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }}
  />
);

// ── Heartbeat line SVG ────────────────────────────────────────────────────────
const HeartbeatLine = ({ color = "#ef4444", flip = false }) => (
  <svg
    width="90"
    height="40"
    viewBox="0 0 90 40"
    fill="none"
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
  >
    <motion.path
      d="M0,20 L15,20 L20,8 L25,32 L30,14 L35,26 L40,20 L90,20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
    />
  </svg>
);

// ── Mini sparkline ────────────────────────────────────────────────────────────
const Sparkline = ({ color }) => {
  const points = [0, 3, 1, 5, 2, 6, 3, 4, 5, 3, 6, 5, 7].map(
    (v, i) => `${i * 7},${20 - v * 2}`
  );
  return (
    <svg width="84" height="24" viewBox="0 0 84 24">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ── Map component ─────────────────────────────────────────────────────────────
const LiveMap = () => {
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-100">
      {/* Map background grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#d1d5db" strokeWidth="0.5" />
          </pattern>
          <pattern id="bigGrid" width="112" height="112" patternUnits="userSpaceOnUse">
            <rect width="112" height="112" fill="url(#grid)" />
            <path d="M 112 0 L 0 0 0 112" fill="none" stroke="#9ca3af" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#eef2f7" />
        <rect width="100%" height="100%" fill="url(#bigGrid)" />

        {/* Road-like rectangles */}
        <rect x="0" y="90" width="100%" height="10" fill="#d1d8e4" opacity="0.7" />
        <rect x="0" y="160" width="100%" height="8" fill="#d1d8e4" opacity="0.7" />
        <rect x="80" y="0" width="10" height="100%" fill="#d1d8e4" opacity="0.7" />
        <rect x="200" y="0" width="8" height="100%" fill="#d1d8e4" opacity="0.7" />
        <rect x="320" y="0" width="12" height="100%" fill="#d1d8e4" opacity="0.7" />

        {/* Route path */}
        <motion.path
          d="M 160 195 C 180 180, 210 170, 240 150 C 270 130, 290 110, 310 90 C 330 70, 350 50, 370 35"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeDasharray="8 4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Hospital marker */}
      <motion.div
        className="absolute top-6 right-16 z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
          <span className="text-white font-bold text-sm">H</span>
        </div>
      </motion.div>

      {/* Ambulance on route */}
      <motion.div
        className="absolute z-10"
        style={{ top: "38%", left: "45%" }}
        animate={{ x: [0, 30, 60], y: [0, -20, -40] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white text-xs">🚑</span>
        </div>
      </motion.div>

      {/* "You are here" pin */}
      <motion.div
        className="absolute bottom-14 left-1/3 z-10"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-lg px-3 py-1.5 flex items-center gap-1.5 border border-blue-100">
          <MapPin size={13} className="text-blue-500" />
          <div>
            <p className="text-[10px] font-semibold text-slate-700">You are here</p>
            <p className="text-[9px] text-slate-400">MG Road, Bengaluru</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500 border-2 border-white shadow mx-auto mt-1" />
      </motion.div>

      {/* Hospital ETA card */}
      <motion.div
        className="absolute top-4 right-4 bg-white rounded-xl shadow-lg px-3 py-2 border border-slate-100 z-20"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-[11px] font-bold text-slate-800">Apollo Hospital</p>
        <p className="text-[10px] text-slate-500">2.8 km away</p>
        <p className="text-[10px] text-blue-500 font-semibold">ETA: 6 mins</p>
      </motion.div>

      {/* Zoom controls */}
      <div className="absolute right-3 bottom-20 flex flex-col gap-1 z-20">
        <button className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center border border-slate-200 hover:bg-blue-50 transition-colors">
          <ZoomIn size={13} className="text-slate-600" />
        </button>
        <button className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center border border-slate-200 hover:bg-blue-50 transition-colors">
          <ZoomOut size={13} className="text-slate-600" />
        </button>
        <button className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center border border-slate-200 hover:bg-blue-50 transition-colors">
          <Crosshair size={13} className="text-slate-600" />
        </button>
      </div>

      {/* Traffic legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 border border-slate-100 shadow z-20">
        <span className="text-[9px] text-slate-500 font-medium">Traffic Status:</span>
        {[
          { color: "bg-green-400", label: "Low" },
          { color: "bg-yellow-400", label: "Moderate" },
          { color: "bg-red-400", label: "High" },
          { color: "bg-purple-400", label: "Severe" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[9px] text-slate-500">{label}</span>
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="w-4 border-t-2 border-dashed border-green-500" />
          <span className="text-[9px] text-slate-500">Green Corridor</span>
        </span>
      </div>

      {/* LIVE badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 shadow border border-slate-100">
        <span className="text-[10px] font-semibold text-slate-700">Live Emergency Map</span>
        <span className="flex items-center gap-1 bg-green-50 rounded-full px-1.5 py-0.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[9px] font-semibold text-green-600">Live</span>
        </span>
      </div>
    </div>
  );
};

// ── Stat card row (Ambulance / Hospital / HealthID / Contacts) ────────────────
const QuickStatCard = ({ icon: Icon, iconColor, iconBg, title, value, sub, action }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(59,130,246,0.10)" }}
    className="bg-white rounded-2xl p-4 flex gap-3 items-center border border-slate-100 shadow-sm flex-1 min-w-0"
  >
    <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-400 truncate">{title}</p>
      <p className="text-sm font-bold text-slate-800 leading-tight truncate">{value}</p>
      {sub && <p className="text-[10px] text-emerald-500 font-semibold">{sub}</p>}
    </div>
    {action && (
      <button className="text-[10px] text-blue-500 flex items-center gap-0.5 shrink-0 font-medium hover:text-blue-700 transition-colors">
        {action} <ChevronRight size={10} />
      </button>
    )}
  </motion.div>
);

// ── Patient Summary Card ──────────────────────────────────────────────────────
const PatientSummaryCard = () => {
  const items = [
    { icon: "🩸", label: "Blood Group", value: "O+", valueColor: "text-red-500" },
    { icon: "⚠️", label: "Allergies", value: "Penicillin", valueColor: "text-orange-400" },
    { icon: "🫁", label: "Chronic Conditions", value: "Asthma", valueColor: "text-slate-700" },
    { icon: "💊", label: "Current Medications", value: "2", valueColor: "text-slate-700" },
  ];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Patient Summary</h3>
        <button className="text-[11px] text-blue-500 font-semibold hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {items.map(({ icon, label, value, valueColor }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{icon}</span>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
            <span className={`text-xs font-semibold ${valueColor}`}>{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── AI Health Summary Card ────────────────────────────────────────────────────
const AIHealthCard = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += 2;
      if (start >= 92) { setCount(92); clearInterval(timer); } else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (count / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">AI Health Summary</h3>
        <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full border border-blue-100">AI</span>
      </div>
      <div className="flex gap-4 items-center">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="38" fill="none" stroke="#e2e8f0" strokeWidth="7" />
            <motion.circle
              cx="44" cy="44" r="38"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 44 44)"
              transition={{ duration: 0.05 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-slate-800">{count}%</span>
            <span className="text-[8px] text-slate-400 text-center leading-tight">Overall<br/>Health Score</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2 flex-1">
          {[
            { icon: <CheckCircle size={13} className="text-blue-500" />, title: "Condition is stable", sub: "Asthma well managed" },
            { icon: <TrendingUp size={13} className="text-green-500" />, title: "Improvement noted", sub: "Better lung function" },
            { icon: <Shield size={13} className="text-slate-400" />, title: "Low risk", sub: "No critical health issues" },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-start gap-2">
              <div className="mt-0.5">{icon}</div>
              <div>
                <p className="text-[11px] font-semibold text-slate-700">{title}</p>
                <p className="text-[10px] text-slate-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[9px] text-slate-400 mt-3 flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-full border border-slate-300 flex items-center justify-center text-[6px]">↻</span>
        Last Updated: 28 May 2025, 08:45 AM
      </p>
    </motion.div>
  );
};

// ── Quick Actions Card ────────────────────────────────────────────────────────
const QuickActionsCard = () => {
  const actions = [
    { icon: <MapPin size={18} className="text-blue-500" />, label: "Share Location", bg: "bg-blue-50" },
    { icon: <Phone size={18} className="text-red-500" />, label: "Call 108", bg: "bg-red-50" },
    { icon: <Activity size={18} className="text-green-500" />, label: "Find Hospital", bg: "bg-green-50" },
    { icon: <Heart size={18} className="text-purple-500" />, label: "Health Tips", bg: "bg-purple-50" },
  ];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map(({ icon, label, bg }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
            <span className="text-[9px] text-slate-500 text-center leading-tight">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ── Doctors On Call Card ──────────────────────────────────────────────────────
const DoctorsCard = () => {
  const doctors = [
    { name: "Dr. Arjun Mehta", role: "General Physician", initials: "AM", color: "bg-blue-100 text-blue-600" },
    { name: "Dr. Neha Kapoor", role: "Pulmonologist", initials: "NK", color: "bg-pink-100 text-pink-600" },
    { name: "Dr. Rohan Singh", role: "Allergist", initials: "RS", color: "bg-emerald-100 text-emerald-600" },
  ];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Doctors On Call</h3>
        <button className="text-[11px] text-blue-500 font-semibold hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {doctors.map(({ name, role, initials, color }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-[11px] font-bold`}>{initials}</div>
              <div>
                <p className="text-xs font-semibold text-slate-700">{name}</p>
                <p className="text-[10px] text-slate-400">{role}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.15 }}
              className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors"
            >
              <Phone size={12} className="text-green-500" />
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Recent Alerts ─────────────────────────────────────────────────────────────
const RecentAlerts = () => {
  const alerts = [
    { icon: "🔴", title: "Heavy Traffic on MG Road", time: "08:45 AM", badge: "High", badgeColor: "text-red-500 bg-red-50" },
    { icon: "🟡", title: "High Pollution Alert", time: "07:30 AM", badge: "Moderate", badgeColor: "text-yellow-600 bg-yellow-50" },
    { icon: "🔵", title: "Hospital Bed Available", time: "06:15 AM", badge: "Low", badgeColor: "text-blue-500 bg-blue-50" },
  ];
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Alerts</h3>
        <button className="text-[11px] text-blue-500 font-semibold hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {alerts.map(({ icon, title, time, badge, badgeColor }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-base shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{title}</p>
              <p className="text-[10px] text-slate-400">{time}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor} shrink-0`}>{badge}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Lab Results ───────────────────────────────────────────────────────────────
const LabResults = () => {
  const labs = [
    { name: "Hemoglobin", value: "13.5 g/dL", status: "Normal" },
    { name: "WBC Count", value: "6,800 /µL", status: "Normal" },
    { name: "Platelet Count", value: "2.45 Lakh/µL", status: "Normal" },
    { name: "Blood Sugar (F)", value: "98 mg/dL", status: "Normal" },
  ];
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Lab Results</h3>
        <button className="text-[11px] text-blue-500 font-semibold hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {labs.map(({ name, value, status }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-slate-600">{name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{value}</span>
              <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">{status}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-3">2 hours ago</p>
    </motion.div>
  );
};

// ── Health Analytics ──────────────────────────────────────────────────────────
const HealthAnalytics = () => {
  const metrics = [
    { label: "Heart Rate", value: "72", unit: "bpm", change: "↑ 4% from last week", up: true, color: "#ef4444" },
    { label: "Blood Pressure", value: "120/80", unit: "mmHg", change: "↓ 2% from last week", up: false, color: "#f97316" },
    { label: "Sleep", value: "6.8", unit: "hrs", change: "↑ 6% from last week", up: true, color: "#8b5cf6" },
    { label: "Activity", value: "3.2", unit: "hrs", change: "↑ 10% from last week", up: true, color: "#10b981" },
    { label: "Weight", value: "70.5", unit: "kg", change: "↓ 0.8 kg from last week", up: false, color: "#3b82f6" },
  ];
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Health Analytics</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {metrics.map(({ label, value, unit, change, up, color }) => (
          <div key={label} className="flex flex-col min-w-[100px] gap-1">
            <p className="text-[10px] text-slate-400">{label}</p>
            <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
            <p className="text-[9px] text-slate-400">{unit}</p>
            <Sparkline color={color} />
            <p className={`text-[9px] font-semibold ${up ? "text-emerald-500" : "text-red-400"}`}>{change}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function EmergencySOSDashboard() {
  const [sosActive, setSosActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f5fb] p-5 font-sans">
      <div className="max-w-[1400px] mx-auto flex gap-5">

        {/* ── LEFT + CENTER ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            style={{ minHeight: 300 }}
          >
            <div className="flex h-full">
              {/* Left panel */}
              <div className="w-[340px] shrink-0 p-7 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Emergency SOS</h2>
                  <p className="text-xs text-slate-400 mt-0.5">One tap for help.</p>
                  <p className="text-xs text-slate-400">We are always ready to save lives.</p>
                </div>

                {/* SOS Button */}
                <div className="flex items-center justify-center py-4 relative">
                  <div className="relative flex items-center justify-center">
                    <PulseRing delay={0} size={1} />
                    <PulseRing delay={0.6} size={1.25} />
                    <PulseRing delay={1.2} size={1.5} />

                    {/* Heartbeat lines */}
                    <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 opacity-70">
                      <HeartbeatLine color="#ef4444" />
                    </div>
                    <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-70">
                      <HeartbeatLine color="#ef4444" flip />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSosActive(!sosActive)}
                      className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl text-white font-black text-2xl transition-all duration-300 ${
                        sosActive
                          ? "bg-gradient-to-br from-red-400 to-red-600 shadow-red-300"
                          : "bg-gradient-to-br from-red-500 to-red-700 shadow-red-200"
                      }`}
                      style={{
                        boxShadow: sosActive
                          ? "0 0 40px rgba(239,68,68,0.6), 0 8px 32px rgba(239,68,68,0.3)"
                          : "0 0 24px rgba(239,68,68,0.35), 0 8px 24px rgba(239,68,68,0.2)",
                      }}
                    >
                      <Phone size={24} className="mb-0.5" />
                      <span className="text-xl tracking-widest">SOS</span>
                    </motion.button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                  {[
                    { icon: <MapPin size={18} className="text-blue-500" />, label: "Share Location" },
                    { icon: <Activity size={18} className="text-blue-500" />, label: "Call Ambulance" },
                    { icon: <Users size={18} className="text-blue-500" />, label: "Alert Contacts" },
                  ].map(({ icon, label }) => (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100">
                        {icon}
                      </div>
                      <span className="text-[9px] text-slate-500 text-center">{label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Status bar */}
                <div className="mt-3 flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-[11px] font-semibold text-green-600">Live Tracking Active</span>
                  <span className="text-[10px] text-slate-400">Your location is visible to responders</span>
                </div>
              </div>

              {/* Map panel */}
              <div className="flex-1 p-3 pl-0">
                <LiveMap />
              </div>
            </div>
          </motion.div>

          {/* Quick stat cards */}
          <div className="flex gap-3">
            <QuickStatCard
              icon={Activity}
              iconColor="text-red-500"
              iconBg="bg-red-50"
              title="Nearest Ambulance"
              value="3.2 km"
              sub="ETA: 6 mins"
              action="View Details"
            />
            <QuickStatCard
              icon={AlertCircle}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
              title="Nearest Hospital"
              value="Apollo Hospital"
              sub="2.8 km away"
              action="View Details"
            />
            <QuickStatCard
              icon={Shield}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-50"
              title="Your Health ID"
              value="LHID-2024-7845"
              action="View Profile"
            />
            <QuickStatCard
              icon={Users}
              iconColor="text-purple-500"
              iconBg="bg-purple-50"
              title="Emergency Contacts"
              value="3 Contacts"
              action="View All"
            />
          </div>

          {/* Bottom cards row */}
          <div className="grid grid-cols-3 gap-4">
            <RecentAlerts />
            <LabResults />
            {/* Recent Imaging */}
            <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Recent Imaging</h3>
                <button className="text-[11px] text-blue-500 font-semibold hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Chest X-Ray", date: "10 May 2025", thumb: "🫁" },
                  { label: "ECG", date: "15 Apr 2025", thumb: "📈" },
                ].map(({ label, date, thumb }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-14 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                      {thumb}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-700">{label}</p>
                      <p className="text-[10px] text-slate-400">{date}</p>
                    </div>
                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Normal</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Health Analytics */}
          <HealthAnalytics />
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-[280px] shrink-0 flex flex-col gap-4">
          <PatientSummaryCard />
          <AIHealthCard />
          <QuickActionsCard />
          <DoctorsCard />
        </div>
      </div>
    </div>
  );
}
