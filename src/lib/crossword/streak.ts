import { addIsoDays } from "@/lib/crossword/schedule";

export type CrosswordStreakRecord = { last: string; streak: number };

const MAX_STREAK = 2000;

export function visibleStreak(record: CrosswordStreakRecord | undefined, today: string): number {
  if (!record || record.streak <= 0) return 0;
  if (record.last === today || addIsoDays(record.last, 1) === today) {
    return Math.min(record.streak, MAX_STREAK);
  }
  return 0;
}

/** Today's completion. Playing again the same day does not add another day. */
export function nextStreak(record: CrosswordStreakRecord | undefined, today: string): CrosswordStreakRecord {
  if (record?.last === today) {
    return { last: today, streak: Math.min(Math.max(1, record.streak), MAX_STREAK) };
  }
  const alive = record && addIsoDays(record.last, 1) === today ? record.streak : 0;
  return { last: today, streak: Math.min(alive + 1, MAX_STREAK) };
}

/**
 * Keep the longer live chain. A solve today on this device continues a streak
 * that was last saved yesterday on the account, without counting today twice.
 */
export function mergeStreakRecords(
  local: CrosswordStreakRecord | undefined,
  remote: CrosswordStreakRecord | undefined,
): CrosswordStreakRecord | null {
  const a = clean(local);
  const b = clean(remote);
  if (!a) return b;
  if (!b) return a;
  if (a.last === b.last) {
    return a.streak >= b.streak ? a : b;
  }
  const [earlier, later] = a.last < b.last ? [a, b] : [b, a];
  if (addIsoDays(earlier.last, 1) === later.last) {
    return { last: later.last, streak: Math.min(Math.max(later.streak, earlier.streak + 1), MAX_STREAK) };
  }
  return later;
}

function clean(record: CrosswordStreakRecord | undefined): CrosswordStreakRecord | null {
  if (!record) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.last)) return null;
  if (!Number.isFinite(record.streak) || record.streak <= 0) return null;
  return { last: record.last, streak: Math.min(Math.floor(record.streak), MAX_STREAK) };
}
