/** Shared types for the serve-ready LLM QA scanner. */

export type QaScanExamSlug =
  | "naplex"
  | "nclex"
  | "usmle"
  | "pance"
  | "aanp-fnp"
  | "npte-pt"
  | "all";

export type QaScanProvider = "openai" | "anthropic";

export type QaScanVerdict = "pass" | "fail" | "review" | "skipped";

export type HeuristicIssue = {
  code: string;
  severity: "error" | "warn";
  message: string;
};

export type LlmDimensionScores = {
  logicClarity: number;
  answerValidity: number;
  boardQuality: number;
  distractorQuality: number;
  rationaleQuality: number;
};

export type LlmItemEvaluation = {
  itemId: string;
  verdict: QaScanVerdict;
  pass: boolean;
  scores: LlmDimensionScores;
  overallScore: number;
  singleCorrectAnswer: boolean;
  issues: string[];
  suggestedFixes: string[];
  rewriteStem?: string;
  rewriteRationale?: string;
};

export type QaScanItemResult = {
  id: string;
  fieldId: string;
  subjectId: string;
  itemType: string;
  source: string;
  verdict: QaScanVerdict;
  pass: boolean;
  heuristicOk: boolean;
  heuristicIssues: HeuristicIssue[];
  llm?: LlmItemEvaluation;
  skippedLlmReason?: string;
};

export type QaScanSummary = {
  generatedAt: string;
  exam: QaScanExamSlug;
  fieldIds: string[];
  mode: "heuristics-only" | "heuristics+llm" | "llm-only";
  provider?: QaScanProvider;
  model?: string;
  totalQueried: number;
  totalEvaluated: number;
  heuristicFail: number;
  llmEvaluated: number;
  pass: number;
  fail: number;
  review: number;
  skipped: number;
  averageScores?: Partial<LlmDimensionScores & { overall: number }>;
  topIssueCodes: Array<{ code: string; count: number }>;
  topLlmIssues: Array<{ issue: string; count: number }>;
};

export type QaScanReport = {
  summary: QaScanSummary;
  items: QaScanItemResult[];
};

export type QaScanCheckpoint = {
  startedAt: string;
  updatedAt: string;
  processedIds: string[];
  itemResults: QaScanItemResult[];
};
