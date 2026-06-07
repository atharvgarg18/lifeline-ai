"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Calendar,
  ChevronRight,
  Building2,
  AlertTriangle,
  Languages,
  Stethoscope,
  Heart,
  X,
  CheckCircle2,
  Activity,
  Siren,
  FileText,
  ChevronDown,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const cardHover = {
  rest: {},
  hover: { y: -4, transition: { duration: 0.22, ease: "easeOut" } },
};

/* ─── Data ─── */
const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const hospitals = [
  { name: "City Heart Hospital",  distance: "1.8 km", type: "24/7 Emergency", color: "#2563EB", bg: "#EFF6FF",  avail: true  },
  { name: "Sunrise Hospital",     distance: "2.3 km", type: "24/7 Emergency", color: "#059669", bg: "#ECFDF5",  avail: true  },
  { name: "Metro Medical Center", distance: "3.1 km", type: "24/7 Emergency", color: "#7C3AED", bg: "#F5F3FF",  avail: false },
];

const reviews = [
  { stars: 5, pct: 85, count: 272 },
  { stars: 4, pct: 10, count: 32 },
  { stars: 3, pct: 3,  count: 10 },
  { stars: 2, pct: 1,  count: 3  },
  { stars: 1, pct: 1,  count: 3  },
];

const starColors = ["#F59E0B","#F59E0B","#64748B","#64748B","#EF4444"];

/* ─── Sub-components ─── */

/** Doctor Avatar — illustrated SVG */
function DoctorAvatar() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="60" cy="60" r="60" fill="#EFF6FF" />
      <ellipse cx="60" cy="54" rx="22" ry="24" fill="#FDDCB5" />
      <path d="M38 54 Q38 30 60 30 Q82 30 82 54" fill="#1E293B" />
      <rect x="50" y="72" width="20" height="22" rx="8" fill="#FDDCB5" />
      <rect x="32" y="78" width="16" height="46" rx="8" fill="#F1F5F9" />
      <rect x="72" y="78" width="16" height="46" rx="8" fill="#F1F5F9" />
      <rect x="36" y="94" width="48" height="62" rx="12" fill="white" />
      <path d="M60 80 L50 94 L50 150 L60 155 L70 150 L70 94 Z" fill="#EFF6FF" />
      <path d="M50 96 Q40 110 40 124 Q40 138 52 138 Q66 138 66 124 Q66 110 58 104" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <circle cx="66" cy="124" r="5" fill="#2563EB" />
      <ellipse cx="48" cy="46" rx="4" ry="4.5" fill="white" />
      <ellipse cx="72" cy="46" rx="4" ry="4.5" fill="white" />
      <circle cx="49" cy="47" r="2.5" fill="#1E293B" />
      <circle cx="73" cy="47" r="2.5" fill="#1E293B" />
      <circle cx="50" cy="45.5" r="0.8" fill="white" />
      <circle cx="74" cy="45.5" r="0.8" fill="white" />
      <path d="M44 38 Q49 35 54 38" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <path d="M66 38 Q71 35 76 38" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <path d="M52 60 Q60 67 68 60" stroke="#E8967A" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <path d="M58 54 Q60 58 62 54" stroke="#F5B895" stroke-width="1.4" stroke-linecap="round" fill="none" />
    </svg>
  );
}

/** Star row */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E2E8F0] fill-[#E2E8F0]"} />
      ))}
    </div>
  );
}

/* ─── Rating Bar ─── */
function RatingBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

