import type { ExamQuestion } from "@/lib/ai";

const PREFIX = "full-exam-payload:";

export type FullExamSessionPayload = {
  questions: ExamQuestion[];
  bankItemIds: string[];
};

export function stashFullExamSessionPayload(
  sessionId: string,
  payload: FullExamSessionPayload
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${PREFIX}${sessionId}`, JSON.stringify(payload));
  } catch {
    // Storage quota — simulator will fall back to the API.
  }
}

export function peekFullExamSessionPayload(sessionId: string): FullExamSessionPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${sessionId}`);
    if (!raw) return null;
    return JSON.parse(raw) as FullExamSessionPayload;
  } catch {
    return null;
  }
}

export function takeFullExamSessionPayload(sessionId: string): FullExamSessionPayload | null {
  const payload = peekFullExamSessionPayload(sessionId);
  if (!payload || typeof window === "undefined") return payload;
  try {
    sessionStorage.removeItem(`${PREFIX}${sessionId}`);
  } catch {
    // ignore
  }
  return payload;
}
