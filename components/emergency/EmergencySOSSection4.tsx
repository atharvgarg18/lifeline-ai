"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animate } from "framer-motion";
import {
  MapPin, Bed, Activity, Star, Zap, Navigation,
  Clock, Phone, ChevronRight, Wifi, Shield, TrendingUp,
  AlertCircle, CheckCircle2, Circle, ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Hospital {
  id: string;
  name: string;
  shortName: string;
  address: string;
  distance: number;
  totalBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuAvailable: number;
  rating: number;
  status: "available" | "limited" | "critical";
  eta: number;
  phone: string;
  specialties: string[];
  mapX: number;
  mapY: number;
  color: string;
  accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const hospitals: Hospital[] = [
  {
    id: "apollo",
    name: "Apollo Hospital",
    shortName: "Apollo",
    address: "Sector 1, Shyam Nagar, Raipur",
    distance: 2.1,
    totalBeds: 320,
    availableBeds: 47,
    icuTotal: 40,
    icuAvailable: 8,
    rating: 4.9,
    status: "available",
    eta: 4,
    phone: "+91 771 400 2000",
    specialties: ["Trauma", "Cardiology", "Neurology"],
    mapX: 68, mapY: 28,
    color: "from-blue-500 to-blue-700",
    accent: "#2563EB",
  },
  {
    id: "aiims",
    name: "AIIMS Trauma Center",
    shortName: "AIIMS",
    address: "GE Road, Tatibandh, Raipur",
    distance: 3.8,
    totalBeds: 500,
    availableBeds: 23,
    icuTotal: 60,
    icuAvailable: 3,
    rating: 4.8,
    status: "limited",
    eta: 7,
    phone: "+91 771 257 3600",
    specialties: ["Trauma", "Burns", "Ortho"],
    mapX: 38, mapY: 52,
    color: "from-violet-500 to-violet-700",
    accent: "#7C3AED",
  },
  {
    id: "citycare",
    name: "City Care Hospital",
    shortName: "City Care",
    address: "Ring Road No. 1, Avanti Vihar",
    distance: 1.4,
    totalBeds: 180,
    availableBeds: 62,
    icuTotal: 24,
    icuAvailable: 11,
    rating: 4.6,
    status: "available",
    eta: 3,
    phone: "+91 771 299 3344",
    specialties: ["Emergency", "Pediatrics", "Surgery"],
    mapX: 54, mapY: 68,
    color: "from-emerald-500 to-emerald-700",
    accent: "#059669",
  },
  {
    id: "emc",
    name: "Emergency Medical Center",
    shortName: "EMC",
    address: "Pandri, Near Bus Stand, Raipur",
    distance: 4.5,
    totalBeds: 240,
    availableBeds: 5,
    icuTotal: 32,
    icuAvailable: 1,
    rating: 4.5,
    status: "critical",
    eta: 9,
    phone: "+91 771 401 5555",
    specialties: ["Critical Care", "Toxicology"],
    mapX: 22, mapY: 36,
    color: "from-red-500 to-rose-700",
    accent: "#DC2626",
  },
];

const statusConfig = {
  available: {
    label: "Available",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    ring: "bg-emerald-400",
  },
  limited: {
    label: "Limited",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    ring: "bg-amber-400",
  },
  critical: {
    label: "Critical",
    bg: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    ring: "bg-red-400",
  },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, to, { duration, ease: "easeOut", onUpdate: (v) => setVal(Math.round(v)) });
    return ctrl.stop;
  }, [to, duration]);
  return <>{val}</>;
}

