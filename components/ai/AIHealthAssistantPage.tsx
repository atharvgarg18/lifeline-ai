"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, FileText, TrendingUp, Pill, Activity,
  Mic, Send, X, Droplets, Moon, Zap, ChevronRight,
  AlertCircle, Brain, Salad, Smile, CheckCircle2,
  Clock, Sparkles, Bot, Loader2, ArrowRight
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: "user" | "ai";
  content: string | React.ReactNode;
  time: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const quickActions = [
  { icon: <Heart size={15} />, label: "How is my heart health?", color: "#ef4444", bg: "#fef2f2" },
  { icon: <FileText size={15} />, label: "Analyze my recent reports", color: "#3b82f6", bg: "#eff6ff" },
  { icon: <TrendingUp size={15} />, label: "What should I improve?", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: <Pill size={15} />, label: "Explain my medications", color: "#f59e0b", bg: "#fffbeb" },
  { icon: <Activity size={15} />, label: "Check my vitals trend", color: "#10b981", bg: "#ecfdf5" },
];

const insights = [
  { icon: <Droplets size={18} />, color: "#3b82f6", bg: "from-blue-50 to-cyan-50 border-blue-100", iconBg: "bg-blue-100", title: "Stay Hydrated", desc: "You're not drinking enough water. Aim for 8 glasses a day." },
  { icon: <Moon size={18} />, color: "#8b5cf6", bg: "from-purple-50 to-indigo-50 border-purple-100", iconBg: "bg-purple-100", title: "Improve Sleep", desc: "Your deep sleep is low. Maintain a regular sleep routine." },
  { icon: <Zap size={18} />, color: "#10b981", bg: "from-emerald-50 to-teal-50 border-emerald-100", iconBg: "bg-emerald-100", title: "Increase Activity", desc: "Try to walk 30 mins daily. You did 3.2 hrs this week." },
  { icon: <Heart size={18} />, color: "#ef4444", bg: "from-red-50 to-pink-50 border-red-100", iconBg: "bg-red-100", title: "Heart Health", desc: "Your heart rate is slightly elevated during afternoons." },
];

const healthMetrics = [
  { label: "Vitals", score: 94, color: "#ef4444" },
  { label: "Activity", score: 91, color: "#3b82f6" },
  { label: "Sleep", score: 88, color: "#8b5cf6" },
  { label: "Nutrition", score: 93, color: "#10b981" },
  { label: "Mental Wellbeing", score: 90, color: "#f59e0b" },
];

const recentReports = [
  { icon: <FileText size={15} />, color: "#3b82f6", bg: "bg-blue-50", title: "Blood Report", sub: "Analyzed", time: "2 days ago" },
  { icon: <Activity size={15} />, color: "#8b5cf6", bg: "bg-purple-50", title: "X-Ray Chest", sub: "Analyzed", time: "5 days ago" },
  { icon: <Heart size={15} />, color: "#ef4444", bg: "bg-red-50", title: "ECG Report", sub: "Analyzed", time: "1 week ago" },
  { icon: <Moon size={15} />, color: "#f59e0b", bg: "bg-amber-50", title: "Sleep Data", sub: "Analyzed", time: "1 week ago" },
];

const aiServices = [
  { icon: <AlertCircle size={17} />, color: "#ef4444", bg: "bg-red-50", title: "Symptoms Checker", desc: "Check possible health conditions" },
  { icon: <Pill size={17} />, color: "#8b5cf6", bg: "bg-purple-50", title: "Drug Interaction Checker", desc: "Check medication interactions" },
  { icon: <Salad size={17} />, color: "#10b981", bg: "bg-emerald-50", title: "Diet & Nutrition Advisor", desc: "Get AI diet recommendations" },
  { icon: <Brain size={17} />, color: "#3b82f6", bg: "bg-blue-50", title: "Mental Health Support", desc: "Tips for mental wellbeing" },
];

const popularQuestions = [
  { icon: <Salad size={16} />, color: "#10b981", bg: "bg-emerald-50", q: "What should I eat for better immunity?" },
  { icon: <Zap size={16} />, color: "#f59e0b", bg: "bg-amber-50", q: "Why do I feel tired everyday?" },
  { icon: <Activity size={16} />, color: "#3b82f6", bg: "bg-blue-50", q: "What is my ideal calorie intake?" },
  { icon: <Brain size={16} />, color: "#8b5cf6", bg: "bg-purple-50", q: "How can I reduce stress?" },
  { icon: <Moon size={16} />, color: "#6366f1", bg: "bg-indigo-50", q: "Is my sleep pattern healthy?" },
];

