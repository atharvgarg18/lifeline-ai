"use client";

import { useState } from "react";
import {
  Droplets,
  Activity,
  Phone,
  AlertTriangle,
  Calendar,
  // UserRound,
  Pencil,
  Copy,
  CheckCheck,
} from "lucide-react";

/* ─────────────────────────── types ─────────────────────────── */
interface PatientData {
  initials: string;
  name: string;
  gender: string;
  age: number;
  pid: string;
  bloodGroup: string;
  bp: string;
  phone: string;
  allergies: string[];
  lastVisit: string;
  lastVisitTime: string;
  primaryDoctor: string;
}

/* ─────────────────────────── data ──────────────────────────── */
const patient: PatientData = {
  initials: "RV",
  name: "Rohan Verma",
  gender: "Male",
  age: 24,
  pid: "LHID-2024-7845",
  bloodGroup: "O+",
  bp: "120/80",
  phone: "+91 98765 43210",
  allergies: ["Penicillin", "Pollen"],
  lastVisit: "28 May 2025",
  lastVisitTime: "08:45 AM",
  primaryDoctor: "Dr. Arjun Mehta",
};

/* ────────────────────── sub-components ─────────────────────── */

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = "cyan",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: "cyan" | "rose" | "amber" | "violet" | "emerald";
}) {
  const glowMap = {
    cyan: "group-hover:shadow-cyan-500/20 border-cyan-500/20",
    rose: "group-hover:shadow-rose-500/20 border-rose-500/30",
    amber: "group-hover:shadow-amber-500/20 border-amber-500/20",
    violet: "group-hover:shadow-violet-500/20 border-violet-500/20",
    emerald: "group-hover:shadow-emerald-500/20 border-emerald-500/20",
  };
  const iconMap = {
    cyan: "text-cyan-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };

  return (
    <div
      className={`group relative flex flex-col gap-1 rounded-2xl border bg-white/[0.03] px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:shadow-lg ${glowMap[accent]}`}
    >
      {/* top-left accent line */}
      <span
        className={`absolute left-0 top-3 h-6 w-[2px] rounded-r-full opacity-70 ${
          accent === "cyan"
            ? "bg-cyan-400"
            : accent === "rose"
            ? "bg-rose-400"
            : accent === "amber"
            ? "bg-amber-400"
            : accent === "violet"
            ? "bg-violet-400"
            : "bg-emerald-400"
        }`}
      />
      <div className="flex items-center gap-1.5">
        <span className={`${iconMap[accent]} opacity-80`}>{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          {label}
        </span>
      </div>
      <div className="pl-0.5 text-[15px] font-bold leading-tight text-white/90">
        {value}
      </div>
      {sub && (
        <div className="pl-0.5 text-[10px] text-white/35">{sub}</div>
      )}
    </div>
  );
}

/* ─────────────────────── main component ────────────────────── */
export default function PatientProfileHeader() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(patient.pid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    /* outer wrapper — full-width card */
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b1120] font-sans shadow-2xl shadow-black/60">
      {/* ── animated background grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* ── radial cyan glow top-left ── */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />

      {/* ── top accent bar ── */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/0 via-cyan-400/60 to-cyan-500/0" />

      {/* ── content ── */}
      <div className="relative flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:gap-6">
        {/* ─── LEFT: Avatar + Identity ─── */}
        <div className="flex shrink-0 items-center gap-4">
          {/* avatar ring */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/20 blur-md" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400/60 bg-gradient-to-br from-cyan-500/30 to-teal-600/30 shadow-lg shadow-cyan-500/20 backdrop-blur-sm">
              <span className="text-xl font-black tracking-tight text-cyan-300">
                {patient.initials}
              </span>
            </div>
            {/* online dot */}
            <span className="absolute bottom-0.5 right-0.5 flex h-3 w-3 items-center justify-center rounded-full border border-[#0b1120] bg-emerald-400">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-300 opacity-75" />
            </span>
          </div>

          {/* name block */}
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              {patient.name}
            </h2>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
                {patient.gender}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                {patient.age} Years
              </span>
            </div>
            {/* PID */}
            <button
              onClick={handleCopy}
              className="group mt-1.5 flex items-center gap-1.5 text-[11px] text-white/35 transition-colors hover:text-cyan-400"
            >
              <span>PID: {patient.pid}</span>
              {copied ? (
                <CheckCheck size={11} className="text-emerald-400" />
              ) : (
                <Copy
                  size={11}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                />
              )}
            </button>
          </div>
        </div>

        {/* ─── divider ─── */}
        <div className="hidden h-16 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent md:block" />

        {/* ─── MIDDLE: Stat cards grid ─── */}
        <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {/* Blood Group */}
          <StatCard
            icon={<Droplets size={12} />}
            label="Blood Group"
            value={
              <span className="text-rose-300">{patient.bloodGroup}</span>
            }
            accent="rose"
          />

          {/* BP */}
          <StatCard
            icon={<Activity size={12} />}
            label="BP"
            value={`${patient.bp}`}
            sub="mmHg"
            accent="cyan"
          />

          {/* Phone */}
          <StatCard
            icon={<Phone size={12} />}
            label="Phone"
            value={
              <span className="text-[13px]">{patient.phone}</span>
            }
            accent="emerald"
          />

          {/* Allergies */}
          <StatCard
            icon={<AlertTriangle size={12} />}
            label="Allergies"
            value={
              <span className="flex flex-wrap gap-1">
                {patient.allergies.map((a) => (
                  <span
                    key={a}
                    className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300"
                  >
                    {a}
                  </span>
                ))}
              </span>
            }
            accent="amber"
          />

          {/* Last Visit */}
          <StatCard
            icon={<Calendar size={12} />}
            label="Last Visit"
            value={patient.lastVisit}
            sub={patient.lastVisitTime}
            accent="violet"
          />
        </div>

        {/* ─── RIGHT: Doctor + CTA ─── */}
        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          {/* primary doctor */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-3 py-2 backdrop-blur-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
              {/* <UserRound size={13} className="text-violet-400" /> */}
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-white/35">
                Primary Doctor
              </p>
              <p className="text-[13px] font-bold text-white/85">
                {patient.primaryDoctor}
              </p>
            </div>
          </div>

          {/* edit button */}
          <button className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-teal-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 shadow-md shadow-cyan-500/10 backdrop-blur-sm transition-all duration-200 hover:border-cyan-400/70 hover:shadow-cyan-500/30">
            {/* shimmer sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Pencil size={13} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ── bottom accent bar ── */}
      <div className="h-px w-full bg-gradient-to-r from-cyan-500/0 via-white/5 to-cyan-500/0" />
    </div>
  );
}
