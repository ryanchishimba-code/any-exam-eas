import type { ExamSlug } from "@/types/edtech";

export type ReferenceBriefSource = {
  title: string;
  url: string;
  sourceType: "oer" | "web" | "exam_focus" | "curriculum";
  /** Weak-area topic this source grounded, when applicable. */
  topic?: string;
};

export type ReferenceFocusArea = {
  topicKey: string;
  topicName: string;
  masteryScore?: number;
  pearls: string[];
  studyAction: string;
};

export type ReferenceStudyBrief = {
  generatedAt: string;
  examSlug: ExamSlug;
  headline: string;
  summary: string;
  focusAreas: ReferenceFocusArea[];
  /** Current high-yield points synthesized from OER / guidelines. */
  boardUpdates: string[];
  sourceCount: number;
  /** Inspectable citations backing the brief. */
  sources: ReferenceBriefSource[];
  aiPowered: boolean;
  memoryCardIds: string[];
  /** True when served from cache (no fresh RAG/AI run). */
  cached?: boolean;
};
