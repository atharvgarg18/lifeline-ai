"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Droplets } from "lucide-react";

/* ─────────────────────────────────────────
   BLOOD BANK COMPONENT
───────────────────────────────────────── */
export default function BloodBank() {
  const [hovered, setHovered] = useState<boolean>(false);

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
        background: "#ffffff",
border: "1px solid #e5edf8",
boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Top red glow line */}
      <motion.div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(239,68,68,0.75), transparent)",
        }}
        animate={{ opacity: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Ambient radial glow */}
      <div
  className="absolute inset-0 pointer-events-none"
  style={{
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.05), transparent 45%)",
  }}
/>

      <div className="relative z-10 p-5">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "#fff1f2",
border: "1px solid #fecdd3",
              }}
              animate={{
                boxShadow: hovered
  ? "0 8px 24px rgba(37,99,235,.12)"
  : "0 4px 12px rgba(15,23,42,.05)",
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Droplets size={14} className="text-red-400" />
            </motion.div>
            <span
              className="text-slate-800 font-bold text-sm"
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.4px" }}
            >
              Blood Bank
            </span>
          </div>

          {/* Animated blood drop decoration */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="28" height="36" viewBox="0 0 28 36">
              <defs>
                <radialGradient id="dropGrad" cx="45%" cy="35%" r="55%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#991b1b" />
                </radialGradient>
              </defs>
              {/* glow */}
              <ellipse cx="14" cy="30" rx="10" ry="4"
                fill="rgba(239,68,68,0.25)"
                style={{ filter: "blur(3px)" }}
              />
              {/* drop */}
              <path
                d="M14 2 Q22 14 22 22 A8 8 0 0 1 6 22 Q6 14 14 2Z"
                fill="url(#dropGrad)"
                style={{ filter: "drop-shadow(0 0 6px rgba(239,68,68,0.8))" }}
              />
              {/* shine */}
              <ellipse cx="11" cy="16" rx="2.5" ry="4"
                fill="rgba(255,255,255,0.25)"
                transform="rotate(-15 11 16)"
              />
              {/* sparkles */}
              {[[22,4],[25,10],[20,8]].map(([x,y],i)=>(
                <motion.circle key={i} cx={x} cy={y} r="1.2"
                  fill="#fca5a5"
                  animate={{ opacity:[0,1,0], r:[0.8,1.6,0.8] }}
                  transition={{ duration:1.5, repeat:Infinity, delay:i*0.4 }}
                />
              ))}
            </svg>
          </motion.div>
        </div>

        {/* ── Emergency line ── */}
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-red-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <span className="text-rose-500 text-xs font-black tracking-wide">
            O+ Donors Needed
          </span>
        </div>
        <p className="text-slate-500 text-xs mb-3 pl-3.5">
          Emergency Requirement
        </p>

        {/* ── Progress bar 12/25 ── */}
        <div className="mb-1 flex items-center justify-between">
          <span
  className="text-slate-800 font-black text-base"
>
  12 / 25
</span>
          <span className="text-slate-600 text-xs">donors</span>
        </div>
        <div
          className="w-full h-2 rounded-full mb-4 overflow-hidden"
          style={{ background: "#e2e8f0"}}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#2563eb,#3b82f6)",
              boxShadow: "0 0 8px rgba(239,68,68,0.7)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "48%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </div>

        {/* ── Donate Now Button ── */}
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 24px rgba(239,68,68,0.45)",
          }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white relative overflow-hidden"
          style={{
 background: "linear-gradient(135deg,#1D8BFF,#2563EB)",
  border: "1px solid #bfdbfe",
  boxShadow: "0 8px 20px rgba(37,99,235,.2)",
}}
        >
          {/* shimmer */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.4) 50%,transparent 60%)",
            }}
          />
          <Droplets size={14} />
          Donate Now
        </motion.button>
      </div>
    </motion.div>
  );
}
