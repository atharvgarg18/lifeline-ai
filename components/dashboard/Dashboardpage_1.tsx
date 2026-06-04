"use client";

import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Activity,
  Pill,
  Calendar,
  MapPin,
  Truck,
  Building2,
  Phone,
  AlertTriangle,
  ChevronRight,
  Droplets,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  Zap,
  Bell,
  CheckCircle,
  Navigation,
  Wifi,
  Battery,
  Watch,
  Smartphone,
  Plus,
  Eye,
  ArrowUpRight,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Video,
  Search,
  Siren,
  Radio,
  Star,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

// ─── Utilities ────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1.8) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [target, duration]);
  return value;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

function Sparkline({
  data,
  color,
  height = 36,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const w = 80,
    h = height;
  const min = Math.min(...data),
    max = Math.max(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min + 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#sg-${color})`}
      />
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Animated Ring ────────────────────────────────────────────────────────────

function HealthRing({
  value,
  max = 100,
  color,
  size = 72,
  strokeWidth = 6,
  label,
}: {
  value: number;
  max?: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / max;
  const offset = circ * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-800">{value}</span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
    </div>
  );
}

// ─── Pulse Dot ────────────────────────────────────────────────────────────────

function PulseDot({ color = "#10B981" }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// ─── Map Simulation ───────────────────────────────────────────────────────────

function LiveMapCard() {
  const ambulanceX = useMotionValue(30);
  const ambulanceY = useMotionValue(60);
  const springX = useSpring(ambulanceX, { stiffness: 60, damping: 20 });
  const springY = useSpring(ambulanceY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const loop = setInterval(() => {
      ambulanceX.set(30 + Math.sin(Date.now() / 2000) * 10);
      ambulanceY.set(60 + Math.cos(Date.now() / 2500) * 8);
    }, 50);
    return () => clearInterval(loop);
  }, [ambulanceX, ambulanceY]);

  const roads = [
    "M 20,20 L 250,20",
    "M 20,70 L 250,70",
    "M 20,120 L 250,120",
    "M 60,10 L 60,140",
    "M 140,10 L 140,140",
    "M 210,10 L 210,140",
  ];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100">
      {/* Road grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 270 150"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width="270" height="150" fill="#EFF6FF" />
        {/* City blocks */}
        {[
          [65, 25, 70, 40],
          [145, 25, 60, 40],
          [65, 75, 70, 40],
          [145, 75, 60, 40],
          [215, 25, 30, 90],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#DBEAFE"
            rx={3}
          />
        ))}
        {/* Roads */}
        {roads.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#CBD5E1"
            strokeWidth="6"
            strokeLinecap="round"
          />
        ))}
        {/* Route line */}
        <motion.path
          d="M 40,65 Q 100,65 140,40 Q 175,20 210,25"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeDasharray="6 4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Hospital marker */}
        <g transform="translate(207,20)">
          <circle cx="0" cy="0" r="9" fill="#EF4444" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            H
          </text>
        </g>
        {/* Your location */}
        <g transform="translate(38,65)">
          <circle cx="0" cy="0" r="6" fill="#2563EB" />
          <circle cx="0" cy="0" r="10" fill="#2563EB" fillOpacity="0.2" />
          <circle cx="0" cy="0" r="3" fill="white" />
        </g>
      </svg>
      {/* Animated ambulance */}
      <motion.div
        className="absolute"
        style={{ left: springX, top: springY }}
      >
        <div className="bg-white rounded-full p-1.5 shadow-lg border-2 border-red-500">
          <Truck className="w-4 h-4 text-red-500" />
        </div>
      </motion.div>

      {/* ETA badge */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-blue-100">
        <div className="flex items-center gap-2">
          <PulseDot color="#EF4444" />
          <div>
            <div className="text-[10px] text-slate-500 font-medium">
              Active Emergency
            </div>
            <div className="text-sm font-bold text-slate-800">ETA: 6 mins</div>
          </div>
        </div>
      </div>

      {/* Green corridor badge */}
      <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-md">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-white" />
          <span className="text-[10px] font-bold text-white">
            Green Corridor Active
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Count-Up Stat ─────────────────────────────────────────────────────────

function StatBadge({
  value,
  suffix = "",
  label,
  icon: Icon,
  color,
  trend,
}: {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}) {
  const count = useCountUp(value);
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-slate-800">
            {count}
            {suffix}
          </span>
          {trend && (
            <span className="text-[11px] font-semibold text-emerald-500">
              {trend}
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 font-medium">{label}</div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [sosActive, setSosActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");

  const heartData = [68, 72, 75, 71, 78, 74, 72];
  const sleepData = [7.2, 6.8, 7.5, 8.0, 7.1, 6.9, 7.2];
  const stepsData = [5200, 6800, 7200, 5900, 8100, 6432, 7100];
  const calData = [1600, 1820, 1750, 1900, 1840, 1780, 1840];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-[system-ui] space-y-6">
      {/* ── SECTION 1: Hero + Emergency Command ───────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr_1fr] gap-6"
      >
        {/* Left: Greeting + Quick Stats */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          {/* Greeting */}
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <PulseDot color="#86EFAC" />
                <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider">
                  All Systems Normal
                </span>
              </div>
              <h1 className="text-2xl font-extrabold mt-2 leading-tight">
                Good Morning,
                <br />
                Nitin 👋
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Here is your real-time healthcare overview.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  LHID-2024-7845
                </div>
                <div className="bg-emerald-400/30 rounded-xl px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  ● Active
                </div>
              </div>
            </div>
          </div>

          {/* Quick Health Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Health Score",
                value: 87,
                suffix: "",
                icon: Shield,
                color: "#2563EB",
                data: [80, 82, 85, 83, 87, 86, 87],
                trend: "+3%",
              },
              {
                label: "Appointments",
                value: 3,
                suffix: "",
                icon: Calendar,
                color: "#10B981",
                data: [2, 1, 3, 2, 4, 3, 3],
                trend: null,
              },
              {
                label: "Medications",
                value: 2,
                suffix: "",
                icon: Pill,
                color: "#F59E0B",
                data: [2, 2, 3, 2, 2, 2, 2],
                trend: null,
              },
              {
                label: "Heart Rate",
                value: 72,
                suffix: " bpm",
                icon: Heart,
                color: "#EF4444",
                data: heartData,
                trend: "Normal",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                custom={i + 2}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}15` }}
                  >
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  {s.trend && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: s.color,
                        backgroundColor: `${s.color}15`,
                      }}
                    >
                      {s.trend}
                    </span>
                  )}
                </div>
                <div
                  className="text-2xl font-extrabold"
                  style={{ color: s.color }}
                >
                  {s.value}
                  {s.suffix}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {s.label}
                </div>
                <div className="mt-2">
                  <Sparkline data={s.data} color={s.color} height={28} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nearest Resources */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700">
              Nearest Resources
            </h3>
            {[
              {
                icon: Truck,
                label: "Nearest Ambulance",
                value: "3.2 km",
                sub: "ETA: 6 mins",
                color: "#EF4444",
              },
              {
                icon: Building2,
                label: "Apollo Hospital",
                value: "2.8 km",
                sub: "Open 24/7",
                color: "#2563EB",
              },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${r.color}12` }}
                >
                  <r.icon className="w-4 h-4" style={{ color: r.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500">{r.label}</div>
                  <div className="text-sm font-bold text-slate-800">
                    {r.value}
                  </div>
                </div>
                <div
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: r.color, backgroundColor: `${r.color}12` }}
                >
                  {r.sub}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Center: Emergency Command Center */}
        <motion.div variants={fadeUp} custom={1} className="flex flex-col gap-4">
          {/* SOS Hero */}
          <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-white/10"
                  style={{
                    width: 150 + i * 80,
                    height: 150 + i * 80,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Siren className="w-5 h-5 text-red-300" />
                    </motion.div>
                    <h2 className="text-lg font-extrabold text-white">
                      Emergency SOS
                    </h2>
                  </div>
                  <p className="text-blue-200 text-xs mt-0.5">
                    One tap for help. We are always ready.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-red-500/20 rounded-full px-3 py-1">
                  <PulseDot color="#FCA5A5" />
                  <span className="text-xs text-red-200 font-bold">Live</span>
                </div>
              </div>
              <motion.button
                onClick={() => setSosActive(!sosActive)}
                whileTap={{ scale: 0.95 }}
                animate={sosActive ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.8, repeat: sosActive ? Infinity : 0 }}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                  sosActive
                    ? "bg-red-500 text-white"
                    : "bg-white text-[#2563EB] hover:bg-blue-50"
                }`}
              >
                <Phone className="w-5 h-5" />
                {sosActive ? "SOS Activated — Help is Coming!" : "Tap to SOS"}
              </motion.button>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex -space-x-2">
                  {["#3B82F6", "#10B981", "#F59E0B"].map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-blue-700"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-blue-200">
                  24/7 Active Response Team
                </span>
              </div>
            </div>
          </div>

          {/* Live Map */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Live Emergency Command
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time tracking & routing
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot color="#EF4444" />
                <span className="text-xs font-semibold text-red-500">
                  Active Emergency
                </span>
              </div>
            </div>

            <div className="h-44 rounded-2xl overflow-hidden mb-4">
              <LiveMapCard />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-2xl p-3">
                <div className="text-[11px] text-slate-500 font-medium">
                  Patient
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  Rohan Verma, 24 M
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-bold text-blue-600">
                    ETA: 6 mins
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3">
                <div className="text-[11px] text-slate-500 font-medium">
                  Route Status
                </div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  Green Corridor
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <Navigation className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">
                    Signals Optimized
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
              {[
                { color: "#94A3B8", label: "Low" },
                { color: "#F59E0B", label: "Moderate" },
                { color: "#EF4444", label: "High" },
                { color: "#991B1B", label: "Severe" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1">
                  <div
                    className="w-2.5 h-1.5 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-[10px] text-slate-400">{t.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: AI Assistant + Patient Summary */}
        <motion.div variants={fadeUp} custom={2} className="flex flex-col gap-4">
          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 relative overflow-hidden shadow-xl">
            <motion.div
              className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-blue-600/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">AI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <PulseDot color="#86EFAC" />
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      Online
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/40 flex items-center justify-center border border-blue-400/30">
                  <Zap className="w-6 h-6 text-blue-300" />
                </div>
              </div>
              <p className="text-slate-300 text-xs mb-3">
                Hello! I'm your AI health assistant. How can I help you today?
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat Now
              </motion.button>
            </div>
          </div>

          {/* Patient Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                Patient Summary
              </h3>
              <button className="text-[11px] text-blue-500 font-semibold hover:underline">
                View Full Profile
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: Droplets, label: "Blood Group", value: "O+", color: "#EF4444" },
                { icon: AlertTriangle, label: "Allergies", value: "Penicillin", color: "#F59E0B" },
                { icon: Activity, label: "Chronic Conditions", value: "Asthma", color: "#8B5CF6" },
                { icon: Pill, label: "Current Medications", value: "2 Active", color: "#10B981" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon
                        className="w-3.5 h-3.5"
                        style={{ color: item.color }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                Recent Alerts
              </h3>
              <button className="text-[11px] text-blue-500 font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {[
                { icon: AlertTriangle, label: "Accident Reported", sub: "Ring Road, Sector 12", time: "2 min ago", color: "#EF4444" },
                { icon: Activity, label: "High Traffic", sub: "MG Road", time: "5 min ago", color: "#F59E0B" },
                { icon: Building2, label: "Hospital Full", sub: "City Care Hospital", time: "10 min ago", color: "#8B5CF6" },
                { icon: Truck, label: "Ambulance Dispatched", sub: "Apollo Hospital", time: "12 min ago", color: "#10B981" },
              ].map((a) => (
                <motion.div
                  key={a.label}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${a.color}15` }}
                  >
                    <a.icon
                      className="w-3.5 h-3.5"
                      style={{ color: a.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate">
                      {a.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {a.sub}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-300 whitespace-nowrap">
                    {a.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── SECTION 2: Health Overview ─────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6"
      >
        {/* Health Charts */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Health Overview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Weekly vitals summary
              </p>
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1">
              {(["week", "month"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === t
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  This {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Heart Rate", value: "72 bpm", sub: "Avg", data: heartData, color: "#EF4444", icon: Heart },
              { label: "Sleep", value: "7.2 hrs", sub: "Avg", data: sleepData, color: "#8B5CF6", icon: Clock },
              { label: "Steps", value: "6,432", sub: "Avg", data: stepsData, color: "#10B981", icon: Activity },
              { label: "Calories", value: "1,840 kcal", sub: "Avg", data: calData, color: "#F59E0B", icon: Zap },
            ].map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={{ y: -4 }}
                className="bg-slate-50 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <metric.icon
                      className="w-3.5 h-3.5"
                      style={{ color: metric.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {metric.label}
                  </span>
                </div>
                <div
                  className="text-lg font-extrabold"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </div>
                <div className="text-[10px] text-slate-400 mb-2">
                  {metric.sub}
                </div>
                <Sparkline data={metric.data} color={metric.color} height={40} />
                <div className="flex justify-between mt-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <span key={d} className="text-[9px] text-slate-300">
                      {d}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Health Rings */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-around">
            <HealthRing value={87} color="#2563EB" label="Health Score" size={68} />
            <HealthRing value={72} max={100} color="#EF4444" label="Heart Rate" size={68} />
            <HealthRing value={7} max={10} color="#8B5CF6" label="Sleep Quality" size={68} />
            <HealthRing value={64} color="#10B981" label="Activity Goal" size={68} />
            <HealthRing value={90} color="#F59E0B" label="Medication" size={68} />
          </div>
        </motion.div>

        {/* Today's Activity Feed */}
        <motion.div variants={fadeUp} custom={1} className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Today's Activity
              </h3>
              <button className="text-[11px] text-blue-500 font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {[
                { icon: Calendar, label: "Appointment Confirmed", sub: "with Dr. Sarah Wilson", time: "10:30 AM", color: "#2563EB", done: true },
                { icon: Pill, label: "Medicine Taken", sub: "Paracetamol 650mg", time: "09:00 AM", color: "#10B981", done: true },
                { icon: ClipboardList, label: "Health Report Added", sub: "Blood Test Report", time: "Yesterday", color: "#8B5CF6", done: false },
                { icon: Activity, label: "Steps Goal Achieved", sub: "Great job! Keep it up 💪", time: "Yesterday", color: "#F59E0B", done: true },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon
                      className="w-4 h-4"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-700">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.sub}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-300">
                      {item.time}
                    </span>
                    {item.done && (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Blood Bank */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Blood Bank</h3>
                <p className="text-xs text-slate-400">O+ Donors Needed</p>
              </div>
              <Droplets className="w-8 h-8 text-red-400" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-500">Emergency Requirement</span>
                <span className="text-red-500">12 / 25</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "48%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Donate Now
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* ── SECTION 3: Stats Row ───────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { label: "Total Emergencies", value: 1248, suffix: "", trend: "↑ 18.6%", icon: Siren, color: "#EF4444" },
          { label: "Response Time", value: 8, suffix: " min", trend: "↑ 6.2%", icon: Clock, color: "#F59E0B" },
          { label: "Ambulances Active", value: 32, suffix: "", trend: "↑ 12%", icon: Truck, color: "#2563EB" },
          { label: "Hospitals Online", value: 98, suffix: "", trend: "↑ 8.4%", icon: Building2, color: "#10B981" },
          { label: "Lives Saved", value: 12540, suffix: "", trend: "↑ 22.7%", icon: Heart, color: "#8B5CF6" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={fadeUp}
            whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.09)" }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 transition-all duration-300 cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${s.color}12` }}
            >
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <StatBadge
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              icon={s.icon}
              color={s.color}
              trend={s.trend}
            />
          </motion.div>
        ))}
      </motion.section>

      {/* ── SECTION 4: Doctor + Medications + Contacts ────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Doctor & Nurse */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Doctor & Nurse Assignment
            </h3>
            <button className="text-[11px] text-blue-500 font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4 bg-emerald-50 rounded-xl px-3 py-2">
            <PulseDot color="#10B981" />
            <span className="text-xs text-emerald-700 font-medium">
              Team notified and preparing for arrival
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Dr. Arjun Mehta", role: "Cardiologist", rating: 4.8, label: "Assigned Doctor", color: "#2563EB" },
              { name: "Nurse Priya Singh", role: "ER Nurse", rating: 4.7, label: "Assigned Nurse", color: "#10B981" },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-slate-50 rounded-2xl p-3 text-center"
              >
                <div className="text-[10px] text-slate-400 mb-2">{p.label}</div>
                <div
                  className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center text-xl font-extrabold"
                  style={{
                    backgroundColor: `${p.color}18`,
                    color: p.color,
                  }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400">{p.role}</div>
                <div className="flex items-center justify-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {p.rating}
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    <PulseDot color="#10B981" />
                    <span className="text-[10px] text-emerald-600">Online</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medicine Reminder */}
        <motion.div
          variants={fadeUp}
          custom={1}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Medicine Reminder
            </h3>
            <button className="text-[11px] text-blue-500 font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4 bg-amber-50 rounded-xl px-3 py-2">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs text-amber-700 font-semibold">
              2 Pending Reminders
            </span>
          </div>
          <div className="space-y-3">
            {[
              { name: "Augmentin 625", sub: "1 Tablet after food", time: "09:00 AM", taken: false },
              { name: "Montelukast 10mg", sub: "1 Tablet at night", time: "09:00 PM", taken: false },
            ].map((med) => (
              <div
                key={med.name}
                className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-100"
              >
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">
                    {med.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{med.sub}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-amber-600">
                    {med.time}
                  </div>
                  <Bell className="w-3.5 h-3.5 text-amber-400 ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full mt-3 border border-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            View All Medicines
          </motion.button>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          variants={fadeUp}
          custom={2}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Emergency Contacts
            </h3>
            <button className="text-[11px] text-blue-500 font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: "Rahul Verma", role: "Brother", color: "#2563EB" },
              { name: "Neha Verma", role: "Sister", color: "#EC4899" },
              { name: "Dr. Arjun Mehta", role: "Cardiologist", color: "#10B981" },
            ].map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0"
                  style={{ backgroundColor: `${c.color}15`, color: c.color }}
                >
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{c.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Emergency Call
            </div>
            <motion.a
              href="tel:108"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-red-50 rounded-2xl px-4 py-3 border border-red-100"
            >
              <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-red-600">108</div>
                <div className="text-[10px] text-red-400">
                  Tap to call emergency
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </motion.section>

      {/* ── SECTION 5: Connected Devices + Quick Actions ──────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-6"
      >
        {/* Connected Devices */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-800">
              Connected Devices
            </h3>
            <button className="text-[11px] text-blue-500 font-semibold hover:underline">
              Manage All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Smart Watch", icon: Watch, status: "Connected", sub: "Battery 80%", color: "#1E293B" },
              { name: "Google Fit", icon: Activity, status: "Connected", sub: "Last sync: 10 min ago", color: "#10B981" },
              { name: "Apple Health", icon: Heart, status: "Connected", sub: "Last sync: 25 min ago", color: "#EF4444" },
              { name: "Fitbit", icon: Zap, status: "Connected", sub: "Last sync: 30 min ago", color: "#2563EB" },
            ].map((d) => (
              <motion.div
                key={d.name}
                whileHover={{ y: -4 }}
                className="bg-slate-50 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <div
                  className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${d.color}15` }}
                >
                  <d.icon className="w-6 h-6" style={{ color: d.color }} />
                </div>
                <div className="text-xs font-bold text-slate-800">{d.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <PulseDot color="#10B981" />
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {d.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{d.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeUp}
          custom={1}
          className="bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] rounded-3xl p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-blue-600/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10">
            <h3 className="text-base font-bold text-white mb-1">
              Quick Actions
            </h3>
            <p className="text-blue-300 text-xs mb-5">
              Fast access to key features
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Video Call Doctor", icon: Video, color: "#3B82F6" },
                { label: "Find Truck", icon: Truck, color: "#EF4444" },
                { label: "Book Appointment", icon: Calendar, color: "#10B981" },
                { label: "Order Medicine", icon: Pill, color: "#F59E0B" },
                { label: "Lab Tests", icon: FlaskConical, color: "#8B5CF6" },
                { label: "Health Packages", icon: Shield, color: "#06B6D4" },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 rounded-2xl p-3 transition-all duration-200 backdrop-blur-sm border border-white/10"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}30` }}
                  >
                    <action.icon
                      className="w-4.5 h-4.5"
                      style={{ color: action.color }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
