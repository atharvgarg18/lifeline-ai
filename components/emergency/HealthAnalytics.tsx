"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Heart,
  Activity,
  Moon,
  Zap,
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SparkPoint {
  x: number;
  y: number;
}

interface MetricConfig {
  id: string;
  icon: React.ElementType;
  label: string;
  subtitle: string;
  value: string;
  unit: string;
  trend: number;          // positive = up, negative = down, 0 = stable
  trendLabel: string;
  color: string;          // tailwind text color
  iconBg: string;
  iconColor: string;
  strokeColor: string;    // svg stroke
  fillFrom: string;       // gradient start
  fillTo: string;         // gradient end (transparent)
  accentBg: string;
  accentBorder: string;
  points: number[];       // raw y values 0-100
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const metrics: MetricConfig[] = [
  {
    id: "heartrate",
    icon: Heart,
    label: "Heart Rate",
    subtitle: "Avg (Weekly)",
    value: "72",
    unit: "bpm",
    trend: 4,
    trendLabel: "4% from last week",
    color: "text-red-500",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    strokeColor: "#ef4444",
    fillFrom: "rgba(239,68,68,0.18)",
    fillTo: "rgba(239,68,68,0)",
    accentBg: "bg-red-50",
    accentBorder: "border-red-100",
    points: [58, 65, 60, 72, 68, 74, 70, 76, 72, 78, 74, 72, 75],
  },
  {
    id: "bloodpressure",
    icon: Activity,
    label: "Blood Pressure",
    subtitle: "Avg (Weekly)",
    value: "120/80",
    unit: "mmHg",
    trend: -2,
    trendLabel: "2% from last week",
    color: "text-orange-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    strokeColor: "#f97316",
    fillFrom: "rgba(249,115,22,0.18)",
    fillTo: "rgba(249,115,22,0)",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-100",
    points: [90, 85, 88, 92, 86, 84, 88, 82, 80, 84, 80, 82, 80],
  },
  {
    id: "sleep",
    icon: Moon,
    label: "Sleep",
    subtitle: "Avg (Weekly)",
    value: "6.8",
    unit: "hrs",
    trend: 6,
    trendLabel: "6% from last week",
    color: "text-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    strokeColor: "#8b5cf6",
    fillFrom: "rgba(139,92,246,0.18)",
    fillTo: "rgba(139,92,246,0)",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-100",
    points: [55, 60, 58, 65, 62, 68, 64, 70, 66, 72, 68, 70, 68],
  },
  {
    id: "activity",
    icon: Zap,
    label: "Activity",
    subtitle: "Avg (Weekly)",
    value: "3.2",
    unit: "hrs",
    trend: 10,
    trendLabel: "10% from last week",
    color: "text-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    strokeColor: "#10b981",
    fillFrom: "rgba(16,185,129,0.18)",
    fillTo: "rgba(16,185,129,0)",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    points: [40, 50, 45, 55, 50, 60, 55, 65, 60, 70, 65, 68, 72],
  },
  {
    id: "weight",
    icon: Scale,
    label: "Weight",
    subtitle: "Current",
    value: "70.5",
    unit: "kg",
    trend: -1.1,
    trendLabel: "0.8 kg from last week",
    color: "text-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    strokeColor: "#3b82f6",
    fillFrom: "rgba(59,130,246,0.18)",
    fillTo: "rgba(59,130,246,0)",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    points: [82, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 71, 70],
  },
];

// ─── Animated sparkline SVG ───────────────────────────────────────────────────
function Sparkline({
  points,
  strokeColor,
  fillFrom,
  fillTo,
  gradientId,
  animated,
}: {
  points: number[];
  strokeColor: string;
  fillFrom: string;
  fillTo: string;
  gradientId: string;
  animated: boolean;
}) {
  const W = 110;
  const H = 44;
  const PAD = 3;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const pts: SparkPoint[] = points.map((v, i) => ({
    x: PAD + (i / (points.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((v - min) / range) * (H - PAD * 2),
  }));

  // smooth bezier path
  const linePath = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
    })
    .join(" ");

  const fillPath =
    linePath +
    ` L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillFrom} />
          <stop offset="100%" stopColor={fillTo} />
        </linearGradient>
        <clipPath id={`clip-${gradientId}`}>
          <motion.rect
            x="0"
            y="0"
            width={W}
            height={H}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: animated ? 1 : 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
            style={{ transformOrigin: "left" }}
          />
        </clipPath>
      </defs>

      {/* Fill area */}
      <path
        d={fillPath}
        fill={`url(#${gradientId})`}
        clipPath={`url(#clip-${gradientId})`}
        opacity={0.7}
      />

      {/* Line */}
      <motion.path
        d={linePath}
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: animated ? 1 : 0, opacity: animated ? 1 : 0 }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.05 }}
      />

      {/* End dot */}
      <motion.circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={3}
        fill={strokeColor}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: animated ? 1 : 0, opacity: animated ? 1 : 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 18 }}
      />
    </svg>
  );
}

