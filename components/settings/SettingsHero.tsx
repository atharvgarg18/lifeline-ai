"use client";

import { motion, useAnimation, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Heart,
  QrCode,
  Stethoscope,
  Brain,
  CheckCircle2,
  Wifi,
  Lock,
  Sparkles,
  User,
  Mail,
  Phone,
  Droplets,
  AlertCircle,
  BadgeCheck,
  Fingerprint,
  Activity,
  MonitorSmartphone,
  Globe,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({
  to,
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", setDisplay);
    return () => {
      controls.stop();
      unsub();
    };
  }, [to]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

// ─── Circular Progress Ring ──────────────────────────────────────────────────
function CircularProgress({ value, size = 120 }: { value: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-blue-600">
          <AnimatedCounter to={value} suffix="%" />
        </span>
        <span className="text-[10px] text-slate-500 font-medium mt-0.5">Complete</span>
      </div>
    </div>
  );
}

// ─── Floating Icon ───────────────────────────────────────────────────────────
function FloatingIcon({
  icon: Icon,
  color,
  delay,
  x,
  y,
  size = 44,
}: {
  icon: React.ElementType;
  color: string;
  delay: number;
  x: string;
  y: string;
  size?: number;
}) {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm border border-white/40"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
    >
      <Icon size={size * 0.44} color="white" strokeWidth={1.8} />
    </motion.div>
  );
}

// ─── Security Badge ──────────────────────────────────────────────────────────
function SecurityBadge({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <motion.div
      className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-3 py-1.5 shadow-sm"
      whileHover={{ scale: 1.05 }}
    >
      <Icon size={13} className="text-green-500" strokeWidth={2.5} />
      <span className="text-[11px] font-semibold text-slate-700">{label}</span>
    </motion.div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  sub,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  sub: string;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, shadow: "xl", transition: { duration: 0.2 } }}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200"
        style={{ background: gradient }}
      >
        <Icon size={22} color="white" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-none">
          <AnimatedCounter to={value} suffix={suffix ?? ""} duration={1.4} />
        </p>
        <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
      </div>
    </motion.div>
  );
}

