/**
 * Whether a reveal route may return keys and explanations.
 * An in-progress exam keeps every item in that sitting hidden until it is finished.
 * Practice reveals stay immediate when the item is not in an active exam.
 */
import { canonicalStoredQuestionKey } from "@/lib/assessment/serve";

export type ExamRevealDecision = "allow" | "withhold" | "not_owner";

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

export function decideExamReveal(input: {
  /** Caller named a session. A session they do not own is not a practice reveal. */
  sessionRequested: boolean;
  ownedSession: { status: string; containsItem: boolean } | null;
  /** Item sits in some other in-progress exam this user owns. */
  activeSessionContainsItem: boolean;
}): ExamRevealDecision {
  if (input.sessionRequested) {
    if (!input.ownedSession) return "not_owner";
    if (input.ownedSession.status === "in_progress" && input.ownedSession.containsItem) {
      return "withhold";
    }
    if (input.activeSessionContainsItem) return "withhold";
    return "allow";
  }
  if (input.activeSessionContainsItem) return "withhold";
  return "allow";
}
