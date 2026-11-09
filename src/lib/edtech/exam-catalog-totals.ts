import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";

/**
 * Fields the public catalog total must count once.
 * The `usmle` exam slug is bound to Step 2 CK, so its own questionCount
 * stays that field. Step 1 and Step 3 are still part of the sitewide total.
 */
export function catalogFieldsToCount(slugFieldIds: readonly string[]): string[] {
  return [...new Set([...slugFieldIds, ...USMLE_FIELD_IDS])];
}

export function sumFieldCounts(
  fields: readonly string[],
  counts: Readonly<Record<string, number>>
): number {
  return fields.reduce((sum, fieldId) => sum + (counts[fieldId] ?? 0), 0);
}
