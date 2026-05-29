"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Heart, Activity, Thermometer, Droplets, Shield, Phone, Mail,
  MapPin, Calendar, Clock, ChevronDown, ChevronUp, Search, Filter,
  Download, FileText, Zap, AlertTriangle, CheckCircle, Star, Brain,
  Pill, Stethoscope, TrendingUp, TrendingDown, Eye, Printer, Share2,
  Award, AlertCircle, MoreHorizontal, ArrowRight, RefreshCw, Cpu,
  FlaskConical, Microscope, Scan, Radio, Syringe, HeartPulse,
  BedDouble, ClipboardList, UserCheck, Flame, ChevronRight,
  ChevronLeft
} from "lucide-react";
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

// ─── Sample Data ──────────────────────────────────────────────────────────────

const timelineEvents: TimelineEvent[] = [
  { id: 1, date: "May 12, 2025", type: "emergency", title: "Cardiac Emergency", description: "Patient brought in with acute chest pain and shortness of breath. ECG showed ST-elevation. Immediate intervention required.", doctor: "Dr. Priya Sharma", hospital: "AIIMS Raipur", expanded: false },
  { id: 2, date: "May 13, 2025", type: "admission", title: "ICU Admission", description: "Admitted to Cardiac ICU for 72-hour monitoring. Stabilization with IV medications. Continuous telemetry monitoring established.", doctor: "Dr. Rahul Mehta", hospital: "AIIMS Raipur", expanded: false },
  { id: 3, date: "May 15, 2025", type: "treatment", title: "Angioplasty Procedure", description: "Successful percutaneous coronary intervention (PCI) performed. Stent placement in LAD artery. Procedure duration: 2h 15min.", doctor: "Dr. Priya Sharma", hospital: "AIIMS Raipur", expanded: false },
  { id: 4, date: "May 22, 2025", type: "recovery", title: "Discharged & Recovery Phase", description: "Patient discharged with cardiac rehabilitation plan. Follow-up in 2 weeks. Medications prescribed and lifestyle modifications advised.", doctor: "Dr. Anjali Verma", hospital: "LifeLine Clinic Raipur", expanded: false },
];

const medicalRecords: MedicalRecord[] = [
  { id: 1, date: "May 12, 2025", diagnosis: "Acute Myocardial Infarction", doctor: "Dr. Priya Sharma", hospital: "AIIMS Raipur", status: "completed" },
  { id: 2, date: "Mar 5, 2025", diagnosis: "Hypertension Stage II", doctor: "Dr. Rahul Mehta", hospital: "LifeLine Clinic", status: "ongoing" },
  { id: 3, date: "Jan 18, 2025", diagnosis: "Type 2 Diabetes Mellitus", doctor: "Dr. Anjali Verma", hospital: "Apollo Raipur", status: "ongoing" },
  { id: 4, date: "Nov 22, 2024", diagnosis: "Lumbar Spondylosis", doctor: "Dr. Vikram Singh", hospital: "LifeLine Clinic", status: "stable" },
  { id: 5, date: "Sep 9, 2024", diagnosis: "Community Acquired Pneumonia", doctor: "Dr. Priya Sharma", hospital: "AIIMS Raipur", status: "completed" },
  { id: 6, date: "Jul 14, 2024", diagnosis: "Acute Bronchitis", doctor: "Dr. Rahul Mehta", hospital: "LifeLine Clinic", status: "completed" },
];

const prescriptions: Prescription[] = [
  { id: 1, medication: "Aspirin", dosage: "75 mg", frequency: "Once daily", duration: "Lifelong", doctor: "Dr. Priya Sharma", status: "active", category: "Antiplatelet", startDate: "May 22, 2025" },
  { id: 2, medication: "Atorvastatin", dosage: "40 mg", frequency: "Once at night", duration: "Lifelong", doctor: "Dr. Priya Sharma", status: "active", category: "Statin", startDate: "May 22, 2025" },
  { id: 3, medication: "Metoprolol", dosage: "25 mg", frequency: "Twice daily", duration: "6 months", doctor: "Dr. Rahul Mehta", status: "active", category: "Beta Blocker", startDate: "May 13, 2025" },
  { id: 4, medication: "Metformin", dosage: "500 mg", frequency: "Twice daily", duration: "Ongoing", doctor: "Dr. Anjali Verma", status: "active", category: "Antidiabetic", startDate: "Jan 18, 2025" },
  { id: 5, medication: "Amlodipine", dosage: "5 mg", frequency: "Once daily", duration: "Ongoing", doctor: "Dr. Rahul Mehta", status: "active", category: "CCB", startDate: "Mar 5, 2025" },
  { id: 6, medication: "Azithromycin", dosage: "500 mg", frequency: "Once daily", duration: "5 days", doctor: "Dr. Priya Sharma", status: "completed", category: "Antibiotic", startDate: "Sep 9, 2024" },
];

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

