import {
  TOP_500_COUNT,
  TOP_500_DRUGS,
  drugMatchesClass,
  classifyDrug,
  DRUG_CLASSES,
  type DrugClassId,
} from "./catalog";
import type { DrugEntry } from "./types";
import { getCurrentDrugCycle } from "./cycles";
import { enrichDrug } from "./enrichment";
import { initialSpacedRepetitionState, isDue } from "./spaced-repetition";
import type { DrugCardDto, DrugClassProgress, DrugReviewDashboard } from "./dto";

function cycleDto() {
  const cycle = getCurrentDrugCycle();
  return {
    key: cycle.key,
    label: cycle.label,
    startedAt: cycle.startedAt.toISOString(),
    endsAt: cycle.endsAt.toISOString(),
    daysRemaining: cycle.daysRemaining,
    refreshNote: cycle.refreshNote,
  };
}

function computeOfflineClassProgress(now: Date): DrugClassProgress[] {
  return DRUG_CLASSES.map((cls) => {
    const pool =
      cls.id === "all"
        ? TOP_500_DRUGS
        : TOP_500_DRUGS.filter((d) => classifyDrug(d.therapeuticClass) === cls.id);
    const total = pool.length;
    return {
      id: cls.id,
      label: cls.label,
      shortLabel: cls.shortLabel,
      color: cls.color,
      total,
      mastered: 0,
      due: total,
      reviewed: 0,
      progressPct: 0,
    };
  });
}

function toOfflineDto(drug: DrugEntry, now: Date): DrugCardDto {
  const drugClass = classifyDrug(drug.therapeuticClass);
  const meta = DRUG_CLASSES.find((c) => c.id === drugClass)!;
  const row = { ...initialSpacedRepetitionState(now), mnemonic: null };
  return {
    drugId: drug.id,
    rank: drug.rank,
    generic: drug.generic,
    brand: drug.brand,
    therapeuticClass: drug.therapeuticClass,
    drugClass,
    drugClassLabel: meta.label,
    indications: drug.indications,
    sideEffects: drug.sideEffects,
    mnemonic: drug.mnemonic,
    examRelevance: drug.examRelevance,
    repetitions: row.repetitions,
    intervalDays: row.intervalDays,
    mastered: row.mastered,
    nextReviewAt: row.nextReviewAt.toISOString(),
    customMnemonic: null,
    due: isDue(row.nextReviewAt, now),
    enrichment: enrichDrug(drug),
  };
}

/** Serve curated deck stats when progress DB is unreachable. */
export function buildOfflineDrugReviewDashboard(): DrugReviewDashboard {
  return {
    cycle: cycleDto(),
    stats: {
      total: TOP_500_COUNT,
      due: TOP_500_COUNT,
      mastered: 0,
      reviewed: 0,
      progressPct: 0,
    },
    classProgress: computeOfflineClassProgress(new Date()),
    resetApplied: false,
    offline: true,
  };
}

/** Serve curated flashcards when due-queue DB is unreachable. */
export function buildOfflineDueDrugCards(
  limit = 20,
  classId: DrugClassId = "all"
): DrugCardDto[] {
  const now = new Date();
  const pool = TOP_500_DRUGS.filter((d) => drugMatchesClass(d.therapeuticClass, classId));
  const effectiveLimit = classId === "all" ? limit : pool.length;
  return pool.slice(0, effectiveLimit).map((drug) => toOfflineDto(drug, now));
}
