import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPostgresDatabaseUrl, resolveDatabaseUrl } from "@/lib/database-url";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { expandReviewFieldIds } from "@/lib/learning/review-queue-launch";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { getLearningProfileSnapshot } from "./profile-service";
import { applyRetentionDecay, computeReadinessScore } from "./mastery";
import { CACHE_TTL, cacheGetOrSet, cacheKey, CACHE_STALE } from "@/lib/cache";
import type { AnatomyStructureLink } from "@/lib/anatomy/topic-links";
import {
  formatConceptLabel,
  isInternalMasteryConceptKey,
  studentFacingConceptLabel,
  studentFacingSessionTitle,
} from "@/lib/learning/concept-labels";
import { getFieldMeta } from "@/lib/fields";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
import { loadFormatPracticeStats } from "@/lib/learning/format-practice-stats";
import {
  emptyFormatPracticeStats,
  type FormatPracticeStats,
} from "@/lib/study/practice-format";
import { mergeRecentTests, recentTestFromExamSession } from "@/lib/learning/recent-tests";

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

export type { FormatPracticeStats };

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
  formatPractice: FormatPracticeStats;
};

const TREND_DAYS = 14;
/** Over-fetch so we can drop generation-batch keys and still fill the UI. */
const WEAK_TOPIC_FETCH = 24;
const WEAK_TOPIC_DISPLAY = 6;

function subjectLabelForConcept(fieldId: string, conceptKey: string): string | null {
  const slug = conceptKey.replace(/^(tag|subject):/, "");
  try {
    return getSubjectsForFieldId(fieldId).find((s) => s.id === slug)?.label ?? null;
  } catch {
    return null;
  }
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
  const ids = expandReviewFieldIds(fieldIds);
  return ids.length > 0 ? { fieldId: { in: ids } } : {};
}

/** Student-facing trend days. Chicago, not UTC, so a late evening does not land on the next calendar day. */
export const PRACTICE_TREND_TIME_ZONE = "America/Chicago";

function namedCalendarDay(date: Date, utc: boolean): string {
  const year = utc ? date.getUTCFullYear() : date.getFullYear();
  const month = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
  const day = utc ? date.getUTCDate() : date.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isMidnight(date: Date, utc: boolean): boolean {
  if (utc) {
    return (
      date.getUTCHours() === 0 &&
      date.getUTCMinutes() === 0 &&
      date.getUTCSeconds() === 0 &&
      date.getUTCMilliseconds() === 0
    );
  }
  return (
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0 &&
    date.getMilliseconds() === 0
  );
}

export function trendDayKey(
  value: Date | string,
  timeZone = PRACTICE_TREND_TIME_ZONE
): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    const match = String(value).match(/(\d{4}-\d{2}-\d{2})/);
    return match?.[1] ?? String(value).slice(0, 10);
  }
  // A SQL date bucket arrives as midnight. Keep the day it names.
  if (isMidnight(date, false)) return namedCalendarDay(date, false);
  if (isMidnight(date, true)) return namedCalendarDay(date, true);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

function shiftDayKey(dayKey: string, delta: number): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const next = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  next.setUTCDate(next.getUTCDate() + delta);
  return next.toISOString().slice(0, 10);
}

/** UTC instant of the start of a Chicago calendar day. */
export function trendWindowStart(now = new Date(), days = TREND_DAYS): Date {
  const startKey = shiftDayKey(trendDayKey(now), -(days - 1));
  for (const offset of ["-06:00", "-05:00"]) {
    const candidate = new Date(`${startKey}T00:00:00${offset}`);
    if (trendDayKey(candidate) === startKey) return candidate;
  }
  return new Date(`${startKey}T06:00:00Z`);
}

/** Same percent the outline and analytics weak list show: correct ÷ attempts. */
export function weakAreaAccuracyPct(row: {
  attempts: number;
  correct: number;
  masteryScore: number;
}): number | null {
  if (row.attempts > 0) {
    return Math.round((row.correct / row.attempts) * 100);
  }
  const score = Math.round(row.masteryScore);
  return score > 0 ? score : null;
}

