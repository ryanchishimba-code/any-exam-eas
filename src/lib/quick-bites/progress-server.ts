import { prisma } from "@/lib/prisma";
import { COMPLETION_RULES_V2 } from "@/lib/learning/study-completion/completion-rules-v2";
import type { QuickBiteProgressBody } from "@/lib/quick-bites/progress-body";

export type QuickBiteProgressRow = {
  watchPct: number;
  playbackPositionSec: number;
  watchSeconds: number;
  completedAt: Date | null;
  updatedAt: Date;
};

export function capQuickBiteWatchIncrement(
  requestedSeconds: number,
  lastUpdatedAt: Date | null,
  rules = COMPLETION_RULES_V2
): number {
  const maxByPolicy = rules.quickBiteProgressMaxIncrementSeconds;
  let capped = Math.min(Math.max(0, requestedSeconds), maxByPolicy);
  if (lastUpdatedAt) {
    const elapsedSec = Math.max(0, (Date.now() - lastUpdatedAt.getTime()) / 1000);
    const elapsedCap = Math.ceil(elapsedSec * rules.quickBiteProgressElapsedGrace);
    capped = Math.min(capped, elapsedCap);
  }
  return capped;
}

export function isQuickBiteComplete(watchPct: number, rules = COMPLETION_RULES_V2): boolean {
  return watchPct >= rules.quickBiteWatchPctComplete;
}

export type QuickBiteProgressSnapshot = {
  watchPct: number;
  playbackPositionSec: number;
  watchSeconds: number;
  completedAt: string | null;
};

export async function listQuickBiteProgressForUser(
  userId: string,
  slugs: readonly string[]
): Promise<Record<string, QuickBiteProgressSnapshot>> {
  if (slugs.length === 0) return {};
  const rows = await prisma.quickBiteProgress.findMany({
    where: { userId, slug: { in: [...slugs] } },
    select: {
      slug: true,
      watchPct: true,
      playbackPositionSec: true,
      watchSeconds: true,
      completedAt: true,
    },
  });
  const out: Record<string, QuickBiteProgressSnapshot> = {};
  for (const row of rows) {
    out[row.slug] = {
      watchPct: row.watchPct,
      playbackPositionSec: row.playbackPositionSec,
      watchSeconds: row.watchSeconds,
      completedAt: row.completedAt?.toISOString() ?? null,
    };
  }
  return out;
}

export async function upsertQuickBiteProgress(
  userId: string,
  slug: string,
  input: QuickBiteProgressBody
): Promise<QuickBiteProgressRow> {
  const existing = await prisma.quickBiteProgress.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  const increment = capQuickBiteWatchIncrement(
    input.watchSecondsDelta,
    existing?.updatedAt ?? null
  );
  const watchPct = Math.max(
    existing?.watchPct ?? 0,
    Math.min(100, input.momentWatchPct)
  );
  const playbackPositionSec = Math.max(0, input.playbackPositionSec);
  const watchSeconds = (existing?.watchSeconds ?? 0) + increment;
  const completed =
    isQuickBiteComplete(watchPct) || Boolean(existing?.completedAt);

  const row = await prisma.quickBiteProgress.upsert({
    where: { userId_slug: { userId, slug } },
    create: {
      userId,
      slug,
      watchPct,
      playbackPositionSec,
      watchSeconds,
      completedAt: completed ? new Date() : null,
    },
    update: {
      watchPct,
      playbackPositionSec,
      watchSeconds,
      completedAt: completed ? (existing?.completedAt ?? new Date()) : null,
    },
  });

  return row;
}
