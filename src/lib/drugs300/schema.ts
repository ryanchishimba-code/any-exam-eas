/** Board exams that reference Top 300 high-yield drugs. */
export const EXAM_CODES = ["NCLEX", "USMLE", "NAPLEX"] as const;

export type ExamCode = (typeof EXAM_CODES)[number];

/** Which licensure/board exams commonly test this drug. */
export type ExamRelevance = Record<ExamCode, boolean>;

export const DEFAULT_EXAM_RELEVANCE: ExamRelevance = {
  NCLEX: true,
  USMLE: true,
  NAPLEX: true,
};

/**
 * Canonical JSON/API shape for a Top 300 drug record.
 * `class` = pharmacologic/therapeutic class (e.g. "ACE inhibitor").
 */
export type Top300DrugRecord = {
  id: string;
  rank: number;
  generic: string;
  brand: string;
  class: string;
  indications: string;
  sideEffects: string;
  mnemonic: string;
  examRelevance: ExamRelevance;
  /** Optional high-yield bucket: cardiovascular, antibiotics, etc. */
  category?: string;
};

/** Root document when exporting the full catalog as JSON. */
export type Top300DrugCatalogDocument = {
  version: string;
  source: string;
  updatedAt: string;
  count: number;
  drugs: Top300DrugRecord[];
};

export type Top300DrugRecordInput = Omit<Top300DrugRecord, "id" | "examRelevance"> & {
  id?: string;
  examRelevance?: Partial<ExamRelevance>;
};
