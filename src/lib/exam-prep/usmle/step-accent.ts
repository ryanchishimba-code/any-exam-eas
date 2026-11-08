import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";

/**
 * One accent badge per step card.
 * Step 2 CK stays "Recommended" even when it is also the largest bank.
 * Another step gets "Largest bank" only when it is strictly the biggest.
 */
export function usmleStepAccentBadge(
  level: UsmleStepLevel,
  largestLevel: UsmleStepLevel | null
): string | undefined {
  if (level === "step2") return "Recommended";
  if (largestLevel && level === largestLevel) return "Largest bank";
  return undefined;
}
