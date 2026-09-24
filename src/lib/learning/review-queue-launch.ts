/**
 * Board-generic Review incorrect launch.
 *
 * Dashboard open-miss counts and the Review incorrect queue both use this
 * selector. A topic-scoped launch stays scoped when that topic still has
 * servable misses (NCLEX topic retests). An empty topic falls back to the
 * board-wide servable queue so the page cannot say the queue is empty while
 * the dashboard still shows a count.
 *
 * No exam-field branch. NAPLEX, NCLEX, and every other board share this rule.
 */

import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { USMLE_FIELD_ALIASES } from "@/lib/exam-prep/usmle/steps";
import {
  attemptItemId,
  selectReviewQueueIds,
  type MasteryAttempt,
  type MasteryMark,
} from "@/lib/learning/item-mastery";
import { FIELD_ID_ALIASES, normalizeFieldId } from "@/lib/subjects/field-ids";

const REVIEW_QUEUE_CAP = 300;

/** MPJE stays its own exam. Its rows are not PANCE attempts. */
const REVIEW_FIELD_EXCLUSIONS = new Set(["mpje"]);

/**
 * Stored attempt field ids for one practice board.
 * Built from the shared alias tables (NCLEX/nursing, NAPLEX/pharmacy,
 * USMLE step slugs such as usmle-step1, plus usmle/medicine → Step 2).
 * The raw request is kept so a label like "NAPLEX" still matches.
 */
function storedAliasesForCanonical(canonical: string): string[] {
  const ids = new Set<string>();
  for (const map of [FIELD_ID_ALIASES, USMLE_FIELD_ALIASES]) {
    for (const [alias, target] of Object.entries(map)) {
      if (REVIEW_FIELD_EXCLUSIONS.has(alias)) continue;
      if (target === canonical) ids.add(alias);
    }
  }
  return [...ids];
}

export function reviewFieldIdsForQuery(fieldId: string | null | undefined): string[] {
  const trimmed = fieldId?.trim() ?? "";
  if (!trimmed) return [];
  const canonical = normalizeFieldId(trimmed);
  const ids = new Set<string>([trimmed, canonical]);
  for (const alias of storedAliasesForCanonical(canonical)) ids.add(alias);
  return [...ids];
}

/** Union of reviewFieldIdsForQuery for every requested field. */
export function expandReviewFieldIds(
  fieldIds: readonly string[] | null | undefined
): string[] {
  if (!fieldIds || fieldIds.length === 0) return [];
  const ids = new Set<string>();
  for (const id of fieldIds) {
    for (const alias of reviewFieldIdsForQuery(id)) ids.add(alias);
  }
  return [...ids];
}

export function unscopedReviewSubject(subjectId: string | null | undefined): boolean {
  const subject = subjectId?.trim() ?? "";
  return !subject || subject === MIXED_SUBJECT_ID || subject === "mixed";
}

/** Subject sent to the review API. Empty and "mixed" stay board-wide. */
export function reviewSubjectForLaunch(subjectId: string | null | undefined): string {
  return unscopedReviewSubject(subjectId) ? MIXED_SUBJECT_ID : subjectId!.trim();
}

function applyServable(ids: string[], servableIds?: ReadonlySet<string> | null): string[] {
  if (!servableIds) return ids;
  return ids.filter((id) => servableIds.has(id));
}

/**
 * Ids the student can start.
 * `servableIds` is the active, qaPassed, practice-field inventory. Omit it
 * only in pure mastery checks; launch and dashboard counts pass it.
 */
export function selectLaunchReviewQueueIds(params: {
  attempts: MasteryAttempt[];
  marks?: MasteryMark[];
  subjectId?: string | null;
  limit?: number;
  now?: Date | string | number;
  servableIds?: ReadonlySet<string> | null;
}): string[] {
  const limit = Math.min(Math.max(params.limit ?? 100, 1), REVIEW_QUEUE_CAP);
  const ranked = (subjectId: string | null) =>
    applyServable(
      selectReviewQueueIds({
        attempts: params.attempts,
        marks: params.marks,
        subjectId,
        limit: REVIEW_QUEUE_CAP,
        now: params.now,
      }),
      params.servableIds
    );

  const board = ranked(null);
  if (unscopedReviewSubject(params.subjectId)) return board.slice(0, limit);

  const scoped = ranked(params.subjectId!.trim());
  const chosen = scoped.length > 0 ? scoped : board;
  return chosen.slice(0, limit);
}

/** Attempts whose bank identity is in the eligible review set. */
export function attemptsForReviewIds<
  T extends { bankItemId?: string | null; questionKey?: string | null },
>(attempts: T[], ids: readonly string[]): T[] {
  if (ids.length === 0) return [];
  const allowed = new Set(ids);
  return attempts.filter((row) => {
    const id = attemptItemId(row);
    return id != null && allowed.has(id);
  });
}
