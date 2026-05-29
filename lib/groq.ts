// ============================================================
// lib/groq.ts
// Groq AI client setup and request utility for LifeLine AI
// ============================================================

import Groq from "groq-sdk";
import { HealthInput, HealthMetrics } from "./healthCalculations";

// Initialize Groq client using env variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── AI response shape ─────────────────────────────────────────
export interface AIHealthAnalysis {
  overallHealth: string;
  riskLevel: string;
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  futureRisks: string[];
}

// ── Build structured prompt ───────────────────────────────────
function buildHealthPrompt(
  input: HealthInput,
  metrics: HealthMetrics
): string {
  return `
You are an expert AI health analyst. Analyze the following patient data and metrics.
Respond ONLY with a valid JSON object — no markdown, no explanations, no code fences.

PATIENT PROFILE:
- Name: ${input.name}
- Age: ${input.age}
- Gender: ${input.gender}
- Height: ${input.height} cm | Weight: ${input.weight} kg
- Blood Group: ${input.bloodGroup}

LIFESTYLE:
- Sleep: ${input.sleepHours} hours/night
- Water Intake: ${input.waterIntake} L/day
- Exercise: ${input.exerciseFrequency} days/week
- Smoking: ${input.smokingStatus}
- Alcohol: ${input.alcoholUsage}
- Stress Level: ${input.stressLevel}/10

MEDICAL HISTORY:
- Existing Conditions: ${input.existingDiseases.join(", ") || "None"}
- Allergies: ${input.allergies.join(", ") || "None"}
- Current Medications: ${input.medications.join(", ") || "None"}
- Family History: ${input.familyHistory.join(", ") || "None"}

CALCULATED METRICS:
- BMI: ${metrics.bmi} (${metrics.bmiCategory})
- BMR: ${metrics.bmr} kcal/day
- Daily Calorie Need: ${metrics.dailyCalories} kcal
- Sleep Score: ${metrics.sleepScore}/100
- Hydration Score: ${metrics.hydrationScore}/100
- Lifestyle Score: ${metrics.lifestyleScore}/100
- Obesity Risk: ${metrics.obesityRisk}
- Overall Health Score: ${metrics.overallHealthScore}/100

Return EXACTLY this JSON structure with realistic, specific, actionable content:
{
  "overallHealth": "one of: Excellent | Good | Moderate | Poor",
  "riskLevel": "one of: Low | Moderate | High | Critical",
  "summary": "2-3 sentences summarizing the patient's overall health status",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "concerns": ["concern 1", "concern 2", "concern 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"],
  "futureRisks": ["risk 1", "risk 2", "risk 3"]
}
`.trim();
}

// ── Main AI request function ──────────────────────────────────
export async function analyzeHealthWithAI(
  input: HealthInput,
  metrics: HealthMetrics
): Promise<AIHealthAnalysis> {
  const prompt = buildHealthPrompt(input, metrics);

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.4,
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content:
          "You are a precise health analyst AI. You always respond with valid JSON only. Never include markdown formatting, code fences, or explanatory text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  // Strip any accidental markdown fences before parsing
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed: AIHealthAnalysis = JSON.parse(cleaned);
  return parsed;
}