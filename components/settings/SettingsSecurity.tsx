"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Smartphone,
  Monitor,
  Watch,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
  Chrome,
  Globe,
  Mail,
  MessageSquare,
  Bell,
  BellRing,
  Calendar,
  Brain,
  Pill,
  QrCode,
  FileHeart,
  Download,
  ClipboardList,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  Activity,
  Fingerprint,
  Key,
  Server,
  Zap,
  Heart,
  BadgeCheck,
  Info,
  ExternalLink,
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const c = animate(count, to, { duration, ease: "easeOut" });
    const u = rounded.on("change", setDisplay);
    return () => { c.stop(); u(); };
  }, [to]);
  return <span>{display}{suffix}</span>;
}

// ─── Animated Toggle ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0 ${checked ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title, subtitle, color = "#2563EB" }: { icon: React.ElementType; title: string; subtitle: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon size={20} style={{ color }} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 leading-none">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────
function StatusChip({ label, variant }: { label: string; variant: "success" | "blue" | "purple" }) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };
  const icons = { success: CheckCircle2, blue: Shield, purple: Lock };
  const Icon = icons[variant];
  return (
    <div className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}>
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </div>
  );
}

// ─── Security Score Arc ───────────────────────────────────────────────────────
function SecurityArc({ score }: { score: number }) {
  const r = 52, cx = 68, cy = 68;
  const arc = Math.PI * 1.5;
  const circumference = r * arc;
  const filled = (score / 100) * circumference;

  const polarToCartesian = (angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });
  const start = polarToCartesian(Math.PI * 0.75);
  const fullEnd = polarToCartesian(Math.PI * 2.25);
  const largeArc = arc > Math.PI ? 1 : 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 136, height: 136 }}>
      <svg width={136} height={136}>
        {/* Track */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${fullEnd.x} ${fullEnd.y}`}
          fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round"
        />
        {/* Progress */}
        <motion.path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${fullEnd.x} ${fullEnd.y}`}
          fill="none" stroke="url(#secGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
        />
        <defs>
          <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
          <ShieldCheck size={24} color="white" strokeWidth={1.8} />
        </div>
        <p className="text-xl font-extrabold text-slate-900 mt-1.5">
          <AnimatedCounter to={score} suffix="%" />
        </p>
        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wide">High</p>
      </div>
    </div>
  );
}

// ─── Security Feature Row ─────────────────────────────────────────────────────
function SecurityFeature({
  icon: Icon, label, sub, status, active, delay,
}: { icon: React.ElementType; label: string; sub: string; status: string; active: boolean; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 3 }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-blue-100" : "bg-slate-100"}`}>
        <Icon size={16} className={active ? "text-blue-600" : "text-slate-400"} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 truncate">{sub}</p>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {status}
      </span>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
    </motion.div>
  );
}

