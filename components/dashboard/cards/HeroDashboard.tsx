'use client';

import EmergencyCommandCenter from '../EmergencyCommandCenter';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Phone,
  // MapPin,
  Building2,
  Shield,
  Users,
  MessageCircle,
  ChevronRight,
  Droplets,
  Pill,
  Activity,
  AlertCircle,
  Zap,
} from 'lucide-react';
import HealthMonitoringSection from './HealthMonitoringSection';
import RecentAlerts from './cards/RecentAlerts';
import HealthAnalytics from './cards/HealthAnalytics';
import NearbyHospitals from './cards/NearbyHospitals';

/* ─────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────── */
const pulse = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const floatY = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const CARD_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #DBEAFE',
  borderRadius: '18px',
  boxShadow: '0 2px 12px rgba(37,99,235,.06)',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: 'easeOut' } },
});

/* ─────────────────────────────────────────────
   Radar rings (SVG, pure decorative)
───────────────────────────────────────────── */
function RadarRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-500/20"
          style={{ width: `${i * 160}px`, height: `${i * 160}px` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {/* location pin glow */}
      <motion.div
        className="absolute h-5 w-5 rounded-full bg-red-500 shadow-[0_0_20px_6px_rgba(239,68,68,0.7)]"
        animate={{ scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Ambulance SVG illustration (inline, no img dependency)
───────────────────────────────────────────── */
function AmbulanceSVG() {
  return (
    <motion.svg
      viewBox="0 0 340 160"
      className="h-full w-full drop-shadow-[0_0_32px_rgba(239,68,68,0.55)]"
      {...floatY}
    >
      {/* glow base */}
      <ellipse cx="170" cy="145" rx="130" ry="14" fill="rgba(239,68,68,0.18)" />

      {/* body */}
      <rect
        x="30"
        y="60"
        width="200"
        height="80"
        rx="12"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* cab */}
      <path
        d="M230 85 L268 85 Q285 85 288 100 L290 140 L230 140 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* red stripe */}
      <rect x="30" y="88" width="200" height="8" fill="#dc2626" />
      {/* cross */}
      <rect x="140" y="68" width="28" height="8" rx="2" fill="white" />
      <rect x="150" y="58" width="8" height="28" rx="2" fill="white" />
      {/* windows */}
      <rect
        x="46"
        y="68"
        width="50"
        height="32"
        rx="5"
        fill="#dbeafe"
        stroke="#1e4070"
        strokeWidth="1"
      />
      <rect
        x="106"
        y="68"
        width="50"
        height="32"
        rx="5"
        fill="#dbeafe"
        stroke="#1e4070"
        strokeWidth="1"
      />
      {/* cab window */}
      <rect
        x="238"
        y="88"
        width="40"
        height="30"
        rx="5"
        fill="#dbeafe"
        stroke="#1e4070"
        strokeWidth="1"
      />
      {/* wheels */}
      {[75, 185, 258].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="148" r="18" fill="#334155" stroke="#374151" strokeWidth="2" />
          <circle cx={cx} cy="148" r="9" fill="#64748b" />
          <circle cx={cx} cy="148" r="4" fill="#374151" />
        </g>
      ))}
      {/* siren lights */}
      <motion.rect
        x="80"
        y="52"
        width="22"
        height="10"
        rx="3"
        fill="#dc2626"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.rect
        x="116"
        y="52"
        width="22"
        height="10"
        rx="3"
        fill="#06b6d4"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* LIFELINE text */}
      <text
        x="50"
        y="82"
        fill="white"
        fontSize="11"
        fontWeight="700"
        fontFamily="monospace"
        letterSpacing="2"
      >
        LIFELINE AI
      </text>
      {/* speed lines */}
      {[95, 108, 121].map((y, i) => (
        <motion.line
          key={y}
          x1="10"
          y1={y}
          x2={20 - i * 2}
          y2={y}
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ x1: [10, -10, 10], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   AI Robot SVG
───────────────────────────────────────────── */
function RobotSVG() {
  return (
    <motion.svg viewBox="0 0 100 120" className="h-28 w-24" {...floatY}>
      {/* glow halo */}
      <circle cx="50" cy="45" r="38" fill="rgba(6,182,212,0.08)" />
      {/* head */}
      <rect
        x="22"
        y="18"
        width="56"
        height="46"
        rx="14"
        fill="#eff6ff"
        stroke="#60a5fa"
        strokeWidth="1.5"
      />
      {/* eyes */}
      <motion.circle
        cx="37"
        cy="38"
        r="7"
        fill="#06b6d4"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <motion.circle
        cx="63"
        cy="38"
        r="7"
        fill="#06b6d4"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <circle cx="37" cy="38" r="3" fill="white" />
      <circle cx="63" cy="38" r="3" fill="white" />
      {/* smile */}
      <path
        d="M38 52 Q50 60 62 52"
        stroke="#60a5fa"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* antenna */}
      <line x1="50" y1="18" x2="50" y2="8" stroke="#60a5fa" strokeWidth="2" />
      <motion.circle
        cx="50"
        cy="6"
        r="4"
        fill="#06b6d4"
        animate={{ r: [4, 5.5, 4], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      {/* body */}
      <rect
        x="28"
        y="66"
        width="44"
        height="32"
        rx="8"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      {/* chest cross */}
      <rect x="46" y="74" width="8" height="16" rx="2" fill="#dc2626" />
      <rect x="40" y="80" width="20" height="6" rx="2" fill="#dc2626" />
      {/* arms */}
      <rect
        x="10"
        y="68"
        width="16"
        height="8"
        rx="4"
        fill="#eff6ff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <rect
        x="74"
        y="68"
        width="16"
        height="8"
        rx="4"
        fill="#eff6ff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  action?: string;
  delay?: number;
  type?: 'default' | 'hospital' | 'health' | 'contacts';
}

function StatCard({
  icon,
  label,
  value,
  sub,
  subColor = 'text-blue-600',
  action,
  delay = 0,
  type = 'default',
}: StatCardProps) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{
        y: -5,
        scale: 1.015,
      }}
      className="
relative h-[140px]
min-w-0
overflow-hidden rounded-[18px]
px-6
py-5
"
      style={CARD_STYLE}
    >
      {/* glow */}
      <div
        className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'rgba(0,217,255,0.12)',
        }}
      />

      {/* top border glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,.14), transparent)',
        }}
      />

      {/* CONTENT */}
      <div className="relative flex h-full flex-col">
        {/* TOP */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <p className="mb-2 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-slate-500">
              {label}
            </p>

            {/* DEFAULT */}
            {type === 'default' && (
              <h2 className="text-[20px] font-black leading-none tracking-tight text-slate-800">
                {value}
              </h2>
            )}

            {/* HOSPITAL */}
            {type === 'hospital' && (
              <h2 className="text-[22px] font-black leading-[1] tracking-tight text-slate-800">
                Apollo
                <br />
                Hospital
              </h2>
            )}

            {/* HEALTH */}
            {type === 'health' && (
              <div className="text-[18px] font-black leading-tight tracking-tight text-slate-800">
                <div>LHID-</div>
                <div>2024-</div>
                <div>7845</div>
              </div>
            )}

            {/* CONTACTS */}
            {type === 'contacts' && (
              <div>
                <div className="text-[20px] font-black leading-none text-slate-800">3</div>

                <div className="mt-1 text-[16px] font-black leading-none text-slate-800">
                  Contacts
                </div>
              </div>
            )}

            {sub && <p className={`mt-2 text-sm font-bold ${subColor}`}>{sub}</p>}
          </div>

          {/* ICON */}
          <div
            className="flex flex-shrink-0 items-center justify-center rounded-[24px]"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(180deg, rgba(37,99,235,0.10), rgba(37,99,235,0.04))',
              border: '1px solid rgba(37,99,235,0.12)',
              boxShadow: '0 8px 20px rgba(37,99,235,0.08)',
            }}
          >
            {icon}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-auto pt-2">
          {action && (
            <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-500">
              {action}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero Dashboard
───────────────────────────────────────────── */
export default function HeroDashboard() {
  const [sosActive, setSosActive] = useState(false);

  return (
    <div className="relative w-full space-y-4 overflow-hidden p-4">
      {/* subtle grid texture */}
      {/* <div
  className="fixed inset-0 pointer-events-none opacity-[0.04]"
  style={{
    backgroundImage:
      "linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)",
    backgroundSize: "72px 72px",
    maskImage:
      "radial-gradient(circle at center, black 30%, transparent 100%)",
  }}
/> */}

      {/* ── Top row: SOS Hero + AI Assistant + Patient Summary ── */}
      <div className="grid grid-cols-12 items-stretch gap-6">
        {/* LEFT SECTION */}
        <div className="col-span-12 flex min-w-0 flex-col gap-4 xl:col-span-9">
          {/* SOS HERO CARD */}

          {/* ── Left: SOS Hero Card ── */}
          <motion.div className="relative overflow-hidden rounded-[32px]" style={CARD_STYLE}>
            {/* red ambient top-left */}
            <div
              className="pointer-events-none absolute left-0 top-0 h-56 w-72 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
                transform: 'translate(-30%, -30%)',
              }}
            />
            {/* cyan ambient bottom-right */}
            <div
              className="pointer-events-none absolute bottom-0 right-56 h-48 w-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
                transform: 'translate(20%, 30%)',
              }}
            />

            {/* LIVE badge */}
            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-red-200 bg-white/80 px-3 py-1 backdrop-blur-sm">
              <motion.div
                className="h-2 w-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-xs font-bold tracking-wider text-red-400">LIVE</span>
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-between gap-6 px-8 py-6 lg:flex-row lg:py-6">
              {/* text + button */}
              <div className="flex-1 lg:pt-2">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-2 text-4xl font-black leading-tight tracking-tight text-slate-800 lg:text-[48px]"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}
                >
                  Emergency{' '}
                  <span
                    className="text-red-500"
                    style={{
                      textShadow: '0 0 18px rgba(239,68,68,0.55)',
                    }}
                  >
                    SOS
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 max-w-xs text-base leading-relaxed text-slate-500"
                >
                  One tap for help. We are always
                  <br />
                  ready to save lives.
                </motion.p>

                {/* SOS Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSosActive(!sosActive)}
                  className="relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-lg font-black tracking-wide text-white"
                  style={{
                    background: 'linear-gradient(135deg,#ff4b5c 0%, #ff3131 45%, #b91c1c 100%)',
                    boxShadow:
                      '0 14px 40px rgba(255,59,92,.32), inset 0 1px 0 rgba(255,255,255,.18)',
                    border: '1px solid rgba(255,255,255,.12)',
                    transition: 'box-shadow 0.3s',
                    letterSpacing: '0.5px',
                  }}
                >
                  {/* shimmer */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                    }}
                  />
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Phone size={22} fill="white" />
                  </motion.div>
                  Tap to SOS
                </motion.button>

                {/* avatars + label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 flex items-center gap-3"
                >
                  <div className="flex -space-x-2">
                    {['#dc2626', '#059669', '#7c3aed'].map((bg, i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 text-xs font-bold text-white"
                        style={{ background: bg, zIndex: 3 - i }}
                      >
                        {['R', 'D', 'N'][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">24/7 Active Response</span>
                </motion.div>
              </div>

              {/* Ambulance illustration with radar */}
              <div className="relative h-[280px] w-[500px] flex-shrink-0 lg:-mr-2 lg:h-[220px] lg:w-[360px]">
                <div
                  className="absolute right-10 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full blur-[7px]"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,59,92,.22) 0%, rgba(59,130,246,.05) 45%, transparent 75%)',
                  }}
                />
                <RadarRings />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full">
                    <AmbulanceSVG />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4 STATS CARDS */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              delay={0.35}
              type="default"
              icon={<Zap size={22} className="text-blue-600" />}
              label="Nearest Ambulance"
              value="3.2 km"
              sub="ETA: 6 mins"
              subColor="text-emerald-500"
            />

            <StatCard
              delay={0.42}
              type="hospital"
              icon={<Building2 size={22} className="text-blue-600" />}
              label="Nearest Hospital"
              value=""
              sub="2.8 km"
              subColor="text-emerald-500"
            />

            <StatCard
              delay={0.49}
              type="health"
              icon={<Shield size={22} className="text-blue-600" />}
              label="Your Health ID"
              value=""
              action="View Profile"
            />

            <StatCard
              delay={0.56}
              type="contacts"
              icon={<Users size={22} className="text-blue-600" />}
              label="Emergency Contacts"
              value=""
              action="View All"
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-12 flex min-w-0 flex-col gap-4 xl:col-span-3">
          {/* AI Assistant */}
          <motion.div
            {...fadeUp(0.15)}
            className="
