"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  SortAsc,
  ChevronDown,
  Navigation,
  Wifi,
  Gauge,
  Activity,
  ThumbsUp,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "available" | "onroute" | "busy";

interface Ambulance {
  id: string;
  number: string;
  type: string;
  shortType: string;
  driver: string;
  driverStatus: string;
  distance: string;
  distanceNum: number;
  eta: number;
  rating: number;
  reviews: number;
  status: Status;
  paramedics: number;
  plate: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ambulances: Ambulance[] = [
  {
    id: "1", number: "RA 01", type: "Basic Life Support", shortType: "BLS",
    driver: "Rajiv Mehta", driverStatus: "On Duty", distance: "1.2 km",
    distanceNum: 1.2, eta: 6, rating: 4.9, reviews: 312, status: "available",
    paramedics: 2, plate: "MH-04-AX-1122",
  },
  {
    id: "2", number: "RA 05", type: "Advanced Life Support", shortType: "ALS",
    driver: "Priya Nair", driverStatus: "En Route", distance: "2.4 km",
    distanceNum: 2.4, eta: 8, rating: 4.8, reviews: 274, status: "onroute",
    paramedics: 3, plate: "MH-04-BX-3345",
  },
  {
    id: "3", number: "RA 12", type: "Basic Life Support", shortType: "BLS",
    driver: "Suresh Iyer", driverStatus: "On Duty", distance: "3.1 km",
    distanceNum: 3.1, eta: 10, rating: 4.7, reviews: 198, status: "available",
    paramedics: 2, plate: "MH-04-CX-7789",
  },
  {
    id: "4", number: "RA 08", type: "Advanced Life Support", shortType: "ALS",
    driver: "Anil Sharma", driverStatus: "Occupied", distance: "4.5 km",
    distanceNum: 4.5, eta: 15, rating: 4.6, reviews: 156, status: "busy",
    paramedics: 3, plate: "MH-04-DX-9901",
  },
  {
    id: "5", number: "RA 19", type: "ICU Ambulance", shortType: "ICU",
    driver: "Kavita Desai", driverStatus: "On Duty", distance: "5.3 km",
    distanceNum: 5.3, eta: 18, rating: 4.5, reviews: 89, status: "available",
    paramedics: 4, plate: "MH-04-EX-4456",
  },
];

const statusCfg: Record<Status, { label: string; bg: string; text: string; dot: string; border: string }> = {
  available: { label: "Available", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-100" },
  onroute:   { label: "On Route",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-100"   },
  busy:      { label: "Busy",      bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     border: "border-red-100"     },
};

const typeColor: Record<string, { bg: string; text: string }> = {
  BLS:  { bg: "bg-blue-50",    text: "text-blue-700"    },
  ALS:  { bg: "bg-violet-50",  text: "text-violet-700"  },
  ICU:  { bg: "bg-rose-50",    text: "text-rose-700"    },
  NICU: { bg: "bg-orange-50",  text: "text-orange-700"  },
};

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ eta, max = 20 }: { eta: number; max?: number }) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const radius = 72;
  const stroke = 8;
  const normalizedR = radius - stroke / 2;
  const circ = 2 * Math.PI * normalizedR;
  const progress = 1 - eta / max;
  const offset = circ * (1 - progress);

  useEffect(() => {
    if (inView) controls.start({ strokeDashoffset: offset });
  }, [inView, offset, controls]);

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg width="160" height="160" className="rotate-[-90deg]">
        {/* Track */}
        <circle cx="80" cy="80" r={normalizedR} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        {/* Progress */}
        <motion.circle
          cx="80" cy="80" r={normalizedR}
          fill="none"
          stroke="url(#etaGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={controls}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="etaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-4xl font-extrabold text-slate-800 leading-none"
        >
          {eta}
        </motion.span>
        <span className="text-xs font-semibold text-slate-400 mt-0.5">min</span>
        <span className="text-[10px] text-slate-400 mt-1">ETA</span>
      </div>
    </div>
  );
}

