"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  Truck,
  Stethoscope,
  Building2,
  Star,
  Clock,
  Wifi,
  Bot,
  Send,
  Sparkles,
  ChevronRight,
  Phone,
  ShieldCheck,
  Activity,
  Siren,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimelineStep {
  id: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  time: string;
  status: "done" | "active" | "pending";
}

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  rating: number;
  eta: string;
  initials: string;
  color: string;
  badge: string;
  badgeColor: string;
  calls: number;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: "ai" | "system";
  delay: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const timelineSteps: TimelineStep[] = [
  {
    id: 1, icon: Siren, title: "SOS Activated",
    subtitle: "Emergency signal sent from device", time: "10:42:01 AM",
    status: "done",
  },
  {
    id: 2, icon: MapPin, title: "Location Shared",
    subtitle: "GPS coordinates locked — Sector 12, Civil Lines", time: "10:42:05 AM",
    status: "done",
  },
  {
    id: 3, icon: Truck, title: "Ambulance Assigned",
    subtitle: "AMB-14 dispatched · 2.1 km away", time: "10:42:18 AM",
    status: "active",
  },
  {
    id: 4, icon: Stethoscope, title: "Doctor Connected",
    subtitle: "Dr. Meera Kapoor joining via telemedicine", time: "Pending",
    status: "pending",
  },
  {
    id: 5, icon: Building2, title: "Hospital Notified",
    subtitle: "Apollo Hospital ER — 3 beds reserved", time: "Pending",
    status: "pending",
  },
];

const team: TeamMember[] = [
  {
    name: "Dr. Meera Kapoor", role: "Doctor", specialty: "Emergency Medicine",
    rating: 4.9, eta: "On Call", initials: "MK",
    color: "from-violet-500 to-purple-600",
    badge: "Lead Physician", badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    calls: 1240,
  },
  {
    name: "Priya Sharma", role: "Nurse", specialty: "Critical Care RN",
    rating: 4.8, eta: "In Transit", initials: "PS",
    color: "from-sky-500 to-blue-600",
    badge: "Paramedic", badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    calls: 870,
  },
  {
    name: "Ramesh Patil", role: "Driver", specialty: "Advanced Life Support",
    rating: 4.7, eta: "4 min", initials: "RP",
    color: "from-emerald-500 to-teal-600",
    badge: "AMB-14", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    calls: 2100,
  },
];

const chatMessages: ChatMessage[] = [
  { id: 1, text: "🚨 SOS detected. Initiating emergency protocol...", sender: "ai", delay: 0 },
  { id: 2, text: "📍 Location confirmed: Sector 12, Civil Lines, Raipur. Nearest unit AMB-14 dispatched.", sender: "ai", delay: 2200 },
  { id: 3, text: "🏥 Apollo Hospital ER pre-alerted. Trauma bay 2 is being prepared for arrival.", sender: "ai", delay: 4600 },
];

