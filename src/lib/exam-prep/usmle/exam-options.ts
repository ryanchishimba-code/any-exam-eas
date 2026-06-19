import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import { USMLE_FIELD_IDS, USMLE_STEPS, type UsmleFieldId } from "./steps";
import type { UsmleStepLevel } from "./types";

/**
 * USMLE exam (step) selection options with LIVE, accurate question counts.
 *
 * Questions are already separated by `fieldId` (`usmle-step-1/2/3`) and indexed
 * via `@@index([fieldId, active, qaPassed])`, so counting is a single cheap
 * `groupBy` — we never load the questions themselves. Counts use the same serve
 * filter as the rest of the app (`active && qaPassed`) so the number shown equals
 * what a learner can actually practice.
 *
 * Designed to extend to other multi-exam families later (e.g. COMLEX) by adding
 * a sibling builder that maps its field ids to option metadata.
 */
export type ExamDifficulty = "Foundational" | "Clinical" | "Advanced";

/** Short, user-facing exam-type token per step (Step 2 is "CK"). */
export const USMLE_EXAM_TYPE_LABEL: Record<UsmleStepLevel, string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

/** Compact clinical descriptor shown under each wheel option. */
export const USMLE_EXAM_TYPE_TAGLINE: Record<UsmleStepLevel, string> = {
  step1: "Foundational Sciences",
  step2: "Clinical Knowledge",
  step3: "Advanced Management",
};

export type UsmleExamOption = {
  level: UsmleStepLevel;
  /** Canonical exam_type for this option (mirrors `stepLevel`). */
  examType: UsmleStepLevel;
  /** Display token, e.g. "Step 2 CK". */
  examTypeLabel: string;
  /** One-line clinical tagline, e.g. "Clinical Knowledge". */
  tagline: string;
  fieldId: UsmleFieldId;
  name: string;
  shortName: string;
  description: string;
  /** Live count of practiceable questions for this step. */
  questionCount: number;
  /** Recommended full-length simulation duration, in minutes. */
  recommendedDurationMin: number;
  /** Number of questions in a full simulated exam for this step. */
  simulatedQuestionCount: number;
  difficulty: ExamDifficulty;
  /** Where "Start practice" takes the learner (step-scoped question bank). */
  practiceHref: string;
};

export type UsmleExamOptionsPayload = {
  options: UsmleExamOption[];
  updatedAt: string;
  /** True when the live count lookup failed and counts fell back to 0. */
  degraded: boolean;
};

const REVALIDATE_SECONDS = 300;

const STEP_DIFFICULTY: Record<UsmleStepLevel, ExamDifficulty> = {
  step1: "Foundational",
  step2: "Clinical",
  step3: "Advanced",
};

/**
 * One indexed groupBy across the three USMLE fields — counts only, no rows loaded.
 *
 * Counts are keyed by `stepLevel` (the canonical exam_type), not raw `fieldId`, so
 * the numbers stay exact even for the edge case where a Step 3 item was filed under
 * the `usmle-step-2` field (legacy full-exam inserter). Step membership:
 *   step1 → fieldId usmle-step-1
 *   step3 → fieldId usmle-step-3  OR  (usmle-step-2 AND stepLevel="step3")
 *   step2 → everything else in usmle-step-2 (stepLevel ≠ "step3")
 */
async function fetchUsmleServedCounts(): Promise<Record<UsmleStepLevel, number>> {
  const rows = await prisma.questionBankItem.groupBy({
    by: ["fieldId", "stepLevel"],
    where: {
      fieldId: { in: [...USMLE_FIELD_IDS] },
      active: true,
      qaPassed: true,
    },
    _count: { _all: true },
  });

  const counts: Record<UsmleStepLevel, number> = { step1: 0, step2: 0, step3: 0 };
  for (const row of rows) {
    const n = row._count._all;
    if (row.fieldId === "usmle-step-1") {
      counts.step1 += n;
    } else if (row.fieldId === "usmle-step-3") {
      counts.step3 += n;
    } else if (row.fieldId === "usmle-step-2") {
      if (row.stepLevel === "step3") counts.step3 += n;
      else counts.step2 += n;
    }
  }
  return counts;
}

const getCachedUsmleServedCounts = unstable_cache(
  fetchUsmleServedCounts,
  ["usmle-exam-option-counts"],
  { revalidate: REVALIDATE_SECONDS }
);

/** Build the USMLE step options, merging static metadata with live counts. */
export async function getUsmleExamOptionsWithCounts(): Promise<UsmleExamOptionsPayload> {
  let counts: Record<UsmleStepLevel, number> = { step1: 0, step2: 0, step3: 0 };
  let degraded = false;

  try {
    counts = await getCachedUsmleServedCounts();
  } catch (error) {
    console.error("[usmle/exam-options] count lookup failed:", error);
    degraded = true;
  }

  const options: UsmleExamOption[] = USMLE_STEPS.map((step) => ({
    level: step.level,
    examType: step.level,
    examTypeLabel: USMLE_EXAM_TYPE_LABEL[step.level],
    tagline: USMLE_EXAM_TYPE_TAGLINE[step.level],
    fieldId: step.fieldId,
    name: step.name,
    shortName: step.shortName,
    description: step.description,
    questionCount: counts[step.level] ?? 0,
    recommendedDurationMin: step.simulatedDurationMin,
    simulatedQuestionCount: step.simulatedQuestionCount,
    difficulty: STEP_DIFFICULTY[step.level],
    practiceHref: `${ROUTES.questionBank}?field=${step.fieldId}`,
  }));

  return { options, updatedAt: new Date().toISOString(), degraded };
}
