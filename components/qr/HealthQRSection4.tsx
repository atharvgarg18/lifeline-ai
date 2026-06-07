"use client";

import { motion } from "framer-motion";
import {
  Download,
  Wallet,
  Shield,
  CheckCircle,
  Zap,
  HeartPulse,
  BadgeCheck,
  ScanLine,
  Smartphone,
  Star,
  Lock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay: i * 0.09, ease: "easeOut" },
  }),
};

const featurePills = [
  { label: "Secure",          icon: Lock,        color: "text-blue-700 bg-blue-50 border-blue-200" },
  { label: "Verified",        icon: BadgeCheck,  color: "text-violet-700 bg-violet-50 border-violet-200" },
  { label: "Easy Access",     icon: Zap,         color: "text-amber-700 bg-amber-50 border-amber-200" },
  { label: "Emergency Ready", icon: HeartPulse,  color: "text-rose-700 bg-rose-50 border-rose-200" },
];

/* ── Tiny QR SVG for card preview ───────────────────────────── */
function MiniQR({ size = 64 }: { size?: number }) {
  const modules = 11;
  const cell = size / modules;
  const pattern = Array.from({ length: modules }, (_, r) =>
    Array.from({ length: modules }, (_, c) => {
      if ((r < 3 && c < 3) || (r < 3 && c >= modules - 3) || (r >= modules - 3 && c < 3)) {
        const tr = r >= modules - 3 ? r - (modules - 3) : r;
        const tc = c >= modules - 3 ? c - (modules - 3) : c;
        const rr = r < 3 ? r : tr;
        const cc = c < 3 ? c : c >= modules - 3 ? tc : c;
        const d = Math.max(Math.min(rr, 2 - rr), Math.min(cc, 2 - cc));
        return d % 2 === 0;
      }
      if (r === 4 || c === 4) return (r + c) % 2 === 0;
      return (r * 5 + c * 9 + r * c) % 3 !== 0;
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="4" />
      {pattern.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1E293B" />
          ) : null
        )
      )}
      <rect x={size / 2 - 7} y={size / 2 - 7} width={14} height={14} rx={3} fill="white" />
      <rect x={size / 2 - 5} y={size / 2 - 5} width={10} height={10} rx={2} fill="#2563EB" />
    </svg>
  );
}

/* ── Large QR SVG for phone mockup ──────────────────────────── */
function LargeQR({ size = 130 }: { size?: number }) {
  const modules = 21;
  const cell = size / modules;
  const pattern = Array.from({ length: modules }, (_, r) =>
    Array.from({ length: modules }, (_, c) => {
      if ((r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7)) {
        const tr = r >= modules - 7 ? r - (modules - 7) : r;
        const tc = c >= modules - 7 ? c - (modules - 7) : c;
        const rr = r < 7 ? r : tr;
        const cc = c < 7 ? c : c >= modules - 7 ? tc : c;
        const d = Math.max(Math.min(rr, 6 - rr), Math.min(cc, 6 - cc));
        return d % 2 === 0;
      }
      if (r === 6 || c === 6) return (r + c) % 2 === 0;
      return (r * 7 + c * 13 + r * c) % 3 !== 0;
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="8" />
      {pattern.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1E293B" />
          ) : null
        )
      )}
      <rect x={size / 2 - 14} y={size / 2 - 14} width={28} height={28} rx={5} fill="white" />
      <rect x={size / 2 - 11} y={size / 2 - 11} width={22} height={22} rx={4} fill="#2563EB" />
      <path
        d={`M${size/2} ${size/2+7} C${size/2} ${size/2+7} ${size/2-9} ${size/2+1} ${size/2-9} ${size/2-3}
            C${size/2-9} ${size/2-7} ${size/2-6} ${size/2-10} ${size/2} ${size/2-5}
            C${size/2+6} ${size/2-10} ${size/2+9} ${size/2-7} ${size/2+9} ${size/2-3}
            C${size/2+9} ${size/2+1} ${size/2} ${size/2+7} ${size/2} ${size/2+7} Z`}
        fill="white"
      />
    </svg>
  );
}

