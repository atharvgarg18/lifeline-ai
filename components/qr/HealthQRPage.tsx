"use client";

import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  Download,
  Share2,
  RefreshCw,
  CreditCard,
  Printer,
  Wallet,
  RotateCcw,
  User,
  Lock,
  BadgeCheck,
  Eye,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

// QR Code SVG generator (realistic QR pattern)
function QRCodeSVG() {
  const size = 200;
  const modules = 25;
  const cellSize = size / modules;

  // Deterministic QR-like pattern
  const pattern: boolean[][] = Array.from({ length: modules }, (_, r) =>
    Array.from({ length: modules }, (_, c) => {
      // Finder patterns (top-left, top-right, bottom-left)
      const inFinder = (row: number, col: number) =>
        (row < 7 && col < 7) ||
        (row < 7 && col >= modules - 7) ||
        (row >= modules - 7 && col < 7);
      if (inFinder(r, c)) {
        const tr = r >= modules - 7 ? r - (modules - 7) : r;
        const tc = c >= modules - 7 ? c - (modules - 7) : c;
        const rr = r < 7 ? r : tr;
        const cc = c < 7 ? c : c >= modules - 7 ? tc : c;
        const dist = Math.max(rr < 7 ? Math.min(rr, 6 - rr) : 0, cc < 7 ? Math.min(cc, 6 - cc) : 0);
        return dist % 2 === 0;
      }
      // Timing patterns
      if (r === 6 || c === 6) return (r + c) % 2 === 0;
      // Data modules — pseudo-random but deterministic
      return ((r * 7 + c * 13 + r * c) % 3 !== 0);
    })
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="white" rx="4" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#1E293B"
            />
          ) : null
        )
      )}
      {/* Center logo overlay */}
      <rect x={size / 2 - 18} y={size / 2 - 18} width={36} height={36} rx={6} fill="white" />
      <rect x={size / 2 - 14} y={size / 2 - 14} width={28} height={28} rx={5} fill="#2563EB" />
      {/* Heart icon in center */}
      <path
        d={`M${size / 2} ${size / 2 + 6} C${size / 2} ${size / 2 + 6} ${size / 2 - 10} ${size / 2} ${size / 2 - 10} ${size / 2 - 4} C${size / 2 - 10} ${size / 2 - 8} ${size / 2 - 7} ${size / 2 - 11} ${size / 2} ${size / 2 - 5} C${size / 2 + 7} ${size / 2 - 11} ${size / 2 + 10} ${size / 2 - 8} ${size / 2 + 10} ${size / 2 - 4} C${size / 2 + 10} ${size / 2} ${size / 2} ${size / 2 + 6} ${size / 2} ${size / 2 + 6} Z`}
        fill="white"
      />
    </svg>
  );
}

