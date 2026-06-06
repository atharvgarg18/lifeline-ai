"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  Phone,
  Copy,
  MessageCircle,
  Mail,
  MoreHorizontal,
  ChevronRight,
  User,
  Activity,
  Route,
  Share2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  })
};

const updates = [
  {
    time: "08:45 AM",
    title: "SOS Alert Received",
    desc: "Emergency request received from patient",
    done: true,
    live: false,
  },
  {
    time: "08:46 AM",
    title: "Ambulance Assigned",
    desc: "Ambulance AMB-1256 has been assigned",
    done: true,
    live: false,
  },
  {
    time: "08:47 AM",
    title: "En Route",
    desc: "Ambulance is on the way to patient location",
    done: true,
    live: true,
  },
  {
    time: "ETA\n08:51 AM",
    title: "Expected Arrival at Hospital",
    desc: "Estimated time of arrival at Apollo Hospital",
    done: false,
    live: false,
  },
];

const routeStats = [
  { icon: <Route size={16} />, label: "Total Distance", value: "5.6 km" },
  { icon: <Navigation size={16} />, label: "Distance Covered", value: "2.8 km" },
  { icon: <Clock size={16} />, label: "Time Elapsed", value: "00:04:30" },
  { icon: <Activity size={16} />, label: "ETA at Hospital", value: "6 mins" },
];

const team = [
  {
    name: "Dr. Arjun Mehta",
    role: "Cardiologist",
    initials: "AM",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Dr. Neha Kapoor",
    role: "Emergency Physician",
    initials: "NK",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Nurse Priya Sharma",
    role: "Senior Nurse",
    initials: "PS",
    color: "bg-teal-100 text-teal-700",
  },
];

const shareLinks = [
  { icon: <MessageCircle size={20} className="text-green-500" />, label: "WhatsApp", bg: "bg-green-50" },
  { icon: <MessageCircle size={20} className="text-blue-400" />, label: "SMS", bg: "bg-blue-50" },
  { icon: <Mail size={20} className="text-red-400" />, label: "Email", bg: "bg-red-50" },
  { icon: <MoreHorizontal size={20} className="text-gray-500" />, label: "More", bg: "bg-gray-100" },
];

function LiveUpdateCard() {
  return (
    <motion.div
      variants={fadeUp} custom={0} initial="hidden" animate="visible"
      className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col gap-1"
      style={{ minWidth: 0 }}
    >
      <h3 className="text-[15px] font-semibold text-gray-800 mb-3">Live Updates</h3>
      <div className="flex flex-col gap-0">
        {updates.map((u, i) => (
          <div key={i} className="flex gap-3 relative">
            {/* Timeline line */}
            {i < updates.length - 1 && (
              <div className="absolute left-[13px] top-[22px] w-[2px] bg-green-200 z-0" style={{ height: "calc(100% - 4px)" }} />
            )}
            {/* Dot */}
            <div className="relative z-10 flex-shrink-0 mt-1">
              {u.done ? (
                <div className="w-[26px] h-[26px] rounded-full bg-green-500 flex items-center justify-center shadow">
                  <CheckCircle size={14} className="text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="w-[26px] h-[26px] rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
              )}
            </div>
            {/* Content */}
            <div className="pb-5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-gray-400 font-medium whitespace-pre">{u.time}</span>
                {u.live && (
                  <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Live
                  </span>
                )}
              </div>
              <p className="text-[13px] font-semibold text-gray-800 mt-0.5">{u.title}</p>
              <p className="text-[12px] text-gray-400 leading-snug">{u.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RouteCard() {
  return (
    <motion.div
      variants={fadeUp} custom={1} initial="hidden" animate="visible"
      className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
    >
      <h3 className="text-[15px] font-semibold text-gray-800">Route &amp; Distance</h3>
      <div className="flex flex-col gap-3">
        {routeStats.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2.5 text-gray-500">
              <span className="text-blue-400">{s.icon}</span>
              <span className="text-[13px] text-gray-500">{s.label}</span>
            </div>
            <span className="text-[13px] font-semibold text-gray-800">{s.value}</span>
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="mt-1 w-full border border-blue-200 text-blue-600 rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
      >
        View Full Route <ChevronRight size={15} />
      </motion.button>
    </motion.div>
  );
}

function TeamCard() {
  return (
    <motion.div
      variants={fadeUp} custom={2} initial="hidden" animate="visible"
      className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-800">Emergency Team</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {team.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${m.color}`}>
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 truncate">{m.name}</p>
              <p className="text-[11px] text-gray-400">{m.role}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                On Call
              </span>
              <motion.button
                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.94 }}
                className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
              >
                <Phone size={13} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="mt-1 w-full border border-blue-200 text-blue-600 rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
      >
        View Team Details <ChevronRight size={15} />
      </motion.button>
    </motion.div>
  );
}

function ShareCard() {
  const [copied, setCopied] = useState(false);
  const link = "https://lifeline.ai/track/TRK-2025-05...";

  return (
    <motion.div
      variants={fadeUp} custom={3} initial="hidden" animate="visible"
      className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <Share2 size={16} className="text-blue-500" />
        <h3 className="text-[15px] font-semibold text-gray-800">Share Live Location</h3>
      </div>
      <p className="text-[12px] text-gray-400 -mt-2">Share this live tracking link with family</p>

      {/* Link field */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
        <span className="text-[12px] text-gray-500 flex-1 truncate">{link}</span>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
        >
          {copied
            ? <CheckCircle size={16} className="text-green-500" />
            : <Copy size={16} />}
        </motion.button>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-4 gap-2">
        {shareLinks.map((s, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl ${s.bg} transition-all`}
          >
            {s.icon}
            <span className="text-[10px] font-medium text-gray-600">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function LiveTrackingBottom() {
  return (
    <div
      className="min-h-screen bg-[#f4f6fb] flex items-start justify-center p-6"
      style={{ fontFamily: "'DM Sans', 'Nunito', 'Inter', sans-serif" }}
    >
      <div className="w-full max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <LiveUpdateCard />
          <RouteCard />
          <TeamCard />
          <ShareCard />
        </div>
      </div>
    </div>
  );
}
