"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation, animate, useMotionValue, useTransform } from "framer-motion";
import {
  Clock, Gauge, MapPin, Droplets, Users,
  Wifi, Shield, Zap, Activity, ChevronUp, ChevronDown,
  Radio, Navigation, AlertTriangle,
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({
  to, from = 0, decimals = 0, duration = 2,
}: { to: number; from?: number; decimals?: number; duration?: number }) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    const ctrl = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(parseFloat(v.toFixed(decimals))),
    });
    return ctrl.stop;
  }, [to, from, decimals, duration]);
  return <>{val.toFixed(decimals)}</>;
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; pulse: number }[] = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let frame: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.018;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.fill();
      });
      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 90) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── Rotating Ring ────────────────────────────────────────────────────────────
function Ring({
  size, duration, reverse = false, dashes, opacity = 0.25, color = "stroke-blue-400",
}: {
  size: number; duration: number; reverse?: boolean;
  dashes: string; opacity?: number; color?: string;
}) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={{ width: size, height: size }}
      className="absolute"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
        <circle
          cx={size / 2} cy={size / 2} r={size / 2 - 2}
          fill="none"
          strokeWidth="1"
          strokeDasharray={dashes}
          className={color}
        />
      </svg>
    </motion.div>
  );
}

// ─── Arc Gauge ────────────────────────────────────────────────────────────────
function ArcGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = value / max;
  const r = 28;
  const circ = Math.PI * r; // half circle
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-10 overflow-visible">
        <svg width="64" height="40" viewBox="0 0 64 40">
          <path
            d="M 8 36 A 24 24 0 0 1 56 36"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" strokeLinecap="round"
          />
          <motion.path
            d="M 8 36 A 24 24 0 0 1 56 36"
            fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${Math.PI * 24} ${Math.PI * 24}`}
            initial={{ strokeDashoffset: Math.PI * 24 }}
            animate={{ strokeDashoffset: Math.PI * 24 * (1 - pct) }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
          <text x="32" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
            {value}
          </text>
        </svg>
      </div>
      <span className="text-[10px] text-blue-200/60 font-medium tracking-wide uppercase">{label}</span>
    </div>
  );
}

// ─── Stat Row ────────────────────────────────────────────────────────────────
function StatRow({
  icon: Icon, label, value, unit, trend, color, delay,
}: {
  icon: React.ElementType; label: string; value: number; unit: string;
  trend?: "up" | "down" | "stable"; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-default"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-blue-200/50 font-medium uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-black text-white tabular-nums leading-tight">
            <Counter to={value} duration={1.6 + delay} />
          </span>
          <span className="text-[10px] text-blue-200/50 font-medium">{unit}</span>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-blue-300"}`}>
          {trend === "up" ? <ChevronUp size={14} /> : trend === "down" ? <ChevronDown size={14} /> : <Activity size={14} />}
        </div>
      )}
    </motion.div>
  );
}

