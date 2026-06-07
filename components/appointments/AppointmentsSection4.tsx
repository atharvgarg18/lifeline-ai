"use client";

import { motion } from "framer-motion";
import {
  Star,
  BadgeCheck,
  ShieldCheck,
  CalendarCheck,
  Zap,
  HeartPulse,
  User,
  IndianRupee,
  Clock,
  ChevronRight,
} from "lucide-react";

/* ─── Variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 32 },
  show: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.52, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Data ───────────────────────────────────────────── */
interface Doctor {
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
  fee: number;
  initials: string;
  gradient: string;
  accentColor: string;
  accentBg: string;
  available: boolean;
}

const doctors: Doctor[] = [
  {
    name: "Dr. Vivek Singh",
    specialization: "Cardiologist",
    experience: "10+ Yrs Exp.",
    rating: 4.7,
    reviews: 984,
    fee: 900,
    initials: "VS",
    gradient: "from-blue-400 to-blue-600",
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    available: true,
  },
  {
    name: "Dr. Anjali Tiwari",
    specialization: "Gynecologist",
    experience: "12+ Yrs Exp.",
    rating: 4.8,
    reviews: 1132,
    fee: 750,
    initials: "AT",
    gradient: "from-violet-400 to-purple-600",
    accentColor: "text-violet-600",
    accentBg: "bg-violet-50",
    available: true,
  },
  {
    name: "Dr. Rohit Verma",
    specialization: "General Physician",
    experience: "8+ Yrs Exp.",
    rating: 4.6,
    reviews: 762,
    fee: 500,
    initials: "RV",
    gradient: "from-emerald-400 to-teal-500",
    accentColor: "text-emerald-600",
    accentBg: "bg-emerald-50",
    available: false,
  },
  {
    name: "Dr. Meera Joshi",
    specialization: "Endocrinologist",
    experience: "9+ Yrs Exp.",
    rating: 4.7,
    reviews: 638,
    fee: 850,
    initials: "MJ",
    gradient: "from-amber-400 to-orange-500",
    accentColor: "text-amber-600",
    accentBg: "bg-amber-50",
    available: true,
  },
  {
    name: "Dr. Karan Malhotra",
    specialization: "Orthopedic",
    experience: "11+ Yrs Exp.",
    rating: 4.8,
    reviews: 1045,
    fee: 1000,
    initials: "KM",
    gradient: "from-rose-400 to-pink-600",
    accentColor: "text-rose-600",
    accentBg: "bg-rose-50",
    available: true,
  },
  {
    name: "Dr. Sunita Rao",
    specialization: "Dermatologist",
    experience: "7+ Yrs Exp.",
    rating: 4.5,
    reviews: 519,
    fee: 700,
    initials: "SR",
    gradient: "from-cyan-400 to-sky-600",
    accentColor: "text-sky-600",
    accentBg: "bg-sky-50",
    available: false,
  },
];

