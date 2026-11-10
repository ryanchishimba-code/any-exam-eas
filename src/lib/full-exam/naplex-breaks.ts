/** Optional breaks in a 6-hour NAPLEX practice exam, after 2 hours and after 4 hours. */
export const NAPLEX_BREAK_MARKS_SEC = [2 * 60 * 60, 4 * 60 * 60] as const;

export function nextNaplexBreakMark(elapsedSec: number, offered: ReadonlySet<number>): number | null {
  if (!Number.isFinite(elapsedSec) || elapsedSec < 0) return null;
  for (const mark of NAPLEX_BREAK_MARKS_SEC) {
    if (elapsedSec >= mark && !offered.has(mark)) return mark;
  }
  return null;
}

export function naplexBreakLabel(markSec: number): string {
  const hours = Math.round(markSec / 3600);
  return hours === 1 ? "1-hour break point" : `${hours}-hour break point`;
}
