import type { StudyQuestion, StudySessionState } from "./types";

const PREFIX = "aee-study-v1";

export function persistSessionLocally(
  session: StudySessionState,
  questions: StudyQuestion[]
): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${PREFIX}:${session.sessionId}`;
    window.localStorage.setItem(
      key,
      JSON.stringify({ session, questions, savedAt: Date.now() })
    );
  } catch {
    /* quota or private mode */
  }
}

export function loadSessionLocally(
  sessionId: string
): { session: StudySessionState; questions: StudyQuestion[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${sessionId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      session: StudySessionState;
      questions: StudyQuestion[];
    };
    return parsed;
  } catch {
    return null;
  }
}

export function clearSessionLocally(sessionId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(`${PREFIX}:${sessionId}`);
  } catch {
    /* ignore */
  }
}
