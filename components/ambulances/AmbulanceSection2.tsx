"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Maximize2,
  Navigation,
  ChevronDown,
  ArrowRight,
  LocateFixed,
  Plus,
  Minus,
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock4,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AmbulanceStatus = "available" | "busy" | "onroute";
type AmbulanceType = "bls" | "als" | "icu" | "neonatal";
type Condition = "stable" | "urgent" | "critical" | "";

interface AmbulanceMarker {
  id: string;
  x: number; // % of map width
  y: number; // % of map height
  status: AmbulanceStatus;
  label: string;
  eta?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ambulances: AmbulanceMarker[] = [
  { id: "RA01", x: 22, y: 30, status: "available", label: "RA 01", eta: "6 min" },
  { id: "RA05", x: 55, y: 22, status: "onroute",   label: "RA 05", eta: "8 min" },
  { id: "RA12", x: 70, y: 55, status: "available", label: "RA 12", eta: "10 min" },
  { id: "RA08", x: 38, y: 65, status: "busy",      label: "RA 08" },
  { id: "RA17", x: 80, y: 25, status: "onroute",   label: "RA 17", eta: "12 min" },
  { id: "RA22", x: 15, y: 72, status: "available", label: "RA 22", eta: "5 min" },
];

const statusConfig: Record<AmbulanceStatus, { bg: string; ring: string; dot: string; label: string; icon: string }> = {
  available: { bg: "bg-emerald-500",  ring: "ring-emerald-300",  dot: "bg-emerald-500",  label: "Available", icon: "🟢" },
  onroute:   { bg: "bg-amber-500",    ring: "ring-amber-300",    dot: "bg-amber-500",    label: "On Route",  icon: "🟡" },
  busy:      { bg: "bg-red-500",      ring: "ring-red-300",      dot: "bg-red-500",      label: "Busy",      icon: "🔴" },
};

const ambulanceTypes: { id: AmbulanceType; label: string; short: string; desc: string; icon: string }[] = [
  { id: "bls",      label: "Basic Life Support",    short: "BLS",  desc: "Stable patients",    icon: "🚑" },
  { id: "als",      label: "Advanced Life Support", short: "ALS",  desc: "Critical cases",     icon: "🚒" },
  { id: "icu",      label: "ICU Ambulance",         short: "ICU",  desc: "Intensive care",     icon: "🏥" },
  { id: "neonatal", label: "Neonatal Ambulance",    short: "NICU", desc: "Newborn/infant care", icon: "👶" },
];

const conditions: { value: Condition; label: string; color: string }[] = [
  { value: "stable",   label: "Stable — Non-urgent transfer",   color: "text-emerald-600" },
  { value: "urgent",   label: "Urgent — Needs quick response",  color: "text-amber-600"   },
  { value: "critical", label: "Critical — Life threatening",    color: "text-red-600"     },
];

// ─── Map roads (decorative SVG paths) ────────────────────────────────────────
const roads = [
  "M 0 45 Q 25 42 50 48 T 100 44",
  "M 0 70 Q 30 68 60 72 T 100 69",
  "M 30 0 Q 32 25 35 50 T 38 100",
  "M 60 0 Q 58 30 62 55 T 65 100",
  "M 0 20 Q 40 22 70 18 T 100 21",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AmbulanceSection2() {
  const [activeMarker, setActiveMarker]     = useState<string | null>(null);
  const [zoom, setZoom]                     = useState(1);
  const [selectedType, setSelectedType]     = useState<AmbulanceType>("bls");
  const [condition, setCondition]           = useState<Condition>("");
  const [conditionOpen, setConditionOpen]   = useState(false);
  const [pickup, setPickup]                 = useState("");
  const [destination, setDestination]       = useState("");
  const [pulse, setPulse]                   = useState(true);
  const dropdownRef                         = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setConditionOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Pulse animation toggle
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1800);
    return () => clearInterval(t);
  }, []);

  const conditionLabel = conditions.find((c) => c.value === condition)?.label ?? "Select patient condition";
  const conditionColor = conditions.find((c) => c.value === condition)?.color ?? "text-slate-400";

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_420px]">

        {/* ── LEFT: Map ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col"
        >
          {/* Map Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                <Navigation className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Live Ambulance Tracking</h2>
                <p className="text-xs text-slate-400">Real-time positions · Updated every 30s</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              View Full Map
            </motion.button>
          </div>

          {/* Map Canvas */}
          <div className="relative flex-1 min-h-[380px] bg-[#EEF2F7] overflow-hidden select-none"
               style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.25s ease" }}>

            {/* Tile-style background grid */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Road network */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {roads.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
              ))}
              {roads.map((d, i) => (
                <path key={`c${i}`} d={d} fill="none" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 4" />
              ))}
            </svg>

            {/* Green park blob */}
            <div className="absolute top-[30%] left-[42%] h-16 w-20 rounded-[40%] bg-emerald-200/60 blur-sm" />
            <div className="absolute bottom-[20%] right-[15%] h-12 w-16 rounded-[40%] bg-emerald-200/50 blur-sm" />

            {/* Water blob */}
            <div className="absolute top-[55%] left-[55%] h-10 w-24 rounded-full bg-blue-200/60 blur-sm rotate-12" />

            {/* User Location */}
            <div className="absolute" style={{ left: "48%", top: "52%", transform: "translate(-50%,-50%)" }}>
              <div className="relative">
                <span className={`absolute -inset-3 rounded-full bg-blue-400/20 transition-all duration-1000 ${pulse ? "scale-125 opacity-0" : "scale-100 opacity-100"}`} />
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white shadow-lg">
                  <LocateFixed className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white shadow">
                  You
                </div>
              </div>
            </div>

            {/* Ambulance Markers */}
            {ambulances.map((amb) => {
              const cfg = statusConfig[amb.status];
              const isActive = activeMarker === amb.id;
              return (
                <motion.div
                  key={amb.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 + ambulances.indexOf(amb) * 0.08, type: "spring", stiffness: 200 }}
                  className="absolute cursor-pointer"
                  style={{ left: `${amb.x}%`, top: `${amb.y}%`, transform: "translate(-50%,-50%)" }}
                  onClick={() => setActiveMarker(isActive ? null : amb.id)}
                >
                  <motion.div whileHover={{ scale: 1.18 }} className="relative">
                    {/* Pulse for available */}
                    {amb.status === "available" && (
                      <span className="absolute -inset-2 animate-ping rounded-full bg-emerald-400/30" />
                    )}
                    {/* Marker */}
                    <div className={`relative flex h-8 w-8 items-center justify-center rounded-xl ${cfg.bg} ring-2 ${cfg.ring} shadow-md text-white text-sm`}>
                      🚑
                    </div>
                    {/* Label */}
                    <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow ${cfg.bg}`}>
                      {amb.label}
                    </div>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.9 }}
                          className="absolute -top-16 left-1/2 z-20 -translate-x-1/2 rounded-2xl bg-white px-3 py-2 shadow-xl border border-slate-200 min-w-[110px] text-center"
                        >
                          <p className="text-xs font-bold text-slate-800">{amb.label}</p>
                          <span className={`text-[10px] font-semibold ${cfg.bg} bg-opacity-10 text-white rounded-full px-1.5 py-0.5 inline-block mt-0.5`}
                                style={{ background: undefined }}
                          >
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot} mr-1 align-middle`} />
                            {cfg.label}
                          </span>
                          {amb.eta && <p className="text-[10px] text-slate-400 mt-0.5">ETA {amb.eta}</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Zoom controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-1">
              {[{ icon: Plus, action: () => setZoom((z) => Math.min(z + 0.15, 1.8)) },
                { icon: Minus, action: () => setZoom((z) => Math.max(z - 0.15, 0.7)) },
                { icon: Layers, action: () => {} }
              ].map(({ icon: Icon, action }, i) => (
                <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                  onClick={action}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </motion.button>
              ))}
            </div>

            {/* Search overlay */}
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow px-3 py-2">
              <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400">Search area…</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 px-5 py-3.5 border-t border-slate-100 bg-slate-50/60">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot} flex-shrink-0`} />
                <span className="text-xs font-medium text-slate-500">{cfg.label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-600 flex-shrink-0">
                <span className="h-1 w-1 rounded-full bg-white" />
              </span>
              <span className="text-xs font-medium text-slate-500">You</span>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Booking Form ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden"
        >
          {/* Form header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Book an Ambulance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Fill details to dispatch nearest unit</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-[11px] font-semibold text-red-600">Emergency</span>
            </span>
          </div>

          <div className="flex-1 px-6 py-5 space-y-5">

            {/* Pickup */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup address or use GPS"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-12 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <LocateFixed className="h-3.5 w-3.5 text-blue-600" />
                </motion.button>
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Destination Hospital
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter hospital or address"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Patient Condition */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Patient Condition
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setConditionOpen((o) => !o)}
                  className={`w-full flex items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100
                    ${conditionOpen ? "border-blue-400 bg-white ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <span className={condition ? conditionColor : "text-slate-400"}>
                    {conditionLabel}
                  </span>
                  <motion.span animate={{ rotate: conditionOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {conditionOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute z-30 mt-1.5 w-full rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden"
                    >
                      {conditions.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => { setCondition(c.value); setConditionOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors text-left
                            ${condition === c.value ? "bg-blue-50" : ""}`}
                        >
                          {c.value === "stable"   && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                          {c.value === "urgent"   && <Clock4 className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                          {c.value === "critical" && <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          <span className={c.color + " font-medium"}>{c.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Ambulance Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Ambulance Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ambulanceTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ translateY: -2, boxShadow: "0 8px 24px -4px rgba(37,99,235,0.12)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all duration-150
                      ${selectedType === type.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"}`}
                  >
                    {selectedType === type.id && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
                        <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    <span className="text-lg leading-none">{type.icon}</span>
                    <span className={`text-[11px] font-bold leading-tight ${selectedType === type.id ? "text-blue-700" : "text-slate-700"}`}>
                      {type.short}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">{type.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 12px 32px -4px rgba(37,99,235,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20">
                🚑
              </span>
              Find Nearest Ambulance
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
            <p className="mt-2.5 text-center text-[11px] text-slate-400">
              Average dispatch time · <span className="font-semibold text-slate-600">8.4 min</span> · Available 24/7
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
