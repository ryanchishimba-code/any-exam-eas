import { prisma } from "@/lib/prisma";

/**
 * Bank item IDs the user has missed and not yet answered correctly later.
 * Prefer bankItemId; fall back to questionKey when it looks like a cuid.
 */
export async function loadStillIncorrectBankItemIds(params: {
  userId: string;
  fieldId: string;
  subjectId?: string | null;
  limit?: number;
}): Promise<string[]> {
  const limit = Math.min(Math.max(params.limit ?? 100, 1), 300);
  const subjectFilter =
    params.subjectId && params.subjectId !== "__mixed__"
      ? { subjectId: params.subjectId }
      : {};

  const incorrect = await prisma.questionAttempt.findMany({
    where: {
      userId: params.userId,
      fieldId: params.fieldId,
      correct: false,
      ...subjectFilter,
    },
    select: { bankItemId: true, questionKey: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  const correct = await prisma.questionAttempt.findMany({
    where: {
      userId: params.userId,
      fieldId: params.fieldId,
      correct: true,
      ...subjectFilter,
    },
    select: { bankItemId: true, questionKey: true },
    take: 4000,
  });

  const laterCorrect = new Set<string>();
  for (const row of correct) {
    if (row.bankItemId) laterCorrect.add(row.bankItemId);
    if (row.questionKey) laterCorrect.add(row.questionKey);
  }

  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const row of incorrect) {
    const id = row.bankItemId || row.questionKey;
    if (!id || seen.has(id) || laterCorrect.has(id)) continue;
    // Skip ephemeral numeric/session keys — need real bank ids.
    if (!row.bankItemId && /^\d+$/.test(id)) continue;
    seen.add(id);
    ordered.push(id);
    if (ordered.length >= limit) break;
  }

  return ordered;
}

export async function countStillIncorrectBankItems(params: {
  userId: string;
  fieldId: string;
  subjectId?: string | null;
}): Promise<number> {
  const ids = await loadStillIncorrectBankItemIds({ ...params, limit: 300 });
  return ids.length;
}
