import type { ExamRelevance } from "./schema";
import { inferExamRelevance, mergeExamRelevance } from "./exam-relevance";

/** High-yield drug card aligned to ClinCalc Top 500 prescribing data. */
export type DrugEntry = {
  id: string;
  rank: number;
  generic: string;
  brand: string;
  /** Pharmacologic/therapeutic class (JSON field: `class`). */
  therapeuticClass: string;
  indications: string;
  sideEffects: string;
  mnemonic: string;
  examRelevance: ExamRelevance;
};

export type DrugEntryInput = Omit<DrugEntry, "id" | "examRelevance"> & {
  id?: string;
  examRelevance?: Partial<ExamRelevance>;
};

export function slugDrugId(generic: string): string {
  return generic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildDrugEntry(input: DrugEntryInput): DrugEntry {
  return {
    id: input.id ?? slugDrugId(input.generic),
    rank: input.rank,
    generic: input.generic,
    brand: input.brand,
    therapeuticClass: input.therapeuticClass,
    indications: input.indications,
    sideEffects: input.sideEffects,
    mnemonic: input.mnemonic,
    examRelevance:
      input.examRelevance !== undefined
        ? mergeExamRelevance(input.examRelevance)
        : inferExamRelevance(input.therapeuticClass, input.generic),
  };
}
