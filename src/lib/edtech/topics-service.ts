import { prisma } from "@/lib/prisma";
import { getHighYieldTopics as getStaticTopics } from "@/lib/edtech/seeds";
import {
  mergeReviewModules,
  REVIEW_MODULE_TOPICS,
} from "@/lib/edtech/seeds/review-module-topics";
import type { ReviewModuleContent } from "@/lib/edtech/review-modules/types";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";

/** Upsert flagship review-module rows so progress FKs stay valid after code deploys. */
async function syncReviewModuleTopics(examSlug: ExamSlug): Promise<void> {
  const modules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === examSlug);
  if (modules.length === 0) return;

  const now = new Date();
  for (const topic of modules) {
    try {
      await prisma.highYieldTopic.upsert({
        where: { examSlug_slug: { examSlug: topic.examSlug, slug: topic.slug } },
        create: {
          id: topic.id,
          examSlug: topic.examSlug,
          slug: topic.slug,
          category: topic.category,
          title: topic.title,
          overview: topic.overview,
          summary: topic.summary,
          keyConcepts: topic.keyConcepts,
          mustKnowFacts: topic.mustKnowFacts,
          pearls: topic.pearls,
          pitfalls: topic.pitfalls,
          reviewModule: topic.reviewModule ?? undefined,
          sortOrder: topic.sortOrder,
          practiceTopicSlug: topic.practiceTopicSlug,
          updatedAt: now,
        },
        update: {
          category: topic.category,
          title: topic.title,
          overview: topic.overview,
          summary: topic.summary,
          keyConcepts: topic.keyConcepts,
          mustKnowFacts: topic.mustKnowFacts,
          pearls: topic.pearls,
          pitfalls: topic.pitfalls,
          reviewModule: topic.reviewModule ?? undefined,
          practiceTopicSlug: topic.practiceTopicSlug,
          updatedAt: now,
        },
      });
    } catch {
      /* board exam row may be missing before seed — non-fatal */
    }
  }
}

function parseReviewModule(value: unknown): ReviewModuleContent | undefined {
  if (!value || typeof value !== "object") return undefined;
  const sections = (value as ReviewModuleContent).sections;
  if (!Array.isArray(sections) || sections.length === 0) return undefined;
  return value as ReviewModuleContent;
}

function mapDbTopic(row: {
  id: string;
  examSlug: string;
  slug: string;
  category: string;
  title: string;
  overview: string;
  summary?: string | null;
  keyConcepts: unknown;
  mustKnowFacts: unknown;
  pearls: unknown;
  pitfalls: unknown;
  reviewModule?: unknown;
  sortOrder: number;
  practiceTopicSlug: string;
}): HighYieldTopic {
  const reviewModule = parseReviewModule(row.reviewModule);
  return {
    id: row.id,
    examSlug: row.examSlug as ExamSlug,
    slug: row.slug,
    category: row.category,
    title: row.title,
    overview: row.overview,
    summary: row.summary?.trim() || row.overview,
    keyConcepts: row.keyConcepts as string[],
    mustKnowFacts: row.mustKnowFacts as string[],
    pearls: row.pearls as string[],
    pitfalls: row.pitfalls as string[],
    sortOrder: row.sortOrder,
    practiceTopicSlug: row.practiceTopicSlug,
    reviewModule,
  };
}

function enrichStaticTopics(examSlug: ExamSlug, topics: HighYieldTopic[]): HighYieldTopic[] {
  return mergeReviewModules(topics, examSlug);
}

/** Prefer DB topics when seeded; fall back to static repo content. */
export async function loadHighYieldTopics(examSlug: ExamSlug): Promise<HighYieldTopic[]> {
  try {
    await syncReviewModuleTopics(examSlug);
    const rows = await prisma.highYieldTopic.findMany({
      where: { examSlug },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      const mapped = rows.map(mapDbTopic);
      return enrichStaticTopics(examSlug, mapped);
    }
  } catch {
    /* table may not exist before migration */
  }
  return getStaticTopics(examSlug);
}

export async function recordTopicView(userId: string, topicId: string): Promise<void> {
  try {
    const now = new Date();
    await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: { userId, topicId, lastViewedAt: now },
      update: { lastViewedAt: now },
    });
  } catch {
    /* non-blocking telemetry */
  }
}