const trustItems = [
  {
    icon: BadgeCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-[#2563EB]",
    ringColor: "ring-blue-100",
    title: "Verified Doctors",
    desc: "Every doctor is credentialed, licensed, and background-verified for your peace of mind.",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    ringColor: "ring-emerald-100",
    title: "Secure Booking",
    desc: "End-to-end encrypted appointment data and payment processing you can trust.",
  },
  {
    icon: Zap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    ringColor: "ring-amber-100",
    title: "Instant Confirmation",
    desc: "Receive real-time appointment confirmations directly to your device the moment you book.",
  },
  {
    icon: HeartPulse,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    ringColor: "ring-rose-100",
    title: "Emergency Support",
    desc: "Round-the-clock SOS and emergency medical assistance available across all our partner hospitals.",
  },
];

/* ─── Star Rating ────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"
          }`}
        />
      ))}
      <span className="text-[11px] font-bold text-amber-500 ml-1">{rating}</span>
    </div>
  );
}

/* ─── Doctor Card ────────────────────────────────────── */
function DoctorCard({ doc, index }: { doc: Doctor; index: number }) {
  return (
    <motion.div
      variants={fadeInLeft}
      initial="hidden"
      animate="show"
      custom={index}
      whileHover={{ y: -6, boxShadow: "0 16px 48px 0 rgba(37,99,235,0.11)" }}
      className="relative bg-white border border-[#E2E8F0] rounded-3xl p-5 flex flex-col gap-4 min-w-[200px] flex-shrink-0 transition-shadow cursor-default"
    >
      {/* Availability dot */}
      <span
        className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
          doc.available ? "bg-emerald-400" : "bg-slate-300"
        }`}
      />

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doc.gradient} flex items-center justify-center shadow-md`}
        >
          <span className="text-xl font-bold text-white tracking-tight">{doc.initials}</span>
        </div>
        <div className="text-center">
          <h4
            className="text-sm font-bold text-[#1E293B] leading-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {doc.name}
          </h4>
          <p className={`text-xs font-semibold mt-0.5 ${doc.accentColor}`}>
            {doc.specialization}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
            <Clock className="w-3 h-3" strokeWidth={1.8} />
            {doc.experience}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.accentBg} ${doc.accentColor}`}>
            {doc.reviews.toLocaleString()} reviews
          </span>
        </div>

        <Stars rating={doc.rating} />

        <div className="flex items-center gap-1 mt-0.5">
          <IndianRupee className="w-3 h-3 text-[#64748B]" strokeWidth={1.8} />
          <span className="text-xs font-bold text-[#1E293B]">{doc.fee}</span>
          <span className="text-[10px] text-[#94A3B8]">per visit</span>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="w-full py-2.5 rounded-2xl text-xs font-bold text-white shadow-sm transition-all"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }}
      >
        Book Now
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────── */
export default function AppointmentsSection4() {
  return (
    <section className="w-full bg-[#F8FAFC] pt-4 pb-8">

      {/* ══ Doctor Recommendations ══ */}
      <div className="px-6 mb-8">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="flex items-end justify-between mb-5"
        >
          <div>
            <h2
              className="text-xl font-bold text-[#1E293B]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              You May Also Like
            </h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              Recommended doctors based on your appointment history.
            </p>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] hover:underline underline-offset-2 transition-all"
          >
            View All
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* Scrollable Cards Row */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {doctors.map((doc, i) => (
            <DoctorCard key={doc.name} doc={doc} index={i + 1} />
          ))}
        </div>
      </div>

      {/* ══ Trust Banner ══ */}
      <div className="px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-50 opacity-60 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-50 opacity-40 blur-3xl" />
            {/* Subtle dot grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#2563EB" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          {/* Header */}
          <div className="relative px-8 pt-7 pb-5 text-center border-b border-[#F1F5F9]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-3">
              <CalendarCheck className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={2} />
              <span className="text-xs font-bold text-[#2563EB] tracking-wide uppercase">
                Trusted by 50,000+ Patients
              </span>
            </div>
            <h3
              className="text-xl font-bold text-[#1E293B]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Your Health, Our Commitment
            </h3>
            <p className="text-sm text-[#64748B] mt-1 max-w-md mx-auto">
              LifeLine AI is built on a foundation of trust, safety, and world-class medical care.
            </p>
          </div>

          {/* Trust Grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#F1F5F9] px-0">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={i + 2}
                  whileHover={{ backgroundColor: "#F8FAFC" }}
                  className="flex flex-col items-center text-center gap-3 px-7 py-7 transition-colors cursor-default"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center ring-4 ${item.ringColor} flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4
                      className="text-sm font-bold text-[#1E293B] mb-1"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-[#64748B] leading-relaxed max-w-[180px] mx-auto">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom strip */}
          <div className="relative flex items-center justify-center gap-6 px-8 py-4 bg-gradient-to-r from-[#F8FAFC] via-white to-[#F8FAFC] border-t border-[#F1F5F9]">
            {[
              { value: "500+", label: "Specialist Doctors" },
              { value: "50K+", label: "Happy Patients" },
              { value: "99.8%", label: "Booking Success" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i + 6}
                className="text-center"
              >
                <p
                  className="text-lg font-bold text-[#2563EB]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
