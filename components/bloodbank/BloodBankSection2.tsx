"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  User,
} from "lucide-react";

/* ─── Variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Types ──────────────────────────────────────────── */
type StockStatus = "Available" | "Low Stock" | "Critical";

interface BloodGroup {
  group: string;
  units: number;
  status: StockStatus;
  dropColor: string;
  dropBg: string;
}

interface Donor {
  name: string;
  bloodGroup: string;
  bloodBg: string;
  bloodText: string;
  distance: string;
  lastDonated: string;
  initials: string;
  gradient: string;
}

/* ─── Data ───────────────────────────────────────────── */
const bloodInventory: BloodGroup[] = [
  { group: "A+",  units: 312, status: "Available",  dropColor: "text-[#EF4444]", dropBg: "bg-red-50" },
  { group: "A−",  units: 52,  status: "Low Stock",  dropColor: "text-amber-500", dropBg: "bg-amber-50" },
  { group: "B+",  units: 268, status: "Available",  dropColor: "text-[#EF4444]", dropBg: "bg-red-50" },
  { group: "B−",  units: 41,  status: "Critical",   dropColor: "text-rose-600",  dropBg: "bg-rose-50" },
  { group: "AB+", units: 126, status: "Available",  dropColor: "text-[#EF4444]", dropBg: "bg-red-50" },
  { group: "AB−", units: 18,  status: "Low Stock",  dropColor: "text-amber-500", dropBg: "bg-amber-50" },
  { group: "O+",  units: 356, status: "Available",  dropColor: "text-[#EF4444]", dropBg: "bg-red-50" },
  { group: "O−",  units: 75,  status: "Low Stock",  dropColor: "text-amber-500", dropBg: "bg-amber-50" },
];

const statusConfig: Record<StockStatus, { bg: string; text: string; dot: string; bar: string }> = {
  Available: {
    bg:   "bg-emerald-50 ring-1 ring-emerald-200",
    text: "text-emerald-600",
    dot:  "bg-emerald-500",
    bar:  "bg-emerald-400",
  },
  "Low Stock": {
    bg:   "bg-amber-50 ring-1 ring-amber-200",
    text: "text-amber-600",
    dot:  "bg-amber-400",
    bar:  "bg-amber-400",
  },
  Critical: {
    bg:   "bg-rose-50 ring-1 ring-rose-200",
    text: "text-rose-600",
    dot:  "bg-rose-500",
    bar:  "bg-rose-500",
  },
};

// bar fill %: Available ~80%, Low Stock ~25%, Critical ~10%
const barFill: Record<StockStatus, string> = {
  Available:  "w-4/5",
  "Low Stock": "w-1/4",
  Critical:   "w-[10%]",
};

const donors: Donor[] = [
  {
    name: "Rahul Verma",
    bloodGroup: "O+",
    bloodBg: "bg-blue-50",
    bloodText: "text-blue-600",
    distance: "2.1 km away",
    lastDonated: "Last donated: 3 months ago",
    initials: "RV",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Priya Singh",
    bloodGroup: "A+",
    bloodBg: "bg-rose-50",
    bloodText: "text-rose-600",
    distance: "3.4 km away",
    lastDonated: "Last donated: 5 months ago",
    initials: "PS",
    gradient: "from-violet-400 to-purple-600",
  },
  {
    name: "Amit Patel",
    bloodGroup: "B+",
    bloodBg: "bg-emerald-50",
    bloodText: "text-emerald-600",
    distance: "4.2 km away",
    lastDonated: "Last donated: 2 months ago",
    initials: "AP",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    name: "Neha Gupta",
    bloodGroup: "AB+",
    bloodBg: "bg-amber-50",
    bloodText: "text-amber-600",
    distance: "5.1 km away",
    lastDonated: "Last donated: 4 months ago",
    initials: "NG",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    name: "Sandeep Yadav",
    bloodGroup: "O−",
    bloodBg: "bg-red-50",
    bloodText: "text-[#EF4444]",
    distance: "6.3 km away",
    lastDonated: "Last donated: 6 months ago",
    initials: "SY",
    gradient: "from-rose-400 to-pink-600",
  },
];

