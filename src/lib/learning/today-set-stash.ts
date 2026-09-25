/** Short-lived handoff so the dashboard build and the player are the same set. */

export const DAILY_SET_STASH_KEY = "aee-daily-set-v1";
const MAX_AGE_MS = 2 * 60 * 1000;

export type StashedDailySet = {
  fieldId: string;
  savedAt: number;
  questions: unknown[];
  bankItemIds: string[];
  /** Mix line from the served session. Resume shows this instead of recomputing. */
  mixLine?: string | null;
  todaySet: {
    examSlug: string;
    target: number;
    tomorrowCount: number;
    topics: Record<string, { id: string; label: string; href: string }>;
  };
};

export function stashDailySet(payload: StashedDailySet): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DAILY_SET_STASH_KEY, JSON.stringify(payload));
  } catch {
    /* quota — the player will build the set itself */
  }
}

export function takeDailySet(fieldId: string): StashedDailySet | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DAILY_SET_STASH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StashedDailySet;
    const fresh = parsed && Date.now() - parsed.savedAt <= MAX_AGE_MS;
    if (!fresh || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      window.sessionStorage.removeItem(DAILY_SET_STASH_KEY);
      return null;
    }
    if (parsed.fieldId !== fieldId) return null;
    window.sessionStorage.removeItem(DAILY_SET_STASH_KEY);
    return parsed;
  } catch {
    return null;
  }
}