const riskFactors = [
  { label: "Heart Disease Risk", level: "Low", color: "#10b981", bg: "bg-emerald-50 text-emerald-600", icon: <Heart size={14}/> },
  { label: "Diabetes Risk", level: "Low", color: "#10b981", bg: "bg-emerald-50 text-emerald-600", icon: <Activity size={14}/> },
  { label: "Hypertension Risk", level: "Low", color: "#10b981", bg: "bg-emerald-50 text-emerald-600", icon: <AlertCircle size={14}/> },
  { label: "Obesity Risk", level: "Low", color: "#10b981", bg: "bg-emerald-50 text-emerald-600", icon: <Smile size={14}/> },
];

// ─── AI Health Summary Message ────────────────────────────────────────────────

const AIHealthResponse = () => (
  <div className="space-y-2">
    <p className="text-sm text-gray-700 leading-relaxed">
      Based on your medical history, recent reports, and vitals, your overall health is <span className="font-bold text-amber-500">good 🌟</span>
    </p>
    <div className="mt-3 space-y-1.5">
      {[
        { label: "Heart Health", status: "Good", dot: "#10b981" },
        { label: "Sleep Quality", status: "Average", dot: "#f59e0b" },
        { label: "Activity Level", status: "Good", dot: "#10b981" },
        { label: "Stress Level", status: "Low", dot: "#10b981" },
        { label: "Weight Status", status: "Normal", dot: "#3b82f6" },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.dot }} />
          <span className="text-sm text-gray-600 font-medium w-32">{item.label}:</span>
          <span className="text-sm font-semibold" style={{ color: item.dot }}>{item.status}</span>
        </div>
      ))}
    </div>
    <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100">Keep maintaining your healthy lifestyle! 🌿</p>
  </div>
);

const initialMessages: Message[] = [
  { id: 1, role: "user", content: "How is my overall health?", time: "10:30 AM" },
  { id: 2, role: "ai", content: <AIHealthResponse />, time: "10:31 AM" },
];

// ─── Bot Avatar ───────────────────────────────────────────────────────────────

function BotAvatar({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      className="rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
      style={{ width: size, height: size, background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
      animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0.3)", "0 0 0 8px rgba(99,102,241,0)", "0 0 0 0 rgba(99,102,241,0)"] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <Bot size={size * 0.45} className="text-white" />
    </motion.div>
  );
}

// ─── Card Wrapper ─────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-gray-700 tracking-tight">{children}</h2>;
}

// ─── Chat Section ─────────────────────────────────────────────────────────────

