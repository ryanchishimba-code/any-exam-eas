import type { BoardComposeConfig, TestPlanArea } from "@/lib/exam-prep/compose/board-exam-composer";
import {
  USMLE_OFFICIAL_MODEL_RETRIEVED_AT,
  USMLE_OFFICIAL_SOURCES,
  USMLE_ORGAN_SYSTEMS,
  USMLE_PHYSICIAN_TASKS,
  USMLE_STEP1_DISCIPLINE_RANGES,
  USMLE_STEP2_CLINICAL_SCIENCE_RANGES,
  isUsmleOrganSystemId,
  type WeightRange,
} from "@/lib/exam-prep/usmle/official-content-model";
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";

/**
 * USMLE practice blocks.
 *
 * Sources retrieved 2026-09-06:
 * - Step 1: https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications
 * - Step 2 CK: https://www.usmle.org/exam-resources/step-2-ck-materials/step-2-ck-content-outline-and-specifications
 * - Step 3: https://www.usmle.org/exam-resources/step-3-materials/step-3-content-outline-and-specifications
 * - Shared outline PDF (January 2022): https://www.usmle.org/sites/default/files/2022-01/USMLE_Content_Outline_0.pdf
 *
 * Organ-system ranges are the fill axis. They partition a block.
 * Step 1 discipline ranges and Step 2 CK clinical-science ranges are
 * integrative: their minimums sum to more than 100%, so they cannot be
 * exclusive item quotas. The composer reports them. It does not guess a
 * discipline from an organ-system tag.
 *
 * Step 3 publishes physician-task ranges, not a discipline table. Those
 * task minimums also sum above 100%, and many bank rows have no task tag,
 * so tasks are reported rather than used as a second fill axis.
 *
 * Length is one USMLE block: Step 1 up to 40 items, Step 2 CK about 40,
 * Step 3 about 38–40. Forty items fits every published organ-system
 * percent range without widening it. The full-exam simulation (280 / 280 /
 * 200) is unchanged.
 */
export const USMLE_BLOCK_LENGTH = 40;

const STEP_TITLE: Record<UsmleStepLevel, string> = {
  step1: "USMLE Step 1",
  step2: "USMLE Step 2 CK",
  step3: "USMLE Step 3",
};

export function usmleOrganAreas(step: UsmleStepLevel): TestPlanArea[] {
  return USMLE_ORGAN_SYSTEMS.map((system) => {
    const range = system.ranges[step];
    if (!range) throw new Error(`USMLE ${step} has no organ range for ${system.id}.`);
    return {
      id: system.id,
      label: system.label,
      minPct: range.minPct,
      maxPct: range.maxPct,
      weight: system.midpointPct(step),
    };
  });
}

/** Exact organ-system id only. Discipline tags are not mapped onto a system. */
export function usmleOrganSystemId(blueprintDomain: string | null | undefined): string | null {
  const id = blueprintDomain?.trim() ?? "";
  return isUsmleOrganSystemId(id) ? id : null;
}

export function usmleDisciplineRanges(step: UsmleStepLevel): Record<string, WeightRange> | null {
  if (step === "step1") return USMLE_STEP1_DISCIPLINE_RANGES;
  if (step === "step2") return USMLE_STEP2_CLINICAL_SCIENCE_RANGES;
  return null;
}

/** Exact discipline id. Unknown subject tags stay unmapped. */
export function usmleDisciplineId(step: UsmleStepLevel, subjectId: string | null | undefined): string | null {
  const ranges = usmleDisciplineRanges(step);
  if (!ranges) return null;
  const id = subjectId?.trim() ?? "";
  return id in ranges ? id : null;
}

/**
 * Exact physician-task id, or a legacy tag that the official model maps to
 * exactly one task. `interpretation` is listed on two tasks, so it stays
 * unmapped.
 */
export function usmlePhysicianTaskId(taskCategory: string | null | undefined): string | null {
  const tag = taskCategory?.trim() ?? "";
  if (!tag) return null;
  if (USMLE_PHYSICIAN_TASKS.some((task) => task.id === tag)) return tag;
  const matches = USMLE_PHYSICIAN_TASKS.filter((task) => task.legacyIds?.includes(tag));
  return matches.length === 1 ? matches[0]!.id : null;
}

export function usmleBlockComposeConfig(step: UsmleStepLevel, maxFullExams = 200): BoardComposeConfig {
  const title = STEP_TITLE[step];
  return {
    boardId: `usmle-${step}`,
    areas: usmleOrganAreas(step),
    fullExamLength: USMLE_BLOCK_LENGTH,
    maxFullExams,
    maxItemReuse: 1,
    selectionSeed: `aee-usmle-${step}-compose-2026-09-26`,
    blockContradictoryKeys: true,
    dropBoilerplateTokens: true,
    fullExamTitle: (index) => `${title} Practice Exam ${index}`,
  };
}

export const USMLE_COMPOSE_SOURCE = `USMLE content outlines retrieved ${USMLE_OFFICIAL_MODEL_RETRIEVED_AT}; Step 1 ${USMLE_OFFICIAL_SOURCES.step1}; Step 2 CK ${USMLE_OFFICIAL_SOURCES.step2}; Step 3 ${USMLE_OFFICIAL_SOURCES.step3}; PDF ${USMLE_OFFICIAL_SOURCES.contentOutline}`;
