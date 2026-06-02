"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Copy,
  Hash,
  User,
  Heart,
  AlertCircle,
  Clock,
  ZoomIn,
  ZoomOut,
  Crosshair,
  MapPin,
  Phone,
  Shield,
  Droplets,
  Users,
  FileText,
  Activity,
  Navigation,
} from "lucide-react";

// ─── fade-up helper ───────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, type: "spring" as const, stiffness: 260, damping: 24 },
});

// ════════════════════════════════════════════════════════════
// SVG MAP
// ════════════════════════════════════════════════════════════
function LiveMap() {
  const ambControls = useAnimation();
  const ambRef = useRef({ progress: 0 });

  // Route waypoints (SVG coords) from patient → hospital
  const routePoints = [
    { x: 178, y: 380 },
    { x: 240, y: 340 },
    { x: 310, y: 300 },
    { x: 390, y: 260 },
    { x: 460, y: 220 },
    { x: 530, y: 185 },
    { x: 600, y: 158 },
    { x: 660, y: 145 },
  ];

  const routeStr = routePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  // Animate ambulance along route
  const [ambPos, setAmbPos] = useState({ x: routePoints[0].x, y: routePoints[0].y, angle: 0 });

  useEffect(() => {
    let t = 0;
    const total = routePoints.length - 1;
    const interval = setInterval(() => {
      t = (t + 0.004) % 1;
      const seg = Math.min(Math.floor(t * total), total - 1);
      const frac = (t * total) % 1;
      const from = routePoints[seg];
      const to = routePoints[seg + 1] || routePoints[total];
      const x = from.x + (to.x - from.x) * frac;
      const y = from.y + (to.y - from.y) * frac;
      const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
      setAmbPos({ x, y, angle });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#e8edf4]">
      <svg
        viewBox="0 0 780 460"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="mapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0L0 0 0 32" fill="none" stroke="#d1d8e6" strokeWidth="0.5" />
          </pattern>
          <pattern id="mapBig" width="128" height="128" patternUnits="userSpaceOnUse">
            <rect width="128" height="128" fill="url(#mapGrid)" />
            <path d="M128 0L0 0 0 128" fill="none" stroke="#bcc7d8" strokeWidth="1" />
          </pattern>
          {/* Green corridor gradient */}
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="60%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          {/* Animated dash for covered portion */}
          <linearGradient id="coveredGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Map background */}
        <rect width="780" height="460" fill="#eef2f7" />
        <rect width="780" height="460" fill="url(#mapBig)" />

        {/* Road network */}
        <rect x="0" y="100" width="780" height="14" fill="#dae2ed" rx="2" opacity="0.8" />
        <rect x="0" y="280" width="780" height="10" fill="#dae2ed" rx="2" opacity="0.7" />
        <rect x="0" y="380" width="780" height="8" fill="#dae2ed" rx="2" opacity="0.6" />
        <rect x="100" y="0" width="12" height="460" fill="#dae2ed" rx="2" opacity="0.7" />
        <rect x="280" y="0" width="10" height="460" fill="#dae2ed" rx="2" opacity="0.7" />
        <rect x="480" y="0" width="14" height="460" fill="#dae2ed" rx="2" opacity="0.8" />
        <rect x="650" y="0" width="10" height="460" fill="#dae2ed" rx="2" opacity="0.6" />

        {/* Parks / blocks */}
        <rect x="310" y="110" width="160" height="70" fill="#d1fae5" rx="8" opacity="0.6" />
        <rect x="500" y="100" width="80" height="60" fill="#dbeafe" rx="6" opacity="0.5" />
        <rect x="120" y="295" width="100" height="60" fill="#fef9c3" rx="6" opacity="0.5" />
        <rect x="300" y="300" width="80" height="50" fill="#ede9fe" rx="6" opacity="0.5" />

        {/* River */}
        <path
          d="M0,230 Q150,215 280,228 Q400,240 520,222 Q640,208 780,220"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="18"
          opacity="0.6"
        />
        <path
          d="M0,230 Q150,215 280,228 Q400,240 520,222 Q640,208 780,220"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="6"
          opacity="0.4"
        />

        {/* Already-covered route (amber) */}
        <path
          d={`M${routePoints[0].x},${routePoints[0].y} L${routePoints[1].x},${routePoints[1].y} L${routePoints[2].x},${routePoints[2].y}`}
          stroke="url(#coveredGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Full green route */}
        <motion.path
          d={routeStr}
          stroke="url(#routeGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* Ambulance */}
        <motion.g
          transform={`translate(${ambPos.x}, ${ambPos.y}) rotate(${ambPos.angle})`}
          style={{ transformOrigin: "center" }}
        >
          <rect x="-18" y="-10" width="36" height="20" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="-18" y="-10" width="10" height="20" rx="3" fill="#2563eb" opacity="0.15" />
          <rect x="-4" y="-6" width="8" height="12" rx="1" fill="#ef4444" opacity="0.6" />
          <line x1="-4" y1="0" x2="4" y2="0" stroke="white" strokeWidth="1.5" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="white" strokeWidth="1.5" />
          <circle cx="-10" cy="12" r="4" fill="#1e293b" />
          <circle cx="10" cy="12" r="4" fill="#1e293b" />
          <circle cx="-10" cy="12" r="2" fill="#94a3b8" />
          <circle cx="10" cy="12" r="2" fill="#94a3b8" />
          {/* Siren light */}
          <motion.circle
            cx="0"
            cy="-14"
            r="4"
            fill="#ef4444"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.g>

        {/* Hospital marker */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          style={{ transformOrigin: "660px 145px" }}
        >
          <rect x="640" y="125" width="40" height="40" rx="12" fill="#ef4444" />
          <text x="660" y="150" textAnchor="middle" fill="white" fontWeight="800" fontSize="18">H</text>
        </motion.g>
        {/* Hospital label */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <rect x="618" y="172" width="84" height="22" rx="7" fill="white" />
          <text x="660" y="187" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="700">Apollo Hospital</text>
        </motion.g>

        {/* Patient location pin */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <rect x="104" y="355" width="150" height="44" rx="10" fill="white" />
          <rect x="104" y="355" width="150" height="44" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="124" cy="377" r="9" fill="#2563eb" opacity="0.12" />
          <circle cx="124" cy="377" r="5" fill="#2563eb" />
          <text x="138" y="373" fill="#475569" fontSize="9" fontWeight="600">Patient Location</text>
          <text x="138" y="386" fill="#1e293b" fontSize="10" fontWeight="800">MG Road, Bengaluru</text>
        </motion.g>
      </svg>

      {/* Live status floating card */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 p-4 z-10"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Live Status</span>
        </div>
        <p className="text-[14px] font-black text-emerald-600 leading-tight">En Route to Hospital</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Ambulance is on the way</p>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase">ETA</span>
          <span className="text-[18px] font-black text-blue-600 leading-none">6 mins</span>
          <span className="text-[10px] text-slate-400">2.8 km away</span>
        </div>
      </motion.div>

      {/* Zoom controls */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {[ZoomIn, ZoomOut, Crosshair].map((Icon, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <Icon size={15} className="text-slate-500" />
          </motion.button>
        ))}
      </div>

      {/* Traffic legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow border border-slate-100 flex items-center gap-3 z-10"
      >
        <span className="text-[10px] text-slate-500 font-semibold">Traffic Status:</span>
        {[
          { color: "bg-emerald-400", label: "Low" },
          { color: "bg-amber-400", label: "Moderate" },
          { color: "bg-orange-500", label: "High" },
          { color: "bg-red-500", label: "Severe" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] text-slate-500">{label}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-5 border-t-2 border-dashed border-emerald-500" />
          <span className="text-[10px] text-slate-500">Green Corridor</span>
        </span>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// AMBULANCE DETAILS CARD
// ════════════════════════════════════════════════════════════
function AmbulanceDetails() {
  return (
    <motion.div
      {...fadeUp(0.15)}
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold text-slate-800">Ambulance Details</h3>
        <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[9px] font-bold text-emerald-600">Live</span>
        </span>
      </div>

      {/* Ambulance illustration */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-4 mb-4 flex items-center justify-center border border-blue-100/50">
        <svg viewBox="0 0 160 80" width="140" height="70" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <rect x="20" y="20" width="120" height="45" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2" />
          {/* Blue stripe */}
          <rect x="20" y="28" width="120" height="10" fill="#2563eb" opacity="0.12" />
          {/* Red cross */}
          <rect x="70" y="24" width="20" height="30" rx="3" fill="#ef4444" opacity="0.15" />
          <rect x="62" y="30" width="36" height="18" rx="3" fill="#ef4444" opacity="0.15" />
          <rect x="76" y="28" width="8" height="26" rx="2" fill="#ef4444" />
          <rect x="66" y="34" width="28" height="8" rx="2" fill="#ef4444" />
          {/* Cabin */}
          <rect x="100" y="15" width="38" height="35" rx="8" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1.5" />
          <rect x="104" y="18" width="16" height="18" rx="4" fill="#93c5fd" opacity="0.6" />
          {/* Windows */}
          <rect x="28" y="25" width="22" height="16" rx="4" fill="#bfdbfe" opacity="0.7" />
          {/* Wheels */}
          <circle cx="52" cy="66" r="12" fill="#1e293b" />
          <circle cx="52" cy="66" r="6" fill="#475569" />
          <circle cx="52" cy="66" r="2.5" fill="#94a3b8" />
          <circle cx="118" cy="66" r="12" fill="#1e293b" />
          <circle cx="118" cy="66" r="6" fill="#475569" />
          <circle cx="118" cy="66" r="2.5" fill="#94a3b8" />
          {/* Siren */}
          <rect x="116" y="10" width="16" height="8" rx="3" fill="#ef4444" />
          <motion.rect
            x="116" y="10" width="16" height="8" rx="3"
            fill="#fca5a5"
            animate={{ opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          {/* AMB text */}
          <text x="45" y="48" fill="#1e40af" fontSize="8" fontWeight="800" letterSpacing="2">AMBULANCE</text>
        </svg>
      </div>

      {/* Details */}
      <div className="space-y-2.5">
        {[
          { label: "Ambulance ID", value: "AMB-1256" },
          { label: "Driver", value: "Sandeep Kumar" },
          { label: "Contact", value: "+91 98765 43210" },
          { label: "Hospital", value: "Apollo Hospital" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">{label}</span>
            <span className="text-[12px] font-bold text-slate-700">{value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" }}
        whileTap={{ scale: 0.97 }}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 flex items-center justify-center gap-2 text-[12px] font-bold transition-colors shadow-lg shadow-blue-200"
      >
        <Phone size={14} strokeWidth={2} />
        Call Driver
      </motion.button>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// PATIENT DETAILS CARD
// ════════════════════════════════════════════════════════════
function PatientDetails() {
  return (
    <motion.div
      {...fadeUp(0.22)}
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold text-slate-800">Patient Details</h3>
        <button className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors">
          View Profile
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-black text-lg">RV</span>
        </div>
        <div>
          <p className="text-[14px] font-black text-slate-800">Rohan Verma</p>
          <p className="text-[11px] text-slate-400">Male, 24 Years</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="space-y-2.5">
        {[
          { icon: Shield, label: "Health ID", value: "LHID-2024-7845", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
          { icon: Droplets, label: "Blood Group", value: "O+", iconBg: "bg-red-50", iconColor: "text-red-500" },
          { icon: Phone, label: "Primary Contact", value: "+91 98765 43210", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
          { icon: Activity, label: "Medical Condition", value: "Cardiac Emergency", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
        ].map(({ icon: Icon, label, value, iconBg, iconColor }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon size={12} className={iconColor} strokeWidth={2} />
              </div>
              <span className="text-[11px] text-slate-400">{label}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-700 text-right max-w-[120px] truncate">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════
export default function LiveTrackingPage() {
  const trackingInfo = [
    {
      icon: Hash,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      label: "Tracking ID",
      value: "TRK-2025-0528-001",
      extra: (
        <button className="ml-1 text-slate-300 hover:text-blue-400 transition-colors">
          <Copy size={12} />
        </button>
      ),
    },
    {
      icon: User,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      label: "Patient Name",
      value: "Rohan Verma",
      avatar: true,
    },
    {
      icon: Heart,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      label: "Emergency Type",
      value: "Cardiac Emergency",
    },
    {
      icon: AlertCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      label: "Priority",
      value: "High",
      badge: true,
    },
    {
      icon: Clock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      label: "Started At",
      value: "28 May 2025, 08:45 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f5fb] p-5 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* ── Page heading ── */}
        <motion.div {...fadeUp(0)} className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-blue-50 transition-colors">
              <ChevronLeft size={14} className="text-slate-500" />
            </button>
            <h1 className="text-[20px] font-black text-slate-800">Live Tracking</h1>
          </div>
          <div className="flex items-center gap-1.5 ml-9 text-[11px] text-slate-400">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight size={11} className="text-slate-300" />
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Live Tracking</span>
            <ChevronRight size={11} className="text-slate-300" />
            <span className="text-slate-600 font-medium">Tracking Details</span>
          </div>
        </motion.div>

        {/* ── Tracking Info Bar ── */}
        <motion.div
          {...fadeUp(0.06)}
          className="bg-white rounded-3xl px-5 py-4 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.055)] mb-4 flex items-center gap-0 overflow-x-auto"
        >
          {trackingInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 flex-1 min-w-[160px] ${i < trackingInfo.length - 1 ? "border-r border-slate-100 pr-5 mr-5" : ""}`}
              >
                {item.avatar ? (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-white text-[11px] font-black">RV</span>
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon size={17} className={item.iconColor} strokeWidth={1.8} />
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                  <div className="flex items-center">
                    {item.badge ? (
                      <span className="text-[12px] font-black text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                        {item.value}
                      </span>
                    ) : (
                      <span className="text-[13px] font-black text-slate-800">{item.value}</span>
                    )}
                    {item.extra}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Main content: Map + Right sidebar ── */}
        <div className="flex gap-4">

          {/* Map */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.055)] overflow-hidden"
            style={{ minHeight: 460 }}
          >
            <LiveMap />
          </motion.div>

          {/* Right sidebar */}
          <div className="w-[280px] shrink-0 flex flex-col gap-4">
            <AmbulanceDetails />
            <PatientDetails />
          </div>
        </div>

      </div>
    </div>
  );
}