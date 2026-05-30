import type { SearchResult } from "@/lib/search";

export type RagSourceType =
  | "oer"
  | "web"
  | "exam_focus"
  | "curriculum"
  | "exam_exemplar"
  | "case_study";

export type RagChunk = {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  sourceType: RagSourceType;
  title: string;
  url: string;
  embedding?: number[];
  metadata?: Record<string, unknown>;
};

export type RagDocument = {
  id: string;
  fieldId: string;
  title: string;
  url: string;
  sourceType: RagSourceType;
  fullText: string;
  chunks: RagChunk[];
};

export type RetrievedChunk = RagChunk & {
  vectorScore: number;
  keywordScore: number;
  hybridScore: number;
  rerankScore?: number;
};

export type QuestionPatternProfile = {
  fieldId: string;
  topic: string;
  sampleSize: number;
  avgStemLength: number;
  avgExplanationLength: number;
  commonTags: string[];
  distractorPatterns: string[];
  formatMix: Record<string, number>;
  difficultySignals: string[];
  exemplarStems: string[];
  exemplarDistractors: string[];
  clinicalJudgmentFlows: string[];
};

export type AdvancedStudyContext = {
  sources: SearchResult[];
  researchBrief: string;
  retrievedChunks: RetrievedChunk[];
  patternProfile: QuestionPatternProfile;
  expandedQueries: string[];
  sourceCounts: Record<string, number>;
  retrievalMeta: {
    totalChunks: number;
    retrievedCount: number;
    rerankedCount: number;
  };
};

export type SelfRagReflection = {
  relevant: boolean;
  grounded: boolean;
  clinicallySound: boolean;
  formatValid: boolean;
  qualityScore: number;
  issues: string[];
  suggestions: string[];
};

export type GenerationQualityReport = {
  passed: boolean;
  averageScore: number;
  perQuestion: Array<{
    id: number;
    score: number;
    reflection: SelfRagReflection;
    regenerated: boolean;
  }>;
  patternProfileUsed: boolean;
  chunksUsed: number;
  mode: "production" | "test";
};
