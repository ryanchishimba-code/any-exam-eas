/**
 * Student-facing difficulty.
 * Uses the stored bank field only. A missing field stays hidden.
 */

export function storedDifficultyValue(
  value: number | string | null | undefined
): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && value.trim() === String(parsed)) return parsed;
  }
  return undefined;
}

/**
 * Band from observed percent correct. Needs enough answers to mean anything.
 * Below 8 answers stays unlabeled so a stored generator tag is not shown as fact.
 */
export function observedDifficultyLabel(
  correct: number | null | undefined,
  attempts: number | null | undefined
): string | null {
  const answered = Math.max(0, Math.floor(attempts ?? 0));
  if (answered < 8) return null;
  const right = Math.max(0, Math.min(answered, Math.floor(correct ?? 0)));
  const pct = right / answered;
  if (pct >= 0.75) return "Easy for most students";
  if (pct >= 0.45) return "Medium for most students";
  return "Hard for most students";
}

/**
 * Student chip. Observed performance wins. A stored integer is labeled as a
 * bank tag so it is not read as a measured difficulty.
 */
export function difficultyChipText(
  value: number | string | null | undefined,
  observed?: { correct?: number | null; attempts?: number | null }
): string | null {
  const measured = observedDifficultyLabel(observed?.correct, observed?.attempts);
  if (measured) return measured;
  const stored = storedDifficultyValue(value);
  if (stored == null) return null;
  return `Bank tag ${stored}`;
}
