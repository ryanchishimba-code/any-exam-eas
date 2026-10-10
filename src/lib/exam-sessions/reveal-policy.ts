/**
 * Whether a reveal route may return keys and explanations.
 * Withhold only for the exam session the caller names, and only while that
 * sitting is still active. Practice (no session id) is never blocked by
 * another unfinished exam. Exam-mode reveal has to send that session id.
 */
import { canonicalStoredQuestionKey } from "@/lib/assessment/serve";

export type ExamRevealDecision = "allow" | "withhold" | "not_owner";

/** An in-progress sitting nobody has touched for this long is not active. */
export const EXAM_REVEAL_IDLE_MS = 24 * 60 * 60 * 1000;

export function sessionItemIds(analysis: unknown): string[] {
  if (!analysis || typeof analysis !== "object") return [];
  const record = analysis as {
    prefetchedQuestionIds?: unknown;
    questionSnapshots?: unknown;
  };
  const ids: string[] = [];
  if (Array.isArray(record.prefetchedQuestionIds)) {
    for (const id of record.prefetchedQuestionIds) {
      if (typeof id === "string" && id.trim()) ids.push(id.trim());
    }
  }
  if (Array.isArray(record.questionSnapshots)) {
    for (const row of record.questionSnapshots) {
      if (!row || typeof row !== "object") continue;
      const id = (row as { id?: unknown }).id;
      if (typeof id === "string" && id.trim()) ids.push(id.trim());
    }
  }
  return ids;
}

function identityKeys(itemId: string): Set<string> {
  const keys = new Set<string>();
  const trimmed = itemId.trim();
  if (!trimmed) return keys;
  keys.add(trimmed);
  keys.add(canonicalStoredQuestionKey(trimmed));
  return keys;
}

/** True when the stored sitting includes this browser id or its catalog id. */
export function sessionContainsItem(analysis: unknown, itemId: string): boolean {
  const wanted = identityKeys(itemId);
  if (wanted.size === 0) return false;
  for (const id of sessionItemIds(analysis)) {
    if (wanted.has(id)) return true;
    const canonical = canonicalStoredQuestionKey(id);
    if (wanted.has(canonical)) return true;
  }
  return false;
}

function toMs(value: Date | string | number | null | undefined): number | null {
  if (value == null) return null;
  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : null;
}

export type ExamActivity = {
  status: string;
  updatedAt?: Date | string | number | null;
  startedAt?: Date | string | number | null;
  timeLimitSec?: number | null;
};

/**
 * True while the sitting is unfinished, was touched within 24 hours, and
 * its allotted time has not run out. Finished, idle, and overtime sittings
 * are reviewable.
 */
export function isUnfinishedExamActive(session: ExamActivity, now: Date = new Date()): boolean {
  if (session.status !== "in_progress") return false;
  const updatedMs = toMs(session.updatedAt);
  if (updatedMs != null && now.getTime() - updatedMs > EXAM_REVEAL_IDLE_MS) return false;
  const startedMs = toMs(session.startedAt);
  const limit = session.timeLimitSec;
  if (startedMs != null && typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
    if (now.getTime() >= startedMs + limit * 1000) return false;
  }
  return true;
}

export function decideExamReveal(input: {
  /** Exam-mode reveal sends the session id. Omitting it is practice. */
  sessionRequested: boolean;
  ownedSession: (ExamActivity & { containsItem: boolean }) | null;
  now?: Date;
}): ExamRevealDecision {
  if (!input.sessionRequested) return "allow";
  if (!input.ownedSession) return "not_owner";
  if (!input.ownedSession.containsItem) return "allow";
  if (!isUnfinishedExamActive(input.ownedSession, input.now ?? new Date())) return "allow";
  return "withhold";
}
