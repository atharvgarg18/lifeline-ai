"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Brain,
  Bone,
  Baby,
  AlertCircle,
  Stethoscope,
  Users,
  Building2,
  Activity,
  Phone,
  ChevronDown,
  CheckCircle2,
  Shield,
  Clock,
} from "lucide-react";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Data ─── */
type FilterChip = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  count: number;
};

const filterChips: FilterChip[] = [
  { label: "Cardiologist",      icon: <Heart size={14} />,       color: "#EF4444", bg: "#FEF2F2", count: 48 },
  { label: "Neurologist",       icon: <Brain size={14} />,       color: "#7C3AED", bg: "#F5F3FF", count: 32 },
  { label: "Orthopedic",        icon: <Bone size={14} />,        color: "#D97706", bg: "#FFFBEB", count: 27 },
  { label: "Pediatrician",      icon: <Baby size={14} />,        color: "#059669", bg: "#ECFDF5", count: 41 },
  { label: "Emergency Medicine", icon: <AlertCircle size={14} />, color: "#DC2626", bg: "#FFF1F2", count: 19 },
  { label: "General Physician", icon: <Stethoscope size={14} />, color: "#2563EB", bg: "#EFF6FF", count: 86 },
];

const specializations = [
  "Select Specialization",
  "Cardiologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Emergency Medicine",
  "General Physician",
  "Dermatologist",
  "Ophthalmologist",
  "Gynecologist",
];

type Stat = {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  accent: string;
};

const stats: Stat[] = [
  {
    label: "Doctors Available",
    value: "512+",
    sub: "Online & Offline",
    icon: <Users size={20} />,
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    accent: "#2563EB",
  },
  {
    label: "Hospitals Connected",
    value: "146+",
    sub: "Across your city",
    icon: <Building2 size={20} />,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    accent: "#059669",
  },
  {
    label: "Specialists Online",
    value: "86+",
    sub: "Available Now",
    icon: <Activity size={20} />,
    iconColor: "#7C3AED",
    iconBg: "#F5F3FF",
    accent: "#7C3AED",
  },
  {
    label: "Emergency Consultants",
    value: "24/7",
    sub: "Always Ready",
    icon: <Phone size={20} />,
    iconColor: "#EA580C",
    iconBg: "#FFF7ED",
    accent: "#EA580C",
  },
];

const trustBadges = [
  { icon: <CheckCircle2 size={13} />, label: "NABH Certified" },
  { icon: <Shield size={13} />, label: "Verified Doctors" },
  { icon: <Clock size={13} />, label: "24/7 Support" },
];

