"use client";


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Building2,
  ShieldCheck,
  Users,
  MapPin,
  Phone,
  Heart,
  MessageCircle,
  Droplets,
  ChevronRight,
  AlertTriangle,
  Info,
  BedDouble,
  Clock,
  ArrowUpRight,
  Zap,
} from "lucide-react";

// ─── Shared fade-up stagger ──────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } },
};

// ─── 1. STATS CARDS ROW ──────────────────────────────────────────────────────
const statsData = [
  {
    id: "Siren",
    icon: Bell,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badgeBg: "bg-red-500",
    label: "Nearest Siren",
    value: "3.2 km",
    sub: "ETA: 6 mins",
    subColor: "text-emerald-500",
    cta: "View Details",
    accentBar: "from-red-400 to-orange-300",
  },
  {
    id: "Building2",
    icon: Building2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-500",
    label: "Nearest Building2",
    value: "Apollo Building2",
    sub: "2.8 km away",
    subColor: "text-blue-400",
    cta: "View Details",
    accentBar: "from-blue-400 to-cyan-300",
  },
  {
    id: "healthid",
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badgeBg: "bg-emerald-500",
    label: "Your Health ID",
    value: "LHID-2024-7845",
    sub: null,
    subColor: null,
    cta: "View Profile",
    accentBar: "from-emerald-400 to-teal-300",
  },
  {
    id: "contacts",
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    badgeBg: "bg-violet-500",
    label: "Emergency Contacts",
    value: "3 Contacts",
    sub: null,
    subColor: null,
    cta: "View All",
    accentBar: "from-violet-400 to-purple-300",
  },
];

interface StatCardProps {
  card: {
    id: string;
    icon: any;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    label: string;
    value: string;
    sub: string | null;
    subColor: string | null;
    cta: string;
    accentBar: string;
  };
  index: number;
}

