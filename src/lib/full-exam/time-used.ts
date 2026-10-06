/**
 * Elapsed exam time from the session start, minus pauses.
 * A one-second interval under-counts when the tab is backgrounded.
 */
export function fullExamTimeUsedSec(input: {
  startedAt?: string | Date | null;
  nowMs: number;
  pausedSec?: number;
  fallbackSec?: number;
}): number {
  const paused = Math.max(0, Math.floor(input.pausedSec ?? 0) || 0);
  const fallback = Math.max(0, Math.floor(input.fallbackSec ?? 0) || 0);
  if (input.startedAt) {
    const start = new Date(input.startedAt).getTime();
    if (Number.isFinite(start)) {
      const elapsed = Math.floor((input.nowMs - start) / 1000) - paused;
      if (elapsed >= 0) return elapsed;
    }
  }
  return fallback;
}
