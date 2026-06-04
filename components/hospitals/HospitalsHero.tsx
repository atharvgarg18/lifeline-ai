"use client";

import { motion } from "framer-motion";
import {
  Heart,
  AlertTriangle,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Building2,
  Clock,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import { useState } from "react";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Dropdown Component ───────────────────────────────────────────────────────
function FilterDropdown({
  label,
  value,
  options,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:shadow-md transition-all duration-200 min-w-[160px] justify-between group"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span>}
          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-normal leading-none mb-0.5">{label}</p>
            <p className="text-slate-800 font-semibold text-sm leading-none">{selected}</p>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[180px]"
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 ${
                selected === opt ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  sub,
  iconBg,
  delay,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  iconBg: string;
  delay: number;
}) {
  return (
    <motion.div
      custom={delay}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(37,99,235,0.10)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center gap-4 flex-1 min-w-0 cursor-default"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
        <p className="text-sm font-semibold text-slate-700 leading-tight truncate">{label}</p>
        <p className="text-xs text-slate-400 leading-tight mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HospitalsHero() {
  return (
    <section className="w-full space-y-6 px-1">
      {/* ── Title Row ── */}
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-between flex-wrap gap-4"
      >
        {/* Left: Title + Subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hospitals</h1>
          <p className="text-slate-500 text-sm mt-1">
            Find and connect with the best healthcare facilities near you.
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(37,99,235,0.12)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm"
          >
            <Heart size={15} className="text-blue-500" fill="#3B82F6" />
            My Preferred Hospitals
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(239,68,68,0.18)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-red-100 transition-all duration-200 shadow-sm"
          >
            <AlertTriangle size={15} className="text-red-500" />
            Emergency Hospitals
          </motion.button>
        </div>
      </motion.div>

      {/* ── Filters Row ── */}
      <motion.div
        custom={1}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 flex-wrap"
      >
        <FilterDropdown
          label="Location"
          value="Raipur, Chhattisgarh"
          icon={<MapPin size={13} />}
          options={[
            "Raipur, Chhattisgarh",
            "Bilaspur, CG",
            "Durg, CG",
            "Bhilai, CG",
            "Korba, CG",
          ]}
        />
        <FilterDropdown
          label="Radius"
          value="10 km"
          options={["5 km", "10 km", "15 km", "25 km", "50 km"]}
        />
        <FilterDropdown
          label="Hospital Type"
          value="All Types"
          options={[
            "All Types",
            "Government Hospital",
            "Private Hospital",
            "Multi Speciality",
            "Super Speciality",
            "Clinic",
          ]}
        />
        <FilterDropdown
          label="Specialization"
          value="All Specializations"
          options={[
            "All Specializations",
            "Cardiology",
            "Neurology",
            "Orthopedics",
            "Oncology",
            "Pediatrics",
            "Gynecology",
          ]}
        />

        {/* More Filters */}
        <motion.button
          whileHover={{ scale: 1.03, borderColor: "#2563EB", color: "#2563EB" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 font-semibold text-sm px-4 py-3 rounded-2xl hover:shadow-md transition-all duration-200 ml-auto"
        >
          <SlidersHorizontal size={14} />
          More Filters
        </motion.button>
      </motion.div>

      {/* ── Statistics Cards ── */}
      <div className="flex gap-4 flex-wrap">
        <StatCard
          delay={2}
          icon={<Building2 size={22} className="text-blue-600" />}
          iconBg="bg-blue-50"
          value="42"
          label="Total Hospitals"
          sub="Near you"
        />
        <StatCard
          delay={3}
          icon={<Truck size={22} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          value="8"
          label="24x7 Hospitals"
          sub="Available now"
        />
        <StatCard
          delay={4}
          icon={<Shield size={22} className="text-violet-600" />}
          iconBg="bg-violet-50"
          value="12"
          label="Emergency Care"
          sub="Ready to help"
        />
        <StatCard
          delay={5}
          icon={
            <span className="flex items-center gap-0.5">
              <Star size={20} className="text-amber-500" fill="#F59E0B" />
            </span>
          }
          iconBg="bg-amber-50"
          value="4.7"
          label="Average Rating"
          sub={
            // Rendered as stars string
            "★★★★☆"
          }
        />
        <StatCard
          delay={6}
          icon={<Clock size={22} className="text-sky-600" />}
          iconBg="bg-sky-50"
          value="15 mins"
          label="Average Response"
          sub="In emergencies"
        />
      </div>
    </section>
  );
}
