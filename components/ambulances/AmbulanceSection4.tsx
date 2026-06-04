"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone,
  MapPin,
  Truck,
  Navigation,
  Building2,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Wind,
  HeartPulse,
  ShieldPlus,
  PhoneCall,
  Sparkles,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const services = [
  {
    id: "bls",
    icon: Truck,
    emoji: "🚑",
    title: "Basic Life Support",
    short: "BLS",
    desc: "Equipped for stable patient transfers with oxygen, stretcher, and trained EMTs for non-critical transport.",
    badge: "For Stable Patients",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-100",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    glowColor: "hover:shadow-blue-100",
    accent: "from-blue-500 to-blue-600",
    features: ["Oxygen Support", "Trained EMTs", "24/7 Available"],
  },
  {
    id: "als",
    icon: HeartPulse,
    emoji: "💊",
    title: "Advanced Life Support",
    short: "ALS",
    desc: "Full cardiac monitoring, defibrillator, IV therapy, and paramedic crew for critical emergency response.",
    badge: "For Critical Cases",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeBorder: "border-violet-100",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    glowColor: "hover:shadow-violet-100",
    accent: "from-violet-500 to-violet-600",
    features: ["Cardiac Monitor", "IV Therapy", "Paramedic Crew"],
  },
  {
    id: "icu",
    icon: Stethoscope,
    emoji: "🏥",
    title: "ICU Truck",
    short: "ICU",
    desc: "Mobile intensive care unit with ventilator, infusion pumps, and specialist nurses for inter-hospital transfers.",
    badge: "Intensive Care",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-100",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    glowColor: "hover:shadow-rose-100",
    accent: "from-rose-500 to-rose-600",
    features: ["Ventilator", "Infusion Pump", "ICU Nurses"],
  },
  {
    id: "air",
    icon: Wind,
    emoji: "🚁",
    title: "Air Truck",
    short: "AIR",
    desc: "Helicopter and fixed-wing air transport for long-distance or terrain-inaccessible emergency evacuations.",
    badge: "Fast Transfers",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    badgeBorder: "border-sky-100",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    glowColor: "hover:shadow-sky-100",
    accent: "from-sky-500 to-sky-600",
    features: ["Helicopter Fleet", "Long-Range", "Terrain Access"],
  },
];

const steps = [
  {
    num: 1,
    icon: MapPin,
    title: "Enter Location & Details",
    desc: "Provide your pickup address and drop location. Use GPS for automatic detection.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    numBg: "bg-blue-600",
    connector: "bg-gradient-to-b from-blue-200 to-violet-200",
  },
  {
    num: 2,
    icon: Truck,
    title: "Select Truck Type",
    desc: "AI matches you with the best available unit — BLS, ALS, ICU, or Air based on patient condition.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    numBg: "bg-violet-600",
    connector: "bg-gradient-to-b from-violet-200 to-emerald-200",
  },
  {
    num: 3,
    icon: Navigation,
    title: "Track Truck Live",
    desc: "Follow real-time GPS location, receive ETA updates, and stay connected with the paramedic team.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    numBg: "bg-emerald-600",
    connector: "bg-gradient-to-b from-emerald-200 to-amber-200",
  },
  {
    num: 4,
    icon: Building2,
    title: "Reach Hospital Safely",
    desc: "Our team ensures seamless handoff to the receiving hospital with full patient data transmitted ahead.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    numBg: "bg-amber-500",
    connector: null,
  },
];

// ─── Section Ref Wrapper for InView ──────────────────────────────────────────

