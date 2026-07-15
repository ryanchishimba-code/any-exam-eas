/**
 * Board-scoped push stats + exam history helpers.
 * Product names: UserPushStats / UserExamHistory — backed by QuestionAttempt + ExamSession.
 */

import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  getPrefetchedQuestionIds,
  type ExamInstance,
  listExamInstances,
} from "@/lib/full-exam/exam-instance";
import { prisma } from "@/lib/prisma";
import type { ExamSlug } from "@/types/edtech";

export type UserPushStats = {
  examSlug: ExamSlug;
  fieldId: string;
  /** Unique bank items (or keys) the user has pushed/attempted. */
  pushesCompleted: number;
  /** Active qaPassed serve items available on this board. */
  pushesAvailable: number;
  /** Unique-seen ÷ available (0–100). */
  coveragePct: number;
  attemptsTotal: number;
  correctTotal: number;
  accuracyPct: number;
  /** Distinct pushes completed per subjectId. */
  bySubject: Record<string, { seen: number; available: number; coveragePct: number }>;
};

export type UserExamHistory = {
  examSlug: ExamSlug;
  fieldId: string;
  sessions: ExamInstance[];
  lastCompleted: ExamInstance | null;
  inProgress: ExamInstance | null;
  hasRetake: boolean;
  canContinue: boolean;
};

export function computeCoveragePct(seen: number, available: number): number {
  if (available <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (seen / available) * 100)));
}

export function resolveProgressFieldId(
  examSlug: ExamSlug,
  fieldId?: string
): string {
  if (fieldId) return fieldId;
  return EXAM_CATALOG[examSlug].fieldId;
}

function attemptKey(row: {
  bankItemId?: string | null;
  questionKey?: string | null;
}): string | null {
  if (row.bankItemId) return row.bankItemId;
  if (row.questionKey) return row.questionKey;
  return null;
}

/** Serve-bank counts per subject for a field (same filter as topic practice). */
export async function countServeBankBySubject(
  fieldId: string
): Promise<Map<string, number>> {
  const { getSubjectServedCounts } = await import("@/lib/question-bank-db");
  const counts = await getSubjectServedCounts(fieldId);
  return new Map(Object.entries(counts));
}

/** Distinct bank items / keys the user has attempted, by subject. */
export async function countUserSeenBySubject(
  userId: string,
  fieldId: string
): Promise<Map<string, number>> {
  const rows = await prisma.questionAttempt.findMany({
    where: { userId, fieldId },
    select: { subjectId: true, bankItemId: true, questionKey: true },
  });

  const perSubject = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!row.subjectId) continue;
    const key = attemptKey(row);
    if (!key) continue;
    const set = perSubject.get(row.subjectId) ?? new Set<string>();
    set.add(key);
    perSubject.set(row.subjectId, set);
  }

  const map = new Map<string, number>();
  for (const [subjectId, set] of perSubject) {
    map.set(subjectId, set.size);
  }
  return map;
}

export async function getUserPushStats(
  userId: string,
  examSlug: ExamSlug,
  options?: { fieldId?: string }
): Promise<UserPushStats> {
  const fieldId = resolveProgressFieldId(examSlug, options?.fieldId);

  const [serveBySubject, seenBySubject, attempts] = await Promise.all([
    countServeBankBySubject(fieldId),
    countUserSeenBySubject(userId, fieldId),
    prisma.questionAttempt.findMany({
      where: { userId, fieldId },
      select: {
        correct: true,
        bankItemId: true,
        questionKey: true,
      },
    }),
  ]);

  let pushesAvailable = 0;
  for (const n of serveBySubject.values()) pushesAvailable += n;

  const bySubject: UserPushStats["bySubject"] = {};
  for (const [subjectId, available] of serveBySubject) {
    const seen = seenBySubject.get(subjectId) ?? 0;
    bySubject[subjectId] = {
      seen,
      available,
      coveragePct: computeCoveragePct(seen, available),
    };
  }

  const uniqueKeys = new Set<string>();
  let correctTotal = 0;
  for (const row of attempts) {
    if (row.correct) correctTotal += 1;
    const key = attemptKey(row);
    if (key) uniqueKeys.add(key);
  }

  const attemptsTotal = attempts.length;
  const pushesCompleted = uniqueKeys.size;

  return {
    examSlug,
    fieldId,
    pushesCompleted,
    pushesAvailable,
    coveragePct: computeCoveragePct(pushesCompleted, pushesAvailable),
    attemptsTotal,
    correctTotal,
    accuracyPct:
      attemptsTotal > 0 ? Math.round((correctTotal / attemptsTotal) * 100) : 0,
    bySubject,
  };
}

