import type { ExamReference } from "@/lib/exam-prep/types";

/** High-yield clinical layer merged onto catalog rows at serve time. */
export type DrugEnrichment = {
  mechanism?: string;
  /** Board-style pearls (society-guideline aligned). */
  pearls: string[];
  guidelines: ExamReference[];
  counseling?: string;
  monitoring?: string;
  contraindications?: string;
};

export type EnrichedDrugView = DrugEnrichment & {
  guidelineNote: string;
};
