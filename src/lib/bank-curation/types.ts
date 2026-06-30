/** Shared types for the NCLEX Question Bank Curation Engine. */

export const CURATION_FIELD_ID = "nursing" as const;

/** Cosine similarity threshold for near-duplicate candidate pairs. */
export const SIMILARITY_THRESHOLD = 0.87;

/** Target curated bank size. */
export const DEFAULT_CURATION_TARGET = 3000;

/** Auto-keep when composite quality score >= this (0–10). */
export const KEEP_MIN_SCORE = 8.0;

/** Human review band (0–10). */
export const REVIEW_MIN_SCORE = 7.0;

export type CurationQuestionRow = {
  id: string;
  subjectId: string;
  topicCategory: string | null;
  blueprintTopic: string | null;
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  source: string;
  tags: string | null;
  hasEmbedding: boolean;
};

export type QualityDimensionScores = {
  nclexRealism: number;
  distractorQuality: number;
  rationaleQuality: number;
  freshness: number;
  clarity: number;
  examAuthenticity: number;
};

export type QualityScoreResult = {
  composite: number;
  ruleScore: number;
  llmScore: number | null;
  dimensions: Partial<QualityDimensionScores>;
  tier: "keep" | "review" | "drop";
  issues: string[];
  scoredBy: "rule" | "llm" | "blended";
};

export type SimilarPair = {
  a: string;
  b: string;
  similarity: number;
};

export type CurationCluster = {
  clusterId: string;
  memberIds: string[];
  avgSimilarity: number;
  recommendedKeepIds: string[];
  droppedIds: string[];
};

export type CategoryBalanceRow = {
  categoryId: string;
  label: string;
  targetWeight: number;
  targetCount: number;
  beforeCount: number;
  afterCount: number;
  delta: number;
};

export type CurationReport = {
  runId: string;
  startedAt: string;
  completedAt: string;
  fieldId: string;
  targetCount: number;
  inputCount: number;
  embeddedCount: number;
  clusterCount: number;
  duplicateClusters: number;
  recommendedKeep: number;
  recommendedReview: number;
  recommendedDrop: number;
  applied: boolean;
  categoryBalance: CategoryBalanceRow[];
  topDuplicateTopics: Array<{ topic: string; clusterCount: number; removedCount: number }>;
  sampleClusters: CurationCluster[];
};

export type CurationPipelineOptions = {
  target: number;
  dryRun: boolean;
  apply: boolean;
  embedOnly: boolean;
  clusterOnly: boolean;
  scoreOnly: boolean;
  useLlm: boolean;
  limit: number;
  similarityThreshold: number;
  neighborsPerItem: number;
  llmBatchSize: number;
  skipEmbed: boolean;
};
