"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Camera,
  FolderOpen,
  Package,
  ChevronRight,
  CheckCircle2,
  Truck,
  Clock,
  ShieldCheck,
  CreditCard,
  RefreshCcw,
  Headphones,
  Droplets,
  Activity,
  ShoppingBag,
  Cross,
  Dumbbell,
  Phone,
  MessageCircle,
  FileImage,
  FileText,
  FileType2,
} from "lucide-react";
import { useState, useRef } from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.46, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Orders data ───────────────────────────────────────────────────────────────
const ORDERS = [
  { id: "ORD12345", date: "May 03, 2025", time: "10:30 AM", amount: 542, items: 5, status: "Delivered" },
  { id: "ORD12344", date: "May 02, 2025", time: "04:15 PM", amount: 299, items: 3, status: "Shipped" },
  { id: "ORD12343", date: "May 01, 2025", time: "11:20 AM", amount: 1125, items: 7, status: "Processing" },
  { id: "ORD12342", date: "Apr 29, 2025", time: "09:10 PM", amount: 320, items: 2, status: "Delivered" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Delivered: {
    bg: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-600",
    icon: <CheckCircle2 size={11} />,
  },
  Shipped: {
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-600",
    icon: <Truck size={11} />,
  },
  Processing: {
    bg: "bg-amber-50 border border-amber-200",
    text: "text-amber-600",
    icon: <Clock size={11} />,
  },
};

// ─── Health Essentials ─────────────────────────────────────────────────────────
const ESSENTIALS = [
  { icon: Droplets, label: "Personal Care", sub: "Shampoos, soaps & more", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { icon: Activity, label: "Health Devices", sub: "BP Monitor, Thermometer", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { icon: ShoppingBag, label: "Daily Essentials", sub: "Masks, Sanitizers & more", iconBg: "bg-violet-50", iconColor: "text-violet-600" },
  { icon: Cross, label: "First Aid", sub: "Bandages, Antiseptics", iconBg: "bg-red-50", iconColor: "text-red-500" },
  { icon: Dumbbell, label: "Fitness & Nutrition", sub: "Supplements & more", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
];

// ─── Trust badges ──────────────────────────────────────────────────────────────
const TRUST = [
  { icon: ShieldCheck, label: "Genuine Medicines", sub: "100% authentic products", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { icon: CreditCard, label: "Secure Payments", sub: "Safe & secure checkout", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { icon: RefreshCcw, label: "Easy Returns", sub: "Hassle-free return policy", iconBg: "bg-violet-50", iconColor: "text-violet-600" },
  { icon: Headphones, label: "Pharmacy Support", sub: "24/7 customer support", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
];

// ─── Upload Prescription Card ──────────────────────────────────────────────────
function UploadCard() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploaded(file.name);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setUploaded(file.name);
  }

  return (
    <motion.div {...fadeUp(0.05)} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-full">
      <div>
        <p className="text-base font-bold text-slate-900">Upload Prescription</p>
        <p className="text-xs text-slate-400 mt-0.5">Get medicines delivered with your prescription</p>
      </div>

      {/* Drop zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        animate={{ borderColor: dragging ? "#2563EB" : "#E2E8F0", backgroundColor: dragging ? "#EFF6FF" : "#F8FAFC" }}
        transition={{ duration: 0.2 }}
        className="flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-8 px-4 cursor-pointer select-none"
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleFile} />
        <AnimatePresence mode="wait">
          {uploaded ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <p className="text-xs font-bold text-emerald-600 text-center">{uploaded}</p>
              <p className="text-[11px] text-slate-400">File ready to upload</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ y: dragging ? -6 : 0 }}
                transition={{ duration: 0.25 }}
                className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center"
              >
                <UploadCloud size={26} className="text-blue-500" />
              </motion.div>
              <p className="text-sm font-bold text-slate-700">Upload Prescription</p>
              <p className="text-[11px] text-slate-400">Drag &amp; drop your file here</p>
              {/* Format pills */}
              <div className="flex items-center gap-2 mt-1">
                {[
                  { icon: <FileImage size={10} />, label: "JPG" },
                  { icon: <FileImage size={10} />, label: "PNG" },
                  { icon: <FileText size={10} />, label: "PDF" },
                ].map((f) => (
                  <span key={f.label} className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {f.icon}{f.label}
                  </span>
                ))}
                <span className="text-[10px] text-slate-400">Max. 5MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(37,99,235,0.20)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-2xl transition-colors"
        >
          <FolderOpen size={15} />
          Choose File
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 font-semibold text-sm py-3 rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all"
        >
          <Camera size={15} />
          Take a Photo
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── My Orders Card ────────────────────────────────────────────────────────────
function OrdersCard() {
  return (
    <motion.div {...fadeUp(0.1)} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-slate-900">My Orders</p>
          <p className="text-xs text-slate-400 mt-0.5">Track your recent purchases</p>
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View All Orders <ChevronRight size={13} />
        </motion.button>
      </div>

      <div className="flex flex-col gap-2.5">
        {ORDERS.map((order, i) => {
          const s = STATUS_STYLES[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.38, delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 3, backgroundColor: "#F8FAFC" }}
              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 cursor-pointer transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Package size={15} className="text-slate-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">Order #{order.id}</p>
                <p className="text-[11px] text-slate-400">{order.date} &nbsp;|&nbsp; {order.time}</p>
              </div>

              {/* Status */}
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${s.bg} ${s.text}`}>
                {s.icon}
                {order.status}
              </span>

              {/* Amount + items */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black text-slate-900">₹{order.amount.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">{order.items} Items</p>
              </div>

              <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PharmacySection3() {
  return (
    <section className="w-full mt-8 space-y-5">

      {/* ══ Upload + Orders row ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UploadCard />
        <OrdersCard />
      </div>

      {/* ══ Health Essentials ══ */}
      <motion.div {...fadeUp(0.18)} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Health Essentials</h2>
          <motion.button whileHover={{ x: 2 }} className="flex items-center gap-1 text-xs font-semibold text-blue-600">
            View All <ChevronRight size={13} />
          </motion.button>
        </div>
        <div className="flex gap-4 flex-wrap">
          {ESSENTIALS.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(37,99,235,0.09)" }}
              className="flex-1 min-w-[130px] flex items-center gap-3 border border-slate-100 rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200 hover:border-blue-200 bg-slate-50/50"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${e.iconBg}`}>
                <e.icon size={18} className={e.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 leading-tight">{e.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{e.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══ Trust Section ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRUST.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(37,99,235,0.08)" }}
            className="bg-white border border-slate-200 rounded-3xl px-5 py-5 flex items-center gap-3 transition-all duration-300 hover:border-slate-300"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
              <t.icon size={18} className={t.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-tight">{t.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══ Support Banner ══ */}
      <motion.div
        {...fadeUp(0.34)}
        className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden px-8 py-6 flex items-center gap-6 flex-wrap shadow-xl"
      >
        {/* BG decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-8 -top-8 w-40 h-40 rounded-full bg-blue-600/10" />
          <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full bg-blue-600/10" />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-900/20 to-transparent" />
        </div>

        {/* Headphone icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
          <Headphones size={26} className="text-blue-400" />
          <motion.div
            className="absolute inset-0 rounded-2xl border border-blue-500/30"
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-[200px]">
          <p className="text-white font-black text-base leading-tight">Need help with your order?</p>
          <p className="text-slate-400 text-xs mt-0.5">Our pharmacy experts are here to assist you.</p>
        </div>

        {/* Phone number */}
        <div className="text-center flex-shrink-0">
          <motion.p
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="text-2xl font-black text-blue-400 tracking-wide"
          >
            1800 123 4567
          </motion.p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">24/7 Pharmacy Support</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(37,99,235,0.30)" }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors overflow-hidden"
          >
            {/* shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
            <MessageCircle size={14} />
            Chat Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors"
          >
            <Phone size={14} />
            Call Support
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