/* ─── Blood Group Card ───────────────────────────────── */
function BloodGroupCard({ bg, index }: { bg: BloodGroup; index: number }) {
  const sc = statusConfig[bg.status];
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      custom={index}
      whileHover={{ y: -3, boxShadow: "0 8px 28px 0 rgba(239,68,68,0.08)" }}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-3 cursor-default transition-shadow"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl ${bg.dropBg} flex items-center justify-center`}>
            <Droplets className={`w-4 h-4 ${bg.dropColor}`} strokeWidth={1.8} />
          </div>
          <span
            className="text-lg font-bold text-[#1E293B]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {bg.group}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          {bg.status}
        </span>
      </div>

      {/* Units */}
      <div>
        <span
          className="text-2xl font-bold text-[#1E293B]"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {bg.units}
        </span>
        <span className="text-xs text-[#94A3B8] ml-1.5 font-medium">Units</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: undefined }}
          className={`h-full rounded-full ${sc.bar} ${barFill[bg.status]} transition-all duration-700`}
        />
      </div>
    </motion.div>
  );
}

/* ─── Donor Card ─────────────────────────────────────── */
function DonorCard({ donor, index }: { donor: Donor; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      whileHover={{ x: 3, boxShadow: "0 4px 20px 0 rgba(37,99,235,0.07)" }}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#E2E8F0] hover:bg-white transition-all cursor-default"
    >
      {/* Avatar */}
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${donor.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <span className="text-sm font-bold text-white">{donor.initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#1E293B] truncate"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {donor.name}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${donor.bloodBg} ${donor.bloodText} flex-shrink-0`}>
            {donor.bloodGroup}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
            <MapPin className="w-2.5 h-2.5" strokeWidth={1.8} />
            {donor.distance}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
            <Clock className="w-2.5 h-2.5" strokeWidth={1.8} />
            {donor.lastDonated}
          </span>
        </div>
      </div>

      {/* Contact button */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.93 }}
        className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 hover:bg-[#2563EB] hover:border-[#2563EB] group transition-colors"
      >
        <Phone className="w-4 h-4 text-[#2563EB] group-hover:text-white transition-colors" strokeWidth={1.8} />
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────── */
export default function BloodBankSection2() {
  return (
    <section className="w-full px-6 py-6 bg-[#F8FAFC]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

        {/* ══ LEFT ══ */}
        <div className="flex flex-col gap-5">

          {/* Blood Inventory Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="flex items-center justify-between"
          >
            <div>
              <h2
                className="text-lg font-bold text-[#1E293B]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Blood Inventory
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">Real-time units across all blood groups</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              View Details
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.button>
          </motion.div>

          {/* Blood Group Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bloodInventory.map((bg, i) => (
              <BloodGroupCard key={bg.group} bg={bg} index={i + 1} />
            ))}
          </div>

          {/* ── Emergency Alert Card ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={9}
            whileHover={{ y: -2, boxShadow: "0 8px 32px 0 rgba(239,68,68,0.14)" }}
            className="relative bg-white border border-rose-200 rounded-3xl overflow-hidden cursor-default transition-shadow"
          >
            {/* Subtle red gradient strip on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#EF4444] to-rose-300 rounded-l-3xl" />

            {/* Pulsing background glow */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-red-50 opacity-60 blur-2xl pointer-events-none" />

            <div className="relative flex items-center gap-4 px-6 py-4">
              {/* Alert icon */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-red-50 ring-4 ring-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" strokeWidth={1.8} />
                </div>
                <span className="absolute inset-0 rounded-2xl animate-ping bg-red-200 opacity-30" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    Urgent Need: B-Negative Blood
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#EF4444] ring-1 ring-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                    URGENT
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Patient at <span className="font-semibold text-[#1E293B]">AIIMS Raipur</span> requires{" "}
                  <span className="font-semibold text-[#EF4444]">2 Units</span> of B− blood.
                </p>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white shadow-md shadow-red-200 transition-all"
                style={{ background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)" }}
              >
                View Request
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ══ RIGHT: Nearby Donors ══ */}
        <div className="flex flex-col gap-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F5F9]">
              <div>
                <h2
                  className="text-base font-bold text-[#1E293B]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Nearby Donors
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">Within 10 km of your location</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="text-xs font-semibold text-[#2563EB] hover:underline underline-offset-2"
              >
                View All
              </motion.button>
            </div>

            {/* Donor List */}
            <div className="px-5 py-4 flex flex-col gap-2.5">
              {donors.map((donor, i) => (
                <DonorCard key={donor.name} donor={donor} index={i + 2} />
              ))}
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-blue-100 transition-all"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }}
              >
                <User className="w-4 h-4" strokeWidth={2} />
                View All Donors
              </motion.button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