/* ─── Main Section ─── */
export default function DoctorProfileBooking() {
  const [selectedDate, setSelectedDate] = useState("2026-06-02");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [reason, setReason] = useState("");
  const [showSlotDropdown, setShowSlotDropdown] = useState(false);
  const [booked, setBooked] = useState(false);

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="w-full bg-[#F8FAFC] px-6 py-8"
    >
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ══════════════════════════════
            TOP ROW — 4 columns
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* ── Col 1: Doctor Profile ── */}
          <motion.div
            variants={fadeUp}
            custom={0}
            whileHover="hover"
            initial="rest"
            animate="rest"
            className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm flex flex-col items-center text-center gap-4"
          >
            {/* Avatar */}
            <div className="relative w-24 h-24">
              <DoctorAvatar />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#10B981] border-2 border-white" />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <h3 className="text-base font-bold text-[#1E293B]">Dr. John Doe</h3>
                <BadgeCheck size={15} className="text-[#2563EB] fill-[#DBEAFE]" />
              </div>
              <p className="text-xs text-[#64748B] font-medium mb-1">Cardiologist</p>
              <div className="flex items-center justify-center gap-1">
                <Stars rating={4.8} size={12} />
                <span className="text-xs font-bold text-[#1E293B]">4.8</span>
                <span className="text-xs text-[#94A3B8]">(320)</span>
              </div>
            </div>

            {/* Detail pills */}
            <div className="w-full space-y-2">
              {[
                { icon: <Clock size={12} />, label: "12 Yrs Experience" },
                { icon: <Building2 size={12} />, label: "City Heart Hospital" },
                { icon: <Languages size={12} />, label: "English, Hindi" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-[#F8FAFC] rounded-xl px-3 py-2 text-xs text-[#475569] font-medium">
                  <span className="text-[#2563EB]">{icon}</span>
                  {label}
                </div>
              ))}
            </div>

            {/* Fee */}
            <div className="w-full flex items-center justify-between bg-[#EFF6FF] rounded-2xl px-4 py-3">
              <span className="text-xs text-[#64748B]">Consultation Fee</span>
              <span className="text-base font-bold text-[#2563EB]">₹800</span>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-2xl transition-colors"
              >
                <Calendar size={13} />
                Book Appointment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] text-[#64748B] text-xs font-semibold py-2.5 rounded-2xl transition-colors"
              >
                <X size={13} />
                Close
              </motion.button>
            </div>
          </motion.div>

          {/* ── Col 2: Appointment Booking ── */}
          <motion.div
            variants={fadeUp}
            custom={0.08}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Calendar size={15} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1E293B]">Book Appointment</p>
                <p className="text-xs text-[#94A3B8]">Dr. John Doe</p>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#1E293B] bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
              />
            </div>

            {/* Time Slot */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Select Time Slot
              </label>
              <button
                onClick={() => setShowSlotDropdown(!showSlotDropdown)}
                className="w-full flex items-center justify-between border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#1E293B] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-white transition-all"
              >
                {selectedSlot}
                <ChevronDown size={14} className={`text-[#94A3B8] transition-transform ${showSlotDropdown ? "rotate-180" : ""}`} />
              </button>
              {showSlotDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden max-h-44 overflow-y-auto"
                >
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      onClick={() => { setSelectedSlot(t); setShowSlotDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm border-b border-[#F1F5F9] last:border-0 transition-colors ${
                        t === selectedSlot ? "bg-[#EFF6FF] text-[#2563EB] font-semibold" : "text-[#475569] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
                Reason for Visit
              </label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Regular Checkup"
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#1E293B] placeholder:text-[#94A3B8] bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
              />
            </div>

            <div className="mt-auto pt-2">
              {booked ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl py-3 text-[#059669] text-sm font-bold"
                >
                  <CheckCircle2 size={16} />
                  Appointment Confirmed!
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setBooked(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold py-3 rounded-2xl transition-colors shadow-sm shadow-blue-100"
                >
                  <Activity size={14} />
                  Confirm Booking
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* ── Col 3: Nearby Hospitals ── */}
          <motion.div
            variants={fadeUp}
            custom={0.16}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                  <Building2 size={15} className="text-[#059669]" />
                </div>
                <p className="text-sm font-bold text-[#1E293B]">Nearby Hospitals</p>
              </div>
              <button className="text-xs text-[#2563EB] font-semibold hover:underline flex items-center gap-0.5">
                View All <ChevronRight size={12} />
              </button>
            </div>

            {/* Hospital list */}
            <div className="space-y-3">
              {hospitals.map((h, i) => (
                <motion.div
                  key={h.name}
                  whileHover={{ x: 3, transition: { duration: 0.18 } }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-[#E2E8F0] hover:bg-white transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: h.bg }}>
                    <Building2 size={15} style={{ color: h.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E293B] truncate">{h.name}</p>
                    <p className="text-[10px] text-[#94A3B8]">{h.type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-[#1E293B]">{h.distance}</p>
                    <span className={`text-[10px] font-semibold ${h.avail ? "text-[#059669]" : "text-[#64748B]"}`}>
                      {h.avail ? "● Open" : "● Closed"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-auto rounded-2xl overflow-hidden border border-[#E2E8F0] h-24 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center gap-2 text-[#2563EB]">
              <MapPin size={16} />
              <span className="text-xs font-semibold">View on Map</span>
            </div>
          </motion.div>

          {/* ── Col 4: Emergency Contact ── */}
          <motion.div
            variants={fadeUp}
            custom={0.24}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF1F2] flex items-center justify-center">
                <AlertTriangle size={15} className="text-[#DC2626]" />
              </div>
              <div className="flex items-center justify-between flex-1">
                <p className="text-sm font-bold text-[#1E293B]">Emergency Contact</p>
                <button className="text-xs text-[#2563EB] font-semibold hover:underline flex items-center gap-0.5">
                  View All <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* Contacts */}
            <div className="space-y-3">
              {/* Ambulance */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3]">
                <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
                  <Phone size={15} className="text-[#DC2626]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#1E293B]">Ambulance Hotline</p>
                  <p className="text-lg font-black text-[#DC2626] leading-tight">108</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center"
                >
                  <Phone size={13} className="text-white" />
                </motion.button>
              </div>

              {/* Emergency SOS */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
                  <Siren size={15} className="text-[#D97706]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#1E293B]">Emergency SOS</p>
                  <p className="text-[10px] text-[#94A3B8]">One tap to get help</p>
                </div>
              </div>
            </div>

            {/* SOS Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-black py-3.5 rounded-2xl transition-colors mt-auto"
              style={{ boxShadow: "0 4px 16px rgba(220,38,38,.25)" }}
            >
              <Siren size={16} />
              Tap to SOS
            </motion.button>

            {/* Disclaimer */}
            <p className="text-[10px] text-[#94A3B8] text-center leading-relaxed">
              Emergency services will be notified with your current location. Use only in genuine emergencies.
            </p>
          </motion.div>
        </div>

        {/* ══════════════════════════════
            BOTTOM — Patient Reviews
        ══════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          custom={0.32}
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            {/* Left — Overall score */}
            <div className="flex flex-col items-center justify-center gap-2 shrink-0 sm:w-40">
              <div className="text-5xl font-black text-[#1E293B]">4.8</div>
              <Stars rating={4.8} size={18} />
              <p className="text-sm text-[#64748B] font-medium">320 Reviews</p>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold">
                <Sparkles size={11} />
                Top Rated
              </span>
            </div>

            {/* Vertical divider */}
            <div className="hidden sm:block w-px bg-[#F1F5F9] self-stretch" />

            {/* Right — Bars */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1E293B]">Patient Reviews</h3>
                <button className="text-xs text-[#2563EB] font-semibold hover:underline">
                  Write a Review
                </button>
              </div>

              {reviews.map(({ stars, pct, count }) => {
                const color = stars >= 4 ? "#F59E0B" : stars === 3 ? "#64748B" : "#EF4444";
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-14 shrink-0">
                      <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-xs font-semibold text-[#475569]">{stars}</span>
                    </div>
                    <RatingBar pct={pct} color={color} />
                    <span className="text-xs text-[#94A3B8] w-8 text-right shrink-0">{pct}%</span>
                    <span className="text-xs text-[#94A3B8] w-8 text-right shrink-0">({count})</span>
                  </div>
                );
              })}
            </div>

            {/* Vertical divider */}
            <div className="hidden sm:block w-px bg-[#F1F5F9] self-stretch" />

            {/* Right summary pills */}
            <div className="shrink-0 space-y-2 sm:w-40">
              {[
                { icon: <Heart size={13} />,       label: "Bedside Manner",  score: "4.9", color: "#EF4444", bg: "#FFF1F2" },
                { icon: <Stethoscope size={13} />, label: "Diagnosis",       score: "4.8", color: "#2563EB", bg: "#EFF6FF" },
                { icon: <Clock size={13} />,       label: "Punctuality",     score: "4.7", color: "#059669", bg: "#ECFDF5" },
                { icon: <FileText size={13} />,    label: "Communication",   score: "4.9", color: "#7C3AED", bg: "#F5F3FF" },
              ].map(({ icon, label, score, color, bg }) => (
                <div key={label} className="flex items-center gap-2 p-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <span style={{ color }}>{icon}</span>
                  </div>
                  <span className="text-xs text-[#475569] flex-1">{label}</span>
                  <span className="text-xs font-bold text-[#1E293B]">{score}</span>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
