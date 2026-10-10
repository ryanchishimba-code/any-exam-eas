import { getExamSession } from "@/lib/exam-sessions/service";
import {
  decideExamReveal,
  sessionContainsItem,
  type ExamRevealDecision,
} from "@/lib/exam-sessions/reveal-policy";

/**
 * Exam-mode reveal must name the session. A request with no session id is
 * practice and is not compared against the caller's other unfinished exams.
 */
export async function guardExamReveal(
  userId: string,
  itemId: string,
  sessionId?: string | null
): Promise<ExamRevealDecision> {
  const requestedId = typeof sessionId === "string" ? sessionId.trim() : "";
  if (!requestedId) {
    return decideExamReveal({ sessionRequested: false, ownedSession: null });
  }
  const owned = await getExamSession(requestedId, userId);
  if (!owned) {
    return decideExamReveal({ sessionRequested: true, ownedSession: null });
  }
  return decideExamReveal({
    sessionRequested: true,
    ownedSession: {
      status: owned.status,
      containsItem: sessionContainsItem(owned.analysis, itemId),
      updatedAt: owned.updatedAt,
      startedAt: owned.startedAt,
      timeLimitSec: owned.timeLimitSec,
    },
  });
}
