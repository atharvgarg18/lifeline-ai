"use client";
// ============================================================
// components/ai/HealthForm.tsx
// Collects all user health data with validation
// ============================================================

import React, { useState } from "react";
import { HealthInput } from "@/lib/healthCalculations";

interface HealthFormProps {
  onSubmit: (data: HealthInput) => void;
  isLoading: boolean;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const defaultForm: HealthInput = {
  name: "",
  age: 25,
  gender: "male",
  height: 170,
  weight: 70,
  bloodGroup: "O+",
  sleepHours: 7,
  waterIntake: 2,
  exerciseFrequency: 3,
  smokingStatus: "never",
  alcoholUsage: "none",
  stressLevel: 5,
  existingDiseases: [],
  allergies: [],
  medications: [],
  familyHistory: [],
};

// Helper: convert comma-separated string to array
function toArray(val: string): string[] {
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function HealthForm({ onSubmit, isLoading }: HealthFormProps) {
  const [form, setForm] = useState(defaultForm);

  // Separate string states for list fields (comma-separated input)
  const [diseasesStr, setDiseasesStr] = useState("");
  const [allergiesStr, setAllergiesStr] = useState("");
  const [medicationsStr, setMedicationsStr] = useState("");
  const [familyHistoryStr, setFamilyHistoryStr] = useState("");

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.age < 1 || form.age > 120) e.age = "Age must be 1–120";
    if (form.height < 50 || form.height > 300) e.height = "Height: 50–300 cm";
    if (form.weight < 2 || form.weight > 500) e.weight = "Weight: 2–500 kg";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      existingDiseases: toArray(diseasesStr),
      allergies: toArray(allergiesStr),
      medications: toArray(medicationsStr),
      familyHistory: toArray(familyHistoryStr),
    });
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2";
  const sectionClass = "bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Basic Details ──────────────────────────────────── */}
      <div className={sectionClass}>
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center text-xs">1</span>
          Basic Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              className={inputClass}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Age</label>
            <input
              type="number"
              className={inputClass}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: +e.target.value })}
            />
            {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <select
              className={inputClass}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value as HealthInput["gender"] })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Blood Group</label>
            <select
              className={inputClass}
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Height (cm)</label>
            <input
              type="number"
              className={inputClass}
              value={form.height}
              onChange={(e) => setForm({ ...form, height: +e.target.value })}
            />
            {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
          </div>

          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input
              type="number"
              className={inputClass}
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: +e.target.value })}
            />
            {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
          </div>
        </div>
      </div>

      {/* ── Lifestyle Data ──────────────────────────────────── */}
      <div className={sectionClass}>
        <h3 className="text-sm font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-violet-400/20 flex items-center justify-center text-xs">2</span>
          Lifestyle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sleep Hours / Night</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              className={inputClass}
              value={form.sleepHours}
              onChange={(e) => setForm({ ...form, sleepHours: +e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Water Intake (L / Day)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className={inputClass}
              value={form.waterIntake}
              onChange={(e) => setForm({ ...form, waterIntake: +e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Exercise (Days / Week)</label>
            <input
              type="number"
              min="0"
              max="7"
              className={inputClass}
              value={form.exerciseFrequency}
              onChange={(e) => setForm({ ...form, exerciseFrequency: +e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>
              Stress Level — <span className="text-white/70">{form.stressLevel}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full accent-violet-400 mt-3"
              value={form.stressLevel}
              onChange={(e) => setForm({ ...form, stressLevel: +e.target.value })}
            />
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>Low</span><span>High</span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Smoking Status</label>
            <select
              className={inputClass}
              value={form.smokingStatus}
              onChange={(e) => setForm({ ...form, smokingStatus: e.target.value as HealthInput["smokingStatus"] })}
            >
              <option value="never">Never</option>
              <option value="former">Former Smoker</option>
              <option value="current">Current Smoker</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Alcohol Usage</label>
            <select
              className={inputClass}
              value={form.alcoholUsage}
              onChange={(e) => setForm({ ...form, alcoholUsage: e.target.value as HealthInput["alcoholUsage"] })}
            >
              <option value="none">None</option>
              <option value="occasional">Occasional</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Medical Information ─────────────────────────────── */}
      <div className={sectionClass}>
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-xs">3</span>
          Medical Information
          <span className="ml-auto text-white/20 text-xs font-normal normal-case tracking-normal">comma-separated</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Existing Diseases</label>
            <input
              className={inputClass}
              placeholder="e.g. Diabetes, Hypertension"
              value={diseasesStr}
              onChange={(e) => setDiseasesStr(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Allergies</label>
            <input
              className={inputClass}
              placeholder="e.g. Peanuts, Penicillin"
              value={allergiesStr}
              onChange={(e) => setAllergiesStr(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Current Medications</label>
            <input
              className={inputClass}
              placeholder="e.g. Metformin, Aspirin"
              value={medicationsStr}
              onChange={(e) => setMedicationsStr(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Family History</label>
            <input
              className={inputClass}
              placeholder="e.g. Heart Disease, Cancer"
              value={familyHistoryStr}
              onChange={(e) => setFamilyHistoryStr(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Submit ──────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing Health Data…
          </span>
        ) : (
          "Analyze My Health →"
        )}
      </button>
    </form>
  );
}