"use client";

import { useEffect, useState } from "react";
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
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/health/dashboard"
        );

        const result = await response.json();

        console.log("Dashboard Data:", result);

        setDashboardData(result.data);
        console.log("STEPS VALUE:",
  result.data?.steps?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal
);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading health data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
  <MetricCard
  icon={<Footprints size={16} />}
  label="Steps"
  value={String(
    dashboardData?.steps?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0
  )}
  unit="steps"
  trend="Live"
  trendUp
  color="#3b82f6"
  sparkData={sparkActivity}
  glowColor="#3b82f6"
/>

<MetricCard
  icon={<Flame size={16}/>}
  label="Calories"
  value={String(
    Math.round(
      dashboardData?.calories?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0
    )
  )}
  unit="kcal"
  trend="Live"
  trendUp
  color="#f97316"
  sparkData={sparkActivity}
  glowColor="#f97316"
/>

<MetricCard
  icon={<Activity size={16} />}
  label="Distance"
  value={String(
    (
      (dashboardData?.distance?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0) /
      1000
    ).toFixed(2)
  )}
  unit="km"
  trend="Live"
  trendUp
  color="#10b981"
  sparkData={sparkActivity}
  glowColor="#10b981"
/>

<MetricCard
  icon={<Footprints size={16}/>}
  label="Steps"
  value={String(
    dashboardData?.steps?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0
  )}
  unit="steps"
  trend="Live"
  trendUp
  color="#3b82f6"
  sparkData={sparkActivity}
  glowColor="#3b82f6"
/>

<MetricCard
  icon={<Activity size={16}/>}
  label="Distance"
  value={String(
    (
      (dashboardData?.distance?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0) /
      1000
    ).toFixed(2)
  )}
  unit="km"
  trend="Live"
  trendUp
  color="#10b981"
  sparkData={sparkActivity}
  glowColor="#10b981"
/>
    </div>
  );
}