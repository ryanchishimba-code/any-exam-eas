import type { StudyQuestion, StudySessionState } from "@/lib/questions/types";
import { summarizeSession } from "@/lib/questions/session-engine";
import { draftsFromSession } from "@/lib/learning/session-attempt-plan";
import type { SessionReceipt } from "@/components/study/SessionCompletionCard";

export type SessionPersistReceipt = SessionReceipt & {
  persisted: true;
  fieldId: string;
  newlySaved: number;
  alreadySaved: number;
  answered: number;
};

export async function saveStudySessionRemote(params: {
  session: StudySessionState;
  questions: StudyQuestion[];
  completed?: boolean;
  endedEarly?: boolean;
}): Promise<void> {
  const { session, questions, completed = false, endedEarly = false } = params;
  const sessionPayload = endedEarly ? { ...session, endedEarly: true } : session;

  const res = await fetch("/api/study/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session: sessionPayload,
      questions,
      completed,
      score: summarizeSession(session, questions).accuracy,
    }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Could not save session progress.");
  }
}

const SAVE_FAILED = "Could not save this session. Analytics will stay empty until it saves.";

/** Idempotent end-of-session write. Throws unless every revealed answer was stored. */
export async function persistCompletedStudySession(params: {
  session: StudySessionState;
  questions: StudyQuestion[];
  completed?: boolean;
  endedEarly?: boolean;
}): Promise<SessionPersistReceipt> {
  const attempts = draftsFromSession(params.session, params.questions);
  const score = summarizeSession(params.session, params.questions).accuracy;
  const sessionPayload = params.endedEarly ? { ...params.session, endedEarly: true } : params.session;

  let data: Partial<SessionPersistReceipt> & { error?: string; persisted?: boolean } = {};
  try {
    const res = await fetch("/api/study/session/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: sessionPayload,
        attempts,
        completed: params.completed ?? false,
        endedEarly: params.endedEarly ?? false,
        score,
      }),
    });
    data = (await res.json().catch(() => ({}))) as typeof data;
    if (!res.ok || data.persisted !== true || data.attemptsSaved !== attempts.length) {
      console.error("[session-persist] completion UI blocked; persistence failed", {
        sessionId: params.session.sessionId,
        answered: attempts.length,
        attemptsSaved: data.attemptsSaved,
        status: res.status,
        error: data.error,
      });
      throw new Error(typeof data.error === "string" ? data.error : SAVE_FAILED);
    }
  } catch (error) {
    if (error instanceof Error && /save|Invalid session|Analytics/i.test(error.message)) {
      throw error;
    }
    console.error("[session-persist] completion UI blocked; persistence failed", {
      sessionId: params.session.sessionId,
      answered: attempts.length,
      error: error instanceof Error ? error.message : error,
    });
    throw new Error(SAVE_FAILED);
  }

  return data as SessionPersistReceipt;
}