// ─── Crew Badge ───────────────────────────────────────────────────────────────
function CrewBadge({ initials, role, online }: { initials: string; role: string; online: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      className="flex flex-col items-center gap-1 cursor-default"
    >
      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-700/30 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-200">
          {initials}
        </div>
        <motion.span
          animate={online ? { opacity: [1, 0.3, 1] } : { opacity: 0.3 }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${online ? "bg-emerald-400" : "bg-slate-500"}`}
        />
      </div>
      <span className="text-[9px] text-blue-200/50 font-medium">{role}</span>
    </motion.div>
  );
}

// ─── Holographic scan line ────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent pointer-events-none z-10"
      animate={{ top: ["0%", "100%"] }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
    />
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function AmbulanceExperience() {
  const [mounted, setMounted] = useState(false);
  const [signalStrength] = useState(97);
  const [heartbeats, setHeartbeats] = useState<number[]>([40, 55, 45, 70, 50, 65, 48, 72, 52, 68, 44, 60]);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => {
      setHeartbeats((prev) => {
        const next = [...prev.slice(1), 38 + Math.random() * 40];
        return next;
      });
    }, 700);
    return () => clearInterval(t);
  }, []);

  const leftStats = [
    { icon: Clock, label: "ETA", value: 4, unit: "min", trend: "down" as const, color: "bg-red-500/20 text-red-400", delay: 0.1 },
    { icon: Gauge, label: "Speed", value: 72, unit: "km/h", trend: "stable" as const, color: "bg-blue-500/20 text-blue-400", delay: 0.18 },
    { icon: MapPin, label: "Distance", value: 2, unit: "km", trend: "down" as const, color: "bg-emerald-500/20 text-emerald-400", delay: 0.26 },
    { icon: Droplets, label: "Fuel", value: 84, unit: "%", trend: "stable" as const, color: "bg-amber-500/20 text-amber-400", delay: 0.34 },
  ];

  const maxH = Math.max(...heartbeats);
  const minH = Math.min(...heartbeats);
  const chartH = 36;
  const chartW = 120;

  const sparkPoints = heartbeats.map((v, i) => {
    const x = (i / (heartbeats.length - 1)) * chartW;
    const y = chartH - ((v - minH) / (maxH - minH + 1)) * chartH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-10 overflow-hidden bg-[#060D1F]">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(37,99,235,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(59,130,246,0.06),transparent)]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(96,165,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-blue-500/40" />
          <span className="text-[10px] font-bold text-blue-400/70 uppercase tracking-[0.25em]">
            Unit AMB-14 · Live Telemetry
          </span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-blue-500/40" />
        </motion.div>

        {/* ── Master glassmorphism card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[28px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(96,165,250,0.18)",
            boxShadow: "0 0 80px rgba(37,99,235,0.15), 0 0 2px rgba(96,165,250,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Particle layer */}
          <div className="absolute inset-0">
            {mounted && <ParticleField />}
          </div>

          {/* Top status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-[11px] font-bold text-blue-100/70 tracking-widest uppercase">Emergency Active</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-blue-300/60 font-medium">
                <Radio size={10} className="text-blue-400" />
                <span>Dispatch Connected</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 font-medium">
                <Wifi size={10} />
                <span>{signalStrength}% Signal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-blue-300/60 font-medium">
                <Shield size={10} className="text-blue-400" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>

          {/* Main 3-column layout */}
          <div className="relative z-10 grid grid-cols-[200px_1fr_200px] lg:grid-cols-[240px_1fr_240px] gap-0">

            {/* ── LEFT STATS ── */}
            <div className="flex flex-col justify-between py-8 px-3 border-r border-white/[0.06]">
              <div>
                <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-[0.2em] px-3 mb-3">
                  Vehicle Telemetry
                </p>
                <div className="space-y-1">
                  {leftStats.map((s) => (
                    <StatRow key={s.label} {...s} />
                  ))}
                </div>
              </div>

              {/* Arc gauges */}
              <div className="mt-6 px-3">
                <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-[0.2em] mb-4">
                  System Status
                </p>
                <div className="flex justify-around">
                  <ArcGauge value={84} max={100} label="Fuel" color="#F59E0B" />
                  <ArcGauge value={97} max={100} label="Signal" color="#10B981" />
                </div>
              </div>

              {/* Live heartbeat sparkline */}
              <div className="mt-5 px-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-blue-400/50 uppercase tracking-widest font-bold">Patient HR</span>
                  <span className="text-xs font-black text-emerald-400">
                    <Counter to={78} duration={1} /> <span className="text-[9px] font-medium text-emerald-400/60">bpm</span>
                  </span>
                </div>
                <svg width="100%" height="36" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={sparkPoints}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* ── CENTER: 3D Viewer ── */}
            <div className="relative flex flex-col items-center justify-center py-10 px-6 min-h-[480px]">
              {/* Scan line over viewer */}
              <ScanLine />

              {/* Glow orb behind viewer */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
              />

              {/* Rotating rings */}
              <div className="absolute flex items-center justify-center w-full h-full pointer-events-none">
                <Ring size={320} duration={18} dashes="4 12" opacity={0.18} color="stroke-blue-400" />
                <Ring size={380} duration={28} reverse dashes="2 18" opacity={0.12} color="stroke-blue-300" />
                <Ring size={440} duration={40} dashes="1 24" opacity={0.07} color="stroke-cyan-400" />
                {/* Corner tick marks on outermost ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  style={{ width: 440, height: 440 }}
                  className="absolute"
                >
                  {[0, 90, 180, 270].map((deg) => (
                    <div
                      key={deg}
                      className="absolute"
                      style={{
                        top: "50%", left: "50%",
                        transform: `rotate(${deg}deg) translate(216px, 0) translateX(-50%)`,
                      }}
                    >
                      <div className="w-2 h-2 rounded-sm bg-blue-400/50 rotate-45" />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Iframe viewer card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative w-full max-w-[420px] rounded-2xl overflow-hidden z-10"
                style={{
                  background: "rgba(10,20,50,0.7)",
                  border: "1px solid rgba(96,165,250,0.25)",
                  boxShadow: "0 0 40px rgba(37,99,235,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              >
                {/* Light reflection strip */}
                <motion.div
                  className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />

                {/* Viewer header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {["bg-red-500/60", "bg-amber-400/60", "bg-emerald-400/60"].map((c, i) => (
                        <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-blue-300/50">AMB-14 · LIFELINE 3D</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-red-500"
                    />
                    <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                {/* Sketchfab iframe */}
                <div className="relative w-full aspect-video bg-[#080E1F]">
                  <iframe
                    title="Ambulance 3D Model"
                    src="https://sketchfab.com/models/7185543a32e348278d2e26f1a6d02c84/embed?autospin=1&autostart=1&ui_infos=0&ui_controls=0&ui_stop=0&preload=1&camera=0&ui_watermark=0&ui_theme=dark"
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    allowFullScreen
                  />
                  {/* Corner bracket overlays */}
                  {[
                    "top-2 left-2 border-t-2 border-l-2",
                    "top-2 right-2 border-t-2 border-r-2",
                    "bottom-2 left-2 border-b-2 border-l-2",
                    "bottom-2 right-2 border-b-2 border-r-2",
                  ].map((cls, i) => (
                    <div key={i} className={`absolute w-5 h-5 ${cls} border-blue-400/60 pointer-events-none z-10`} />
                  ))}
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <motion.div
                      animate={{ opacity: [0.15, 0.35, 0.15] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="10" fill="none" stroke="rgba(96,165,250,0.5)" strokeWidth="0.75" strokeDasharray="3 5" />
                        <line x1="16" y1="0" x2="16" y2="8" stroke="rgba(96,165,250,0.5)" strokeWidth="0.75" />
                        <line x1="16" y1="24" x2="16" y2="32" stroke="rgba(96,165,250,0.5)" strokeWidth="0.75" />
                        <line x1="0" y1="16" x2="8" y2="16" stroke="rgba(96,165,250,0.5)" strokeWidth="0.75" />
                        <line x1="24" y1="16" x2="32" y2="16" stroke="rgba(96,165,250,0.5)" strokeWidth="0.75" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Viewer footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.07]">
                  <span className="text-[9px] font-mono text-blue-300/40">
                    MODEL: KA-2024-AMB · REV 3.1
                  </span>
                  <div className="flex items-center gap-3">
                    {["ROTATE", "ZOOM", "INSPECT"].map((label) => (
                      <motion.button
                        key={label}
                        whileHover={{ color: "#93C5FD" }}
                        className="text-[8px] font-bold text-blue-300/30 uppercase tracking-wider hover:text-blue-300 transition-colors"
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Route info strip below viewer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 mt-5 flex items-center gap-4 px-5 py-2.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(96,165,250,0.14)",
                }}
              >
                <Navigation size={13} className="text-blue-400" />
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-blue-200/40 font-medium">Sector 12</span>
                  <span className="text-blue-500/40">→</span>
                  <span className="text-blue-200/40 font-medium">MG Road</span>
                  <span className="text-blue-500/40">→</span>
                  <span className="text-emerald-400 font-bold">Apollo ER</span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                  <span className="text-[9px] text-emerald-400/70 font-bold">GREEN CORRIDOR</span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: Crew + alerts ── */}
            <div className="flex flex-col justify-between py-8 px-3 border-l border-white/[0.06]">
              <div>
                <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-[0.2em] px-3 mb-4">
                  Crew Status
                </p>
                <div className="flex justify-around px-2 mb-6">
                  <CrewBadge initials="RP" role="Driver" online={true} />
                  <CrewBadge initials="PS" role="Nurse" online={true} />
                  <CrewBadge initials="MK" role="Doctor" online={false} />
                </div>

                {/* Crew detail list */}
                <div className="space-y-2 px-1">
                  {[
                    { name: "R. Patil", status: "Driving", icon: Gauge, c: "text-blue-400" },
                    { name: "P. Sharma", status: "Prepping kit", icon: Activity, c: "text-emerald-400" },
                    { name: "Dr. Kapoor", status: "On call", icon: Zap, c: "text-amber-400" },
                  ].map((crew, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      <crew.icon size={12} className={crew.c} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-blue-100/80 truncate">{crew.name}</p>
                        <p className="text-[9px] text-blue-200/40">{crew.status}</p>
                      </div>
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.3 }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Alert feed */}
              <div className="mt-4 px-1">
                <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-[0.2em] px-2 mb-3">
                  Alerts
                </p>
                <div className="space-y-2">
                  {[
                    { msg: "Green corridor confirmed", icon: Shield, c: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { msg: "ER Bay 2 reserved", icon: AlertTriangle, c: "text-amber-400", bg: "bg-amber-500/10" },
                    { msg: "Traffic cleared ahead", icon: Navigation, c: "text-blue-400", bg: "bg-blue-500/10" },
                  ].map((alert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.12 }}
                      whileHover={{ x: -2 }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${alert.bg} border border-white/[0.05] cursor-default`}
                    >
                      <alert.icon size={11} className={alert.c} />
                      <p className="text-[10px] text-blue-100/60 leading-tight">{alert.msg}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom ETA display */}
              <div className="mt-5 px-3">
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(37,99,235,0.05))",
                    border: "1px solid rgba(96,165,250,0.2)",
                  }}
                >
                  <p className="text-[9px] text-blue-300/50 uppercase tracking-widest font-bold mb-1">Arrival ETA</p>
                  <p className="text-4xl font-black text-white leading-none">
                    <Counter to={4} duration={1.2} />
                    <span className="text-lg text-blue-300/60 font-medium ml-1">min</span>
                  </p>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      animate={{ width: ["30%", "68%"] }}
                      transition={{ duration: 3, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[9px] text-blue-300/40 mt-1.5">Journey 68% complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-5">
              {[
                { label: "Engine", value: "Normal", color: "text-emerald-400" },
                { label: "Oxygen", value: "95%", color: "text-blue-400" },
                { label: "Siren", value: "Active", color: "text-red-400" },
                { label: "GPS Lock", value: "Strong", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-blue-200/30 font-medium">{item.label}:</span>
                  <span className={`text-[10px] font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-blue-300/30 font-mono">
              <span>SYS</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >_</motion.span>
              <span>ONLINE · LIFELINE-AI v4.2</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
