"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  MapPin,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  ChevronRight,
  Building2,
  Tent,
  HeartPulse,
} from "lucide-react";

/* ─── Variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const rowReveal = {
  hidden: { opacity: 0, x: -16 },
  show: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Types ──────────────────────────────────────────── */
type RequestStatus = "Urgent" | "In Progress" | "Pending" | "Fulfilled";
type CampMonth = "MAY" | "JUN";

interface BloodRequest {
  patient: string;
  bloodGroup: string;
  bloodBg: string;
  bloodText: string;
  units: number;
  hospital: string;
  status: RequestStatus;
}

interface BloodCamp {
  name: string;
  month: CampMonth;
  day: number;
  timeRange: string;
  location: string;
  expectedDonors: number;
  tag: string;
  tagBg: string;
  tagText: string;
  accentBg: string;
  accentText: string;
}

/* ─── Data ───────────────────────────────────────────── */
const requests: BloodRequest[] = [
  {
    patient: "Vikram Sharma",
    bloodGroup: "B−",
    bloodBg: "bg-red-50",
    bloodText: "text-[#EF4444]",
    units: 2,
    hospital: "AIIMS Raipur",
    status: "Urgent",
  },
  {
    patient: "Anjali Tiwari",
    bloodGroup: "O+",
    bloodBg: "bg-blue-50",
    bloodText: "text-blue-600",
    units: 1,
    hospital: "MMI Narayana",
    status: "In Progress",
  },
  {
    patient: "Rohit Kumar",
    bloodGroup: "A−",
    bloodBg: "bg-amber-50",
    bloodText: "text-amber-600",
    units: 2,
    hospital: "Apollo Hospital",
    status: "Pending",
  },
  {
    patient: "Meena Patel",
    bloodGroup: "AB+",
    bloodBg: "bg-emerald-50",
    bloodText: "text-emerald-600",
    units: 1,
    hospital: "Max Hospital",
    status: "Fulfilled",
  },
  {
    patient: "Lokesh Yadav",
    bloodGroup: "B+",
    bloodBg: "bg-violet-50",
    bloodText: "text-violet-600",
    units: 3,
    hospital: "Marengo Asia",
    status: "In Progress",
  },
];

const statusConfig: Record<
  RequestStatus,
  { bg: string; text: string; dot: string }
> = {
  Urgent:      { bg: "bg-red-50 ring-1 ring-red-200",     text: "text-[#EF4444]",  dot: "bg-[#EF4444]" },
  "In Progress":{ bg: "bg-blue-50 ring-1 ring-blue-200",  text: "text-blue-600",   dot: "bg-blue-500" },
  Pending:     { bg: "bg-amber-50 ring-1 ring-amber-200", text: "text-amber-600",  dot: "bg-amber-400" },
  Fulfilled:   { bg: "bg-emerald-50 ring-1 ring-emerald-200", text: "text-emerald-600", dot: "bg-emerald-500" },
};

const camps: BloodCamp[] = [
  {
    name: "AIIMS Raipur Blood Camp",
    month: "MAY",
    day: 24,
    timeRange: "09:00 AM – 04:00 PM",
    location: "AIIMS Raipur, Chhattisgarh",
    expectedDonors: 120,
    tag: "Today",
    tagBg: "bg-red-50",
    tagText: "text-[#EF4444]",
    accentBg: "bg-red-50",
    accentText: "text-[#EF4444]",
  },
  {
    name: "City Hospital Blood Drive",
    month: "MAY",
    day: 27,
    timeRange: "10:00 AM – 03:00 PM",
    location: "City Hospital, Raipur",
    expectedDonors: 80,
    tag: "Upcoming",
    tagBg: "bg-blue-50",
    tagText: "text-blue-600",
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
  },
  {
    name: "LifeLine Community Camp",
    month: "MAY",
    day: 30,
    timeRange: "09:00 AM – 02:00 PM",
    location: "Shankar Nagar, Raipur",
    expectedDonors: 150,
    tag: "Upcoming",
    tagBg: "bg-blue-50",
    tagText: "text-blue-600",
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
  },
  {
    name: "Red Cross Mega Donation",
    month: "JUN",
    day: 5,
    timeRange: "08:00 AM – 05:00 PM",
    location: "Civic Centre, Raipur",
    expectedDonors: 200,
    tag: "Mega",
    tagBg: "bg-amber-50",
    tagText: "text-amber-600",
    accentBg: "bg-amber-50",
    accentText: "text-amber-600",
  },
];

