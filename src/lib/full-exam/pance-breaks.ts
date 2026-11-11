/** Breaks between the five 60-minute blocks of a full PANCE practice exam. */
export const PANCE_BLOCK_SEC = 60 * 60;
export const PANCE_BREAK_MARKS_SEC = [
  PANCE_BLOCK_SEC,
  2 * PANCE_BLOCK_SEC,
  3 * PANCE_BLOCK_SEC,
  4 * PANCE_BLOCK_SEC,
] as const;

export function nextPanceBreakMark(elapsedSec: number, offered: ReadonlySet<number>): number | null {
  if (!Number.isFinite(elapsedSec) || elapsedSec < 0) return null;
  for (const mark of PANCE_BREAK_MARKS_SEC) {
    if (elapsedSec >= mark && !offered.has(mark)) return mark;
  }
  return null;
}

export function panceBlockLabel(questionIndex: number, questionCount: number): string | null {
  if (questionCount < 300) return null;
  const block = Math.min(5, Math.floor(questionIndex / 60) + 1);
  return `Block ${block} of 5`;
}