const suggestions = [
  { icon: Activity, text: "Patient vitals?", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { icon: Phone, text: "Call family", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { icon: ShieldCheck, text: "Insurance check", color: "text-violet-600 bg-violet-50 border-violet-200" },
  { icon: MapPin, text: "Reroute unit", color: "text-orange-600 bg-orange-50 border-orange-200" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex items-end gap-[3px] h-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden"
    >
      {/* Hover shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/60 to-blue-50/0"
        animate={{ x: hovered ? ["−100%", "100%"] : "-100%" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
        >
          {member.initials}
        </div>
        {/* Online pulse */}
        <span className="absolute -bottom-0.5 -right-0.5 flex">
          <motion.span
            animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
            transition={{ repeat: Infinity, duration: 1.3 }}
            className="absolute w-3 h-3 rounded-full bg-emerald-400"
          />
          <span className="relative w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${member.badgeColor}`}>
            {member.badge}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{member.specialty}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600">
            <Star size={10} fill="currentColor" />
            {member.rating}
          </span>
          <span className="text-[10px] text-slate-300">•</span>
          <span className="text-[10px] text-slate-400">{member.calls.toLocaleString()} cases</span>
        </div>
      </div>

      {/* ETA */}
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          <Clock size={10} />
          {member.eta}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 hover:text-blue-600 transition-colors"
        >
          Contact <ChevronRight size={10} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmergencySOSSection2() {
  const [activeStep, setActiveStep] = useState(2); // 0-indexed active
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [stepProgress, setStepProgress] = useState(0); // 0–100 for active step fill

  // Auto-advance timeline
  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => {
        if (s < timelineSteps.length - 1) return s + 1;
        return 0;
      });
      setStepProgress(0);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // Active step progress bar fill
  useEffect(() => {
    setStepProgress(0);
    const interval = setInterval(() => {
      setStepProgress((p) => Math.min(p + 3, 100));
    }, 90);
    return () => clearInterval(interval);
  }, [activeStep]);

  // Chat message queue
  useEffect(() => {
    if (msgIndex >= chatMessages.length) return;
    const msg = chatMessages[msgIndex];
    const timer = setTimeout(() => {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => [...prev, msg]);
        setMsgIndex((i) => i + 1);
      }, 1200);
      return () => clearTimeout(typingTimer);
    }, msg.delay);
    return () => clearTimeout(timer);
  }, [msgIndex]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isTyping]);

  const getStepState = (index: number) => {
    if (index < activeStep) return "done";
    if (index === activeStep) return "active";
    return "pending";
  };

  return (
    <section className="w-full bg-[#F8FAFC] py-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
            Live Response Tracking
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ══════════════════════════════════════════════
              LEFT — Emergency Response Progress
          ══════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-black text-slate-900">Emergency Response</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time protocol execution</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100">
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <span className="text-xs font-bold text-red-700">ACTIVE</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Background connector */}
              <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-slate-100" />

              {/* Animated fill connector */}
              <motion.div
                className="absolute left-[22px] top-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-400 origin-top"
                animate={{ scaleY: (activeStep + stepProgress / 100) / (timelineSteps.length - 1) }}
                style={{ height: "100%" }}
                transition={{ duration: 0.1 }}
              />

              <div className="space-y-0">
                {timelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  const state = getStepState(i);
                  const isDone = state === "done";
                  const isActive = state === "active";
                  const isPending = state === "pending";

                  return (
                    <div key={step.id} className="relative flex gap-5 pb-8 last:pb-0">
                      {/* Icon node */}
                      <div className="relative z-10 flex-shrink-0">
                        <motion.div
                          animate={
                            isActive
                              ? { boxShadow: ["0 0 0 0px rgba(37,99,235,0.3)", "0 0 0 8px rgba(37,99,235,0)", "0 0 0 0px rgba(37,99,235,0)"] }
                              : {}
                          }
                          transition={{ repeat: Infinity, duration: 1.6 }}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                            isDone
                              ? "bg-blue-600 border-blue-600"
                              : isActive
                              ? "bg-blue-50 border-blue-500 scale-110"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={18} className="text-white" />
                          ) : (
                            <Icon
                              size={17}
                              className={isActive ? "text-blue-600" : "text-slate-300"}
                            />
                          )}
                        </motion.div>
                        {/* Glow for active */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-blue-400 blur-md -z-10"
                            animate={{ opacity: [0.25, 0.55, 0.25] }}
                            transition={{ repeat: Infinity, duration: 1.4 }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p
                              className={`text-sm font-bold transition-colors duration-300 ${
                                isDone ? "text-slate-700"
                                : isActive ? "text-slate-900"
                                : "text-slate-300"
                              }`}
                            >
                              {step.title}
                            </p>
                            <p
                              className={`text-xs mt-0.5 leading-relaxed transition-colors duration-300 ${
                                isDone ? "text-slate-400"
                                : isActive ? "text-slate-500"
                                : "text-slate-200"
                              }`}
                            >
                              {step.subtitle}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-mono flex-shrink-0 font-semibold transition-colors ${
                              isDone ? "text-blue-500"
                              : isActive ? "text-blue-600"
                              : "text-slate-200"
                            }`}
                          >
                            {step.time}
                          </span>
                        </div>

                        {/* Active step progress bar */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden"
                          >
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                              style={{ width: `${stepProgress}%` }}
                              transition={{ duration: 0.09 }}
                            />
                          </motion.div>
                        )}

                        {/* Done badge */}
                        {isDone && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full"
                          >
                            <CheckCircle2 size={9} />
                            Completed
                          </motion.span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer ETA */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Estimated arrival</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">4 <span className="text-base font-semibold text-slate-400">min</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Protocol</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">LIFELINE-ALPHA</p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent"
              />
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════
              RIGHT — Team + AI Assistant
          ══════════════════════════════════════════════ */}
          <div className="flex flex-col gap-6">

            {/* Live Emergency Team */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Live Emergency Team</h2>
                  <p className="text-xs text-slate-400 mt-0.5">AI-matched response unit</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi size={13} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700">All Connected</span>
                </div>
              </div>

              <div className="space-y-3">
                {team.map((member, i) => (
                  <TeamCard key={member.name} member={member} index={i} />
                ))}
              </div>
            </motion.div>

            {/* AI Emergency Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-500">
                {/* AI Avatar */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center"
                  >
                    <Bot size={20} className="text-white" />
                  </motion.div>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">LifeLine AI Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={10} className="text-yellow-300" />
                    <p className="text-[10px] text-blue-100 font-medium">Emergency Protocol Active</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1">
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-1.5 rounded-full bg-red-400"
                  />
                  <span className="text-[10px] font-bold text-white">LIVE</span>
                </div>
              </div>

              {/* Chat body */}
              <div className="p-4 space-y-3 max-h-44 overflow-y-auto">
                <AnimatePresence>
                  {visibleMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-2.5 items-start"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={12} className="text-blue-600" />
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-xs">
                        <p className="text-xs text-slate-700 leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 items-center"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-blue-600" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions */}
              <div className="px-4 pb-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Quick actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 hover:shadow-sm ${s.color}`}
                      >
                        <Icon size={11} />
                        {s.text}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Input bar */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:bg-white transition-all duration-200">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask AI assistant anything..."
                    className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Send size={12} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
