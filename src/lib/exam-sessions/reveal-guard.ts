import {
  getExamSession,
  listRecentlyTouchedInProgressSessions,
} from "@/lib/exam-sessions/service";
import {
  EXAM_REVEAL_IDLE_MS,
  activeExamContainsItem,
  decideExamReveal,
  isUnfinishedExamActive,
  sessionContainsItem,
  type ExamRevealDecision,
} from "@/lib/exam-sessions/reveal-policy";

/**
 * Withhold when the item sits in any active exam this user owns.
 * The lookup is an index range on (userId, status, updatedAt) for the last
 * 24 hours — see listRecentlyTouchedInProgressSessions. Omitting the session
 * id does not skip that check.
 */
export async function guardExamReveal(
  userId: string,
  itemId: string,
  sessionId?: string | null,
  now: Date = new Date()
): Promise<ExamRevealDecision> {
  const since = new Date(now.getTime() - EXAM_REVEAL_IDLE_MS);
  const recent = await listRecentlyTouchedInProgressSessions(userId, since);
  const inActiveExam = activeExamContainsItem(recent, itemId, now);

  const requestedId = typeof sessionId === "string" ? sessionId.trim() : "";
  if (!requestedId) {
    return decideExamReveal({
      sessionRequested: false,
      ownedSession: null,
      activeSessionContainsItem: inActiveExam,
      now,
    });
  }
  const owned = await getExamSession(requestedId, userId);
  if (!owned) {
    return decideExamReveal({
      sessionRequested: true,
      ownedSession: null,
      activeSessionContainsItem: inActiveExam,
      now,
    });
  }
  const containsItem = sessionContainsItem(owned.analysis, itemId);
  return decideExamReveal({
    sessionRequested: true,
    ownedSession: {
      status: owned.status,
      containsItem,
      updatedAt: owned.updatedAt,
      startedAt: owned.startedAt,
      timeLimitSec: owned.timeLimitSec,
    },
    activeSessionContainsItem:
      inActiveExam || (containsItem && isUnfinishedExamActive(owned, now)),
    now,
  });
}

/** Drop ids that belong to one of this user's active exams. One indexed read. */
export async function omitItemsInActiveExams(userId: string, itemIds: string[]): Promise<string[]> {
  if (itemIds.length === 0) return itemIds;
  const now = new Date();
  const since = new Date(now.getTime() - EXAM_REVEAL_IDLE_MS);
  const recent = await listRecentlyTouchedInProgressSessions(userId, since);
  return itemIds.filter((itemId) => !activeExamContainsItem(recent, itemId, now));
}