// ─── Profile Info Row ────────────────────────────────────────────────────────
function ProfileInfoItem({
  icon: Icon,
  label,
  value,
  color = "#2563EB",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 transition-colors duration-200 group">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={15} style={{ color }} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Missing Hint ────────────────────────────────────────────────────────────
function MissingHint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-amber-600">
      <AlertCircle size={13} strokeWidth={2.5} />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SettingsHero() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Subtle grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2563EB 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 py-8 space-y-8">
        {/* ── SECTION 1A: HERO ─────────────────────────────────────────────── */}
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.07)" }}
        >
          {/* Background gradient mesh */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 110% 50%, #EFF6FF 0%, transparent 70%), radial-gradient(ellipse 50% 60% at -10% 20%, #DBEAFE 0%, transparent 60%)",
            }}
          />

          <div className="relative flex flex-col lg:flex-row items-stretch gap-0">
            {/* LEFT: Text content */}
            <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center gap-6">
              {/* Breadcrumb pill */}
              <motion.div
                className="inline-flex w-fit items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Sparkles size={13} className="text-blue-500" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Account Settings
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                  Settings
                </h1>
                <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-md">
                  Manage your healthcare account, privacy, security and AI
                  preferences.
                </p>
              </motion.div>

              {/* Greeting card */}
              <motion.div
                className="inline-flex flex-col gap-1 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl px-5 py-4 shadow-lg shadow-blue-200 max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <p className="text-white font-bold text-lg leading-snug">
                  Welcome back, Nitin 👋
                </p>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Your LifeLine AI account is protected and verified.
                </p>
              </motion.div>

              {/* Security badges */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <SecurityBadge label="Verified Account" icon={BadgeCheck} />
                <SecurityBadge label="Health ID Connected" icon={Fingerprint} />
                <SecurityBadge label="Data Protected" icon={Lock} />
                <SecurityBadge label="AI Assistant Enabled" icon={Brain} />
              </motion.div>
            </div>

            {/* RIGHT: Shield illustration + floating icons */}
            <div className="relative lg:w-[380px] flex items-center justify-center p-8 min-h-[280px]">
              {/* Glow blob */}
              <motion.div
                className="absolute w-56 h-56 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Central Shield */}
              <motion.div
                className="relative z-10 w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
                  boxShadow: "0 20px 60px rgba(37,99,235,0.35)",
                }}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
                whileHover={{ scale: 1.05, rotate: 3 }}
              >
                <Shield size={44} color="white" strokeWidth={1.5} />
                <span className="text-white text-[10px] font-bold mt-1 opacity-90">
                  SECURED
                </span>
              </motion.div>

              {/* Floating icons */}
              <FloatingIcon icon={Heart}       color="linear-gradient(135deg,#EF4444,#F87171)" delay={0.6}  x="10%"  y="15%"  size={42} />
              <FloatingIcon icon={QrCode}      color="linear-gradient(135deg,#8B5CF6,#A78BFA)" delay={0.8}  x="68%"  y="8%"   size={38} />
              <FloatingIcon icon={Stethoscope} color="linear-gradient(135deg,#10B981,#34D399)" delay={1.0}  x="72%"  y="60%"  size={42} />
              <FloatingIcon icon={Brain}       color="linear-gradient(135deg,#F59E0B,#FCD34D)" delay={0.7}  x="5%"   y="62%"  size={40} />
              <FloatingIcon icon={Activity}    color="linear-gradient(135deg,#06B6D4,#67E8F9)" delay={0.9}  x="42%"  y="72%"  size={36} />
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ROW ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={User}
            label="Profile Completion"
            value={92}
            suffix="%"
            sub="8% remaining"
            gradient="linear-gradient(135deg,#2563EB,#60A5FA)"
            delay={0.1}
          />
          <StatCard
            icon={Shield}
            label="Security Score"
            value={100}
            sub="High — Well protected"
            gradient="linear-gradient(135deg,#10B981,#34D399)"
            delay={0.2}
          />
          <StatCard
            icon={MonitorSmartphone}
            label="Connected Devices"
            value={4}
            sub="Linked to your account"
            gradient="linear-gradient(135deg,#8B5CF6,#A78BFA)"
            delay={0.3}
          />
          <StatCard
            icon={Globe}
            label="Active Sessions"
            value={3}
            sub="Currently signed in"
            gradient="linear-gradient(135deg,#F59E0B,#FCD34D)"
            delay={0.4}
          />
        </div>

        {/* ── PROFILE COMMAND CENTER ────────────────────────────────────────── */}
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.06)" }}
        >
          {/* Background glass shimmer */}
          <div
            className="absolute top-0 right-0 w-[480px] h-[320px] pointer-events-none rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(ellipse, #DBEAFE 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="relative p-8">
            {/* Section header */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Profile Command Center
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Your complete health identity at a glance
                </p>
              </div>
              <motion.button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl px-5 py-2.5 shadow-sm shadow-blue-200 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Edit Profile
                <ChevronRight size={15} strokeWidth={2.5} />
              </motion.button>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
              {/* ── Left: Avatar + badges + progress ─── */}
              <div className="flex flex-col items-center gap-5 xl:w-56 flex-shrink-0">
                {/* Avatar with glow ring */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {/* Animated ring */}
                  <motion.div
                    className="absolute -inset-2 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #2563EB, #60A5FA, #2563EB)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <User size={48} className="text-blue-400" strokeWidth={1.5} />
                  </div>
                  {/* Verified badge */}
                  <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center border-3 border-white shadow-md">
                    <BadgeCheck size={18} color="white" strokeWidth={2.2} />
                  </div>
                </motion.div>

                {/* Name + Health ID */}
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">Nitin Kumar</p>
                  <div className="mt-1 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                    <Fingerprint size={12} className="text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600">
                      LF-2024-78432
                    </span>
                  </div>
                </div>

                {/* Circular progress */}
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress value={92} size={110} />
                  <p className="text-xs font-semibold text-slate-600">
                    Profile Completion
                  </p>
                  {/* Missing hints */}
                  <div className="w-full space-y-1.5 mt-1">
                    <MissingHint text="Add insurance details" />
                    <MissingHint text="Upload a profile photo" />
                  </div>
                </div>
              </div>

              {/* ── Right: Info grid ──────────────────── */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ProfileInfoItem
                  icon={User}
                  label="Full Name"
                  value="Nitin Kumar"
                  color="#2563EB"
                />
                <ProfileInfoItem
                  icon={Mail}
                  label="Email Address"
                  value="nitin.kumar@email.com"
                  color="#8B5CF6"
                />
                <ProfileInfoItem
                  icon={Phone}
                  label="Phone Number"
                  value="+91 98765 43210"
                  color="#10B981"
                />
                <ProfileInfoItem
                  icon={Activity}
                  label="Date of Birth"
                  value="12 May 1995"
                  color="#F59E0B"
                />
                <ProfileInfoItem
                  icon={Droplets}
                  label="Blood Group"
                  value="O+ Positive"
                  color="#EF4444"
                />
                <ProfileInfoItem
                  icon={User}
                  label="Gender"
                  value="Male"
                  color="#06B6D4"
                />

                {/* Emergency Contact — full width */}
                <motion.div
                  className="sm:col-span-2 flex items-center gap-4 p-4 rounded-2xl border border-red-100 bg-red-50/60 hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Heart size={18} className="text-red-500" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wide mb-0.5">
                      Emergency Contact
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-slate-800">
                        Rohit Sharma
                      </p>
                      <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                        Brother
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      +91 98765 12345
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-red-200 flex items-center justify-center shadow-sm hover:bg-red-50 cursor-pointer transition-colors">
                    <ChevronRight size={15} className="text-red-400" />
                  </div>
                </motion.div>

                {/* Account status pills */}
                <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
                  {[
                    { icon: CheckCircle2, label: "Identity Verified", color: "text-green-600 bg-green-50 border-green-200" },
                    { icon: Wifi, label: "Health ID Synced", color: "text-blue-600 bg-blue-50 border-blue-200" },
                    { icon: Lock, label: "2FA Active", color: "text-purple-600 bg-purple-50 border-purple-200" },
                    { icon: Zap, label: "AI Assistant On", color: "text-amber-600 bg-amber-50 border-amber-200" },
                    { icon: Star, label: "Premium Plan", color: "text-rose-600 bg-rose-50 border-rose-200" },
                  ].map(({ icon: Ic, label, color }) => (
                    <div
                      key={label}
                      className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}
                    >
                      <Ic size={12} strokeWidth={2.5} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
