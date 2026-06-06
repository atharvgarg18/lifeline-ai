"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Brain,
  Pill,
  AlertTriangle,
  Stethoscope,
  Activity,
  Calendar,
  Thermometer,
  CheckCircle2,
  Zap,
  RefreshCw,
  Settings2,
  Building2,
  User,
  Globe,
  Accessibility,
  Phone,
  Truck,
  ChevronRight,
  Download,
  MonitorOff,
  Trash2,
  LogOut,
  ShieldAlert,
  Shield,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Cpu,
  Wifi,
  Heart,
  Watch,
  Smartphone,
  X,
  Sparkles,
  Star,
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const c = animate(count, to, { duration, ease: "easeOut" });
    const u = rounded.on("change", setDisplay);
    return () => { c.stop(); u(); };
  }, [to]);
  return <span>{display}{suffix}</span>;
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, color = "#2563EB" }: { checked: boolean; onChange: () => void; color?: string }) {
  return (
    <button
      onClick={onChange}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0"
      style={{ background: checked ? color : "#E2E8F0" }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({
  open, onClose, title, description, confirmLabel, confirmColor,
}: {
  open: boolean; onClose: () => void;
  title: string; description: string;
  confirmLabel: string; confirmColor: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm z-10"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <X size={14} className="text-slate-500" />
            </button>
            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${confirmColor}18` }}>
                <AlertTriangle size={28} style={{ color: confirmColor }} strokeWidth={1.8} />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">{title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl text-white text-sm font-bold transition-colors"
                style={{ background: confirmColor }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── AI Brain Illustration ────────────────────────────────────────────────────
function AIBrainIllustration() {
  return (
    <div className="relative flex items-center justify-center w-36 h-36 flex-shrink-0">
      {/* Orbit rings */}
      {[56, 76, 96].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-300/30"
          style={{ width: size, height: size }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Orbiting dots */}
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm"
          style={{ originX: "50%", originY: "50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
        />
      ))}
      {/* Pulse glow */}
      <motion.div
        className="absolute w-20 h-20 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Core */}
      <motion.div
        className="relative z-10 w-16 h-16 rounded-[1.4rem] flex items-center justify-center shadow-2xl"
        style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)", boxShadow: "0 12px 40px rgba(37,99,235,0.5)" }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, 4, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Brain size={30} color="white" strokeWidth={1.5} />
      </motion.div>
      {/* Status dot */}
      <motion.div
        className="absolute bottom-3 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

// ─── AI Feature Toggle Row ────────────────────────────────────────────────────
function AIFeatureRow({ icon: Icon, color, label, sub, checked, onChange, delay }: {
  icon: React.ElementType; color: string; label: string; sub: string;
  checked: boolean; onChange: () => void; delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer group border"
      style={{ borderColor: checked ? `${color}30` : "#F1F5F9", background: checked ? `${color}08` : "#F8FAFC" }}
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onChange}
      whileHover={{ x: 3 }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{ background: checked ? `${color}20` : "#F1F5F9" }}>
        <Icon size={18} style={{ color: checked ? color : "#94A3B8" }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} color={color} />
    </motion.div>
  );
}

// ─── Health App Card ──────────────────────────────────────────────────────────
function HealthAppCard({ name, icon: Icon, color, connected, sync, delay }: {
  name: string; icon: React.ElementType; color: string; connected: boolean; sync: string; delay: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      className="relative bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-2.5 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ y: -5, boxShadow: `0 16px 40px ${color}22` }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 rounded-2xl"
        animate={{ opacity: hover ? 1 : 0 }}
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}12 0%, transparent 70%)` }}
      />
      <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: `${color}15` }}>
        <Icon size={24} style={{ color }} strokeWidth={1.8} />
        <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white shadow ${connected ? "bg-green-500" : "bg-slate-300"}`} />
      </div>
      <p className="text-xs font-extrabold text-slate-800 text-center">{name}</p>
      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${connected ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {connected ? "Connected" : "Offline"}
      </span>
      <AnimatePresence>
        {hover && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <p className="text-[10px] text-slate-400 font-medium">Synced {sync}</p>
            <button className="w-full text-[11px] font-bold py-1.5 rounded-xl text-white flex items-center justify-center gap-1" style={{ background: color }}>
              <RefreshCw size={10} />Sync
            </button>
            <button className="w-full text-[11px] font-bold py-1.5 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center gap-1">
              <Settings2 size={10} />Manage
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Pref Row ─────────────────────────────────────────────────────────────────
function PrefRow({ icon: Icon, color, label, sub, value, delay }: {
  icon: React.ElementType; color: string; label: string; sub: string; value?: string; delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}14` }}>
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {value && <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{value}</span>}
        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
      </div>
    </motion.div>
  );
}

