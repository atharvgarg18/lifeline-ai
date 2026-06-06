"use client";

import { motion } from "framer-motion";
import {
  MonitorSmartphone,
  ScanLine,
  Share2,
  HeartPulse,
  Lock,
  UserCheck,
  KeyRound,
  ShieldCheck,
  BadgeCheck,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";

/* ─── shared animation ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.08, ease: "easeOut" },
  }),
};

/* ─── step data ─────────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    icon: MonitorSmartphone,
    title: "Show QR Code",
    desc: "Open the LifeLine app and display your Health QR ID at any facility counter or emergency desk.",
    accent: "#2563EB",
    light: "#EFF6FF",
    border: "#BFDBFE",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Allow Scan",
    desc: "The verified healthcare provider scans your QR using their LifeLine-certified reader in seconds.",
    accent: "#7C3AED",
    light: "#F5F3FF",
    border: "#DDD6FE",
    textColor: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share Instantly",
    desc: "Records, allergies, blood group and prescriptions are shared securely in under 2 seconds.",
    accent: "#059669",
    light: "#ECFDF5",
    border: "#A7F3D0",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    number: "04",
    icon: HeartPulse,
    title: "Get Better Care",
    desc: "Doctors get full context instantly — no forms, no delays, no miscommunication. Just smarter care.",
    accent: "#DC2626",
    light: "#FFF1F2",
    border: "#FECDD3",
    textColor: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
];

/* ─── privacy items ─────────────────────────────────────────────── */
const privacyItems = [
  {
    icon: Lock,
    title: "Encrypted Records",
    desc: "AES-256 encryption for all health data, both at rest and in transit.",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    dot: "bg-blue-500",
  },
  {
    icon: UserCheck,
    title: "Verified Hospital Access",
    desc: "Only ABHA-registered facilities can request access to your health profile.",
    textColor: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-100",
    dot: "bg-violet-500",
  },
  {
    icon: KeyRound,
    title: "Role Based Permissions",
    desc: "Doctors, nurses, and admins see only the data they're authorised to view.",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    dot: "bg-amber-500",
  },
  {
    icon: ShieldCheck,
    title: "Emergency Access Controls",
    desc: "One-tap emergency override with automatic audit logging and alerts.",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    dot: "bg-emerald-500",
  },
];

/* ─── compliance badges ─────────────────────────────────────────── */
const badges = [
  {
    label: "HIPAA",
    sub: "Compliant",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  {
    label: "ABHA",
    sub: "Integrated",
    textColor: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    dotColor: "bg-violet-500",
  },
  {
    label: "NDHM",
    sub: "Certified",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
];

/* ─── trust indicators ──────────────────────────────────────────── */
const trustItems = [
  "End-to-end encryption on all data transmissions",
  "Zero third-party data sharing, ever",
  "Instant revoke & re-issue controls in your hands",
];

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function HealthQRSection3() {
  /* score ring */
  const score = 98;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="max-w-7xl mx-auto px-6 py-2 space-y-6 font-sans">

      {/* ── Section header ───────────────────────────────────────── */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-xl font-bold text-[#1E293B]">Usage Guide & Security</h2>
        <p className="text-[#64748B] text-sm mt-0.5">
          Everything you need to use and trust your Health QR ID.
        </p>
      </motion.div>

      {/* ── Two-column grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ════════════════════════════════════════
            LEFT — How To Use Your QR
        ════════════════════════════════════════ */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(37,99,235,0.10)" }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col gap-6 transition-shadow duration-300"
        >
          {/* Card header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#1E293B] font-bold text-lg">How To Use Your QR</h3>
              <p className="text-[#64748B] text-xs mt-0.5">Four simple steps to faster healthcare</p>
            </div>
            <div className="w-9 h-9 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <ScanLine className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col">
            {steps.map(({ number, icon: Icon, title, desc, textColor, bgColor, borderColor, border }, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <div key={number} className="flex gap-4">

                  {/* ── Left rail: icon + connector ── */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      custom={2 + idx}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      whileHover={{ scale: 1.1 }}
                      className={`relative w-12 h-12 rounded-2xl ${bgColor} border ${borderColor} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200`}
                    >
                      <Icon className={`w-5 h-5 ${textColor}`} />
                      {/* Step number badge */}
                      <span
                        className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-extrabold text-white`}
                        style={{ backgroundColor: steps[idx].accent }}
                      >
                        {number.slice(1)}
                      </span>
                    </motion.div>

                    {/* Connector */}
                    {!isLast && (
                      <div
                        className="w-0.5 flex-1 min-h-[28px] my-1 rounded-full"
                        style={{ background: `linear-gradient(to bottom, ${steps[idx].accent}55, ${steps[idx + 1].accent}33)` }}
                      />
                    )}
                  </div>

                  {/* ── Right: text ── */}
                  <motion.div
                    custom={2 + idx}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className={`${isLast ? "pb-0" : "pb-5"} flex-1 pt-1`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-extrabold tracking-[0.15em] uppercase"
                        style={{ color: steps[idx].accent }}
                      >
                        Step {number}
                      </span>
                    </div>
                    <p className="text-[#1E293B] font-bold text-sm">{title}</p>
                    <p className="text-[#64748B] text-xs mt-1 leading-relaxed">{desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Bottom tip */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-blue-700 text-xs font-medium leading-relaxed">
              <span className="font-bold">Works offline too —</span> your QR stays accessible even without an internet connection.
            </p>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            RIGHT — Data Privacy & Security
        ════════════════════════════════════════ */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(16,185,129,0.09)" }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col gap-5 transition-shadow duration-300"
        >
          {/* Card header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#1E293B] font-bold text-lg">Data Privacy & Security</h3>
              <p className="text-[#64748B] text-xs mt-0.5">Your data, your control — always</p>
            </div>
            <div className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {/* ── Security Score ── */}
          <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-100">
            {/* Ring */}
            <div className="relative w-[84px] h-[84px] shrink-0">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                {/* Track */}
                <circle cx="40" cy="40" r={r} fill="none" stroke="#D1FAE5" strokeWidth="8" />
                {/* Progress */}
                <motion.circle
                  cx="40" cy="40" r={r}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${circ}`}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: circ - dash }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                />
              </svg>
              {/* Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-emerald-700 font-extrabold text-xl leading-none">{score}%</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[#1E293B] font-bold text-base">Security Score</p>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                  Excellent
                </span>
              </div>
              <p className="text-[#64748B] text-xs mt-1.5 leading-relaxed">
                Meets the highest standards of medical data protection and regulatory compliance.
              </p>
              {/* Mini bar */}
              <div className="mt-3 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">{score}/100 points</p>
            </div>
          </div>

          {/* ── Privacy Items ── */}
          <div className="grid grid-cols-1 gap-2.5">
            {privacyItems.map(({ icon: Icon, title, desc, textColor, bgColor, borderColor }, i) => (
              <motion.div
                key={title}
                custom={5 + i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                whileHover={{ x: 4 }}
                className="flex items-start gap-3.5 p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-default"
              >
                <div className={`w-9 h-9 ${bgColor} border ${borderColor} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1E293B] font-semibold text-sm">{title}</p>
                  <p className="text-[#64748B] text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>

          {/* ── Compliance Badges ── */}
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.14em] uppercase text-[#94A3B8] mb-3">
              Healthcare Compliance
            </p>
            <div className="flex gap-2.5 flex-wrap">
              {badges.map(({ label, sub, textColor, bgColor, borderColor, dotColor }, i) => (
                <motion.div
                  key={label}
                  custom={10 + i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${bgColor} ${borderColor} cursor-default transition-transform duration-200`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <div className="flex flex-col leading-none">
                    <span className={`text-xs font-extrabold ${textColor}`}>{label}</span>
                    <span className={`text-[9px] font-semibold opacity-70 ${textColor} mt-0.5`}>{sub}</span>
                  </div>
                  <BadgeCheck className={`w-3.5 h-3.5 ${textColor} opacity-80`} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Trust Indicators ── */}
          <div className="flex flex-col gap-2.5 pt-1 border-t border-slate-100">
            <p className="text-[10px] font-extrabold tracking-[0.14em] uppercase text-[#94A3B8]">
              Trust Indicators
            </p>
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                custom={13 + i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex items-center gap-2.5"
              >
                <div className="w-5 h-5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-[#64748B] text-xs leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
