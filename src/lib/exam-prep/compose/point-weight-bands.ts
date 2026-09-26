import type { TestPlanArea } from "@/lib/exam-prep/compose/board-exam-composer";

/**
 * Turn point weights into percent bands that `planAreaCounts` can fill.
 *
 * A published weight such as 2% is not a range. The band is the rounded
 * item count ± `tolerance`, converted back to percents so the integer
 * floor and ceiling recover that count. A zero-width percent band can
 * make the minimum count larger than the maximum (2% of a short form).
 */
export function areasFromPointWeights(
  length: number,
  rows: readonly { id: string; label: string; weight: number }[],
  tolerance = 1
): TestPlanArea[] {
  if (length <= 0) throw new Error("Form length must be positive.");
  return rows.map((row) => {
    const target = Math.round(length * row.weight);
    const minCount = Math.max(0, target - tolerance);
    const maxCount = Math.min(length, Math.max(minCount, target + tolerance));
    return {
      id: row.id,
      label: row.label,
      minPct: (minCount / length) * 100,
      maxPct: (maxCount / length) * 100,
      weight: row.weight * 100,
    };
  });
}
