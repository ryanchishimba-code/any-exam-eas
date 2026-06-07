import { and, desc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { examSessions } from "@/db/schema";
import { createId } from "@/lib/id";
import type { ExamSlug } from "@/lib/exams/catalog";
import { examSlugToFieldId } from "@/lib/exams/catalog";
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
  }
) {
  const db = requireDb();
  const id = createId();
  const now = new Date();
  await db.insert(examSessions).values({
    id,
    userId,
    examType,
    fieldId: opts?.fieldId ?? examSlugToFieldId(examType),
    title: opts?.title ?? `${examType.toUpperCase()} practice`,
    status: "in_progress",
    answers: [],
    analysis: opts?.sessionConfig ? { sessionConfig: opts.sessionConfig } : null,
    questionCount: opts?.questionCount ?? 0,
    timeLimitSec: opts?.timeLimitSec ?? null,
    startedAt: now,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function getExamSession(sessionId: string, userId: string) {
  const db = requireDb();
  const [row] = await db
    .select()
    .from(examSessions)
    .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)))
    .limit(1);
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

  const db = requireDb();
  await db
    .update(examSessions)
    .set({ answers: next, updatedAt: new Date() })
    .where(eq(examSessions.id, sessionId));

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
  const db = requireDb();
  const now = new Date();
  await db
    .update(examSessions)
    .set({
      status: payload.endedEarly ? "ended_early" : "completed",
      score: payload.score,
      weakAreas: payload.weakAreas,
      analysis: payload.analysis ?? null,
      completedAt: now,
      updatedAt: now,
    })
    .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)));
}

export async function listUserExamSessions(userId: string, examType?: string, limit = 30) {
  const db = requireDb();
  const conditions = examType
    ? and(eq(examSessions.userId, userId), eq(examSessions.examType, examType))
    : eq(examSessions.userId, userId);

  return db
    .select()
    .from(examSessions)
    .where(conditions)
    .orderBy(desc(examSessions.createdAt))
    .limit(limit);
}
