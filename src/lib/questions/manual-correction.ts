/**
 * Hand-fixed bank rows. Enrichment and generation must not write over them.
 */
export type BankWritePlan = "create" | "skip-existing" | "skip-hand-corrected";

export function shouldSkipHandCorrected(row: { manualCorrection?: boolean | null }): boolean {
  return row.manualCorrection === true;
}

/** Create when the row is new. Never update a row that already exists. */
export function planBankWrite(
  existing: { manualCorrection?: boolean | null } | null | undefined
): BankWritePlan {
  if (!existing) return "create";
  if (shouldSkipHandCorrected(existing)) return "skip-hand-corrected";
  return "skip-existing";
}
