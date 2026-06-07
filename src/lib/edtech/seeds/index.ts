import type { ExamSlug, HighYieldTopic } from "@/types/edtech";
import { NCLEX_HIGH_YIELD_TOPICS } from "./high-yield-nclex";
import { USMLE_HIGH_YIELD_TOPICS } from "./high-yield-usmle";
import { NAPLEX_HIGH_YIELD_TOPICS } from "./high-yield-naplex";
import { MPJE_HIGH_YIELD_TOPICS } from "./high-yield-mpje";

export const HIGH_YIELD_BY_EXAM: Record<ExamSlug, HighYieldTopic[]> = {
  nclex: NCLEX_HIGH_YIELD_TOPICS,
  usmle: USMLE_HIGH_YIELD_TOPICS,
  naplex: NAPLEX_HIGH_YIELD_TOPICS,
  mpje: MPJE_HIGH_YIELD_TOPICS,
};

export function getHighYieldTopics(examSlug: ExamSlug): HighYieldTopic[] {
  return HIGH_YIELD_BY_EXAM[examSlug] ?? [];
}

export function getHighYieldTopic(examSlug: ExamSlug, topicSlug: string): HighYieldTopic | undefined {
  return getHighYieldTopics(examSlug).find((t) => t.slug === topicSlug);
}

export function getTopicCategories(examSlug: ExamSlug): string[] {
  const cats = new Set(getHighYieldTopics(examSlug).map((t) => t.category));
  return [...cats].sort();
}

export const ALL_HIGH_YIELD_TOPICS: HighYieldTopic[] = [
  ...NCLEX_HIGH_YIELD_TOPICS,
  ...USMLE_HIGH_YIELD_TOPICS,
  ...NAPLEX_HIGH_YIELD_TOPICS,
  ...MPJE_HIGH_YIELD_TOPICS,
];
