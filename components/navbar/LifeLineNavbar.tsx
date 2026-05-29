"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, Bell, Globe, ChevronDown,
  LayoutDashboard, AlertCircle, MapPin, Building2, Truck,
  Stethoscope, Bot, ClipboardList, Droplets, Pill,
  BarChart3, Settings, HelpCircle, Calendar,
  Phone, Activity, ChevronRight, User, MessageCircle, LogOut,
} from "lucide-react";

import HeroDashboard from "../dashboard/HeroDashboard";
import { useAuth } from "@/context/AuthContext";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS  (exact colours from the reference image)
───────────────────────────────────────────────────────────────────────────── */
// bg:        #0d1420  (deep navy body)
// sidebar:   #111827  (slightly lighter panel)
// header:    #0d1420  (same as body, seamless)
// border:    rgba(255,255,255,0.06)
// accent-r:  #ef4444  (red — SOS, active, emergency)
// accent-c:  #06b6d4  (cyan — badges, links, focus rings)
// accent-p:  #a855f7  (purple — AI badge)
// text-1:    #f9fafb  white
// text-2:    #9ca3af  gray-400
// text-3:    #4b5563  gray-600

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  hasSubmenu?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",        icon: <LayoutDashboard      size={17} />, href: "/patient/dashboard" },
  { label: "Emergency SOS",    icon: <AlertCircle          size={17} />, badge: "SOS", href: "/emergency" },
  { label: "Live Tracking",    icon: <MapPin               size={17} />, href: "/tracking" },
  { label: "Hospitals",        icon: <Building2            size={17} />, hasSubmenu: true, href: "/hospitals" },
  { label: "Ambulances",       icon: <Truck                size={17} />, hasSubmenu: true, href: "/ambulances" },
  { label: "Find Doctor",      icon: <Stethoscope          size={17} />, href: "/patient/find-doctor" },
  { label: "AI Assistant",     icon: <Bot                  size={17} />, badge: "AI", href: "/ai" },
  { label: "Patient History",  icon: <ClipboardList        size={17} />, href: "/patient/history" },
  { label: "Appointments",     icon: <Calendar             size={17} />, href: "/patient/appointments" },
  { label: "Analytics",        icon: <BarChart3            size={17} />, href: "/patient/analytics" },
  { label: "Blood Bank",       icon: <Droplets             size={17} />, href: "/blood-bank" },
  { label: "Pharmacy",         icon: <Pill                 size={17} />, href: "/pharmacy" },
  { label: "Complaints",       icon: <MessageCircle size={17} />, href: "/complaints" },
  { label: "Settings",         icon: <Settings             size={17} />, href: "/settings" },
  { label: "Help & Support",   icon: <HelpCircle           size={17} />, href: "/help" },
];



const LANGUAGES = ["English", "हिन्दी", "বাংলা", "తెలుగు", "मराठी"];

/* ─────────────────────────────────────────────────────────────────────────────
   TINY HELPERS
───────────────────────────────────────────────────────────────────────────── */
function LiveDot({ color = "#22c55e" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: color }} />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOGO
───────────────────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
      {/* Icon pill */}
      <div className="relative flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center"
           style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", boxShadow: "0 0 18px rgba(239,68,68,.45)" }}>
        {/* ECG line */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="2,12 6,12 8,6 10,18 12,10 14,14 16,12 22,12"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* green online dot */}
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2"
              style={{ borderColor: "#111827" }} />
      </div>

      <div className="leading-none">
        <p className="text-[15px] font-extrabold tracking-wide text-white">
          LifeLine <span style={{ color: "#ef4444" }}>AI</span>
        </p>
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase mt-0.5"
           style={{ color: "#4b5563" }}>Emergency Healthcare</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR NAV ITEM
