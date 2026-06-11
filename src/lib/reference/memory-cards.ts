import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import type { ExamSlug } from "@/types/edtech";
import { filterMemoryCards, getMemoryCardsForExam } from "./seeds";
import { getMemoryCardIdsForTopic } from "./weak-area-map";
import type { MemoryCard, MemoryCardKind } from "./types";

export { WEAK_AREA_MEMORY_CARD_MAP, getMemoryCardIdsForTopic } from "./weak-area-map";

export type MemoryCardQuery = {
  query?: string;
  subject?: string;
  kind?: MemoryCardKind | "all";
};

/** Load memory cards for the user's exam (or override slug). */
export async function loadMemoryCards(
  userId: string,
  examSlug?: ExamSlug
): Promise<{ examSlug: ExamSlug; cards: MemoryCard[] }> {
  const pref = examSlug ? { examSlug } : await getUserExamPreference(userId);
  const slug = (examSlug ?? pref?.examSlug ?? "nclex") as ExamSlug;
  return { examSlug: slug, cards: getMemoryCardsForExam(slug) };
}

export function queryMemoryCards(cards: MemoryCard[], opts: MemoryCardQuery): MemoryCard[] {
  return filterMemoryCards(cards, opts);
}

/** Recommended cards for a topic slug, scoped to the active exam. */
export function getRecommendedMemoryCards(
  cards: MemoryCard[],
  topicKey: string | undefined
): MemoryCard[] {
  if (!topicKey?.trim()) return [];
  const ids = getMemoryCardIdsForTopic(topicKey);
  if (ids.length === 0) return [];
  const byId = new Map(cards.map((c) => [c.id, c]));
  return ids.map((id) => byId.get(id)).filter((c): c is MemoryCard => Boolean(c));
}

