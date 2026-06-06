"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Pill,
  RefreshCw,
  Activity,
  Heart,
  Wind,
  Moon,
  ChevronRight,
  CheckCircle2,
  Clock,
  FlaskConical,
  Stethoscope,
  Bell,
  MessageSquare,
  Zap,
  AlertCircle,
  ArrowUpRight,
  Cpu,
  BarChart3,
  Droplets,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "daily" | "weekly" | "monthly";

// ─── Utilities ────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1.6, decimals = 0) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const trigger = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const ctrl = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) =>
        setVal(decimals ? parseFloat(v.toFixed(decimals)) : Math.round(v)),
    });
    return ctrl.stop;
  }, [target, duration, decimals]);
  return { val, trigger };
}

// ─── Pulsing dot ──────────────────────────────────────────────────────────────

function Dot({ color = "#10B981", size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative flex" style={{ width: size, height: size }}>
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

// ─── Animated SVG Ring ────────────────────────────────────────────────────────

function ScoreRing({
  score,
  maxScore = 100,
  confidence,
  risk,
}: {
  score: number;
  maxScore?: number;
  confidence: number;
  risk: string;
}) {
  const size = 200;
  const strokeW = 14;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / maxScore;
  const dashOffset = circ * (1 - pct);

  const { val: displayScore, trigger } = useCountUp(score, 1.8);
  const { val: displayConf, trigger: triggerConf } = useCountUp(confidence, 1.4);

  const riskColors: Record<string, string> = {
    Low: "#10B981",
    Medium: "#F59E0B",
    High: "#EF4444",
  };
  const riskColor = riskColors[risk] ?? "#10B981";

  // Gradient arc via conic trick using SVG defs
  const gradId = "scoreGrad";

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => { trigger(); triggerConf(); }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)`,
          }}
        />
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <defs>
            <linearGradient id={gradId} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#EFF6FF"
            strokeWidth={strokeW}
            fill="none"
          />
          {/* Secondary ring (decorative) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r - strokeW - 6}
            stroke="#DBEAFE"
            strokeWidth={3}
            strokeDasharray="4 6"
            fill="none"
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeW}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: dashOffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <motion.div
            className="text-4xl font-black text-slate-800 tabular-nums leading-none"
          >
            {displayScore}
          </motion.div>
          <div className="text-sm text-slate-400 font-semibold">/ {maxScore}</div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mt-1">
            Health Score
          </div>
        </div>
      </div>

      {/* Confidence + Risk badges */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5 bg-blue-50 rounded-xl px-3 py-1.5">
          <Cpu className="w-3 h-3 text-blue-500" />
          <span className="text-xs font-bold text-blue-700">
            {displayConf}% Confidence
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{ backgroundColor: `${riskColor}15` }}
        >
          <ShieldCheck className="w-3 h-3" style={{ color: riskColor }} />
          <span className="text-xs font-bold" style={{ color: riskColor }}>
            {risk} Risk
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AI Insight Card ──────────────────────────────────────────────────────────

function InsightCard({
  icon: Icon,
  title,
  desc,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      whileHover={{ x: 4, boxShadow: "0 6px 24px rgba(37,99,235,0.08)" }}
      className="flex items-start gap-3 bg-slate-50 hover:bg-white rounded-2xl p-3.5 border border-transparent hover:border-slate-200 cursor-pointer transition-all duration-300"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-700">{title}</div>
        <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
          {desc}
        </div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-1 ml-auto" />
    </motion.div>
  );
}

// ─── Animated Line Chart (pure SVG + Framer) ─────────────────────────────────

function LineChart({
  datasets,
  labels,
  height = 130,
}: {
  datasets: { label: string; data: number[]; color: string; active: boolean }[];
  labels: string[];
  height?: number;
}) {
  const W = 420;
  const H = height;
  const PAD = { top: 12, right: 12, bottom: 24, left: 28 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const allVals = datasets.flatMap((d) => d.data);
  const minV = Math.min(...allVals) - 5;
  const maxV = Math.max(...allVals) + 5;

  const toX = (i: number) => PAD.left + (i / (labels.length - 1)) * iW;
  const toY = (v: number) => PAD.top + iH - ((v - minV) / (maxV - minV)) * iH;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        {datasets.map((d) => (
          <linearGradient key={d.label} id={`fill-${d.label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={d.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = PAD.top + t * iH;
        return (
          <line
            key={t}
            x1={PAD.left}
            y1={y}
            x2={W - PAD.right}
            y2={y}
            stroke="#F1F5F9"
            strokeWidth={1}
          />
        );
      })}

      {/* X labels */}
      {labels.map((l, i) => (
        <text
          key={l}
          x={toX(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize={9}
          fill="#94A3B8"
          fontWeight="600"
        >
          {l}
        </text>
      ))}

      {/* Dataset paths */}
      {datasets.map((d) => {
        if (!d.active) return null;
        const pts = d.data.map((v, i) => [toX(i), toY(v)] as [number, number]);
        const linePath = pts
          .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
          .join(" ");
        const areaPath =
          `M ${pts[0][0]} ${PAD.top + iH} ` +
          pts.map(([x, y]) => `L ${x} ${y}`).join(" ") +
          ` L ${pts[pts.length - 1][0]} ${PAD.top + iH} Z`;

        return (
          <g key={d.label}>
            <path d={areaPath} fill={`url(#fill-${d.label})`} />
            <motion.path
              d={linePath}
              stroke={d.color}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            {/* Dot on last point */}
            <motion.circle
              cx={pts[pts.length - 1][0]}
              cy={pts[pts.length - 1][1]}
              r={4}
              fill={d.color}
              stroke="white"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, duration: 0.3 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Vital Metric Tab ─────────────────────────────────────────────────────────

function VitalMetricCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  statusColor,
  color,
  trend,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  color: string;
  trend: "up" | "down" | "stable";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col gap-2 p-3 rounded-2xl border text-left transition-all duration-200 w-full ${
        active
          ? "border-blue-200 bg-blue-50 shadow-sm"
          : "border-slate-100 bg-slate-50 hover:border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3 text-emerald-500" />
        ) : trend === "down" ? (
          <TrendingDown className="w-3 h-3 text-red-400" />
        ) : (
          <div className="w-3 h-0.5 bg-slate-300 rounded" />
        )}
      </div>
      <div>
        <div className="text-base font-extrabold text-slate-800 leading-tight">
          {value}{" "}
          <span className="text-[10px] font-semibold text-slate-400">
            {unit}
          </span>
        </div>
        <div className="text-[10px] text-slate-400 font-medium">{label}</div>
      </div>
      <div
        className="text-[10px] font-bold px-2 py-0.5 rounded-full self-start"
        style={{ color: statusColor, backgroundColor: `${statusColor}15` }}
      >
        {status}
      </div>
    </motion.button>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({
  icon: Icon,
  title,
  sub,
  time,
  color,
  status,
  isLast,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
  time: string;
  color: string;
  status: "done" | "pending" | "upcoming";
  isLast?: boolean;
  delay: number;
}) {
  const statusMeta = {
    done: { label: "Completed", color: "#10B981" },
    pending: { label: "Pending", color: "#F59E0B" },
    upcoming: { label: "Upcoming", color: "#3B82F6" },
  };
  const s = statusMeta[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="flex gap-3 group"
    >
      {/* Line + dot */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors duration-300"
          style={{
            backgroundColor: `${color}12`,
            borderColor: status === "done" ? `${color}40` : "#E2E8F0",
          }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </motion.div>
        {!isLast && (
          <motion.div
            className="w-0.5 flex-1 mt-1 rounded-full"
            style={{ backgroundColor: "#E2E8F0", minHeight: 20 }}
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 group-last:pb-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-800">{title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] text-slate-300 font-medium">
              {time}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: s.color, backgroundColor: `${s.color}15` }}
            >
              {s.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CHART_DATA: Record<
  TabKey,
  {
    labels: string[];
    heartRate: number[];
    bloodPressure: number[];
    oxygen: number[];
    sleep: number[];
  }
> = {
  daily: {
    labels: ["6A", "9A", "12P", "3P", "6P", "9P", "12A"],
    heartRate: [64, 72, 88, 76, 80, 70, 65],
    bloodPressure: [118, 122, 130, 128, 125, 120, 116],
    oxygen: [98, 97, 96, 98, 97, 99, 98],
    sleep: [0, 0, 0, 0, 0, 6, 8],
  },
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    heartRate: [70, 74, 72, 78, 75, 68, 72],
    bloodPressure: [120, 124, 118, 126, 122, 119, 121],
    oxygen: [97, 98, 98, 97, 99, 98, 98],
    sleep: [7.2, 6.5, 7.8, 6.9, 8.1, 7.5, 7.2],
  },
  monthly: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
    heartRate: [73, 71, 75, 72, 74, 70, 72],
    bloodPressure: [122, 119, 124, 120, 123, 118, 121],
    oxygen: [98, 97, 98, 99, 97, 98, 98],
    sleep: [7.1, 7.4, 6.8, 7.6, 7.2, 7.3, 7.5],
  },
};

const VITALS = [
  {
    key: "heartRate" as const,
    icon: Heart,
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "Normal",
    statusColor: "#10B981",
    color: "#EF4444",
    trend: "stable" as const,
  },
  {
    key: "bloodPressure" as const,
    icon: Activity,
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "Optimal",
    statusColor: "#2563EB",
    color: "#2563EB",
    trend: "down" as const,
  },
  {
    key: "oxygen" as const,
    icon: Wind,
    label: "Oxygen Level",
    value: "98",
    unit: "%",
    status: "Excellent",
    statusColor: "#10B981",
    color: "#06B6D4",
    trend: "stable" as const,
  },
  {
    key: "sleep" as const,
    icon: Moon,
    label: "Sleep Quality",
    value: "7.2",
    unit: "hrs",
    status: "Good",
    statusColor: "#8B5CF6",
    color: "#8B5CF6",
    trend: "up" as const,
  },
];

export default function AIHealthIntelligence() {
  const [activeTab, setActiveTab] = useState<TabKey>("weekly");
  const [activeVital, setActiveVital] = useState<string>("heartRate");

  const chartData = CHART_DATA[activeTab];

  const datasets = [
    {
      label: "heartRate",
      data: chartData.heartRate,
      color: "#EF4444",
      active: activeVital === "heartRate",
    },
    {
      label: "bloodPressure",
      data: chartData.bloodPressure,
      color: "#2563EB",
      active: activeVital === "bloodPressure",
    },
    {
      label: "oxygen",
      data: chartData.oxygen,
      color: "#06B6D4",
      active: activeVital === "oxygen",
    },
    {
      label: "sleep",
      data: chartData.sleep,
      color: "#8B5CF6",
      active: activeVital === "sleep",
    },
  ];

  const activeVitalData = VITALS.find((v) => v.key === activeVital)!;

  return (
    <section className="w-full bg-[#F8FAFC] py-2">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">
              AI Health Intelligence Center
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Powered by LifeLine AI · Last updated 2 min ago
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 rounded-xl px-3 py-1.5 border border-emerald-100">
            <Dot color="#10B981" size={7} />
            <span className="text-[11px] text-emerald-700 font-bold">
              AI Online
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.6fr_1fr] gap-6">
        {/* ── LEFT: AI Assistant Card ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                LifeLine AI Assistant
              </h3>
              <p className="text-[11px] text-slate-400">
                Personalized health intelligence
              </p>
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex justify-center mb-5">
            <ScoreRing
              score={92}
              maxScore={100}
              confidence={97}
              risk="Low"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 mb-4" />

          {/* AI Insights */}
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              AI Insights
            </p>
            <InsightCard
              icon={ShieldCheck}
              title="Health Risk Analysis"
              desc="No critical risks detected. Maintain current routine."
              color="#10B981"
              delay={0.1}
            />
            <InsightCard
              icon={TrendingUp}
              title="Personalized Recommendations"
              desc="Increase daily water intake to 2.5L for better kidney health."
              color="#2563EB"
              delay={0.18}
            />
            <InsightCard
              icon={RefreshCw}
              title="Recovery Insights"
              desc="Sleep consistency improved 12% over last 2 weeks."
              color="#8B5CF6"
              delay={0.26}
            />
            <InsightCard
              icon={Pill}
              title="Medication Suggestions"
              desc="Evening dose of Montelukast is due in 3 hours."
              color="#F59E0B"
              delay={0.34}
            />
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(37,99,235,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="mt-5 w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI Assistant
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>

        {/* ── CENTER: Health Trends Chart ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Health Trends
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time vitals monitoring
              </p>
            </div>
            {/* Tab switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              {(["daily", "weekly", "monthly"] as TabKey[]).map((t) => (
                <motion.button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all duration-200 ${
                    activeTab === t
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Vital metric selectors */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
            {VITALS.map((v) => (
              <VitalMetricCard
                key={v.key}
                {...v}
                active={activeVital === v.key}
                onClick={() => setActiveVital(v.key)}
              />
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-[130px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeVital}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <LineChart
                  datasets={datasets}
                  labels={chartData.labels}
                  height={130}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 flex-wrap">
            {VITALS.map((v) => (
              <button
                key={v.key}
                onClick={() => setActiveVital(v.key)}
                className={`flex items-center gap-1.5 transition-opacity ${
                  activeVital === v.key ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <span className="text-[11px] font-semibold text-slate-500">
                  {v.label}
                </span>
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5">
              <Dot color={activeVitalData.color} size={7} />
              <span className="text-[11px] font-bold" style={{ color: activeVitalData.color }}>
                {activeVitalData.value} {activeVitalData.unit}
              </span>
            </div>
          </div>

          {/* AI insight banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-3.5 border border-blue-100 flex items-start gap-3"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-700">
                AI Trend Analysis
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Your heart rate variability has improved by 8% this week.
                Cardiovascular fitness trending positively.
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Today's Activity Feed ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Today's Activity
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Thursday, Jun 4, 2026
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-bold text-blue-600">5 Events</span>
            </div>
          </div>

          {/* Summary chips */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {[
              { label: "3 Done", color: "#10B981" },
              { label: "1 Pending", color: "#F59E0B" },
              { label: "1 Upcoming", color: "#3B82F6" },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1"
                style={{ backgroundColor: `${c.color}12` }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span
                  className="text-[11px] font-bold"
                  style={{ color: c.color }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="flex flex-col flex-1">
            {[
              {
                icon: CheckCircle2,
                title: "Appointment Confirmed",
                sub: "Dr. Sarah Wilson · Cardiology",
                time: "10:30 AM",
                color: "#2563EB",
                status: "done" as const,
              },
              {
                icon: FlaskConical,
                title: "Lab Report Uploaded",
                sub: "Blood CBC · Full Panel",
                time: "09:15 AM",
                color: "#10B981",
                status: "done" as const,
              },
              {
                icon: Stethoscope,
                title: "Doctor Consultation",
                sub: "Video call · Dr. Arjun Mehta",
                time: "11:00 AM",
                color: "#8B5CF6",
                status: "done" as const,
              },
              {
                icon: Pill,
                title: "Prescription Added",
                sub: "Augmentin 625 · 5 day course",
                time: "01:30 PM",
                color: "#F59E0B",
                status: "pending" as const,
              },
              {
                icon: Bell,
                title: "Medicine Reminder",
                sub: "Montelukast 10mg · Night dose",
                time: "09:00 PM",
                color: "#EF4444",
                status: "upcoming" as const,
              },
            ].map((item, i, arr) => (
              <TimelineItem
                key={item.title}
                {...item}
                isLast={i === arr.length - 1}
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
              <span className="text-slate-500">Daily Health Goal</span>
              <span className="text-blue-600">60% Complete</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-500"
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              View Full Activity Log
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
