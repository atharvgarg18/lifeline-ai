"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Building2,
  Truck,
  UserCheck,
  CreditCard,
  Pill,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquarePlus,
} from "lucide-react";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const child = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Data ─── */
const stats = [
  {
    label: "Total Complaints",
    value: "12",
    sub: "All time complaints",
    icon: <FileText size={20} />,
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
    accent: "#2563EB",
    barPct: 100,
  },
  {
    label: "In Progress",
    value: "5",
    sub: "Under review",
    icon: <Clock size={20} />,
    iconColor: "#D97706",
    iconBg: "#FFFBEB",
    accent: "#F59E0B",
    barPct: 42,
  },
  {
    label: "Resolved",
    value: "6",
    sub: "Successfully resolved",
    icon: <CheckCircle2 size={20} />,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    accent: "#10B981",
    barPct: 50,
  },
  {
    label: "Closed",
    value: "1",
    sub: "Closed complaints",
    icon: <XCircle size={20} />,
    iconColor: "#DC2626",
    iconBg: "#FFF1F2",
    accent: "#EF4444",
    barPct: 8,
  },
];

const categories = [
  {
    icon: <Building2 size={20} />,
    label: "Hospital Services",
    desc: "Issues related to hospital facilities, staff, treatment, etc.",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  {
    icon: <Truck size={20} />,
    label: "Ambulance Services",
    desc: "Issues related to ambulance, response time, behavior, etc.",
    color: "#DC2626",
    bg: "#FFF1F2",
    border: "#FECDD3",
  },
  {
    icon: <UserCheck size={20} />,
    label: "Doctor & Staff",
    desc: "Issues related to doctor consultation, behavior, staff, etc.",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    icon: <CreditCard size={20} />,
    label: "Billing & Payments",
    desc: "Issues related to billing, payments, insurance, overcharge, etc.",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  {
    icon: <Pill size={20} />,
    label: "Pharmacy",
    desc: "Issues related to medicines, delivery, refunds, etc.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  {
    icon: <MoreHorizontal size={20} />,
    label: "Others",
    desc: "Other general complaints and feedback.",
    color: "#64748B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  },
];

/* ─── Animated Progress Bar ─── */
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mt-3">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

/* ─── Main Component ─── */
export default function ComplaintsHero() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#F8FAFC] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ══════════════════════════════
            HEADER ROW
        ══════════════════════════════ */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <motion.div variants={child}>
            <h1 className="text-[2rem] font-bold text-[#1E293B] mb-1.5">Complaints</h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              We're here to listen and resolve your healthcare issues.
            </p>
          </motion.div>

          <motion.div variants={child}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-5 py-3 rounded-2xl transition-colors shadow-md shadow-blue-100 whitespace-nowrap"
            >
              <Plus size={16} />
              Raise a Complaint
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════
            STATS CARDS
        ══════════════════════════════ */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={child}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm hover:shadow-lg transition-shadow cursor-default"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: stat.iconBg }}
              >
                <span style={{ color: stat.iconColor }}>{stat.icon}</span>
              </div>

              {/* Number */}
              <p className="text-[2rem] font-black leading-none mb-1" style={{ color: stat.accent }}>
                {stat.value}
              </p>

              {/* Label */}
              <p className="text-sm font-semibold text-[#1E293B] mb-0.5">{stat.label}</p>
              <p className="text-xs text-[#94A3B8]">{stat.sub}</p>

              {/* Progress bar */}
              <MiniBar pct={stat.barPct} color={stat.accent} />
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════════════════════════
            TWO-COLUMN: RAISE FORM HINT + CATEGORIES
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left — Raise a Complaint prompt card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                  <MessageSquarePlus size={20} className="text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1E293B]">Raise a New Complaint</h2>
                  <p className="text-xs text-[#94A3B8]">Tell us about your issue and we'll get it resolved.</p>
                </div>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                We take every complaint seriously. Our support team reviews all submissions within{" "}
                <span className="font-semibold text-[#2563EB]">24 hours</span> and works to resolve your issue as quickly as possible.
              </p>
            </div>

            {/* Quick info strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Clock size={14} />, label: "24hr Response", color: "#D97706", bg: "#FFFBEB" },
                { icon: <CheckCircle2 size={14} />, label: "Tracked Status", color: "#059669", bg: "#ECFDF5" },
                { icon: <AlertCircle size={14} />, label: "Priority Support", color: "#2563EB", bg: "#EFF6FF" },
              ].map(({ icon, label, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] text-center"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <span style={{ color }}>{icon}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#475569] leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold py-3.5 rounded-2xl transition-colors shadow-sm shadow-blue-100"
            >
              <Plus size={15} />
              Raise a Complaint
              <ChevronRight size={14} />
            </motion.button>
          </motion.div>

          {/* Right — Complaint Categories */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm"
          >
            <div className="mb-4">
              <h2 className="text-base font-bold text-[#1E293B] mb-0.5">Complaint Categories</h2>
              <p className="text-xs text-[#94A3B8]">Select a category that best matches your issue.</p>
            </div>

            <div className="space-y-2">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.label}
                  onHoverStart={() => setHoveredCategory(i)}
                  onHoverEnd={() => setHoveredCategory(null)}
                  whileHover={{ x: 4, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left"
                  style={
                    hoveredCategory === i
                      ? { borderColor: cat.border, background: cat.bg }
                      : { borderColor: "#F1F5F9", background: "#F8FAFC" }
                  }
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                    style={
                      hoveredCategory === i
                        ? { background: cat.color, color: "#fff" }
                        : { background: cat.bg, color: cat.color }
                    }
                  >
                    {cat.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E293B] mb-0.5">{cat.label}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{cat.desc}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={15}
                    className="shrink-0 transition-colors"
                    style={{ color: hoveredCategory === i ? cat.color : "#CBD5E1" }}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
