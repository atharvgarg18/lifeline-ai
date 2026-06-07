"use client";

import { useState } from "react";
import { aiReportService } from "@/services/aiReportService";
import { pdfGenerator } from "@/utils/pdfGenerator";
import type {
  HealthReport,
  HealthQuestionnairePayload,
  YesNo,
} from "@/types/healthReport";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LifestyleAnswers {
  smoking: YesNo | "";
  alcoholConsumption: YesNo | "";
  regularExercise: YesNo | "";
  adequateHydration: YesNo | "";
}

interface MedicalConditionAnswers {
  diabetes: YesNo | "";
  hypertension: YesNo | "";
  asthma: YesNo | "";
  knownAllergies: YesNo | "";
}

interface RecentSymptomAnswers {
  fatigue: YesNo | "";
  headaches: YesNo | "";
  breathlessness: YesNo | "";
  chestDiscomfort: YesNo | "";
  sleepProblems: YesNo | "";
}

interface EmergencyPreparednessAnswers {
  bloodGroupAvailable: YesNo | "";
  emergencyContactAdded: YesNo | "";
  medicationListUpdated: YesNo | "";
  allergyRecordsUpdated: YesNo | "";
}

interface QuestionnaireState {
  lifestyle: LifestyleAnswers;
  medicalConditions: MedicalConditionAnswers;
  recentSymptoms: RecentSymptomAnswers;
  emergencyPreparedness: EmergencyPreparednessAnswers;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_STATE: QuestionnaireState = {
  lifestyle: {
    smoking: "",
    alcoholConsumption: "",
    regularExercise: "",
    adequateHydration: "",
  },
  medicalConditions: {
    diabetes: "",
    hypertension: "",
    asthma: "",
    knownAllergies: "",
  },
  recentSymptoms: {
    fatigue: "",
    headaches: "",
    breathlessness: "",
    chestDiscomfort: "",
    sleepProblems: "",
  },
  emergencyPreparedness: {
    bloodGroupAvailable: "",
    emergencyContactAdded: "",
    medicationListUpdated: "",
    allergyRecordsUpdated: "",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function QuestionDropdown({
  label,
  value,
  onChange,
  hasError,
}: {
  label: string;
  value: YesNo | "";
  onChange: (val: YesNo | "") => void;
  hasError: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as YesNo | "")}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
          hasError
            ? "border-red-300 bg-red-50 focus:border-red-400"
            : "border-slate-200 bg-white hover:border-blue-300 focus:border-blue-400"
        }`}
      >
        <option value="">— Select —</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      {hasError && (
        <p className="text-xs text-red-500">This field is required.</p>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  unit,
  icon,
  colorClass,
  bgClass,
}: {
  title: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-10 ${bgClass}`}
      />
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bgClass} ${colorClass}`}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p className={`mt-1 text-2xl font-bold ${colorClass}`}>
        {value}
        {unit && (
          <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
        )}
      </p>
    </div>
  );
}

function ReportCard({
  title,
  children,
  accent = "blue",
}: {
  title: string;
  children: React.ReactNode;
  accent?: "blue" | "green" | "amber" | "cyan";
}) {
  const accentMap = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-green-200 bg-green-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    cyan: "border-cyan-200 bg-cyan-50/50",
  };
  const titleMap = {
    blue: "text-blue-700",
    green: "text-green-700",
    amber: "text-amber-700",
    cyan: "text-cyan-700",
  };
  return (
    <div
      className={`rounded-2xl border p-5 ${accentMap[accent]} shadow-sm`}
    >
      <h3 className={`mb-3 text-sm font-semibold uppercase tracking-wider ${titleMap[accent]}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HealthIntelligenceContent() {
  const [answers, setAnswers] = useState<QuestionnaireState>(INITIAL_STATE);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<HealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function updateLifestyle<K extends keyof LifestyleAnswers>(
    key: K,
    val: YesNo | ""
  ) {
    setAnswers((prev) => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, [key]: val },
    }));
  }

  function updateMedical<K extends keyof MedicalConditionAnswers>(
    key: K,
    val: YesNo | ""
  ) {
    setAnswers((prev) => ({
      ...prev,
      medicalConditions: { ...prev.medicalConditions, [key]: val },
    }));
  }

  function updateSymptoms<K extends keyof RecentSymptomAnswers>(
    key: K,
    val: YesNo | ""
  ) {
    setAnswers((prev) => ({
      ...prev,
      recentSymptoms: { ...prev.recentSymptoms, [key]: val },
    }));
  }

  function updateEmergency<K extends keyof EmergencyPreparednessAnswers>(
    key: K,
    val: YesNo | ""
  ) {
    setAnswers((prev) => ({
      ...prev,
      emergencyPreparedness: { ...prev.emergencyPreparedness, [key]: val },
    }));
  }

  function allFieldsFilled(): boolean {
    return (
      Object.values(answers.lifestyle).every((v) => v !== "") &&
      Object.values(answers.medicalConditions).every((v) => v !== "") &&
      Object.values(answers.recentSymptoms).every((v) => v !== "") &&
      Object.values(answers.emergencyPreparedness).every((v) => v !== "")
    );
  }

  function isFieldError(val: string): boolean {
    return touched && val === "";
  }

  // ── Generate report ────────────────────────────────────────────────────────

  async function handleGenerateReport() {
    setTouched(true);
    if (!allFieldsFilled()) return;

    setLoading(true);
    setError(null);
    setReport(null);

    const payload: HealthQuestionnairePayload = {
      lifestyle: {
        smoking: answers.lifestyle.smoking as YesNo,
        alcoholConsumption: answers.lifestyle.alcoholConsumption as YesNo,
        regularExercise: answers.lifestyle.regularExercise as YesNo,
        adequateHydration: answers.lifestyle.adequateHydration as YesNo,
      },
      medicalConditions: {
        diabetes: answers.medicalConditions.diabetes as YesNo,
        hypertension: answers.medicalConditions.hypertension as YesNo,
        asthma: answers.medicalConditions.asthma as YesNo,
        knownAllergies: answers.medicalConditions.knownAllergies as YesNo,
      },
      recentSymptoms: {
        fatigue: answers.recentSymptoms.fatigue as YesNo,
        headaches: answers.recentSymptoms.headaches as YesNo,
        breathlessness: answers.recentSymptoms.breathlessness as YesNo,
        chestDiscomfort: answers.recentSymptoms.chestDiscomfort as YesNo,
        sleepProblems: answers.recentSymptoms.sleepProblems as YesNo,
      },
      emergencyPreparedness: {
        bloodGroupAvailable:
          answers.emergencyPreparedness.bloodGroupAvailable as YesNo,
        emergencyContactAdded:
          answers.emergencyPreparedness.emergencyContactAdded as YesNo,
        medicationListUpdated:
          answers.emergencyPreparedness.medicationListUpdated as YesNo,
        allergyRecordsUpdated:
          answers.emergencyPreparedness.allergyRecordsUpdated as YesNo,
      },
    };

    try {
      const result = await aiReportService.generateReport(payload);
      setReport(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── PDF / Print ────────────────────────────────────────────────────────────

  async function handleDownloadPDF() {
    if (!report) return;
    await pdfGenerator.downloadReport(report);
  }

  function handlePrint() {
    if (!report) return;
    window.print();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8" style={{ background: "#F8FAFC" }}>
      {/* ── SECTION 1: Summary Cards ── */}
      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard
            title="Health Score"
            value={report ? String(report.healthScore) : "—"}
            unit={report ? "/ 100" : undefined}
            colorClass="text-blue-600"
            bgClass="bg-blue-100"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            }
          />
          <SummaryCard
            title="Risk Level"
            value={report ? report.riskLevel : "—"}
            colorClass={
              report?.riskLevel === "LOW"
                ? "text-green-600"
                : report?.riskLevel === "MODERATE"
                ? "text-amber-600"
                : report
                ? "text-red-600"
                : "text-slate-400"
            }
            bgClass={
              report?.riskLevel === "HIGH"
                ? "bg-green-100"
                : report?.riskLevel === "MODERATE"
                ? "bg-amber-100"
                : report
                ? "bg-red-100"
                : "bg-slate-100"
            }
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            }
          />
          <SummaryCard
            title="Last Report"
            value={
              report
                ? new Date(report.generatedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
            colorClass="text-cyan-600"
            bgClass="bg-cyan-100"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            }
          />
          <SummaryCard
            title="AI Confidence"
            value={report ? `${report.confidence}%` : "—"}
            colorClass="text-indigo-600"
            bgClass="bg-indigo-100"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── SECTION 2: Questionnaire ── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <SectionHeading
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
          }
          title="Health Questionnaire"
          subtitle="Answer all questions to generate your personalised report."
        />

        <div className="space-y-8">
          {/* Lifestyle */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500">
              <span className="h-px flex-1 bg-blue-100" />
              Lifestyle
              <span className="h-px flex-1 bg-blue-100" />
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <QuestionDropdown
                label="Smoking"
                value={answers.lifestyle.smoking}
                onChange={(v) => updateLifestyle("smoking", v)}
                hasError={isFieldError(answers.lifestyle.smoking)}
              />
              <QuestionDropdown
                label="Alcohol Consumption"
                value={answers.lifestyle.alcoholConsumption}
                onChange={(v) => updateLifestyle("alcoholConsumption", v)}
                hasError={isFieldError(answers.lifestyle.alcoholConsumption)}
              />
              <QuestionDropdown
                label="Regular Exercise"
                value={answers.lifestyle.regularExercise}
                onChange={(v) => updateLifestyle("regularExercise", v)}
                hasError={isFieldError(answers.lifestyle.regularExercise)}
              />
              <QuestionDropdown
                label="Adequate Hydration"
                value={answers.lifestyle.adequateHydration}
                onChange={(v) => updateLifestyle("adequateHydration", v)}
                hasError={isFieldError(answers.lifestyle.adequateHydration)}
              />
            </div>
          </div>

          {/* Medical Conditions */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500">
              <span className="h-px flex-1 bg-blue-100" />
              Medical Conditions
              <span className="h-px flex-1 bg-blue-100" />
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <QuestionDropdown
                label="Diabetes"
                value={answers.medicalConditions.diabetes}
                onChange={(v) => updateMedical("diabetes", v)}
                hasError={isFieldError(answers.medicalConditions.diabetes)}
              />
              <QuestionDropdown
                label="Hypertension"
                value={answers.medicalConditions.hypertension}
                onChange={(v) => updateMedical("hypertension", v)}
                hasError={isFieldError(answers.medicalConditions.hypertension)}
              />
              <QuestionDropdown
                label="Asthma"
                value={answers.medicalConditions.asthma}
                onChange={(v) => updateMedical("asthma", v)}
                hasError={isFieldError(answers.medicalConditions.asthma)}
              />
              <QuestionDropdown
                label="Known Allergies"
                value={answers.medicalConditions.knownAllergies}
                onChange={(v) => updateMedical("knownAllergies", v)}
                hasError={isFieldError(answers.medicalConditions.knownAllergies)}
              />
            </div>
          </div>

          {/* Recent Symptoms */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500">
              <span className="h-px flex-1 bg-blue-100" />
              Recent Symptoms
              <span className="h-px flex-1 bg-blue-100" />
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QuestionDropdown
                label="Fatigue"
                value={answers.recentSymptoms.fatigue}
                onChange={(v) => updateSymptoms("fatigue", v)}
                hasError={isFieldError(answers.recentSymptoms.fatigue)}
              />
              <QuestionDropdown
                label="Headaches"
                value={answers.recentSymptoms.headaches}
                onChange={(v) => updateSymptoms("headaches", v)}
                hasError={isFieldError(answers.recentSymptoms.headaches)}
              />
              <QuestionDropdown
                label="Breathlessness"
                value={answers.recentSymptoms.breathlessness}
                onChange={(v) => updateSymptoms("breathlessness", v)}
                hasError={isFieldError(answers.recentSymptoms.breathlessness)}
              />
              <QuestionDropdown
                label="Chest Discomfort"
                value={answers.recentSymptoms.chestDiscomfort}
                onChange={(v) => updateSymptoms("chestDiscomfort", v)}
                hasError={isFieldError(answers.recentSymptoms.chestDiscomfort)}
              />
              <QuestionDropdown
                label="Sleep Problems"
                value={answers.recentSymptoms.sleepProblems}
                onChange={(v) => updateSymptoms("sleepProblems", v)}
                hasError={isFieldError(answers.recentSymptoms.sleepProblems)}
              />
            </div>
          </div>

          {/* Emergency Preparedness */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500">
              <span className="h-px flex-1 bg-blue-100" />
              Emergency Preparedness
              <span className="h-px flex-1 bg-blue-100" />
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <QuestionDropdown
                label="Blood Group Available"
                value={answers.emergencyPreparedness.bloodGroupAvailable}
                onChange={(v) => updateEmergency("bloodGroupAvailable", v)}
                hasError={isFieldError(answers.emergencyPreparedness.bloodGroupAvailable)}
              />
              <QuestionDropdown
                label="Emergency Contact Added"
                value={answers.emergencyPreparedness.emergencyContactAdded}
                onChange={(v) => updateEmergency("emergencyContactAdded", v)}
                hasError={isFieldError(answers.emergencyPreparedness.emergencyContactAdded)}
              />
              <QuestionDropdown
                label="Medication List Updated"
                value={answers.emergencyPreparedness.medicationListUpdated}
                onChange={(v) => updateEmergency("medicationListUpdated", v)}
                hasError={isFieldError(answers.emergencyPreparedness.medicationListUpdated)}
              />
              <QuestionDropdown
                label="Allergy Records Updated"
                value={answers.emergencyPreparedness.allergyRecordsUpdated}
                onChange={(v) => updateEmergency("allergyRecordsUpdated", v)}
                hasError={isFieldError(answers.emergencyPreparedness.allergyRecordsUpdated)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Generate Button ── */}
      <section className="flex flex-col items-center gap-3">
        {touched && !allFieldsFilled() && (
          <p className="flex items-center gap-1.5 text-sm text-red-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            Please answer all questions before generating your report.
          </p>
        )}
        {error && (
          <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing Health Data…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
              Generate Health Intelligence Report
            </>
          )}
        </button>
      </section>

      {/* ── SECTION 4: Generated Report ── */}
      {report && (
        <section className="space-y-5">
          <SectionHeading
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            }
            title="Generated Report"
            subtitle={`Report generated on ${new Date(report.generatedAt).toLocaleString("en-IN")}`}
          />

          {/* Executive Summary */}
          <ReportCard title="Executive Summary" accent="blue">
            <p className="text-sm leading-relaxed text-slate-700">
              {report.executiveSummary}
            </p>
          </ReportCard>

          {/* Health Score + Risk */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReportCard title="Health Score" accent="cyan">
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-cyan-700">
                  {report.healthScore}
                </span>
                <span className="mb-1 text-lg text-cyan-400">/ 100</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-cyan-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${report.healthScore}%` }}
                />
              </div>
            </ReportCard>

            <ReportCard
              title="Risk Level"
              accent={
                report.riskLevel === "LOW"
                  ? "green"
                  : report.riskLevel === "MODERATE"
                  ? "amber"
                  : "amber"
              }
            >
              <span
                className={`inline-flex items-center rounded-xl px-4 py-2 text-xl font-bold ${
                  report.riskLevel === "LOW"
                    ? "bg-green-100 text-green-700"
                    : report.riskLevel === "MODERATE"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {report.riskLevel}
              </span>
              <p className="mt-3 text-sm text-slate-600">
                {report.riskLevel === "LOW"
                  ? "Your current risk profile is within healthy parameters."
                  : report.riskLevel === "MODERATE"
                  ? "Some areas require attention. Review priority actions below."
                  : "Immediate attention recommended. Please consult a healthcare professional."}
              </p>
            </ReportCard>
          </div>

          {/* Top Findings */}
          <ReportCard title="Top Findings" accent="blue">
            <ul className="space-y-2">
              {report.findings.map((finding, idx) => (
  <li key={idx} className="flex items-start gap-2">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
      {idx + 1}
    </span>

    <div>
      <p className="text-sm text-slate-700">
    {finding}
   </p>

      
    </div>
  </li>
))}
            </ul>
          </ReportCard>

          {/* Priority Actions */}
          <ReportCard title="Priority Actions" accent="amber">
            <ul className="space-y-2">
              {report.priorityActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  {action}
                </li>
              ))}
            </ul>
          </ReportCard>

          {/* Recommendations */}
          <ReportCard title="Recommendations" accent="green">
            <ul className="space-y-2">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {rec}
                </li>
              ))}
            </ul>
          </ReportCard>

          {/* Emergency Preparedness Score + Confidence */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReportCard title="Emergency Preparedness Score" accent="cyan">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-cyan-700">
                  {report.emergencyReadinessScore}
                </span>
                <span className="mb-1 text-base text-cyan-400">/ 100</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cyan-100">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                  style={{ width: `${report.emergencyReadinessScore}%` }}
                />
              </div>
            </ReportCard>

            <ReportCard title="AI Confidence" accent="blue">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-blue-700">
                  {report.confidence}%
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-700"
                  style={{ width: `${report.confidence}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Based on the completeness and consistency of your inputs.
              </p>
            </ReportCard>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Generated at:{" "}
            {new Date(report.generatedAt).toLocaleString("en-IN", {
              dateStyle: "long",
              timeStyle: "medium",
            })}
          </div>
        </section>
      )}

      {/* ── SECTION 5: Actions ── */}
      <section className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
        <button
          onClick={handleDownloadPDF}
          disabled={!report}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          disabled={!report}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
          </svg>
          Print Report
        </button>
        {!report && (
          <p className="text-xs text-slate-400">
            Generate a report to enable export options.
          </p>
        )}
      </section>
    </div>
  );
}