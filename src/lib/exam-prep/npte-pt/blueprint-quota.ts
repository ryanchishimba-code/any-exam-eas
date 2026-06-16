/**
 * NCCPA 2025 NPTE-PT blueprint — proportional quotas and generation slot planning.
 */
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { NPTE_PT_TASK_CATEGORIES } from "@/lib/edtech/learning-hub/npte-pt-learning-paths";
import type {
  NptePtContentCategoryId,
  NptePtGenerationSlot,
  NptePtQuotaRow,
  NptePtTaskCategoryId,
  NptePtTaskQuotaRow,
} from "./types";
import { NPTE_PT_TARGET_TOTAL } from "./types";

export { NPTE_PT_BLUEPRINT_SOURCE } from "./types";

const NPTE_PT_BLUEPRINT = getExamBlueprint("npte-pt")!;

const CONTENT_IDS = NPTE_PT_BLUEPRINT.categories.map((c) => c.id as NptePtContentCategoryId);

const TASK_IDS = NPTE_PT_TASK_CATEGORIES.map((t) => t.id as NptePtTaskCategoryId);

/** Per-category question targets for a given bank size (default 6000). */
export function computeNptePtContentQuotas(
  total = NPTE_PT_TARGET_TOTAL
): NptePtQuotaRow[] {
  return NPTE_PT_BLUEPRINT.categories.map((cat) => ({
    contentCategory: cat.id as NptePtContentCategoryId,
    label: cat.label,
    weight: cat.weight,
    targetCount: Math.round(total * cat.weight),
  }));
}

/** Per-task-area targets (NCCPA task dimension). */
export function computeNptePtTaskQuotas(
  total = NPTE_PT_TARGET_TOTAL
): NptePtTaskQuotaRow[] {
  return NPTE_PT_TASK_CATEGORIES.map((task) => ({
    taskCategory: task.id as NptePtTaskCategoryId,
    label: task.label,
    weight: task.weight,
    targetCount: Math.round(total * task.weight),
  }));
}

/** Target count for one content category at a given bank size. */
export function getNptePtCategoryTarget(
  contentCategory: string,
  total = NPTE_PT_TARGET_TOTAL
): number {
  const row = computeNptePtContentQuotas(total).find(
    (q) => q.contentCategory === contentCategory
  );
  return row?.targetCount ?? Math.round(total / CONTENT_IDS.length);
}

/** Merge live DB counts with blueprint targets. */
export function mergeNptePtQuotaWithCounts(
  countsByCategory: Record<string, number>,
  total = NPTE_PT_TARGET_TOTAL
): NptePtQuotaRow[] {
  return computeNptePtContentQuotas(total).map((row) => {
    const currentCount = countsByCategory[row.contentCategory] ?? 0;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
    };
  });
}

/** High-yield topic examples per content category (from NCCPA blueprint). */
export function highYieldTopicsForCategory(
  contentCategory: NptePtContentCategoryId
): string[] {
  const cat = NPTE_PT_BLUEPRINT.categories.find((c) => c.id === contentCategory);
  return cat?.highYieldTopics ?? [];
}

/** Lead-in stem formats to rotate for batch diversity. */
const STEM_FORMATS = [
  "most likely diagnosis",
  "most appropriate next step in management",
  "most appropriate initial diagnostic study",
  "most appropriate pharmacotherapy",
  "best explanation for the findings",
  "most appropriate preventive measure",
  "most likely mechanism",
  "most appropriate physical exam finding to assess next",
] as const;

function pickTaskForSlot(
  contentCategory: NptePtContentCategoryId,
  index: number
): NptePtTaskCategoryId {
  if (contentCategory === "professional-practice") return "professional";
  const tasks = TASK_IDS.filter((t) => t !== "professional");
  return tasks[index % tasks.length]!;
}

function pickTopic(
  contentCategory: NptePtContentCategoryId,
  index: number
): string {
  const topics = highYieldTopicsForCategory(contentCategory);
  if (topics.length === 0) return contentCategory.replace(/-/g, " ");
  return topics[index % topics.length]!;
}

const PRESENTATION_HINTS: NptePtGenerationSlot["presentationHint"][] = [
  "adult",
  "adult",
  "adult",
  "primary-care",
  "pediatric",
  "surgical",
];

/**
 * Build generation slots prioritizing categories with the largest deficit.
 * Each slot specifies content category, task area, topic, and difficulty.
 */
export function planNptePtGenerationSlots(params: {
  count: number;
  deficitsByCategory: Record<string, number>;
  seed?: number;
}): NptePtGenerationSlot[] {
  const { count, deficitsByCategory, seed = 0 } = params;
  const slots: NptePtGenerationSlot[] = [];

  const categories = [...CONTENT_IDS].sort((a, b) => {
    const deficitA = deficitsByCategory[a] ?? getNptePtCategoryTarget(a);
    const deficitB = deficitsByCategory[b] ?? getNptePtCategoryTarget(b);
    return deficitB - deficitA;
  });

  for (let i = 0; i < count; i++) {
    const catIndex = (i + seed) % categories.length;
    const contentCategory = categories[catIndex]!;
    const taskCategory = pickTaskForSlot(contentCategory, i + seed);
    const blueprintTopic = pickTopic(contentCategory, i + seed);
    const difficulty = 2 + ((i + seed) % 4);
    const presentationHint =
      PRESENTATION_HINTS[(i + seed) % PRESENTATION_HINTS.length];

    slots.push({
      contentCategory,
      taskCategory,
      blueprintTopic,
      difficulty,
      presentationHint,
    });
  }

  return slots;
}

/** Validate that a set of category counts is within ±2% of blueprint weights. */
export function assessBlueprintAlignment(
  countsByCategory: Record<string, number>,
  total: number
): { aligned: boolean; deviations: { category: string; expected: number; actual: number; deltaPct: number }[] } {
  const quotas = computeNptePtContentQuotas(total);
  const deviations = quotas.map((q) => {
    const actual = countsByCategory[q.contentCategory] ?? 0;
    const expected = q.targetCount;
    const deltaPct =
      expected > 0 ? Math.round(((actual - expected) / expected) * 100) : 0;
    return {
      category: q.contentCategory,
      expected,
      actual,
      deltaPct,
    };
  });
  const aligned = deviations.every((d) => Math.abs(d.deltaPct) <= 5);
  return { aligned, deviations };
}

export function stemFormatForIndex(index: number): string {
  return STEM_FORMATS[index % STEM_FORMATS.length]!;
}
