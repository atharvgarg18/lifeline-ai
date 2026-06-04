"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  Truck,
  AlertCircle,
  ScanLine,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Activity,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const accessCategories = [
  { icon: Building2,   label: "Hospitals",   color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
  { icon: Stethoscope, label: "Clinics",     color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  { icon: Pill,        label: "Pharmacies",  color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100" },
  { icon: FlaskConical,label: "Labs",        color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
  { icon: Truck,   label: "Trucks",  color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-100" },
  { icon: AlertCircle, label: "Emergency",   color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
];

const stats = [
  { label: "Total Scans", value: "148", delta: "+12 this month", icon: ScanLine, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Hospitals",   value: "63",  delta: "+4 this month",  icon: Building2, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Pharmacies",  value: "47",  delta: "+6 this month",  icon: Pill,      color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Labs",        value: "38",  delta: "+2 this month",  icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-50" },
];

const scanHistory = [
  {
    location: "Apollo Hospital",
    type: "Hospital",
    typeColor: "text-blue-600 bg-blue-50 border-blue-100",
    date: "02 Jun 2026",
    time: "10:24 AM",
    purpose: "Cardiology Consultation",
    avatar: "AH",
    avatarBg: "bg-blue-600",
  },
  {
    location: "HealthPlus Pharmacy",
    type: "Pharmacy",
    typeColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    date: "29 May 2026",
    time: "03:15 PM",
    purpose: "Medicine Purchase",
    avatar: "HP",
    avatarBg: "bg-emerald-600",
  },
  {
    location: "City Diagnostic Lab",
    type: "Lab",
    typeColor: "text-amber-600 bg-amber-50 border-amber-100",
    date: "25 May 2026",
    time: "08:45 AM",
    purpose: "Complete Blood Test",
    avatar: "CL",
    avatarBg: "bg-amber-500",
  },
  {
    location: "MediCare Clinic",
    type: "Clinic",
    typeColor: "text-violet-600 bg-violet-50 border-violet-100",
    date: "20 May 2026",
    time: "05:00 PM",
    purpose: "General Physician Visit",
    avatar: "MC",
    avatarBg: "bg-violet-600",
  },
  {
    location: "AIIMS Emergency",
    type: "Emergency",
    typeColor: "text-rose-600 bg-rose-50 border-rose-100",
    date: "14 May 2026",
    time: "11:30 PM",
    purpose: "Acute Chest Pain",
    avatar: "AE",
    avatarBg: "bg-rose-600",
  },
];

export default function HealthQRSection2() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-2 space-y-6 font-sans">

      {/* ── Section Header ── */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
        <h2 className="text-xl font-bold text-[#1E293B]">Scan Usage & Analytics</h2>
        <p className="text-[#64748B] text-sm mt-0.5">Track where and how your Health QR ID is being used.</p>
      </motion.div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Scan Anywhere Card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37,99,235,0.09)" }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col gap-6 transition-shadow duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#1E293B] font-bold text-lg">Scan Anywhere, Anytime</h3>
              <p className="text-[#64748B] text-xs mt-0.5">Accepted across all healthcare touchpoints</p>
            </div>
            <div className="w-9 h-9 bg-blue-50 rounded-2xl flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-3">
            {accessCategories.map(({ icon: Icon, label, color, bg, border }, i) => (
              <motion.div
                key={label}
                custom={2 + i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center gap-2.5 p-4 ${bg} border ${border} rounded-2xl cursor-default transition-all duration-200`}
              >
                <div className={`w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center border ${border}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className={`text-xs font-semibold ${color}`}>{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Acceptance note */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <Activity className="w-4 h-4 text-blue-500 shrink-0" />
            <p className="text-[#64748B] text-xs">
              Your QR ID is accepted at <span className="text-blue-600 font-semibold">2,400+</span> partner facilities across India.
            </p>
          </div>
        </motion.div>

        {/* RIGHT — QR Usage Summary */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37,99,235,0.09)" }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col gap-6 transition-shadow duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#1E293B] font-bold text-lg">QR Usage Summary</h3>
              <p className="text-[#64748B] text-xs mt-0.5">Lifetime scan statistics</p>
            </div>
            <div className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, delta, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                custom={3 + i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] text-xs font-medium">{label}</span>
                  <div className={`w-7 h-7 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-emerald-600 font-medium">{delta}</p>
              </motion.div>
            ))}
          </div>

          {/* Last Scanned */}
          <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
            <p className="text-[#1E293B] font-semibold text-sm">Last Scanned</p>
            <div className="flex items-center gap-2 text-[#64748B] text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>02 Jun 2026 &nbsp;·&nbsp; 10:24 AM</span>
            </div>
            <div className="flex items-center gap-2 text-[#64748B] text-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Apollo Hospital, Raipur — Cardiology Dept.</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Scan History ── */}
      <motion.div
        custom={8}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[#1E293B] font-bold text-lg">Recent Scan History</h3>
            <p className="text-[#64748B] text-xs mt-0.5">Latest QR scan activity across facilities</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Last 30 days
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Location", "Scan Type", "Date & Time", "Purpose"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-widest pb-3 pr-4 last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scanHistory.map(({ location, type, typeColor, date, time, purpose, avatar, avatarBg }, i) => (
                <motion.tr
                  key={i}
                  custom={9 + i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  whileHover={{ backgroundColor: "#F8FAFC" }}
                  className="group transition-colors duration-150 rounded-xl"
                >
                  {/* Location */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${avatarBg} rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {avatar}
                      </div>
                      <span className="text-[#1E293B] text-sm font-semibold">{location}</span>
                    </div>
                  </td>
                  {/* Scan Type */}
                  <td className="py-3.5 pr-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeColor}`}>
                      {type}
                    </span>
                  </td>
                  {/* Date & Time */}
                  <td className="py-3.5 pr-4">
                    <p className="text-[#1E293B] text-sm font-medium">{date}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">{time}</p>
                  </td>
                  {/* Purpose */}
                  <td className="py-3.5">
                    <span className="text-[#64748B] text-sm">{purpose}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[#64748B] text-xs">Showing 5 of 148 total scans</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow hover:bg-blue-700 transition-colors"
          >
            View All Scans
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
}
