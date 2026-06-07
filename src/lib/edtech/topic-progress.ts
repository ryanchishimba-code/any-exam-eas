import { prisma } from "@/lib/prisma";
import type { TopicProgressMap } from "@/types/edtech";

export async function loadTopicProgressMap(
  userId: string,
  topicIds: string[]
): Promise<TopicProgressMap> {
  if (topicIds.length === 0) return {};

  try {
    const rows = await prisma.userTopicProgress.findMany({
      where: { userId, topicId: { in: topicIds } },
      select: {
        topicId: true,
        reviewCount: true,
        practiceCount: true,
        lastViewedAt: true,
      },
    });

    return Object.fromEntries(
      rows.map((r) => [
        r.topicId,
        {
          reviewCount: r.reviewCount,
          practiceCount: r.practiceCount,
          lastViewedAt: r.lastViewedAt?.toISOString() ?? null,
        },
      ])
    );
  } catch {
    return {};
  }
}

export async function incrementTopicReview(userId: string, topicId: string): Promise<number> {
  const now = new Date();
  const row = await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: { userId, topicId, lastViewedAt: now, reviewCount: 1 },
    update: { lastViewedAt: now, reviewCount: { increment: 1 } },
    select: { reviewCount: true },
  });
  return row.reviewCount;
}