// ─── Bed Bar ─────────────────────────────────────────────────────────────────
function BedBar({ available, total, color }: { available: number; total: number; color: string }) {
  const pct = (available / total) * 100;
  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

// ─── Hospital Card ────────────────────────────────────────────────────────────
function HospitalCard({
  hospital, index, selected, onSelect,
}: {
  hospital: Hospital; index: number; selected: boolean; onSelect: () => void;
}) {
  const cfg = statusConfig[hospital.status];
  const bedPct = Math.round((hospital.availableBeds / hospital.totalBeds) * 100);
  const icuPct = Math.round((hospital.icuAvailable / hospital.icuTotal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onSelect}
      whileHover={{ y: -4 }}
      className={`relative bg-white rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden group
        ${selected
          ? "border-blue-400 shadow-xl shadow-blue-100/60"
          : "border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200"
        }`}
    >
      {/* Selected accent top bar */}
      {selected && (
        <motion.div
          layoutId="selected-bar"
          className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"
        />
      )}

      {/* Hover shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-transparent transition-all duration-400 pointer-events-none"
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-start gap-3">
            {/* Color avatar */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hospital.color} flex items-center justify-center shadow-md flex-shrink-0 mt-0.5`}>
              <span className="text-white text-xs font-black">{hospital.shortName[0]}</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">{hospital.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 truncate max-w-[160px]">{hospital.address}</span>
              </div>
            </div>
          </div>
          {/* Status badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold flex-shrink-0 ${cfg.bg}`}>
            <span className="relative flex">
              <motion.span
                animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className={`absolute w-2 h-2 rounded-full ${cfg.ring}`}
              />
              <span className={`relative w-2 h-2 rounded-full ${cfg.dot}`} />
            </span>
            {cfg.label}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Distance */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Navigation size={11} className="text-blue-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Distance</span>
            </div>
            <p className="text-xl font-black text-slate-900 leading-none">
              <Counter to={hospital.distance * 10} duration={1.4} />
              <span className="text-xs font-semibold text-slate-400">/10 km</span>
            </p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{hospital.distance} km away</p>
          </div>

          {/* ETA */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={11} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ETA</span>
            </div>
            <p className="text-xl font-black text-slate-900 leading-none">
              <Counter to={hospital.eta} duration={1.2} />
              <span className="text-xs font-semibold text-slate-400"> min</span>
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Via green corridor</p>
          </div>
        </div>

        {/* Bed availability */}
        <div className="space-y-3 mb-4">
          {/* General beds */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Bed size={11} className="text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Available Beds</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-900">
                  <Counter to={hospital.availableBeds} duration={1.5} />
                </span>
                <span className="text-[10px] text-slate-400">/ {hospital.totalBeds}</span>
                <span className="text-[10px] font-bold text-blue-600 ml-1">{bedPct}%</span>
              </div>
            </div>
            <BedBar available={hospital.availableBeds} total={hospital.totalBeds} color={hospital.accent} />
          </div>

          {/* ICU beds */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity size={11} className="text-red-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ICU Beds</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-900">
                  <Counter to={hospital.icuAvailable} duration={1.6} />
                </span>
                <span className="text-[10px] text-slate-400">/ {hospital.icuTotal}</span>
                <span className={`text-[10px] font-bold ml-1 ${icuPct > 20 ? "text-emerald-600" : icuPct > 5 ? "text-amber-600" : "text-red-600"}`}>
                  {icuPct}%
                </span>
              </div>
            </div>
            <BedBar
              available={hospital.icuAvailable}
              total={hospital.icuTotal}
              color={icuPct > 20 ? "#10B981" : icuPct > 5 ? "#F59E0B" : "#EF4444"}
            />
          </div>
        </div>

        {/* Rating + specialties */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={s <= Math.round(hospital.rating) ? "text-amber-400" : "text-slate-200"}
                fill={s <= Math.round(hospital.rating) ? "currentColor" : "none"}
              />
            ))}
            <span className="text-xs font-bold text-slate-700 ml-1">{hospital.rating}</span>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {hospital.specialties.slice(0, 2).map((s) => (
              <span key={s} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded content on selection */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone size={12} className="text-blue-500" />
                  <span className="font-mono font-semibold">{hospital.phone}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {hospital.specialties.map((s) => (
                    <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Zap size={12} />
                    Dispatch Here
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    <Navigation size={12} />
                    Route
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!selected && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
              <span className="text-[10px] text-slate-400 font-medium">Live data</span>
            </div>
            <motion.span
              whileHover={{ x: 2 }}
              className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600"
            >
              View details <ChevronRight size={11} />
            </motion.span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Map Dot ──────────────────────────────────────────────────────────────────
function MapDot({
  hospital, selected, onSelect,
}: {
  hospital: Hospital; selected: boolean; onSelect: () => void;
}) {
  const cfg = statusConfig[hospital.status];
  return (
    <button
      onClick={onSelect}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${hospital.mapX}%`, top: `${hospital.mapY}%` }}
    >
      {/* Pulse ring */}
      <motion.span
        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        className={`absolute inset-0 rounded-full ${cfg.ring}`}
      />
      {/* Dot */}
      <motion.div
        animate={selected ? { scale: 1.3 } : { scale: 1 }}
        whileHover={{ scale: 1.25 }}
        className={`relative w-4 h-4 rounded-full ${cfg.dot} border-2 border-white shadow-lg`}
      />
      {/* Tooltip */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none transition-all duration-200
        ${selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"}`}>
        <div className="bg-slate-900 text-white text-[10px] font-semibold rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
          {hospital.shortName}
          <div className="flex items-center gap-1 mt-0.5">
            <Clock size={8} />
            <span className="text-slate-300">{hospital.eta} min</span>
          </div>
        </div>
        <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
      </div>
    </button>
  );
}

// ─── Map SVG Roads ─────────────────────────────────────────────────────────────
function CityMapSVG() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="280" fill="url(#mapGrid)" />
      {/* City blocks */}
      {[
        [10,10,60,40],[90,10,70,40],[180,10,60,35],[260,10,80,40],[360,10,30,40],
        [10,65,40,55],[70,65,80,55],[170,65,50,55],[240,65,70,55],[330,65,60,55],
        [10,140,55,50],[85,140,60,50],[165,140,65,50],[250,140,60,50],[330,140,60,50],
        [10,210,70,55],[100,210,60,55],[180,210,80,55],[280,210,60,55],[360,210,30,55],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#EEF2F8" stroke="#D8E2EF" strokeWidth="0.5" />
      ))}
      {/* Roads */}
      <line x1="0" y1="120" x2="400" y2="120" stroke="#D1D9E6" strokeWidth="7" />
      <line x1="0" y1="200" x2="400" y2="200" stroke="#D1D9E6" strokeWidth="7" />
      <line x1="80" y1="0" x2="80" y2="280" stroke="#D1D9E6" strokeWidth="7" />
      <line x1="200" y1="0" x2="200" y2="280" stroke="#D1D9E6" strokeWidth="7" />
      <line x1="320" y1="0" x2="320" y2="280" stroke="#D1D9E6" strokeWidth="7" />
      {/* Center dashes */}
      {[120,200].map(y => Array.from({length:10}).map((_,i) => (
        <line key={`h${y}${i}`} x1={i*44+4} y1={y} x2={i*44+26} y2={y} stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="2" />
      )))}
      {[80,200,320].map(x => Array.from({length:7}).map((_,i) => (
        <line key={`v${x}${i}`} x1={x} y1={i*44+4} x2={x} y2={i*44+26} stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="2" />
      )))}
    </svg>
  );
}

// ─── Live Update Ticker ────────────────────────────────────────────────────────
const updates = [
  "Apollo Hospital: 2 new beds available in ICU",
  "AIIMS Trauma: Surge protocol activated — capacity reduced",
  "City Care: Ambulance dock 3 clear · ready to receive",
  "EMC: Critical status — rerouting to alternate facilities",
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % updates.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-2 flex-shrink-0">
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-2 h-2 rounded-full bg-red-500"
        />
        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live</span>
      </div>
      <div className="h-3.5 w-px bg-slate-200" />
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-slate-600 font-medium truncate"
        >
          {updates[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Network Summary Bar ───────────────────────────────────────────────────────
function SummaryBar() {
  const totalBeds = hospitals.reduce((s, h) => s + h.availableBeds, 0);
  const totalICU = hospitals.reduce((s, h) => s + h.icuAvailable, 0);
  const available = hospitals.filter(h => h.status === "available").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { icon: CheckCircle2, label: "Hospitals Ready", value: available, suffix: `/ ${hospitals.length}`, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
        { icon: Bed, label: "Total Beds Free", value: totalBeds, suffix: "", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
        { icon: Activity, label: "ICU Available", value: totalICU, suffix: "", color: "text-red-600", bg: "bg-red-50 border-red-100" },
        { icon: Wifi, label: "Network Uptime", value: 99, suffix: "%", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${item.bg}`}
          >
            <Icon size={16} className={item.color} />
            <div>
              <p className="text-xl font-black text-slate-900 leading-none">
                <Counter to={item.value} />{item.suffix}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HospitalNetwork() {
  const [selectedId, setSelectedId] = useState<string | null>("apollo");

  const selected = hospitals.find(h => h.id === selectedId) ?? null;

  return (
    <section className="w-full bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">LifeLine Network</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hospital Network</h2>
            <p className="text-slate-500 mt-1 text-sm">Real-time bed availability across emergency-ready facilities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="w-2 h-2 rounded-full bg-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-700">All Systems Online</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield size={13} className="text-blue-500" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* ── Summary Bar ── */}
        <SummaryBar />

        {/* ── Live ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm"
        >
          <LiveTicker />
          <div className="ml-auto flex-shrink-0">
            <span className="text-[10px] font-mono text-slate-400">
              Updated {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        </motion.div>

        {/* ── Main layout: cards + map ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* Hospital cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hospitals.map((h, i) => (
              <HospitalCard
                key={h.id}
                hospital={h}
                index={i}
                selected={selectedId === h.id}
                onSelect={() => setSelectedId(selectedId === h.id ? null : h.id)}
              />
            ))}
          </div>

          {/* Map panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            {/* Map header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-600" />
                <span className="text-sm font-black text-slate-800">Network Map</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-mono">Raipur, CG</span>
                <div className="flex items-center gap-1">
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                  />
                  <span className="text-[10px] font-bold text-red-600">LIVE</span>
                </div>
              </div>
            </div>

            {/* Map area */}
            <div className="relative flex-1 min-h-[260px] overflow-hidden bg-[#F0F4FA]">
              <CityMapSVG />
              {/* Ambulance origin */}
              <div className="absolute" style={{ left: "78%", top: "82%" }}>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center"
                >
                  <span className="text-[8px] text-white font-black">A</span>
                </motion.div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] font-bold text-blue-700 whitespace-nowrap">AMB-14</span>
              </div>
              {/* Hospital dots */}
              {hospitals.map((h) => (
                <MapDot
                  key={h.id}
                  hospital={h}
                  selected={selectedId === h.id}
                  onSelect={() => setSelectedId(selectedId === h.id ? null : h.id)}
                />
              ))}
              {/* Route line to selected */}
              {selected && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.line
                    x1="78%" y1="82%"
                    x2={`${selected.mapX}%`} y2={`${selected.mapY}%`}
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </svg>
              )}
            </div>

            {/* Map legend */}
            <div className="px-4 py-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(["available", "limited", "critical"] as const).map((s) => {
                    const c = statusConfig[s];
                    return (
                      <div key={s} className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        <span className="text-[10px] text-slate-500 font-medium capitalize">{c.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 bg-blue-500 rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg,#2563EB,#2563EB 4px,transparent 4px,transparent 8px)" }} />
                  <span className="text-[10px] text-slate-400">Route</span>
                </div>
              </div>
            </div>

            {/* Selected hospital quick info */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-blue-100"
                >
                  <div className="px-4 py-3 bg-blue-50/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-slate-900">{selected.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {selected.availableBeds} beds · {selected.icuAvailable} ICU · {selected.eta} min ETA
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold"
                      >
                        <Zap size={10} />
                        Dispatch
                        <ArrowRight size={10} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
