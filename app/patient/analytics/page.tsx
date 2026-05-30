"use client";
import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  Heart, Activity, Moon, Scale, Droplets, Footprints,
  Calendar, TrendingUp, TrendingDown, ChevronDown,
  Filter, Download, Flame, Brain, Pill, Smile,
  ArrowUpRight, ArrowDownRight, Wind, Zap
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const heartRateData = [
  { time: "00:00", bpm: 62 }, { time: "02:00", bpm: 58 }, { time: "04:00", bpm: 60 },
  { time: "06:00", bpm: 75 }, { time: "08:00", bpm: 88 }, { time: "10:00", bpm: 92 },
  { time: "12:00", bpm: 85 }, { time: "14:00", bpm: 79 }, { time: "16:00", bpm: 83 },
  { time: "18:00", bpm: 90 }, { time: "20:00", bpm: 78 }, { time: "22:00", bpm: 68 },
  { time: "24:00", bpm: 63 },
];

const bpData = [
  { time: "00:00", systolic: 118, diastolic: 76 }, { time: "04:00", systolic: 115, diastolic: 74 },
  { time: "08:00", systolic: 122, diastolic: 80 }, { time: "12:00", systolic: 128, diastolic: 84 },
  { time: "16:00", systolic: 125, diastolic: 82 }, { time: "20:00", systolic: 120, diastolic: 78 },
  { time: "24:00", systolic: 116, diastolic: 75 },
];

const sleepData = [
  { time: "22:00", deep: 0, rem: 0, light: 20, awake: 80 },
  { time: "00:00", deep: 60, rem: 10, light: 20, awake: 10 },
  { time: "02:00", deep: 80, rem: 10, light: 10, awake: 0 },
  { time: "04:00", deep: 40, rem: 40, light: 20, awake: 0 },
  { time: "06:00", deep: 20, rem: 60, light: 20, awake: 0 },
  { time: "08:00", deep: 10, rem: 20, light: 50, awake: 20 },
];

const weightData = [
  { date: "28 May", kg: 72.1 }, { date: "04 Jun", kg: 71.6 }, { date: "11 Jun", kg: 71.0 },
  { date: "18 Jun", kg: 70.7 }, { date: "25 Jun", kg: 70.5 },
];

const weeklyTrends = [
  { day: "Mon", thisWeek: 7200, lastWeek: 6100 }, { day: "Tue", thisWeek: 8500, lastWeek: 7800 },
  { day: "Wed", thisWeek: 6800, lastWeek: 7200 }, { day: "Thu", thisWeek: 9200, lastWeek: 8100 },
  { day: "Fri", thisWeek: 7600, lastWeek: 6900 }, { day: "Sat", thisWeek: 10200, lastWeek: 9400 },
  { day: "Sun", thisWeek: 5400, lastWeek: 4800 },
];

const activityData = [
  { name: "Walking", value: 47, color: "#3b82f6", hrs: "1.5 hrs" },
  { name: "Running", value: 25, color: "#8b5cf6", hrs: "0.8 hrs" },
  { name: "Cycling", value: 18, color: "#f59e0b", hrs: "0.6 hrs" },
  { name: "Other",   value: 10, color: "#10b981", hrs: "0.3 hrs" },
];

const healthScoreCategories = [
  { name: "Vitals",         score: 94, color: "#ef4444" },
  { name: "Activity",       score: 91, color: "#3b82f6" },
  { name: "Sleep",          score: 88, color: "#8b5cf6" },
  { name: "Nutrition",      score: 93, color: "#10b981" },
  { name: "Mental Wellbeing", score: 90, color: "#f59e0b" },
  { name: "Medications",    score: 96, color: "#06b6d4" },
];

