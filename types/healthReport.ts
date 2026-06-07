// src/types/healthReport.ts

export type YesNo = "Yes" | "No";

export interface HealthFinding {
  title: string;
  description: string;
}

export interface PriorityAction {
  priority: string;
  action: string;
}

export interface Recommendation {
  title?: string;
  description: string;
}

export interface HealthQuestionnairePayload {
  lifestyle: {
    smoking: YesNo;
    alcoholConsumption: YesNo;
    regularExercise: YesNo;
    adequateHydration: YesNo;
  };

  medicalConditions: {
    diabetes: YesNo;
    hypertension: YesNo;
    asthma: YesNo;
    knownAllergies: YesNo;
  };

  recentSymptoms: {
    fatigue: YesNo;
    headaches: YesNo;
    breathlessness: YesNo;
    chestDiscomfort: YesNo;
    sleepProblems: YesNo;
  };

  emergencyPreparedness: {
    bloodGroupAvailable: YesNo;
    emergencyContactAdded: YesNo;
    medicationListUpdated: YesNo;
    allergyRecordsUpdated: YesNo;
  };
}

export interface HealthMetrics {
  healthScore?: number;
  dailySteps?: number;
  sleepHours?: number;
  heartRate?: number;
  stressLevel?: number;
  activityLevel?: string;
}

export interface HealthReport {
  healthScore: number;

  riskLevel: "LOW" | "MODERATE" | "HIGH";

  executiveSummary: string;

  findings: string[];

  priorityActions: string[];

  emergencyReadinessScore: number;

  recommendations: string[];

  confidence: number;

  generatedAt: string;
}

export interface GenerateReportPayload {
  analyticsData: HealthMetrics;
  questionnaireData: HealthQuestionnairePayload;
}