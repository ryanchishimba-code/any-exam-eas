import { prisma } from "@/lib/prisma";

const DEFAULT_RETENTION_DAYS = 90;
const BATCH_SIZE = 5000;

export function analyticsRetentionDays(): number {
  const parsed = Number(process.env.ANALYTICS_RETENTION_DAYS ?? String(DEFAULT_RETENTION_DAYS));
  if (!Number.isFinite(parsed) || parsed < 30) return DEFAULT_RETENTION_DAYS;
  return Math.floor(parsed);
}

/** Delete raw AnalyticsEvent rows older than retention window (after daily rollup). */
export async function purgeOldAnalyticsEvents(
  retentionDays = analyticsRetentionDays()
): Promise<{ deleted: number; retentionDays: number; cutoff: string }> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - retentionDays);
  cutoff.setUTCHours(0, 0, 0, 0);

  let deleted = 0;
  for (;;) {
    const batch = await prisma.analyticsEvent.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true },
      take: BATCH_SIZE,
      orderBy: { createdAt: "asc" },
    });
    if (batch.length === 0) break;

    const result = await prisma.analyticsEvent.deleteMany({
      where: { id: { in: batch.map((row) => row.id) } },
    });
    deleted += result.count;
    if (batch.length < BATCH_SIZE) break;
  }

  return {
    deleted,
    retentionDays,
    cutoff: cutoff.toISOString(),
  };
}
