import { prisma } from "@/lib/prisma";
import {
  sanitizeProgress,
  type PanceFeedProgressInput,
} from "@/lib/pance-feed/format";

export type PanceFeedProgressState = PanceFeedProgressInput & {
  lastSeenAt: string | null;
};

const EMPTY: PanceFeedProgressState = {
  mastered: [],
  reviewQueue: [],
  lastSeenCardId: null,
  lastSeenAt: null,
};

export async function readPanceFeedProgress(
  userId: string,
  known: ReadonlySet<string>
): Promise<PanceFeedProgressState> {
  const row = await prisma.panceFeedProgress.findUnique({ where: { userId } });
  if (!row) return EMPTY;
  const clean = sanitizeProgress(
    {
      mastered: row.mastered,
      reviewQueue: row.reviewQueue,
      lastSeenCardId: row.lastSeenCardId,
    },
    known
  );
  return { ...clean, lastSeenAt: row.lastSeenAt?.toISOString() ?? null };
}

export async function writePanceFeedProgress(
  userId: string,
  known: ReadonlySet<string>,
  input: unknown
): Promise<PanceFeedProgressState> {
  const clean = sanitizeProgress(input, known);
  const lastSeenAt = clean.lastSeenCardId ? new Date() : null;
  const row = await prisma.panceFeedProgress.upsert({
    where: { userId },
    create: {
      userId,
      mastered: clean.mastered,
      reviewQueue: clean.reviewQueue,
      lastSeenCardId: clean.lastSeenCardId,
      lastSeenAt,
    },
    update: {
      mastered: clean.mastered,
      reviewQueue: clean.reviewQueue,
      lastSeenCardId: clean.lastSeenCardId,
      lastSeenAt,
    },
  });
  return { ...clean, lastSeenAt: row.lastSeenAt?.toISOString() ?? null };
}
