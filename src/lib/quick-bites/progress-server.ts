import { prisma } from "@/lib/prisma";
import { COMPLETION_RULES_V2 } from "@/lib/learning/study-completion/completion-rules-v2";

export type QuickBiteProgressRow = {
  watchPct: number;
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

export async function upsertQuickBiteProgress(
  userId: string,
  slug: string,
  input: { watchPct: number; watchSecondsDelta: number }
): Promise<QuickBiteProgressRow> {
  const existing = await prisma.quickBiteProgress.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  const increment = capQuickBiteWatchIncrement(
    input.watchSecondsDelta,
    existing?.updatedAt ?? null
  );
  const watchPct = Math.max(existing?.watchPct ?? 0, Math.min(100, input.watchPct));
  const watchSeconds = (existing?.watchSeconds ?? 0) + increment;
  const completed =
    isQuickBiteComplete(watchPct) || Boolean(existing?.completedAt);

  const row = await prisma.quickBiteProgress.upsert({
    where: { userId_slug: { userId, slug } },
    create: {
      userId,
      slug,
      watchPct,
      watchSeconds,
      completedAt: completed ? new Date() : null,
    },
    update: {
      watchPct,
      watchSeconds,
      completedAt: completed ? (existing?.completedAt ?? new Date()) : null,
    },
  });

  return row;
}
