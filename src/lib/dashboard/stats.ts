import { and, count, eq, gte, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { examSessions, learningProfiles, questionAttempts } from "@/db/schema";

export type DashboardQuickStats = {
  questionsAnswered: number;
  accuracyPercent: number | null;
  streakDays: number;
  weakAreas: { topic: string; weight: number }[];
};

const EMPTY_STATS: DashboardQuickStats = {
  questionsAnswered: 0,
  accuracyPercent: null,
  streakDays: 0,
  weakAreas: [],
};

export async function getDashboardQuickStats(userId: string): Promise<DashboardQuickStats> {
  try {
    const db = requireDb();
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);

    const [attemptRow] = await db
      .select({
        total: count(),
        correct: sql<number>`sum(case when ${questionAttempts.correct} then 1 else 0 end)::int`,
      })
      .from(questionAttempts)
      .where(and(eq(questionAttempts.userId, userId), gte(questionAttempts.createdAt, since)));

    const [profile] = await db
      .select({
        streak: learningProfiles.studyStreakDays,
        readiness: learningProfiles.readinessScore,
      })
      .from(learningProfiles)
      .where(eq(learningProfiles.userId, userId))
      .limit(1);

    const sessions = await db
      .select({ weakAreas: examSessions.weakAreas })
      .from(examSessions)
      .where(and(eq(examSessions.userId, userId), eq(examSessions.status, "completed")))
      .orderBy(sql`${examSessions.completedAt} desc`)
      .limit(5);

    const weakMap = new Map<string, number>();
    for (const s of sessions) {
      const areas = s.weakAreas as { topic?: string; weight?: number }[] | null;
      if (!Array.isArray(areas)) continue;
      for (const a of areas) {
        if (!a.topic) continue;
        weakMap.set(a.topic, (weakMap.get(a.topic) ?? 0) + (a.weight ?? 1));
      }
    }

    const weakAreas = [...weakMap.entries()]
      .map(([topic, weight]) => ({ topic, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    const total = Number(attemptRow?.total ?? 0);
    const correct = Number(attemptRow?.correct ?? 0);

    return {
      questionsAnswered: total,
      accuracyPercent: total > 0 ? Math.round((correct / total) * 100) : null,
      streakDays: profile?.streak ?? 0,
      weakAreas,
    };
  } catch {
    return EMPTY_STATS;
  }
}
