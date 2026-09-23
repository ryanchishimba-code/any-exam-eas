import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { selectReviewQueueIds } from "@/lib/learning/item-mastery";
import { prisma } from "@/lib/prisma";

/**
 * Bank item ids still in Review incorrect.
 * A miss stays queued until spaced re-proof or a confirmed mark-mastered.
 * Zero incorrect rows return immediately so an empty queue does not scan history.
 */
export async function loadStillIncorrectBankItemIds(params: {
  userId: string;
  fieldId: string;
  subjectId?: string | null;
  limit?: number;
}): Promise<string[]> {
  const limit = Math.min(Math.max(params.limit ?? 100, 1), 300);
  const subjectId =
    params.subjectId && params.subjectId !== MIXED_SUBJECT_ID ? params.subjectId : null;
  const subjectFilter = subjectId ? { subjectId } : {};

  const anyMiss = await prisma.questionAttempt.findFirst({
    where: {
      userId: params.userId,
      fieldId: params.fieldId,
      correct: false,
      ...subjectFilter,
    },
    select: { id: true },
  });
  if (!anyMiss) return [];

  const [attempts, marks] = await Promise.all([
    prisma.questionAttempt.findMany({
      where: { userId: params.userId, fieldId: params.fieldId },
      select: {
        bankItemId: true,
        questionKey: true,
        correct: true,
        createdAt: true,
        sessionId: true,
        subjectId: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.remediationMasteryMark.findMany({
      where: { userId: params.userId, fieldId: params.fieldId },
      select: { itemId: true, confirmedAt: true },
    }),
  ]);

  return selectReviewQueueIds({
    attempts,
    marks,
    subjectId,
    limit,
  });
}

export async function countStillIncorrectBankItems(params: {
  userId: string;
  fieldId: string;
  subjectId?: string | null;
}): Promise<number> {
  const ids = await loadStillIncorrectBankItemIds({ ...params, limit: 300 });
  return ids.length;
}
