export const CROSSWORD_STORE_KEY = "aee-crossword-v1";

export type CrosswordGameSave = {
  fills: Record<string, string>;
  hints: Record<string, boolean>;
  elapsed: number;
  started: boolean;
  complete: boolean;
  hinted: boolean;
};

export type CrosswordStreakRecord = { last: string; streak: number };

export type CrosswordStore = {
  streaks: Record<string, CrosswordStreakRecord>;
  games: Record<string, CrosswordGameSave>;
};

export const EMPTY_CROSSWORD_STORE: CrosswordStore = { streaks: {}, games: {} };

export function loadCrosswordStore(): CrosswordStore {
  if (typeof localStorage === "undefined") return EMPTY_CROSSWORD_STORE;
  try {
    const parsed = JSON.parse(localStorage.getItem(CROSSWORD_STORE_KEY) || "") as CrosswordStore;
    return {
      streaks: parsed?.streaks && typeof parsed.streaks === "object" ? parsed.streaks : {},
      games: parsed?.games && typeof parsed.games === "object" ? parsed.games : {},
    };
  } catch {
    return EMPTY_CROSSWORD_STORE;
  }
}

export function saveCrosswordStore(store: CrosswordStore) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CROSSWORD_STORE_KEY, JSON.stringify(store));
}