// ─── Login Activity Row ───────────────────────────────────────────────────────
function LoginRow({ device, browser, location, time, current, delay }: {
  device: string; browser: string; location: string; time: string; current?: boolean; delay: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      className="relative flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden"
      style={{ borderColor: current ? "#BFDBFE" : "#E2E8F0", background: current ? "#EFF6FF" : "#F8FAFC" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ y: -2 }}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${current ? "bg-blue-600" : "bg-white border border-slate-200"}`}>
        <Monitor size={18} className={current ? "text-white" : "text-slate-500"} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-800">{device}</p>
          {current && <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">Current</span>}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-slate-500"><Chrome size={10} />{browser}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={10} />{location}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={10} />{time}</span>
        </div>
      </div>
      <AnimatePresence>
        {hover && !current && (
          <motion.button
            className="flex-shrink-0 flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <Trash2 size={12} />Revoke
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Device Card ──────────────────────────────────────────────────────────────
function DeviceCard({ name, icon: Icon, color, status, sync, connected, delay }: {
  name: string; icon: React.ElementType; color: string; status: string; sync: string; connected: boolean; delay: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 bg-white cursor-pointer overflow-hidden group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(37,99,235,0.12)" }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}18 0%, transparent 70%)` }}
      />
      <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: `${color}18` }}>
        <Icon size={22} style={{ color }} strokeWidth={1.8} />
        <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${connected ? "bg-green-500" : "bg-slate-300"}`} />
      </div>
      <p className="text-xs font-bold text-slate-800 text-center leading-tight">{name}</p>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${connected ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {status}
      </span>
      <AnimatePresence>
        {hover && (
          <motion.div
            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-[10px] text-slate-500 font-medium">Last sync: {sync}</p>
            <button className="w-full bg-blue-600 text-white text-[11px] font-bold py-1.5 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1.5">
              <RefreshCw size={11} />Sync Now
            </button>
            <button className="w-full bg-slate-100 text-slate-600 text-[11px] font-bold py-1.5 rounded-xl hover:bg-slate-200 flex items-center justify-center gap-1.5">
              <Trash2 size={11} />Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Notification Toggle Row ──────────────────────────────────────────────────
function NotifRow({ icon: Icon, color, label, sub, checked, onChange, delay }: {
  icon: React.ElementType; color: string; label: string; sub: string; checked: boolean; onChange: () => void; delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-pointer group"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onChange}
      whileHover={{ x: -2 }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </motion.div>
  );
}

// ─── Privacy Feature Row ──────────────────────────────────────────────────────
function PrivacyRow({ icon: Icon, color, label, sub, value, delay }: {
  icon: React.ElementType; color: string; label: string; sub: string; value?: string; delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {value && <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{value}</span>}
        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}

// ─── Floating Shield Illustration ────────────────────────────────────────────
function FloatingShield() {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
      {/* Outer pulse rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-green-300/40"
          style={{ width: 40 + i * 24, height: 40 + i * 24 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="relative z-10 w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl"
        style={{ background: "linear-gradient(135deg, #10B981 0%, #2563EB 100%)", boxShadow: "0 12px 40px rgba(16,185,129,0.4)" }}
        animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck size={30} color="white" strokeWidth={1.8} />
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } }),
};

export default function SettingsSecurity() {
  const [notifs, setNotifs] = useState({
    email: true, sms: true, emergency: true,
    appointments: true, aiHealth: false, medicine: true,
  });
  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="relative max-w-[1280px] mx-auto px-6 pb-12 space-y-6">

      {/* ── SECTION LABEL ─────────────────────────────────────────────────── */}
      <motion.div
        className="flex items-center gap-3 pt-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
          <Lock size={13} className="text-blue-500" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Security & Privacy</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </motion.div>

      {/* ── TWO-COLUMN GRID ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ════════════════════════════════════════════════════════════════
            LEFT COLUMN
        ════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* ── SECURITY CENTER CARD ───────────────────────────────────── */}
          <motion.div
            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
            variants={cardVariants} custom={0.05} initial="hidden" animate="visible"
            whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.10)" }}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            {/* Top gradient band */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #10B981, #2563EB, #8B5CF6)" }} />

            <div className="p-6">
              <SectionHeading icon={ShieldCheck} title="Security Center" subtitle="Your account protection overview" color="#2563EB" />

              {/* Score + Shield + Chips */}
              <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
                <SecurityArc score={92} />
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Active Protections</p>
                  <StatusChip label="Protected" variant="success" />
                  <StatusChip label="Encrypted" variant="blue" />
                  <StatusChip label="Verified" variant="purple" />
                </div>
                <FloatingShield />
              </div>

              {/* Security features */}
              <div className="space-y-2">
                <SecurityFeature icon={Key} label="Two-Factor Authentication" sub="SMS & Authenticator app" status="Enabled" active delay={0.1} />
                <SecurityFeature icon={Activity} label="Login Activity" sub="3 recent sessions detected" status="Review" active delay={0.15} />
                <SecurityFeature icon={MonitorIcon} label="Device Monitoring" sub="4 trusted devices linked" status="Active" active delay={0.2} />
                <SecurityFeature icon={Server} label="Health Data Encryption" sub="AES-256 end-to-end" status="On" active delay={0.25} />
                <SecurityFeature icon={Fingerprint} label="Biometric Access" sub="Fingerprint not configured" status="Off" active={false} delay={0.3} />
              </div>
            </div>
          </motion.div>

          {/* ── RECENT LOGIN ACTIVITY ──────────────────────────────────── */}
          <motion.div
            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
            variants={cardVariants} custom={0.15} initial="hidden" animate="visible"
            whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.08)" }}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Login Activity</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Monitor all access to your account</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
                  <ExternalLink size={12} />View All
                </button>
              </div>
              <div className="space-y-2">
                <LoginRow device="Windows Laptop" browser="Chrome Browser" location="Raipur, India" time="2 minutes ago" current delay={0.1} />
                <LoginRow device="iPhone 15 Pro" browser="Safari Browser" location="Raipur, India" time="1 hour ago" delay={0.18} />
                <LoginRow device="MacBook Air" browser="Firefox Browser" location="Mumbai, India" time="3 days ago" delay={0.26} />
              </div>
              <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-medium">Unrecognized location in Mumbai — <span className="font-bold underline cursor-pointer">review session</span></p>
              </div>
            </div>
          </motion.div>

          {/* ── CONNECTED DEVICES ─────────────────────────────────────── */}
          <motion.div
            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
            variants={cardVariants} custom={0.25} initial="hidden" animate="visible"
            whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.08)" }}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Connected Devices & Apps</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Hover a card to manage connection</p>
                </div>
                <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-full">4 Active</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <DeviceCard name="Smart Watch" icon={Watch} color="#2563EB" status="Connected" sync="2 min ago" connected delay={0.1} />
                <DeviceCard name="Google Fit" icon={HeartPulseIcon} color="#10B981" status="Connected" sync="5 min ago" connected delay={0.16} />
                <DeviceCard name="Apple Health" icon={Heart} color="#EF4444" status="Connected" sync="1 hr ago" connected delay={0.22} />
                <DeviceCard name="Fitbit" icon={ActivityIcon} color="#F59E0B" status="Connected" sync="3 hr ago" connected delay={0.28} />
                <DeviceCard name="Samsung" icon={Smartphone} color="#8B5CF6" status="Offline" sync="2 days ago" connected={false} delay={0.34} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT COLUMN
        ════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* ── NOTIFICATION CENTER ────────────────────────────────────── */}
          <motion.div
            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
            variants={cardVariants} custom={0.1} initial="hidden" animate="visible"
            whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.10)" }}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #F59E0B, #EF4444, #8B5CF6)" }} />
            <div className="p-6">
              <SectionHeading icon={BellRing} title="Notification Center" subtitle="Control how LifeLine AI reaches you" color="#F59E0B" />

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Active", value: Object.values(notifs).filter(Boolean).length, color: "#10B981" },
                  { label: "Paused", value: Object.values(notifs).filter((v) => !v).length, color: "#F59E0B" },
                  { label: "Channels", value: 3, color: "#2563EB" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl">
                    <span className="text-xl font-extrabold" style={{ color }}>{value}</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <NotifRow icon={Mail} color="#2563EB" label="Email Notifications" sub="Receive updates on your email" checked={notifs.email} onChange={() => toggleNotif("email")} delay={0.1} />
                <NotifRow icon={MessageSquare} color="#10B981" label="SMS Alerts" sub="Text messages to your phone" checked={notifs.sms} onChange={() => toggleNotif("sms")} delay={0.15} />
                <NotifRow icon={Bell} color="#EF4444" label="Emergency Alerts" sub="Critical health & SOS updates" checked={notifs.emergency} onChange={() => toggleNotif("emergency")} delay={0.2} />
                <NotifRow icon={Calendar} color="#8B5CF6" label="Appointment Reminders" sub="Upcoming doctor visits" checked={notifs.appointments} onChange={() => toggleNotif("appointments")} delay={0.25} />
                <NotifRow icon={Brain} color="#06B6D4" label="AI Health Alerts" sub="Personalized AI recommendations" checked={notifs.aiHealth} onChange={() => toggleNotif("aiHealth")} delay={0.3} />
                <NotifRow icon={Pill} color="#F59E0B" label="Medicine Reminders" sub="Daily medication schedule" checked={notifs.medicine} onChange={() => toggleNotif("medicine")} delay={0.35} />
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 text-xs font-bold bg-blue-600 text-white py-2.5 rounded-2xl hover:bg-blue-700 transition-colors">
                  Save Preferences
                </button>
                <button className="flex-1 text-xs font-bold bg-slate-100 text-slate-600 py-2.5 rounded-2xl hover:bg-slate-200 transition-colors">
                  Mute All (1h)
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── PRIVACY CENTER ─────────────────────────────────────────── */}
          <motion.div
            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
            variants={cardVariants} custom={0.2} initial="hidden" animate="visible"
            whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.10)" }}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #8B5CF6, #2563EB, #10B981)" }} />
            <div className="p-6">
              {/* Header with lock illustration */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Privacy Center</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Control who sees your health data</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                      <BadgeCheck size={11} className="text-green-600" />
                      <span className="text-[11px] font-bold text-green-700">HIPAA Compliant</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                      <Lock size={11} className="text-blue-600" />
                      <span className="text-[11px] font-bold text-blue-700">End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>
                {/* Animated lock */}
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #2563EB 100%)", boxShadow: "0 8px 24px rgba(139,92,246,0.35)" }}
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Lock size={28} color="white" strokeWidth={1.8} />
                </motion.div>
              </div>

              {/* Privacy data summary bar */}
              <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Data Sharing Level</span>
                  <span className="text-xs font-bold text-blue-600">Minimal</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }}
                    initial={{ width: 0 }}
                    animate={{ width: "28%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-slate-400">Minimal</span>
                  <span className="text-[10px] text-slate-400">Full Sharing</span>
                </div>
              </div>

              {/* Privacy features */}
              <div className="space-y-2">
                <PrivacyRow icon={QrCode} color="#8B5CF6" label="QR Code Visibility" sub="Control who can scan your QR" value="Public" delay={0.1} />
                <PrivacyRow icon={FileHeart} color="#EF4444" label="Medical Record Sharing" sub="Manage record access permissions" value="Restricted" delay={0.15} />
                <PrivacyRow icon={Download} color="#10B981" label="Download Health Data" sub="Export a full copy of your data" delay={0.2} />
                <PrivacyRow icon={ClipboardList} color="#F59E0B" label="Consent Management" sub="Review & update data consents" value="3 active" delay={0.25} />
                <PrivacyRow icon={Stethoscope} color="#2563EB" label="Healthcare Provider Access" sub="Doctors viewing your records" value="2 providers" delay={0.3} />
              </div>

              {/* HIPAA info banner */}
              <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-bold">Your privacy is our priority.</span> LifeLine AI is fully HIPAA compliant and never sells your health data. All records are end-to-end encrypted.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Inline icon aliases (avoid missing imports) ──────────────────────────────
function MonitorIcon(props: React.ComponentProps<typeof Monitor>) { return <Monitor {...props} />; }
function HeartPulseIcon({ size, color, strokeWidth }: { size?: number; color?: string; strokeWidth?: number }) {
  return <Activity size={size} color={color} strokeWidth={strokeWidth} />;
}
function ActivityIcon(props: React.ComponentProps<typeof Activity>) { return <Activity {...props} />; }
