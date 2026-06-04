"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  ChevronDown,
  SlidersHorizontal,
  ChevronRight,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Heart,
  Brain,
  Bone,
  Baby,
  AlertCircle,
  Sparkles,
} from "lucide-react";

/* ─── Types ─── */
type Availability = "Available Now" | "Busy" | "On Call";

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  hospital: string;
  distance: string;
  availability: Availability;
  fee: number;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  specialIcon: React.ReactNode;
  badge?: string;
};

/* ─── Data ─── */
const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    experience: 12,
    rating: 4.8,
    reviews: 320,
    hospital: "City Heart Hospital",
    distance: "2.4 km",
    availability: "Available Now",
    fee: 800,
    initials: "JD",
    avatarBg: "#EFF6FF",
    avatarColor: "#2563EB",
    specialIcon: <Heart size={13} />,
    badge: "Top Rated",
  },
  {
    id: 2,
    name: "Dr. Sarah Wilson",
    specialization: "Neurologist",
    experience: 10,
    rating: 4.7,
    reviews: 210,
    hospital: "NeuroCare Hospital",
    distance: "3.1 km",
    availability: "Busy",
    fee: 900,
    initials: "SW",
    avatarBg: "#F5F3FF",
    avatarColor: "#7C3AED",
    specialIcon: <Brain size={13} />,
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    specialization: "Orthopedic",
    experience: 15,
    rating: 4.9,
    reviews: 450,
    hospital: "Ortho Plus Hospital",
    distance: "1.8 km",
    availability: "Available Now",
    fee: 750,
    initials: "MC",
    avatarBg: "#FFFBEB",
    avatarColor: "#D97706",
    specialIcon: <Bone size={13} />,
    badge: "Most Experienced",
  },
  {
    id: 4,
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    experience: 8,
    rating: 4.8,
    reviews: 180,
    hospital: "Children Care Hospital",
    distance: "2.9 km",
    availability: "Available Now",
    fee: 600,
    initials: "PS",
    avatarBg: "#ECFDF5",
    avatarColor: "#059669",
    specialIcon: <Baby size={13} />,
  },
  {
    id: 5,
    name: "Dr. Amit Verma",
    specialization: "Emergency Medicine",
    experience: 14,
    rating: 4.6,
    reviews: 380,
    hospital: "LifeLine Emergency",
    distance: "0.9 km",
    availability: "On Call",
    fee: 1000,
    initials: "AV",
    avatarBg: "#FFF1F2",
    avatarColor: "#DC2626",
    specialIcon: <AlertCircle size={13} />,
    badge: "Nearest",
  },
  {
    id: 6,
    name: "Dr. Ananya Reddy",
    specialization: "General Physician",
    experience: 6,
    rating: 4.4,
    reviews: 160,
    hospital: "Health Plus Clinic",
    distance: "1.5 km",
    availability: "Available Now",
    fee: 500,
    initials: "AR",
    avatarBg: "#EFF6FF",
    avatarColor: "#2563EB",
    specialIcon: <Stethoscope size={13} />,
  },
  {
    id: 7,
    name: "Dr. David Brown",
    specialization: "Cardiologist",
    experience: 11,
    rating: 4.7,
    reviews: 290,
    hospital: "Sunrise Hospital",
    distance: "3.4 km",
    availability: "Busy",
    fee: 850,
    initials: "DB",
    avatarBg: "#EFF6FF",
    avatarColor: "#1D4ED8",
    specialIcon: <Heart size={13} />,
  },
  {
    id: 8,
    name: "Dr. Neha Kapoor",
    specialization: "Dermatologist",
    experience: 9,
    rating: 4.8,
    reviews: 200,
    hospital: "Skin Care Clinic",
    distance: "2.2 km",
    availability: "Available Now",
    fee: 700,
    initials: "NK",
    avatarBg: "#FFF0F9",
    avatarColor: "#DB2777",
    specialIcon: <Activity size={13} />,
  },
];

const sortOptions = [
  "Recommended",
  "Rating",
  "Experience",
  "Distance",
  "Consultation Fee",
];

/* ─── Availability config ─── */
const availConfig: Record<Availability, { color: string; bg: string; dot: string }> = {
  "Available Now": { color: "#059669", bg: "#ECFDF5", dot: "#10B981" },
  Busy:            { color: "#D97706", bg: "#FFFBEB", dot: "#F59E0B" },
  "On Call":       { color: "#DC2626", bg: "#FFF1F2", dot: "#EF4444" },
};

