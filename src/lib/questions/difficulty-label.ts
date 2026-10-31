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

/** Label text, or null when the question has no stored difficulty. */
export function difficultyChipText(
  value: number | string | null | undefined
): string | null {
  const stored = storedDifficultyValue(value);
  if (stored == null) return null;
  return `Difficulty ${stored}`;
}