relative min-h-[190px] overflow-hidden rounded-2xl
p-5 before:pointer-events-none before:absolute
before:inset-0 before:rounded-[inherit]
before:border
 before:border-white/[0.03]"
            style={CARD_STYLE}
          >
            {/* cyan glow */}
            <div
              className="pointer-events-none absolute right-0 top-0 h-48 w-48"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
                transform: 'translate(25%, -25%)',
              }}
            />

            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800">AI Assistant</h3>
                  <motion.div
                    className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Online</span>
                  </motion.div>
                </div>
                <p className="max-w-[150px] text-sm leading-relaxed text-slate-400">
                  Hello! I'm your AI health assistant. How can I help you?
                </p>
              </div>
              <RobotSVG />
            </div>

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: '0 10px 24px rgba(37,99,235,0.18)',
              }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                border: '1px solid rgba(37,99,235,0.18)',
              }}
            >
              <MessageCircle size={16} />
              Chat Now
            </motion.button>
          </motion.div>

          {/* Patient Summary */}
          <motion.div
            {...fadeUp(0.25)}
            className="
relative h-[300px] overflow-hidden rounded-2xl p-5
before:pointer-events-none before:absolute before:inset-0
before:rounded-[inherit] before:border
before:border-white/[0.03]
"
            style={CARD_STYLE}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Patient Summary</h3>
              <Shield size={16} className="text-blue-600" />
            </div>

            <div className="space-y-2">
              {[
                {
                  icon: <Droplets size={13} className="text-red-400" />,
                  label: 'Blood Group',
                  value: 'O+',
                  valueColor: 'text-red-400',
                },
                {
                  icon: <AlertCircle size={13} className="text-amber-400" />,
                  label: 'Allergies',
                  value: 'Penicillin',
                  valueColor: 'text-amber-300',
                },
                {
                  icon: <Activity size={13} className="text-orange-400" />,
                  label: 'Chronic Conditions',
                  value: 'Asthma',
                  valueColor: 'text-orange-300',
                },
                {
                  icon: <Pill size={13} className="text-purple-400" />,
                  label: 'Current Medications',
                  value: '2',
                  valueColor: 'text-purple-300',
                },
              ].map(({ icon, label, value, valueColor }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-slate-200 py-2.5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-lg"
                      style={{ background: 'rgba(37,99,235,0.08)' }}
                    >
                      {icon}
                    </div>
                    <span className="text-sm text-slate-500">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${valueColor}`}>{value}</span>
                </div>
              ))}
            </div>

            <button
              className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-blue-600
transition-colors hover:text-blue-500"
            >
              View Full History <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ───────────────── MAIN DASHBOARD ───────────────── */}
      <div className="mt-6">
        <EmergencyCommandCenter />
      </div>
    </div>
  );
}
