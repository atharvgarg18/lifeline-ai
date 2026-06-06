"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  {
    label: "Total Appointments",
    sublabel: "All time",
    value: 12,
    icon: CalendarDays,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    ring: "ring-blue-100",
    valueColor: "text-slate-800",
  },
  {
    label: "Upcoming",
    sublabel: "Next 30 days",
    value: 5,
    icon: CalendarClock,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    ring: "ring-emerald-100",
    valueColor: "text-emerald-600",
  },
  {
    label: "Today",
    sublabel: "Appointments",
    value: 2,
    icon: CalendarCheck2,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    ring: "ring-amber-100",
    valueColor: "text-amber-600",
  },
  {
    label: "Completed",
    sublabel: "Appointments",
    value: 7,
    icon: CheckCircle2,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    ring: "ring-violet-100",
    valueColor: "text-violet-600",
  },
  {
    label: "Cancelled",
    sublabel: "Appointments",
    value: 3,
    icon: XCircle,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-400",
    ring: "ring-rose-100",
    valueColor: "text-rose-500",
  },
];

export default function AppointmentsHero() {
  return (
    <section className="w-full px-6 pt-8 pb-2 bg-[#F8FAFC]">
      {/* Heading Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <h1
            className="text-3xl font-bold tracking-tight text-[#1E293B]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Appointments
          </h1>
          <p className="mt-1 text-sm text-[#64748B] font-medium">
            Manage and track all your healthcare appointments in one place.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={1}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Book New Appointment
          </button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              custom={i + 2}
              whileHover={{ y: -4, boxShadow: "0 8px 32px 0 rgba(37,99,235,0.10)" }}
              className="relative bg-white border border-[#E2E8F0] rounded-3xl px-5 py-5 flex flex-col gap-3 cursor-default select-none transition-shadow"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ring-4 ${stat.iconBg} ${stat.ring}`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={1.8} />
              </div>

              {/* Value */}
              <div>
                <span
                  className={`text-3xl font-bold leading-none ${stat.valueColor}`}
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {stat.value}
                </span>
              </div>

              {/* Label */}
              <div className="flex flex-col -mt-1">
                <span className="text-[13px] font-semibold text-[#1E293B] leading-tight">
                  {stat.label}
                </span>
                <span className="text-[11px] text-[#94A3B8] mt-0.5">
                  {stat.sublabel}
                </span>
              </div>

              {/* Subtle corner accent */}
              <div
                className={`absolute top-3 right-3 w-2 h-2 rounded-full opacity-60 ${stat.iconBg}`}
                style={{ boxShadow: `0 0 0 3px` }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
