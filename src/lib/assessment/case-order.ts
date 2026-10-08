/** NCJMM position. A missing step sorts first so it cannot hide behind a later step. */
export function compareNgnCaseStep(
  a: { caseStep?: number | null; id?: string },
  b: { caseStep?: number | null; id?: string }
): number {
  const step = (a.caseStep ?? 0) - (b.caseStep ?? 0);
  if (step !== 0) return step;
  return (a.id ?? "").localeCompare(b.id ?? "");
}

/** Copy sorted by case_step, then id. Arrival order is not NCJMM order. */
export function sortNgnItemsByCaseStep<T extends { caseStep?: number | null; id?: string }>(
  items: readonly T[]
): T[] {
  return [...items].sort(compareNgnCaseStep);
}
