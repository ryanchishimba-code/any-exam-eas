import { prisma } from "@/lib/prisma";
import { getLearningProfileSnapshot } from "./profile-service";

export type AccuracyTrendPoint = {
  date: string;
  label: string;
  accuracy: number | null;
  attempts: number;
};

export type WeakTopicRow = {
  id: string;
  name: string;
  fieldId: string;
  masteryScore: number;
  attempts: number;
  /** Share of total weakness weight (for pie chart). */
  weight: number;
};

export type RecentTestRow = {
  id: string;
  examId: string;
  title: string;
  field: string;
  score: number;
  correct: number | null;
  total: number | null;
  completedAt: string;
};

export type StudentDashboardData = {
  headline: {
    readinessScore: number;
    studyStreakDays: number;
    overallAccuracy: number | null;
    totalAttempts: number;
    trendDelta: number | null;
    motivationalMessage: string;
  };
  accuracyTrend: AccuracyTrendPoint[];
  weakTopics: WeakTopicRow[];
  recentTests: RecentTestRow[];
};

const TREND_DAYS = 14;

function formatConceptLabel(key: string): string {
  const raw = key.replace(/^(tag|subject):/, "").replace(/[-_]/g, " ");
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildMotivationalMessage(
  streak: number,
  trendDelta: number | null,
  overallAccuracy: number | null
): string {
  if (streak >= 7) return "A full week of consistency — keep building your study rhythm.";
  if (streak >= 3) return "Nice streak! Small daily sessions can add up over time.";
  if (trendDelta != null && trendDelta >= 8) return "Your in-app accuracy is trending up — keep practicing.";
  if (trendDelta != null && trendDelta <= -8) return "Practice scores dip sometimes — a focused review session may help.";
  if (overallAccuracy != null && overallAccuracy >= 80) return "Strong in-app accuracy — try a timed practice set.";
  if (overallAccuracy != null && overallAccuracy < 60) return "Every question is practice — weak-area review can help you learn.";
  return "One focused session today is a step in your prep journey.";
}

async function getAccuracyTrend(userId: string): Promise<AccuracyTrendPoint[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (TREND_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const attempts = await prisma.questionAttempt.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { correct: true, createdAt: true },
  });

  const byDay = new Map<string, { correct: number; total: number }>();
  for (const a of attempts) {
    const key = a.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(key) ?? { correct: 0, total: 0 };
    entry.total++;
    if (a.correct) entry.correct++;
    byDay.set(key, entry);
  }

  const points: AccuracyTrendPoint[] = [];
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    points.push({
      date: key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      accuracy: entry ? Math.round((entry.correct / entry.total) * 100) : null,
      attempts: entry?.total ?? 0,
    });
  }
  return points;
}

function computeTrendDelta(trend: AccuracyTrendPoint[]): number | null {
  const withData = trend.filter((p) => p.accuracy != null);
  if (withData.length < 4) return null;

  const mid = Math.floor(withData.length / 2);
  const first = withData.slice(0, mid);
  const second = withData.slice(mid);
  const avg = (pts: AccuracyTrendPoint[]) =>
    pts.reduce((s, p) => s + (p.accuracy ?? 0), 0) / pts.length;

  return Math.round(avg(second) - avg(first));
}

export async function getStudentDashboardData(userId: string): Promise<StudentDashboardData> {
  const [profile, trend, masteries, completedRecords, totalAttempts, correctCount] =
    await Promise.all([
    getLearningProfileSnapshot(userId),
    getAccuracyTrend(userId),
    prisma.conceptMastery.findMany({
      where: { userId },
      orderBy: { masteryScore: "asc" },
      take: 6,
    }),
    prisma.progressRecord.findMany({
      where: {
        userId,
        entityType: "exam",
        completed: true,
        score: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.questionAttempt.count({ where: { userId } }),
    prisma.questionAttempt.count({ where: { userId, correct: true } }),
  ]);

  const examIds = completedRecords.map((r) => r.entityId);
  const exams =
    examIds.length > 0
      ? await prisma.exam.findMany({
          where: { id: { in: examIds } },
          select: { id: true, title: true, field: true, questionCount: true },
        })
      : [];
  const examById = new Map(exams.map((e) => [e.id, e]));

  const weaknessWeights = masteries.map((m) => {
    const gap = Math.max(0, 100 - m.masteryScore);
    return { ...m, weight: gap * Math.sqrt(Math.max(m.attempts, 1)) };
  });
  const totalWeight = weaknessWeights.reduce((s, w) => s + w.weight, 0) || 1;

  const weakTopics: WeakTopicRow[] = weaknessWeights.map((m) => ({
    id: m.conceptKey,
    name: formatConceptLabel(m.conceptKey),
    fieldId: m.fieldId,
    masteryScore: Math.round(m.masteryScore),
    attempts: m.attempts,
    weight: Math.round((m.weight / totalWeight) * 100),
  }));

  const recentTests: RecentTestRow[] = completedRecords.map((r) => {
    const exam = examById.get(r.entityId);
    let correct: number | null = null;
    let total: number | null = null;
    if (r.metadata) {
      try {
        const meta = JSON.parse(r.metadata) as { correct?: number; total?: number };
        if (typeof meta.correct === "number") correct = meta.correct;
        if (typeof meta.total === "number") total = meta.total;
      } catch {
        /* ignore */
      }
    }
    return {
      id: r.id,
      examId: r.entityId,
      title: exam?.title ?? "Practice exam",
      field: exam?.field ?? "General",
      score: Math.round(r.score ?? 0),
      correct,
      total: total ?? exam?.questionCount ?? null,
      completedAt: r.createdAt.toISOString(),
    };
  });

  const overallAccuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : null;

  const trendDelta = computeTrendDelta(trend);

  return {
    headline: {
      readinessScore: profile.readinessScore,
      studyStreakDays: profile.studyStreakDays,
      overallAccuracy,
      totalAttempts,
      trendDelta,
      motivationalMessage: buildMotivationalMessage(
        profile.studyStreakDays,
        trendDelta,
        overallAccuracy
      ),
    },
    accuracyTrend: trend,
    weakTopics,
    recentTests,
  };
}
