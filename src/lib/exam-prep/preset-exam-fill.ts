/**
 * Fill a practice exam to its advertised length from eligible items.
 * A short form is hidden. It is never returned smaller than `questionCount`.
 */

export type ExamFillSlot = {
  id: string;
  sortOrder: number;
  areaKey: string;
  eligible: boolean;
};

export type ExamFillCandidate = {
  id: string;
  areaKeys: string[];
};

export type ExamFillPlan = {
  action: "unchanged" | "backfill" | "hide";
  /** Advertised length. */
  questionCount: number;
  kept: number;
  added: number;
  /** Item ids in exam order. Empty when the form is hidden. */
  orderedIds: string[];
};

function takeMatch(
  pool: ExamFillCandidate[],
  used: Set<string>,
  areaKey: string | null
): string | null {
  if (areaKey) {
    const matched = pool.find(
      (row) => !used.has(row.id) && row.areaKeys.includes(areaKey)
    );
    if (matched) return matched.id;
  }
  const any = pool.find((row) => !used.has(row.id));
  return any?.id ?? null;
}

/**
 * Keep eligible linked items in place. Replace the rest from `pool`
 * (lowest-id first). Prefer the dropped slot's area, then any area.
 */
export function planPresetExamFill(input: {
  questionCount: number;
  slots: ExamFillSlot[];
  pool: ExamFillCandidate[];
}): ExamFillPlan {
  const questionCount = Math.max(0, input.questionCount);
  const empty: ExamFillPlan = {
    action: "hide",
    questionCount,
    kept: 0,
    added: 0,
    orderedIds: [],
  };
  if (questionCount <= 0) return empty;

  const orderedSlots = [...input.slots]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .slice(0, questionCount)
    .map((slot, index) => ({ ...slot, sortOrder: index }));
  const placed: Array<string | null> = Array.from({ length: questionCount }, () => null);
  const used = new Set<string>();
  let kept = 0;

  for (const slot of orderedSlots) {
    if (!slot.eligible) continue;
    if (used.has(slot.id)) continue;
    const index = slot.sortOrder >= 0 && slot.sortOrder < questionCount ? slot.sortOrder : placed.findIndex((id) => id == null);
    if (index < 0 || placed[index]) continue;
    placed[index] = slot.id;
    used.add(slot.id);
    kept += 1;
  }

  const pool = [...input.pool]
    .filter((row) => row.id && !used.has(row.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  let added = 0;
  for (let index = 0; index < questionCount; index++) {
    if (placed[index]) continue;
    const dropped = orderedSlots.find((slot) => slot.sortOrder === index && !slot.eligible);
    const areaKey = dropped?.areaKey ?? null;
    const id = takeMatch(pool, used, areaKey);
    if (!id) return { ...empty, kept };
    placed[index] = id;
    used.add(id);
    added += 1;
  }

  const orderedIds = placed.filter((id): id is string => Boolean(id));
  if (orderedIds.length !== questionCount) return { ...empty, kept };
  return {
    action: added === 0 ? "unchanged" : "backfill",
    questionCount,
    kept,
    added,
    orderedIds,
  };
}
