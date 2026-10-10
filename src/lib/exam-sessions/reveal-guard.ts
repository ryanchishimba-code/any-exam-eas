import { getExamSession, listInProgressExamSessions } from "@/lib/exam-sessions/service";
import {
  decideExamReveal,
  sessionContainsItem,
  sessionItemIds,
  type ExamRevealDecision,
} from "@/lib/exam-sessions/reveal-policy";
import { canonicalStoredQuestionKey } from "@/lib/assessment/serve";

export async function guardExamReveal(
  userId: string,
  itemId: string,
  sessionId?: string | null
): Promise<ExamRevealDecision> {
  const requested = typeof sessionId === "string" && sessionId.trim().length > 0;
  const owned = requested ? await getExamSession(sessionId!.trim(), userId) : null;
  const active = await listInProgressExamSessions(userId);
  const activeSessionContainsItem = active.some((session) => {
    if (owned && session.id === owned.id) return false;
    return sessionContainsItem(session.analysis, itemId);
  });
  return decideExamReveal({
    sessionRequested: requested,
    ownedSession: owned
      ? {
          status: owned.status,
          containsItem: sessionContainsItem(owned.analysis, itemId),
        }
      : null,
    activeSessionContainsItem,
  });
}

/** Catalog ids currently inside this user's unfinished exams. */
export async function activeExamCanonicalIds(userId: string): Promise<Set<string>> {
  const sessions = await listInProgressExamSessions(userId);
  const ids = new Set<string>();
  for (const session of sessions) {
    for (const id of sessionItemIds(session.analysis)) {
      ids.add(id);
      ids.add(canonicalStoredQuestionKey(id));
    }
  }
  return ids;
}
