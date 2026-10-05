import { sqlQuery, withDbRetry } from "@/lib/db";
import { resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { reviewFieldIdsForQuery } from "@/lib/learning/review-queue-launch";
import { CACHE_TTL, CACHE_STALE, cacheGetOrSetDeduped, cacheKey } from "@/lib/cache";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";

const EMPTY: StudyHubQuickStats = {
  questionsAnswered: 0,
  questionsToday: 0,
  accuracyPct: 0,
  streakDays: 0,
};

async function loadExamScopedStats(
  userId: string,
  _examSlug: ExamSlug,
  fieldId: string
): Promise<StudyHubQuickStats> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const attemptFields = reviewFieldIdsForQuery(fieldId);
  const fields = attemptFields.length > 0 ? attemptFields : [fieldId];
  const params: unknown[] = [userId, since, todayStart];
  const fieldSql = fields
    .map((field) => {
      params.push(field);
      return `$${params.length}`;
    })
    .join(", ");

  // One Neon HTTP round trip, off the Prisma connection_limit=1 slot.
  // The 30-day window includes today, so both counts come from one scan.
  const rows = await withDbRetry(
    () =>
      sqlQuery<
        { total: number; correct: number; today: number; streak: number | null }[]
      >(
        `
        SELECT
          COUNT(*) FILTER (WHERE "createdAt" >= $2)::int AS total,
          COALESCE(SUM(CASE WHEN "correct" AND "createdAt" >= $2 THEN 1 ELSE 0 END), 0)::int AS correct,
          COUNT(*) FILTER (WHERE "createdAt" >= $3)::int AS today,
          (
            SELECT "studyStreakDays"
            FROM "LearningProfile"
            WHERE "userId" = $1
            LIMIT 1
          ) AS streak
        FROM "QuestionAttempt"
        WHERE "userId" = $1
          AND "fieldId" IN (${fieldSql})
          AND "createdAt" >= $2
        `,
        params
      ),
    "stats.scoped"
  );
  const row = rows[0];
  const total = Number(row?.total ?? 0);
  const correct = Number(row?.correct ?? 0);

  // questionsAnswered / accuracyPct are the last 30 days only. Board totals
  // (Today's block, readiness sample, analytics) use the full attempt scan.
  return {
    questionsAnswered: total,
    questionsToday: Number(row?.today ?? 0),
    accuracyPct: total > 0 ? Math.round((correct / total) * 100) : 0,
    streakDays: Number(row?.streak ?? 0),
  };
}

/** Quick stats scoped to the user's selected exam field (USMLE step-aware when fieldId passed). */
export async function getExamScopedStats(
  userId: string,
  examSlug: ExamSlug,
  fieldIdOverride?: string
): Promise<StudyHubQuickStats> {
  const fieldId = fieldIdOverride ?? resolveExamFieldId(examSlug);
  try {
    return await cacheGetOrSetDeduped(
      cacheKey(["exam-scoped-stats-v2", userId, examSlug, fieldId]),
      CACHE_TTL.examScopedStats,
      () => loadExamScopedStats(userId, examSlug, fieldId),
      { staleTtlMs: CACHE_STALE.examScopedStats, skipFreshL1: true }
    );
  } catch {
    return EMPTY;
  }
}
