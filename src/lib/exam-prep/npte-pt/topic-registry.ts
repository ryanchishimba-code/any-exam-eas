import type { HighYieldTopic } from "@/types/edtech";
import type { NptePtContentCategoryId } from "./types";
import {
  allNptePt2026TopicSlugs,
  highYieldTopicsForCategory2026,
  listNptePt2026TopicsForCategory,
  NPTE_PT_2026_TOPIC_GROUPS,
} from "./blueprint-topics-2026";

export type NptePtTopicMeta = {
  blueprintTopicSlugs?: string[];
  contentCategory?: NptePtContentCategoryId;
};

const EXTRA_REGISTRY: Record<string, NptePtTopicMeta> = {
  "sig-code-abbreviations": {
    blueprintTopicSlugs: ["informed-consent-documentation", "scope-of-practice"],
    contentCategory: "professional-responsibilities",
  },
};

function contentCategoryForSlug(slug: string): NptePtContentCategoryId | undefined {
  const group = NPTE_PT_2026_TOPIC_GROUPS.find((g) => g.categoryId === slug);
  if (group) return group.categoryId;
  if (allNptePt2026TopicSlugs().includes(slug)) {
    for (const g of NPTE_PT_2026_TOPIC_GROUPS) {
      if (g.topics.some((t) => t.slug === slug)) return g.categoryId;
    }
  }
  return undefined;
}

export function getNptePtTopicMeta(slug: string): NptePtTopicMeta {
  if (EXTRA_REGISTRY[slug]) return EXTRA_REGISTRY[slug]!;

  const category = contentCategoryForSlug(slug);
  if (category && slug === category) {
    return {
      contentCategory: category,
      blueprintTopicSlugs: highYieldTopicsForCategory2026(category),
    };
  }

  if (allNptePt2026TopicSlugs().includes(slug)) {
    return { blueprintTopicSlugs: [slug], contentCategory: category };
  }

  return {};
}

export function enrichNptePtTopic(topic: HighYieldTopic): HighYieldTopic {
  const meta = getNptePtTopicMeta(topic.slug);
  const fromPractice = getNptePtTopicMeta(topic.practiceTopicSlug);
  const blueprintTopicSlugs =
    meta.blueprintTopicSlugs ?? fromPractice.blueprintTopicSlugs ?? topic.blueprintTopicSlugs;
  return blueprintTopicSlugs?.length ? { ...topic, blueprintTopicSlugs } : topic;
}

export function enrichNptePtTopics(topics: HighYieldTopic[]): HighYieldTopic[] {
  return topics.map(enrichNptePtTopic);
}

export function listNptePtTopicsForCategory(category: NptePtContentCategoryId) {
  return listNptePt2026TopicsForCategory(category);
}
