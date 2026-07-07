import type { HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import {
  NCLEX_LEARNING_PATH_ORDER,
  sortTopicsByNclexPath,
} from "@/lib/exam-prep/nclex/topic-learning-path";

export type DomainProgress = {
  id: string;
  label: string;
  shortLabel: string;
  weightPct: number;
  total: number;
  reviewed: number;
  pct: number;
};

export type TopicGroup = {
  id: string;
  label: string;
  shortLabel: string;
  weightPct: number;
  topics: HighYieldTopic[];
  reviewed: number;
  total: number;
  pct: number;
};

export function countReviewed(
  topics: HighYieldTopic[],
  progressMap: TopicProgressMap
): number {
  return topics.filter((t) => (progressMap[t.id]?.reviewCount ?? 0) > 0).length;
}

export function domainProgressPct(reviewed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((reviewed / total) * 100);
}

export function buildTopicGroups(
  groups: Array<{
    domain: { id: string; label: string; shortLabel: string; weightPct: number };
    topics: HighYieldTopic[];
  }>,
  progressMap: TopicProgressMap,
  sortByPath?: (topics: HighYieldTopic[]) => HighYieldTopic[]
): TopicGroup[] {
  const sorter = sortByPath ?? ((t) => t);
  return groups.map(({ domain, topics }) => {
    const ordered = sorter(topics);
    const reviewed = countReviewed(ordered, progressMap);
    const total = ordered.length;
    return {
      id: domain.id,
      label: domain.label,
      shortLabel: domain.shortLabel,
      weightPct: domain.weightPct,
      topics: ordered,
      reviewed,
      total,
      pct: domainProgressPct(reviewed, total),
    };
  });
}

/** First unreviewed topic in learning path order. */
export function getNextTopicInPath(
  topics: HighYieldTopic[],
  progressMap: TopicProgressMap,
  pathOrder: string[] = NCLEX_LEARNING_PATH_ORDER
): HighYieldTopic | null {
  const bySlug = new Map(topics.map((t) => [t.slug, t]));
  for (const slug of pathOrder) {
    const topic = bySlug.get(slug);
    if (!topic) continue;
    if ((progressMap[topic.id]?.reviewCount ?? 0) === 0) return topic;
  }
  return sortTopicsByNclexPath(topics)[0] ?? null;
}

/** Topics in display/navigation order for the current view. */
export function flattenTopicGroups(groups: TopicGroup[]): HighYieldTopic[] {
  return groups.flatMap((g) => g.topics);
}

export function findTopicGroupForSlug(
  groups: TopicGroup[],
  slug: string
): TopicGroup | undefined {
  return groups.find((g) => g.topics.some((t) => t.slug === slug));
}
