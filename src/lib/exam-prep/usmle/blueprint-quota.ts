/**
 * USMLE 2026 full-exam slot planning — organ systems + physician tasks + format mix.
 */
import {
  allocateQuestionsByBlueprint,
  getExamBlueprint,
  type ExamBlueprint,
  type QuestionSlot,
} from "@/lib/engine/blueprints";
import type {
  UsmleGenerationSlot,
  UsmlePhysicianTaskId,
  UsmleQuestionFormat,
  UsmleStepLevel,
} from "./types";
import { topicsForOrganSystem } from "./content-spine";
import type { UsmleOrganSystemId } from "./official-content-model";
import { isUsmleOrganSystemId } from "./official-content-model";

/** @deprecated Prefer getExamBlueprint("usmle-step-1") — spine-aligned. */
export const USMLE_STEP1_2026_BLUEPRINT: ExamBlueprint =
  getExamBlueprint("usmle-step-1")!;

/** @deprecated Prefer getExamBlueprint("usmle-step-2") — spine-aligned. */
export const USMLE_STEP2_2026_BLUEPRINT: ExamBlueprint =
  getExamBlueprint("usmle-step-2")!;

const PHYSICIAN_TASKS: UsmlePhysicianTaskId[] = [
  "diagnosis",
  "health-maintenance",
  "clinical-intervention",
  "pharmacotherapy",
  "interpretation",
  "communication",
  "professionalism",
];

const STEP1_STEM_FORMATS = [
  "Which of the following best explains the patient's finding?",
  "What is the most likely mechanism of this patient's condition?",
  "Which anatomic structure is most likely injured?",
  "Which laboratory finding is most consistent with this diagnosis?",
  "Which microorganism is the most likely cause?",
  "Which drug mechanism best accounts for this adverse effect?",
  "Which enzyme deficiency is most likely?",
  "Which histologic finding is most expected?",
  "Which pathophysiologic process best explains these findings?",
  "Which of the following is the most likely diagnosis?",
  "What is the anion gap (mEq/L)?",
  "Calculate the predicted pH using the Henderson–Hasselbalch equation.",
] as const;

const STEP2_STEM_FORMATS = [
  "Which of the following is the most likely diagnosis?",
  "What is the most appropriate next step in management?",
  "Which of the following is the best initial test?",
  "Which medication is most appropriate for this patient?",
  "Which of the following is the most likely complication?",
  "What is the most appropriate preventive measure?",
  "Which finding is most consistent with this condition?",
  "Which of the following is the most appropriate referral?",
  "What is the most likely underlying cause?",
  "Which of the following is contraindicated in this patient?",
  "What is the estimated creatinine clearance (mL/min)?",
  "What is the maintenance IV fluid rate (mL/hr)?",
] as const;

const STEP3_STEM_FORMATS = [
  "Which of the following is the most likely diagnosis?",
  "What is the most appropriate next step in management?",
  "What is the number needed to treat (NNT)?",
  "What is the positive predictive value (PPV)?",
  "What is the positive likelihood ratio (LR+)?",
  "What is the calculated carboplatin dose (mg)?",
  "Which study design is most appropriate?",
  "Which ethical principle is most relevant?",
] as const;

function resolveStepLevel(examNumber: number, override?: UsmleStepLevel): UsmleStepLevel {
  if (override) return override;
  return examNumber % 2 === 1 ? "step1" : "step2";
}

function resolveBlueprint(stepLevel: UsmleStepLevel): ExamBlueprint {
  const field =
    stepLevel === "step1"
      ? "usmle-step-1"
      : stepLevel === "step3"
        ? "usmle-step-3"
        : "usmle-step-2";
  const bp = getExamBlueprint(field);
  if (!bp) throw new Error(`Missing USMLE blueprint for ${field}`);
  return bp;
}

function resolveSubjectId(slot: { categoryId: string; subjectIds?: string[] }, index: number): string {
  const ids = slot.subjectIds ?? ["internal-medicine"];
  return ids[index % ids.length]!;
}

function resolveQuestionFormat(ngnFormat?: string): UsmleQuestionFormat {
  if (ngnFormat === "lab_interpretation") return "lab_interpretation";
  if (ngnFormat === "image_based") return "image_based";
  if (ngnFormat === "sequential") return "sequential";
  if (ngnFormat === "biostats") return "biostats";
  if (ngnFormat === "ethics") return "ethics";
  if (ngnFormat === "calculation") return "calculation";
  return "vignette";
}

function pickTopic(
  stepLevel: UsmleStepLevel,
  systemId: string,
  index: number,
  examSeed: number
): string {
  const sid = isUsmleOrganSystemId(systemId) ? (systemId as UsmleOrganSystemId) : null;
  const nodes = sid
    ? topicsForOrganSystem(sid, stepLevel)
    : topicsForOrganSystem("multisystem", stepLevel);
  if (nodes.length === 0) {
    const fallback = topicsForOrganSystem("multisystem");
    return fallback[(index + examSeed) % Math.max(fallback.length, 1)]?.slug ?? "next-best-step";
  }
  return nodes[(index + examSeed) % nodes.length]!.slug;
}

function pickPhysicianTask(index: number, examSeed: number): UsmlePhysicianTaskId {
  return PHYSICIAN_TASKS[(index + examSeed) % PHYSICIAN_TASKS.length]!;
}