const emergencyHistory = [
  { id: 1, type: "Cardiac Arrest (STEMI)", date: "May 12, 2025", location: "Home, Raipur", response: "8 min", hospital: "AIIMS Raipur", outcome: "Survived" },
  { id: 2, type: "Hypertensive Crisis", date: "Nov 4, 2024", location: "Workplace", response: "12 min", hospital: "LifeLine Clinic", outcome: "Stabilized" },
  { id: 3, type: "Hypoglycemic Episode", date: "Aug 19, 2024", location: "Mall, Raipur", response: "6 min", hospital: "Apollo Raipur", outcome: "Recovered" },
];

const labReports = [
  { id: 1, name: "Complete Blood Count", date: "May 20, 2025", type: "Blood Test", status: "Normal", icon: FlaskConical },
  { id: 2, name: "12-Lead ECG Report", date: "May 12, 2025", type: "ECG", status: "Abnormal", icon: HeartPulse },
  { id: 3, name: "Cardiac MRI", date: "May 16, 2025", type: "MRI", status: "Review", icon: Scan },
  { id: 4, name: "Chest X-Ray", date: "May 12, 2025", type: "X-Ray", status: "Normal", icon: Radio },
  { id: 5, name: "HbA1c Profile", date: "Apr 10, 2025", type: "Blood Test", status: "Borderline", icon: Microscope },
  { id: 6, name: "Lipid Panel", date: "Apr 10, 2025", type: "Blood Test", status: "Abnormal", icon: FlaskConical },
];

const recentActivity = [
  { time: "2h ago", event: "Lab Report Updated", detail: "Lipid panel results uploaded by Dr. Priya Sharma", type: "lab", color: "#5373A5" },
  { time: "1d ago", event: "Prescription Renewed", detail: "Metoprolol 25mg renewed for 3 months", type: "prescription", color: "#22c55e" },
  { time: "3d ago", event: "Teleconsultation", detail: "Follow-up with Dr. Rahul Mehta — BP stabilizing", type: "consultation", color: "#f59e0b" },
  { time: "5d ago", event: "Emergency Alert Cleared", detail: "Post-cardiac event monitoring completed", type: "emergency", color: "#ef4444" },
  { time: "1w ago", event: "Vital Signs Logged", detail: "SpO2: 98%, HR: 72 bpm — All normal", type: "vitals", color: "#8b5cf6" },
  { time: "2w ago", event: "Discharged from AIIMS", detail: "Cardiac rehabilitation plan initiated", type: "discharge", color: "#06b6d4" },
];

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
  recovery: { color: "#22c55e", bg: "bg-green-50", border: "border-green-200", icon: HeartPulse, label: "Recovery" },
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

