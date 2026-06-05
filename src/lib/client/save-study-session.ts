import type { StudyQuestion, StudySessionState } from "@/lib/questions/types";
import { summarizeSession } from "@/lib/questions/session-engine";

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
