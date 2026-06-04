"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Truck, UserCheck, CreditCard, Pill, MoreHorizontal,
  ChevronRight, Upload, X, FileText, ImageIcon, CheckCircle2,
  ChevronDown, AlertCircle, Send, Paperclip,
} from "lucide-react";

/* ─── Types ─── */
type UploadedFile = { name: string; size: string; type: "pdf" | "image" };

/* ─── Data ─── */
const categories = [
  { value: "hospital",   label: "Hospital Services",    icon: <Building2 size={16}/>, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", desc: "Facilities, staff, treatment, rooms" },
  { value: "ambulance",  label: "Ambulance Services",   icon: <Truck size={16}/>,     color: "#DC2626", bg: "#FFF1F2", border: "#FECDD3", desc: "Response time, behavior, dispatch" },
  { value: "doctor",     label: "Doctor & Staff",       icon: <UserCheck size={16}/>, color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", desc: "Consultation, conduct, staff issues" },
  { value: "billing",    label: "Billing & Payments",   icon: <CreditCard size={16}/>,color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", desc: "Overcharge, insurance, invoices" },
  { value: "pharmacy",   label: "Pharmacy",             icon: <Pill size={16}/>,      color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", desc: "Medicines, delivery, refunds" },
  { value: "others",     label: "Others",               icon: <MoreHorizontal size={16}/>, color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0", desc: "General feedback & complaints" },
];

const subjectSuggestions: Record<string, string[]> = {
  hospital: ["Unclean ward / room", "Long waiting time", "Rude staff behavior", "Equipment malfunction"],
  ambulance: ["Late ambulance arrival", "Rude driver", "Incorrect billing", "Vehicle not equipped"],
  doctor: ["Misdiagnosis concern", "Doctor behavior", "Wrong prescription", "Consultation too short"],
  billing: ["Overcharged for services", "Insurance claim rejected", "Incorrect invoice", "Refund not processed"],
  pharmacy: ["Medicine not delivered", "Wrong medicine dispensed", "Expired medication", "Refund issue"],
  others: ["General feedback", "Suggestion", "Appreciation", "Other issue"],
};

/* ─── Animations ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: d } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const childAnim = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] } } };

/* ─── Category Dropdown Item ─── */
function CategoryOption({ cat, selected, onClick }: { cat: typeof categories[0]; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-[#F1F5F9] last:border-0 ${selected ? "bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]"}`}>
      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: cat.bg, color: cat.color }}>{cat.icon}</span>
      <span className={`text-sm font-medium ${selected ? "text-[#2563EB]" : "text-[#1E293B]"}`}>{cat.label}</span>
      {selected && <CheckCircle2 size={14} className="ml-auto text-[#2563EB]" />}
    </button>
  );
}

/* ─── Main Component ─── */
export default function ComplaintsFormSection() {
  const [selectedCat, setSelectedCat] = useState("");
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeCat = categories.find(c => c.value === selectedCat);
  const canSubmit = selectedCat && subject.trim().length > 2 && description.trim().length > 10;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).slice(0, 3 - files.length);
    addFiles(dropped);
  }, [files]);

  const addFiles = (list: File[]) => {
    const mapped: UploadedFile[] = list.map(f => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type === "application/pdf" ? "pdf" : "image",
    }));
    setFiles(prev => [...prev, ...mapped].slice(0, 3));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={stagger}
      className="w-full bg-[#F8FAFC] px-6 py-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">

          {/* ═══════════════════════════════
              LEFT — Complaint Form
          ═══════════════════════════════ */}
          <motion.div variants={childAnim}
            className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Send size={16} className="text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">Raise a New Complaint</h2>
                <p className="text-xs text-[#94A3B8]">Tell us about your issue and we'll get it resolved.</p>
              </div>
              {activeCat && (
                <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: activeCat.bg, color: activeCat.color, border: `1px solid ${activeCat.border}` }}>
                  {activeCat.icon} {activeCat.label}
                </motion.span>
              )}
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
                  Category <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <button onClick={() => setShowCatDrop(!showCatDrop)}
                    className={`w-full flex items-center gap-3 border rounded-2xl px-4 py-3 text-sm text-left transition-all ${
                      showCatDrop ? "border-[#2563EB] bg-white shadow-sm" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-white"
                    }`}>
                    {activeCat ? (
                      <>
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: activeCat.bg, color: activeCat.color }}>{activeCat.icon}</span>
                        <span className="font-medium text-[#1E293B]">{activeCat.label}</span>
                      </>
                    ) : (
                      <span className="text-[#94A3B8]">Select a category</span>
                    )}
                    <ChevronDown size={14} className={`ml-auto text-[#94A3B8] transition-transform ${showCatDrop ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showCatDrop && (
                      <motion.div initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }} transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-30 overflow-hidden">
                        {categories.map(cat => (
                          <CategoryOption key={cat.value} cat={cat} selected={selectedCat === cat.value}
                            onClick={() => { setSelectedCat(cat.value); setShowCatDrop(false); setSubject(""); }} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
                  Subject <span className="text-[#EF4444]">*</span>
                </label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="Enter complaint subject"
                  className="w-full border border-[#E2E8F0] rounded-2xl px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all" />

                {/* Suggestions */}
                <AnimatePresence>
                  {selectedCat && !subject && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <p className="text-[11px] text-[#94A3B8] mt-2 mb-1.5">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subjectSuggestions[selectedCat]?.map(s => (
                          <button key={s} onClick={() => setSubject(s)}
                            className="px-3 py-1 rounded-full border border-[#E2E8F0] bg-white text-xs text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
                  Description <span className="text-[#EF4444]">*</span>
                </label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail — include dates, names, or any relevant information that will help us resolve your complaint faster..."
                  rows={5}
                  className="w-full border border-[#E2E8F0] rounded-2xl px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all resize-none leading-relaxed" />
                <div className="flex justify-between mt-1.5">
                  <p className="text-[11px] text-[#94A3B8]">Minimum 10 characters</p>
                  <span className={`text-[11px] font-medium ${description.length < 10 ? "text-[#94A3B8]" : "text-[#059669]"}`}>
                    {description.length} chars
                  </span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
                  Upload Evidence <span className="text-[#94A3B8] font-normal normal-case">(Optional)</span>
                </label>

                <motion.div
                  animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#2563EB] bg-[#EFF6FF]"
                      : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#EFF6FF]/40"
                  }`}
                  style={isDragging ? { boxShadow: "0 0 0 4px rgba(37,99,235,.1)" } : {}}
                >
                  {/* Animated ring when dragging */}
                  {isDragging && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-2xl border-2 border-[#2563EB] pointer-events-none"
                      style={{ animation: "pulse 1s ease-in-out infinite" }} />
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3">
                    <Upload size={20} className={`transition-colors ${isDragging ? "text-[#2563EB]" : "text-[#60A5FA]"}`} />
                  </div>
                  <p className="text-sm font-semibold text-[#1E293B] mb-1">
                    {isDragging ? "Drop files here" : "Drag & drop files here or click to upload"}
                  </p>
                  <p className="text-xs text-[#94A3B8]">Supports JPG, PNG, PDF — Max 5MB per file</p>

                  <input ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                    onChange={e => { if (e.target.files) addFiles(Array.from(e.target.files)); }} />
                </motion.div>

                {/* File list */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3 space-y-2">
                      {files.map((f, i) => (
                        <motion.div key={f.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${f.type === "pdf" ? "bg-[#FFF1F2]" : "bg-[#EFF6FF]"}`}>
                            {f.type === "pdf" ? <FileText size={14} className="text-[#DC2626]" /> : <ImageIcon size={14} className="text-[#2563EB]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1E293B] truncate">{f.name}</p>
                            <p className="text-[11px] text-[#94A3B8]">{f.size}</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter((_, j) => j !== i)); }}
                            className="w-6 h-6 rounded-full bg-[#F1F5F9] hover:bg-[#FEE2E2] flex items-center justify-center transition-colors">
                            <X size={11} className="text-[#94A3B8] hover:text-[#DC2626]" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl px-4 py-3">
                <AlertCircle size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
                <p className="text-xs text-[#3B82F6] leading-relaxed">
                  All complaints are treated confidentially. Our team will contact you within{" "}
                  <strong>24 business hours</strong> with an update.
                </p>
              </div>

              {/* Submit */}
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl py-4 text-[#059669] font-bold text-sm">
                    <CheckCircle2 size={18} />
                    Complaint Submitted Successfully!
                  </motion.div>
                ) : (
                  <motion.button key="btn"
                    whileHover={canSubmit ? { scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,.28)" } : {}}
                    whileTap={canSubmit ? { scale: 0.97 } : {}}
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${
                      canSubmit
                        ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-100"
                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                    }`}>
                    <Send size={15} />
                    Submit Complaint
                  </motion.button>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

          {/* ═══════════════════════════════
              RIGHT — Categories panel
          ═══════════════════════════════ */}
          <motion.div variants={childAnim} className="flex flex-col gap-4">

            {/* Panel header */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl px-5 py-4 shadow-sm">
              <h2 className="text-base font-bold text-[#1E293B] mb-0.5">Complaint Categories</h2>
              <p className="text-xs text-[#94A3B8]">Select a category that best matches your issue.</p>
            </div>

            {/* Category cards */}
            <div className="space-y-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  onHoverStart={() => setHoveredCat(cat.value)}
                  onHoverEnd={() => setHoveredCat(null)}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedCat(cat.value); setShowCatDrop(false); }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all"
                  style={
                    selectedCat === cat.value
                      ? { background: cat.bg, borderColor: cat.border, boxShadow: `0 4px 14px ${cat.color}18` }
                      : hoveredCat === cat.value
                      ? { background: cat.bg, borderColor: cat.border }
                      : { background: "#fff", borderColor: "#E2E8F0" }
                  }
                >
                  {/* Icon */}
                  <motion.div
                    animate={selectedCat === cat.value || hoveredCat === cat.value
                      ? { background: cat.color, color: "#fff" }
                      : { background: cat.bg, color: cat.color }}
                    transition={{ duration: 0.18 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  >
                    {cat.icon}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1E293B] mb-0.5">{cat.label}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{cat.desc}</p>
                  </div>

                  {/* Arrow / Selected */}
                  {selectedCat === cat.value ? (
                    <CheckCircle2 size={16} className="shrink-0" style={{ color: cat.color }} />
                  ) : (
                    <ChevronRight size={15} className="shrink-0 transition-colors"
                      style={{ color: hoveredCat === cat.value ? cat.color : "#CBD5E1" }} />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Help note */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl px-4 py-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                <Paperclip size={14} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1E293B] mb-1">Need Immediate Help?</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  For urgent issues, use the <strong className="text-[#DC2626]">Emergency SOS</strong> button or call our 24/7 helpline at{" "}
                  <strong className="text-[#2563EB]">1800-XXX-XXXX</strong>
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