function StatCard({ card, index }: StatCardProps) {
  const Icon = card.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.10)" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative bg-white rounded-[20px] p-5 flex flex-col gap-3 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden flex-1 min-w-0 cursor-pointer group transition-shadow duration-300"
    >
      {/* Top accent bar */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accentBar} rounded-t-[20px]`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0.35 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Icon + label row */}
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon size={21} className={card.iconColor} strokeWidth={1.8} />
        </div>
        <motion.div
          animate={{ rotate: hovered ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center"
        >
          <ArrowUpRight size={13} className="text-slate-400" />
        </motion.div>
      </div>

      {/* Label */}
      <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase leading-tight">
        {card.label}
      </p>

      {/* Value */}
      <p className="text-[18px] font-black text-slate-800 leading-tight tracking-tight truncate">
        {card.value}
      </p>

      {/* Sub */}
      {card.sub && (
        <p className={`text-[11px] font-semibold ${card.subColor} -mt-1`}>
          {card.sub}
        </p>
      )}

      {/* CTA */}
      <motion.button
        whileHover={{ x: 2 }}
        className="mt-auto flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors self-start"
      >
        {card.cta}
        <ChevronRight size={12} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}

export function StatsCardsRow() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex gap-3"
    >
      {statsData.map((card, i) => (
        <StatCard key={card.id} card={card} index={i} />
      ))}
    </motion.div>
  );
}

// ─── 2. QUICK ACTIONS PANEL ───────────────────────────────────────────────────
const actions = [
  {
    id: "location",
    icon: MapPin,
    label: "Share Location",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    glow: "hover:shadow-blue-100",
    ring: "hover:ring-blue-200",
  },
  {
    id: "call",
    icon: Phone,
    label: "Call 108",
    bg: "bg-red-50",
    iconColor: "text-red-500",
    glow: "hover:shadow-red-100",
    ring: "hover:ring-red-200",
  },
  {
    id: "Building2",
    icon: Building2,
    label: "Find Building2",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    glow: "hover:shadow-emerald-100",
    ring: "hover:ring-emerald-200",
  },
  {
    id: "health",
    icon: Heart,
    label: "Health Tips",
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
    glow: "hover:shadow-violet-100",
    ring: "hover:ring-violet-200",
  },
  {
    id: "ai",
    icon: MessageCircle,
    label: "AI Chat",
    bg: "bg-sky-50",
    iconColor: "text-sky-500",
    glow: "hover:shadow-sky-100",
    ring: "hover:ring-sky-200",
  },
  {
    id: "blood",
    icon: Droplets,
    label: "Blood Bank",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
    glow: "hover:shadow-rose-100",
    ring: "hover:ring-rose-200",
  },
];

export function QuickActionsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 24 }}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <h3 className="text-[13px] font-bold text-slate-800">Quick Actions</h3>
        </div>
        <button className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors">
          Customise
        </button>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-2.5"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl ring-1 ring-transparent ${action.ring} shadow-sm ${action.glow} hover:shadow-lg transition-all duration-200 bg-white border border-slate-100`}
            >
              <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center`}>
                <Icon size={20} className={action.iconColor} strokeWidth={1.8} />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ─── 3. RECENT ALERTS CARD ────────────────────────────────────────────────────
const alerts = [
  {
    id: 1,
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    title: "Heavy Traffic on MG Road",
    desc: "Severe congestion detected. Siren route affected.",
    time: "08:45 AM",
    severity: "High",
    severityBg: "bg-red-50",
    severityColor: "text-red-500",
    severityBorder: "border-red-200",
    dot: "bg-red-500",
    borderLeft: "border-l-red-400",
  },
  {
    id: 2,
    icon: Info,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "High Pollution Alert",
    desc: "AQI exceeds 180. Avoid outdoor exposure.",
    time: "07:30 AM",
    severity: "Moderate",
    severityBg: "bg-amber-50",
    severityColor: "text-amber-600",
    severityBorder: "border-amber-200",
    dot: "bg-amber-500",
    borderLeft: "border-l-amber-400",
  },
  {
    id: 3,
    icon: BedDouble,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    title: "Building2 Bed Available",
    desc: "Apollo Building2 has 3 ICU beds now available.",
    time: "06:15 AM",
    severity: "Low",
    severityBg: "bg-blue-50",
    severityColor: "text-blue-500",
    severityBorder: "border-blue-200",
    dot: "bg-blue-400",
    borderLeft: "border-l-blue-400",
  },
];

export function RecentAlertsCard() {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 24 }}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <AlertTriangle size={16} className="text-slate-700" strokeWidth={2} />
            {visible.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-[7px] text-white font-bold">{visible.length}</span>
              </span>
            )}
          </div>
          <h3 className="text-[13px] font-bold text-slate-800">Recent Alerts</h3>
        </div>
        <button className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors flex items-center gap-0.5">
          View All <ChevronRight size={11} strokeWidth={2.5} />
        </button>
      </div>

      {/* Alert list */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {visible.map((alert, i) => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, delay: i * 0.06 }}
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/60 border border-slate-100 border-l-[3px] ${alert.borderLeft} group hover:bg-white hover:shadow-sm transition-all duration-200 overflow-hidden`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl ${alert.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={16} className={alert.iconColor} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-bold text-slate-800 leading-snug truncate">
                      {alert.title}
                    </p>
                    {/* Severity badge */}
                    <span
                      className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border ${alert.severityBg} ${alert.severityColor} ${alert.severityBorder} uppercase tracking-wide`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                    {alert.desc}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <motion.div
                      className={`w-1.5 h-1.5 rounded-full ${alert.dot}`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <Clock size={9} className="text-slate-300" />
                    <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                  </div>
                </div>

                {/* Dismiss on hover */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-slate-200 hover:bg-red-100 flex items-center justify-center self-start mt-0.5"
                  onClick={() => setDismissed((d) => [...d, alert.id])}
                  title="Dismiss"
                >
                  <span className="text-[9px] text-slate-500 hover:text-red-500 font-bold leading-none">✕</span>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <ShieldCheck size={20} className="text-green-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">All clear — no active alerts</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── COMBINED PAGE PREVIEW ────────────────────────────────────────────────────
export default function DashboardSections() {
  return (
    <div className="min-h-screen bg-[#f3f5fb] p-6 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-5">

        {/* Section label */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-blue-500" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            LifeLine AI — Dashboard Sections
          </span>
        </div>

        {/* ── Stats Cards Row ── */}
        <section>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2 ml-1">
            Stats Overview
          </p>
          <StatsCardsRow />
        </section>

        {/* ── Bottom Two-Column Layout ── */}
        <section className="grid grid-cols-[1fr_320px] gap-5">
          {/* Left: Recent Alerts (full width here) */}
          <div className="space-y-5">
            <RecentAlertsCard />

            {/* Bonus: second alerts card variant with compact rows */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 24 }}
              className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-slate-800">System Notifications</h3>
                <button className="text-[11px] text-blue-500 font-semibold">Clear All</button>
              </div>
              {[
                { color: "bg-green-400", text: "Your blood reports are ready to view", time: "Just now" },
                { color: "bg-blue-400", text: "Dr. Arjun Mehta confirmed your appointment", time: "2 min ago" },
                { color: "bg-amber-400", text: "Insurance claim submitted successfully", time: "1 hr ago" },
                { color: "bg-purple-400", text: "New AI health insight available", time: "3 hrs ago" },
              ].map(({ color, text, time }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 group cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                  <p className="text-[11px] text-slate-600 flex-1 leading-snug">{text}</p>
                  <span className="text-[10px] text-slate-300 font-medium shrink-0">{time}</span>
                  <ChevronRight size={11} className="text-slate-200 group-hover:text-blue-400 transition-colors shrink-0" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Quick Actions */}
          <QuickActionsPanel />
        </section>
      </div>
    </div>
  );
}