export default function HealthQRPage() {
  const healthData = {
    healthId: "LFL-2024-IND-84720",
    fullName: "Rajesh Kumar Sharma",
    dob: "14 March 1985",
    bloodGroup: "B+",
    mobile: "+91 98765 43210",
    emergencyContact: "+91 99887 76655",
    registrationDate: "02 January 2024",
  };

  const quickActions = [
    { icon: RefreshCw, label: "Refresh QR", color: "text-blue-600 bg-blue-50" },
    { icon: Download, label: "Download ID Card", color: "text-emerald-600 bg-emerald-50" },
    { icon: Printer, label: "Print QR Card", color: "text-violet-600 bg-violet-50" },
    { icon: Share2, label: "Share Profile", color: "text-amber-600 bg-amber-50" },
    { icon: Wallet, label: "Add to Wallet", color: "text-sky-600 bg-sky-50" },
    { icon: RotateCcw, label: "Regenerate QR", color: "text-rose-600 bg-rose-50" },
  ];

  const securityItems = [
    { icon: Lock, label: "Encrypted Data", desc: "AES-256 encrypted", color: "text-blue-600 bg-blue-50" },
    { icon: BadgeCheck, label: "Verified Access", desc: "Identity confirmed", color: "text-emerald-600 bg-emerald-50" },
    { icon: Shield, label: "HIPAA Secure", desc: "Fully compliant", color: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Heading */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight">My Health QR ID</h1>
          <p className="text-[#64748B] mt-1 text-base">
            Your secure digital identity for faster and smarter healthcare.
          </p>
        </motion.div>

        {/* Verified Health ID Banner */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center gap-3 bg-white border border-emerald-200 rounded-2xl px-5 py-3.5 shadow-sm w-fit"
        >
          <div className="p-1.5 bg-emerald-50 rounded-xl">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[#1E293B] font-semibold text-sm">Verified Health ID</span>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified
          </div>
        </motion.div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — QR Code Card */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37,99,235,0.10)" }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col items-center gap-5 transition-shadow duration-300"
          >
            <div className="w-full">
              <h2 className="text-[#1E293B] font-bold text-lg">Health QR Code</h2>
              <p className="text-[#64748B] text-xs mt-0.5">Scan to access health profile</p>
            </div>

            {/* QR Code */}
            <div className="relative p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner">
              <QRCodeSVG />
              {/* Corner accents */}
              <span className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-500 rounded-tl-md" />
              <span className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-500 rounded-tr-md" />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-500 rounded-bl-md" />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-500 rounded-br-md" />
            </div>

            <div className="text-center">
              <p className="text-xs font-mono text-[#64748B] tracking-widest">LFL-2024-IND-84720</p>
              <p className="text-[10px] text-slate-400 mt-1">Valid · Updated just now</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold py-3 rounded-2xl shadow hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-[#1E293B] text-sm font-semibold py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>
          </motion.div>

          {/* CENTER — Health ID Details */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37,99,235,0.10)" }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col gap-5 transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[#1E293B] font-bold text-lg">Health ID Details</h2>
                <p className="text-[#64748B] text-xs mt-0.5">Personal health information</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow">
                RK
              </div>
              <div>
                <p className="font-bold text-[#1E293B] text-sm">{healthData.fullName}</p>
                <p className="text-blue-600 text-xs font-mono">{healthData.healthId}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3 flex-1">
              {[
                { label: "Health ID", value: healthData.healthId },
                { label: "Full Name", value: healthData.fullName },
                { label: "Date of Birth", value: healthData.dob },
                { label: "Blood Group", value: healthData.bloodGroup, highlight: true },
                { label: "Mobile Number", value: healthData.mobile },
                { label: "Emergency Contact", value: healthData.emergencyContact },
                { label: "Registration Date", value: healthData.registrationDate },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-[#64748B] text-xs font-medium">{label}</span>
                  {highlight ? (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {value}
                    </span>
                  ) : (
                    <span className="text-[#1E293B] text-xs font-semibold text-right">{value}</span>
                  )}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white text-sm font-semibold py-3.5 rounded-2xl shadow hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Full Profile
            </motion.button>
          </motion.div>

          {/* RIGHT — Quick Actions */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37,99,235,0.10)" }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col gap-5 transition-shadow duration-300"
          >
            <div>
              <h2 className="text-[#1E293B] font-bold text-lg">Quick Actions</h2>
              <p className="text-[#64748B] text-xs mt-0.5">Manage your health identity</p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {quickActions.map(({ icon: Icon, label, color }, i) => (
                <motion.button
                  key={label}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex flex-col items-center justify-center gap-2.5 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[#1E293B] text-xs font-semibold text-center leading-tight">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security Status Card */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-[#1E293B] font-bold text-base">Security Status</h3>
              <p className="text-[#64748B] text-xs">Your health data is protected</p>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              All Systems Secure
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {securityItems.map(({ icon: Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                custom={6 + i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[#1E293B] font-semibold text-sm">{label}</p>
                  <p className="text-[#64748B] text-xs mt-0.5">{desc}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