export default function HealthQRSection4() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-2 pb-8 space-y-5 font-sans">

      {/* ── Section header ───────────────────────────────────────── */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-xl font-bold text-[#1E293B]">Your Digital Health Identity</h2>
        <p className="text-[#64748B] text-sm mt-0.5">
          Always with you — across every hospital, pharmacy, and emergency.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          MAIN CTA CARD
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl shadow-2xl"
      >
        {/* Background decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          {/* Dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* ── LEFT SIDE ───────────────────────────────────────── */}
          <div className="flex flex-col justify-center gap-7 p-9 lg:p-12">

            {/* Phone + QR mockup */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-end gap-5"
            >
              {/* Phone frame */}
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-blue-300/30 rounded-[2.8rem] blur-xl scale-110" />
                <div className="relative w-[136px] bg-[#0F172A] rounded-[2.4rem] border-4 border-white/20 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-16 h-4 bg-[#1E293B] rounded-full" />
                  </div>
                  {/* Screen */}
                  <div className="bg-white mx-2 mb-2 rounded-[1.4rem] overflow-hidden">
                    {/* App header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-3 pt-3 pb-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <HeartPulse className="w-3 h-3 text-white" />
                        <span className="text-white text-[8px] font-extrabold tracking-wide">LIFELINE AI</span>
                      </div>
                      <p className="text-white/80 text-[7px] leading-tight">Health QR ID</p>
                      <p className="text-white text-[9px] font-bold">Rajesh K. Sharma</p>
                    </div>
                    {/* QR area */}
                    <div className="flex flex-col items-center px-3 py-3 gap-2">
                      <div className="p-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <LargeQR size={100} />
                      </div>
                      <p className="text-[6px] font-mono text-slate-400 tracking-wider">LFL-2024-IND-84720</p>
                      <div className="flex items-center gap-1 bg-emerald-50 rounded-full px-2 py-0.5">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[6px] text-emerald-700 font-bold">ACTIVE · VERIFIED</span>
                      </div>
                    </div>
                    {/* Bottom bar */}
                    <div className="bg-slate-50 px-3 py-2 flex justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[5.5px] text-slate-400 font-medium">Blood Group</span>
                        <span className="text-[8px] font-extrabold text-red-600">B+</span>
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[5.5px] text-slate-400 font-medium">Last Scan</span>
                        <span className="text-[7px] font-bold text-slate-600">02 Jun 2026</span>
                      </div>
                    </div>
                  </div>
                  {/* Home bar */}
                  <div className="flex justify-center pb-2.5">
                    <div className="w-10 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="flex-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-3.5 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white text-[10px] font-bold">Digital Health ID</span>
                </div>
                {[
                  { k: "Status", v: "Active", accent: true },
                  { k: "Scans", v: "148 total" },
                  { k: "Security", v: "98% secure" },
                ].map(({ k, v, accent }) => (
                  <div key={k} className="flex justify-between items-center py-1 border-b border-white/10 last:border-0">
                    <span className="text-white/60 text-[9px]">{k}</span>
                    <span className={`text-[9px] font-bold ${accent ? "text-emerald-300" : "text-white"}`}>{v}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Headline + description */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="space-y-3">
              <h2 className="text-white font-extrabold text-2xl lg:text-3xl leading-tight tracking-tight">
                Carry Your Health ID<br />
                <span className="text-blue-200">Everywhere</span>
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
                Access your complete healthcare profile instantly during emergencies and hospital visits — no paperwork, no delays.
              </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-2">
              {featurePills.map(({ label, icon: Icon, color }, i) => (
                <motion.span
                  key={label}
                  custom={5 + i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  whileHover={{ scale: 1.07 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold bg-white ${color} cursor-default`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-white text-blue-700 text-sm font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-4 h-4" />
                Download ID Card
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-white/25 transition-all"
              >
                <Wallet className="w-4 h-4" />
                Add To Wallet
              </motion.button>
            </motion.div>
          </div>

          {/* ── RIGHT SIDE — Digital Health Card Preview ─────────── */}
          <div className="flex items-center justify-center p-9 lg:p-12">
            <motion.div
              custom={6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="w-full max-w-sm"
            >
              {/* Card tilt container */}
              <motion.div
                animate={{ rotateY: [0, 3, 0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                style={{ perspective: 1000 }}
              >
                {/* ── The physical card ── */}
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
                  {/* Card background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />
                  {/* Holographic shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-violet-500/10" />
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="cardgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#cardgrid)" />
                    </svg>
                  </div>
                  {/* Top arc decoration */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-500/15 rounded-full blur-xl" />

                  {/* Card content */}
                  <div className="relative z-10 p-6 flex flex-col gap-5">

                    {/* Card header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                          <HeartPulse className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-extrabold text-sm leading-none">LifeLine AI</p>
                          <p className="text-blue-300 text-[9px] font-medium mt-0.5">Digital Health Card</p>
                        </div>
                      </div>
                      {/* Chip */}
                      <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md border border-yellow-200/50 shadow-sm flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-px opacity-60">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-yellow-800/60 rounded-[1px]" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Patient info + QR */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-3 flex-1">
                        <div>
                          <p className="text-white/50 text-[8px] font-semibold uppercase tracking-widest">Patient Name</p>
                          <p className="text-white font-bold text-base mt-0.5">Rajesh K. Sharma</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-white/50 text-[8px] font-semibold uppercase tracking-widest">Health ID</p>
                            <p className="text-blue-300 font-mono text-[10px] font-bold mt-0.5">LFL-2024-84720</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-[8px] font-semibold uppercase tracking-widest">Blood Group</p>
                            <p className="text-rose-400 font-extrabold text-lg mt-0.5 leading-none">B+</p>
                          </div>
                        </div>
                      </div>

                      {/* Mini QR */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className="p-1.5 bg-white rounded-xl shadow-md border border-white/50">
                          <MiniQR size={60} />
                        </div>
                        <span className="text-white/40 text-[7px] font-semibold">SCAN ME</span>
                      </div>
                    </div>

                    {/* Verification badge row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 text-[9px] font-bold">Verified Identity</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    {/* CTA Strip */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl px-4 py-3 flex items-center justify-between">
                      <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%">
                          <defs>
                            <pattern id="strip-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                              <circle cx="1.5" cy="1.5" r="1" fill="white" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#strip-dots)" />
                        </svg>
                      </div>
                      <div className="relative flex items-center gap-2">
                        <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                          <ScanLine className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-xs">Scan for Emergency Access</p>
                          <p className="text-blue-200 text-[9px]">Instant profile retrieval</p>
                        </div>
                      </div>
                      <div className="relative w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <HeartPulse className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>

              {/* Card reflection */}
              <div className="h-8 mx-8 bg-gradient-to-b from-black/20 to-transparent rounded-b-full blur-md -mt-1" />
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          FOOTER PRIVACY NOTICE
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        custom={8}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-[#64748B] text-sm text-center leading-relaxed">
          <span className="text-[#1E293B] font-semibold">LifeLine AI</span> is committed to protecting your health information and ensuring your privacy at every step.
        </p>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-700 text-[10px] font-bold">HIPAA Compliant</span>
        </div>
      </motion.div>

    </div>
  );
}