function FadeInView({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TruckSection4() {
  return (
    <section className="w-full space-y-6">

      {/* ── TOP: Services + How It Works ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

        {/* Service Cards */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                <ShieldPlus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Our Truck Services</h2>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive fleet for every medical need</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
            {services.map((svc, i) => (
              <FadeInView key={svc.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    translateY: -4,
                    boxShadow: "0 16px 40px -8px rgba(0,0,0,0.10)",
                  }}
                  className={`group relative rounded-2xl border border-slate-200 bg-white p-5 cursor-default overflow-hidden transition-shadow duration-200 ${svc.glowColor}`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${svc.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Icon + Badge row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${svc.iconBg} border ${svc.badgeBorder}`}>
                      <svc.icon className={`h-5 w-5 ${svc.iconColor}`} />
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${svc.badgeBg} ${svc.badgeText} ${svc.badgeBorder}`}>
                      {svc.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-800">{svc.title}</h3>
                    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-widest ${svc.badgeBg} ${svc.badgeText}`}>
                      {svc.short}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{svc.desc}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5">
                    {svc.features.map((f) => (
                      <div key={f} className="flex items-center gap-1">
                        <CheckCircle2 className={`h-3 w-3 ${svc.iconColor}`} />
                        <span className="text-[10px] font-medium text-slate-500">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover emoji accent */}
                  <span className="absolute -bottom-3 -right-2 text-5xl opacity-5 group-hover:opacity-10 transition-opacity duration-300 select-none">
                    {svc.emoji}
                  </span>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <FadeInView delay={0.1} className="h-full">
          <div className="h-full rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">How It Works</h2>
                  <p className="text-xs text-slate-400 mt-0.5">From request to hospital in 4 steps</p>
                </div>
              </div>
            </div>

            <div className="flex-1 px-6 py-6 space-y-1">
              {steps.map((step, i) => (
                <FadeInView key={step.num} delay={0.15 + i * 0.1}>
                  <div className="flex gap-4">
                    {/* Left: number + connector */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${step.numBg} shadow-sm text-white text-xs font-extrabold z-10`}
                      >
                        {step.num}
                      </motion.div>
                      {step.connector && (
                        <div className={`w-0.5 flex-1 min-h-[28px] rounded-full ${step.connector} my-1.5`} />
                      )}
                    </div>

                    {/* Right: content */}
                    <div className={`flex-1 pb-${step.connector ? "4" : "0"} mb-${step.connector ? "1" : "0"}`}>
                      <div className={`flex items-center gap-2.5 rounded-2xl border ${step.border} ${step.bg} px-4 py-3 mb-1`}>
                        <step.icon className={`h-4 w-4 ${step.color} flex-shrink-0`} />
                        <span className={`text-sm font-bold ${step.color}`}>{step.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed px-1 pb-3">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>

      {/* ── BOTTOM: Emergency Helpline CTA ──────────────────────────────── */}
      <FadeInView delay={0.05}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 border border-blue-500/30 shadow-lg shadow-blue-200">

          {/* Background layers */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-sm" />
            <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-blue-500/20" />
            <div className="absolute right-1/3 top-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-white/[0.03]" />
            {/* Decorative grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ctaGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaGrid)" />
            </svg>
          </div>

          <div className="relative px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Left: text + number */}
            <div className="text-center md:text-left space-y-4">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                </span>
                <span className="text-xs font-semibold text-white/90 tracking-wide">Emergency Line · Active 24/7</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  Need Immediate Help?
                </h2>
                <p className="text-blue-200 text-sm mt-1.5 max-w-sm">
                  Our emergency dispatch team is available round the clock. One call connects you to the nearest available unit.
                </p>
              </div>

              {/* Phone number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/20">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  1800 123 4567
                </span>
              </motion.div>

              <p className="text-blue-300 text-xs">Toll-free · No charge · All networks</p>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[220px]">
              {/* Pulsing Call Now */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 0 8px rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0px rgba(255,255,255,0.15)",
                    "0 0 0 10px rgba(255,255,255,0.0)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeOut" },
                }}
                className="group flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-blue-700 shadow-lg transition-all duration-200"
              >
                <PhoneCall className="h-5 w-5 text-blue-600 group-hover:rotate-12 transition-transform duration-200" />
                Call Now
                <ArrowRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>

              {/* Secondary: Book Online */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center justify-center gap-2.5 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all duration-200"
              >
                <Truck className="h-4 w-4" />
                Book Online Instead
              </motion.button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 pt-1">
                {["NABH", "ISO 9001", "24/7"].map((tag) => (
                  <div key={tag} className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-white/70">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative border-t border-white/10 px-8 md:px-12 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-5">
                {[
                  { val: "58",    label: "Units Available"      },
                  { val: "8.4m",  label: "Avg. Dispatch Time"   },
                  { val: "120+",  label: "Active Paramedics"     },
                  { val: "4.8★",  label: "Average Rating"        },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-sm font-extrabold text-white">{s.val}</p>
                    <p className="text-[10px] text-blue-300">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-blue-300/70 hidden md:block">
                LifeLine AI Emergency Services · Powered by real-time AI dispatch
              </p>
            </div>
          </div>
        </div>
      </FadeInView>

    </section>
  );
}
