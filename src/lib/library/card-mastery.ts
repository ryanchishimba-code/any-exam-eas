import type { ExamSlug } from "@/types/edtech";
import type { MemoryCard } from "./types";
import { persistCardMasteryToServer } from "./card-mastery-sync";

export type CardMasteryStatus = "got-it" | "need-review";

export type MasteryEntry = {
  status: CardMasteryStatus;
  updatedAt: string;
};

export type MasteryStore = Record<string, MasteryEntry>;

function storageKey(examSlug: ExamSlug): string {
  return `aee-card-mastery-${examSlug}`;
}

export function readMasteryStore(examSlug: ExamSlug): MasteryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(examSlug));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as MasteryStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeMasteryStore(examSlug: ExamSlug, store: MasteryStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(examSlug), JSON.stringify(store));
}

function dispatchMasteryChange(
  examSlug: ExamSlug,
  cardId: string,
  status: CardMasteryStatus
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("aee-card-mastery-change", { detail: { examSlug, cardId, status } })
  );
}

export function getCardMastery(
  cardId: string,
  examSlug: ExamSlug
): CardMasteryStatus | null {
  return readMasteryStore(examSlug)[cardId]?.status ?? null;
}

export function setCardMastery(
  cardId: string,
  examSlug: ExamSlug,
  status: CardMasteryStatus
): void {
  const store = readMasteryStore(examSlug);
  store[cardId] = { status, updatedAt: new Date().toISOString() };
  writeMasteryStore(examSlug, store);
  dispatchMasteryChange(examSlug, cardId, status);
  void persistCardMasteryToServer(examSlug, cardId, status);
}

export function applyMasteryStore(examSlug: ExamSlug, store: MasteryStore): void {
  writeMasteryStore(examSlug, store);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("aee-card-mastery-change", { detail: { examSlug, hydrated: true } })
    );
  }
}

export function resolveCardsNeedingReview(
  cards: MemoryCard[],
  examSlug: ExamSlug,
  limit = 6
): MemoryCard[] {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return getCardsNeedingReview(examSlug)
    .map((id) => byId.get(id))
    .filter((c): c is MemoryCard => Boolean(c))
    .slice(0, limit);
}

export function getCardsNeedingReview(examSlug: ExamSlug): string[] {
  const store = readMasteryStore(examSlug);
  return Object.entries(store)
    .filter(([, v]) => v.status === "need-review")
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))
    .map(([id]) => id);
}
