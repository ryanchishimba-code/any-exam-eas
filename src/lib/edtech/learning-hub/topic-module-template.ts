/**
 * Topic module template — structure + editorial QA checklist for board-prep hubs.
 * Use when authoring review modules, curated question sets, or learning-path units.
 */
import type { ExamSlug } from "@/types/edtech";

export type TopicModuleStage =
  | "foundations"
  | "clerkship"
  | "board-crunch"
  | "remediation";

export type TopicModuleSkill =
  | "mechanism"
  | "diagnosis"
  | "next_step"
  | "pharm_moa"
  | "interpretation"
  | "complication";

export type TopicModuleQuestionSet = {
  /** subjectId / topicCategory filter for question bank */
  practiceTopicSlug: string;
  /** Curated review questions (vignette + tutor mode) */
  reviewCount: number;
  /** Harder challenge set after review module */
  challengeCount?: number;
  /** Prefer physician-educator / ai-curated tags when sampling */
  curatedOnly?: boolean;
};

export type TopicModuleDefinition = {
  id: string;
  examSlug: ExamSlug;
  slug: string;
  stage: TopicModuleStage;
  system: string;
  title: string;
  overview: string;
  /** Primary skills tested in this module */
  skills: TopicModuleSkill[];
  /** Estimated minutes: read + practice */
  estimatedMinutes: number;
  /** Links to HighYieldTopic slug when a review module exists */
  reviewTopicSlug?: string;
  /** Question sets tied to this module */
  questions: TopicModuleQuestionSet;
  /** Systems/tags for adaptive weak-area routing */
  tags: string[];
  sortOrder: number;
};

/** Editorial QA checklist — mirror of usmle-qa-editor dimensions for human + AI authors. */
export const TOPIC_MODULE_QA_CHECKLIST = [
  {
    id: "vignette_separate",
    dimension: "vignetteQuality",
    rule: "Vignette is 2–4 sentences in scenario field; stem is lead-in only.",
    required: true,
  },
  {
    id: "demographics_objective",
    dimension: "vignetteQuality",
    rule: "Includes age/sex, setting, chief complaint, and discriminating objective data (vitals/labs/exam).",
    required: true,
  },
  {
    id: "criteria_in_vignette",
    dimension: "vignetteQuality",
    rule: "All eligibility criteria for the keyed answer appear in the vignette, not only the explanation.",
    required: true,
  },
  {
    id: "no_chart_boilerplate",
    dimension: "vignetteQuality",
    rule: 'No "Encounter 1234", room numbers, or shift-note timestamps unless clinically tested.',
    required: true,
  },
  {
    id: "high_yield_focus",
    dimension: "highYieldValue",
    rule: "Tests one board-relevant concept; no filler vitals or unrelated chart noise.",
    required: true,
  },
  {
    id: "plausible_distractors",
    dimension: "distractors",
    rule: "4–5 distractors are diagnosis/management alternatives a trainee would realistically consider.",
    required: true,
  },
  {
    id: "distractor_rationale",
    dimension: "correctAnswerExplanation",
    rule: "Explanation states why correct fits AND why each wrong option fails (UWorld style).",
    required: true,
  },
  {
    id: "clinical_reasoning",
    dimension: "integrationThinking",
    rule: "Includes a short reasoning chain (presentation → mechanism/differential → action).",
    required: true,
  },
  {
    id: "exam_alignment",
    dimension: "platformFit",
    rule: "Step 1 = mechanism/path; Step 2 = diagnosis/next step; Step 3 = sequential management.",
    required: true,
  },
  {
    id: "no_deictic_orphan",
    dimension: "overallPolish",
    rule: 'Stem avoids orphan "these findings" without prior clinical data in vignette.',
    required: true,
  },
] as const;

export type TopicModuleQaCheckId = (typeof TOPIC_MODULE_QA_CHECKLIST)[number]["id"];

export function validateTopicModuleDefinition(mod: TopicModuleDefinition): string[] {
  const errors: string[] = [];
  if (!mod.title.trim()) errors.push("title required");
  if (!mod.overview.trim()) errors.push("overview required");
  if (!mod.system.trim()) errors.push("system required");
  if (mod.skills.length === 0) errors.push("at least one skill required");
  if (mod.estimatedMinutes < 5) errors.push("estimatedMinutes should be ≥ 5");
  if (!mod.questions.practiceTopicSlug.trim()) errors.push("practiceTopicSlug required");
  if (mod.questions.reviewCount < 5) errors.push("reviewCount should be ≥ 5");
  if (mod.questions.challengeCount != null && mod.questions.challengeCount < 3) {
    errors.push("challengeCount should be ≥ 3 when set");
  }
  return errors;
}

export function topicModuleExamReadyScoreThreshold(): number {
  return 8;
}