/* ─── Animations ─── */
const sectionFade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Star Rating ─── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E2E8F0] fill-[#E2E8F0]"}
        />
      ))}
    </div>
  );
}

/* ─── Doctor Card ─── */
function DoctorCard({ doctor }: { doctor: Doctor }) {
  const avail = availConfig[doctor.availability];

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
      className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#BFDBFE] transition-shadow duration-300 flex flex-col"
    >
      {/* Card top strip accent */}
      <div className="h-1 w-full" style={{ background: doctor.avatarColor, opacity: 0.15 }} />

      <div className="p-5 flex flex-col flex-1">
        {/* ── Avatar + Badge row ── */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold relative shrink-0"
              style={{ background: doctor.avatarBg, color: doctor.avatarColor }}
            >
              {doctor.initials}
              {/* Specialty icon badge */}
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                style={{ background: doctor.avatarBg, color: doctor.avatarColor }}
              >
                {doctor.specialIcon}
              </span>
            </div>

            {/* Name + Spec */}
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] leading-tight mb-0.5">{doctor.name}</h3>
              <p className="text-xs text-[#64748B] font-medium">{doctor.specialization}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                <Clock size={10} />
                {doctor.experience}+ Yrs. Exp.
              </p>
            </div>
          </div>

          {/* Badge */}
          {doctor.badge && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] whitespace-nowrap">
              <Sparkles size={9} />
              {doctor.badge}
            </span>
          )}
        </div>

        {/* ── Rating row ── */}
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={doctor.rating} />
          <span className="text-xs font-bold text-[#1E293B]">{doctor.rating}</span>
          <span className="text-xs text-[#94A3B8]">({doctor.reviews} reviews)</span>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-[#F1F5F9] mb-4" />

        {/* ── Hospital + Distance ── */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <div className="w-6 h-6 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
              <Stethoscope size={12} className="text-[#94A3B8]" />
            </div>
            <span className="font-medium text-[#475569] truncate">{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <div className="w-6 h-6 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
              <MapPin size={12} className="text-[#94A3B8]" />
            </div>
            <span>{doctor.distance} away</span>
          </div>
        </div>

        {/* ── Availability + Fee row ── */}
        <div className="flex items-center justify-between mb-5">
          {/* Availability badge */}
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: avail.bg, color: avail.color }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: avail.dot }}
            />
            {doctor.availability}
          </span>

          {/* Fee */}
          <div className="text-right">
            <p className="text-[10px] text-[#94A3B8] leading-none mb-0.5">Consultation Fee</p>
            <p className="text-sm font-bold text-[#1E293B]">₹{doctor.fee}</p>
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            <Calendar size={13} />
            Book Appointment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-1.5 border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] text-[#64748B] text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors bg-white"
          >
            <User size={13} />
            View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function TopDoctorsSection() {
  const [sortBy, setSortBy] = useState("Recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  return (
    <motion.section
      variants={sectionFade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="w-full bg-[#F8FAFC] px-6 py-8"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Left */}
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] mb-1">Top Doctors Near You</h2>
            <p className="text-sm text-[#64748B]">Verified doctors with high ratings and experience</p>
          </div>

          {/* Right — Sort + Filter */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 border border-[#E2E8F0] bg-white rounded-xl px-4 py-2.5 text-sm text-[#475569] font-medium hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
              >
                <span className="text-xs text-[#94A3B8] font-normal">Sort by:</span>
                {sortBy}
                <ChevronDown
                  size={14}
                  className={`text-[#94A3B8] transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16 }}
                  className="absolute top-full right-0 mt-1 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm border-b border-[#F1F5F9] last:border-0 transition-colors ${
                        sortBy === opt
                          ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                          : "text-[#475569] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Filter button */}
            <button className="flex items-center gap-2 border border-[#E2E8F0] bg-white rounded-xl px-4 py-2.5 text-sm text-[#475569] font-medium hover:border-[#2563EB] hover:text-[#2563EB] transition-all">
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>
        </div>

        {/* ── Doctor Grid ── */}
        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </motion.div>

        {/* ── View All CTA ── */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03, x: 2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:text-[#2563EB] text-[#475569] text-sm font-semibold px-8 py-3 rounded-2xl shadow-sm transition-all"
          >
            View All Doctors
            <ChevronRight size={16} />
          </motion.button>
        </div>

      </div>
    </motion.section>
  );
}
