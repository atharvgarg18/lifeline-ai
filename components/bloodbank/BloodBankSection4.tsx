"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  FlaskConical,
  HeartPulse,
  Users,
  CheckCircle2,
  UserPlus,
  Droplets,
  Sparkles,
} from "lucide-react";

/* ─── Variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.44, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Data ───────────────────────────────────────────── */
const whyCards = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "100% safe donation process with sterile, single-use equipment at every certified centre.",
    iconBg: "bg-blue-50",
    iconColor: "text-[#2563EB]",
    ring: "ring-blue-100",
    accent: "from-blue-50 to-white",
    border: "border-blue-100",
  },
  {
    icon: FlaskConical,
    title: "Tested & Verified",
    desc: "Every unit is rigorously screened and tested against the highest medical standards before use.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    ring: "ring-emerald-100",
    accent: "from-emerald-50 to-white",
    border: "border-emerald-100",
  },
  {
    icon: HeartPulse,
    title: "Save Lives",
    desc: "A single donation can save up to 3 lives — trauma patients, cancer patients, and newborns.",
    iconBg: "bg-red-50",
    iconColor: "text-[#EF4444]",
    ring: "ring-red-100",
    accent: "from-red-50 to-white",
    border: "border-red-100",
  },
  {
    icon: Users,
    title: "Community Impact",
    desc: "Join thousands of life-savers across Chhattisgarh building a stronger, healthier community.",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    ring: "ring-violet-100",
    accent: "from-violet-50 to-white",
    border: "border-violet-100",
  },
];

const eligibilityItems = [
  { text: "Age between 18 – 65 years" },
  { text: "Weight more than 45 kg" },
  { text: "Hemoglobin level > 12.5 g/dl" },
  { text: "Healthy & fit at the time of donation" },
  { text: "No major surgery in last 6 months" },
  { text: "Not donated in last 3 months" },
];

/* ─── Main Export ────────────────────────────────────── */
export default function BloodBankSection4() {
  return (
    <section className="w-full px-6 py-6 bg-[#F8FAFC] flex flex-col gap-6">

      {/* ══ Why Donate + Eligibility Row ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">

        {/* LEFT: Why Donate Cards */}
        <div className="flex flex-col gap-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            <h2
              className="text-lg font-bold text-[#1E293B]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Why Donate Blood?
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Every drop counts — here's why your donation matters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whyCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  custom={i + 1}
                  whileHover={{ y: -4, boxShadow: "0 10px 32px 0 rgba(37,99,235,0.09)" }}
                  className={`relative bg-gradient-to-br ${card.accent} border ${card.border} rounded-3xl p-5 flex flex-col gap-3 cursor-default transition-shadow overflow-hidden`}
                >
                  {/* Subtle watermark circle */}
                  <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full opacity-[0.07] bg-current pointer-events-none" />

                  <div
                    className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center ring-4 ${card.ring} flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3
                      className="text-sm font-bold text-[#1E293B]"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Eligibility Checklist */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 ring-4 ring-red-100 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#EF4444]" strokeWidth={1.8} />
              </div>
              <div>
                <h2
                  className="text-base font-bold text-[#1E293B]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Who Can Donate Blood?
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Check if you meet the eligibility criteria.
                </p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="px-6 py-5 flex flex-col gap-3">
            {eligibilityItems.map((item, i) => (
              <motion.div
                key={item.text}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i + 2}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 ring-2 ring-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-[#1E293B]">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Inner CTA */}
          <div className="px-6 pb-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-red-200 transition-all"
              style={{ background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)" }}
            >
              <UserPlus className="w-4 h-4" strokeWidth={2} />
              Check My Eligibility
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ══ Bottom Hero CTA Banner ══ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large soft red glow left */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-red-100 opacity-40 blur-3xl" />
          {/* Blue glow right */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-blue-100 opacity-30 blur-3xl" />
          {/* Dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bdots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#EF4444" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bdots)" />
          </svg>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">

          {/* Left: Icon + Text */}
          <div className="flex items-center gap-5">
            {/* Animated blood drop icon */}
            <div className="relative flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EF4444] to-rose-400 flex items-center justify-center shadow-lg shadow-red-200"
              >
                <Droplets className="w-8 h-8 text-white" strokeWidth={1.6} />
              </motion.div>
              {/* Ping ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-red-200 opacity-25" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-[#EF4444] ring-1 ring-red-200">
                  <Sparkles className="w-3 h-3" />
                  Be a Hero
                </span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1E293B] leading-tight"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Be A Hero.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                  }}
                >
                  Donate Blood.
                </span>
              </h2>
              <p className="text-sm text-[#64748B] mt-1.5 max-w-sm">
                One donation can save up to{" "}
                <span className="font-bold text-[#1E293B]">three lives</span>. Your generosity
                gives someone another chance to be with those they love.
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 16px 48px 0 rgba(239,68,68,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-base font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                boxShadow: "0 8px 28px 0 rgba(239,68,68,0.28)",
              }}
            >
              <UserPlus className="w-5 h-5" strokeWidth={2} />
              Register as Donor
            </motion.button>
            <p className="text-[11px] text-[#94A3B8] text-center">
              Free • Takes 30 minutes • Saves 3 lives
            </p>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="relative flex items-center justify-center gap-8 px-8 py-3.5 bg-gradient-to-r from-[#FEF2F2] via-white to-[#FEF2F2] border-t border-red-100">
          {[
            { value: "50,000+", label: "Registered Donors" },
            { value: "1,248",   label: "Units Available" },
            { value: "3 Lives", label: "Saved Per Donation" },
            { value: "24/7",    label: "Emergency Support" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i + 4}
              className="text-center"
            >
              <p
                className="text-base font-bold text-[#EF4444]"
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

    </section>
  );
}
