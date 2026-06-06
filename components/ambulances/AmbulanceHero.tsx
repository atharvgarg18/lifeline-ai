"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Shield,
  UserCheck,
  HeartPulse,
  ArrowRight,
  Zap,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const stats = [
  {
    icon: Truck,
    value: "58",
    label: "Ambulance Available",
    sub: "Ready to respond",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    dot: "bg-emerald-500",
  },
  {
    icon: Clock,
    value: "8.4",
    label: "Average ETA",
    sub: "Minutes in your area",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    unit: "min",
  },
  {
    icon: Users,
    value: "120+",
    label: "Active Drivers",
    sub: "Certified paramedics",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: AlertCircle,
    value: "340",
    label: "Emergency Requests",
    sub: "Today across the city",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

const highlights = [
  {
    icon: Zap,
    label: "24/7 Service",
    sub: "Round the clock support",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    label: "NABH Certified",
    sub: "Certified Ambulance",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: UserCheck,
    label: "Trained Paramedics",
    sub: "Verified medical staff",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: HeartPulse,
    label: "Fully Equipped",
    sub: "Advanced life support",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export default function AmbulanceHero() {
  return (
    <section className="w-full space-y-6">
      {/* Hero Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 md:p-10 shadow-lg border border-blue-500/30"
      >
        {/* Background decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -right-8 h-72 w-72 rounded-full bg-blue-500/20" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Text */}
          <div className="space-y-3 max-w-xl">
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm border border-white/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">
                Live — 58 units available now
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              custom={2}
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              Emergency Ambulance
              <br />
              <span className="text-blue-200">Services</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={3}
              className="text-blue-100 text-base leading-relaxed max-w-md"
            >
              Book and track Ambulance in real-time for emergency and
              non-emergency medical transport. We're here to reach you in time.
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            variants={fadeInUp}
            custom={4}
            className="flex flex-col gap-3 md:items-end"
          >
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-bold text-blue-700 shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/40 transition-all duration-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50">
                <Truck className="h-4 w-4 text-red-600" />
              </span>
              Request Ambulance
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
            <p className="text-blue-200/80 text-xs">
              Avg. dispatch time:{" "}
              <span className="font-semibold text-white">8.4 min</span>
            </p>
          </motion.div>
        </div>

        {/* Bottom trust row */}
        <motion.div
          variants={fadeInUp}
          custom={5}
          className="relative mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6"
        >
          {[
            "120+ Ambulance city-wide",
            "NABH Certified",
            "4.8 ★ avg rating",
            "2.4k+ reviews",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-white/80 font-medium">{item}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={i + 2}
            whileHover={{ translateY: -4, boxShadow: "0 12px 32px -4px rgba(0,0,0,0.10)" }}
            className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-3 cursor-default transition-shadow duration-200"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${s.bg} border ${s.border}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-slate-800 leading-none">
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-sm font-semibold text-slate-400 mb-0.5">
                    {s.unit}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {s.label}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                {s.dot && (
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                )}
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Service Highlights */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={6}
        className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={i + 7}
              whileHover={{ translateY: -2 }}
              className="flex items-center gap-3 rounded-2xl p-3 hover:bg-slate-50 transition-colors duration-150 cursor-default"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${h.bg}`}>
                <h.icon className={`h-5 w-5 ${h.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{h.label}</p>
                <p className="text-xs text-slate-400">{h.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
