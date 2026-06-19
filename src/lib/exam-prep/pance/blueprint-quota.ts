/**
 * NCCPA 2025 PANCE blueprint — proportional quotas and generation slot planning.
 */
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { PANCE_TASK_CATEGORIES } from "@/lib/edtech/learning-hub/pance-learning-paths";
import type {
  PanceContentCategoryId,
  PanceGenerationSlot,
  PanceQuotaRow,
  PanceTaskCategoryId,
  PanceTaskQuotaRow,
} from "./types";
import { PANCE_TARGET_TOTAL } from "./types";

export { PANCE_BLUEPRINT_SOURCE } from "./types";

const PANCE_BLUEPRINT = getExamBlueprint("pance")!;

const CONTENT_IDS = PANCE_BLUEPRINT.categories.map((c) => c.id as PanceContentCategoryId);

const TASK_IDS = PANCE_TASK_CATEGORIES.map((t) => t.id as PanceTaskCategoryId);

/** Per-category question targets for a given bank size (default 6700). */
export function computePanceContentQuotas(
  total = PANCE_TARGET_TOTAL
): PanceQuotaRow[] {
  return PANCE_BLUEPRINT.categories.map((cat) => ({
    contentCategory: cat.id as PanceContentCategoryId,
    label: cat.label,
    weight: cat.weight,
    targetCount: Math.round(total * cat.weight),
  }));
}

/** Per-task-area targets (NCCPA task dimension). */
export function computePanceTaskQuotas(
  total = PANCE_TARGET_TOTAL
): PanceTaskQuotaRow[] {
  return PANCE_TASK_CATEGORIES.map((task) => ({
    taskCategory: task.id as PanceTaskCategoryId,
    label: task.label,
    weight: task.weight,
    targetCount: Math.round(total * task.weight),
  }));
}

/** Target count for one content category at a given bank size. */
export function getPanceCategoryTarget(
  contentCategory: string,
  total = PANCE_TARGET_TOTAL
): number {
  const row = computePanceContentQuotas(total).find(
    (q) => q.contentCategory === contentCategory
  );
  return row?.targetCount ?? Math.round(total / CONTENT_IDS.length);
}

/** Merge live DB counts with blueprint targets. */
export function mergePanceQuotaWithCounts(
  countsByCategory: Record<string, number>,
  total = PANCE_TARGET_TOTAL
): PanceQuotaRow[] {
  return computePanceContentQuotas(total).map((row) => {
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
  contentCategory: PanceContentCategoryId
): string[] {
  const cat = PANCE_BLUEPRINT.categories.find((c) => c.id === contentCategory);
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
  contentCategory: PanceContentCategoryId,
  index: number
): PanceTaskCategoryId {
  if (contentCategory === "professional-practice") return "professional";
  const tasks = TASK_IDS.filter((t) => t !== "professional");
  return tasks[index % tasks.length]!;
}

function pickTopic(
  contentCategory: PanceContentCategoryId,
  index: number
): string {
  const topics = highYieldTopicsForCategory(contentCategory);
  if (topics.length === 0) return contentCategory.replace(/-/g, " ");
  return topics[index % topics.length]!;
}

const PRESENTATION_HINTS: PanceGenerationSlot["presentationHint"][] = [
  "adult",
  "adult",
  "adult",
  "primary-care",
  "pediatric",
  "surgical",
];

/**
 * Build generation slots allocated PROPORTIONALLY to each category's deficit.
 * Categories already at/over target (deficit 0) get no slots, so a rebalance
 * run concentrates entirely on under-filled categories. Falls back to an even
 * split across all categories when no deficits are supplied.
 */
export function planPanceGenerationSlots(params: {
  count: number;
  deficitsByCategory: Record<string, number>;
  seed?: number;
}): PanceGenerationSlot[] {
  const { count, deficitsByCategory, seed = 0 } = params;
  if (count <= 0) return [];

  const deficitFor = (id: PanceContentCategoryId): number =>
    Math.max(0, deficitsByCategory[id] ?? 0);

  const positive = CONTENT_IDS.filter((id) => deficitFor(id) > 0);
  const totalDeficit = positive.reduce((sum, id) => sum + deficitFor(id), 0);

  // Decide how many slots each category receives.
  const allocation = new Map<PanceContentCategoryId, number>();
  if (positive.length === 0 || totalDeficit === 0) {
    // No deficits known — even split across all categories (largest deficit first).
    const ordered = [...CONTENT_IDS].sort(
      (a, b) => (deficitsByCategory[b] ?? 0) - (deficitsByCategory[a] ?? 0)
    );
    ordered.forEach((id, i) => {
      const base = Math.floor(count / ordered.length);
      const extra = i < count % ordered.length ? 1 : 0;
      allocation.set(id, base + extra);
    });
  } else {
    let assigned = 0;
    const ordered = [...positive].sort((a, b) => deficitFor(b) - deficitFor(a));
    for (const id of ordered) {
      const share = Math.floor((count * deficitFor(id)) / totalDeficit);
      allocation.set(id, Math.min(share, deficitFor(id)));
      assigned += allocation.get(id)!;
    }
    // Distribute remaining slots to the largest deficits first (capped at each
    // category's deficit). Never generate more than the total deficit needs.
    let leftover = Math.min(count, totalDeficit) - assigned;
    for (const id of ordered) {
      if (leftover <= 0) break;
      const room = deficitFor(id) - (allocation.get(id) ?? 0);
      if (room <= 0) continue;
      const add = Math.min(room, leftover);
      allocation.set(id, (allocation.get(id) ?? 0) + add);
      leftover -= add;
    }
  }

  const slots: PanceGenerationSlot[] = [];
  let globalIndex = seed;
  for (const [contentCategory, n] of allocation) {
    for (let k = 0; k < n; k++) {
      const idx = globalIndex++;
      slots.push({
        contentCategory,
        taskCategory: pickTaskForSlot(contentCategory, idx),
        blueprintTopic: pickTopic(contentCategory, idx),
        difficulty: 2 + (idx % 4),
        presentationHint: PRESENTATION_HINTS[idx % PRESENTATION_HINTS.length],
      });
    }
  }

  // Interleave so consecutive slots vary in category (helps batch diversity).
  return interleaveByCategory(slots);
}

/** Round-robin interleave slots so adjacent items rarely share a category. */
function interleaveByCategory(slots: PanceGenerationSlot[]): PanceGenerationSlot[] {
  const buckets = new Map<string, PanceGenerationSlot[]>();
  for (const slot of slots) {
    const list = buckets.get(slot.contentCategory) ?? [];
    list.push(slot);
    buckets.set(slot.contentCategory, list);
  }
  const queues = [...buckets.values()];
  const out: PanceGenerationSlot[] = [];
  let remaining = slots.length;
  while (remaining > 0) {
    for (const q of queues) {
      const next = q.shift();
      if (next) {
        out.push(next);
        remaining--;
      }
    }
  }
  return out;
}

/** Validate that a set of category counts is within ±2% of blueprint weights. */
export function assessBlueprintAlignment(
  countsByCategory: Record<string, number>,
  total: number
): { aligned: boolean; deviations: { category: string; expected: number; actual: number; deltaPct: number }[] } {
  const quotas = computePanceContentQuotas(total);
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
