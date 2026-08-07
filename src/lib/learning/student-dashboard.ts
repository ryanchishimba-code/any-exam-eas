import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPostgresDatabaseUrl, resolveDatabaseUrl } from "@/lib/database-url";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { getLearningProfileSnapshot } from "./profile-service";
import { CACHE_TTL, cacheGetOrSet, cacheKey, CACHE_STALE } from "@/lib/cache";
import type { AnatomyStructureLink } from "@/lib/anatomy/topic-links";

export type AccuracyTrendPoint = {
  date: string;
  label: string;
  accuracy: number | null;
  attempts: number;
};

export type WeakTopicStudyLinks = {
  deepDiveHref?: string;
  libraryHref: string;
  practiceHref: string;
  anatomyStructures: AnatomyStructureLink[];
};

export type WeakTopicRow = {
  id: string;
  name: string;
  fieldId: string;
  masteryScore: number;
  attempts: number;
  /** Share of total weakness weight (for pie chart). */
  weight: number;
  /** Precomputed on the server so client cards avoid importing seed bundles. */
  studyLinks?: WeakTopicStudyLinks;
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

export type SpacedReviewSummary = {
  dueCount: number;
  weakDueCount: number;
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
  spacedReview: SpacedReviewSummary;
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

/** Optional per-exam scope. When set, every query is filtered to these fields. */
type FieldScope = string[] | null;

function fieldWhere(fieldIds: FieldScope) {
  return fieldIds && fieldIds.length > 0 ? { fieldId: { in: fieldIds } } : {};
}

function buildTrendPoints(
  byDay: Map<string, { correct: number; total: number }>
): AccuracyTrendPoint[] {
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

async function getAccuracyTrendLegacy(
  userId: string,
  fieldIds: FieldScope
): Promise<AccuracyTrendPoint[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (TREND_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const attempts = await prisma.questionAttempt.findMany({
    where: { userId, createdAt: { gte: since }, ...fieldWhere(fieldIds) },
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

  return buildTrendPoints(byDay);
}

async function getAccuracyTrendSql(
  userId: string,
  fieldIds: FieldScope
): Promise<AccuracyTrendPoint[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (TREND_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const fieldClause =
    fieldIds && fieldIds.length > 0
      ? Prisma.sql`AND "fieldId" IN (${Prisma.join(fieldIds)})`
      : Prisma.empty;

  const rows = await prisma.$queryRaw<
    { day: Date; total: number; correct: number }[]
  >(Prisma.sql`
    SELECT
      (DATE("createdAt" AT TIME ZONE 'UTC')) AS day,
      COUNT(*)::int AS total,
      SUM(CASE WHEN "correct" THEN 1 ELSE 0 END)::int AS correct
    FROM "QuestionAttempt"
    WHERE "userId" = ${userId}
      AND "createdAt" >= ${since}
      ${fieldClause}
    GROUP BY 1
    ORDER BY 1
  `);

  const byDay = new Map<string, { correct: number; total: number }>();
  for (const row of rows) {
    const key =
      row.day instanceof Date
        ? row.day.toISOString().slice(0, 10)
        : String(row.day).slice(0, 10);
    byDay.set(key, { correct: row.correct, total: row.total });
  }

  return buildTrendPoints(byDay);
}

async function getAccuracyTrend(
  userId: string,
  fieldIds: FieldScope
): Promise<AccuracyTrendPoint[]> {
  const url = resolveDatabaseUrl();
  if (isPostgresDatabaseUrl(url)) {
    return getAccuracyTrendSql(userId, fieldIds);
  }
  return getAccuracyTrendLegacy(userId, fieldIds);
}

function sumAttemptCounts(
  groups: { correct: boolean; _count: { _all: number } }[]
): { totalAttempts: number; correctCount: number } {
  let totalAttempts = 0;
  let correctCount = 0;
  for (const group of groups) {
    totalAttempts += group._count._all;
    if (group.correct) correctCount += group._count._all;
  }
  return { totalAttempts, correctCount };
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

async function getSpacedReviewSummary(
  userId: string,
  fieldIds: FieldScope
): Promise<SpacedReviewSummary> {
  const now = new Date();
  const scope = fieldWhere(fieldIds);
  const [dueCount, weakDueCount] = await Promise.all([
    prisma.questionMastery.count({
      where: { userId, nextDue: { lte: now }, ...scope },
    }),
    prisma.questionMastery.count({
      where: {
        userId,
        nextDue: { lte: now },
        abilityEstimate: { lt: 0.55 },
        ...scope,
      },
    }),
  ]);
  return { dueCount, weakDueCount };
}

function mapWeakTopics(
  masteries: {
    conceptKey: string;
    fieldId: string;
    masteryScore: number;
    attempts: number;
  }[]
): WeakTopicRow[] {
  const weaknessWeights = masteries.map((m) => {
    const gap = Math.max(0, 100 - m.masteryScore);
    return { ...m, weight: gap * Math.sqrt(Math.max(m.attempts, 1)) };
  });
  const totalWeight = weaknessWeights.reduce((s, w) => s + w.weight, 0) || 1;

  return weaknessWeights.map((m) => ({
    id: m.conceptKey,
    name: formatConceptLabel(m.conceptKey),
    fieldId: m.fieldId,
    masteryScore: Math.round(m.masteryScore),
    attempts: m.attempts,
    weight: Math.round((m.weight / totalWeight) * 100),
  }));
}

/** Lightweight weak-topic fetch for question bank setup (skips trend/recent tests). */
export async function getStudentWeakTopics(
  userId: string,
  fieldIds: FieldScope = null
): Promise<WeakTopicRow[]> {
  const scopeKey = fieldIds?.length ? fieldIds.join(",") : "all";
  try {
    return await cacheGetOrSet(
      cacheKey(["weak-topics", userId, scopeKey]),
      CACHE_TTL.learningDashboard,
      async () => {
        const masteries = await prisma.conceptMastery.findMany({
          where: { userId, ...fieldWhere(fieldIds) },
          orderBy: { masteryScore: "asc" },
          take: 6,
        });
        return mapWeakTopics(masteries);
      }
    );
  } catch (error) {
    console.warn(
      "[getStudentWeakTopics] soft-fail:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

export async function getStudentDashboardData(
  userId: string,
  fieldIds: FieldScope = null
): Promise<StudentDashboardData> {
  const scopeKey = fieldIds?.length ? fieldIds.join(",") : "all";
  return cacheGetOrSet(
    cacheKey(["student-dashboard", userId, scopeKey]),
    CACHE_TTL.learningDashboard,
    () => loadStudentDashboardData(userId, fieldIds),
    { staleTtlMs: CACHE_STALE.learningDashboard }
  );
}

export type LibraryHubStats = {
  readinessScore: number;
  studyStreakDays: number;
  overallAccuracy: number | null;
  motivationalMessage: string;
};

/** Lightweight stats for the library hub — skips trend/recent-tests work. */
export async function getLibraryHubStats(
  userId: string,
  fieldIds: FieldScope = null
): Promise<LibraryHubStats> {
  const scopeKey = fieldIds?.length ? fieldIds.join(",") : "all";
  return cacheGetOrSet(
    cacheKey(["library-hub-stats", userId, scopeKey]),
    CACHE_TTL.learningDashboard,
    async () => {
      const scoped = Boolean(fieldIds && fieldIds.length > 0);
      const attemptScope = fieldWhere(fieldIds);

      const [profile, attemptGroups] = await Promise.all([
        getLearningProfileSnapshot(userId),
        prisma.questionAttempt.groupBy({
          by: ["correct"],
          where: { userId, ...attemptScope },
          _count: { _all: true },
        }),
      ]);
      const { totalAttempts, correctCount } = sumAttemptCounts(attemptGroups);
      const overallAccuracy =
        totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : null;

      const readinessScore = (() => {
        if (!scoped) return profile.readinessScore;
        const scores = profile.fieldReadiness
          .filter((f) => fieldIds!.includes(f.fieldId))
          .map((f) => f.score);
        if (scores.length === 0) return 0;
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      })();

      return {
        readinessScore,
        studyStreakDays: profile.studyStreakDays,
        overallAccuracy,
        motivationalMessage: buildMotivationalMessage(
          profile.studyStreakDays,
          null,
          overallAccuracy
        ),
      };
    },
    { staleTtlMs: CACHE_STALE.learningDashboard }
  );
}

/**
 * @param fieldIds Optional per-exam scope. When provided, every metric, trend,
 *   weak/strong topic, spaced-review count, recent session, and the readiness
 *   score is restricted to those study fields so analytics reflects only the
 *   selected exam. Omit (or pass null/empty) for the global, all-exam view.
 */
async function loadStudentDashboardData(
  userId: string,
  fieldIds: FieldScope = null
): Promise<StudentDashboardData> {
  const scoped = Boolean(fieldIds && fieldIds.length > 0);
  const attemptScope = fieldWhere(fieldIds);
  const scopeSlug = scoped ? examSlugFromFieldId(fieldIds![0]) : null;

  const [profile, trend, masteries, completedRecords, attemptGroups, spacedReview] =
    await Promise.all([
    getLearningProfileSnapshot(userId),
    getAccuracyTrend(userId, fieldIds),
    prisma.conceptMastery.findMany({
      where: { userId, ...fieldWhere(fieldIds) },
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
      take: scoped ? 40 : 8,
    }),
    prisma.questionAttempt.groupBy({
      by: ["correct"],
      where: { userId, ...attemptScope },
      _count: { _all: true },
    }),
    getSpacedReviewSummary(userId, fieldIds),
  ]);

  const { totalAttempts, correctCount } = sumAttemptCounts(attemptGroups);

  const examIds = completedRecords.map((r) => r.entityId);
  const exams =
    examIds.length > 0
      ? await prisma.generatedExam.findMany({
          where: { id: { in: examIds } },
          select: { id: true, title: true, field: true, questionCount: true },
        })
      : [];
  const examById = new Map(exams.map((e) => [e.id, e]));

  // Recent sessions live in ProgressRecord (no fieldId) → match through the
  // generated exam's field so a scoped view only shows the selected exam.
  function recordInScope(entityId: string): boolean {
    if (!scoped) return true;
    const exam = examById.get(entityId);
    if (!exam) return false;
    const field = normalizeFieldId(exam.field);
    if (fieldIds!.includes(field)) return true;
    if (scopeSlug && examSlugFromFieldId(field) === scopeSlug) return true;
    return Boolean(scopeSlug && exam.field === scopeSlug);
  }

  const weakTopics = mapWeakTopics(masteries);

  const recentTests: RecentTestRow[] = completedRecords
    .filter((r) => recordInScope(r.entityId))
    .slice(0, 8)
    .map((r) => {
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

  // Readiness for a scoped view is the mean of the in-scope per-field readiness
  // values (falls back to the global score when the field has no data yet).
  const scopedReadiness = (() => {
    if (!scoped) return profile.readinessScore;
    const scores = profile.fieldReadiness
      .filter((f) => fieldIds!.includes(f.fieldId))
      .map((f) => f.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  return {
    headline: {
      readinessScore: scopedReadiness,
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
    spacedReview,
  };
}