/* ─── Doctor Illustration SVG ─── */
function DoctorIllustration() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Glow blob */}
      <ellipse cx="160" cy="200" rx="130" ry="110" fill="#DBEAFE" opacity="0.7" />
      <ellipse cx="160" cy="210" rx="90" ry="75" fill="#BFDBFE" opacity="0.5" />

      {/* Floating card – top left */}
      <g transform="translate(14, 60)">
        <rect width="104" height="46" rx="12" fill="white" opacity="0.95" filter="url(#shadow1)" />
        <rect x="10" y="10" width="24" height="24" rx="6" fill="#EFF6FF" />
        <path d="M22 16 v8 M18 20 h8" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <rect x="42" y="14" width="50" height="6" rx="3" fill="#E2E8F0" />
        <rect x="42" y="26" width="36" height="5" rx="2.5" fill="#F1F5F9" />
      </g>

      {/* Floating card – top right */}
      <g transform="translate(206, 44)">
        <rect width="100" height="44" rx="12" fill="white" opacity="0.95" filter="url(#shadow1)" />
        <rect x="10" y="10" width="22" height="22" rx="5" fill="#ECFDF5" />
        <path d="M21 16 l3 3 l5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="13" width="50" height="6" rx="3" fill="#E2E8F0" />
        <rect x="38" y="25" width="34" height="5" rx="2.5" fill="#F1F5F9" />
      </g>

      {/* Floating pill – bottom left */}
      <g transform="translate(8, 246)">
        <rect width="118" height="36" rx="18" fill="white" opacity="0.96" filter="url(#shadow1)" />
        <circle cx="18" cy="18" r="10" fill="#EFF6FF" />
        <path d="M18 13 v10 M13 18 h10" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="34" y="12" width="68" height="6" rx="3" fill="#E2E8F0" />
        <rect x="34" y="23" width="48" height="5" rx="2.5" fill="#F1F5F9" />
      </g>

      {/* Floating pill – bottom right */}
      <g transform="translate(196, 258)">
        <rect width="112" height="34" rx="17" fill="#2563EB" opacity="0.95" />
        <circle cx="17" cy="17" r="9" fill="white" opacity="0.25" />
        <path d="M17 12 v10 M12 17 h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="32" y="11" width="66" height="6" rx="3" fill="white" opacity="0.4" />
        <rect x="32" y="22" width="44" height="5" rx="2.5" fill="white" opacity="0.25" />
      </g>

      {/* Doctor body */}
      {/* Lab coat torso */}
      <rect x="104" y="180" width="112" height="130" rx="18" fill="#F8FAFC" />
      <rect x="104" y="180" width="112" height="130" rx="18" fill="white" opacity="0.8" />
      {/* Coat lapels */}
      <path d="M160 190 L140 210 L140 290 L160 310 L180 290 L180 210 Z" fill="#EFF6FF" />
      <path d="M160 190 L140 210" stroke="#BFDBFE" strokeWidth="1.5" />
      <path d="M160 190 L180 210" stroke="#BFDBFE" strokeWidth="1.5" />
      {/* Stethoscope */}
      <path d="M148 220 Q138 238 138 252 Q138 268 154 268 Q170 268 170 252 Q170 236 160 228" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="170" cy="252" r="6" fill="#2563EB" />
      {/* ID badge */}
      <rect x="153" y="214" width="14" height="18" rx="3" fill="#DBEAFE" />
      <rect x="156" y="218" width="8" height="2" rx="1" fill="#93C5FD" />
      <rect x="156" y="222" width="6" height="2" rx="1" fill="#BFDBFE" />
      {/* Shirt */}
      <rect x="140" y="210" width="40" height="80" rx="4" fill="#E0F2FE" />
      {/* Arms */}
      <rect x="88" y="188" width="24" height="80" rx="12" fill="white" />
      <rect x="88" y="188" width="24" height="80" rx="12" fill="#F1F5F9" />
      <rect x="208" y="188" width="24" height="80" rx="12" fill="white" />
      <rect x="208" y="188" width="24" height="80" rx="12" fill="#F1F5F9" />

      {/* Neck */}
      <rect x="148" y="155" width="24" height="32" rx="10" fill="#FDDCB5" />

      {/* Head */}
      <ellipse cx="160" cy="148" rx="36" ry="38" fill="#FDDCB5" />

      {/* Hair */}
      <path d="M124 148 Q124 110 160 110 Q196 110 196 148" fill="#1E293B" />
      <path d="M124 140 Q126 118 138 114" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Face */}
      {/* Eyes */}
      <ellipse cx="148" cy="148" rx="5" ry="6" fill="white" />
      <ellipse cx="172" cy="148" rx="5" ry="6" fill="white" />
      <circle cx="149" cy="149" r="3" fill="#1E293B" />
      <circle cx="173" cy="149" r="3" fill="#1E293B" />
      <circle cx="150" cy="147" r="1" fill="white" />
      <circle cx="174" cy="147" r="1" fill="white" />
      {/* Eyebrows */}
      <path d="M143 140 Q148 137 154 140" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M167 140 Q172 137 178 140" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M158 156 Q160 162 162 156" stroke="#F5B895" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M151 166 Q160 173 169 166" stroke="#E8967A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Clipboard */}
      <rect x="94" y="248" width="30" height="38" rx="5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="97" y="254" width="24" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="97" y="260" width="18" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="97" y="266" width="22" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="97" y="272" width="16" height="3" rx="1.5" fill="#BFDBFE" />

      <defs>
        <filter id="shadow1" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Main Component ─── */
