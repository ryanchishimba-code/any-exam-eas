import type { ExamSlug } from "@/types/edtech";

export type LibraryBriefSource = {
  title: string;
  url: string;
  sourceType: "oer" | "web" | "exam_focus" | "curriculum";
  /** Weak-area topic this source grounded, when applicable. */
  topic?: string;
};

export type LibraryFocusArea = {
  topicKey: string;
  topicName: string;
  masteryScore?: number;
  pearls: string[];
  studyAction: string;
};

export type LibraryStudyBrief = {
  generatedAt: string;
  examSlug: ExamSlug;
  headline: string;
  summary: string;
  focusAreas: LibraryFocusArea[];
  /** Current high-yield points synthesized from OER / guidelines. */
  boardUpdates: string[];
  sourceCount: number;
  /** Inspectable citations backing the brief. */
  sources: LibraryBriefSource[];
  aiPowered: boolean;
  memoryCardIds: string[];
  /** True when served from cache (no fresh RAG/AI run). */
  cached?: boolean;
};
