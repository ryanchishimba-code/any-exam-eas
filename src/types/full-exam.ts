import type { ExamSlug } from "@/types/edtech";
import type { CatSessionState } from "@/lib/questions/cat-engine";

/** User-selected exam length preset on the launcher. */
export type FullExamLengthPreset = "50" | "100" | "full";

/** Persisted NCLEX practice-CAT outcome (not a pass/fail prediction). */
export type FullExamCatOutcome = CatSessionState & {
  practiceBand: { label: string; hint: string };
};

export type FullExamSessionConfig = {
  lengthPreset: FullExamLengthPreset;
  questionCount: number;
  timed: boolean;
  timeLimitSec: number;
  adaptive: boolean;
  /** NCLEX minimum (85) vs maximum (150) CAT-style length. */
  nclexLength?: "minimum" | "maximum";
  /** Blueprint category ids/labels to focus — omit for full board topic mix. */
  focusAreas?: string[];
  /** NCLEX rule-based CAT simulation (85–150Q stop rules). */
  nclexCat?: boolean;
  /** Hide score summary — weak-area remediation only. */
  silentReview?: boolean;
};

export type FullExamQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topicCategory?: string;
};

export type FullExamAnswerState = {
  selected: string[];
  eliminated: string[];
  flagged: boolean;
  notes: string;
};

export type FullExamTopicBreakdown = {
  topic: string;
  correct: number;
  total: number;
  pct: number;
};

export type FullExamQuestionSnapshot = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topicCategory?: string;
};

export type FullExamResultsAnalysis = {
  sessionConfig: FullExamSessionConfig;
  timeUsedSec: number;
  topicBreakdown: FullExamTopicBreakdown[];
  questionIds: string[];
  questionSnapshots: FullExamQuestionSnapshot[];
  summary: string;
  /** Present when the session ran live NCLEX practice CAT stop rules. */
  catOutcome?: FullExamCatOutcome;
};

export type FullExamSlug = ExamSlug;
