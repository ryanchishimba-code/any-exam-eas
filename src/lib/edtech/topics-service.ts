import { prisma } from "@/lib/prisma";
import { getHighYieldTopics as getStaticTopics } from "@/lib/edtech/seeds";
import type { ExamSlug, HighYieldTopic } from "@/types/edtech";

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
  sortOrder: number;
  practiceTopicSlug: string;
}): HighYieldTopic {
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
  };
}

/** Prefer DB topics when seeded; fall back to static repo content. */
export async function loadHighYieldTopics(examSlug: ExamSlug): Promise<HighYieldTopic[]> {
  try {
    const rows = await prisma.highYieldTopic.findMany({
      where: { examSlug },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map(mapDbTopic);
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