// ─── Trend badge ─────────────────────────────────────────────────────────────
function TrendBadge({ trend, label }: { trend: number; label: string }) {
  const up = trend > 0;
  const stable = trend === 0;

  const Icon = stable ? Minus : up ? TrendingUp : TrendingDown;
  const color = stable
    ? "text-slate-400"
    : up
    ? "text-emerald-500"
    : "text-red-400";
  const bg = stable
    ? "bg-slate-50 border-slate-100"
    : up
    ? "bg-emerald-50 border-emerald-100"
    : "bg-red-50 border-red-100";

  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-bold ${color} ${bg}`}>
      <Icon size={9} strokeWidth={2.5} />
      <span>
        {trend > 0 ? "↑" : trend < 0 ? "↓" : ""}
        {Math.abs(trend)}% {label}
      </span>
    </div>
  );
}

// ─── Single metric card ───────────────────────────────────────────────────────
function MetricCard({ m, index }: { m: MetricConfig; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  // Animate the main numeric value
  useEffect(() => {
    if (!inView) return;
    const raw = parseFloat(m.value.replace("/", ".").split("/")[0]);
    if (isNaN(raw)) return;
    let start = raw * 0.6;
    const step = (raw - start) / 30;
    const timer = setInterval(() => {
      start += step;
      if (start >= raw) {
        setCount(raw);
        clearInterval(timer);
      } else {
        setCount(Math.round(start * 10) / 10);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [inView, m.value]);

  const Icon = m.icon;
  const displayVal =
    m.id === "bloodpressure"
      ? m.value
      : m.id === "weight" || m.id === "sleep" || m.id === "activity"
      ? count.toFixed(1)
      : String(Math.round(count));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.09,
        type: "spring",
        stiffness: 260,
        damping: 24,
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
        transition: { duration: 0.2 },
      }}
      className={`relative bg-white rounded-[24px] px-5 pt-5 pb-4 border border-slate-100/90 shadow-[0_2px_16px_rgba(0,0,0,0.055)] flex flex-col gap-0 overflow-hidden cursor-pointer group flex-1 min-w-[160px]`}
    >
      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[24px]"
        style={{ backgroundColor: m.strokeColor }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.09 + 0.2, duration: 0.7, ease: "easeOut" }}
      />

      {/* Icon + label row */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${m.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon
            size={17}
            className={m.iconColor}
            strokeWidth={1.9}
            fill={m.id === "heartrate" ? "currentColor" : "none"}
          />
        </div>
        <motion.div
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.25 }}
          className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={11} className="text-slate-400" />
        </motion.div>
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
        {m.label}
      </p>
      <p className="text-[9px] text-slate-300 mb-2">{m.subtitle}</p>

      {/* Value */}
      <div className="flex items-end gap-1 mb-0.5">
        <motion.span
          className="text-[26px] font-black text-slate-800 leading-none tracking-tight"
          key={displayVal}
        >
          {displayVal}
        </motion.span>
        <span className="text-[11px] text-slate-400 font-semibold mb-0.5">{m.unit}</span>
      </div>

      {/* Sparkline */}
      <div className="my-2 -mx-1">
        <Sparkline
          points={m.points}
          strokeColor={m.strokeColor}
          fillFrom={m.fillFrom}
          fillTo={m.fillTo}
          gradientId={`grad-${m.id}`}
          animated={inView}
        />
      </div>

      {/* Trend */}
      <TrendBadge trend={m.trend} label={m.trendLabel} />
    </motion.div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
export function HealthAnalytics() {
  return (
    <div className="bg-white rounded-[24px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.055)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
            <Activity size={14} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[14px] font-black text-slate-800 leading-tight">Health Analytics</h2>
            <p className="text-[10px] text-slate-400">Weekly overview • Updated today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Period tabs */}
          {["Day", "Week", "Month"].map((t, i) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all duration-150 ${
                i === 1
                  ? "bg-blue-500 text-white shadow-sm shadow-blue-200"
                  : "text-slate-400 bg-slate-50 hover:bg-blue-50 hover:text-blue-500 border border-slate-100"
              }`}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cards row */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {metrics.map((m, i) => (
          <MetricCard key={m.id} m={m} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {[
            { color: "bg-emerald-400", label: "Improving" },
            { color: "bg-red-400", label: "Needs attention" },
            { color: "bg-slate-300", label: "Stable" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-[10px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors"
        >
          Full Report <ChevronRight size={12} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Page preview ─────────────────────────────────────────────────────────────
export default function HealthAnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#f3f5fb] p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-blue-500" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          LifeLine AI — Health Analytics Section
        </span>
      </div>

      <div className="max-w-[1100px] mx-auto w-full">
        <HealthAnalytics />
      </div>

      {/* Individual card preview row below */}
      <div className="max-w-[1100px] mx-auto w-full">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3 ml-1">
          Individual card detail view
        </p>
        <div className="grid grid-cols-5 gap-3">
          {metrics.map((m, i) => (
            <MetricCard key={`detail-${m.id}`} m={m} index={i + 5} />
          ))}
        </div>
      </div>
    </div>
  );
}