function ChatCard() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1, role: "ai", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: "I've analyzed your health data. Your vitals look stable. Remember to stay hydrated, get 7–8 hours of sleep, and maintain your daily activity routine. Would you like a detailed breakdown of any specific metric?"
      };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 1800);
  };

  return (
    <Card className="flex flex-col h-full min-h-[520px]">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
        <SectionTitle>Chat with AI Assistant</SectionTitle>
        <button
          onClick={() => setMessages([])}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors font-medium"
        >
          <X size={13} /> Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && <BotAvatar size={34} />}
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm text-sm font-medium"
                  : "bg-gray-50 border border-gray-100 rounded-tl-sm"
                }`}>
                  {typeof msg.content === "string"
                    ? <p className="text-sm leading-relaxed">{msg.content}</p>
                    : msg.content}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 items-center">
              <BotAvatar size={34} />
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-blue-400 text-center px-5 pb-2 font-medium">
        AI responses are for informational purposes only. Always consult a doctor.
      </p>

      {/* Input */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-blue-300 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything about your health..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <button className="text-gray-400 hover:text-blue-500 transition-colors p-1">
            <Mic size={16} />
          </button>
          <motion.button
            onClick={() => sendMessage()}
            whileTap={{ scale: 0.93 }}
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function AIHealthAssistantPage() {
  const [activeQuick, setActiveQuick] = useState<number | null>(null);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6" style={{ background: "#f4f7fb", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* SECTION 1 — HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            <Sparkles size={20} className="text-blue-500" />
            AI Health Assistant
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Your intelligent healthcare companion. Ask anything about your health.</p>
        </div>

        {/* Status Card */}
        <Card className="flex items-center gap-3 px-4 py-3 pr-5">
          <motion.div
            className="w-11 h-11 rounded-2xl flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
            animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0.4)", "0 0 0 10px rgba(99,102,241,0)", "0 0 0 0 rgba(99,102,241,0)"] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <Bot size={20} className="text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </motion.div>
          <div>
            <p className="text-xs font-bold text-gray-700">AI Assistant Status</p>
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online & Ready
            </p>
          </div>
        </Card>
      </motion.div>

      {/* SECTION 2 — MAIN AI CHAT LAYOUT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-[260px_1fr_240px] gap-4"
      >
        {/* LEFT — Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="p-5 h-full flex flex-col gap-4">
            <SectionTitle>Ask AI Assistant</SectionTitle>

            {/* Bot welcome bubble */}
            <div className="flex gap-3 items-start bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <BotAvatar size={36} />
              <div>
                <p className="text-sm font-bold text-gray-700">Hello Rohan! 👋</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">I'm your AI health assistant. How can I help you today?</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-1.5">
              {quickActions.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveQuick(i)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-200 ${activeQuick === i ? "shadow-sm" : "hover:bg-gray-50"}`}
                  style={activeQuick === i ? { background: a.bg } : {}}
                >
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: a.bg, color: a.color }}>
                    {a.icon}
                  </span>
                  <span className="text-xs font-semibold text-gray-600">{a.label}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CENTER — Chat */}
        <motion.div variants={itemVariants}>
          <ChatCard />
        </motion.div>

        {/* RIGHT — Insights */}
        <motion.div variants={itemVariants}>
          <Card className="p-5 h-full flex flex-col gap-4">
            <SectionTitle>AI Insights For You</SectionTitle>
            <div className="flex flex-col gap-3">
              {insights.map((ins, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-br border ${ins.bg} cursor-pointer`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${ins.iconBg}`} style={{ color: ins.color }}>
                    {ins.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700">{ins.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{ins.desc}</p>
                  </div>
                  <button className="text-[10px] font-bold shrink-0 mt-0.5" style={{ color: ins.color }}>View</button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* SECTION 3 — ANALYTICS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {/* Health Summary */}
        <motion.div variants={itemVariants}>
          <Card className="p-5 flex flex-col gap-4 h-full">
            <SectionTitle>Health Summary</SectionTitle>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="52" fill="none" stroke="#e0e7ff" strokeWidth="10" />
                  <circle cx="64" cy="64" r="52" fill="none" strokeWidth="10" strokeLinecap="round"
                    stroke="url(#hsg)" strokeDasharray={`${(92 / 100) * 327} 327`} />
                  <defs>
                    <linearGradient id="hsg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-gray-800">92</span>
                  <span className="text-xs font-bold text-emerald-500">Excellent</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {healthMetrics.map(m => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-gray-500 w-28 shrink-0">{m.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                      className="h-1.5 rounded-full"
                      style={{ background: m.color }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600 w-7 text-right">{m.score}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">
              <span className="text-emerald-500 font-bold">↑ 8%</span> improvement from last month
            </p>
          </Card>
        </motion.div>

        {/* Recent Reports */}
        <motion.div variants={itemVariants}>
          <Card className="p-5 flex flex-col gap-4 h-full">
            <SectionTitle>Recent Health Data Analyzed</SectionTitle>
            <div className="flex flex-col gap-3">
              {recentReports.map((r, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <span className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${r.bg}`} style={{ color: r.color }}>
                    {r.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700">{r.title}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={10} className="text-emerald-500" /> {r.sub}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock size={10} /> {r.time}
                  </span>
                </motion.div>
              ))}
            </div>
            <button className="mt-auto text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1 pt-2 border-t border-gray-50 transition-colors">
              View All Reports <ArrowRight size={12} />
            </button>
          </Card>
        </motion.div>

        {/* Health Prediction */}
        <motion.div variants={itemVariants}>
          <Card className="p-5 flex flex-col gap-4 h-full">
            <SectionTitle>Health Prediction</SectionTitle>
            <div className="flex items-center justify-between bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Risk Level</p>
                <p className="text-lg font-extrabold text-gray-800 mt-0.5">Low Risk</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed max-w-[140px]">
                  Your current lifestyle suggests a low risk of major health issues.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {riskFactors.map((r, i) => (
                <div key={i} className={`rounded-2xl p-3 flex flex-col gap-1 items-center text-center ${r.bg} border border-gray-100`}>
                  <span style={{ color: r.color }}>{r.icon}</span>
                  <p className="text-[9px] font-semibold text-gray-500 leading-tight">{r.label}</p>
                  <p className="text-xs font-extrabold" style={{ color: r.color }}>{r.level}</p>
                </div>
              ))}
            </div>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1 pt-2 border-t border-gray-50 transition-colors">
              View Detailed Prediction <ArrowRight size={12} />
            </button>
          </Card>
        </motion.div>

        {/* AI Services */}
        <motion.div variants={itemVariants}>
          <Card className="p-5 flex flex-col gap-4 h-full">
            <SectionTitle>Ask AI About</SectionTitle>
            <div className="flex flex-col gap-2">
              {aiServices.map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-gray-50 text-left group transition-colors"
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`} style={{ color: s.color }}>
                    {s.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700">{s.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* SECTION 4 — POPULAR QUESTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-700">Popular Questions</h2>
          <button className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {popularQuestions.map((q, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-2xl border border-gray-100 p-4 text-left flex flex-col gap-3 group transition-all duration-200"
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${q.bg}`} style={{ color: q.color }}>
                {q.icon}
              </span>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">{q.q}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
