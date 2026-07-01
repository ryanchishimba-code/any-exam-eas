import { and, count, eq, gte, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { learningProfiles, questionAttempts } from "@/db/schema";
import { withDrizzle } from "@/lib/db-resilience";
import { resolveExamFieldId } from "@/lib/edtech/exam-preference";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";

const EMPTY: StudyHubQuickStats = {
  questionsAnswered: 0,
  questionsToday: 0,
  accuracyPct: 0,
  streakDays: 0,
};

/** Quick stats scoped to the user's selected exam field. */
export async function getExamScopedStats(
  userId: string,
  examSlug: ExamSlug
): Promise<StudyHubQuickStats> {
  try {
    const fieldId = resolveExamFieldId(examSlug);
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const [attemptRow] = await withDrizzle("stats.attempts30d", () =>
      requireDb()
        .select({
          total: count(),
          correct: sql<number>`sum(case when ${questionAttempts.correct} then 1 else 0 end)::int`,
        })
        .from(questionAttempts)
        .where(
          and(
            eq(questionAttempts.userId, userId),
            eq(questionAttempts.fieldId, fieldId),
            gte(questionAttempts.createdAt, since)
          )
        )
    );

    const [todayRow] = await withDrizzle("stats.attemptsToday", () =>
      requireDb()
        .select({ total: count() })
        .from(questionAttempts)
        .where(
          and(
            eq(questionAttempts.userId, userId),
            eq(questionAttempts.fieldId, fieldId),
            gte(questionAttempts.createdAt, todayStart)
          )
        )
    );

    const [profile] = await withDrizzle("stats.profile", () =>
      requireDb()
        .select({ streak: learningProfiles.studyStreakDays })
        .from(learningProfiles)
        .where(eq(learningProfiles.userId, userId))
        .limit(1)
    );

    const total = Number(attemptRow?.total ?? 0);
    const correct = Number(attemptRow?.correct ?? 0);

    return {
      questionsAnswered: total,
      questionsToday: Number(todayRow?.total ?? 0),
      accuracyPct: total > 0 ? Math.round((correct / total) * 100) : 0,
      streakDays: profile?.streak ?? 0,
    };
  } catch {
    return EMPTY;
  }
}
