import {
  deepDiveTopicHref,
  practiceTopicHref,
  libraryCardHref,
  libraryTopicHref,
} from "@/lib/edtech/practice-links";
import { getAnatomyStructuresForTopicSlug, type AnatomyStructureLink } from "@/lib/anatomy/topic-links";
import {
  resolveNclexTopicSlugForBlueprint,
  resolveNclexTopicSlugForSubject,
} from "@/lib/exam-prep/nclex/topic-registry";
import {
  buildTopicDrugClassLinks,
  buildTopicDrugLinks,
  buildTopicPresetLinks,
  type TopicDrugClassLink,
  type TopicDrugLink,
  type TopicPresetLink,
} from "@/lib/exam-prep/nclex/topic-drug-links";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import type { FullExamTopicBreakdown } from "@/types/full-exam";
import type { ExamSlug } from "@/types/edtech";
import { getMemoryCardIdsForTopic, normalizeWeakAreaTopicKey } from "./weak-area-map";
import { MEMORY_CARDS } from "./seeds";

export type { AnatomyStructureLink };

export type ExamTopicStudyLinks = {
  topic: string;
  topicKey: string;
  libraryHref: string;
  practiceHref: string;
  memoryCardIds: string[];
  reviewModuleSlug?: string;
  deepDiveHref?: string;
  firstCardHref?: string;
  anatomyStructures: AnatomyStructureLink[];
  /** NCLEX: linked high-yield topic slugs for this blueprint/subject area. */
  relatedTopicSlugs?: string[];
  drugLinks?: TopicDrugLink[];
  drugClassLinks?: TopicDrugClassLink[];
  presetLinks?: TopicPresetLink[];
  topicsHubHref?: string;
};

export function topicNameToSlug(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .replace(/^(tag|subject):/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveTopicKey(examSlug: ExamSlug, topic: string): string {
  const slug = topicNameToSlug(topic);
  if (examSlug === "nclex") {
    const fromBlueprint = resolveNclexTopicSlugForBlueprint(slug);
    if (fromBlueprint) return fromBlueprint;
    const fromSubject = resolveNclexTopicSlugForSubject(slug);
    if (fromSubject) return fromSubject;
  }
  if (getMemoryCardIdsForTopic(slug).length > 0) return slug;
  const normalized = normalizeWeakAreaTopicKey(topic);
  if (getMemoryCardIdsForTopic(normalized).length > 0) return normalized;
  return slug;
}

function resolveNclexLinks(examSlug: ExamSlug, topic: string): Partial<ExamTopicStudyLinks> {
  if (examSlug !== "nclex") return {};
  const topicKey = resolveTopicKey(examSlug, topic);
  const card = getHighYieldTopic("nclex", topicKey);
  if (!card) {
    return {
      relatedTopicSlugs: [topicKey],
      topicsHubHref: `/dashboard/topics?exam=nclex&topic=${encodeURIComponent(topicKey)}`,
    };
  }
  return {
    relatedTopicSlugs: [card.slug],
    drugLinks: buildTopicDrugLinks(card),
    drugClassLinks: buildTopicDrugClassLinks(card),
    presetLinks: buildTopicPresetLinks(examSlug, card),
    topicsHubHref: `/dashboard/topics?exam=nclex&topic=${encodeURIComponent(card.slug)}`,
  };
}

export function getExamTopicStudyLinks(
  examSlug: ExamSlug,
  topic: string
): ExamTopicStudyLinks {
  const topicKey = resolveTopicKey(examSlug, topic);
  const memoryCardIds = getMemoryCardIdsForTopic(topicKey);
  const card = getHighYieldTopic(examSlug, topicKey);

  const cardStructureIds = memoryCardIds.flatMap((id) => {
    const cardEntry = MEMORY_CARDS.find((c) => c.id === id);
    return cardEntry?.structureIds ?? [];
  });
  const moduleStructureIds = card?.relatedStructureIds ?? [];

  const nclexExtras = resolveNclexLinks(examSlug, topic);

  return {
    topic,
    topicKey,
    libraryHref: libraryTopicHref(examSlug, topicKey),
    practiceHref: practiceTopicHref(
      examSlug,
      card?.practiceTopicSlug ?? topicKey,
      10
    ),
    memoryCardIds,
    reviewModuleSlug: card?.slug,
    deepDiveHref: card?.reviewModule
      ? deepDiveTopicHref(examSlug, card.slug)
      : undefined,
    firstCardHref:
      memoryCardIds[0] != null
        ? libraryCardHref(examSlug, memoryCardIds[0]!)
        : undefined,
    anatomyStructures: getAnatomyStructuresForTopicSlug(card?.slug ?? topicKey, {
      memoryCardIds,
      structureIds: [...moduleStructureIds, ...cardStructureIds],
    }),
    ...nclexExtras,
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
