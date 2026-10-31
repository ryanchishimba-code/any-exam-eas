import { prisma } from "@/lib/prisma";
import {
  sanitizeProgress,
  type PanceFeedProgressInput,
} from "@/lib/pance-feed/format";
import type { StudyFeedExam } from "@/lib/study-feed/catalog";

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

export async function readExamFeedProgress(
  exam: Exclude<StudyFeedExam, "pance">,
  userId: string,
  known: ReadonlySet<string>
): Promise<PanceFeedProgressState> {
  const row = await prisma.examFeedProgress.findUnique({
    where: { userId_examSlug: { userId, examSlug: exam } },
  });
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

export async function writeExamFeedProgress(
  exam: Exclude<StudyFeedExam, "pance">,
  userId: string,
  known: ReadonlySet<string>,
  input: unknown
): Promise<PanceFeedProgressState> {
  const clean = sanitizeProgress(input, known);
  const lastSeenAt = clean.lastSeenCardId ? new Date() : null;
  const row = await prisma.examFeedProgress.upsert({
    where: { userId_examSlug: { userId, examSlug: exam } },
    create: {
      userId,
      examSlug: exam,
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
