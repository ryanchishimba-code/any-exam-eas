import type { ExamSlug } from "@/types/edtech";

/**
 * Lightweight, client-only favorites for memory cards.
 *
 * Stored in localStorage per exam (no schema change required). Components can
 * listen for `FAVORITE_CHANGE_EVENT` to stay in sync across the page.
 */
const KEY_PREFIX = "aee-library-favorites";
export const FAVORITE_CHANGE_EVENT = "aee-card-favorite-change";

function storageKey(examSlug: ExamSlug): string {
  return `${KEY_PREFIX}-${examSlug}`;
}

export function readFavorites(examSlug: ExamSlug): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(examSlug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function isFavorite(examSlug: ExamSlug, cardId: string): boolean {
  return readFavorites(examSlug).includes(cardId);
}

/** Toggle a card's favorite state. Returns the new state (`true` = now favorited). */
export function toggleFavorite(examSlug: ExamSlug, cardId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = new Set(readFavorites(examSlug));
  let nowFavorite: boolean;
  if (current.has(cardId)) {
    current.delete(cardId);
    nowFavorite = false;
  } else {
    current.add(cardId);
    nowFavorite = true;
  }
  try {
    window.localStorage.setItem(storageKey(examSlug), JSON.stringify([...current]));
    window.dispatchEvent(
      new CustomEvent(FAVORITE_CHANGE_EVENT, { detail: { examSlug, cardId, nowFavorite } })
    );
  } catch {
    /* ignore storage errors */
  }
  return nowFavorite;
}
