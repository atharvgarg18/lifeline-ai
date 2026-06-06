"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Users,
  HeartHandshake,
  Tent,
  ClipboardList,
  UserPlus,
  ChevronDown,
  Search,
  MapPin,
  Radius,
} from "lucide-react";

/* ─── Animation Variants ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Stats Data ─────────────────────────────────────── */
const stats = [
  {
    value: "1,248",
    label: "Units Available",
    sublabel: "Across all blood groups",
    icon: Droplets,
    iconBg: "bg-red-50",
    iconColor: "text-[#EF4444]",
    ring: "ring-red-100",
    valueColor: "text-[#1E293B]",
  },
  {
    value: "856",
    label: "Registered Donors",
    sublabel: "Active in your area",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-[#2563EB]",
    ring: "ring-blue-100",
    valueColor: "text-[#2563EB]",
  },
  {
    value: "142",
    label: "Donations This Month",
    sublabel: "Thank you donors!",
    icon: HeartHandshake,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    ring: "ring-emerald-100",
    valueColor: "text-emerald-600",
  },
  {
    value: "12",
    label: "Blood Camps",
    sublabel: "Upcoming this month",
    icon: Tent,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    ring: "ring-amber-100",
    valueColor: "text-amber-600",
  },
  {
    value: "38",
    label: "Active Requests",
    sublabel: "Needs immediate help",
    icon: ClipboardList,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    ring: "ring-rose-100",
    valueColor: "text-rose-500",
    pulse: true,
  },
];

const bloodGroups = [
  "All Blood Groups", "A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−",
];

const radii = ["5 km", "10 km", "25 km", "50 km", "100 km"];

/* ─── Dropdown ───────────────────────────────────────── */
function SelectField({
  label,
  options,
  icon: Icon,
  defaultValue,
}: {
  label: string;
  options: string[];
  icon: React.ElementType;
  defaultValue: string;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider px-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-4 h-4 text-[#64748B]" strokeWidth={1.8} />
        </div>
        <select
          defaultValue={defaultValue}
          className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-9 pr-8 py-2.5 text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all cursor-pointer"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-[#94A3B8]" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function BloodBankHero() {
  return (
    <section className="w-full px-6 pt-8 pb-4 bg-[#F8FAFC]">

      {/* ── Heading Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          {/* Title with blood drop accent */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-red-50 ring-4 ring-red-100 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#EF4444]" strokeWidth={1.8} />
              </div>
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-red-200 opacity-30" />
            </div>
            <h1
              className="text-3xl font-bold tracking-tight text-[#1E293B]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Blood Bank
            </h1>
          </div>
          <p className="mt-2 text-sm text-[#64748B] font-medium max-w-md">
            Find blood, connect donors, and save lives through our healthcare network.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex-shrink-0"
        >
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-red-200 transition-all"
            style={{
              background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
            }}
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            Register as Donor
          </button>
        </motion.div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i + 2}
              whileHover={{ y: -4, boxShadow: "0 8px 32px 0 rgba(37,99,235,0.09)" }}
              className="relative bg-white border border-[#E2E8F0] rounded-3xl px-5 py-5 flex flex-col gap-3 cursor-default transition-shadow select-none"
            >
              {/* Pulse indicator for active requests */}
              {stat.pulse && (
                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
              )}

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ring-4 ${stat.iconBg} ${stat.ring}`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={1.8} />
              </div>

              {/* Value */}
              <span
                className={`text-[28px] font-bold leading-none ${stat.valueColor}`}
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {stat.value}
              </span>

              {/* Labels */}
              <div className="flex flex-col -mt-1">
                <span className="text-[13px] font-semibold text-[#1E293B] leading-tight">
                  {stat.label}
                </span>
                <span className="text-[11px] text-[#94A3B8] mt-0.5">{stat.sublabel}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Search Bar ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={7}
        className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm px-5 py-5"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-end">

          {/* Blood Group */}
          <SelectField
            label="Select Blood Group"
            options={bloodGroups}
            icon={Droplets}
            defaultValue="All Blood Groups"
          />

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-[#E2E8F0] self-end mb-0.5 flex-shrink-0" />

          {/* Location */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider px-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Current Location"
                defaultValue="Current Location"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-9 pr-4 py-2.5 text-sm font-medium text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-[#E2E8F0] self-end mb-0.5 flex-shrink-0" />

          {/* Radius */}
          <SelectField
            label="Radius"
            options={radii}
            icon={Radius}
            defaultValue="25 km"
          />

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all flex-shrink-0 self-end"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            }}
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            Search
          </motion.button>
        </div>
      </motion.div>

    </section>
  );
}