export default function FindDoctorHero() {
  const [doctorQuery, setDoctorQuery] = useState("");
  const [hospitalQuery, setHospitalQuery] = useState("");
  const [specialization, setSpecialization] = useState("Select Specialization");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showSpecDropdown, setShowSpecDropdown] = useState(false);

  return (
    <section className="w-full bg-[#F8FAFC] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ══════════════════════════════
            TOP AREA — Title + Illustration
        ══════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left — Title block */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="show"
            className="flex-1 min-w-0"
          >
            {/* Trust badges */}
            <motion.div variants={childFadeUp} className="flex flex-wrap gap-2 mb-5">
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-medium shadow-sm"
                >
                  <span className="text-[#2563EB]">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </motion.div>

            <motion.h1
              variants={childFadeUp}
              className="text-[2.4rem] leading-[1.15] font-bold text-[#1E293B] mb-3"
            >
              Find Healthcare{" "}
              <span className="text-[#2563EB]">Specialists</span>
            </motion.h1>

            <motion.p
              variants={childFadeUp}
              className="text-[#64748B] text-base max-w-md leading-relaxed"
            >
              Discover the best doctors, specialists and hospitals near you.
              Connect instantly with verified healthcare professionals.
            </motion.p>
          </motion.div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full lg:w-[300px] xl:w-[320px] shrink-0 relative"
          >
            {/* Blue glow background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#EFF6FF] opacity-80" />
            <div className="relative h-[240px] lg:h-[280px]">
              <DoctorIllustration />
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════
            SEARCH PANEL
        ══════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5"
        >
          {/* Search fields row */}
          <div className="flex flex-col md:flex-row gap-3">

            {/* Doctor Name */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5 pl-1">
                Search Doctor Name
              </label>
              <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-xl px-3 py-2.5 bg-[#F8FAFC] focus-within:border-[#2563EB] focus-within:bg-white transition-all">
                <Search size={15} className="text-[#94A3B8] shrink-0" />
                <input
                  type="text"
                  value={doctorQuery}
                  onChange={(e) => setDoctorQuery(e.target.value)}
                  placeholder="e.g. Dr. John Doe"
                  className="flex-1 bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-[#E2E8F0] self-stretch mt-6" />

            {/* Specialization dropdown */}
            <div className="flex-1 min-w-0 relative">
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5 pl-1">
                Specialization
              </label>
              <button
                onClick={() => setShowSpecDropdown(!showSpecDropdown)}
                className="w-full flex items-center justify-between gap-2 border border-[#E2E8F0] rounded-xl px-3 py-2.5 bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-white transition-all text-sm text-left"
              >
                <span className={specialization === "Select Specialization" ? "text-[#94A3B8]" : "text-[#1E293B]"}>
                  {specialization}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-[#94A3B8] shrink-0 transition-transform ${showSpecDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showSpecDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 overflow-hidden max-h-52 overflow-y-auto"
                >
                  {specializations.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSpecialization(s); setShowSpecDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors border-b border-[#F1F5F9] last:border-0 ${
                        s === specialization ? "text-[#2563EB] bg-[#EFF6FF] font-medium" : "text-[#1E293B]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-[#E2E8F0] self-stretch mt-6" />

            {/* Hospital */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5 pl-1">
                Hospital (Optional)
              </label>
              <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-xl px-3 py-2.5 bg-[#F8FAFC] focus-within:border-[#2563EB] focus-within:bg-white transition-all">
                <Search size={15} className="text-[#94A3B8] shrink-0" />
                <input
                  type="text"
                  value={hospitalQuery}
                  onChange={(e) => setHospitalQuery(e.target.value)}
                  placeholder="Search Hospital"
                  className="flex-1 bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200 whitespace-nowrap"
              >
                <Search size={15} />
                Search
              </motion.button>
            </div>
          </div>

          {/* ── Quick Filters ── */}
          <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
              Quick Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {/* All chip */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter("All")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  activeFilter === "All"
                    ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm shadow-blue-100"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]"
                }`}
              >
                All
              </motion.button>

              {filterChips.map((chip) => {
                const active = activeFilter === chip.label;
                return (
                  <motion.button
                    key={chip.label}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveFilter(chip.label)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all`}
                    style={
                      active
                        ? { background: chip.bg, borderColor: chip.color, color: chip.color }
                        : { background: "#fff", borderColor: "#E2E8F0", color: "#64748B" }
                    }
                  >
                    <span style={{ color: active ? chip.color : "#94A3B8" }}>{chip.icon}</span>
                    {chip.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════
            STATISTICS CARDS
        ══════════════════════════════ */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={childFadeUp}
              custom={i * 0.06}
              whileHover={{ y: -4, transition: { duration: 0.22 } }}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-5 hover:shadow-lg transition-all duration-200 cursor-default"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: stat.iconBg }}
              >
                <span style={{ color: stat.iconColor }}>{stat.icon}</span>
              </div>

              {/* Number */}
              <p className="text-[1.9rem] font-bold leading-none mb-1" style={{ color: stat.accent }}>
                {stat.value}
              </p>

              {/* Label */}
              <p className="text-sm font-semibold text-[#1E293B] mb-0.5">{stat.label}</p>

              {/* Supporting text */}
              <p className="text-xs text-[#94A3B8]">{stat.sub}</p>

              {/* Bottom accent bar */}
              <div className="mt-4 h-1 rounded-full" style={{ background: stat.iconBg }}>
                <div className="h-1 rounded-full w-3/5" style={{ background: stat.accent, opacity: 0.5 }} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
