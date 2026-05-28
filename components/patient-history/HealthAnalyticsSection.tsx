"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Footprints,
  Moon,
  Zap,
  Weight,
} from "lucide-react";

// ── Inline SVG sparkline ──────────────────────────────────────────────
interface SparklineProps {
  points: number[];
  color: string;
  glowColor: string;
}

function Sparkline({ points, color, glowColor }: SparklineProps) {
  const w = 120;
  const h = 36;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = coords.join(" ");
  const area = `0,${h} ${polyline} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`fill-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon points={area} fill={`url(#fill-${color})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={glowColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${color})`}
      />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────
interface AnalyticsCard {
  id: string;
  label: string;
  sublabel: string;
  value: string;
  unit: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  iconColor: string;
  iconGlow: string;
  graphPoints: number[];
  graphColor: string;
  graphGlow: string;
  borderAccent: string;
}

// ── Data ──────────────────────────────────────────────────────────────
const cards: AnalyticsCard[] = [
  {
    id: "heart",
    label: "Heart Rate",
    sublabel: "Avg (Monthly)",
    value: "72",
    unit: "bpm",
    change: "↓ 3% from last month",
    positive: true,
    icon: Heart,
    iconColor: "text-rose-400",
    iconGlow: "shadow-rose-500/60",
    graphPoints: [68, 74, 70, 76, 72, 69, 73, 71, 72],
    graphColor: "green",
    graphGlow: "#22c55e",
    borderAccent: "hover:border-rose-500/40",
  },
  {
    id: "bp",
    label: "Blood Pressure",
    sublabel: "Avg (Monthly)",
    value: "120/80",
    unit: "mmHg",
    change: "↑ 2% from last month",
    positive: false,
    icon: Activity,
    iconColor: "text-red-400",
    iconGlow: "shadow-red-500/60",
    graphPoints: [118, 122, 119, 125, 120, 121, 123, 120, 120],
    graphColor: "red",
    graphGlow: "#ef4444",
    borderAccent: "hover:border-red-500/40",
  },
  {
    id: "steps",
    label: "Steps",
    sublabel: "Avg (Daily)",
    value: "6,842",
    unit: "steps",
    change: "↑ 12% from last month",
    positive: true,
    icon: Footprints,
    iconColor: "text-cyan-400",
    iconGlow: "shadow-cyan-500/60",
    graphPoints: [5800, 6200, 6500, 6100, 7000, 6900, 7200, 6842, 6842],
    graphColor: "cyan",
    graphGlow: "#22d3ee",
    borderAccent: "hover:border-cyan-500/40",
  },
  {
    id: "sleep",
    label: "Sleep",
    sublabel: "Avg (Daily)",
    value: "6.8",
    unit: "hrs",
    change: "↓ 5% from last month",
    positive: false,
    icon: Moon,
    iconColor: "text-pink-400",
    iconGlow: "shadow-pink-500/60",
    graphPoints: [7.2, 6.9, 7.0, 6.5, 6.8, 6.6, 6.7, 6.8, 6.8],
    graphColor: "rose",
    graphGlow: "#fb7185",
    borderAccent: "hover:border-pink-500/40",
  },
  {
    id: "activity",
    label: "Activity",
    sublabel: "Avg (Weekly)",
    value: "3.2",
    unit: "hrs",
    change: "↑ 8% from last month",
    positive: true,
    icon: Zap,
    iconColor: "text-emerald-400",
    iconGlow: "shadow-emerald-500/60",
    graphPoints: [2.8, 3.0, 2.9, 3.1, 3.3, 3.2, 3.4, 3.2, 3.2],
    graphColor: "emerald",
    graphGlow: "#34d399",
    borderAccent: "hover:border-emerald-500/40",
  },
  {
    id: "weight",
    label: "Weight",
    sublabel: "Current",
    value: "70.5",
    unit: "kg",
    change: "↑ 1.2 kg from last month",
    positive: false,
    icon: Weight,
    iconColor: "text-sky-400",
    iconGlow: "shadow-sky-500/60",
    graphPoints: [69.8, 70.0, 70.2, 70.1, 70.3, 70.4, 70.5, 70.5, 70.5],
    graphColor: "sky",
    graphGlow: "#38bdf8",
    borderAccent: "hover:border-sky-500/40",
  },
];

// ── Card component ────────────────────────────────────────────────────
function MetricCard({ card }: { card: AnalyticsCard }) {
  const Icon = card.icon;
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative flex flex-col gap-1
        bg-[#080f1e] rounded-2xl
        border border-cyan-500/10 ${card.borderAccent}
        p-4 overflow-hidden
        transition-colors duration-300
        group cursor-default
      `}
    >
      {/* corner accent glow */}
      <div
        className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: card.graphGlow }}
      />

      {/* top row: icon + sublabel */}
      <div className="flex items-center justify-between">
        <div
          className={`
            flex items-center justify-center w-8 h-8 rounded-xl
            bg-white/5 shadow-lg ${card.iconGlow}
            ${card.iconColor}
          `}
        >
          <Icon size={15} strokeWidth={2} />
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-wide">
          {card.sublabel}
        </span>
      </div>

      {/* label */}
      <p className="text-[11px] text-slate-400 font-medium mt-0.5 tracking-wide">
        {card.label}
      </p>

      {/* main value */}
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-2xl font-bold text-white leading-none tracking-tight">
          {card.value}
        </span>
        <span className="text-[11px] text-slate-500 font-medium">{card.unit}</span>
      </div>

      {/* sparkline */}
      <div className="mt-2 -mx-1">
        <Sparkline
          points={card.graphPoints}
          color={card.graphColor}
          glowColor={card.graphGlow}
        />
      </div>

      {/* change indicator */}
      <p
        className={`text-[10px] font-semibold mt-1 tracking-wide ${
          card.positive ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {card.change}
      </p>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────
export default function HealthAnalyticsSection() {
  return (
    <section className="w-full bg-[#080f1e] px-4 py-5 rounded-3xl border border-cyan-500/10">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-cyan-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Health Analytics
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
          >
            <MetricCard card={card} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
