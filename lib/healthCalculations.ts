// ============================================================
// lib/healthCalculations.ts
// All health metric calculations for LifeLine AI
// ============================================================

export interface HealthInput {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number; // cm
  weight: number; // kg
  bloodGroup: string;
  sleepHours: number;
  waterIntake: number; // liters per day
  exerciseFrequency: number; // days per week
  smokingStatus: "never" | "former" | "current";
  alcoholUsage: "none" | "occasional" | "moderate" | "heavy";
  stressLevel: number; // 1-10
  existingDiseases: string[];
  allergies: string[];
  medications: string[];
  familyHistory: string[];
}

export interface HealthMetrics {
  bmi: number;
  bmiCategory: "Underweight" | "Normal" | "Overweight" | "Obese";
  bmr: number;
  dailyCalories: number;
  sleepScore: number;
  hydrationScore: number;
  lifestyleScore: number;
  obesityRisk: "Low" | "Moderate" | "High" | "Very High";
  overallHealthScore: number;
}

// ── BMI ──────────────────────────────────────────────────────
export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(
  bmi: number
): "Underweight" | "Normal" | "Overweight" | "Obese" {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// ── BMR (Mifflin-St Jeor) ────────────────────────────────────
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === "male" ? base + 5 : base - 161);
}

// ── Daily Calorie Requirement (PAL multiplier) ────────────────
export function calculateDailyCalories(
  bmr: number,
  exerciseDaysPerWeek: number
): number {
  let pal = 1.2;
  if (exerciseDaysPerWeek >= 1 && exerciseDaysPerWeek <= 3) pal = 1.375;
  else if (exerciseDaysPerWeek <= 5) pal = 1.55;
  else if (exerciseDaysPerWeek <= 6) pal = 1.725;
  else if (exerciseDaysPerWeek === 7) pal = 1.9;
  return Math.round(bmr * pal);
}

// ── Sleep Score (0–100) ───────────────────────────────────────
export function calculateSleepScore(sleepHours: number): number {
  // Optimal range: 7–9 hours
  if (sleepHours >= 7 && sleepHours <= 9) return 100;
  if (sleepHours >= 6 && sleepHours < 7) return 75;
  if (sleepHours > 9 && sleepHours <= 10) return 80;
  if (sleepHours >= 5 && sleepHours < 6) return 50;
  if (sleepHours > 10) return 60;
  return 25; // < 5 hours
}

// ── Hydration Score (0–100) ───────────────────────────────────
export function calculateHydrationScore(
  waterLiters: number,
  weight: number
): number {
  // Recommended: ~0.033L per kg of body weight
  const recommended = weight * 0.033;
  const ratio = waterLiters / recommended;
  if (ratio >= 1) return Math.min(100, Math.round(ratio * 100));
  return Math.max(0, Math.round(ratio * 100));
}

// ── Lifestyle Score (0–100) ────────────────────────────────────
export function calculateLifestyleScore(input: HealthInput): number {
  let score = 100;

  // Exercise (max deduct 25)
  if (input.exerciseFrequency === 0) score -= 25;
  else if (input.exerciseFrequency <= 2) score -= 10;
  else if (input.exerciseFrequency <= 4) score -= 0;

  // Smoking (max deduct 25)
  if (input.smokingStatus === "current") score -= 25;
  else if (input.smokingStatus === "former") score -= 8;

  // Alcohol (max deduct 20)
  if (input.alcoholUsage === "heavy") score -= 20;
  else if (input.alcoholUsage === "moderate") score -= 10;
  else if (input.alcoholUsage === "occasional") score -= 3;

  // Stress (max deduct 20)
  score -= Math.round((input.stressLevel / 10) * 20);

  // Existing diseases (max deduct 10)
  score -= Math.min(input.existingDiseases.length * 3, 10);

  return Math.max(0, score);
}

// ── Obesity Risk ──────────────────────────────────────────────
export function calculateObesityRisk(
  bmi: number,
  exerciseFrequency: number
): "Low" | "Moderate" | "High" | "Very High" {
  if (bmi < 25 && exerciseFrequency >= 3) return "Low";
  if (bmi < 25) return "Moderate";
  if (bmi < 30) return exerciseFrequency >= 3 ? "Moderate" : "High";
  return "Very High";
}

// ── Overall Health Score (0–100) ──────────────────────────────
export function calculateOverallHealthScore(
  bmi: number,
  sleepScore: number,
  hydrationScore: number,
  lifestyleScore: number,
  age: number,
  existingDiseases: string[]
): number {
  // BMI contribution (25 pts)
  let bmiPoints = 0;
  const bmiCat = getBMICategory(bmi);
  if (bmiCat === "Normal") bmiPoints = 25;
  else if (bmiCat === "Overweight" || bmiCat === "Underweight") bmiPoints = 15;
  else bmiPoints = 5;

  // Sleep contribution (20 pts)
  const sleepPoints = (sleepScore / 100) * 20;

  // Hydration contribution (15 pts)
  const hydrationPoints = (hydrationScore / 100) * 15;

  // Lifestyle contribution (30 pts)
  const lifestylePoints = (lifestyleScore / 100) * 30;

  // Age & disease adjustment (10 pts)
  let baselinePoints = 10;
  if (age > 60) baselinePoints -= 2;
  baselinePoints -= Math.min(existingDiseases.length * 2, 8);

  const total =
    bmiPoints +
    sleepPoints +
    hydrationPoints +
    lifestylePoints +
    baselinePoints;
  return Math.round(Math.max(0, Math.min(100, total)));
}

// ── Master calculation function ───────────────────────────────
export function calculateAllMetrics(input: HealthInput): HealthMetrics {
  const bmi = calculateBMI(input.weight, input.height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(input.weight, input.height, input.age, input.gender);
  const dailyCalories = calculateDailyCalories(bmr, input.exerciseFrequency);
  const sleepScore = calculateSleepScore(input.sleepHours);
  const hydrationScore = calculateHydrationScore(
    input.waterIntake,
    input.weight
  );
  const lifestyleScore = calculateLifestyleScore(input);
  const obesityRisk = calculateObesityRisk(bmi, input.exerciseFrequency);
  const overallHealthScore = calculateOverallHealthScore(
    bmi,
    sleepScore,
    hydrationScore,
    lifestyleScore,
    input.age,
    input.existingDiseases
  );

  return {
    bmi,
    bmiCategory,
    bmr,
    dailyCalories,
    sleepScore,
    hydrationScore,
    lifestyleScore,
    obesityRisk,
    overallHealthScore,
  };
}