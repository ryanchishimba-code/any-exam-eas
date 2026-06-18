import type { MemoryCard } from "./types";
import type { ExamSlug } from "@/types/edtech";

const LEGACY_STORAGE_KEY = "aee-reference-recent-cards";
const MAX_RECENT = 8;

function storageKey(examSlug: ExamSlug): string {
  return `aee-reference-recent-${examSlug}`;
}

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
}

/** Migrate legacy unscoped recent list into the first exam bucket accessed. */
function migrateLegacyIfNeeded(examSlug: ExamSlug): void {
  const legacy = readIds(LEGACY_STORAGE_KEY);
  if (legacy.length === 0) return;
  const key = storageKey(examSlug);
  if (readIds(key).length > 0) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return;
  }
  writeIds(key, legacy.slice(0, MAX_RECENT));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function getRecentMemoryCardIds(examSlug: ExamSlug): string[] {
  migrateLegacyIfNeeded(examSlug);
  return readIds(storageKey(examSlug));
}

export function rememberMemoryCard(cardId: string, examSlug: ExamSlug): void {
  const key = storageKey(examSlug);
  migrateLegacyIfNeeded(examSlug);
  const prev = readIds(key).filter((id) => id !== cardId);
  writeIds(key, [cardId, ...prev].slice(0, MAX_RECENT));
}

export function resolveRecentMemoryCards(cards: MemoryCard[], examSlug: ExamSlug): MemoryCard[] {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return getRecentMemoryCardIds(examSlug)
    .map((id) => byId.get(id))
    .filter((c): c is MemoryCard => Boolean(c));
}
