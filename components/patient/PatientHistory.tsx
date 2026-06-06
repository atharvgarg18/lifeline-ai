"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Heart, Activity, Thermometer, Droplets, Shield, Phone, Mail,
  MapPin, Calendar, Clock, ChevronDown, ChevronUp, Search, Filter,
  Download, FileText, Zap, AlertTriangle, CheckCircle, Star, Brain,
  Pill, Stethoscope, TrendingUp, TrendingDown, Eye, Printer, Share2,
  Award, AlertCircle, MoreHorizontal, ArrowRight, RefreshCw, Cpu,
  FlaskConical, Microscope, Scan, Radio, Syringe,
  BedDouble, ClipboardList, UserCheck, Flame, ChevronRight,
  ChevronLeft
} from "lucide-react";
import { getMedicalHistory, getProfile } from "@/lib/patientApi";
import { useAuth } from "@/context/AuthContext";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineEvent {
  id: number;
  date: string;
  type: "emergency" | "admission" | "treatment" | "recovery";
  title: string;
  description: string;
  doctor: string;
  hospital: string;
  expanded?: boolean;
}

interface MedicalRecord {
  id: number;
  date: string;
  diagnosis: string;
  doctor: string;
  hospital: string;
  status: "completed" | "ongoing" | "critical" | "stable";
}

interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor: string;
  status: "active" | "completed" | "discontinued";
  category: string;
  startDate: string;
}

interface LabReport {
  id: number;
  name: string;
  date: string;
  type: string;
  status: string;
  icon: any;
}

interface ActivityItem {
  time: string;
  event: string;
  detail: string;
  type: string;
  color: string;
}

interface ProfileData {
  healthIdNumber?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  medications?: { name: string; dosage: string; frequency: string }[];
  prescriptions?: { medicationName: string; dosage: string; frequency: string; prescribedBy: string; prescribedAt: string; duration?: string }[];
  insuranceDetails?: { providerName?: string; coverageAmount?: number };
}

interface OverviewStats {
  totalVisits: number;
  emergencyCases: number;
  admissions: number;
  activeMeds: number;
}

interface HistoryRecord {
  recordType: "EMERGENCY" | "APPOINTMENT" | "PRESCRIPTION";
  createdAt?: string;
  scheduledAt?: string;
  prescribedAt?: string;
  emergencyType?: string;
  description?: string;
  status?: string;
  location?: { address?: string; city?: string; state?: string };
  reason?: string;
  specialization?: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  prescribedBy?: string;
  completedAt?: string;
  estimatedArrivalTime?: number;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const normalizeStatus = (status?: string): MedicalRecord["status"] => {
  const lowered = (status || "").toLowerCase();
  if (lowered.includes("critical")) return "critical";
  if (lowered.includes("stable")) return "stable";
  if (lowered.includes("complete") || lowered.includes("discharg")) return "completed";
  return "ongoing";
};

// ─── Sample Data ──────────────────────────────────────────────────────────────

const heartRateData = [
  { time: "Mon", value: 88 }, { time: "Tue", value: 82 }, { time: "Wed", value: 79 },
  { time: "Thu", value: 85 }, { time: "Fri", value: 76 }, { time: "Sat", value: 72 }, { time: "Sun", value: 74 },
];

const bpData = [
  { time: "Mon", systolic: 148, diastolic: 94 }, { time: "Tue", systolic: 142, diastolic: 90 },
  { time: "Wed", systolic: 138, diastolic: 88 }, { time: "Thu", systolic: 135, diastolic: 86 },
  { time: "Fri", systolic: 132, diastolic: 85 }, { time: "Sat", systolic: 130, diastolic: 84 }, { time: "Sun", systolic: 128, diastolic: 82 },
];

const spo2Data = [
  { time: "Mon", value: 96 }, { time: "Tue", value: 97 }, { time: "Wed", value: 98 },
  { time: "Thu", value: 97 }, { time: "Fri", value: 98 }, { time: "Sat", value: 99 }, { time: "Sun", value: 98 },
];

const labReports: LabReport[] = [];
const recentActivity: ActivityItem[] = [];

// ─── Sub-components ───────────────────────────────────────────────────────────

const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(83,115,165,0.12)] rounded-3xl";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const typeConfig = {
  emergency: { color: "#ef4444", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle, label: "Emergency" },
  admission: { color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", icon: BedDouble, label: "Admission" },
  treatment: { color: "#5373A5", bg: "bg-blue-50", border: "border-blue-200", icon: Stethoscope, label: "Treatment" },
  recovery: { color: "#22c55e", bg: "bg-green-50", border: "border-green-200", icon: Heart, label: "Recovery" },
};

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  ongoing: "bg-blue-100 text-blue-700",
  critical: "bg-red-100 text-red-700",
  stable: "bg-amber-100 text-amber-700",
  active: "bg-blue-100 text-blue-700",
  discontinued: "bg-gray-100 text-gray-500",
  Normal: "bg-green-100 text-green-700",
  Abnormal: "bg-red-100 text-red-700",
  Review: "bg-amber-100 text-amber-700",
  Borderline: "bg-orange-100 text-orange-700",
};

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5373A5 0%, #3a5a8f 100%)" }}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-800 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Section 1: Patient Overview ──────────────────────────────────────────────