function PatientOverview() {
  const stats = [
    { label: "Total Visits", value: "47", icon: ClipboardList, color: "#5373A5" },
    { label: "Emergency Cases", value: "3", icon: AlertTriangle, color: "#ef4444" },
    { label: "Admissions", value: "5", icon: BedDouble, color: "#f59e0b" },
    { label: "Active Meds", value: "5", icon: Pill, color: "#22c55e" },
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
              <h1 className="text-2xl font-bold text-gray-900">Arjun Kumar</h1>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Verified</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1"><User size={13} /> Age: <strong>52</strong></span>
              <span className="flex items-center gap-1"><Droplets size={13} style={{ color: "#ef4444" }} /> <strong>O+</strong></span>
              <span className="flex items-center gap-1"><Shield size={13} style={{ color: "#22c55e" }} /> HDFC ERGO</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Phone size={11} /> +91 98765 43210</span>
              <span className="flex items-center gap-1"><Mail size={11} /> arjun.kumar@email.com</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> Raipur, CG</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-200 mx-2" />

        {/* Extra Info */}
        <div className="flex flex-wrap gap-4 lg:flex-1 items-center">
          <div className="bg-blue-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Emergency ID</p>
            <p className="text-sm font-bold text-gray-800">LL-EMG-2025-0472</p>
          </div>
          <div className="bg-green-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Insurance</p>
            <p className="text-sm font-bold text-green-700">Active · ₹10L Cover</p>
          </div>
          <div className="bg-purple-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Primary Doctor</p>
            <p className="text-sm font-bold text-gray-800">Dr. Priya Sharma</p>
          </div>
          <div className="bg-amber-50 rounded-2xl px-4 py-3 min-w-[140px]">
            <p className="text-xs text-gray-500 mb-0.5">Last Visit</p>
            <p className="text-sm font-bold text-gray-800">May 22, 2025</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {stats.map((s, i) => (
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

function MedicalTimeline() {
  const [events, setEvents] = useState(timelineEvents);

  const toggle = (id: number) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, expanded: !e.expanded } : e));
  };

  return (
    <motion.div {...fadeUp(0.1)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Activity} title="Medical Timeline" subtitle="Chronological health journey" />
      <div className="relative">
        {/* connector line */}
        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-green-200 rounded-full" />
        <div className="space-y-4">
          {events.map((event, idx) => {
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

function MedicalRecordsTable() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const perPage = 4;

  const filtered = medicalRecords.filter(r =>
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

function PrescriptionHistory() {
  return (
    <motion.div {...fadeUp(0.2)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Pill} title="Prescription History" subtitle="Medication tracking & management" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {prescriptions.map((rx, i) => (
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
      <SectionTitle icon={HeartPulse} title="Vital Trends" subtitle="Last 7 days monitoring" />
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

function EmergencyHistory() {
  return (
    <motion.div {...fadeUp(0.3)} className={`${glassCard} p-6`}>
      <SectionTitle icon={AlertTriangle} title="Emergency History" subtitle="Critical incident records" />
      <div className="space-y-3">
        {emergencyHistory.map((em, i) => (
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
    </motion.div>
  );
}

// ─── Section 7: Lab Reports ───────────────────────────────────────────────────

function LabReports() {
  return (
    <motion.div {...fadeUp(0.35)} className={`${glassCard} p-6`}>
      <SectionTitle icon={FlaskConical} title="Lab Reports" subtitle="Diagnostic test archive" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {labReports.map((lab, i) => (
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
    </motion.div>
  );
}

// ─── Section 8: Current Health Status ────────────────────────────────────────

function CurrentHealthStatus() {
  const riskScore = 68;

  return (
    <motion.div {...fadeUp(0.4)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Shield} title="Current Health Status" subtitle="Real-time health indicators" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Blood Group</p>
          <div className="flex items-center gap-2"><Droplets size={20} className="text-red-500" /><span className="text-2xl font-black text-red-600">O+</span></div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2">Allergies</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {["Penicillin", "Sulfa Drugs", "Ibuprofen"].map(a => (
              <span key={a} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{a}</span>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Chronic Conditions</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {["CAD", "Hypertension", "T2DM"].map(c => (
              <span key={c} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{c}</span>
            ))}
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Active Medications</p>
          <p className="text-3xl font-black text-green-600">5</p>
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

function RecentActivityFeed() {
  return (
    <motion.div {...fadeUp(0.45)} className={`${glassCard} p-6`}>
      <SectionTitle icon={Clock} title="Recent Activity" subtitle="Latest updates & interactions" />
      <div className="space-y-3">
        {recentActivity.map((a, i) => (
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
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function PatientHistory() {
  return (
    <div
      className="w-full p-6"
      style={{
        background:
          "linear-gradient(145deg, #f0f4ff 0%, #e8f0fd 50%, #f5f7ff 100%)",
      }}
    >

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
      <PatientOverview />

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MedicalTimeline />
        <VitalTrends />
      </div>

      <div className="mb-6"><MedicalRecordsTable /></div>
      <div className="mb-6"><PrescriptionHistory /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EmergencyHistory />
        <CurrentHealthStatus />
      </div>

      <div className="mb-6"><LabReports /></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2"><RecentActivityFeed /></div>
        <div />
      </div>

      <AIHealthInsights />
    </div>
  );
}