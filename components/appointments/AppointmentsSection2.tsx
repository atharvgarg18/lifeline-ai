"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  User,
  Stethoscope,
} from "lucide-react";

/* ─── Animation Variants ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Types ──────────────────────────────────────────── */
type Status = "Confirmed" | "Pending" | "Cancelled";

interface Appointment {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  date: string;
  day: number;
  time: string;
  status: Status;
  avatarInitials: string;
  avatarGradient: string;
}

/* ─── Data ───────────────────────────────────────────── */
const appointments: Appointment[] = [
  {
    id: "APT001",
    name: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    hospital: "LifeLine Hospital, Raipur",
    date: "22 May 2025",
    day: 22,
    time: "10:30 AM",
    status: "Confirmed",
    avatarInitials: "RS",
    avatarGradient: "from-blue-400 to-blue-600",
  },
  {
    id: "APT002",
    name: "Dr. Priya Verma",
    specialization: "Neurologist",
    hospital: "AIIMS Hospital, Raipur",
    date: "24 May 2025",
    day: 24,
    time: "02:00 PM",
    status: "Confirmed",
    avatarInitials: "PV",
    avatarGradient: "from-violet-400 to-violet-600",
  },
  {
    id: "APT003",
    name: "Dr. Amit Patel",
    specialization: "Orthopedic Surgeon",
    hospital: "Max Super Speciality Hospital",
    date: "26 May 2025",
    day: 26,
    time: "11:15 AM",
    status: "Pending",
    avatarInitials: "AP",
    avatarGradient: "from-amber-400 to-orange-500",
  },
  {
    id: "APT004",
    name: "Dr. Neha Gupta",
    specialization: "Pediatrician",
    hospital: "Apollo Hospital, Raipur",
    date: "28 May 2025",
    day: 28,
    time: "04:30 PM",
    status: "Confirmed",
    avatarInitials: "NG",
    avatarGradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "APT005",
    name: "Dr. Sandeep Jain",
    specialization: "Dermatologist",
    hospital: "Marengo Asia Hospitals",
    date: "30 May 2025",
    day: 30,
    time: "01:00 PM",
    status: "Cancelled",
    avatarInitials: "SJ",
    avatarGradient: "from-rose-400 to-pink-500",
  },
];

const todaySchedule = [
  {
    time: "10:30 AM",
    name: "Dr. Rahul Sharma",
    dept: "Cardiology",
    status: "Confirmed" as Status,
  },
  {
    time: "04:00 PM",
    name: "Dr. Anjali Tiwari",
    dept: "Gynecology",
    status: "Pending" as Status,
  },
];

const appointmentDays = [22, 24, 26, 28, 30];

/* ─── Status Config ──────────────────────────────────── */
const statusConfig: Record<Status, { bg: string; text: string; dot: string }> = {
  Confirmed: { bg: "bg-emerald-50 ring-1 ring-emerald-200", text: "text-emerald-600", dot: "bg-emerald-500" },
  Pending:   { bg: "bg-amber-50 ring-1 ring-amber-200",   text: "text-amber-600",   dot: "bg-amber-400" },
  Cancelled: { bg: "bg-rose-50 ring-1 ring-rose-200",     text: "text-rose-500",    dot: "bg-rose-400" },
};

