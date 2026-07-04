import { cacheGetOrSet, cacheKey, CACHE_TTL, CACHE_STALE } from "@/lib/cache";
import { enforceQuestionBankFieldAccess, resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";

export type SubjectCountsPayload = {
  fieldId: string;
  counts: Record<string, number>;
  total: number;
};

/** Server-side serve-ready counts for the question bank topic picker. */
export async function loadSubjectCountsForUser(
  userId: string,
  fieldParam: string
): Promise<SubjectCountsPayload | null> {
  const access = await enforceQuestionBankFieldAccess(userId, fieldParam);
  if (!access.ok) return null;

  const fieldId = resolveQuestionBankFieldId(fieldParam);

  try {
    const counts = await cacheGetOrSet(
      cacheKey(["subject-served-counts", fieldId]),
      CACHE_TTL.subjectCatalog,
      () => getSubjectServedCountsWithRetry(fieldId),
      { staleTtlMs: CACHE_STALE.subjectCatalog }
    );
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    return { fieldId, counts, total };
  } catch (error) {
    console.error("[load-subject-counts] lookup failed:", { fieldId, fieldParam, error });
    return null;
  }
}
