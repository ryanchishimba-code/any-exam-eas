import {
  deepDiveTopicHref,
  practiceTopicHref,
  referenceCardHref,
  referenceTopicHref,
} from "@/lib/edtech/practice-links";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import type { FullExamTopicBreakdown } from "@/types/full-exam";
import type { ExamSlug } from "@/types/edtech";
import { getMemoryCardIdsForTopic, normalizeWeakAreaTopicKey } from "./weak-area-map";

export type ExamTopicStudyLinks = {
  topic: string;
  topicKey: string;
  referenceHref: string;
  practiceHref: string;
  memoryCardIds: string[];
  reviewModuleSlug?: string;
  deepDiveHref?: string;
  firstCardHref?: string;
};

export function topicNameToSlug(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .replace(/^(tag|subject):/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveTopicKey(topic: string): string {
  const slug = topicNameToSlug(topic);
  if (getMemoryCardIdsForTopic(slug).length > 0) return slug;
  const normalized = normalizeWeakAreaTopicKey(topic);
  if (getMemoryCardIdsForTopic(normalized).length > 0) return normalized;
  return slug;
}

export function getExamTopicStudyLinks(
  examSlug: ExamSlug,
  topic: string
): ExamTopicStudyLinks {
  const topicKey = resolveTopicKey(topic);
  const memoryCardIds = getMemoryCardIdsForTopic(topicKey);
  const reviewModule = REVIEW_MODULE_TOPICS.find(
    (m) =>
      m.examSlug === examSlug &&
      (m.slug === topicKey || m.practiceTopicSlug === topicKey)
  );

  return {
    topic,
    topicKey,
    referenceHref: referenceTopicHref(examSlug, topicKey),
    practiceHref: practiceTopicHref(
      examSlug,
      reviewModule?.practiceTopicSlug ?? topicKey,
      10
    ),
    memoryCardIds,
    reviewModuleSlug: reviewModule?.slug,
    deepDiveHref: reviewModule?.slug
      ? deepDiveTopicHref(examSlug, reviewModule.slug)
      : undefined,
    firstCardHref:
      memoryCardIds[0] != null
        ? referenceCardHref(examSlug, memoryCardIds[0]!)
        : undefined,
  };
}

/** Topics below accuracy threshold from a full-exam breakdown. */
export function getWeakTopicsFromBreakdown(
  breakdown: FullExamTopicBreakdown[],
  thresholdPct = 70
): FullExamTopicBreakdown[] {
  return breakdown
    .filter((t) => t.total >= 1 && t.pct < thresholdPct)
    .sort((a, b) => a.pct - b.pct);
}