/* ─── Calendar Component ─────────────────────────────── */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function Calendar() {
  const today = new Date(2025, 4, 22); // May 22 2025
  const [current, setCurrent] = useState(new Date(2025, 4, 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false });

  const isToday = (d: number, cur: boolean) =>
    cur && d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const hasAppt = (d: number, cur: boolean) =>
    cur && month === 4 && appointmentDays.includes(d);

  return (
    <div>
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-base font-bold text-[#1E293B]"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-1">
          {[
            { icon: ChevronLeft, action: () => setCurrent(new Date(year, month - 1, 1)) },
            { icon: ChevronRight, action: () => setCurrent(new Date(year, month + 1, 1)) },
          ].map(({ icon: Icon, action }, i) => (
            <motion.button
              key={i}
              onClick={action}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className="w-7 h-7 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors"
            >
              <Icon className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-y-0.5"
        >
          {cells.map((cell, idx) => {
            const today_ = isToday(cell.day, cell.current);
            const appt = hasAppt(cell.day, cell.current);
            return (
              <motion.button
                key={idx}
                whileHover={cell.current ? { scale: 1.12 } : {}}
                className={`
                  relative flex flex-col items-center justify-center h-9 w-full rounded-xl text-sm font-medium transition-colors
                  ${!cell.current ? "text-[#CBD5E1] cursor-default" : "cursor-pointer"}
                  ${today_ ? "bg-[#2563EB] text-white shadow-md shadow-blue-200 font-bold" : ""}
                  ${appt && !today_ ? "text-[#2563EB] font-bold" : ""}
                  ${cell.current && !today_ && !appt ? "text-[#1E293B] hover:bg-[#F1F5F9]" : ""}
                `}
              >
                {cell.day}
                {appt && !today_ && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                )}
                {today_ && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Appointment Card ───────────────────────────────── */
function AppointmentCard({ appt, index }: { appt: Appointment; index: number }) {
  const sc = statusConfig[appt.status];

  const actions =
    appt.status === "Cancelled"
      ? [{ label: "Book Again", icon: RefreshCw, variant: "ghost-blue" as const }]
      : appt.status === "Pending"
      ? [
          { label: "Reschedule", icon: RotateCcw, variant: "ghost-blue" as const },
        ]
      : [
          { label: "View Details", icon: Eye, variant: "primary" as const },
        ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      whileHover={{ y: -3, boxShadow: "0 8px 32px 0 rgba(37,99,235,0.09)" }}
      className="bg-white border border-[#E2E8F0] rounded-3xl p-4 flex gap-4 items-start transition-shadow cursor-default"
    >
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${appt.avatarGradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <span className="text-sm font-bold text-white">{appt.avatarInitials}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h4
              className="text-sm font-bold text-[#1E293B] leading-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {appt.name}
            </h4>
            <p className="text-xs text-[#2563EB] font-medium mt-0.5">{appt.specialization}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text} flex-shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {appt.status}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
            <MapPin className="w-3 h-3" strokeWidth={1.8} />
            {appt.hospital}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
            <CalendarDays className="w-3 h-3" strokeWidth={1.8} />
            {appt.date}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
            <Clock className="w-3 h-3" strokeWidth={1.8} />
            {appt.time}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {actions.map(({ label, icon: Icon, variant }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors
                ${variant === "primary"
                  ? "text-white shadow-sm shadow-blue-100"
                  : "bg-blue-50 text-[#2563EB] border border-blue-100 hover:bg-blue-100"
                }
              `}
              style={
                variant === "primary"
                  ? { background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }
                  : undefined
              }
            >
              <Icon className="w-3 h-3" strokeWidth={2} />
              {label}
            </motion.button>
          ))}
          {appt.status !== "Cancelled" && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={2} />
              Reschedule
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────── */
export default function AppointmentsSection2() {
  return (
    <section className="w-full px-6 py-6 bg-[#F8FAFC]">
      {/* Tab bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex items-center gap-1 mb-5 border-b border-[#E2E8F0]"
      >
        {["All Appointments", "Upcoming", "Today", "Completed", "Cancelled"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors rounded-t-xl ${
              i === 0
                ? "text-[#2563EB] border-b-2 border-[#2563EB] -mb-px"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto mb-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            Filter
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

        {/* ══ LEFT: Upcoming Appointments ══ */}
        <div className="flex flex-col gap-3">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="flex items-center justify-between"
          >
            <h2
              className="text-base font-bold text-[#1E293B]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Upcoming Appointments
            </h2>
            <span className="text-xs text-[#64748B]">5 appointments</span>
          </motion.div>

          <div className="flex flex-col gap-3">
            {appointments.map((appt, i) => (
              <AppointmentCard key={appt.id} appt={appt} index={i + 1} />
            ))}
          </div>

          {/* View All */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-1"
          >
            <motion.button
              whileHover={{ x: 4 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-[#CBD5E1] text-sm font-semibold text-[#2563EB] hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              View All Appointments
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </motion.div>
        </div>

        {/* ══ RIGHT: Calendar + Today's Schedule ══ */}
        <div className="flex flex-col gap-4">

          {/* Calendar Card */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm px-5 py-5"
          >
            <Calendar />

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#F1F5F9]">
              <span className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                <span className="w-5 h-5 rounded-lg bg-[#2563EB] inline-flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">22</span>
                </span>
                Today
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block" />
                Appointment
              </span>
            </div>
          </motion.div>

          {/* Today's Schedule Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden"
          >
            <div className="px-5 pt-5 pb-3 border-b border-[#F1F5F9]">
              <h3
                className="text-sm font-bold text-[#1E293B]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Appointments on 22 May 2025
              </h3>
            </div>

            <div className="px-5 py-3 flex flex-col gap-2.5">
              {todaySchedule.map((item, i) => {
                const sc = statusConfig[item.status];
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={i + 3}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#E2E8F0] transition-all cursor-default"
                  >
                    {/* Time */}
                    <div className="flex-shrink-0 text-right min-w-[60px]">
                      <span className="text-xs font-bold text-[#2563EB]">{item.time}</span>
                    </div>

                    {/* Divider dot */}
                    <div className="w-2 h-2 rounded-full bg-[#E2E8F0] flex-shrink-0" />

                    {/* Doctor */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1E293B] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-2.5 h-2.5" strokeWidth={1.8} />
                        {item.dept}
                      </p>
                    </div>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text} flex-shrink-0`}>
                      <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                      {item.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="px-5 pb-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-blue-100 transition-all"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }}
              >
                <CalendarDays className="w-4 h-4" strokeWidth={2} />
                View Day Schedule
              </motion.button>
            </div>
          </motion.div>

        </div>
        {/* ══ END RIGHT ══ */}

      </div>
    </section>
  );
}
