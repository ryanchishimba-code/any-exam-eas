import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import type { ExamSlug } from "@/types/edtech";
import { filterMemoryCards, getMemoryCardsForExam } from "./seeds";
import { resolveCardsNeedingReview } from "./card-mastery";
import { getMemoryCardIdsForTopic, normalizeWeakAreaTopicKey } from "./weak-area-map";
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

/** Cards for a topic deep link — weak-area map first, then practice slug / topic label. */
export function getCardsForTopicKey(cards: MemoryCard[], topicKey: string): MemoryCard[] {
  const mapped = getRecommendedMemoryCards(cards, topicKey);
  if (mapped.length > 0) return mapped;

  const key = normalizeWeakAreaTopicKey(topicKey);
  const slugMatches = cards.filter(
    (c) =>
      c.practiceTopicSlug === key ||
      c.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === key
  );
  return slugMatches.length > 0 ? slugMatches : mapped;
}

export function countCardsNeedingReview(cards: MemoryCard[], examSlug: ExamSlug): number {
  return resolveCardsNeedingReview(cards, examSlug, 99).length;
}

