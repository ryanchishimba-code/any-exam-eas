import { TRIAL_FLASHCARD_FEED_FRACTION } from "@/lib/billing-config";

/** First ceil(10%) of the deck, in catalog order. Stable across sessions. */
export function trialFlashcardSliceCount(deckSize: number): number {
  if (!Number.isFinite(deckSize) || deckSize <= 0) return 0;
  const count = Math.ceil(deckSize * TRIAL_FLASHCARD_FEED_FRACTION);
  return Math.min(deckSize, Math.max(0, count));
}

export function trialFlashcardSlice<T>(cards: readonly T[]): T[] {
  return cards.slice(0, trialFlashcardSliceCount(cards.length));
}

export function isTrialFlashcardAllowed(idsInOrder: readonly string[], id: string): boolean {
  const index = idsInOrder.indexOf(id);
  return index >= 0 && index < trialFlashcardSliceCount(idsInOrder.length);
}

export type FeedCardsPayload<T> = {
  total: number;
  accessible: number;
  trialLimited: boolean;
  cards: T[];
};

/** Paid callers receive every card. Trial callers receive only the slice. */
export function feedCardsPayload<T>(cards: readonly T[], level: "full" | "trial"): FeedCardsPayload<T> {
  if (level === "full") {
    return { total: cards.length, accessible: cards.length, trialLimited: false, cards: [...cards] };
  }
  const slice = trialFlashcardSlice(cards);
  return { total: cards.length, accessible: slice.length, trialLimited: true, cards: slice };
}
