/**
 * ExamInstance — typed view over ExamSession rows used by Full Exam + Roadmap.
 * Backed by exam_sessions; no separate Prisma model.
 */

import type { FullExamLaunchMode } from "@/lib/full-exam/launch-modes";
import type { ExamSlug } from "@/types/edtech";
import {
  createExamSession,
  getExamSession,
  listUserExamSessions,
} from "@/lib/exam-sessions/service";

export type ExamInstanceAnalysis = {
  sessionConfig?: Record<string, unknown>;
  prefetchedQuestionIds?: string[];
  assembleSource?: string;
  launchMode?: FullExamLaunchMode;
  focusAreas?: string[];
  excludeSeenApplied?: boolean;
  retakeOfSessionId?: string;
};

export type ExamInstance = {
  id: string;
  userId: string;
  examType: ExamSlug | string;
  fieldId: string | null;
  title: string | null;
  status: string;
  score: number | null;
  questionCount: number;
  timeLimitSec: number | null;
  startedAt: Date;
  completedAt: Date | null;
  analysis: ExamInstanceAnalysis | null;
  weakAreas: unknown;
};

export function parseExamInstanceAnalysis(raw: unknown): ExamInstanceAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as ExamInstanceAnalysis;
}

export function getPrefetchedQuestionIds(analysis: unknown): string[] {
  const parsed = parseExamInstanceAnalysis(analysis);
  const ids = parsed?.prefetchedQuestionIds;
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
}

/** Create a Full Exam session with launch metadata stored on analysis. */
export async function createExamInstance(
  userId: string,
  examType: ExamSlug,
  opts: {
    questionCount: number;
    timeLimitSec?: number | null;
    title?: string;
    fieldId?: string;
    sessionConfig?: Record<string, unknown>;
    prefetchedQuestionIds?: string[];
    assembleSource?: string;
    launchMode?: FullExamLaunchMode;
    focusAreas?: string[];
    excludeSeenApplied?: boolean;
    retakeOfSessionId?: string;
  }
): Promise<string> {
  return createExamSession(userId, examType, {
    questionCount: opts.questionCount,
    timeLimitSec: opts.timeLimitSec,
    title: opts.title,
    fieldId: opts.fieldId,
    sessionConfig: opts.sessionConfig,
    prefetchedQuestionIds: opts.prefetchedQuestionIds,
    assembleSource: opts.assembleSource,
    launchMode: opts.launchMode,
    focusAreas: opts.focusAreas,
    excludeSeenApplied: opts.excludeSeenApplied,
    retakeOfSessionId: opts.retakeOfSessionId,
  });
}

export async function loadExamInstance(
  sessionId: string,
  userId: string
): Promise<ExamInstance | null> {
  const row = await getExamSession(sessionId, userId);
  if (!row) return null;
  return {
    id: row.id,
    userId: row.userId,
    examType: row.examType,
    fieldId: row.fieldId,
    title: row.title,
    status: row.status,
    score: row.score,
    questionCount: row.questionCount,
    timeLimitSec: row.timeLimitSec,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    analysis: parseExamInstanceAnalysis(row.analysis),
    weakAreas: row.weakAreas,
  };
}

export async function listExamInstances(
  userId: string,
  examType?: ExamSlug | string,
  limit = 30
): Promise<ExamInstance[]> {
  const rows = await listUserExamSessions(userId, examType, limit);
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    examType: row.examType,
    fieldId: row.fieldId,
    title: row.title,
    status: row.status,
    score: row.score,
    questionCount: row.questionCount,
    timeLimitSec: row.timeLimitSec,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    analysis: parseExamInstanceAnalysis(row.analysis),
    weakAreas: row.weakAreas,
  }));
}
