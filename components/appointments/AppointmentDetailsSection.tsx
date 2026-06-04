"use client";

import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  CalendarDays,
  Clock,
  User,
  Hash,
  Stethoscope,
  CalendarPlus,
  RotateCcw,
  XCircle,
  FileText,
  CreditCard,
  Timer,
  // CreditCard,
  HeadphonesIcon,
  Phone,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

/* ─── Animation Variants ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* ─── Data ───────────────────────────────────────────── */
const doctor = {
  name: "Dr. Rahul Sharma",
  specialization: "Cardiologist",
  experience: "15+ Years Experience",
  rating: 4.8,
  reviews: 1284,
  hospital: "LifeLine Hospital, Raipur",
  date: "22 May 2025",
  time: "10:30 AM",
  visitType: "Regular Heart Checkup",
  consultationType: "In-Person Visit",
  patient: "Guest Patient",
  appointmentId: "APT12560",
  status: "Confirmed",
};

const instructions = [
  {
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "Medical Reports",
    desc: "Please bring your previous medical reports and test results.",
  },
  {
    icon: CreditCard,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    title: "Consultation Fee",
    desc: "Consultation fee: ₹800 (Pay at hospital).",
  },
  {
    icon: Timer,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "Arrive Early",
    desc: "Arrive 15 minutes before your appointment time.",
  },
  {
    icon: CreditCard,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    title: "Valid ID Proof",
    desc: "Carry a valid government-issued ID proof.",
  },
];

const metaFields = [
  { icon: MapPin,      label: "Hospital",           value: doctor.hospital },
  { icon: CalendarDays,label: "Date",               value: doctor.date },
  { icon: Clock,       label: "Visit Time",          value: doctor.time },
  { icon: Stethoscope, label: "Visit Type",          value: doctor.visitType },
  { icon: User,        label: "Patient For",         value: doctor.patient },
  { icon: Stethoscope, label: "Consultation Type",   value: doctor.consultationType },
  { icon: Hash,        label: "Appointment ID",      value: doctor.appointmentId },
];

/* ─── Sub-components ─────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
      <span className="text-xs font-semibold text-amber-500 ml-1">{rating}</span>
      <span className="text-xs text-[#94A3B8]">({doctor.reviews.toLocaleString()} reviews)</span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function AppointmentDetailsSection() {
  return (
    <section className="w-full px-6 py-6 bg-[#F8FAFC]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">

        {/* ══════════════ LEFT: Appointment Details ══════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F1F5F9]">
            <h2
              className="text-lg font-bold text-[#1E293B]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Appointment Details
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {doctor.status}
            </span>
          </div>

          <div className="px-6 py-5">
            {/* Doctor Profile */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={1}
              className="flex items-start gap-4 mb-6"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ring-2 ring-blue-100">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                  <BadgeCheck className="w-3 h-3 text-white" />
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="text-base font-bold text-[#1E293B]"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {doctor.name}
                  </h3>
                </div>
                <p className="text-sm text-[#2563EB] font-medium mt-0.5">{doctor.specialization}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{doctor.experience}</p>
                <div className="mt-1.5">
                  <StarRating rating={doctor.rating} />
                </div>
              </div>
            </motion.div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {metaFields.map((field, i) => {
                const Icon = field.icon;
                return (
                  <motion.div
                    key={field.label}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={i * 0.5 + 2}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9]"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-none mb-0.5">
                        {field.label}
                      </p>
                      <p className="text-sm font-semibold text-[#1E293B] leading-snug truncate">
                        {field.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-[#E2E8F0] my-5" />

            {/* Action Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
              className="flex flex-col sm:flex-row gap-3"
            >
              {/* Reschedule */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-[#2563EB] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={2} />
                Reschedule
              </motion.button>

              {/* Cancel */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                <XCircle className="w-4 h-4" strokeWidth={2} />
                Cancel Appointment
              </motion.button>

              {/* Add to Calendar */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                }}
              >
                <CalendarPlus className="w-4 h-4" strokeWidth={2} />
                Add to Calendar
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* ══════════════ RIGHT COLUMN ══════════════ */}
        <div className="flex flex-col gap-4">

          {/* Preparation & Instructions Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
          >
            <div className="px-6 pt-6 pb-4 border-b border-[#F1F5F9]">
              <h2
                className="text-lg font-bold text-[#1E293B]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Preparation & Instructions
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Follow these steps before your visit.
              </p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-3">
              {instructions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={i + 2}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] cursor-default transition-colors hover:border-[#E2E8F0] hover:bg-white"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${item.iconColor}`} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] leading-tight">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            whileHover={{ y: -3, boxShadow: "0 12px 40px 0 rgba(37,99,235,0.13)" }}
            className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden cursor-default transition-shadow"
          >
            {/* Decorative gradient blob */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.07] bg-blue-500 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-[0.05] bg-blue-400 blur-xl pointer-events-none" />

            <div className="relative px-6 py-5 flex items-center gap-4">
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200"
              >
                <HeadphonesIcon className="w-5 h-5 text-white" strokeWidth={1.8} />
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-base font-bold text-[#1E293B]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Need Help?
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Call our support team 24/7
                </p>
              </div>

              {/* Phone */}
              <motion.a
                href="tel:18001234567"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-bold text-[#2563EB] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors flex-shrink-0"
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                1800 123 4567
              </motion.a>
            </div>
          </motion.div>
        </div>
        {/* ══════════════ END RIGHT ══════════════ */}

      </div>
    </section>
  );
}
