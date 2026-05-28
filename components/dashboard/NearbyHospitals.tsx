"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, ChevronRight, Clock } from "lucide-react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const hospitals = [
  {
    id: 1,
    name: "Apollo Hospital",
    distance: "2.8 km",
    eta: "6 mins",
    available: true,
  },
  {
    id: 2,
    name: "City Care Hospital",
    distance: "3.6 km",
    eta: "8 mins",
    available: true,
  },
  {
    id: 3,
    name: "Medicare Hospital",
    distance: "4.2 km",
    eta: "9 mins",
    available: true,
  },
];

/* ─────────────────────────────────────────
   HOSPITAL ROW
───────────────────────────────────────── */
function HospitalRow({
  hospital,
  index,
}: {
  hospital: (typeof hospitals)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.09 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 2 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer"
      style={{
        background: hovered
          ? "rgba(6,182,212,0.06)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${
          hovered ? "rgba(6,182,212,0.28)" : "rgba(255,255,255,0.05)"
        }`,
        boxShadow: hovered ? "0 0 14px rgba(6,182,212,0.08)" : "none",
        transition: "background 0.25s, border 0.25s, box-shadow 0.25s",
      }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: hovered
            ? "rgba(6,182,212,0.15)"
            : "rgba(6,182,212,0.08)",
          border: `1px solid ${
            hovered ? "rgba(6,182,212,0.35)" : "rgba(6,182,212,0.18)"
          }`,
          transition: "background 0.25s, border 0.25s",
        }}
      >
        <Building2 size={15} className="text-cyan-400" />
      </div>

      {/* Name */}
      <p
        className="flex-1 text-white text-xs font-semibold truncate"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {hospital.name}
      </p>

      {/* Distance */}
      <span
        className="text-cyan-400 text-xs font-black whitespace-nowrap"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {hospital.distance}
      </span>

      {/* ETA */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        <Clock size={10} className="text-slate-500" />
        <span className="text-slate-400 text-xs">{hospital.eta}</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function NearbyHospitals() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, rgba(10,20,46,0.97) 0%, rgba(5,11,23,0.99) 100%)",
        border: `1px solid ${
          hovered ? "rgba(6,182,212,0.38)" : "rgba(30,58,95,0.85)"
        }`,
        boxShadow: hovered
          ? "0 0 40px rgba(6,182,212,0.13), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 6px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Top cyan glow line */}
      <motion.div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)",
        }}
        animate={{ opacity: hovered ? 1 : 0.45 }}
        transition={{ duration: 0.3 }}
      />

      {/* Ambient radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 5% 5%, rgba(6,182,212,0.07) 0%, transparent 55%)",
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.4s",
        }}
      />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(6,182,212,0.13)",
                border: "1px solid rgba(6,182,212,0.28)",
              }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(6,182,212,0.2)",
                  "0 0 12px rgba(6,182,212,0.45)",
                  "0 0 0px rgba(6,182,212,0.2)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <Building2 size={14} className="text-cyan-400" />
            </motion.div>
            <span
              className="text-white font-bold text-sm"
              style={{
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.4px",
              }}
            >
              Nearby Hospitals
            </span>
          </div>

          <motion.button
            whileHover={{ x: 2 }}
            className="flex items-center gap-0.5 text-cyan-400 text-xs font-semibold hover:text-cyan-300 transition-colors"
          >
            View All
            <ChevronRight size={12} />
          </motion.button>
        </div>

        {/* Hospital rows */}
        <div className="flex flex-col gap-2">
          {hospitals.map((h, i) => (
            <HospitalRow key={h.id} hospital={h} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