function PatientOverview({
  profile,
  userName,
  userEmail,
  userPhone,
  stats,
}: {
  profile: ProfileData | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  stats: OverviewStats;
}) {
  const summaryStats = [
    { label: "Total Visits", value: String(stats.totalVisits), icon: ClipboardList, color: "#5373A5" },
    { label: "Emergency Cases", value: String(stats.emergencyCases), icon: AlertTriangle, color: "#ef4444" },
    { label: "Admissions", value: String(stats.admissions), icon: BedDouble, color: "#f59e0b" },
    { label: "Active Meds", value: String(stats.activeMeds), icon: Pill, color: "#22c55e" },
  ];

  return (
    <motion.div {...fadeUp(0)} className={`${glassCard} p-6 mb-6`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile */}
        <div className="flex flex-col sm:flex-row gap-5 lg:w-auto">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg ring-4 ring-white">
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
                style={{ background: "linear-gradient(135deg, #5373A5, #3a5a8f)" }}>
                AK
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{userName || "Patient"}</h1>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Verified</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1"><User size={13} /> Age: <strong>—</strong></span>
              <span className="flex items-center gap-1"><Droplets size={13} style={{ color: "#ef4444" }} /> <strong>{profile?.bloodGroup || "UNKNOWN"}</strong></span>
              <span className="flex items-center gap-1"><Shield size={13} style={{ color: "#22c55e" }} /> {profile?.insuranceDetails?.providerName || "—"}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Phone size={11} /> {userPhone || "—"}</span>
              <span className="flex items-center gap-1"><Mail size={11} /> {userEmail || "—"}</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> —</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-200 mx-2" />

        {/* Extra Info */}
        <div className="flex flex-wrap gap-4 lg:flex-1 items-center">
          <div className="bg-blue-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Emergency ID</p>
            <p className="text-sm font-bold text-gray-800">{profile?.healthIdNumber || "—"}</p>
          </div>
          <div className="bg-green-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Insurance</p>
            <p className="text-sm font-bold text-green-700">
              {profile?.insuranceDetails?.coverageAmount
                ? `Active · ₹${profile.insuranceDetails.coverageAmount} Cover`
                : "—"}
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Primary Doctor</p>
            <p className="text-sm font-bold text-gray-800">—</p>
          </div>
          <div className="bg-amber-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Last Visit</p>
            <p className="text-sm font-bold text-gray-800">—</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {summaryStats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(0.1 + i * 0.05)}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: `${s.color}12` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Section 2: Medical Timeline ──────────────────────────────────────────────

function MedicalTimeline({ events }: { events: TimelineEvent[] }) {
  const [items, setItems] = useState(events);

  useEffect(() => {
    setItems(events);
  }, [events]);

  const toggle = (id: number) => {
    setItems(prev => prev.map(e => e.id === id ? { ...e, expanded: !e.expanded } : e));
  };

  return (
    <motion.div {...fadeUp(0.1)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Activity} title="Medical Timeline" subtitle="Chronological health journey" />
      <div className="relative">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No medical timeline entries yet.</p>
        ) : null}
        {/* connector line */}
        {items.length > 0 ? (
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-green-200 rounded-full" />
        ) : null}
        <div className="space-y-4">
          {items.map((event, idx) => {
            const cfg = typeConfig[event.type];
            const Icon = cfg.icon;
            return (
              <motion.div key={event.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }} className="relative pl-14">
                {/* dot */}
                <div className="absolute left-2.5 top-3 w-5 h-5 rounded-full border-2 border-white shadow flex items-center justify-center z-10"
                  style={{ background: cfg.color }}>
                  <Icon size={10} className="text-white" />
                </div>
                <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 cursor-pointer`}
                  onClick={() => toggle(event.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: cfg.color }}>{cfg.label}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10} /> {event.date}</span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{event.title}</p>
                    </div>
                    {event.expanded ? <ChevronUp size={14} className="text-gray-400 mt-1 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 mt-1 shrink-0" />}
                  </div>
                  <AnimatePresence>
                    {event.expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-white/60 space-y-1">
                          <p className="text-xs text-gray-600">{event.description}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><UserCheck size={10} /> {event.doctor}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} /> {event.hospital}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section 3: Medical Records Table ─────────────────────────────────────────

function MedicalRecordsTable({ records }: { records: MedicalRecord[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const perPage = 4;

  const filtered = records.filter(r =>
    (filter === "all" || r.status === filter) &&
    (r.diagnosis.toLowerCase().includes(search.toLowerCase()) || r.doctor.toLowerCase().includes(search.toLowerCase()))
  );
  const pages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice(page * perPage, page * perPage + perPage);

  return (
    <motion.div {...fadeUp(0.15)} className={`${glassCard} p-6`}>
      <SectionTitle icon={FileText} title="Medical Records" subtitle="Complete diagnostic history" />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search diagnosis or doctor…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="stable">Stable</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {visible.length === 0 ? (
          <p className="text-sm text-gray-500">No medical records available.</p>
        ) : (
          <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Date", "Diagnosis", "Doctor", "Hospital", "Status"].map(h => (
                <th key={h} className="text-left pb-3 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map(r => (
              <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap text-xs">{r.date}</td>
                <td className="py-3 pr-4 font-medium text-gray-800">{r.diagnosis}</td>
                <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{r.doctor}</td>
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{r.hospital}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 disabled:opacity-40 hover:bg-blue-100 flex items-center justify-center transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 disabled:opacity-40 hover:bg-blue-100 flex items-center justify-center transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Section 4: Prescription History ──────────────────────────────────────────

function PrescriptionHistory({ items }: { items: Prescription[] }) {
  return (
    <motion.div {...fadeUp(0.2)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Pill} title="Prescription History" subtitle="Medication tracking & management" />
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No prescriptions available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((rx, i) => (
            <motion.div key={rx.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-4 border ${rx.status === "active" ? "bg-blue-50/60 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm">
                    <Pill size={14} style={{ color: rx.status === "active" ? "#5373A5" : "#9ca3af" }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{rx.medication}</p>
                    <p className="text-xs text-gray-400">{rx.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[rx.status]}`}>{rx.status}</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600 mt-3">
                <div className="flex justify-between"><span className="text-gray-400">Dosage</span><span className="font-medium">{rx.dosage}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Frequency</span><span className="font-medium">{rx.frequency}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Duration</span><span className="font-medium">{rx.duration}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Prescribed by</span><span className="font-medium">{rx.doctor}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Section 5: Vital Trends ──────────────────────────────────────────────────

const CustomTooltipStyle = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "8px 12px",
  fontSize: "12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

function VitalTrends() {
  return (
    <motion.div {...fadeUp(0.25)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Heart} title="Vital Trends" subtitle="Last 7 days monitoring" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Heart Rate */}
        <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-red-500" />
              <span className="text-sm font-semibold text-gray-700">Heart Rate</span>
            </div>
            <span className="text-lg font-bold text-red-500">74 <span className="text-xs font-normal text-gray-400">bpm</span></span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={heartRateData}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#hrGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Pressure */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Activity size={14} style={{ color: "#5373A5" }} />
              <span className="text-sm font-semibold text-gray-700">Blood Pressure</span>
            </div>
            <span className="text-lg font-bold" style={{ color: "#5373A5" }}>128/82 <span className="text-xs font-normal text-gray-400">mmHg</span></span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={bpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 160]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Line type="monotone" dataKey="systolic" stroke="#5373A5" strokeWidth={2} dot={false} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#93c5fd" strokeWidth={2} dot={false} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SpO2 */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Droplets size={14} className="text-purple-500" />
              <span className="text-sm font-semibold text-gray-700">SpO₂</span>
            </div>
            <span className="text-lg font-bold text-purple-600">98% <span className="text-xs font-normal text-gray-400">sat</span></span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={spo2Data}>
              <defs>
                <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <ReferenceLine y={95} stroke="#8b5cf6" strokeDasharray="3 3" strokeWidth={1} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#spo2Grad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section 6: Emergency History ────────────────────────────────────────────

function EmergencyHistory({ items }: { items: { id: number; type: string; date: string; location: string; response: string; hospital: string; outcome: string }[] }) {
  return (
    <motion.div {...fadeUp(0.3)} className={`${glassCard} p-6`}>
      <SectionTitle icon={AlertTriangle} title="Emergency History" subtitle="Critical incident records" />
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No emergency records yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((em, i) => (
            <motion.div key={em.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-red-50/40 border border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                <Flame size={16} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">{em.type}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={10} />{em.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{em.location}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />Response: {em.response}</span>
                  <span className="flex items-center gap-1"><BedDouble size={10} />{em.hospital}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 shrink-0">{em.outcome}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Section 7: Lab Reports ───────────────────────────────────────────────────

function LabReports({ items }: { items: LabReport[] }) {
  return (
    <motion.div {...fadeUp(0.35)} className={`${glassCard} p-6`}>
      <SectionTitle icon={FlaskConical} title="Lab Reports" subtitle="Diagnostic test archive" />
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No lab reports available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((lab, i) => (
            <motion.div key={lab.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#5373A512" }}>
                <lab.icon size={16} style={{ color: "#5373A5" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight">{lab.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lab.type} · {lab.date}</p>
                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[lab.status]}`}>{lab.status}</span>
              </div>
              <button className="shrink-0 w-8 h-8 rounded-xl bg-gray-50 hover:bg-blue-50 flex items-center justify-center transition-colors group">
                <Download size={13} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Section 8: Current Health Status ────────────────────────────────────────

function CurrentHealthStatus({ profile }: { profile: ProfileData | null }) {
  const riskScore = 68;
  const allergies = profile?.allergies?.length ? profile.allergies : [];
  const chronic = profile?.chronicDiseases?.length ? profile.chronicDiseases : [];
  const activeMeds = profile?.medications?.length ?? 0;

  return (
    <motion.div {...fadeUp(0.4)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Shield} title="Current Health Status" subtitle="Real-time health indicators" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Blood Group</p>
          <div className="flex items-center gap-2"><Droplets size={20} className="text-red-500" /><span className="text-2xl font-black text-red-600">{profile?.bloodGroup || "UNKNOWN"}</span></div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2">Allergies</p>
          {allergies.length ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {allergies.map(a => (
                <span key={a} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{a}</span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No allergies recorded</p>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Chronic Conditions</p>
          {chronic.length ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {chronic.map(c => (
                <span key={c} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{c}</span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No chronic conditions listed</p>
          )}
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Active Medications</p>
          <p className="text-3xl font-black text-green-600">{activeMeds}</p>
          <p className="text-xs text-gray-400 mt-0.5">drugs currently</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 col-span-1 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">Risk Score</p>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#e9d5ff" strokeWidth="7" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#8b5cf6" strokeWidth="7"
                  strokeDasharray={`${(riskScore / 100) * 163} 163`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-purple-600">{riskScore}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Moderate Risk</p>
              <p className="text-xs text-gray-400">Cardiac event probability elevated. Regular monitoring required.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last Updated</p>
          <p className="text-sm font-bold text-gray-700">May 29, 2025</p>
          <p className="text-xs text-gray-400">Auto-synced from devices</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section 9: AI Health Insights ────────────────────────────────────────────

function AIHealthInsights() {
  const insights = [
    { label: "Recovery Score", value: "72%", trend: "+8% this week", icon: TrendingUp, color: "#22c55e", positive: true },
    { label: "Risk Prediction", value: "Moderate", trend: "Down from High", icon: AlertCircle, color: "#f59e0b", positive: true },
    { label: "Next Checkup", value: "Jun 5", trend: "Cardiology", icon: Calendar, color: "#5373A5", positive: true },
    { label: "AI Confidence", value: "94%", trend: "Based on 47 visits", icon: Cpu, color: "#8b5cf6", positive: true },
  ];

  const suggestions = [
    "Walk 30 minutes daily — cardiac rehabilitation protocol",
    "Reduce sodium intake to <1500mg/day for BP control",
    "Monitor blood glucose 2x daily and log readings",
    "Schedule stress echocardiogram in 6 weeks",
    "Yoga or meditation recommended for anxiety management",
  ];

  return (
    <motion.div {...fadeUp(0.5)}
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5282 50%, #1a3a6b 100%)" }}>
      {/* bg orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #5373A5, transparent)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #60a5fa, transparent)", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Health Insights</h2>
            <p className="text-xs text-blue-300">Powered by LifeLine Neural Engine v4.2</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-300">Live Analysis</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {insights.map((ins, i) => (
            <motion.div key={ins.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <ins.icon size={16} style={{ color: ins.color }} className="mb-2" />
              <p className="text-xl font-black text-white">{ins.value}</p>
              <p className="text-xs text-blue-300 mt-0.5">{ins.label}</p>
              <p className="text-xs mt-1" style={{ color: ins.positive ? "#4ade80" : "#f87171" }}>{ins.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="bg-white/8 border border-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Star size={14} className="text-yellow-400" /> Lifestyle Recommendations
          </p>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.07 }}
                className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={10} className="text-blue-300" />
                </div>
                <p className="text-xs text-blue-100">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section 10: Recent Activity Feed ─────────────────────────────────────────

function RecentActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <motion.div {...fadeUp(0.45)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Clock} title="Recent Activity" subtitle="Latest updates & interactions" />
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: a.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-800 text-sm">{a.event}</p>
                  <span className="text-xs text-gray-400 shrink-0">{a.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{a.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function PatientHistory() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          getProfile().catch(() => null),
          getMedicalHistory(1, 50).catch(() => null),
        ]);

        if (!active) return;

        setProfile(profileRes);

        const historyData = historyRes && Array.isArray((historyRes as any).data)
          ? (historyRes as any).data
          : Array.isArray(historyRes)
          ? historyRes
          : (historyRes as any)?.data?.data ?? [];

        setRecords(historyData as HistoryRecord[]);
      } catch (err) {
        if (active) setError("Unable to load patient history.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const timelineEvents = useMemo((): TimelineEvent[] => {
    return records.map((record, index) => {
      const date = formatDate(record.createdAt || record.scheduledAt || record.prescribedAt);
      const type = record.recordType === "EMERGENCY"
        ? "emergency"
        : record.recordType === "APPOINTMENT"
        ? "admission"
        : "treatment";
      const title = record.recordType === "EMERGENCY"
        ? `Emergency: ${record.emergencyType || "Event"}`
        : record.recordType === "APPOINTMENT"
        ? `Appointment: ${record.specialization || record.reason || "Consultation"}`
        : `Prescription: ${record.medicationName || "Medication"}`;
      const description = record.description || record.reason || `${record.medicationName || "Medication"} ${record.dosage || ""} ${record.frequency || ""}`.trim() || "Record updated";

      return {
        id: index + 1,
        date,
        type,
        title,
        description,
        doctor: record.prescribedBy || record.specialization || "Assigned clinician",
        hospital: record.location?.city || "LifeLine Network",
        expanded: false,
      };
    });
  }, [records]);

  const medicalRecords = useMemo((): MedicalRecord[] => {
    return records
      .filter((r) => r.recordType !== "PRESCRIPTION")
      .map((record, index) => ({
        id: index + 1,
        date: formatDate(record.createdAt || record.scheduledAt),
        diagnosis: record.recordType === "EMERGENCY"
          ? record.emergencyType || "Emergency Event"
          : record.reason || record.specialization || "Appointment",
        doctor: record.specialization || "Assigned clinician",
        hospital: record.location?.city || "LifeLine Network",
        status: normalizeStatus(record.status),
      }));
  }, [records]);

  const prescriptions = useMemo((): Prescription[] => {
    const fromHistory = records
      .filter((r) => r.recordType === "PRESCRIPTION")
      .map((record, index) => ({
        id: index + 1,
        medication: record.medicationName || "Medication",
        dosage: record.dosage || "—",
        frequency: record.frequency || "—",
        duration: record.duration || "Ongoing",
        doctor: record.prescribedBy || "Assigned clinician",
        status: "active" as const,
        category: "Prescription",
        startDate: formatDate(record.prescribedAt),
      }));

    if (fromHistory.length) return fromHistory;

    return (profile?.prescriptions || []).map((record, index) => ({
      id: index + 1,
      medication: record.medicationName,
      dosage: record.dosage,
      frequency: record.frequency,
      duration: record.duration || "Ongoing",
      doctor: record.prescribedBy,
      status: "active" as const,
      category: "Prescription",
      startDate: formatDate(record.prescribedAt),
    }));
  }, [records, profile]);

  const emergencyItems = useMemo(() => {
    return records
      .filter((r) => r.recordType === "EMERGENCY")
      .map((record, index) => ({
        id: index + 1,
        type: record.emergencyType || "Emergency",
        date: formatDate(record.createdAt),
        location: record.location?.address || record.location?.city || "—",
        response: record.estimatedArrivalTime ? `${record.estimatedArrivalTime} min` : "—",
        hospital: record.location?.city || "LifeLine Network",
        outcome: record.status ? record.status.replace(/_/g, " ") : "Active",
      }));
  }, [records]);

  const stats = useMemo<OverviewStats>(() => {
    const emergencyCases = records.filter((r) => r.recordType === "EMERGENCY").length;
    const admissions = records.filter((r) => r.recordType === "APPOINTMENT").length;
    return {
      totalVisits: records.length,
      emergencyCases,
      admissions,
      activeMeds: profile?.prescriptions?.length ?? 0,
    };
  }, [records, profile]);

  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const userPhone = user?.phone || "";

  return (
    <div
      className="w-full p-6"
      style={{
        background:
          "linear-gradient(145deg, #f0f4ff 0%, #e8f0fd 50%, #f5f7ff 100%)",
      }}
    >
      {loading ? (
        <div className="mb-4 text-sm text-gray-500">Loading patient history…</div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {/* Page Header */}
      {/* <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Patient History</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete medical record — Arjun Kumar · ID: LL-2025-0472</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #5373A5, #3a5a8f)" }}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </motion.div> */}

      {/* Sections */}
      <PatientOverview
        profile={profile}
        userName={userName}
        userEmail={userEmail}
        userPhone={userPhone}
        stats={stats}
      />

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MedicalTimeline events={timelineEvents} />
        <VitalTrends />
      </div>

      <div className="mb-6"><MedicalRecordsTable records={medicalRecords} /></div>
      <div className="mb-6"><PrescriptionHistory items={prescriptions} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EmergencyHistory items={emergencyItems} />
        <CurrentHealthStatus profile={profile} />
      </div>

      <div className="mb-6"><LabReports items={labReports} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2"><RecentActivityFeed items={recentActivity} /></div>
        <div />
      </div>

      <AIHealthInsights />
    </div>
  );
}