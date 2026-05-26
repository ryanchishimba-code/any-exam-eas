import {
  isAnswerCorrect,
  prepareQuestionsForSession,
} from "./prepare";
import type {
  ConfidenceLevel,
  RawQuestionInput,
  SessionAnswer,
  SessionSummary,
  StudyMode,
  StudyQuestion,
  StudySessionState,
} from "./types";

export function createStudySession(params: {
  questions: RawQuestionInput[];
  mode?: StudyMode;
  field: string;
  subjectId?: string;
  sourceType: StudySessionState["sourceType"];
  sourceId?: string;
  shuffleOrder?: boolean;
  timedSecondsPerQuestion?: number;
}): { session: StudySessionState; questions: StudyQuestion[] } {
  const prepared = prepareQuestionsForSession(params.questions, {
    shuffleOrder: params.shuffleOrder ?? true,
  });

  const sessionId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `sess-${Date.now()}`;

  const now = new Date().toISOString();
  const session: StudySessionState = {
    sessionId,
    mode: params.mode ?? "practice",
    field: params.field,
    subjectId: params.subjectId,
    sourceType: params.sourceType,
    sourceId: params.sourceId,
    order: prepared.map((q) => q.id),
    currentIndex: 0,
    answers: {},
    startedAt: now,
    updatedAt: now,
    timedSecondsPerQuestion:
      params.mode === "timed" ? (params.timedSecondsPerQuestion ?? 45) : undefined,
  };

  return { session, questions: prepared };
}

export function getQuestionByIndex(
  questions: StudyQuestion[],
  session: StudySessionState,
  index: number
): StudyQuestion | null {
  const id = session.order[index];
  if (!id) return null;
  return questions.find((q) => q.id === id) ?? null;
}

export function recordSessionAnswer(
  session: StudySessionState,
  question: StudyQuestion,
  selected: string[],
  opts?: { confidence?: ConfidenceLevel; durationMs?: number }
): StudySessionState {
  const correct = isAnswerCorrect(question, selected);
  const answers = {
    ...session.answers,
    [question.id]: {
      selected,
      revealed: true,
      correct,
      confidence: opts?.confidence,
      durationMs: opts?.durationMs,
    } satisfies SessionAnswer,
  };

  return {
    ...session,
    answers,
    updatedAt: new Date().toISOString(),
  };
}

export function advanceSession(
  session: StudySessionState,
  direction: 1 | -1 = 1
): StudySessionState {
  const next = Math.max(
    0,
    Math.min(session.order.length - 1, session.currentIndex + direction)
  );
  return { ...session, currentIndex: next, updatedAt: new Date().toISOString() };
}

export function summarizeSession(
  session: StudySessionState,
  questions: StudyQuestion[]
): SessionSummary {
  let answered = 0;
  let correct = 0;
  let confSum = 0;
  let confCount = 0;
  let durSum = 0;
  let durCount = 0;

  for (const q of questions) {
    const a = session.answers[q.id];
    if (!a?.revealed) continue;
    answered++;
    if (a.correct) correct++;
    if (a.confidence) {
      confSum += a.confidence;
      confCount++;
    }
    if (a.durationMs) {
      durSum += a.durationMs;
      durCount++;
    }
  }

  return {
    total: questions.length,
    answered,
    correct,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    avgConfidence: confCount > 0 ? Math.round((confSum / confCount) * 10) / 10 : null,
    avgDurationMs: durCount > 0 ? Math.round(durSum / durCount) : null,
  };
}

export function isSessionComplete(
  session: StudySessionState,
  questions: StudyQuestion[]
): boolean {
  return questions.every((q) => session.answers[q.id]?.revealed);
}