// ─── Ambulance Image Placeholder ──────────────────────────────────────────────

function AmbulanceAvatar({ status, type }: { status: Status; type: string }) {
  const colors: Record<Status, string> = {
    available: "from-blue-50 to-blue-100",
    onroute:   "from-amber-50 to-amber-100",
    busy:      "from-red-50 to-red-100",
  };
  return (
    <div className={`relative flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[status]} border border-slate-100 overflow-hidden`}>
      {/* Simple SVG ambulance */}
      <svg viewBox="0 0 64 40" className="w-14 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="4" y="12" width="46" height="20" rx="3" fill="#2563EB"/>
        {/* Cab */}
        <rect x="38" y="6" width="16" height="26" rx="3" fill="#1D4ED8"/>
        {/* Windows */}
        <rect x="40" y="9" width="11" height="9" rx="2" fill="#BAE6FD"/>
        <rect x="8" y="15" width="12" height="8" rx="1.5" fill="#BAE6FD"/>
        {/* Cross */}
        <rect x="18" y="14" width="12" height="4" rx="1" fill="white" opacity="0.9"/>
        <rect x="21" y="11" width="6" height="10" rx="1" fill="white" opacity="0.9"/>
        {/* Wheels */}
        <circle cx="14" cy="33" r="5" fill="#1E293B"/>
        <circle cx="14" cy="33" r="2.5" fill="#64748B"/>
        <circle cx="46" cy="33" r="5" fill="#1E293B"/>
        <circle cx="46" cy="33" r="2.5" fill="#64748B"/>
        {/* Siren */}
        <rect x="10" y="9" width="16" height="4" rx="1.5" fill="#EF4444"/>
        <rect x="10" y="9" width="7" height="4" rx="1.5" fill="#F59E0B"/>
      </svg>
      {/* Type badge */}
      <span className={`absolute bottom-1 right-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${typeColor[type]?.bg ?? "bg-blue-50"} ${typeColor[type]?.text ?? "text-blue-700"}`}>
        {type}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AmbulanceSection3() {
  const [sortBy, setSortBy] = useState<"nearest" | "eta" | "rating">("nearest");
  const [sortOpen, setSortOpen] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);

  const sorted = [...ambulances].sort((a, b) => {
    if (sortBy === "eta") return a.eta - b.eta;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.distanceNum - b.distanceNum;
  });

  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ETA gauge data
  const etaStats = [
    { icon: Navigation, label: "Distance",   value: "2.4 km",  color: "text-blue-600",    bg: "bg-blue-50"    },
    { icon: Wifi,       label: "Traffic",    value: "Light",   color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Gauge,      label: "Road Cond.", value: "Good",    color: "text-violet-600",  bg: "bg-violet-50"  },
    { icon: Activity,   label: "Availability", value: "High",  color: "text-amber-600",   bg: "bg-amber-50"   },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">

        {/* ── LEFT: Nearby Ambulances ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Nearby Ambulances</h2>
              <p className="text-xs text-slate-400 mt-0.5">{ambulances.filter(a => a.status !== "busy").length} units ready to dispatch</p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSortOpen(o => !o)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-white transition-all"
              >
                <SortAsc className="h-3.5 w-3.5" />
                Sort: {sortBy === "nearest" ? "Nearest" : sortBy === "eta" ? "ETA" : "Rating"}
                <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-1.5 w-36 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden"
                  >
                    {(["nearest", "eta", "rating"] as const).map(opt => (
                      <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-semibold capitalize hover:bg-slate-50 transition-colors
                          ${sortBy === opt ? "text-blue-600 bg-blue-50" : "text-slate-600"}`}>
                        {opt === "nearest" ? "Nearest First" : opt === "eta" ? "Fastest ETA" : "Top Rated"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Cards */}
          <div className="divide-y divide-slate-50 px-4 py-3 space-y-1">
            {sorted.map((amb, i) => {
              const cfg = statusCfg[amb.status];
              const isBooked = booked === amb.id;
              return (
                <motion.div
                  key={amb.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.09, duration: 0.45, ease: "easeOut" }}
                  whileHover={{ translateX: 2, boxShadow: "0 4px 20px -4px rgba(37,99,235,0.10)" }}
                  className="group relative flex items-center gap-4 rounded-2xl p-3.5 hover:bg-blue-50/30 transition-all duration-200 cursor-default"
                >
                  {/* Ambulance visual */}
                  <AmbulanceAvatar status={amb.status} type={amb.shortType} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800">{amb.number}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${amb.status === "available" ? "animate-pulse" : ""}`} />
                        {cfg.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{amb.type}</p>

                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {/* Distance */}
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="text-[11px] text-slate-500 font-medium">{amb.distance}</span>
                      </div>
                      {/* ETA */}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-400" />
                        <span className="text-[11px] text-blue-600 font-semibold">ETA {amb.eta} min</span>
                      </div>
                      {/* Driver */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-400">{amb.driver}</span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-400">{amb.driverStatus}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className={`h-2.5 w-2.5 ${si < Math.floor(amb.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                      ))}
                      <span className="text-[11px] font-semibold text-slate-600 ml-0.5">{amb.rating}</span>
                      <span className="text-[10px] text-slate-400">({amb.reviews})</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    whileHover={amb.status !== "busy" ? { scale: 1.06 } : {}}
                    whileTap={amb.status !== "busy" ? { scale: 0.95 } : {}}
                    onClick={() => amb.status !== "busy" && setBooked(isBooked ? null : amb.id)}
                    disabled={amb.status === "busy"}
                    className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-200
                      ${amb.status === "busy"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : isBooked
                          ? "bg-emerald-500 text-white shadow-emerald-200"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"}`}
                  >
                    {isBooked
                      ? <><CheckCircle2 className="h-3.5 w-3.5" /> Booked</>
                      : <>{amb.status === "busy" ? "Unavailable" : <><span>Book</span><ArrowRight className="h-3.5 w-3.5" /></>}</>
                    }
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <motion.button
              whileHover={{ x: 3 }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Ambulances <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* ── RIGHT: ETA Prediction ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">ETA Prediction</h2>
                <p className="text-xs text-slate-400">AI-powered dispatch estimate</p>
              </div>
            </div>
          </div>

          {/* Circular gauge */}
          <div className="flex flex-col items-center py-7 px-5">
            <CircularProgress eta={8} max={20} />
            <p className="mt-3 text-xs text-slate-400 font-medium text-center">
              Estimated arrival time to your location
            </p>

            {/* Confidence bar */}
            <div className="mt-4 w-full space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">Prediction Confidence</span>
                <span className="text-[11px] font-bold text-emerald-600">94%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2.5 px-5 pb-5">
            {etaStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2.5"
              >
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">{s.label}</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Availability score */}
          <div className="mx-5 mb-4 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-slate-700">Availability Score</span>
              </div>
              <span className="text-sm font-extrabold text-blue-600">8.7<span className="text-xs text-slate-400 font-medium">/10</span></span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
              />
            </div>
            <p className="text-[10px] text-slate-400">Based on units available, traffic & time of day</p>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-slate-100 mb-4" />

          {/* Success alert */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.45, ease: "easeOut" }}
            className="mx-5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800">Ambulance is on the way</p>
                <p className="text-xs text-emerald-600 mt-0.5">You will be connected shortly. Stay calm and keep this app open.</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 w-full rounded-full bg-emerald-100 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "40%" }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-emerald-500">Dispatched</span>
              <span className="text-[10px] text-emerald-400">En Route</span>
              <span className="text-[10px] text-slate-300">Arrived</span>
            </div>
          </motion.div>

          {/* Warning note */}
          <div className="mx-5 mb-5 flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              ETA may vary based on real-time traffic. Emergency vehicles receive signal priority.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
