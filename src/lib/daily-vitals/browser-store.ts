import type { DailyVitalsStreak } from "@/lib/daily-vitals/streak";
import type { TileMark } from "@/lib/daily-vitals/types";

export const DAILY_VITALS_STORE_KEY = "aee-daily-vitals-v1";

export type DaySave = {
  guesses: string[];
  marks: TileMark[][];
  status: "playing" | "won" | "lost";
  word?: string;
  explanation?: string;
};

export type DailyVitalsStore = {
  streak?: DailyVitalsStreak;
  days: Record<string, DaySave>;
};

export function loadDailyVitalsStore(): DailyVitalsStore {
  if (typeof localStorage === "undefined") return { days: {} };
  try {
    const raw = localStorage.getItem(DAILY_VITALS_STORE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw) as DailyVitalsStore;
    if (!parsed || typeof parsed !== "object" || !parsed.days || typeof parsed.days !== "object") {
      return { days: {} };
    }
    return { streak: parsed.streak, days: parsed.days };
  } catch {
    return { days: {} };
  }
}

export function saveDailyVitalsStore(store: DailyVitalsStore) {
  localStorage.setItem(DAILY_VITALS_STORE_KEY, JSON.stringify(store));
}
