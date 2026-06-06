"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  BadgeCheck,
  Clock,
  Maximize2,
  Navigation,
  BedDouble,
  HeartPulse,
  ChevronRight,
  Plus,
  Minus,
  Crosshair,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const HOSPITALS = [
  {
    id: 1,
    name: "Apollo Hospital",
    type: "Multi Speciality Hospital",
    rating: 4.7,
    reviews: 1284,
    distance: "1.2 km",
    emergency: true,
    icu: true,
    beds: 250,
    address: "Main Road, Shankar Nagar, Raipur, CG 492007",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=120&h=80&fit=crop",
    mapX: 52,
    mapY: 38,
    color: "#2563EB",
  },
  {
    id: 2,
    name: "AIIMS Raipur",
    type: "Government Hospital",
    rating: 4.5,
    reviews: 856,
    distance: "2.8 km",
    emergency: true,
    icu: true,
    beds: 480,
    address: "Tatibandh, GE Road, Raipur, CG 492099",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&h=80&fit=crop",
    mapX: 38,
    mapY: 28,
    color: "#10B981",
  },
  {
    id: 3,
    name: "Max Super Speciality Hospital",
    type: "Super Speciality Hospital",
    rating: 4.6,
    reviews: 742,
    distance: "3.6 km",
    emergency: true,
    icu: true,
    beds: 190,
    address: "Pachpedi Naka, Raipur, CG 492001",
    img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&h=80&fit=crop",
    mapX: 68,
    mapY: 55,
    color: "#8B5CF6",
  },
  {
    id: 4,
    name: "Marengo Asia Hospitals",
    type: "Multi Speciality Hospital",
    rating: 4.4,
    reviews: 568,
    distance: "4.2 km",
    emergency: true,
    icu: false,
    beds: 150,
    address: "VIP Road, Raipur, CG 492006",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&h=80&fit=crop",
    mapX: 24,
    mapY: 60,
    color: "#F59E0B",
  },
  {
    id: 5,
    name: "MMI Narayana Hospital",
    type: "Multi Speciality Hospital",
    rating: 4.3,
    reviews: 412,
    distance: "5.1 km",
    emergency: true,
    icu: true,
    beds: 320,
    address: "Dhamtari Road, Raipur, CG 492013",
    img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=120&h=80&fit=crop",
    mapX: 72,
    mapY: 70,
    color: "#EF4444",
  },
];

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.floor(rating) ? "text-amber-400" : "text-slate-200"}
          fill={i <= Math.floor(rating) ? "#FBBF24" : "#E2E8F0"}
        />
      ))}
    </div>
  );
}

