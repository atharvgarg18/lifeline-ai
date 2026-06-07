import type { HealthQuestionnairePayload, HealthReport } from "@/types/healthReport";

// ─── Constants ────────────────────────────────────────────────────────────────

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = `You are an expert preventive healthcare analyst.
Analyze patient information.
Generate:
- health score
- risk level
- executive summary
- findings
- priority actions
- emergency preparedness score
- recommendations
- confidence score
Return ONLY valid JSON.
Required JSON format:
{ "healthScore": 0, "riskLevel": "", "executiveSummary": "", "findings": [], "priorityActions": [], "emergencyReadinessScore": 0, "recommendations": [], "confidence": 0 }`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqRequestBody {
  model: string;
  messages: GroqMessage[];
  temperature: number;
  max_tokens: number;
  response_format: { type: "json_object" };
}

interface GroqChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface GroqApiResponse {
  id: string;
  choices: GroqChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface RawReportJson {
  healthScore?: unknown;
  riskLevel?: unknown;
  executiveSummary?: unknown;
  findings?: unknown;
  priorityActions?: unknown;
  emergencyReadinessScore?: unknown;
  recommendations?: unknown;
  confidence?: unknown;
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export class AiReportServiceError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_API_KEY"
      | "REQUEST_FAILED"
      | "MALFORMED_JSON"
      | "TIMEOUT"
      | "EMPTY_RESPONSE"
      | "VALIDATION_FAILED"
  ) {
    super(message);
    this.name = "AiReportServiceError";
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildUserPrompt(payload: HealthQuestionnairePayload): string {
  const { lifestyle, medicalConditions, recentSymptoms, emergencyPreparedness } =
    payload;

  return `Patient Health Assessment Data:

LIFESTYLE FACTORS:
- Smoking: ${lifestyle.smoking}
- Alcohol Consumption: ${lifestyle.alcoholConsumption}
- Regular Exercise: ${lifestyle.regularExercise}
- Adequate Hydration: ${lifestyle.adequateHydration}

MEDICAL CONDITIONS:
- Diabetes: ${medicalConditions.diabetes}
- Hypertension: ${medicalConditions.hypertension}
- Asthma: ${medicalConditions.asthma}
- Known Allergies: ${medicalConditions.knownAllergies}

RECENT SYMPTOMS:
- Fatigue: ${recentSymptoms.fatigue}
- Headaches: ${recentSymptoms.headaches}
- Breathlessness: ${recentSymptoms.breathlessness}
- Chest Discomfort: ${recentSymptoms.chestDiscomfort}
- Sleep Problems: ${recentSymptoms.sleepProblems}

EMERGENCY PREPAREDNESS:
- Blood Group Available: ${emergencyPreparedness.bloodGroupAvailable}
- Emergency Contact Added: ${emergencyPreparedness.emergencyContactAdded}
- Medication List Updated: ${emergencyPreparedness.medicationListUpdated}
- Allergy Records Updated: ${emergencyPreparedness.allergyRecordsUpdated}

Analyze this data and return ONLY valid JSON matching the required format. All numeric scores must be integers between 0 and 100. riskLevel must be one of: "Low", "Moderate", "High". findings, priorityActions, and recommendations must each be arrays of 3–5 non-empty strings.`;
}

function isStringArray(val: unknown): val is string[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    val.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function validateAndNormalize(raw: RawReportJson): HealthReport {
  const healthScore =
    typeof raw.healthScore === "number" &&
    raw.healthScore >= 0 &&
    raw.healthScore <= 100
      ? Math.round(raw.healthScore)
      : null;

  if (healthScore === null) {
    throw new AiReportServiceError(
      "Invalid or missing healthScore in AI response.",
      "VALIDATION_FAILED"
    );
  }

  const validRiskLevels = ["LOW", "MODERATE", "HIGH"] as const;
  type RiskLevel = (typeof validRiskLevels)[number];

  const normalizedRiskLevel =
  typeof raw.riskLevel === "string"
    ? raw.riskLevel.toUpperCase()
    : "";

const riskLevel =
  validRiskLevels.includes(normalizedRiskLevel as RiskLevel)
    ? (normalizedRiskLevel as RiskLevel)
    : null;

  if (!riskLevel) {
    throw new AiReportServiceError(
      `Invalid riskLevel "${raw.riskLevel}". Must be Low, Moderate, or High.`,
      "VALIDATION_FAILED"
    );
  }

  if (
    typeof raw.executiveSummary !== "string" ||
    raw.executiveSummary.trim().length === 0
  ) {
    throw new AiReportServiceError(
      "Missing or empty executiveSummary in AI response.",
      "VALIDATION_FAILED"
    );
  }

  if (!isStringArray(raw.findings)) {
    throw new AiReportServiceError(
      "findings must be a non-empty array of strings.",
      "VALIDATION_FAILED"
    );
  }

  if (!isStringArray(raw.priorityActions)) {
    throw new AiReportServiceError(
      "priorityActions must be a non-empty array of strings.",
      "VALIDATION_FAILED"
    );
  }

  if (!isStringArray(raw.recommendations)) {
    throw new AiReportServiceError(
      "recommendations must be a non-empty array of strings.",
      "VALIDATION_FAILED"
    );
  }

  const emergencyReadinessScore =
    typeof raw.emergencyReadinessScore === "number" &&
    raw.emergencyReadinessScore >= 0 &&
    raw.emergencyReadinessScore <= 100
      ? Math.round(raw.emergencyReadinessScore)
      : null;

  if (emergencyReadinessScore === null) {
    throw new AiReportServiceError(
      "Invalid or missing emergencyReadinessScore in AI response.",
      "VALIDATION_FAILED"
    );
  }

  const confidence =
    typeof raw.confidence === "number" &&
    raw.confidence >= 0 &&
    raw.confidence <= 100
      ? Math.round(raw.confidence)
      : null;

  if (confidence === null) {
    throw new AiReportServiceError(
      "Invalid or missing confidence score in AI response.",
      "VALIDATION_FAILED"
    );
  }

  return {
    healthScore,
    riskLevel,
    executiveSummary: raw.executiveSummary.trim(),
    findings: raw.findings,
    priorityActions: raw.priorityActions,
    recommendations: raw.recommendations,
    emergencyReadinessScore: emergencyReadinessScore,
    confidence,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

async function generateReport(
  payload: HealthQuestionnairePayload
): Promise<HealthReport> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new AiReportServiceError(
      "Groq API key is missing. Set NEXT_PUBLIC_GROQ_API_KEY in your environment.",
      "INVALID_API_KEY"
    );
  }

  const requestBody: GroqRequestBody = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(payload) },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new AiReportServiceError(
        `Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
        "TIMEOUT"
      );
    }

    throw new AiReportServiceError(
      `Network request failed: ${err instanceof Error ? err.message : "Unknown network error"}`,
      "REQUEST_FAILED"
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401) {
    throw new AiReportServiceError(
      "Invalid Groq API key. Please check your NEXT_PUBLIC_GROQ_API_KEY.",
      "INVALID_API_KEY"
    );
  }

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errorBody = await response.json();
      errorDetail = errorBody?.error?.message ?? "";
    } catch {
      // ignore parse errors on error body
    }

    throw new AiReportServiceError(
      `Groq API request failed with status ${response.status}${errorDetail ? `: ${errorDetail}` : ""}.`,
      "REQUEST_FAILED"
    );
  }

  let groqData: GroqApiResponse;

  try {
    groqData = (await response.json()) as GroqApiResponse;
  } catch {
    throw new AiReportServiceError(
      "Failed to parse Groq API response as JSON.",
      "MALFORMED_JSON"
    );
  }

  const rawContent = groqData?.choices?.[0]?.message?.content;

  if (!rawContent || rawContent.trim().length === 0) {
    throw new AiReportServiceError(
      "Groq returned an empty response. Please try again.",
      "EMPTY_RESPONSE"
    );
  }

  let parsed: RawReportJson;

  try {
    parsed = JSON.parse(rawContent) as RawReportJson;
  } catch {
    throw new AiReportServiceError(
      `AI response contained malformed JSON: ${rawContent.slice(0, 200)}`,
      "MALFORMED_JSON"
    );
  }

  return validateAndNormalize(parsed);
}

// ─── Exported service object ──────────────────────────────────────────────────

export const aiReportService = {
  generateReport,
} as const;