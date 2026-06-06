import { z } from "zod";

/** Branded string helpers — compile-time distinction without runtime cost. */
export type Brand<T, B extends string> = T & { readonly __brand: B };
export type UserId = Brand<string, "UserId">;
export type QuestionKey = Brand<string, "QuestionKey">;
export type FieldId = Brand<string, "FieldId">;

export const EXAM_TYPES = ["NCLEX", "USMLE", "NAPLEX", "MPJE"] as const;
export type ExamType = (typeof EXAM_TYPES)[number];

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const ADAPTIVE_MODES = [
  "PRACTICE",
  "ADAPTIVE_QUIZ",
  "WEAK_AREAS",
  "MIXED_REVIEW",
  "FULL_SIM",
] as const;
export type AdaptiveMode = (typeof ADAPTIVE_MODES)[number];

export type SelectionFactor =
  | "weakness"
  | "srs_due"
  | "yield"
  | "difficulty_match"
  | "novelty"
  | "recency_penalty";

export type FactorScore = {
  factor: SelectionFactor;
  score: number;
  weight: number;
  detail: string;
};

export type QuestionCandidate = {
  questionKey: string;
  fieldId: string;
  subjectId?: string;
  tags: string[];
  difficulty: DifficultyLevel;
  highYield: boolean;
  /** Days since last attempt; null = never seen */
  daysSinceLastAttempt: number | null;
  /** Topic weakness 0 (strong) – 1 (weak) */
  weaknessScore: number;
  /** SRS due score 0–1 (1 = most overdue) */
  srsDueScore: number;
  /** Ability estimate 0–1 for this item */
  abilityEstimate: number;
};

export type ScoredSelection = {
  questionKey: string;
  totalScore: number;
  factors: FactorScore[];
  reasoning: string;
};

export type MasteryRecord = {
  questionKey: string;
  fieldId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextDue: Date;
  abilityEstimate: number;
  lastAttemptAt: Date | null;
  correctStreak: number;
};

export type AttemptOutcome = {
  correct: boolean;
  confidence?: number;
  durationMs?: number;
  timePressure?: boolean;
};

export const AIExplanationSchema = z.object({
  summary: z.string().min(1),
  whyCorrect: z.string().min(1),
  whyIncorrect: z.record(z.string()).optional(),
  keyTakeaways: z.array(z.string()).max(6).optional(),
  pearls: z.array(z.string()).max(4).optional(),
  relatedConcepts: z.array(z.string()).max(6).optional(),
  difficultyLabel: z.string().optional(),
});

export type AIExplanation = z.infer<typeof AIExplanationSchema>;

export const PersonalizedPlanSchema = z.object({
  headline: z.string(),
  focusTopics: z.array(z.string()).max(8),
  dailyGoalMinutes: z.number().int().min(10).max(180).optional(),
  rationale: z.string(),
});

export type PersonalizedPlan = z.infer<typeof PersonalizedPlanSchema>;

export function asUserId(id: string): UserId {
  return id as UserId;
}

export function asQuestionKey(key: string): QuestionKey {
  return key as QuestionKey;
}

export function asFieldId(id: string): FieldId {
  return id as FieldId;
}

export function parseDifficulty(value?: string | null): DifficultyLevel {
  const v = value?.toLowerCase();
  if (v === "easy" || v === "hard") return v;
  return "medium";
}

export function studyModeToAdaptive(mode: string): AdaptiveMode {
  switch (mode) {
    case "adaptive":
    case "cat":
      return "ADAPTIVE_QUIZ";
    case "weak_area":
      return "WEAK_AREAS";
    case "mock":
    case "timed":
      return "FULL_SIM";
    case "rapid":
      return "MIXED_REVIEW";
    default:
      return "PRACTICE";
  }
}
