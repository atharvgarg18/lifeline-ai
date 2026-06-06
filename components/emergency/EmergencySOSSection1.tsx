"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, animate } from "framer-motion";
import {
  Siren,
  MapPin,
  Clock,
  Users,
  Activity,
  CheckCircle2,
  Radio,
  Zap,
  TrendingUp,
  AlertTriangle,
  Navigation,
  Heart,
  Phone,
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [to, duration]);
  return (
    <span>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Timeline Step ────────────────────────────────────────────────────────────
const steps = [
  { icon: Phone, label: "SOS Triggered", time: "0s", color: "text-red-500", done: true },
  { icon: Radio, label: "Dispatch Notified", time: "4s", color: "text-orange-500", done: true },
  { icon: Navigation, label: "Ambulance Routed", time: "12s", color: "text-blue-500", done: true },
  { icon: Zap, label: "Green Corridor Set", time: "18s", color: "text-emerald-500", done: false },
  { icon: Heart, label: "Hospital Alerted", time: "22s", color: "text-purple-500", done: false },
];

// ─── City Map SVG ─────────────────────────────────────────────────────────────
function CityMap() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [draw, setDraw] = useState(0);
  const [ambulancePos, setAmbulancePos] = useState({ x: 80, y: 280 });
  const [tick, setTick] = useState(0);

  const routePoints = "M 80,280 C 80,240 120,220 160,200 L 220,180 C 260,160 280,140 300,120 L 340,100 C 370,85 400,80 430,78";

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 0.008, 1);
        setDraw(progress);
        if (pathRef.current) {
          const pt = pathRef.current.getPointAtLength(progress * len);
          setAmbulancePos({ x: pt.x, y: pt.y });
        }
        if (progress >= 1) {
          progress = 0;
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [pathLength]);

  // Traffic light blink
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 800);
    return () => clearInterval(t);
  }, []);

  const hospitals = [
    { x: 430, y: 78, name: "Apollo Hospital", eta: "4 min" },
    { x: 360, y: 165, name: "City Medical", eta: "8 min" },
  ];

  const trafficLights = [
    { x: 160, y: 200 },
    { x: 300, y: 120 },
  ];

  return (
    <svg
      viewBox="0 0 540 360"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Map background grid */}
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
        </pattern>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="540" height="360" fill="#F8FAFC" rx="16" />
      <rect width="540" height="360" fill="url(#grid)" rx="16" />

      {/* City blocks */}
      {[
        [20, 20, 80, 60], [120, 20, 70, 50], [210, 20, 90, 45],
        [20, 100, 60, 70], [20, 190, 55, 80], [20, 290, 80, 55],
        [110, 290, 70, 55], [200, 290, 80, 55], [300, 290, 60, 55],
        [380, 290, 80, 55], [460, 290, 60, 55], [460, 200, 60, 70],
        [460, 110, 60, 70], [460, 20, 60, 70], [360, 20, 80, 50],
        [130, 120, 50, 60], [240, 200, 50, 70], [340, 200, 80, 60],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x} y={y} width={w} height={h}
          rx="4"
          fill="#E8EEF8"
          stroke="#D1D9E6"
          strokeWidth="0.5"
        />
      ))}

      {/* Main roads */}
      <line x1="0" y1="180" x2="540" y2="180" stroke="#CBD5E1" strokeWidth="8" />
      <line x1="0" y1="270" x2="540" y2="270" stroke="#CBD5E1" strokeWidth="8" />
      <line x1="100" y1="0" x2="100" y2="360" stroke="#CBD5E1" strokeWidth="8" />
      <line x1="220" y1="0" x2="220" y2="360" stroke="#CBD5E1" strokeWidth="8" />
      <line x1="380" y1="0" x2="380" y2="360" stroke="#CBD5E1" strokeWidth="8" />

      {/* Road center dashes */}
      {[100, 220, 380].map((x) =>
        Array.from({ length: 8 }).map((_, i) => (
          <line key={`v-${x}-${i}`} x1={x} y1={i * 50 + 5} x2={x} y2={i * 50 + 25}
            stroke="white" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
        ))
      )}
      {[180, 270].map((y) =>
        Array.from({ length: 12 }).map((_, i) => (
          <line key={`h-${y}-${i}`} x1={i * 48 + 5} y1={y} x2={i * 48 + 30} y2={y}
            stroke="white" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
        ))
      )}

      {/* Green corridor highlight */}
      <path
        d={routePoints}
        fill="none"
        stroke="#10B981"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.12"
      />
      <path
        d={routePoints}
        fill="none"
        stroke="#10B981"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Animated route line */}
      <path
        ref={pathRef}
        d={routePoints}
        fill="none"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - draw)}
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />

      {/* Route dots */}
      {draw > 0.3 && (
        <motion.circle
          cx={ambulancePos.x - 20}
          cy={ambulancePos.y - 10}
          r="2"
          fill="#60A5FA"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}

      {/* Traffic lights turning green */}
      {trafficLights.map((tl, i) => (
        <g key={i}>
          <rect x={tl.x - 8} y={tl.y - 14} width="16" height="24" rx="3"
            fill="#1E293B" />
          <circle cx={tl.x} cy={tl.y - 7} r="4"
            fill={tick % 2 === 0 ? "#10B981" : "#059669"}
          />
          <circle cx={tl.x} cy={tl.y + 3} r="3.5" fill="#374151" />
          <text x={tl.x} y={tl.y + 20} textAnchor="middle"
            fontSize="7" fill="#10B981" fontWeight="600">GREEN</text>
        </g>
      ))}

      {/* Origin pin */}
      <g>
        <circle cx="80" cy="280" r="10" fill="#EF4444" opacity="0.2" />
        <circle cx="80" cy="280" r="7" fill="#EF4444" />
        <circle cx="80" cy="280" r="3" fill="white" />
        <text x="80" y="300" textAnchor="middle" fontSize="8"
          fill="#EF4444" fontWeight="700">SOS</text>
      </g>

      {/* Ambulance marker */}
      <g transform={`translate(${ambulancePos.x - 14}, ${ambulancePos.y - 14})`}>
        <rect width="28" height="20" rx="4" fill="#2563EB" />
        <rect x="4" y="4" width="20" height="12" rx="2" fill="white" opacity="0.9" />
        <text x="14" y="14" textAnchor="middle" fontSize="8"
          fill="#2563EB" fontWeight="800">🚑</text>
        {/* Siren flash */}
        <motion.circle
          cx="14" cy="-4" r="3"
          fill="#EF4444"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
      </g>

      {/* Hospital markers */}
      {hospitals.map((h, i) => (
        <g key={i}>
          <motion.circle
            cx={h.x} cy={h.y} r="14"
            fill="#DBEAFE"
            stroke="#2563EB"
            strokeWidth="1.5"
            animate={{ r: [14, 17, 14] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
          />
          <text x={h.x} y={h.y + 4} textAnchor="middle"
            fontSize="11" fill="#1D4ED8" fontWeight="700">H</text>
          {/* ETA badge */}
          <rect x={h.x - 16} y={h.y + 18} width="32" height="13" rx="6"
            fill="#2563EB" />
          <text x={h.x} y={h.y + 28} textAnchor="middle"
            fontSize="7.5" fill="white" fontWeight="600">{h.eta}</text>
        </g>
      ))}

      {/* Legend */}
      <rect x="12" y="330" width="120" height="22" rx="6" fill="white"
        stroke="#E2E8F0" strokeWidth="0.5" />
      <circle cx="26" cy="341" r="4" fill="#10B981" />
      <text x="34" y="345" fontSize="8" fill="#475569">Green Corridor Active</text>

      {/* Live badge */}
      <rect x="390" y="330" width="50" height="20" rx="10"
        fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="0.5" />
      <motion.circle
        cx="401" cy="340" r="3"
        fill="#EF4444"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <text x="410" y="344" fontSize="8.5" fill="#DC2626" fontWeight="700">LIVE</text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmergencySOSHero() {
  const [sosActive, setSosActive] = useState(false);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeStep, setActiveStep] = useState(2);

  // Auto-advance timeline
  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => (s >= steps.length - 1 ? 0 : s + 1));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const handleHoldStart = () => {
    setHeld(true);
    holdTimer.current = setTimeout(() => {
      setSosActive(true);
      setHeld(false);
    }, 1500);
  };

  const handleHoldEnd = () => {
    setHeld(false);
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  const stats = [
    { icon: Clock, label: "Avg Response", value: 4, suffix: " min", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { icon: Users, label: "Saved Today", value: 247, suffix: "", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { icon: Activity, label: "Active Units", value: 38, suffix: "", color: "bg-violet-50 text-violet-700 border-violet-100" },
    { icon: TrendingUp, label: "Success Rate", value: 98, suffix: "%", color: "bg-amber-50 text-amber-700 border-amber-100" },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #94A3B8 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-600" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-red-50 border border-red-100"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-xs font-semibold text-red-700 uppercase tracking-widest">
                Emergency Response System
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
            >
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                Emergency
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-600">
                  SOS
                </span>{" "}
                <span className="text-slate-800">Response</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-md">
                One touch activates AI-coordinated emergency dispatch, green corridor routing, and hospital pre-alerting — in under 5 seconds.
              </p>
            </motion.div>

            {/* ── SOS Button ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 160 }}
              className="flex items-center gap-8"
            >
              {/* Ripple wrapper */}
              <div className="relative flex items-center justify-center">
                {/* Outer ripples */}
                {[1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-full border border-red-400"
                    animate={
                      sosActive
                        ? { scale: [1, 2.2], opacity: [0.6, 0], borderColor: ["#EF4444", "#F87171"] }
                        : { scale: [1, 1.6 + i * 0.2], opacity: [0.35, 0] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: sosActive ? 0.9 : 1.8,
                      delay: i * 0.35,
                      ease: "easeOut",
                    }}
                    style={{ width: 128, height: 128 }}
                  />
                ))}

                {/* Button */}
                <motion.button
                  onPointerDown={handleHoldStart}
                  onPointerUp={handleHoldEnd}
                  onPointerLeave={handleHoldEnd}
                  animate={
                    sosActive
                      ? { scale: [1, 0.94, 1.02, 1], backgroundColor: ["#DC2626", "#EF4444", "#DC2626"] }
                      : held
                      ? { scale: 0.93 }
                      : { scale: [1, 1.025, 1] }
                  }
                  transition={
                    sosActive
                      ? { duration: 0.4 }
                      : held
                      ? { duration: 0.15 }
                      : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
                  }
                  className={`relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer select-none border-4 transition-colors
                    ${sosActive
                      ? "bg-red-600 border-red-300"
                      : "bg-red-500 border-red-300 hover:bg-red-600"
                    }`}
                  aria-label="Activate Emergency SOS"
                >
                  <Siren
                    size={28}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                  <span className="text-white font-black text-xl tracking-widest mt-0.5">
                    SOS
                  </span>
                  {held && !sosActive && (
                    <span className="text-white/70 text-[9px] font-semibold tracking-wide mt-0.5">
                      HOLD...
                    </span>
                  )}
                </motion.button>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-700">
                  {sosActive ? "✅ SOS Activated!" : "Hold to activate"}
                </p>
                <p className="text-xs text-slate-400 max-w-[160px] leading-relaxed">
                  {sosActive
                    ? "Dispatching nearest unit — ETA 4 min"
                    : "Press and hold for 1.5s to trigger emergency response"}
                </p>
                {sosActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                  >
                    <CheckCircle2 size={11} />
                    Ambulance Dispatched
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* ── Emergency Timeline ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Response Timeline
              </p>
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-100" />

                <div className="space-y-3">
                  {steps.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === activeStep;
                    const isPast = i < activeStep;
                    return (
                      <motion.div
                        key={i}
                        animate={isActive ? { x: [0, 4, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`relative flex items-center gap-3 transition-all duration-300 ${
                          isActive ? "opacity-100" : isPast ? "opacity-50" : "opacity-30"
                        }`}
                      >
                        <div
                          className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive
                              ? "bg-blue-50 border-blue-400 scale-110"
                              : isPast
                              ? "bg-slate-50 border-slate-200"
                              : "bg-white border-slate-100"
                          }`}
                        >
                          <Icon
                            size={14}
                            className={isActive ? step.color : "text-slate-400"}
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-semibold transition-colors ${
                                isActive ? "text-slate-900" : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-blue-100 text-blue-700"
                                : isPast
                                ? "bg-slate-100 text-slate-400"
                                : "text-slate-300"
                            }`}
                          >
                            T+{step.time}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── Stats Row ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-1.5 p-3 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 border-slate-200`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color} border`}>
                      <Icon size={13} />
                    </div>
                    <p className="text-xl font-black text-slate-900 leading-none">
                      <Counter to={s.value} suffix={s.suffix} duration={1.6 + i * 0.15} />
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Map ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Map card */}
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Map header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                  />
                  <span className="text-sm font-bold text-slate-800">Live Emergency Map</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">Raipur, MP</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    🟢 Corridor Active
                  </span>
                </div>
              </div>

              {/* SVG Map */}
              <div className="aspect-[3/2] w-full">
                <CityMap />
              </div>

              {/* Info strip */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
                {[
                  { label: "Nearest Unit", value: "AMB-14", sub: "2.1 km away" },
                  { label: "ETA", value: "4 min", sub: "Green corridor" },
                  { label: "Hospital", value: "Apollo", sub: "Pre-alerted" },
                ].map((item, i) => (
                  <div key={i} className="px-4 py-3 text-center">
                    <p className="text-base font-black text-slate-900">{item.value}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card 1 — top left */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -5, 0] }}
              transition={{
                opacity: { delay: 0.6, duration: 0.4 },
                y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
              }}
              className="absolute -top-4 -left-6 bg-white rounded-2xl border border-slate-200 shadow-lg px-4 py-3 flex items-center gap-3 min-w-[180px]"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">SOS Received</p>
                <p className="text-[10px] text-slate-400">Sector 12, Civil Lines</p>
                <p className="text-[10px] font-semibold text-red-500 mt-0.5">2 sec ago</p>
              </div>
            </motion.div>

            {/* Floating card 2 — bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, 5, 0] }}
              transition={{
                opacity: { delay: 0.75, duration: 0.4 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 },
              }}
              className="absolute -bottom-4 -right-6 bg-white rounded-2xl border border-slate-200 shadow-lg px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Apollo Hospital</p>
                <p className="text-[10px] text-slate-400">ER Pre-alerted · 3 beds ready</p>
                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Ready to receive</p>
              </div>
            </motion.div>

            {/* Floating card 3 — mid left */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [-4, 2, -4] }}
              transition={{
                opacity: { delay: 0.9, duration: 0.4 },
                x: { repeat: Infinity, duration: 5, ease: "easeInOut" },
              }}
              className="absolute top-1/2 -translate-y-1/2 -left-8 bg-white rounded-2xl border border-blue-100 shadow-lg px-3 py-2.5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Navigation size={12} className="text-blue-600" />
                <p className="text-[10px] font-bold text-slate-700">AMB-14 Route</p>
              </div>
              <div className="flex gap-1">
                {["Main Rd", "MG Rd", "Apollo"].map((r, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
