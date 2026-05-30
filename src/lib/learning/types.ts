import type { StudyQuestion } from "@/lib/questions/types";

/** Cognitive / reasoning gap taxonomy — extensible for AI labeling later. */
export type MistakeCategory =
  | "concept_misunderstanding"
  | "memorization_gap"
  | "clinical_reasoning"
  | "calculation_error"
  | "pattern_recognition"
  | "time_pressure"
  | "overconfidence"
  | "unknown";

export type AttemptInput = {
  userId: string;
  question: StudyQuestion;
  correct: boolean;
  confidence?: number;
  durationMs?: number;
  selectedAnswer?: string;
  sessionId?: string;
  fieldId: string;
};

export type MistakeAnalysis = {
  category: MistakeCategory;
  guessedCorrect: boolean;
  reasoning: string;
  weakConcepts: string[];
};

export type LearningInsight = {
  summary: string;
  whyCorrect: string;
  whyIncorrect: Record<string, string>;
  keyTakeaways: string[];
  pearls: string[];
  relatedConcepts: string[];
  commonTraps: string[];
  difficultyLabel?: string;
  mistakeAnalysis?: MistakeAnalysis;
};

export type ConceptMasterySnapshot = {
  conceptKey: string;
  fieldId: string;
  masteryScore: number;
  retentionStrength: number;
  confidenceReliability: number;
  attempts: number;
  trend: "improving" | "stable" | "declining";
};

export type LearningProfileSnapshot = {
  readinessScore: number;
  studyStreakDays: number;
  lastStudiedAt: string | null;
  weakestConcepts: ConceptMasterySnapshot[];
  strongestConcepts: ConceptMasterySnapshot[];
  fieldReadiness: { fieldId: string; score: number }[];
};

export type RemediationRecommendation = {
  type: "retry_questions" | "weak_area_quiz" | "foundational_review" | "timed_practice" | "mock_exam";
  title: string;
  description: string;
  href: string;
  priority: number;
};

export type ProcessAttemptResult = {
  attemptId?: string;
  insight: LearningInsight;
  remediation: RemediationRecommendation[];
  masteryDelta?: { conceptKey: string; masteryScore: number }[];
};
