import { addIsoDays } from "@/lib/daily-vitals/schedule";

export type DailyVitalsStreak = { last: string; streak: number };

const MAX_STREAK = 2000;

/** Shown on the start and finish screens. A miss counts. Only a skipped day breaks it. */
export const STREAK_RULE =
  "Playing keeps the streak, saved or missed. Skipping a day breaks it. The streak stays on this device.";

/** A streak shows on the start screen when it was continued today or yesterday. */
export function visibleStreak(record: DailyVitalsStreak | undefined, today: string): number {
  if (!record || record.streak <= 0) return 0;
  if (record.last === today || addIsoDays(record.last, 1) === today) {
    return Math.min(record.streak, MAX_STREAK);
  }
  return 0;
}

/**
 * Record that today's case was played. Saved and missed both count.
 * A gap of more than one Chicago day starts the streak over at 1.
 * Playing the same day again does not add another day.
 */
export function nextStreak(record: DailyVitalsStreak | undefined, today: string): DailyVitalsStreak {
  if (record?.last === today) {
    return { last: today, streak: Math.min(Math.max(1, record.streak), MAX_STREAK) };
  }
  const alive = record && addIsoDays(record.last, 1) === today ? record.streak : 0;
  return { last: today, streak: Math.min(alive + 1, MAX_STREAK) };
}
