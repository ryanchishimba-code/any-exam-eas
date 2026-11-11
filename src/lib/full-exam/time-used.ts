/**
 * Elapsed exam time from the session start, minus pauses.
 * A one-second interval under-counts when the tab is backgrounded, and a
 * start stamp written near submit under-counts a sitting that already has
 * answer timestamps. The result is the longer of those clocks.
 */
export function fullExamTimeUsedSec(input: {
  startedAt?: string | Date | null;
  nowMs: number;
  pausedSec?: number;
  fallbackSec?: number;
  /** First paint of this sitting, kept across remounts. */
  openedAtMs?: number | null;
  answerTimes?: Array<string | Date | null | undefined>;
}): number {
  const paused = Math.max(0, Math.floor(input.pausedSec ?? 0) || 0);
  const fallback = Math.max(0, Math.floor(input.fallbackSec ?? 0) || 0);
  const stamps = (input.answerTimes ?? [])
    .map((value) => (value ? new Date(value).getTime() : Number.NaN))
    .filter((value) => Number.isFinite(value));
  const earliestAnswer = stamps.length > 0 ? Math.min(...stamps) : Number.NaN;
  const latestAnswer = stamps.length > 0 ? Math.max(...stamps) : Number.NaN;

  const elapsedFrom = (startMs: number): number => {
    if (!Number.isFinite(startMs)) return -1;
    return Math.floor((input.nowMs - startMs) / 1000) - paused;
  };

  const fromStart = input.startedAt ? elapsedFrom(new Date(input.startedAt).getTime()) : -1;
  const fromOpen =
    typeof input.openedAtMs === "number" ? elapsedFrom(input.openedAtMs) : -1;
  let fromAnswers = -1;
  if (Number.isFinite(earliestAnswer)) {
    const end = Math.max(input.nowMs, latestAnswer);
    fromAnswers = Math.floor((end - earliestAnswer) / 1000);
  }

  const candidates = [fallback];
  // A clock about one hour longer than the running timer is a timezone skew,
  // not a backgrounded tab. A much longer wall clock still wins over a frozen timer.
  const accept = (candidate: number): boolean => {
    if (candidate < 0) return false;
    const extra = candidate - fallback;
    return !(extra >= 50 * 60 && extra <= 75 * 60);
  };
  // A start stamp later than the first answer is the short-timer bug.
  if (fromStart >= 0 && (!Number.isFinite(earliestAnswer) || fromStart + 5 >= fromAnswers) && accept(fromStart)) {
    candidates.push(fromStart);
  }
  if (accept(fromOpen)) candidates.push(fromOpen);
  if (accept(fromAnswers)) candidates.push(fromAnswers);
  return Math.max(...candidates);
}