───────────────────────────────────────────────────────────────────────────── */
function SidebarItem({ item, active }: { item: NavItem; active: boolean }) {
  const badgeStyles: Record<string, string> = {
    AI:  "bg-purple-500/25 text-purple-300 border border-purple-500/40",
    SOS: "bg-red-500/25   text-red-300   border border-red-500/40",
  };

  return (
    <a href={item.href ?? "#"}
       className="group relative flex items-center gap-3 mx-3 px-3 py-[9px] rounded-xl transition-all duration-200 select-none"
       style={active
         ? { background:
"linear-gradient(90deg, rgba(255,77,109,.18), rgba(255,77,109,.04))", color: "#f9fafb" }
         : { color: "#6b7280" }}>

      {/* active left bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
              style={{ background: "#ef4444", boxShadow: "0 0 8px #ef4444" }} />
      )}

      {/* icon */}
      <span className="flex-shrink-0 transition-colors duration-150"
            style={{ color: active ? "#ef4444" : undefined }}
            /* group-hover handled inline because Tailwind purges dynamic colors */
      >
        <span className={active ? "" : "group-hover:text-cyan-400 transition-colors"}>{item.icon}</span>
      </span>

      {/* label */}
      <span className={`flex-1 text-[13px] font-medium transition-colors duration-150 ${active ? "text-white" : "group-hover:text-gray-200"}`}>
        {item.label}
      </span>

      {/* badge */}
      {item.badge && (
        <span className={`text-[10px] font-bold px-[6px] py-[2px] rounded-md leading-none ${badgeStyles[item.badge] ?? ""}`}>
          {item.badge}
        </span>
      )}

      {/* chevron */}
      {item.hasSubmenu && (
        <ChevronRight size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
      )}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SYSTEM STATUS CARD
───────────────────────────────────────────────────────────────────────────── */
function SystemStatus() {
  return (
    <div className="mx-4 mt-3 mb-2 rounded-xl px-3 py-3"
         style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
      <p className="text-[11px] font-medium mb-2" style={{ color: "#4b5563" }}>System Status</p>
      <div className="flex items-center gap-2 mb-2">
        <LiveDot color="#22c55e" />
        <span className="text-[12px] font-semibold text-green-400">All Systems Operational</span>
      </div>
      {/* sparkline */}
      <svg viewBox="0 0 120 28" className="w-full h-6 opacity-50">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity=".3"/>
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline points="0,22 12,18 24,20 36,13 48,16 60,8 72,12 84,6 96,10 108,4 120,8"
                  fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EMERGENCY CALL BUTTON
───────────────────────────────────────────────────────────────────────────── */
function EmergencyCallBtn() {
  return (
    <div className="mx-4 mb-5 mt-2">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
        style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,.18)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,.1)")}
      >
        {/* phone circle */}
        <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
             style={{ background: "rgba(239,68,68,.2)", border: "1px solid rgba(239,68,68,.5)",
                      boxShadow: "0 0 12px rgba(239,68,68,.3)" }}>
          <Phone size={16} style={{ color: "#f87171" }} />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-semibold leading-none mb-0.5" style={{ color: "#f87171" }}>
            Emergency Call
          </p>
          <p className="text-2xl font-black leading-none" style={{ color: "#ef4444" }}>108</p>
        </div>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR CONTENT
───────────────────────────────────────────────────────────────────────────── */
function SidebarContent({ active }: { active: string }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 pt-2 pb-1 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <SidebarItem key={item.label} item={item} active={item.label === active} />
        ))}
      </nav>
      <SystemStatus />
      <EmergencyCallBtn />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR (desktop sticky + mobile drawer)
───────────────────────────────────────────────────────────────────────────── */
function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const active = "Dashboard";
  const sidebarBg = "#081120";
  const sidebarBorder = "rgba(255,255,255,0.06)";

  return (
    <>
      {/* ── Desktop ── */}
      <aside className="hidden lg:flex flex-col w-[210px] flex-shrink-0 h-screen sticky top-0"
             style={{
  background: "rgba(8,17,32,0.92)",
  borderRight: `1px solid ${sidebarBorder}`,
  backdropFilter: "blur(20px)",
  boxShadow: "inset -1px 0 0 rgba(255,255,255,.03)"
}}>
        <Logo />
        <SidebarContent active={active} />
      </aside>

      {/* ── Mobile backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col lg:hidden shadow-2xl"
            style={{ background: sidebarBg, borderRight: `1px solid ${sidebarBorder}` }}
          >
            {/* mobile top bar */}
            <div className="flex items-center justify-between pr-4"
                 style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
              <Logo />
              <button onClick={onClose}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "#6b7280" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#f9fafb")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
                <X size={18} />
              </button>
            </div>
            <SidebarContent active={active} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────────────────────────────────── */
function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`relative flex-1 transition-all duration-300 ${focused ? "max-w-xl" : "max-w-md"}`}>
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
           style={{
  background: "rgba(7,18,36,.72)",
  border: "1px solid rgba(34,211,238,.08)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,.02), 0 0 40px rgba(0,229,255,.03)",
}}>
        <Search size={15} style={{ color: focused ? "#06b6d4" : "#4b5563", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search hospitals, services, doctors..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm outline-none min-w-0 placeholder-gray-600"
          style={{ color: "#f9fafb" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANGUAGE SELECTOR
───────────────────────────────────────────────────────────────────────────── */
function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("English");

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#d1d5db" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}>
        <Globe size={14} style={{ color: "#06b6d4" }} />
        <span className="hidden sm:block">{lang}</span>
        <ChevronDown size={12} style={{ color: "#6b7280" }}
                     className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: .97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: .97 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 mt-2 w-36 rounded-xl overflow-hidden z-50"
                      style={{ background: "#0d1420", border: "1px solid rgba(255,255,255,.1)",
                               boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => { setLang(l); setOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-100"
                      style={{ color: l === lang ? "#06b6d4" : "#9ca3af",
                               background: l === lang ? "rgba(6,182,212,.1)" : "transparent" }}
                      onMouseEnter={e => { if (l !== lang) e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}
                      onMouseLeave={e => { if (l !== lang) e.currentTarget.style.background = "transparent"; }}>
                {l}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NOTIFICATION BELL
───────────────────────────────────────────────────────────────────────────── */
const ALERTS = [
  { icon: "🔴", title: "Accident Reported",  sub: "Ring Road, Sector 12",  time: "2 min ago",  dot: "#ef4444" },
  { icon: "🟡", title: "High Traffic",        sub: "MG Road",               time: "5 min ago",  dot: "#f59e0b" },
  { icon: "🔴", title: "Hospital Full",       sub: "City Care Hospital",    time: "10 min ago", dot: "#ef4444" },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
              className="relative p-[9px] rounded-lg transition-all duration-150"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}>
        <Bell size={17} style={{ color: "#d1d5db" }} />
        <span className="absolute -top-1 -right-1 h-[18px] w-[18px] flex items-center justify-center rounded-full text-[10px] font-black text-white"
              style={{ background: "#ef4444", boxShadow: "0 0 10px rgba(239,68,68,.6)" }}>3</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: .97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: .97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-[300px] rounded-2xl overflow-hidden z-50"
                      style={{ background: "#0d1e35", border: "1px solid rgba(255,255,255,.09)",
                               boxShadow: "0 24px 48px rgba(0,0,0,.7)" }}>
            <div className="flex items-center justify-between px-4 py-3"
                 style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
              <span className="text-[13px] font-bold text-white">Recent Alerts</span>
              <button className="text-[11px] font-semibold" style={{ color: "#06b6d4" }}>View All →</button>
            </div>
            {ALERTS.map((a, i) => (
              <div key={i}
                   className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-100"
                   style={{ borderBottom: i < ALERTS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}
                   onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                   onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span className="mt-0.5 h-2 w-2 rounded-full flex-shrink-0 mt-[7px]"
                      style={{ backgroundColor: a.dot }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{a.title}</p>
                  <p className="text-[11px] truncate" style={{ color: "#6b7280" }}>{a.sub}</p>
                </div>
                <span className="text-[11px] flex-shrink-0" style={{ color: "#4b5563" }}>{a.time}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   USER PROFILE
───────────────────────────────────────────────────────────────────────────── */
function UserProfile() {
  return (
    <div className="flex items-center gap-3 pl-3" style={{ borderLeft: "1px solid rgba(255,255,255,.08)" }}>
      <div className="text-right hidden sm:block">
        <p className="text-[13px] font-bold text-white leading-tight">Rohan Verma</p>
        <p className="text-[11px] font-medium" style={{ color: "#06b6d4" }}>View Profile</p>
      </div>
      {/* avatar */}
      <div className="relative cursor-pointer">
        <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center"
             style={{ border: "2px solid rgba(6,182,212,.5)", boxShadow: "0 0 14px rgba(6,182,212,.2)",
                      background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
          <User size={16} className="text-white" />
        </div>
        {/* green online dot */}
        <span className="absolute bottom-0 right-0 h-[11px] w-[11px] rounded-full bg-green-400"
              style={{ border: "2px solid #0d1420" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOP HEADER
───────────────────────────────────────────────────────────────────────────── */
function TopHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-[62px]"
            style={{ background: "rgba(13,20,32,.97)", backdropFilter: "blur(16px)",
                     borderBottom: "1px solid rgba(255,255,255,.06)",
                     boxShadow: "0 1px 24px rgba(0,0,0,.4)" }}>

      {/* hamburger — mobile only */}
      <button onClick={onMenu}
              className="lg:hidden p-2 rounded-lg transition-all duration-150"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#9ca3af" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}>
        <Menu size={18} />
      </button>

      {/* logo — mobile only (desktop logo lives in sidebar) */}
      <div className="lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", boxShadow: "0 0 12px rgba(239,68,68,.4)" }}>
            <Activity size={15} className="text-white" />
          </div>
          <span className="text-[14px] font-black text-white">LifeLine <span style={{ color: "#ef4444" }}>AI</span></span>
        </div>
      </div>

      {/* search */}
      <SearchBar />

      {/* right cluster */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        <LanguageSelector />
        <NotificationBell />
        <UserProfile />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────────────────── */
/* ─── User Profile Block ───────────────────────────────────────────────────── */
function UserProfileBlock() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden sm:flex items-center gap-3 pl-4"
         style={{ borderLeft: "1px solid rgba(255,255,255,.06)" }}>
      <div className="text-right">
        <p className="text-[13px] font-bold text-white">{user?.name || "Guest"}</p>
        <p className="text-[11px] font-medium" style={{ color: "#22d3ee" }}>{user?.role || "PATIENT"}</p>
      </div>
      <div className="relative cursor-pointer" onClick={() => setOpen(v => !v)}>
        <div className="h-10 w-10 rounded-full flex items-center justify-center"
             style={{ background: "linear-gradient(135deg,#00d9ff,#2563eb)", border: "2px solid rgba(34,211,238,.4)", boxShadow: "0 0 20px rgba(34,211,238,.25)" }}>
          <User size={16} className="text-white" />
        </div>
        <span className="absolute bottom-0 right-0 h-[10px] w-[10px] rounded-full bg-green-400"
              style={{ border: "2px solid #071018" }} />
      </div>
      {open && (
        <div className="absolute right-0 top-14 w-44 rounded-2xl overflow-hidden z-50"
             style={{ background: "#0a1428", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 16px 40px rgba(0,0,0,.7)" }}>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function LifelineNavbar({
  children,
}: {
  children?: React.ReactNode;
})
 {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

 return (
  <div
    className="flex min-h-screen font-sans overflow-hidden"
    style={{
      background: "#050B17",
      backgroundImage: `
radial-gradient(circle at top left, rgba(0,229,255,.08), transparent 28%),
radial-gradient(circle at top right, rgba(255,59,92,.08), transparent 24%),
linear-gradient(to bottom, #050B17 0%, #07111F 45%, #08111F 100%)
`,
    }}
  >
    {/* SIDEBAR */}
    <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

    {/* MAIN CONTENT */}
    <div className="flex-1 flex flex-col min-w-0 relative">
      
      {/* subtle ambient glow */}
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-120px] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            background: "rgba(34,211,238,.06)",
          }}
        />

        <div
          className="absolute top-[-150px] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            background: "rgba(255,59,92,.06)",
          }}
        />
      </div>

{/* futuristic grid overlay */}
<div
  className="absolute inset-0 opacity-[0.03] pointer-events-none"
  style={{
    backgroundImage:
      "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
    backgroundSize: "80px 80px",
  }}
/>

{/* HEADER */}
<header
        className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-[68px]"
        style={{
          background: "rgba(5,11,23,.88)",
          backdropFilter: "blur(18px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,.04)",
          boxShadow: "0 10px 40px rgba(0,0,0,.35)",
        }}
      >
        {/* MOBILE MENU */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            color: "#9ca3af",
          }}
        >
          <Menu size={18} />
        </button>

        {/* MOBILE LOGO */}
        <div className="lg:hidden flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg,#ff3b5c,#ef4444)",
              boxShadow: "0 0 18px rgba(255,59,92,.45)",
            }}
          >
            <Activity size={15} className="text-white" />
          </div>

          <span className="text-[15px] font-black text-white tracking-wide">
            LifeLine{" "}
            <span style={{ color: "#ff3b5c" }}>AI</span>
          </span>
        </div>

        {/* SEARCH */}
        <div className="relative flex-1 max-w-xl">
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.05)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.02)",
            }}
          >
            <Search
              size={16}
              style={{ color: "#22d3ee" }}
            />

            <input
              type="text"
              placeholder="Search hospitals, services, doctors..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-600"
              style={{ color: "#f9fafb" }}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 ml-auto">
          
          {/* LANGUAGE */}
          <button
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <Globe size={15} style={{ color: "#22d3ee" }} />
            <span className="text-sm text-white">English</span>
            <ChevronDown size={13} className="text-gray-500" />
          </button>

          {/* NOTIFICATION */}
          <button
            className="relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <Bell size={17} className="text-white" />

            <span
              className="absolute -top-1 -right-1 h-[18px] w-[18px] rounded-full flex items-center justify-center text-[10px] font-black text-white"
              style={{
                background: "#ff3b5c",
                boxShadow:
"0 0 18px rgba(255,59,92,.45)",
              }}
            >
              3
            </span>
          </button>

          {/* PROFILE */}
          <UserProfileBlock />
        </div>
      </header>

      {/* MAIN PREVIEW */}

      <div className="relative z-10 flex-1 overflow-y-auto">
  {children ? children : <HeroDashboard />}
</div>

      {/* /<main className="flex-1 flex items-center justify-center rel
      ative z-10"> *}
        <div className="text-center">
          
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{
              background: "rgba(34,211,238,.08)",
              border: "1px solid rgba(34,211,238,.18)",
              color: "#19d3ff",
            }}
          >
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold">
              LifeLine AI Dashboard Active
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            Emergency
            <span
              style={{
                color: "#22d3ee",
                textShadow:
"0 0 22px rgba(0,217,255,.18)",
              }}
            >
              {" "}
              Intelligence
            </span>
          </h1>

          <p
            className="mt-6 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7b8798" }}
          >
            AI-powered emergency healthcare coordination platform
            with futuristic real-time response systems.
          </p>
        </div>
      {/* </main> */}
    </div>
  </div>
);
}