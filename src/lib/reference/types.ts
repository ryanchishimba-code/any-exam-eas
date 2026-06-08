import type { ExamSlug } from "@/types/edtech";

/** Bite-sized reference card categories for filtering. */
export type MemoryCardKind =
  | "equation"
  | "conversion"
  | "fact"
  | "table"
  | "mistake"
  | "pearl";

export type MemoryCardTable = {
  headers: string[];
  rows: string[][];
};

/** Fast reference card — MVP layer of the Quick Reference system. */
export type MemoryCard = {
  id: string;
  examSlug: ExamSlug;
  /** High-level subject for filters (e.g. Cardiology, Critical Care). */
  subject: string;
  /** Narrow topic label shown on the card. */
  topic: string;
  title: string;
  teaser: string;
  kind: MemoryCardKind;
  tags: string[];
  /** Primary bite-sized content (plain text or short markdown-like lines). */
  body: string;
  bullets?: string[];
  table?: MemoryCardTable;
  /** Links to question bank practice. */
  practiceTopicSlug: string;
  /** When set, Deep Dive opens the matching Review Module on /dashboard/topics. */
  reviewModuleSlug?: string;
  sortOrder: number;
};

export const MEMORY_CARD_KIND_LABELS: Record<MemoryCardKind, string> = {
  equation: "Equations",
  conversion: "Conversions",
  fact: "Key facts",
  table: "Tables",
  mistake: "Common mistakes",
  pearl: "Pearls",
};
