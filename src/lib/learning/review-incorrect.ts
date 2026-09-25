import { filterBankRowsForPracticeField } from "@/lib/edtech/exam-item-scope";
import { selectReviewQueueIds } from "@/lib/learning/item-mastery";
import {
  reviewFieldIdsForQuery,
  selectLaunchReviewQueueIds,
} from "@/lib/learning/review-queue-launch";
import { ineligibleServedIds } from "@/lib/exam-prep/student-eligibility";
import { prisma } from "@/lib/prisma";
import { normalizeFieldId } from "@/lib/subjects/field-ids";

/**
 * Bank rows Review incorrect can actually start: active, qaPassed, and in the
 * practice field. This is the published inventory, not the stricter editorial
 * serve gate, so a just-answered item is not dropped for a board-specific rule.
 */
export async function loadServableReviewBankIds(
  fieldId: string,
  ids: string[]
): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const blocked = new Set(await ineligibleServedIds(fieldId));
  const rows = filterBankRowsForPracticeField(
    await prisma.questionBankItem.findMany({
      where: {
        id: { in: ids },
        active: true,
        qaPassed: true,
      },
      select: { id: true, fieldId: true, stepLevel: true },
    }),
    fieldId
  ).filter((row) => !blocked.has(row.id));
  return new Set(rows.map((row) => row.id));
}

/**
 * Bank item ids still in Review incorrect.
 * A miss stays queued until spaced re-proof or a confirmed mark-mastered.
 * Topic scope is kept when that topic has servable misses; otherwise the
 * board-wide servable queue is used. Zero incorrect rows return immediately.
 */
export async function loadStillIncorrectBankItemIds(params: {
  userId: string;
  fieldId: string;
  subjectId?: string | null;
  limit?: number;
}): Promise<string[]> {
  const fieldIds = reviewFieldIdsForQuery(params.fieldId);
  if (fieldIds.length === 0) return [];
  const canonicalFieldId = normalizeFieldId(params.fieldId.trim());

  const anyMiss = await prisma.questionAttempt.findFirst({
    where: {
      userId: params.userId,
      fieldId: { in: fieldIds },
      correct: false,
    },
    select: { id: true },
  });
  if (!anyMiss) return [];

  const [attempts, marks] = await Promise.all([
    prisma.questionAttempt.findMany({
      where: { userId: params.userId, fieldId: { in: fieldIds } },
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
      where: { userId: params.userId, fieldId: { in: fieldIds } },
      select: { itemId: true, confirmedAt: true },
    }),
  ]);

  const openIds = selectReviewQueueIds({ attempts, marks, limit: 300 });
  const servableIds = await loadServableReviewBankIds(canonicalFieldId, openIds);
  return selectLaunchReviewQueueIds({
    attempts,
    marks,
    subjectId: params.subjectId,
    limit: params.limit,
    servableIds,
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
