import { addIsoDays } from "@/lib/daily-vitals/schedule";

export type DailyVitalsStreak = { last: string; streak: number };

const MAX_STREAK = 2000;

/** A streak shows on the start screen when it was continued today or yesterday. */
export function visibleStreak(record: DailyVitalsStreak | undefined, today: string): number {
  if (!record || record.streak <= 0) return 0;
  if (record.last === today || addIsoDays(record.last, 1) === today) {
    return Math.min(record.streak, MAX_STREAK);
  }
  return 0;
}

/** A finished case, saved or missed, counts once for that Chicago date. */
export function nextStreak(record: DailyVitalsStreak | undefined, today: string): DailyVitalsStreak {
  if (record?.last === today) {
    return { last: today, streak: Math.min(Math.max(1, record.streak), MAX_STREAK) };
  }
  const alive = record && addIsoDays(record.last, 1) === today ? record.streak : 0;
  return { last: today, streak: Math.min(alive + 1, MAX_STREAK) };
}