const sparkHeartRate = [62, 65, 70, 72, 68, 74, 72, 76, 72, 70, 72];
const sparkBP        = [120, 118, 122, 119, 121, 120, 118, 120];
const sparkSleep     = [6.2, 7.1, 6.8, 7.3, 6.5, 6.8, 7.0, 6.8];
const sparkActivity  = [2.8, 3.5, 3.2, 4.1, 2.9, 3.6, 3.2, 3.2];
const sparkWeight    = [72.1, 71.8, 71.3, 71.0, 70.8, 70.6, 70.5];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Sparkline({ data, color, down }: { data: number[]; color: string; down?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const h = 36, w = 100;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const fill = pts + ` ${w},${h} 0,${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  icon, label, value, unit, trend, trendUp, color, sparkData, glowColor
}: {
  icon: React.ReactNode; label: string; value: string; unit: string;
  trend: string; trendUp: boolean; color: string; sparkData: number[]; glowColor: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: glowColor }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: `${glowColor}18` }}>
            <div style={{ color: glowColor }}>{icon}</div>
          </div>
          <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{label}</span>
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-bold ${trendUp ? "text-emerald-500" : "text-red-400"}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      </div>
      <div>
        <span className="text-2xl font-bold text-gray-800 tracking-tight">{value}</span>
        <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
      </div>
      <Sparkline data={sparkData} color={glowColor} down={!trendUp} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-gray-700 tracking-tight">{children}</h2>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// ─── Health Score Radial ─────────────────────────────────────────────────────

function HealthScoreCard() {
  const radialData = [{ name: "Score", value: 92, fill: "#3b82f6" }];
  return (
    <Card className="p-6 flex flex-col gap-5">
      <SectionTitle>Health Score</SectionTitle>
      <div className="flex flex-col items-center relative">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r="64" fill="none" stroke="#e0e7ff" strokeWidth="12" />
            <circle
              cx="80" cy="80" r="64" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(92 / 100) * 402} 402`}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-gray-800 tracking-tight">92%</span>
            <span className="text-xs font-semibold text-emerald-500 mt-0.5 flex items-center gap-1">
              <ArrowUpRight size={10} /> Excellent
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {healthScoreCategories.map(c => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-24 text-xs font-medium text-gray-500 shrink-0">{c.name}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${c.score}%`, background: c.color }}
              />
            </div>
            <span className="text-xs font-bold text-gray-700 w-8 text-right">{c.score}%</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">Overall Health Score <span className="text-emerald-500 font-semibold">↑ 8%</span> from last month</p>
    </Card>
  );
}

// ─── Heart Rate Chart ────────────────────────────────────────────────────────

function HeartRateCard() {
  const [tab, setTab] = useState<"Day"|"Week"|"Month">("Day");
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Heart Rate (BPM)</SectionTitle>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["Day","Week","Month"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${tab===t ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >{t}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-6">
        <div>
          <span className="text-2xl font-extrabold text-gray-800">72 <span className="text-sm font-medium text-gray-400">bpm</span></span>
          <p className="text-xs text-gray-400 mt-0.5">Average</p>
        </div>
        <div className="flex gap-4 items-end pb-1">
          <div className="text-center"><p className="text-xs text-gray-400">Min</p><p className="text-sm font-bold text-gray-600">58 bpm</p></div>
          <div className="text-center"><p className="text-xs text-gray-400">Max</p><p className="text-sm font-bold text-gray-600">110 bpm</p></div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={heartRateData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval={2} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[40, 120]} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
          <Area type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={2} fill="url(#hrGrad)" dot={false} activeDot={{ r: 4, fill: "#ef4444" }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Blood Pressure Chart ────────────────────────────────────────────────────

function BloodPressureCard() {
  const [tab, setTab] = useState<"Day"|"Week"|"Month">("Day");
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Blood Pressure (mmHg)</SectionTitle>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["Day","Week","Month"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${tab===t?"bg-white text-blue-600 shadow-sm":"text-gray-400"}`}
            >{t}</button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div>
          <span className="text-2xl font-extrabold text-gray-800">120/80</span>
          <p className="text-xs text-gray-400 mt-0.5">Average</p>
        </div>
        <div className="flex gap-4 pb-1">
          <span className="flex items-center gap-1 text-xs font-semibold text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Systolic</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"/>Diastolic</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={bpData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[60, 160]} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
          <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Activity Donut ──────────────────────────────────────────────────────────

function ActivityCard() {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <SectionTitle>Activity Summary</SectionTitle>
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={activityData} cx="50%" cy="50%" innerRadius={38} outerRadius={56}
                dataKey="value" strokeWidth={0}>
                {activityData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-gray-800">3.2</span>
            <span className="text-[10px] font-medium text-gray-400">hrs total</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {activityData.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-xs font-medium text-gray-600 flex-1">{d.name}</span>
              <span className="text-xs font-bold text-gray-500">{d.hrs}</span>
              <span className="text-xs text-gray-300 w-8 text-right">{activityData.find(x=>x.name===d.name)?.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Sleep Analysis ──────────────────────────────────────────────────────────

function SleepCard() {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <SectionTitle>Sleep Analysis</SectionTitle>
      <div className="flex gap-4 items-end">
        <div>
          <span className="text-2xl font-extrabold text-gray-800">6.8 <span className="text-sm font-medium text-gray-400">hrs</span></span>
          <p className="text-xs text-gray-400">Average Sleep</p>
        </div>
        <div className="flex flex-col gap-1 pb-0.5">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500"><span className="w-2 h-2 rounded-full bg-indigo-500"/>Deep Sleep 2.1h</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-400"/>REM Sleep 1.6h</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={sleepData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={12}>
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, border: "none", fontSize: 11, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
          <Bar dataKey="deep"  stackId="a" fill="#4f46e5" radius={[0,0,0,0]} />
          <Bar dataKey="rem"   stackId="a" fill="#8b5cf6" />
          <Bar dataKey="light" stackId="a" fill="#c4b5fd" />
          <Bar dataKey="awake" stackId="a" fill="#f3f4f6" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Weight Trend ────────────────────────────────────────────────────────────

function WeightCard() {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <SectionTitle>Weight Trend (kg)</SectionTitle>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-extrabold text-gray-800">70.5 <span className="text-sm font-medium text-gray-400">kg</span></span>
          <p className="text-xs text-gray-400">Current Weight</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold bg-emerald-50 px-2.5 py-1 rounded-xl">
          <ArrowDownRight size={14} /> 0.8 kg
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={weightData} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[68, 74]} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
          <Area type="monotone" dataKey="kg" stroke="#3b82f6" strokeWidth={2} fill="url(#wGrad)" dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  icon, title, description, gradient, iconBg
}: { icon: React.ReactNode; title: string; description: string; gradient: string; iconBg: string }) {
  return (
    <div className={`rounded-3xl p-5 flex flex-col gap-3 relative overflow-hidden hover:scale-[1.02] transition-transform duration-300 ${gradient}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800 leading-tight">{title}</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Weekly Trends ───────────────────────────────────────────────────────────

function WeeklyTrendsCard() {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SectionTitle>Weekly Trends</SectionTitle>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-500"><span className="w-2 h-2 rounded-full bg-blue-500"/>This Week</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-300"><span className="w-2 h-2 rounded-full bg-gray-300"/>Last Week</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <BarChart data={weeklyTrends} barSize={8} margin={{ left: -25, right: 0, top: 4, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
          <Bar dataKey="lastWeek"  fill="#e5e7eb" radius={[4,4,0,0]} />
          <Bar dataKey="thisWeek" fill="#3b82f6" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400">Steps <span className="text-emerald-500 font-bold">↑ 12%</span> vs last week</p>
    </Card>
  );
}

// ─── Medication Adherence ────────────────────────────────────────────────────

function MedicationCard() {
  const pct = 96;
  return (
    <Card className="p-5 flex flex-col gap-3 items-center">
      <SectionTitle>Medication Adherence</SectionTitle>
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="48" fill="none" stroke="#dcfce7" strokeWidth="10"/>
          <circle cx="60" cy="60" r="48" fill="none" stroke="#22c55e" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={`${(pct/100)*301.6} 301.6`}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-gray-800">{pct}%</span>
          <span className="text-[10px] text-gray-400 font-medium">On Time</span>
        </div>
      </div>
      <p className="text-xs text-gray-400"><span className="text-emerald-500 font-bold">↑ 5%</span> vs last month</p>
    </Card>
  );
}

// ─── Calories Card ───────────────────────────────────────────────────────────

function CaloriesCard() {
  const calData = [
    {d:"Mo",v:1600},{d:"Tu",v:1920},{d:"We",v:1740},{d:"Th",v:2100},{d:"Fr",v:1856},{d:"Sa",v:2200},{d:"Su",v:1500}
  ];
  return (
    <Card className="p-5 flex flex-col gap-3">
      <SectionTitle>Calories Burned</SectionTitle>
      <div className="flex items-center gap-2">
        <Flame size={20} className="text-orange-500" />
        <span className="text-2xl font-extrabold text-gray-800">1,856 <span className="text-sm font-medium text-gray-400">kcal</span></span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={calData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}/>
          <Area type="monotone" dataKey="v" stroke="#f97316" strokeWidth={2} fill="url(#calGrad)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400"><span className="text-emerald-500 font-bold">↑ 15%</span> vs last month</p>
    </Card>
  );
}

// ─── Stress Card ─────────────────────────────────────────────────────────────

function StressCard() {
  const stressData = [
    {t:"Mo",v:38},{t:"Tu",v:42},{t:"We",v:35},{t:"Th",v:28},{t:"Fr",v:32},{t:"Sa",v:25},{t:"Su",v:22}
  ];
  return (
    <Card className="p-5 flex flex-col gap-3">
      <SectionTitle>Stress Levels</SectionTitle>
      <div className="flex items-center gap-2">
        <Smile size={20} className="text-amber-400" />
        <span className="text-2xl font-extrabold text-emerald-500">Low</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={stressData} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
          <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}/>
          <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 3 }}/>
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400"><span className="text-emerald-500 font-bold">↓ 18%</span> vs last month</p>
    </Card>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function HealthAnalyticsContent() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6" style={{ background: "#f4f7fb", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>

      {/* SECTION 1 — HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Health Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track, analyze and improve your health with intelligent insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 shadow-sm hover:shadow-md transition-shadow">
            <Calendar size={15} className="text-blue-500" />
            28 May – 28 Jun 2025
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 shadow-sm hover:shadow-md transition-shadow">
            <Filter size={14} className="text-blue-500" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-2xl text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* SECTION 2 — METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard icon={<Heart size={16}/>} label="Heart Rate" value="72" unit="bpm" trend="4%" trendUp color="#ef4444" sparkData={sparkHeartRate} glowColor="#ef4444"/>
        <MetricCard icon={<Activity size={16}/>} label="Blood Pressure" value="120/80" unit="mmHg" trend="2%" trendUp={false} color="#f59e0b" sparkData={sparkBP} glowColor="#f59e0b"/>
        <MetricCard icon={<Moon size={16}/>} label="Sleep" value="6.8" unit="hrs" trend="6%" trendUp color="#8b5cf6" sparkData={sparkSleep} glowColor="#8b5cf6"/>
        <MetricCard icon={<Zap size={16}/>} label="Activity" value="3.2" unit="hrs" trend="10%" trendUp color="#10b981" sparkData={sparkActivity} glowColor="#10b981"/>
        <MetricCard icon={<Scale size={16}/>} label="Weight" value="70.5" unit="kg" trend="0.8 kg" trendUp={false} color="#3b82f6" sparkData={sparkWeight} glowColor="#3b82f6"/>
      </div>

      {/* SECTION 3 — LARGE ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] gap-4">
        <HealthScoreCard />
        <HeartRateCard />
        <BloodPressureCard />
      </div>

      {/* SECTION 4 — SECONDARY ANALYTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActivityCard />
        <SleepCard />
        <WeightCard />
      </div>

      {/* SECTION 5 — INSIGHTS */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={15} className="text-blue-500" />
          <h2 className="text-base font-bold text-gray-700">Insights & Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <InsightCard
            icon={<TrendingUp size={18} className="text-emerald-600"/>}
            title="Great Progress!"
            description="Your activity level has increased by 10% this month. Keep it up!"
            gradient="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
            iconBg="bg-emerald-100"
          />
          <InsightCard
            icon={<Moon size={18} className="text-indigo-600"/>}
            title="Sleep Recommendation"
            description="Try to improve your deep sleep. Aim for 7–8 hours of sleep."
            gradient="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100"
            iconBg="bg-indigo-100"
          />
          <InsightCard
            icon={<Heart size={18} className="text-red-500"/>}
            title="Heart Health"
            description="Your heart rate is in the normal range. Maintain a healthy lifestyle."
            gradient="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100"
            iconBg="bg-red-100"
          />
          <InsightCard
            icon={<Droplets size={18} className="text-blue-500"/>}
            title="Stay Hydrated"
            description="You're doing well! Keep drinking enough water every day."
            gradient="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
            iconBg="bg-blue-100"
          />
        </div>
      </div>

      {/* SECTION 6 — EXTRA ANALYTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WeeklyTrendsCard />
        <MedicationCard />
        <CaloriesCard />
        <StressCard />
      </div>

      {/* SECTION 7 — SUMMARY BAR */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700">Summary</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">You are doing great! Your overall health is excellent. Keep maintaining your healthy habits.</p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: <Footprints size={16} className="text-blue-500"/>, label: "Avg Steps", value: "8,432", trend: "↑ 10%", trendColor: "text-emerald-500" },
              { icon: <Droplets size={16} className="text-cyan-500"/>, label: "Water Intake", value: "2.4 L", trend: "↑ 8%", trendColor: "text-emerald-500" },
              { icon: <Calendar size={16} className="text-purple-500"/>, label: "Active Days", value: "22/30", trend: "↑ 5 days", trendColor: "text-emerald-500" },
              { icon: <Heart size={16} className="text-red-400"/>, label: "Avg Resting HR", value: "64 bpm", trend: "↓ 4 bpm", trendColor: "text-emerald-500" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 leading-tight">{s.label}</p>
                  <p className="text-sm font-extrabold text-gray-800">{s.value}</p>
                  <p className={`text-[10px] font-semibold ${s.trendColor}`}>{s.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}