// ─── Hospital List Card ────────────────────────────────────────────────────────
function HospitalCard({
  h,
  active,
  onClick,
  delay,
}: {
  h: (typeof HOSPITALS)[0];
  active: boolean;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.div
      custom={delay}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(37,99,235,0.10)" }}
      onClick={onClick}
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
        active
          ? "border-blue-400 bg-blue-50/60 shadow-md shadow-blue-100"
          : "border-slate-200 bg-white hover:border-blue-200"
      }`}
    >
      {/* Active indicator strip */}
      {active && (
        <motion.div
          layoutId="activeStrip"
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-blue-500"
        />
      )}

      {/* Image */}
      <div className="w-[72px] h-[56px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
        <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-sm font-bold text-slate-900 truncate">{h.name}</p>
          <BadgeCheck size={13} className="text-blue-500 flex-shrink-0" fill="#DBEAFE" />
        </div>
        <p className="text-[11px] text-slate-400 mb-1.5">{h.type}</p>
        <div className="flex items-center gap-2">
          <Stars rating={h.rating} />
          <span className="text-[11px] font-semibold text-slate-600">{h.rating}</span>
          <span className="text-[11px] text-slate-400">({h.reviews.toLocaleString()})</span>
        </div>
      </div>

      {/* Right meta */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1 text-slate-500">
          <MapPin size={11} />
          <span className="text-[11px] font-semibold">{h.distance}</span>
        </div>
        {h.emergency && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            24x7 Available
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Map Marker ───────────────────────────────────────────────────────────────
function MapMarker({
  h,
  active,
  onClick,
}: {
  h: (typeof HOSPITALS)[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      style={{ left: `${h.mapX}%`, top: `${h.mapY}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <div
        className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
          active ? "w-10 h-10" : "w-8 h-8"
        }`}
        style={{ backgroundColor: h.color }}
      >
        <HeartPulse size={active ? 16 : 13} className="text-white" />
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: h.color }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-lg whitespace-nowrap"
        >
          <p className="text-[11px] font-bold text-slate-800">{h.name}</p>
          <p className="text-[10px] text-slate-400">{h.distance}</p>
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HospitalsSection2() {
  const [activeId, setActiveId] = useState(1);
  const activeHospital = HOSPITALS.find((h) => h.id === activeId)!;

  return (
    <section className="w-full mt-6">
      <div className="flex gap-5 items-start">
        {/* ══════════════════════════════════════════════════
            LEFT — Hospital List
        ══════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3 w-[420px] flex-shrink-0">
          {/* List header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Nearby Hospitals{" "}
                <span className="text-slate-400 font-normal">(42)</span>
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500 font-medium">
              Sort by: Distance
              <ChevronRight size={12} className="rotate-90" />
            </div>
          </motion.div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5">
            {HOSPITALS.map((h, i) => (
              <HospitalCard
                key={h.id}
                h={h}
                active={activeId === h.id}
                onClick={() => setActiveId(h.id)}
                delay={i}
              />
            ))}
          </div>

          {/* View All */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01, boxShadow: "0 6px 24px rgba(37,99,235,0.10)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-1 w-full flex items-center justify-center gap-2 border border-slate-200 bg-white text-blue-600 font-semibold text-sm py-3.5 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
          >
            View All Hospitals
            <ArrowRight size={15} />
          </motion.button>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT — Map + Detail Card
        ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col gap-4 min-w-0"
        >
          {/* Map Card */}
          <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm" style={{ height: 340 }}>
            {/* Map background — stylized tile mockup */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #e8f0fe 0%, #f0f4ff 30%, #e2f3ec 60%, #fef9e7 100%)",
              }}
            >
              {/* Road lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 340">
                <line x1="0" y1="170" x2="600" y2="170" stroke="#94a3b8" strokeWidth="3" />
                <line x1="0" y1="120" x2="600" y2="140" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="220" x2="600" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="300" y1="0" x2="300" y2="340" stroke="#94a3b8" strokeWidth="3" />
                <line x1="180" y1="0" x2="150" y2="340" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="420" y1="0" x2="450" y2="340" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="300" cy="170" r="40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="300" cy="170" r="80" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 6" />
                <circle cx="300" cy="170" r="120" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 8" />
              </svg>

              {/* Area labels */}
              <span className="absolute text-[10px] font-semibold text-slate-400 select-none" style={{ top: "12%", left: "14%" }}>TATIBANDH</span>
              <span className="absolute text-[10px] font-semibold text-slate-400 select-none" style={{ top: "8%", left: "55%" }}>DEVENDRA NAGAR</span>
              <span className="absolute text-[10px] font-semibold text-slate-400 select-none" style={{ top: "55%", right: "6%" }}>SUNDAR NAGAR</span>
              <span className="absolute text-[10px] font-semibold text-slate-400 select-none" style={{ bottom: "12%", right: "8%" }}>KUMHARI</span>
              <span className="absolute text-[10px] font-semibold text-slate-400 select-none" style={{ top: "8%", right: "8%" }}>KABIR NAGAR</span>

              {/* City label */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <p className="text-base font-bold text-slate-600 text-center select-none tracking-wide">Raipur</p>
              </div>
            </div>

            {/* Current location marker */}
            <div className="absolute z-20" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500"
                  animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Hospital Markers */}
            {HOSPITALS.map((h) => (
              <MapMarker
                key={h.id}
                h={h}
                active={activeId === h.id}
                onClick={() => setActiveId(h.id)}
              />
            ))}

            {/* View Full Map */}
            <button className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl shadow-sm hover:bg-white hover:shadow-md transition-all">
              <Maximize2 size={12} />
              View Full Map
            </button>

            {/* Zoom controls */}
            <div className="absolute right-3 bottom-3 z-30 flex flex-col gap-1">
              <button className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                <Plus size={14} />
              </button>
              <button className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                <Minus size={14} />
              </button>
              <button className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm mt-0.5">
                <Crosshair size={13} />
              </button>
            </div>
          </div>

          {/* ── Selected Hospital Detail Card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex gap-4"
            >
              {/* Image */}
              <div className="w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img
                  src={activeHospital.img}
                  alt={activeHospital.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-bold text-slate-900 text-sm">{activeHospital.name}</p>
                  <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" fill="#DBEAFE" />
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{activeHospital.type}</p>

                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={11} className="text-slate-400" />
                  <p className="text-[11px] text-slate-500 truncate">{activeHospital.address}</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Stars rating={activeHospital.rating} />
                    <span className="text-[11px] font-bold text-slate-700">{activeHospital.rating}</span>
                    <span className="text-[11px] text-slate-400">({activeHospital.reviews.toLocaleString()} Reviews)</span>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <HeartPulse size={9} /> 24x7 Emergency
                  </span>
                  {activeHospital.icu && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={9} /> ICU
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                    <BedDouble size={9} /> {activeHospital.beds} Beds
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="border border-slate-200 bg-white text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  View Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(37,99,235,0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Navigation size={11} />
                  Get Directions
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
