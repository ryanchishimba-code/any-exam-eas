import { and, desc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { examSessions } from "@/db/schema";
import { createId } from "@/lib/id";
import type { ExamSlug } from "@/lib/exams/catalog";
import { examSlugToFieldId } from "@/lib/exams/catalog";
import { withDrizzle } from "@/lib/db-resilience";
import { mergeExamAnswers } from "./scoring";

export { mergeExamAnswers, calculateExamScorePercent } from "./scoring";

export type ExamAnswerRecord = {
  questionIndex: number;
  questionId?: string;
  selected: string;
  correct: boolean;
  flagged?: boolean;
  eliminated?: string[];
  notes?: string;
  topicCategory?: string;
  answeredAt: string;
};

export async function createExamSession(
  userId: string,
  examType: ExamSlug,
  opts?: {
    questionCount?: number;
    timeLimitSec?: number | null;
    title?: string;
    fieldId?: string;
    sessionConfig?: Record<string, unknown>;
    prefetchedQuestionIds?: string[];
    assembleSource?: string;
    /** Roadmap / Full Exam launch mode metadata (stored on analysis JSON). */
    launchMode?: string;
    focusAreas?: string[];
    excludeSeenApplied?: boolean;
    retakeOfSessionId?: string;
  }
) {
  const id = createId();
  const now = new Date();
  const hasMeta =
    opts?.sessionConfig ||
    opts?.prefetchedQuestionIds?.length ||
    opts?.assembleSource ||
    opts?.launchMode ||
    opts?.focusAreas?.length ||
    opts?.excludeSeenApplied != null ||
    opts?.retakeOfSessionId;
  const analysis = hasMeta
      ? {
          ...(opts?.sessionConfig ? { sessionConfig: opts.sessionConfig } : {}),
          ...(opts?.prefetchedQuestionIds?.length
            ? { prefetchedQuestionIds: opts.prefetchedQuestionIds }
            : {}),
          ...(opts?.assembleSource ? { assembleSource: opts.assembleSource } : {}),
          ...(opts?.launchMode ? { launchMode: opts.launchMode } : {}),
          ...(opts?.focusAreas?.length ? { focusAreas: opts.focusAreas } : {}),
          ...(opts?.excludeSeenApplied != null
            ? { excludeSeenApplied: opts.excludeSeenApplied }
            : {}),
          ...(opts?.retakeOfSessionId
            ? { retakeOfSessionId: opts.retakeOfSessionId }
            : {}),
        }
      : null;
  await withDrizzle("examSessions.create", () =>
    requireDb().insert(examSessions).values({
      id,
      userId,
      examType,
      fieldId: opts?.fieldId ?? examSlugToFieldId(examType),
      title: opts?.title ?? `${examType.toUpperCase()} practice`,
      status: "in_progress",
      answers: [],
      analysis,
      questionCount: opts?.questionCount ?? 0,
      timeLimitSec: opts?.timeLimitSec ?? null,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    })
  );
  return id;
}

export async function getExamSession(sessionId: string, userId: string) {
  const [row] = await withDrizzle("examSessions.get", () =>
    requireDb()
      .select()
      .from(examSessions)
      .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)))
      .limit(1)
  );
  return row ?? null;
}

export async function appendExamAnswer(
  sessionId: string,
  userId: string,
  answer: ExamAnswerRecord
) {
  const session = await getExamSession(sessionId, userId);
  if (!session || session.status !== "in_progress") return null;

  const answers = Array.isArray(session.answers)
    ? (session.answers as ExamAnswerRecord[])
    : [];
  const next = mergeExamAnswers(answers, answer);

  await withDrizzle("examSessions.appendAnswer", () =>
    requireDb()
      .update(examSessions)
      .set({ answers: next, updatedAt: new Date() })
      .where(eq(examSessions.id, sessionId))
  );

  return next;
}

export async function completeExamSession(
  sessionId: string,
  userId: string,
  payload: {
    score: number;
    weakAreas: { topic: string; weight: number }[];
    analysis?: unknown;
    endedEarly?: boolean;
  }
) {
  const now = new Date();
  await withDrizzle("examSessions.complete", () =>
    requireDb()
      .update(examSessions)
      .set({
        status: payload.endedEarly ? "ended_early" : "completed",
        score: payload.score,
        weakAreas: payload.weakAreas,
        analysis: payload.analysis ?? null,
        completedAt: now,
        updatedAt: now,
      })
      .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)))
  );
}

export async function listUserExamSessions(userId: string, examType?: string, limit = 30) {
  const conditions = examType
    ? and(eq(examSessions.userId, userId), eq(examSessions.examType, examType))
    : eq(examSessions.userId, userId);

  return withDrizzle("examSessions.listUser", () =>
    requireDb()
      .select()
      .from(examSessions)
      .where(conditions)
      .orderBy(desc(examSessions.createdAt))
      .limit(limit)
  );
}
