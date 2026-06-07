"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Syringe,
  AlertCircle,
  ClipboardList,
  Heart,
  ChevronRight,
  CheckCircle2,
  Activity,
  Droplets,
  FlaskConical,
  Microscope,
  ScanLine,
  FileText,
  Phone,
  Calendar,
  Clock,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  FileImage,
  Zap,
  Star,
  BadgeCheck,
  Paperclip,
  Shield,
} from "lucide-react";

// ─── shared animation variants ───────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, type: "spring", stiffness: 260, damping: 24 },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } },
};

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, cta = "View All" }: { title: string; cta?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[13px] font-bold text-slate-800">{title}</h3>
      <button className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors flex items-center gap-0.5">
        {cta} <ChevronRight size={11} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 1. MEDICAL HISTORY TIMELINE
// ════════════════════════════════════════════════════════════
const timelineData = [
  {
    id: 1,
    date: "28 May 2025",
    type: "Checkup",
    title: "Annual Health Checkup",
    detail: "BP 120/80, SpO2 98%, all vitals normal",
    icon: ClipboardList,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    dotColor: "bg-blue-500",
    lineColor: "bg-blue-200",
    badge: "Completed",
    badgeBg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: 2,
    date: "10 May 2025",
    type: "Diagnosis",
    title: "Asthma — Mild Persistent",
    detail: "Spirometry confirmed, Salbutamol prescribed",
    icon: Stethoscope,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    dotColor: "bg-amber-500",
    lineColor: "bg-amber-200",
    badge: "Chronic",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    id: 3,
    date: "20 Apr 2025",
    type: "Allergy",
    title: "Penicillin Allergy Noted",
    detail: "Skin rash observed; documented in health record",
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    dotColor: "bg-red-500",
    lineColor: "bg-red-200",
    badge: "Alert",
    badgeBg: "bg-red-50 text-red-600 border-red-100",
  },
  {
    id: 4,
    date: "05 Mar 2024",
    type: "Vaccination",
    title: "Influenza Vaccine",
    detail: "Batch #INF-2024-B, administered at Apollo Hospital",
    icon: Syringe,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    dotColor: "bg-emerald-500",
    lineColor: "bg-emerald-200",
    badge: "Done",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: 5,
    date: "15 Jan 2024",
    type: "Diagnosis",
    title: "Vitamin D Deficiency",
    detail: "Level: 18 ng/mL — supplementation started",
    icon: Heart,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    dotColor: "bg-violet-500",
    lineColor: "bg-violet-200",
    badge: "Resolved",
    badgeBg: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

export function MedicalHistoryTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div
      {...fadeUp(0.05)}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <SectionHeader title="Medical History" cta="Full History" />

      <div className="relative">
        {timelineData.map((entry, i) => {
          const Icon = entry.icon;
          const isLast = i === timelineData.length - 1;
          const isExpanded = expanded === entry.id;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.07, type: "spring", stiffness: 260, damping: 24 }}
              className="relative flex gap-3 pb-4 last:pb-0"
            >
              {/* Timeline connector */}
              {!isLast && (
                <div className={`absolute left-[19px] top-10 bottom-0 w-[2px] ${entry.lineColor} opacity-50`} />
              )}

              {/* Dot + Icon */}
              <div className="relative shrink-0 z-10">
                <div className={`w-10 h-10 rounded-2xl ${entry.iconBg} flex items-center justify-center shadow-sm border border-white`}>
                  <Icon size={16} className={entry.iconColor} strokeWidth={1.9} />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${entry.dotColor} border-2 border-white shadow-sm`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setExpanded(isExpanded ? null : entry.id)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide ${entry.badgeBg}`}>
                          {entry.type}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={9} /> {entry.date}
                        </span>
                      </div>
                      <p className="text-[12px] font-bold text-slate-800 mt-0.5 leading-snug">{entry.title}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={13} className="text-slate-300 group-hover:text-blue-400 transition-colors mt-1 shrink-0" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden text-[10px] text-slate-500 mt-1.5 leading-relaxed pl-0"
                    >
                      {entry.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// 2. RECENT LAB RESULTS
// ════════════════════════════════════════════════════════════
const labData = [
  {
    id: 1,
    icon: Droplets,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    name: "Hemoglobin",
    value: "13.5",
    unit: "g/dL",
    range: "12–16",
    status: "Normal",
    trend: "up",
  },
  {
    id: 2,
    icon: Microscope,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-400",
    name: "WBC Count",
    value: "6,800",
    unit: "/µL",
    range: "4,500–11,000",
    status: "Normal",
    trend: "stable",
  },
  {
    id: 3,
    icon: Activity,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-400",
    name: "Platelet Count",
    value: "2.45L",
    unit: "/µL",
    range: "1.5–4.5 L",
    status: "Normal",
    trend: "up",
  },
  {
    id: 4,
    icon: FlaskConical,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-400",
    name: "Blood Sugar (F)",
    value: "98",
    unit: "mg/dL",
    range: "70–100",
    status: "Normal",
    trend: "down",
  },
  {
    id: 5,
    icon: Heart,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    name: "Cholesterol",
    value: "182",
    unit: "mg/dL",
    range: "<200",
    status: "Normal",
    trend: "stable",
  },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp size={11} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={11} className="text-blue-400" />;
  return <Minus size={11} className="text-slate-300" />;
};

export function RecentLabResults() {
  return (
    <motion.div
      {...fadeUp(0.1)}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <SectionHeader title="Recent Lab Results" />

      {/* Table header */}
      <div className="grid grid-cols-[1fr_80px_80px_60px] gap-2 mb-2 px-1">
        {["Test", "Value", "Range", "Status"].map((h) => (
          <span key={h} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{h}</span>
        ))}
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-1.5">
        {labData.map((row) => {
          const Icon = row.icon;
          return (
            <motion.div
              key={row.id}
              variants={item}
              whileHover={{ x: 3, backgroundColor: "#f8faff" }}
              className="grid grid-cols-[1fr_80px_80px_60px] gap-2 items-center px-3 py-2.5 rounded-xl border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group"
            >
              {/* Name */}
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-xl ${row.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon size={13} className={row.iconColor} strokeWidth={1.8} />
                </div>
                <span className="text-[12px] font-semibold text-slate-700 truncate">{row.name}</span>
              </div>

              {/* Value + trend */}
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-black text-slate-800">{row.value}</span>
                <span className="text-[9px] text-slate-400">{row.unit}</span>
                <TrendIcon trend={row.trend} />
              </div>

              {/* Range */}
              <span className="text-[10px] text-slate-400 font-medium">{row.range}</span>

              {/* Status */}
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-center w-fit">
                {row.status}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
        <Clock size={10} />
        <span>Last updated 2 hours ago</span>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// 3. RECENT IMAGING
// ════════════════════════════════════════════════════════════
const imagingData = [
  {
    id: 1,
    type: "Chest X-Ray",
    date: "10 May 2025",
    status: "Normal",
    statusBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: ScanLine,
    thumb: "xray",
    findings: "No abnormalities detected. Lung fields clear.",
    radiologist: "Dr. Priya Mehta",
  },
  {
    id: 2,
    type: "ECG",
    date: "15 Apr 2025",
    status: "Normal",
    statusBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: Activity,
    thumb: "ecg",
    findings: "Sinus rhythm, 72 bpm. No ST changes.",
    radiologist: "Dr. Rohan Singh",
  },
];

function ImagingThumb({ type }: { type: string }) {
  if (type === "xray") {
    return (
      <svg viewBox="0 0 80 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="64" fill="#1e293b" rx="6" />
        <ellipse cx="40" cy="32" rx="22" ry="26" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="40" cy="32" rx="12" ry="18" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.4" />
        <line x1="40" y1="6" x2="40" y2="58" stroke="#475569" strokeWidth="0.8" opacity="0.6" />
        <ellipse cx="28" cy="30" rx="9" ry="14" fill="#334155" opacity="0.7" />
        <ellipse cx="52" cy="30" rx="9" ry="14" fill="#334155" opacity="0.7" />
        <line x1="20" y1="32" x2="60" y2="32" stroke="#64748b" strokeWidth="0.6" opacity="0.5" />
        <circle cx="40" cy="32" r="3" fill="#94a3b8" opacity="0.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="64" fill="#0f172a" rx="6" />
      <polyline
        points="0,32 10,32 15,20 20,44 25,24 30,38 35,32 42,32 46,10 50,54 54,28 58,36 62,32 80,32"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="0" y1="32" x2="80" y2="32" stroke="#1e40af" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export function RecentImaging() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.div
      {...fadeUp(0.12)}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <SectionHeader title="Recent Imaging" />

      <div className="space-y-3">
        {imagingData.map((img, i) => {
          const Icon = img.icon;
          const isActive = active === img.id;
          return (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260, damping: 24 }}
              onClick={() => setActive(isActive ? null : img.id)}
              whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(59,130,246,0.08)" }}
              className="flex gap-3 p-3 rounded-2xl border border-slate-100 hover:border-blue-100 cursor-pointer transition-all duration-200 group"
            >
              {/* Thumbnail */}
              <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-800/10 shadow-sm">
                <ImagingThumb type={img.thumb} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">{img.type}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={9} /> {img.date}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide ${img.statusBg}`}>
                    {img.status}
                  </span>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">{img.findings}</p>
                      <p className="text-[10px] text-blue-500 font-semibold mt-1">By {img.radiologist}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 mt-2">
                  <button className="flex items-center gap-1 text-[10px] text-blue-500 font-semibold hover:text-blue-700 transition-colors">
                    <Eye size={11} /> View
                  </button>
                  <button className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold hover:text-slate-600 transition-colors">
                    <Download size={11} /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// 4. DOCTORS ON CALL
// ════════════════════════════════════════════════════════════
const doctors = [
  {
    id: 1,
    name: "Dr. Arjun Mehta",
    role: "General Physician",
    initials: "AM",
    color: "from-blue-400 to-blue-600",
    ring: "ring-blue-200",
    online: true,
    nextSlot: "Today, 2:30 PM",
    rating: 4.9,
    exp: "12 yrs",
  },
  {
    id: 2,
    name: "Dr. Neha Kapoor",
    role: "Pulmonologist",
    initials: "NK",
    color: "from-pink-400 to-rose-500",
    ring: "ring-pink-200",
    online: true,
    nextSlot: "Today, 4:00 PM",
    rating: 4.8,
    exp: "9 yrs",
  },
  {
    id: 3,
    name: "Dr. Rohan Singh",
    role: "Allergist",
    initials: "RS",
    color: "from-emerald-400 to-teal-500",
    ring: "ring-emerald-200",
    online: false,
    nextSlot: "Tomorrow, 10 AM",
    rating: 4.7,
    exp: "7 yrs",
  },
];

export function DoctorsOnCall() {
  return (
    <motion.div
      {...fadeUp(0.08)}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <SectionHeader title="Doctors On Call" />

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
        {doctors.map((doc) => (
          <motion.div
            key={doc.id}
            variants={item}
            whileHover={{ x: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
            className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all duration-200 group"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${doc.color} flex items-center justify-center ring-2 ${doc.ring} shadow-sm`}>
                <span className="text-white text-[12px] font-black">{doc.initials}</span>
              </div>
              {/* Online dot */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${doc.online ? "bg-emerald-400" : "bg-slate-300"}`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-bold text-slate-800 truncate">{doc.name}</p>
                <BadgeCheck size={12} className="text-blue-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400">{doc.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star size={9} className="text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-slate-500 font-semibold">{doc.rating}</span>
                </div>
                <span className="text-[9px] text-slate-300">•</span>
                <span className="text-[9px] text-slate-400">{doc.exp}</span>
                <span className="text-[9px] text-slate-300">•</span>
                <span className="text-[9px] text-blue-400 font-medium">{doc.nextSlot}</span>
              </div>
            </div>

            {/* Call button */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 border border-green-100 flex items-center justify-center transition-colors shadow-sm shrink-0"
            >
              <Phone size={14} className="text-green-500" strokeWidth={2} />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// 5. MEDICAL DOCUMENTS
// ════════════════════════════════════════════════════════════
const docTypes: Record<string, { bg: string; color: string; accent: string }> = {
  PDF: { bg: "bg-red-50", color: "text-red-500", accent: "border-red-100" },
  IMG: { bg: "bg-blue-50", color: "text-blue-500", accent: "border-blue-100" },
  LAB: { bg: "bg-emerald-50", color: "text-emerald-500", accent: "border-emerald-100" },
};

const documents = [
  {
    id: 1,
    name: "Discharge Summary",
    ext: "PDF",
    size: "1.2 MB",
    date: "28 May 2025",
    icon: FileText,
    category: "Hospital",
    tag: "Recent",
    tagBg: "bg-blue-50 text-blue-500",
  },
  {
    id: 2,
    name: "Spirometry Report",
    ext: "PDF",
    size: "1.8 MB",
    date: "05 Mar 2024",
    icon: Activity,
    category: "Pulmonology",
    tag: null,
    tagBg: "",
  },
  {
    id: 3,
    name: "Allergy Test Report",
    ext: "LAB",
    size: "1.1 MB",
    date: "20 Apr 2024",
    icon: FlaskConical,
    category: "Allergy",
    tag: null,
    tagBg: "",
  },
  {
    id: 4,
    name: "Chest X-Ray Scan",
    ext: "IMG",
    size: "3.4 MB",
    date: "10 May 2025",
    icon: FileImage,
    category: "Radiology",
    tag: "New",
    tagBg: "bg-emerald-50 text-emerald-600",
  },
];

export function MedicalDocuments() {
  return (
    <motion.div
      {...fadeUp(0.14)}
      className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <SectionHeader title="Medical Documents" cta="View All" />

      {/* Upload drop zone */}
      <motion.div
        whileHover={{ borderColor: "#3b82f6", backgroundColor: "#f0f7ff" }}
        className="border-2 border-dashed border-slate-200 rounded-2xl p-3 mb-4 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Paperclip size={15} className="text-blue-400" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-600">Upload new document</p>
          <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10 MB</p>
        </div>
        <div className="ml-auto">
          <div className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">Browse</div>
        </div>
      </motion.div>

      {/* Doc list */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
        {documents.map((doc) => {
          const Icon = doc.icon;
          const style = docTypes[doc.ext];
          return (
            <motion.div
              key={doc.id}
              variants={item}
              whileHover={{ x: 3, backgroundColor: "#f9fafb" }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group"
            >
              {/* File icon */}
              <div className={`relative w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center border ${style.accent} shrink-0`}>
                <Icon size={17} className={style.color} strokeWidth={1.8} />
                <span className={`absolute -bottom-1 -right-1 text-[7px] font-black ${style.color} ${style.bg} border ${style.accent} px-1 py-0.5 rounded-md leading-none`}>
                  {doc.ext}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-bold text-slate-700 truncate">{doc.name}</p>
                  {doc.tag && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${doc.tagBg}`}>
                      {doc.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-400">{doc.category}</span>
                  <span className="text-[9px] text-slate-300">•</span>
                  <span className="text-[9px] text-slate-400">{doc.size}</span>
                  <span className="text-[9px] text-slate-300">•</span>
                  <span className="text-[9px] text-slate-400">{doc.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button whileHover={{ scale: 1.1 }} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center">
                  <Eye size={12} className="text-blue-400" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center">
                  <Download size={12} className="text-slate-400" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// FULL PAGE PREVIEW
// ════════════════════════════════════════════════════════════
export default function MedicalDashboardSections() {
  return (
    <div className="min-h-screen bg-[#f3f5fb] p-6">
      {/* Label */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
            <Shield size={13} className="text-white" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            LifeLine AI — Medical Sections
          </span>
        </div>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-[1fr_320px] gap-5 max-w-[1100px] mx-auto">
        {/* Left column */}
        <div className="space-y-5">
          <MedicalHistoryTimeline />
          <RecentLabResults />
          <RecentImaging />
          <MedicalDocuments />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <DoctorsOnCall />

          {/* Compact secure badge */}
          <motion.div
            {...fadeUp(0.3)}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-[22px] p-5 text-white shadow-lg shadow-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-blue-200" />
              <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wide">HIPAA Secured</span>
            </div>
            <p className="text-[13px] font-black leading-snug">Your health data is fully encrypted & protected</p>
            <p className="text-[10px] text-blue-200 mt-1.5 leading-relaxed">End-to-end encryption. Only you and your care team can access your records.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="mt-3 w-full bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl py-2 text-[11px] font-bold text-white transition-colors"
            >
              Privacy Settings
            </motion.button>
          </motion.div>

          {/* Appointment reminder */}
          <motion.div
            {...fadeUp(0.25)}
            className="bg-white rounded-[22px] p-5 border border-slate-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                <Calendar size={13} className="text-amber-500" />
              </div>
              <h3 className="text-[13px] font-bold text-slate-800">Next Appointment</h3>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5">
              <p className="text-[12px] font-black text-slate-800">Dr. Arjun Mehta</p>
              <p className="text-[10px] text-slate-500">General Physician · Apollo Hospital</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold bg-white border border-amber-100 rounded-lg px-2 py-1">
                  <Calendar size={10} /> Today, 2:30 PM
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={10} /> 30 min
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <motion.button
                whileHover={{ y: -1 }}
                className="py-2 text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
              >
                Join Video Call
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                className="py-2 text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-colors"
              >
                Reschedule
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