// ─── Danger Action ────────────────────────────────────────────────────────────
function DangerAction({ icon: Icon, label, sub, buttonLabel, onClick, delay, variant = "red" }: {
  icon: React.ElementType; label: string; sub: string;
  buttonLabel: string; onClick: () => void; delay: number;
  variant?: "red" | "amber" | "orange";
}) {
  const styles = {
    red:    { bg: "#FEF2F2", border: "#FECACA", text: "#EF4444", btn: "#EF4444" },
    amber:  { bg: "#FFFBEB", border: "#FDE68A", text: "#F59E0B", btn: "#F59E0B" },
    orange: { bg: "#FFF7ED", border: "#FED7AA", text: "#F97316", btn: "#F97316" },
  };
  const s = styles[variant];
  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer group transition-all duration-200"
      style={{ background: s.bg, borderColor: s.border }}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01, boxShadow: `0 8px 24px ${s.btn}22` }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.btn}20` }}>
        <Icon size={18} style={{ color: s.btn }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: s.text }}>{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <motion.button
        className="flex-shrink-0 text-xs font-extrabold px-4 py-2 rounded-xl text-white shadow-sm transition-colors"
        style={{ background: s.btn }}
        onClick={onClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        {buttonLabel}
      </motion.button>
    </motion.div>
  );
}

// ─── Trust Badge ──────────────────────────────────────────────────────────────
function TrustBadge({ icon: Icon, label, sub, color, delay }: {
  icon: React.ElementType; label: string; sub: string; color: string; delay: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 p-5 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 hover:bg-white/90 transition-all duration-300 group cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: `0 16px 40px ${color}22` }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)` }}>
        <Icon size={26} color="white" strokeWidth={1.6} />
      </div>
      <div className="text-center">
        <p className="text-sm font-extrabold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export default function SettingsAIPreferences() {
  const [aiFeatures, setAIFeatures] = useState({
    medication: true, emergency: true, doctorRec: true,
    healthPattern: true, appointment: false, symptom: true,
  });
  const toggleAI = (k: keyof typeof aiFeatures) => setAIFeatures(p => ({ ...p, [k]: !p[k] }));

  const [modal, setModal] = useState<{ open: boolean; title: string; description: string; confirmLabel: string; confirmColor: string }>({
    open: false, title: "", description: "", confirmLabel: "", confirmColor: "#EF4444",
  });
  const openModal = (title: string, description: string, confirmLabel: string, confirmColor: string) =>
    setModal({ open: true, title, description, confirmLabel, confirmColor });
  const closeModal = () => setModal(p => ({ ...p, open: false }));

  const activeAI = Object.values(aiFeatures).filter(Boolean).length;

  return (
    <div className="relative max-w-[1280px] mx-auto px-6 pb-16 space-y-6">

      {/* Modal */}
      <ConfirmModal {...modal} onClose={closeModal} />

      {/* ── SECTION LABEL ──────────────────────────────────────────────── */}
      <motion.div className="flex items-center gap-3 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
          <Brain size={13} className="text-blue-500" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI & Account Management</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </motion.div>

      {/* ── AI HEALTH ASSISTANT CARD ────────────────────────────────────── */}
      <motion.div
        className="relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
        variants={cardVariants} custom={0.05} initial="hidden" animate="visible"
        whileHover={{ boxShadow: "0 20px 60px rgba(37,99,235,0.10)" }}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        {/* Top accent */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #2563EB, #8B5CF6, #06B6D4)" }} />

        {/* Mesh background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 100% 0%, #EFF6FF 0%, transparent 60%)" }} />

        <div className="relative p-7">
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-7">
            <div className="flex items-center gap-5">
              <AIBrainIllustration />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-extrabold text-slate-900">AI Health Assistant</h2>
                  <motion.span
                    className="flex items-center gap-1.5 bg-green-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />ACTIVE
                  </motion.span>
                </div>
                <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                  Customize how LifeLine AI helps manage your healthcare, predictions, and recommendations.
                </p>
                {/* AI Stats row */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "Confidence", value: 98, suffix: "%", color: "#10B981" },
                    { label: "Active Features", value: activeAI, suffix: "/6", color: "#2563EB" },
                    { label: "Insights Today", value: 14, suffix: "", color: "#8B5CF6" },
                  ].map(({ label, value, suffix, color }) => (
                    <div key={label} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <span className="text-lg font-extrabold leading-none" style={{ color }}>
                        <AnimatedCounter to={value} suffix={suffix} duration={1.2} />
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* AI Model badge */}
            <motion.div
              className="flex-shrink-0 flex flex-col items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl px-6 py-4 shadow-lg shadow-blue-200"
              whileHover={{ scale: 1.03, rotate: 1 }}
            >
              <Cpu size={22} color="white" strokeWidth={1.6} />
              <p className="text-white font-extrabold text-sm">LifeLine AI v4</p>
              <p className="text-blue-200 text-[10px] font-semibold">Healthcare Model</p>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
                <Star size={10} color="white" strokeWidth={2.5} fill="white" />
                <span className="text-white text-[10px] font-bold">Premium</span>
              </div>
            </motion.div>
          </div>

          {/* Feature toggles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <AIFeatureRow icon={Pill}        color="#2563EB" label="Smart Medication Reminders" sub="AI-timed alerts based on your schedule"   checked={aiFeatures.medication}   onChange={() => toggleAI("medication")}   delay={0.08} />
            <AIFeatureRow icon={AlertTriangle} color="#EF4444" label="Emergency Risk Detection"  sub="Real-time health anomaly detection"       checked={aiFeatures.emergency}    onChange={() => toggleAI("emergency")}    delay={0.12} />
            <AIFeatureRow icon={Stethoscope} color="#10B981" label="AI Doctor Recommendations"  sub="Smart specialist matching near you"       checked={aiFeatures.doctorRec}    onChange={() => toggleAI("doctorRec")}    delay={0.16} />
            <AIFeatureRow icon={Activity}    color="#8B5CF6" label="Health Pattern Monitoring"  sub="Daily vitals analysis and trends"         checked={aiFeatures.healthPattern} onChange={() => toggleAI("healthPattern")} delay={0.20} />
            <AIFeatureRow icon={Calendar}    color="#F59E0B" label="Appointment Optimization"   sub="AI-powered scheduling recommendations"   checked={aiFeatures.appointment}  onChange={() => toggleAI("appointment")}  delay={0.24} />
            <AIFeatureRow icon={Thermometer} color="#06B6D4" label="Symptom Tracking"           sub="Log and monitor symptoms with AI insights" checked={aiFeatures.symptom}      onChange={() => toggleAI("symptom")}      delay={0.28} />
          </div>

          {/* Save AI settings */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
            <motion.button
              className="flex items-center gap-2 bg-blue-600 text-white text-sm font-extrabold px-6 py-2.5 rounded-2xl shadow-sm shadow-blue-200 hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={15} />Save AI Preferences
            </motion.button>
            <button className="text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-2xl transition-colors">
              Reset to Default
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 size={13} className="text-green-500" />
              <span>Auto-saved 2 min ago</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CONNECTED HEALTH APPS ─────────────────────────────────────────── */}
      <motion.div
        className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
        variants={cardVariants} custom={0.12} initial="hidden" animate="visible"
        whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.08)" }}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Connected Health Apps</h3>
              <p className="text-sm text-slate-500 mt-0.5">Sync your devices for complete health insights</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">5 Synced</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">1 Offline</span>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <HealthAppCard name="Google Fit"    icon={HeartIcon}    color="#10B981" connected sync="5 min ago"   delay={0.06} />
            <HealthAppCard name="Apple Health" icon={Heart}         color="#EF4444" connected sync="1 hr ago"    delay={0.10} />
            <HealthAppCard name="Fitbit"        icon={ActivityIcon} color="#F59E0B" connected sync="3 hr ago"    delay={0.14} />
            <HealthAppCard name="Samsung"       icon={Smartphone}   color="#8B5CF6" connected={false} sync="2 days" delay={0.18} />
            <HealthAppCard name="Garmin"        icon={Watch}        color="#2563EB" connected sync="30 min ago"  delay={0.22} />
            <HealthAppCard name="Mi Health"     icon={Wifi}         color="#06B6D4" connected sync="2 hr ago"    delay={0.26} />
          </div>
        </div>
      </motion.div>

      {/* ── HEALTHCARE PREFERENCES ────────────────────────────────────────── */}
      <motion.div
        className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden"
        variants={cardVariants} custom={0.18} initial="hidden" animate="visible"
        whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.08)" }}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-50">
              <Settings2 size={20} className="text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Healthcare Preferences</h3>
              <p className="text-sm text-slate-500">Personalise your care experience</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PrefRow icon={Building2}   color="#2563EB" label="Preferred Hospitals"         sub="Manage your hospital shortlist"     value="3 saved"   delay={0.06} />
            <PrefRow icon={User}  color="#10B981" label="Preferred Doctors"           sub="Your trusted specialists"           value="2 saved"   delay={0.10} />
            <PrefRow icon={Globe}      color="#8B5CF6" label="Language"                    sub="Interface & report language"        value="English"   delay={0.14} />
            <PrefRow icon={Accessibility} color="#F59E0B" label="Accessibility"            sub="Adjust display & interaction"       value="Default"   delay={0.18} />
            <PrefRow icon={Phone}      color="#EF4444" label="Emergency Contact Priority"  sub="Who gets notified first"            value="Rohit S."  delay={0.22} />
            <PrefRow icon={AmbulanceIcon} color="#06B6D4" label="Ambulance Preferences"   sub="Nearest auto-dispatch settings"     value="Auto"      delay={0.26} />
          </div>
        </div>
      </motion.div>

      {/* ── DANGER ZONE ───────────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-red-200"
        style={{ background: "linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 50%, #FFF7ED 100%)", boxShadow: "0 4px 24px rgba(239,68,68,0.08)" }}
        variants={cardVariants} custom={0.24} initial="hidden" animate="visible"
      >
        {/* Top danger stripe */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #EF4444, #F97316, #F59E0B)" }} />

        {/* Decorative warning icon top-right */}
        <motion.div
          className="absolute top-6 right-6 w-20 h-20 opacity-[0.06] pointer-events-none"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <ShieldAlert size={80} className="text-red-500" />
        </motion.div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
              <ShieldAlert size={20} className="text-red-500" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-red-700">Danger Zone</h3>
              <p className="text-sm text-red-400">These actions are irreversible — proceed with caution</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <DangerAction
              icon={Download} label="Export Health Data" sub="Download a full archive of your records and activity"
              buttonLabel="Export" variant="amber" delay={0.08}
              onClick={() => openModal("Export Health Data", "We'll prepare a complete archive of your health data and send it to your registered email within 24 hours.", "Request Export", "#F59E0B")}
            />
            <DangerAction
              icon={MonitorOff} label="Remove All Connected Devices" sub="Disconnect every linked device and health app immediately"
              buttonLabel="Disconnect" variant="orange" delay={0.12}
              onClick={() => openModal("Remove Connected Devices", "This will disconnect all 4 devices and 6 health apps. You'll need to reconnect them manually.", "Disconnect All", "#F97316")}
            />
            <DangerAction
              icon={LogOut} label="Logout From All Devices" sub="Sign out from every active session across all platforms"
              buttonLabel="Logout All" variant="red" delay={0.16}
              onClick={() => openModal("Logout Everywhere", "You will be signed out of all 3 active sessions. Your data will remain intact.", "Logout All", "#EF4444")}
            />
            <DangerAction
              icon={Trash2} label="Delete Account" sub="Permanently delete your LifeLine AI account and all associated data"
              buttonLabel="Delete" variant="red" delay={0.20}
              onClick={() => openModal("Delete Account", "This action is permanent and cannot be undone. All your health records, history, and connections will be erased forever.", "Delete My Account", "#EF4444")}
            />
          </div>
        </div>
      </motion.div>

      {/* ── TRUST BANNER ──────────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-blue-100"
        style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F5F3FF 100%)" }}
        variants={cardVariants} custom={0.3} initial="hidden" animate="visible"
      >
        {/* Large watermark shield */}
        <motion.div
          className="absolute right-0 top-0 h-full flex items-center justify-center opacity-[0.04] pointer-events-none"
          style={{ width: 320 }}
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Shield size={280} className="text-blue-600" />
        </motion.div>

        <div className="relative p-8">
          <div className="text-center mb-7">
            <motion.div
              className="inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5 mb-4"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap size={13} color="white" />
              <span className="text-white text-xs font-extrabold uppercase tracking-wider">LifeLine AI Trust Centre</span>
            </motion.div>
            <h3 className="text-2xl font-extrabold text-slate-900">Your Health. Protected. Always.</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              LifeLine AI is built on enterprise-grade security infrastructure ensuring your medical data is never compromised.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TrustBadge icon={Lock}        label="Secure Platform"           sub="256-bit AES encryption"       color="#2563EB" delay={0.07} />
            <TrustBadge icon={ShieldCheck} label="HIPAA Compliant"           sub="US healthcare standards"      color="#10B981" delay={0.12} />
            <TrustBadge icon={BadgeCheck}  label="Verified Network"          sub="500+ certified hospitals"     color="#8B5CF6" delay={0.17} />
            <TrustBadge icon={Brain}       label="AI Protected Records"      sub="Real-time threat detection"   color="#06B6D4" delay={0.22} />
          </div>

          {/* Bottom tagline */}
          <motion.p
            className="text-center text-xs text-slate-400 mt-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2025 LifeLine AI · HIPAA · SOC 2 Type II · ISO 27001 · GDPR Ready · Your health, your data, your control.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Icon aliases ─────────────────────────────────────────────────────────────
function HeartIcon(props: React.ComponentProps<typeof Activity>) { return <Activity {...props} />; }
function ActivityIcon(props: React.ComponentProps<typeof Activity>) { return <Activity {...props} />; }
function AmbulanceIcon({ size, color, strokeWidth }: { size?: number; color?: string; strokeWidth?: number }) {
  return <Zap size={size} color={color} strokeWidth={strokeWidth} />;
}
