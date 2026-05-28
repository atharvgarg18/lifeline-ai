"use client";

import { useState, useEffect } from "react";
import {
  Navigation,
  Plus,
  Star,
  Phone,
  Brain,
  Stethoscope,
  Pill,
  Clock,
  ChevronRight,
  // Ambulance,
  AlertCircle,
  CheckCircle2,
  Circle,
  Radio,
  UserRound,
  Zap,
  MapPin,
  Building2,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   SECTION CARD WRAPPER
═══════════════════════════════════════════════ */
function Card({
  children,
  className = "",
  glow = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "violet" | "rose" | "amber" | "none";
}) {
  const glowMap = {
    cyan: "hover:shadow-cyan-500/10",
    violet: "hover:shadow-violet-500/10",
    rose: "hover:shadow-rose-500/10",
    amber: "hover:shadow-amber-500/10",
    none: "",
  };
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-[#080f1e] shadow-lg transition-shadow duration-300 hover:shadow-xl ${glowMap[glow]} ${className}`}
    >
      {/* subtle inner top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  badge,
  action,
  iconColor = "text-cyan-400",
}: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-2">
        <span className={`${iconColor} opacity-90`}>{icon}</span>
        <h3 className="text-sm font-bold tracking-wide text-white/85">{title}</h3>
        {badge}
      </div>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LIVE EMERGENCY MAP
═══════════════════════════════════════════════ */
function LiveEmergencyMap() {
  const [eta, setEta] = useState(12);
  useEffect(() => {
    const t = setInterval(() => setEta((e) => (e > 1 ? e - 1 : 12)), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className="w-full">
      <SectionHeader
        icon={<Navigation size={14} />}
        title="Live Emergency Map"
        badge={
          <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        }
      />

      {/* map area */}
      <div className="relative mx-4 mb-4 overflow-hidden rounded-2xl" style={{ height: 220 }}>
        {/* dark map base */}
        <div className="absolute inset-0 bg-[#0a1628]">
          {/* grid lines */}
          <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#22d3ee" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapgrid)" />
          </svg>

          {/* road lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 220" preserveAspectRatio="none">
            {/* horizontal roads */}
            <line x1="0" y1="80" x2="540" y2="80" stroke="#1e3a5f" strokeWidth="6" />
            <line x1="0" y1="140" x2="540" y2="140" stroke="#1e3a5f" strokeWidth="4" />
            <line x1="0" y1="170" x2="540" y2="180" stroke="#162942" strokeWidth="3" />
            {/* vertical roads */}
            <line x1="120" y1="0" x2="120" y2="220" stroke="#1e3a5f" strokeWidth="5" />
            <line x1="280" y1="0" x2="280" y2="220" stroke="#162942" strokeWidth="3" />
            <line x1="420" y1="0" x2="420" y2="220" stroke="#1e3a5f" strokeWidth="4" />
            {/* diagonal accent */}
            <line x1="0" y1="50" x2="200" y2="130" stroke="#132236" strokeWidth="3" />
            <line x1="300" y1="60" x2="540" y2="160" stroke="#132236" strokeWidth="3" />

            {/* green corridor route */}
            <path
              d="M 145 175 C 180 140 220 110 260 100 C 310 88 350 84 395 82"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="10 5"
              opacity="0.8"
            />
            {/* ambulance dot animated along route */}
            <circle cx="260" cy="100" r="5" fill="#10b981" opacity="0.6">
              <animate attributeName="cx" values="145;395" dur="8s" repeatCount="indefinite" />
              <animate attributeName="cy" values="175;82" dur="8s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Patient Location pin */}
          <div className="absolute" style={{ left: "22%", top: "68%" }}>
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/40">
                <MapPin size={14} className="text-cyan-300" />
              </div>
              <div className="absolute -bottom-5 whitespace-nowrap rounded-md border border-cyan-500/30 bg-[#0b1628]/90 px-2 py-0.5 text-[9px] font-semibold text-cyan-300 backdrop-blur-sm">
                Patient Location
              </div>
            </div>
          </div>

          {/* Hospital pin */}
          <div className="absolute" style={{ right: "12%", top: "28%" }}>
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-rose-400 bg-rose-500/20 shadow-lg shadow-rose-500/40">
                <Building2 size={13} className="text-rose-300" />
              </div>
              <div className="absolute -bottom-8 right-0 whitespace-nowrap rounded-md border border-rose-500/30 bg-[#0b1628]/90 px-2 py-0.5 text-[9px] font-semibold text-rose-300 backdrop-blur-sm">
                City Care Hospital
                <br />
                <span className="text-white/50">ETA: {eta} mins</span>
              </div>
            </div>
          </div>

          {/* Ambulance emoji-style marker */}
          <div
            className="absolute flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-300 shadow-md shadow-emerald-500/20 backdrop-blur-sm"
            style={{ left: "46%", top: "38%" }}
          >
            {/* <Ambulance size={12} /> */}
            <span>En Route</span>
          </div>

          {/* zoom controls */}
          <div className="absolute right-2 top-2 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0b1628]/80 backdrop-blur-sm">
            <button className="border-b border-white/10 px-2 py-1 text-xs text-white/60 hover:text-cyan-400">
              +
            </button>
            <button className="px-2 py-1 text-xs text-white/60 hover:text-cyan-400">−</button>
          </div>
        </div>
      </div>

      {/* traffic legend */}
      <div className="flex items-center gap-3 border-t border-white/5 px-4 py-2.5 text-[10px] text-white/40">
        <span className="font-semibold text-white/50">Traffic:</span>
        {[
          { color: "bg-emerald-400", label: "Low" },
          { color: "bg-amber-400", label: "Moderate" },
          { color: "bg-orange-500", label: "High" },
          { color: "bg-rose-500", label: "Severe" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            {label}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1">
          <span className="inline-block h-px w-4 border-t-2 border-dashed border-emerald-400" />
          Green Corridor
        </span>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   AI TRIAGE ASSESSMENT
═══════════════════════════════════════════════ */
function AITriageAssessment() {
  const symptoms = ["Chest Pain", "Shortness of Breath", "Dizziness"];
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(94), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card glow="violet">
      <SectionHeader
        icon={<Brain size={14} />}
        title="AI Triage Assessment"
        iconColor="text-violet-400"
      />
      <div className="px-4 pb-4 space-y-3">
        {/* risk level */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/45">Risk Level</span>
          <span className="rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-0.5 text-xs font-bold text-rose-400">
            ⚠ High Risk
          </span>
        </div>

        {/* confidence score */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-white/45">AI Confidence Score</span>
            <Star size={11} className="text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {progress}
            <span className="text-lg text-violet-400">%</span>
          </div>
          {/* progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* symptoms */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Key Symptoms Detected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {symptoms.map((s, i) => (
              <span
                key={s}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                  i === 0
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                    : i === 1
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   VITALS SNAPSHOT  (replaces old AI card's right half)
═══════════════════════════════════════════════ */
function VitalsSnapshot() {
  const vitals = [
    { label: "Heart Rate", value: "92", unit: "bpm", color: "rose", icon: "♥" },
    { label: "BP", value: "120/80", unit: "mmHg", color: "cyan", icon: "⚡" },
    { label: "SpO2", value: "98%", unit: "", color: "emerald", icon: "○" },
    { label: "Temp.", value: "98.6°F", unit: "", color: "amber", icon: "◈" },
    { label: "Resp. Rate", value: "18", unit: "/min", color: "violet", icon: "~" },
    { label: "BMI", value: "22.4", unit: "Normal", color: "emerald", icon: "◻" },
  ];
  const colorMap: Record<string, string> = {
    rose: "text-rose-400 border-rose-500/25 bg-rose-500/8",
    cyan: "text-cyan-400 border-cyan-500/25 bg-cyan-500/8",
    emerald: "text-emerald-400 border-emerald-500/25 bg-emerald-500/8",
    amber: "text-amber-400 border-amber-500/25 bg-amber-500/8",
    violet: "text-violet-400 border-violet-500/25 bg-violet-500/8",
  };

  return (
    <Card>
      <SectionHeader icon={<Zap size={14} />} title="Vitals Snapshot" />
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {vitals.map((v) => (
          <div
            key={v.label}
            className={`rounded-xl border px-2.5 py-2 ${colorMap[v.color]}`}
          >
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/35 mb-0.5">
              {v.label}
            </p>
            <p className={`text-sm font-black leading-tight ${v.color === "rose" ? "text-rose-300" : v.color === "cyan" ? "text-cyan-300" : v.color === "amber" ? "text-amber-300" : v.color === "violet" ? "text-violet-300" : "text-emerald-300"}`}>
              {v.value}
            </p>
            {v.unit && (
              <p className="text-[9px] text-white/35">{v.unit}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   DOCTORS & NURSES ASSIGNED
═══════════════════════════════════════════════ */
const statusStyle: Record<string, string> = {
  "On Duty": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "En Route": "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  "At Hospital": "border-violet-500/30 bg-violet-500/10 text-violet-400",
};

const staff = [
  {
    name: "Dr. Arjun Mehta",
    role: "Assigned Doctor",
    specialty: "General Physician",
    status: "On Duty",
    rating: 4.8,
    initials: "AM",
    isDoctor: true,
  },
  {
    name: "Nurse Priya Sharma",
    role: "ICU Specialist",
    specialty: "",
    status: "En Route",
    initials: "PS",
    isDoctor: false,
  },
  {
    name: "Nurse Amit Singh",
    role: "Cardiac Care",
    specialty: "",
    status: "En Route",
    initials: "AS",
    isDoctor: false,
  },
  {
    name: "Nurse Neha Patel",
    role: "Emergency Care",
    specialty: "",
    status: "At Hospital",
    initials: "NP",
    isDoctor: false,
  },
];

function DoctorsNursesAssigned() {
  return (
    <Card glow="cyan">
      <SectionHeader
        icon={<Stethoscope size={14} />}
        title="Doctors & Nurses Assigned"
        action={
          <button className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300">
            View All
          </button>
        }
      />
      <div className="space-y-2 px-4 pb-4">
        {staff.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2.5">
              {/* avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                  s.isDoctor
                    ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                    : "border border-white/10 bg-white/5 text-white/60"
                }`}
              >
                {s.initials}
              </div>
              <div>
                <p className="text-[12px] font-bold text-white/85 leading-tight">{s.name}</p>
                <p className="text-[10px] text-white/40 leading-tight">{s.role}</p>
                {s.isDoctor && s.rating && (
                  <div className="mt-0.5 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={8}
                        className={i <= Math.round(s.rating) ? "fill-amber-400 text-amber-400" : "text-white/20"}
                      />
                    ))}
                    <span className="ml-1 text-[10px] text-amber-400 font-semibold">{s.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${statusStyle[s.status]}`}
              >
                {s.status}
              </span>
              <button className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-cyan-400">
                <Phone size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   CURRENT DIAGNOSES
═══════════════════════════════════════════════ */
const diagnoses = [
  {
    name: "Asthma",
    type: "Chronic Condition",
    date: "Diagnosed on 12 Jan 2024",
    severity: "Moderate",
    color: "amber",
    icon: "🫁",
  },
  {
    name: "Seasonal Allergic Rhinitis",
    type: "Allergies",
    date: "Diagnosed on 05 Mar 2024",
    severity: "Mild",
    color: "emerald",
    icon: "🌿",
  },
];

function CurrentDiagnoses() {
  return (
    <Card glow="amber">
      <SectionHeader
        icon={<AlertCircle size={14} />}
        title="Current Diagnoses"
        iconColor="text-amber-400"
        action={
          <button className="flex items-center gap-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20">
            <Plus size={10} /> Add
          </button>
        }
      />
      <div className="space-y-2 px-4 pb-4">
        {diagnoses.map((d) => (
          <div
            key={d.name}
            className="flex items-start justify-between gap-2 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-sm ${
                  d.color === "amber"
                    ? "bg-amber-500/10 border border-amber-500/25"
                    : "bg-emerald-500/10 border border-emerald-500/25"
                }`}
              >
                {d.icon}
              </div>
              <div>
                <p className="text-[12px] font-bold text-white/85 leading-tight">{d.name}</p>
                <p className="text-[10px] text-white/40">{d.type}</p>
                <p className="text-[9px] text-white/25 mt-0.5">{d.date}</p>
              </div>
            </div>
            <span
              className={`mt-0.5 shrink-0 rounded-lg border px-2 py-0.5 text-[9px] font-bold ${
                d.severity === "Moderate"
                  ? "border-amber-500/35 bg-amber-500/10 text-amber-400"
                  : "border-emerald-500/35 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {d.severity}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   PRESCRIPTIONS
═══════════════════════════════════════════════ */
const prescriptions = [
  { name: "Montelukast 10mg", note: "1 Tablet at night", time: "09:00 PM", color: "cyan" },
  { name: "Augmentin 625", note: "1 Tablet after food", time: "09:00 AM", color: "violet" },
];

function Prescriptions() {
  return (
    <Card glow="violet">
      <SectionHeader
        icon={<Pill size={14} />}
        title="Prescriptions"
        iconColor="text-violet-400"
        action={
          <button className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300">
            View All
          </button>
        }
      />
      <div className="space-y-2 px-4 pb-4">
        {prescriptions.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border ${
                  p.color === "cyan"
                    ? "border-cyan-500/30 bg-cyan-500/10"
                    : "border-violet-500/30 bg-violet-500/10"
                }`}
              >
                <Pill
                  size={12}
                  className={p.color === "cyan" ? "text-cyan-400" : "text-violet-400"}
                />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white/85 leading-tight">{p.name}</p>
                <p className="text-[10px] text-white/40">{p.note}</p>
              </div>
            </div>
            <span
              className={`text-[11px] font-bold ${
                p.color === "cyan" ? "text-cyan-400" : "text-violet-400"
              }`}
            >
              {p.time}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   EMERGENCY TIMELINE
═══════════════════════════════════════════════ */
const timelineEvents = [
  { time: "08:21 AM", label: "Emergency Reported", status: "done", color: "rose" },
  { time: "08:23 AM", label: "Team Dispatched", status: "done", color: "amber" },
  { time: "08:26 AM", label: "Ambulance On The Way", status: "done", color: "cyan" },
  { time: "08:32 AM", label: "Patient Reached Hospital", status: "active", color: "violet" },
];

const dotColor: Record<string, string> = {
  rose: "bg-rose-500 shadow-rose-500/50",
  amber: "bg-amber-500 shadow-amber-500/50",
  cyan: "bg-cyan-500 shadow-cyan-500/50",
  violet: "bg-violet-500 shadow-violet-500/50",
};

function EmergencyTimeline() {
  return (
    <Card glow="rose">
      <SectionHeader
        icon={<Clock size={14} />}
        title="Emergency Timeline"
        iconColor="text-rose-400"
        action={
          <button className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300">
            View Full
          </button>
        }
      />
      <div className="relative px-4 pb-4">
        {/* vertical line */}
        <div className="absolute left-[28px] top-0 bottom-4 w-px bg-gradient-to-b from-rose-500/30 via-cyan-500/20 to-transparent" />

        <div className="space-y-3">
          {timelineEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-3 pl-1">
              {/* dot */}
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <span
                  className={`h-3 w-3 rounded-full shadow-md ${dotColor[e.color]} ${
                    e.status === "active" ? "animate-pulse" : ""
                  }`}
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[11px] font-medium text-white/70">{e.label}</span>
                <span className="text-[10px] font-semibold text-white/35">{e.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function DashboardMiddleSection() {
  return (
    <div className="w-full bg-[#060d1a] p-4 font-sans">
      {/* 12-column responsive grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* ── LEFT 8 columns ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          {/* Live Map */}
          {/* <LiveEmergencyMap /> */}

          {/* Bottom row: AI Triage + Doctors */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* AI Triage stacked with Vitals */}
            <div className="flex flex-col gap-4">
              {/* <AITriageAssessment /> */}
              {/* <VitalsSnapshot /> */}
            </div>
            {/* Doctors & Nurses */}
            {/* <DoctorsNursesAssigned /> */}
          </div>
        </div>

        {/* ── RIGHT 4 columns ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <CurrentDiagnoses />
          <Prescriptions />
          <EmergencyTimeline />
        </div>
      </div>
    </div>
  );
}