/** Sum subject coverage for a blueprint category's subjectIds. */
export function sumCategoryPushCoverage(
  subjectIds: string[] | undefined,
  bySubject: UserPushStats["bySubject"]
): { pushesCompleted: number; pushesAvailable: number; pushCoveragePct: number } {
  let seen = 0;
  let available = 0;
  for (const id of subjectIds ?? []) {
    const row = bySubject[id];
    if (!row) continue;
    seen += row.seen;
    available += row.available;
  }
  return {
    pushesCompleted: seen,
    pushesAvailable: available,
    pushCoveragePct: computeCoveragePct(seen, available),
  };
}

export async function getUserExamHistory(
  userId: string,
  examSlug: ExamSlug,
  options?: { fieldId?: string; limit?: number }
): Promise<UserExamHistory> {
  const fieldId = resolveProgressFieldId(examSlug, options?.fieldId);
  const sessions = await listExamInstances(userId, examSlug, options?.limit ?? 40);
  const scoped = fieldId
    ? sessions.filter((s) => !s.fieldId || s.fieldId === fieldId)
    : sessions;

  const lastCompleted =
    scoped.find((s) => s.status === "completed" || s.status === "ended_early") ?? null;
  const inProgress = scoped.find((s) => s.status === "in_progress") ?? null;

  return {
    examSlug,
    fieldId,
    sessions: scoped,
    lastCompleted,
    inProgress,
    hasRetake: Boolean(
      lastCompleted && getPrefetchedQuestionIds(lastCompleted.analysis).length > 0
    ),
    canContinue: Boolean(inProgress),
  };
}

/** Seen bank item IDs from attempts + recent exam sessions (capped). */
export async function loadSeenQuestionIds(
  userId: string,
  fieldId: string,
  opts?: { maxIds?: number }
): Promise<Set<string>> {
  const maxIds = opts?.maxIds ?? 4000;
  const seen = new Set<string>();

  const attemptRows = await prisma.questionAttempt.findMany({
    where: { userId, fieldId },
    select: { bankItemId: true, questionKey: true },
    orderBy: { createdAt: "desc" },
    take: maxIds,
  });

  for (const row of attemptRows) {
    const key = attemptKey(row);
    if (key) seen.add(key);
    if (seen.size >= maxIds) return seen;
  }

  const sessionRows = await prisma.examSession.findMany({
    where: { userId, fieldId },
    select: { analysis: true },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  for (const row of sessionRows) {
    for (const id of getPrefetchedQuestionIds(row.analysis)) {
      seen.add(id);
      if (seen.size >= maxIds) return seen;
    }
  }

  return seen;
}

/** Convenience for subject-scoped seen IDs. */
export async function loadSeenQuestionIdsForSubjects(
  userId: string,
  fieldId: string,
  subjectIds: string[]
): Promise<Set<string>> {
  if (!subjectIds.length) return loadSeenQuestionIds(userId, fieldId);
  const rows = await prisma.questionAttempt.findMany({
    where: { userId, fieldId, subjectId: { in: subjectIds } },
    select: { bankItemId: true, questionKey: true },
    take: 4000,
  });
  const seen = new Set<string>();
  for (const row of rows) {
    const key = attemptKey(row);
    if (key) seen.add(key);
  }
  return seen;
}
