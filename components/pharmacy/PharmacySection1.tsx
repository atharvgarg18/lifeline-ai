"use client";

import { motion } from "framer-motion";
import {
  Upload,
  Search,
  Pill,
  Bike,
  Tag,
  ShieldCheck,
  Syringe,
  Tablets,
  FlaskConical,
  Droplets,
  Baby,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.46, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  sub,
  iconBg,
  iconColor,
  delay,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  iconBg: string;
  iconColor: string;
  delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(37,99,235,0.09)" }}
      className="flex-1 min-w-0 bg-white border border-slate-200 rounded-3xl px-5 py-5 flex items-center gap-4 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-slate-900 leading-tight">{value}</p>
        <p className="text-sm font-bold text-slate-700 leading-tight truncate">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-tight">{sub}</p>
      </div>
    </motion.div>
  );
}

// ─── Category Pill ─────────────────────────────────────────────────────────────
function CategoryPill({
  icon,
  label,
  iconBg,
  iconColor,
  delay,
  isViewAll,
}: {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
  delay: number;
  isViewAll?: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.36, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center gap-2 cursor-pointer group ${isViewAll ? "" : ""}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:shadow-md ${iconBg} ${
          isViewAll ? "border-2 border-dashed border-slate-300 bg-white" : ""
        }`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">{label}</span>
    </motion.button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function PharmacySection1() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="w-full space-y-5 px-1">

      {/* ── Title Row ── */}
      <motion.div {...fadeUp(0)} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacy</h1>
          <p className="text-slate-500 text-sm mt-1">
            Order medicines &amp; health products. Fast delivery to your doorstep.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(37,99,235,0.18)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors shadow-md shadow-blue-100"
        >
          <Upload size={15} />
          Upload Prescription
        </motion.button>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="flex gap-4 flex-wrap">
        <StatCard
          delay={0.05}
          icon={<Pill size={22} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          value="25,430+"
          label="Medicines Available"
          sub="Wide range of products"
        />
        <StatCard
          delay={0.1}
          icon={<Bike size={22} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          value="30–60 min"
          label="Fast Delivery"
          sub="Quick doorstep delivery"
        />
        <StatCard
          delay={0.15}
          icon={<Tag size={22} />}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          value="50% OFF"
          label="Deals & Offers"
          sub="On selected products"
        />
        <StatCard
          delay={0.2}
          icon={<ShieldCheck size={22} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          value="100%"
          label="Genuine Products"
          sub="Sourced from trusted pharmacies"
        />
      </div>

      {/* ── Search + Categories Row ── */}
      <div className="flex gap-5 flex-wrap">

        {/* Search Card */}
        <motion.div
          {...fadeUp(0.22)}
          className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex-1 min-w-[260px]"
        >
          <p className="text-sm font-bold text-slate-800 mb-3">Search Medicines</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by medicine name, brand or condition..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-blue-100"
            >
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* Browse by Category Card */}
        <motion.div
          {...fadeUp(0.27)}
          className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex-[1.4] min-w-[320px]"
        >
          <p className="text-sm font-bold text-slate-800 mb-4">Browse by Category</p>
          <div className="flex items-start gap-5 flex-wrap">
            <CategoryPill
              delay={0.30}
              icon={<Syringe size={20} />}
              iconBg="bg-red-50"
              iconColor="text-red-500"
              label="Pain Relief"
            />
            <CategoryPill
              delay={0.33}
              icon={<FlaskConical size={20} />}
              iconBg="bg-amber-50"
              iconColor="text-amber-500"
              label="Vitamins"
            />
            <CategoryPill
              delay={0.36}
              icon={<Tablets size={20} />}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              label="Diabetes Care"
            />
            <CategoryPill
              delay={0.39}
              icon={<Droplets size={20} />}
              iconBg="bg-pink-50"
              iconColor="text-pink-500"
              label="Skin Care"
            />
            <CategoryPill
              delay={0.42}
              icon={<Baby size={20} />}
              iconBg="bg-violet-50"
              iconColor="text-violet-500"
              label="Baby Care"
            />
            <CategoryPill
              delay={0.45}
              icon={<LayoutGrid size={16} />}
              iconBg="bg-slate-50"
              iconColor="text-slate-500"
              label="View All"
              isViewAll
            />
          </div>
        </motion.div>
      </div>

      {/* ── Promo Banner ── */}
      <motion.div
        {...fadeUp(0.32)}
        whileHover={{ scale: 1.005, boxShadow: "0 16px 48px rgba(16,185,129,0.12)" }}
        className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl overflow-hidden px-8 py-5 flex items-center gap-6 shadow-md shadow-emerald-100 transition-all duration-300"
      >
        {/* BG decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-6 right-32 w-24 h-24 rounded-full bg-white" />
          <div className="absolute top-2 right-16 w-12 h-12 rounded-full bg-white" />
        </div>

        {/* Delivery illustration placeholder */}
        <div className="relative w-20 h-16 flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Bike size={32} className="text-white" />
          </div>
          {/* Sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles size={14} className="text-yellow-200" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-black text-xl leading-tight">
              Flat 20% OFF{" "}
              <span className="font-normal text-base text-white/90">on all medicines</span>
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <p className="text-white/80 text-sm">
              Use code:{" "}
              <span className="font-black text-white bg-white/20 px-2 py-0.5 rounded-lg tracking-wider">
                HEALTH20
              </span>
            </p>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <Zap size={12} className="text-yellow-200" />
              Free delivery on orders above ₹499
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.96 }}
          className="relative flex-shrink-0 flex items-center gap-2 bg-white text-emerald-700 font-black text-sm px-6 py-3 rounded-2xl shadow-lg transition-all"
        >
          Shop Now
          <ChevronRight size={14} />
        </motion.button>
      </motion.div>
    </section>
  );
}