/* ─── Main Export ────────────────────────────────────── */
export default function BloodBankSection3() {
  return (
    <section className="w-full px-6 py-6 bg-[#F8FAFC]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">

        {/* ══ LEFT: Recent Blood Requests ══ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2
                className="text-base font-bold text-[#1E293B]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Recent Blood Requests
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Active requests needing urgent attention
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1.4fr_0.7fr_0.6fr_1.1fr_0.9fr] gap-2 px-6 py-2.5 bg-[#F8FAFC] border-b border-[#F1F5F9]">
            {["Patient Name", "Blood Group", "Units", "Hospital", "Status"].map((col) => (
              <span
                key={col}
                className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider"
              >
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col divide-y divide-[#F8FAFC] px-3 flex-1">
            {requests.map((req, i) => {
              const sc = statusConfig[req.status];
              return (
                <motion.div
                  key={req.patient}
                  variants={rowReveal}
                  initial="hidden"
                  animate="show"
                  custom={i + 1}
                  whileHover={{ backgroundColor: "#F8FAFC", x: 2 }}
                  className="grid grid-cols-[1.4fr_0.7fr_0.6fr_1.1fr_0.9fr] gap-2 items-center px-3 py-3.5 rounded-2xl transition-all cursor-default"
                >
                  {/* Patient */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-[#64748B]">
                        {req.patient.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#1E293B] truncate">
                      {req.patient}
                    </span>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${req.bloodBg} ${req.bloodText}`}
                    >
                      <Droplets className="w-2.5 h-2.5" strokeWidth={2} />
                      {req.bloodGroup}
                    </span>
                  </div>

                  {/* Units */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[#1E293B]">{req.units}</span>
                    <span className="text-[11px] text-[#94A3B8]">Unit{req.units > 1 ? "s" : ""}</span>
                  </div>

                  {/* Hospital */}
                  <div className="flex items-center gap-1 min-w-0">
                    <Building2 className="w-3 h-3 text-[#94A3B8] flex-shrink-0" strokeWidth={1.8} />
                    <span className="text-xs text-[#64748B] truncate">{req.hospital}</span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${req.status === "Urgent" ? "animate-pulse" : ""}`}
                      />
                      {req.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View All CTA */}
          <div className="px-6 py-4 border-t border-[#F1F5F9]">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold text-[#2563EB] border border-dashed border-[#CBD5E1] hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              View All Requests
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>

        {/* ══ RIGHT: Upcoming Blood Camps ══ */}
        <div className="flex flex-col gap-4">
          {/* Header row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="flex items-center justify-between"
          >
            <div>
              <h2
                className="text-base font-bold text-[#1E293B]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Upcoming Blood Camps
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">Donate blood and save lives near you</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              className="text-xs font-semibold text-[#2563EB] hover:underline underline-offset-2"
            >
              View All
            </motion.button>
          </motion.div>

          {/* Camp Cards */}
          <div className="flex flex-col gap-3">
            {camps.map((camp, i) => (
              <motion.div
                key={camp.name}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i + 1}
                whileHover={{ y: -3, boxShadow: "0 8px 28px 0 rgba(37,99,235,0.09)" }}
                className="bg-white border border-[#E2E8F0] rounded-3xl p-4 flex gap-4 items-start transition-shadow cursor-default"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] shadow-md shadow-blue-200 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none">
                    {camp.month}
                  </span>
                  <span
                    className="text-2xl font-bold leading-tight"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {camp.day}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-sm font-bold text-[#1E293B] leading-snug"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {camp.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${camp.tagBg} ${camp.tagText}`}
                    >
                      {camp.tag}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mt-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <Clock className="w-3 h-3" strokeWidth={1.8} />
                      {camp.timeRange}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <MapPin className="w-3 h-3" strokeWidth={1.8} />
                      {camp.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <Users className="w-3 h-3" strokeWidth={1.8} />
                      {camp.expectedDonors} expected donors
                    </span>
                  </div>

                  {/* View Details */}
                  <div className="mt-2.5">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      View Details
                      <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Camps CTA */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white shadow-md shadow-blue-100 transition-all"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }}
          >
            <Tent className="w-4 h-4" strokeWidth={2} />
            View All Camps
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>

      </div>
    </section>
  );
}