function pickStemFormat(stepLevel: UsmleStepLevel, index: number, examSeed: number): string {
  const formats =
    stepLevel === "step1"
      ? STEP1_STEM_FORMATS
      : stepLevel === "step3"
        ? STEP3_STEM_FORMATS
        : STEP2_STEM_FORMATS;
  return formats[(index + examSeed) % formats.length]!;
}

/** Vary question count within 75–85 per exam. */
export function resolveExamQuestionCount(examNumber: number): number {
  return 75 + ((examNumber * 3) % 11);
}

/** Step 3 format categories for gap-fill generation. */
export const USMLE_STEP3_FORMAT_CATEGORY_IDS = [
  "biostatistics",
  "ethics",
  "pharm-advertising",
  "ccs",
] as const;

const CATEGORY_NGN_FORMAT: Record<string, string | undefined> = {
  "biostats-epi": "biostats",
  "social-sciences": "ethics",
  multisystem: "sequential",
  "human-development": undefined,
};

function allocateUsmleCategoryFocused(
  questionCount: number,
  blueprint: ExamBlueprint,
  categoryId: string
): QuestionSlot[] {
  const category = blueprint.categories.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Unknown blueprint category: ${categoryId}`);

  const slots: QuestionSlot[] = [];
  for (let i = 0; i < questionCount; i++) {
    slots.push({
      categoryId: category.id,
      categoryLabel: category.label,
      subjectIds: category.subjectIds,
      highYieldTopics: category.highYieldTopics,
      ngnFormat: CATEGORY_NGN_FORMAT[categoryId],
    });
  }
  return slots;
}

/** Plan all slots for one full-length USMLE block-style practice exam. */
export function planUsmleFullExamSlots(params: {
  examNumber: number;
  questionCount?: number;
  stepLevel?: UsmleStepLevel;
  /** Focus all slots on one subject (e.g. pediatrics, physiology). */
  focusSubjectId?: string;
  /** Focus all slots on one blueprint category (e.g. biostatistics, ccs). */
  focusCategoryId?: string;
}): UsmleGenerationSlot[] {
  const { examNumber, focusSubjectId, focusCategoryId } = params;
  const stepLevel = resolveStepLevel(examNumber, params.stepLevel);
  const questionCount = params.questionCount ?? resolveExamQuestionCount(examNumber);
  const examSeed = examNumber * 29;
  const blueprint = resolveBlueprint(stepLevel);
  const baseSlots = focusCategoryId
    ? allocateUsmleCategoryFocused(questionCount, blueprint, focusCategoryId)
    : allocateQuestionsByBlueprint(questionCount, blueprint, focusSubjectId);

  return baseSlots.map((slot, slotIndex) => {
    const questionFormat = resolveQuestionFormat(slot.ngnFormat);
    const subjectId = resolveSubjectId(slot, slotIndex + examSeed);
    const systemId = isUsmleOrganSystemId(slot.categoryId)
      ? slot.categoryId
      : "multisystem";

    return {
      ...slot,
      categoryId: systemId,
      categoryLabel: slot.categoryLabel,
      slotIndex,
      stepLevel,
      subjectId,
      blueprintSystem: systemId,
      blueprintTopic: pickTopic(stepLevel, systemId, slotIndex, examSeed),
      physicianTask: pickPhysicianTask(slotIndex, examSeed),
      difficulty: 2 + ((slotIndex + examSeed) % 4),
      stemFormat: pickStemFormat(stepLevel, slotIndex, examSeed),
      questionFormat,
    };
  });
}

export function resolveExamTitle(examNumber: number, stepLevel: UsmleStepLevel): string {
  const label =
    stepLevel === "step1" ? "Step 1" : stepLevel === "step3" ? "Step 3" : "Step 2 CK";
  return `USMLE ${label} Practice Exam ${examNumber}`;
}

export function summarizeExamBlueprint(slots: UsmleGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.categoryLabel] = (summary[slot.categoryLabel] ?? 0) + 1;
  }
  return summary;
}

export function summarizeExamFormats(slots: UsmleGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.questionFormat] = (summary[slot.questionFormat] ?? 0) + 1;
  }
  return summary;
}

export function summarizeExamTasks(slots: UsmleGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.physicianTask] = (summary[slot.physicianTask] ?? 0) + 1;
  }
  return summary;
}

export type UsmleQuotaRow = {
  categoryId: string;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
  surplus?: number;
};

/** Per blueprint-category targets for a given bank size. */
export function computeUsmleBlueprintQuotas(
  blueprint: ExamBlueprint,
  total: number
): UsmleQuotaRow[] {
  return blueprint.categories.map((cat) => ({
    categoryId: cat.id,
    label: cat.label,
    weight: cat.weight,
    targetCount: Math.round(total * cat.weight),
  }));
}

/** Merge live category counts with blueprint targets. */
export function mergeUsmleQuotaWithCounts(
  blueprint: ExamBlueprint,
  countsByCategory: Record<string, number>,
  total: number
): UsmleQuotaRow[] {
  return computeUsmleBlueprintQuotas(blueprint, total).map((row) => {
    const currentCount = countsByCategory[row.categoryId] ?? 0;
    const delta = currentCount - row.targetCount;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
      surplus: Math.max(0, delta),
    };
  });
}
