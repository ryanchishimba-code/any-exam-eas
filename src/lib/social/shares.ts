import { prisma } from "@/lib/prisma";
import type { ShareBeaconInput } from "./validators";
import type { ShareAnalytics } from "./types";

/** Record a share-button click. Never throws into the request path. */
export async function recordShare(
  input: ShareBeaconInput,
  userId?: string | null
): Promise<void> {
  try {
    await prisma.socialShare.create({
      data: {
        userId: userId ?? null,
        platform: input.platform,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        url: input.url ?? null,
        sessionId: input.sessionId ?? null,
      },
    });
  } catch {
    /* analytics must not break the product flow */
  }
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/** Engagement analytics for the admin dashboard (default: last 30 days). */
export async function getShareAnalytics(days = 30): Promise<ShareAnalytics> {
  const from = daysAgo(days);
  const rows = await prisma.socialShare.findMany({
    where: { createdAt: { gte: from } },
    select: { platform: true, entityType: true, createdAt: true },
    take: 20000,
  });

  const byPlatform = new Map<string, number>();
  const byEntityType = new Map<string, number>();
  const byDay = new Map<string, number>();

  for (const row of rows) {
    byPlatform.set(row.platform, (byPlatform.get(row.platform) ?? 0) + 1);
    byEntityType.set(row.entityType, (byEntityType.get(row.entityType) ?? 0) + 1);
    const day = row.createdAt.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  return {
    total: rows.length,
    byPlatform: [...byPlatform.entries()]
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count),
    byEntityType: [...byEntityType.entries()]
      .map(([entityType, count]) => ({ entityType, count }))
      .sort((a, b) => b.count - a.count),
    dailyTotals: [...byDay.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}
