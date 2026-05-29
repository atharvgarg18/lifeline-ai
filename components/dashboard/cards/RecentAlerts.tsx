"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Building2,
  Truck,
  ChevronRight,
  Bell,
} from "lucide-react";

/* ─────────────────────────────────────────
   ALERT DATA
───────────────────────────────────────── */
const alerts = [
  {
    id: 1,
    icon: AlertTriangle,
    iconBg: "rgba(239,68,68,0.15)",
    iconBorder: "rgba(239,68,68,0.35)",
    iconColor: "#ef4444",
    dotColor: "#ef4444",
    title: "Accident Reported",
    location: "Ring Road, Sector 12",
    time: "2 min ago",
    glow: "rgba(239,68,68,0.10)",
  },
  {
    id: 2,
    icon: TrendingUp,
    iconBg: "rgba(249,115,22,0.15)",
    iconBorder: "rgba(249,115,22,0.30)",
    iconColor: "#f97316",
    dotColor: "#f97316",
    title: "High Traffic",
    location: "MG Road",
    time: "5 min ago",
    glow: "rgba(249,115,22,0.08)",
  },
  {
    id: 3,
    icon: Building2,
    iconBg: "rgba(234,179,8,0.15)",
    iconBorder: "rgba(234,179,8,0.30)",
    iconColor: "#eab308",
    dotColor: "#eab308",
    title: "Hospital Full",
    location: "City Care Hospital",
    time: "10 min ago",
    glow: "rgba(234,179,8,0.08)",
  },
  {
    id: 4,
    icon: Truck,
    iconBg: "rgba(34,197,94,0.15)",
    iconBorder: "rgba(34,197,94,0.30)",
    iconColor: "#22c55e",
    dotColor: "#22c55e",
    title: "Ambulance Dispatched",
    location: "Apollo Hospital",
    time: "12 min ago",
    glow: "rgba(34,197,94,0.08)",
  },
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function RecentAlerts() {
  const [hovered, setHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background:"#FFFFFF",
border:"1px solid #DBEAFE",
boxShadow:"0 4px 24px rgba(37,99,235,.08)",
      }}
    >
      {/* top cyan glow line */}
      <motion.div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)",
        }}
        animate={{ opacity: hovered ? 1 : 0.45 }}
        transition={{ duration: 0.3 }}
      />

      {/* ambient radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 5% 5%, rgba(6,182,212,0.07) 0%, transparent 55%)",
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.4s",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(239,68,68,0.13)",
                border: "1px solid rgba(239,68,68,0.28)",
              }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(239,68,68,0.2)",
                  "0 0 12px rgba(239,68,68,0.45)",
                  "0 0 0px rgba(239,68,68,0.2)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <Bell size={14} className="text-red-400" />
            </motion.div>
            <span
              className="text-slate-800 font-bold text-sm"
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.4px" }}
            >
              Recent Alerts
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

        {/* Alert rows */}
        <div className="flex flex-col gap-2">
          {alerts.map((alert, i) => {
            const Icon = alert.icon;
            const isHovered = hoveredRow === alert.id;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.08 }}
                onHoverStart={() => setHoveredRow(alert.id)}
                onHoverEnd={() => setHoveredRow(null)}
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer"
                style={{
                  background: isHovered
                    ? alert.glow
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${
                    isHovered ? alert.iconBorder : "rgba(255,255,255,0.05)"
                  }`,
                  boxShadow: isHovered
                    ? `0 0 16px ${alert.glow}`
                    : "none",
                  transition: "background 0.25s, border 0.25s, box-shadow 0.25s",
                }}
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: alert.iconBg,
                    border: `1px solid ${alert.iconBorder}`,
                  }}
                >
                  <Icon size={14} style={{ color: alert.iconColor }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: alert.dotColor }}
                      animate={{ opacity: [1, 0.35, 1] }}
                      transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
                    />
                    <p
                      className="text-slate-800 text-xs font-semibold truncate"
                      style={{ fontFamily: "Rajdhani, sans-serif" }}
                    >
                      {alert.title}
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs truncate pl-3">
                    {alert.location}
                  </p>
                </div>

                {/* Time */}
                <span className="text-slate-600 text-xs whitespace-nowrap flex-shrink-0">
                  {alert.time}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