function buildTrendPoints(
  byDay: Map<string, { correct: number; total: number }>,
  now = new Date()
): AccuracyTrendPoint[] {
  const points: AccuracyTrendPoint[] = [];
  const today = trendDayKey(now);
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const key = shiftDayKey(today, -i);
    const entry = byDay.get(key);
    const [year, month, day] = key.split("-").map(Number);
    const labelDate = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12));
    points.push({
      date: key,
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(labelDate),
      accuracy: entry ? Math.round((entry.correct / entry.total) * 100) : null,
      attempts: entry?.total ?? 0,
    });
  }
  return points;
}

/** Pure 14-day series. Prior Chicago days stay in the list, and an evening attempt does not move to the next UTC day. */
export function accuracyTrendFromInstants(
  rows: Array<{ createdAt: Date | string; correct: boolean }>,
  now = new Date()
): AccuracyTrendPoint[] {
  const byDay = new Map<string, { correct: number; total: number }>();
  for (const row of rows) {
    const key = trendDayKey(row.createdAt);
    const entry = byDay.get(key) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (row.correct) entry.correct += 1;
    byDay.set(key, entry);
  }
  return buildTrendPoints(byDay, now);
}

async function getAccuracyTrendLegacy(
  userId: string,
  fieldIds: FieldScope
): Promise<AccuracyTrendPoint[]> {
  const since = trendWindowStart();

  const attempts = await prisma.questionAttempt.findMany({
    where: { userId, createdAt: { gte: since }, ...fieldWhere(fieldIds) },
    select: { correct: true, createdAt: true },
  });

  const byDay = new Map<string, { correct: number; total: number }>();
  for (const a of attempts) {
    const key = trendDayKey(a.createdAt);
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
  const since = trendWindowStart();

  const ids = expandReviewFieldIds(fieldIds);
  const fieldClause =
    ids.length > 0
      ? Prisma.sql`AND "fieldId" IN (${Prisma.join(ids)})`
      : Prisma.empty;

  const rows = await prisma.$queryRaw<
    { day: Date | string; total: number; correct: number }[]
  >(Prisma.sql`
    SELECT
      to_char(("createdAt" AT TIME ZONE 'America/Chicago'), 'YYYY-MM-DD') AS day,
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
    const key = trendDayKey(row.day);
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
  const ids = expandReviewFieldIds(fieldIds);
  const fieldClause =
    ids.length > 0
      ? Prisma.sql`AND "fieldId" IN (${Prisma.join(ids)})`
      : Prisma.empty;
  // One scan instead of two counts. connection_limit=1 would run those back to back.
  const rows = await prisma.$queryRaw<{ due_count: number; weak_due_count: number }[]>(
    Prisma.sql`
      SELECT
        COUNT(*) FILTER (WHERE "nextDue" <= ${now})::int AS due_count,
        COUNT(*) FILTER (
          WHERE "nextDue" <= ${now} AND "abilityEstimate" < 0.55
        )::int AS weak_due_count
      FROM "QuestionMastery"
      WHERE "userId" = ${userId}
        ${fieldClause}
    `
  );
  const row = rows[0];
  return {
    dueCount: Number(row?.due_count ?? 0),
    weakDueCount: Number(row?.weak_due_count ?? 0),
  };
}

function mapWeakTopics(
  masteries: {
    conceptKey: string;
    fieldId: string;
    masteryScore: number;
    attempts: number;
    correct?: number;
  }[]
): WeakTopicRow[] {
  const studentFacing = masteries
    .filter((m) => !isInternalMasteryConceptKey(m.conceptKey))
    .filter((m) => weakAreaAccuracyPct({ ...m, correct: m.correct ?? 0 }) != null)
    .slice(0, WEAK_TOPIC_DISPLAY);
  const weaknessWeights = studentFacing.map((m) => {
    const gap = Math.max(0, 100 - m.masteryScore);
    return { ...m, weight: gap * Math.sqrt(Math.max(m.attempts, 1)) };
  });
  const totalWeight = weaknessWeights.reduce((s, w) => s + w.weight, 0) || 1;

  return weaknessWeights.map((m) => {
    const name =
      studentFacingConceptLabel(m.conceptKey, {
        subjectLabel: subjectLabelForConcept(m.fieldId, m.conceptKey),
      }) ?? formatConceptLabel(m.conceptKey);
    return {
      id: m.conceptKey,
      name,
      fieldId: m.fieldId,
      masteryScore:
        weakAreaAccuracyPct({
          attempts: m.attempts,
          correct: m.correct ?? 0,
          masteryScore: m.masteryScore,
        }) ?? 0,
      attempts: m.attempts,
      weight: Math.round((m.weight / totalWeight) * 100),
    };
  });
}

/** Lightweight weak-topic fetch for question bank setup (skips trend/recent tests). */
export async function getStudentWeakTopics(
  userId: string,
  fieldIds: FieldScope = null
): Promise<WeakTopicRow[]> {
  const scopeKey = fieldIds?.length ? fieldIds.join(",") : "all";
  try {
    const { withDbRetry } = await import("@/lib/db");
    return await withDbRetry(
      () =>
        cacheGetOrSet(
          cacheKey(["weak-topics-v3", userId, scopeKey]),
          CACHE_TTL.learningDashboard,
          async () => {
            const masteries = await prisma.conceptMastery.findMany({
              where: { userId, ...fieldWhere(fieldIds) },
              orderBy: { masteryScore: "asc" },
              take: WEAK_TOPIC_FETCH,
            });
            return mapWeakTopics(masteries);
          }
        ),
      "weak-topics"
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
  fieldIds: FieldScope = null,
  opts?: { skipAccuracyTrend?: boolean; skipFormatPractice?: boolean }
): Promise<StudentDashboardData> {
  const scopeKey = fieldIds?.length ? fieldIds.join(",") : "all";
  const trendKey = opts?.skipAccuracyTrend ? "no-trend" : "trend";
  // Dashboard never reads format buckets. A separate key so an analytics
  // payload is not served in their place.
  const formatKey = opts?.skipFormatPractice ? "no-format" : "format";
  return cacheGetOrSet(
    cacheKey(["student-dashboard-v5", userId, scopeKey, trendKey, formatKey]),
    CACHE_TTL.learningDashboard,
    () => loadStudentDashboardData(userId, fieldIds, opts),
    { staleTtlMs: CACHE_STALE.learningDashboard, skipFreshL1: true }
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
type RecentExamJoinRow = {
  id: string;
  entityId: string;
  score: number | null;
  metadata: string | null;
  createdAt: Date;
  examTitle: string | null;
  examField: string | null;
  examQuestionCount: number | null;
};

async function loadStudentDashboardData(
  userId: string,
  fieldIds: FieldScope = null,
  opts?: { skipAccuracyTrend?: boolean; skipFormatPractice?: boolean }
): Promise<StudentDashboardData> {
  const scoped = Boolean(fieldIds && fieldIds.length > 0);
  const attemptScope = fieldWhere(fieldIds);
  const scopeSlug = scoped ? examSlugFromFieldId(fieldIds![0]) : null;

  const recentLimit = scoped ? 40 : 8;
  // One round trip. The old path loaded ProgressRecord, then GeneratedExam,
  // and the second query could not start until the first returned.
  const recentExamsPromise = prisma.$queryRaw<RecentExamJoinRow[]>`
    SELECT
      pr.id,
      pr."entityId",
      pr.score,
      pr.metadata,
      pr."createdAt",
      e.title AS "examTitle",
      e.field AS "examField",
      e."questionCount" AS "examQuestionCount"
    FROM "ProgressRecord" pr
    LEFT JOIN "Exam" e ON e.id = pr."entityId"
    WHERE pr."userId" = ${userId}
      AND pr."entityType" = 'exam'
      AND pr.completed = true
      AND pr.score IS NOT NULL
    ORDER BY pr."createdAt" DESC
    LIMIT ${recentLimit}
  `;

  const finishedExamSessionsPromise = prisma.examSession.findMany({
    where: {
      userId,
      status: { in: ["completed", "ended_early"] },
      ...(scoped && fieldIds
        ? {
            OR: [
              { fieldId: { in: fieldIds } },
              ...(scopeSlug ? [{ fieldId: null, examType: scopeSlug }] : []),
            ],
          }
        : {}),
    },
    orderBy: { completedAt: "desc" },
    take: 20,
    select: {
      id: true,
      examType: true,
      fieldId: true,
      title: true,
      score: true,
      questionCount: true,
      completedAt: true,
      answers: true,
    },
  });

  const [profile, trend, masteries, recentExamRows, finishedExamSessions, attemptGroups, spacedReview, formatPractice] =
    await Promise.all([
    // Slim profile — avoid loading every ConceptMastery row (weak topics load below).
    prisma.learningProfile.findUnique({
      where: { userId },
      select: { readinessScore: true, studyStreakDays: true },
    }),
    opts?.skipAccuracyTrend
      ? Promise.resolve([] as Awaited<ReturnType<typeof getAccuracyTrend>>)
      : getAccuracyTrend(userId, fieldIds),
    // Scoped: load full field masteries once for readiness + weak topics.
    // Global: only the weakest slice (readiness comes from LearningProfile).
    prisma.conceptMastery.findMany({
      where: { userId, ...fieldWhere(fieldIds) },
      orderBy: { masteryScore: "asc" },
      select: {
        conceptKey: true,
        fieldId: true,
        masteryScore: true,
        attempts: true,
        correct: true,
        retentionStrength: true,
        confidenceReliability: true,
        lastAttemptAt: true,
      },
      ...(scoped ? {} : { take: WEAK_TOPIC_FETCH }),
    }),
    recentExamsPromise,
    finishedExamSessionsPromise,
    prisma.questionAttempt.groupBy({
      by: ["correct"],
      where: { userId, ...attemptScope },
      _count: { _all: true },
    }),
    getSpacedReviewSummary(userId, fieldIds),
    opts?.skipFormatPractice
      ? Promise.resolve(emptyFormatPracticeStats())
      : loadFormatPracticeStats(userId, fieldIds),
  ]);

  const { totalAttempts, correctCount } = sumAttemptCounts(attemptGroups);

  // Recent sessions live in ProgressRecord (no fieldId) → match through the
  // generated exam's field so a scoped view only shows the selected exam.
  function recordInScope(row: RecentExamJoinRow): boolean {
    if (!scoped) return true;
    if (!row.examField) return false;
    const field = normalizeFieldId(row.examField);
    if (fieldIds!.includes(field)) return true;
    if (scopeSlug && examSlugFromFieldId(field) === scopeSlug) return true;
    return Boolean(scopeSlug && row.examField === scopeSlug);
  }

  const weakTopics = mapWeakTopics(masteries);

  const progressTests: RecentTestRow[] = recentExamRows
    .filter((row) => recordInScope(row))
    .map((row) => {
    let correct: number | null = null;
    let total: number | null = null;
    if (row.metadata) {
      try {
        const meta = JSON.parse(row.metadata) as { correct?: number; total?: number };
        if (typeof meta.correct === "number") correct = meta.correct;
        if (typeof meta.total === "number") total = meta.total;
      } catch {
        /* ignore */
      }
    }
    const fieldRaw = row.examField ?? "General";
    const fieldLabel = getFieldMeta(fieldRaw)?.label ?? fieldRaw;
    return {
      id: row.id,
      examId: row.entityId,
      title: studentFacingSessionTitle(row.examTitle, {
        fieldLabel,
        fallback: "Practice exam",
      }),
      field: fieldRaw,
      score: Math.round(row.score ?? 0),
      correct,
      total: total ?? row.examQuestionCount ?? null,
      completedAt: row.createdAt.toISOString(),
    };
  });

  const recentTests = mergeRecentTests(
    progressTests,
    finishedExamSessions.map((row) => recentTestFromExamSession(row)),
    20
  );

  const overallAccuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : null;

  const trendDelta = opts?.skipAccuracyTrend ? null : computeTrendDelta(trend);

  // Scoped readiness uses the same formula as LearningProfile (field-filtered).
  const scopedReadiness = (() => {
    if (!scoped) return Math.round(profile?.readinessScore ?? 0);
    return computeReadinessScore(
      masteries.map((m) => ({
        masteryScore: applyRetentionDecay(m.masteryScore, m.lastAttemptAt),
        retentionStrength: m.retentionStrength,
        confidenceReliability: m.confidenceReliability,
        attempts: m.attempts,
      }))
    );
  })();

  return {
    headline: {
      readinessScore: scopedReadiness,
      studyStreakDays: profile?.studyStreakDays ?? 0,
      overallAccuracy,
      totalAttempts,
      trendDelta,
      motivationalMessage: buildMotivationalMessage(
        profile?.studyStreakDays ?? 0,
        trendDelta,
        overallAccuracy
      ),
    },
    accuracyTrend: trend,
    weakTopics,
    recentTests,
    spacedReview,
    formatPractice,
  };
}
