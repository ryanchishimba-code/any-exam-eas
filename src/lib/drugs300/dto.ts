import type { DrugClassId } from "./drug-classes";
import type { ExamRelevance } from "./schema";
import type { EnrichedDrugView } from "./enrichment";
import type { ReviewGrade } from "./spaced-repetition";

export type { DrugClassId } from "./drug-classes";
export type { ReviewGrade } from "./spaced-repetition";

export type DrugCardDto = {
  drugId: string;
  rank: number;
  generic: string;
  brand: string;
  therapeuticClass: string;
  drugClass: Exclude<DrugClassId, "all">;
  drugClassLabel: string;
  indications: string;
  sideEffects: string;
  mnemonic: string;
  examRelevance: ExamRelevance;
  repetitions: number;
  intervalDays: number;
  mastered: boolean;
  nextReviewAt: string;
  customMnemonic: string | null;
  due: boolean;
  enrichment: EnrichedDrugView;
};

export type DrugClassProgress = {
  id: DrugClassId;
  label: string;
  shortLabel: string;
  color: string;
  total: number;
  mastered: number;
  due: number;
  reviewed: number;
  progressPct: number;
};

export type DrugReviewDashboard = {
  cycle: {
    key: string;
    label: string;
    startedAt: string;
    endsAt: string;
    daysRemaining: number;
    refreshNote: string;
  };
  stats: {
    total: number;
    due: number;
    mastered: number;
    reviewed: number;
    progressPct: number;
  };
  classProgress: DrugClassProgress[];
  resetApplied: boolean;
  /** True when progress is served from the curated catalog without DB persistence. */
  offline?: boolean;
};
