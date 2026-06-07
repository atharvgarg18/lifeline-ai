"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Stethoscope, Microscope, HeartHandshake } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    label: "Verified Hospitals",
    desc: "All hospitals are verified and quality checked.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    ringColor: "group-hover:ring-blue-200",
    glowColor: "rgba(37,99,235,0.12)",
  },
  {
    icon: Clock,
    label: "24/7 Emergency",
    desc: "Round-the-clock emergency support.",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    ringColor: "group-hover:ring-red-200",
    glowColor: "rgba(239,68,68,0.10)",
  },
  {
    icon: Stethoscope,
    label: "Expert Doctors",
    desc: "Experienced specialists available.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ringColor: "group-hover:ring-emerald-200",
    glowColor: "rgba(16,185,129,0.10)",
  },
  {
    icon: Microscope,
    label: "Advanced Facilities",
    desc: "Modern medical equipment and services.",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    ringColor: "group-hover:ring-violet-200",
    glowColor: "rgba(139,92,246,0.10)",
  },
  {
    icon: HeartHandshake,
    label: "Safe & Secure",
    desc: "Patient-first healthcare environment.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    ringColor: "group-hover:ring-amber-200",
    glowColor: "rgba(245,158,11,0.10)",
  },
];

export default function HospitalsSection3() {
  return (
    <section className="w-full mt-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5"
      >
        <h2 className="text-lg font-bold text-slate-900">
          Why Choose Our Listed Hospitals?
        </h2>
      </motion.div>

      {/* Cards row */}
      <div className="flex gap-4 flex-wrap">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -5,
                boxShadow: `0 16px 40px ${f.glowColor}`,
              }}
              className="group flex-1 min-w-[160px] bg-white border border-slate-200 rounded-3xl px-5 py-6 flex flex-col items-center text-center gap-3 cursor-default transition-all duration-300 hover:border-slate-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 340, damping: 18 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ring-transparent transition-all duration-300 ${f.iconBg} ${f.ringColor}`}
              >
                <Icon
                  size={22}
                  className={`${f.iconColor} transition-transform duration-300 group-hover:scale-110`}
                />
              </motion.div>

              {/* Text */}
              <div>
                <p className="text-sm font-bold text-slate-800 mb-1">{f.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
