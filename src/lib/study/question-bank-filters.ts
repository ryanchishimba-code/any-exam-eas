import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

const MIXED_SUBJECT_IDS = new Set([MIXED_SUBJECT_ID, "mixed"]);

/**
 * True when `subjectId` is a topic on `fieldId`.
 * Mixed is board-agnostic. A subject from another board (physiology on AANP) is not.
 */
export function subjectIdBelongsToField(fieldId: string, subjectId: string): boolean {
  if (MIXED_SUBJECT_IDS.has(subjectId)) return true;
  return getSubjectsForFieldId(fieldId).some((subject) => subject.id === subjectId);
}

function isMpjeField(fieldId: string): boolean {
  return fieldId === "mpje" || fieldId.startsWith("mpje-") || fieldId.startsWith("mpje");
}

/**
 * Canonical question-bank query for one practice field.
 *
 * Sets `field` (and `mode=bank` when missing) and drops filters that belong to
 * another board: a foreign `subjectId`, PANCE task, NCLEX length, MPJE state.
 * Idempotent — a second pass matches the first.
 */
export function canonicalizeQuestionBankQuery(
  fieldId: string,
  search: URLSearchParams
): URLSearchParams {
  const next = new URLSearchParams(search.toString());
  next.set("field", fieldId);
  if (!next.get("mode")) next.set("mode", "bank");

  const subjectId = next.get("subjectId");
  if (subjectId && !subjectIdBelongsToField(fieldId, subjectId)) {
    next.delete("subjectId");
  }

  if (fieldId !== "pance") next.delete("taskCategory");
  if (fieldId !== "nursing") next.delete("nclexLength");
  if (!isMpjeField(fieldId)) {
    next.delete("mpjeState");
    next.delete("mpjeVariant");
    next.delete("state");
  }

  return next;
}

/**
 * Field the question-bank page should show.
 *
 * An explicit practice field in the URL wins over the saved board for this
 * page only. The saved preference is the fallback when the URL has no field
 * or names something that is not a practice field. This does not change the
 * saved exam.
 */
export function questionBankPageFieldId(
  requestedFieldId: string | null,
  savedFieldId: string
): string {
  if (requestedFieldId && isPracticeFieldId(requestedFieldId)) return requestedFieldId;
  return savedFieldId;
}

/**
 * Href to replace with, or null when the query is already canonical.
 * Drops a subject that does not belong to the page field. Does not replace
 * an explicit field with the saved board.
 */
export function canonicalQuestionBankHref(
  pathname: string,
  search: URLSearchParams,
  savedFieldId: string,
  requestedFieldId: string | null
): string | null {
  const fieldId = questionBankPageFieldId(requestedFieldId, savedFieldId);
  const canonical = canonicalizeQuestionBankQuery(fieldId, search);
  if (questionBankQueriesMatch(search, canonical)) return null;
  const qs = canonical.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export type PracticeSubjectChoice = {
  fieldId: string;
  subjectIds: readonly string[];
  subjectParam: string | null;
  /** Used only so `subjectId=mixed` on review-incorrect stays all topics. */
  styleParam: string | null;
  persistedSubjectId: string | null;
  coverageLeadSubjectId: string | null;
  preferWeak: boolean;
  weakSubjectId: string | null;
};

/**
 * Topic to show when the bank opens.
 *
 * A subject from another board is not a selection: return mixed (all topics),
 * never the first blueprint domain. A blank URL may still restore a remembered
 * topic or a coverage lead in the UI. Callers must not write that automatic
 * choice back into the address bar — a stripped stale link would otherwise
 * become `subjectId=<first domain>`.
 */
export function resolvePracticeSubjectId(input: PracticeSubjectChoice): string {
  if (input.subjectIds.length === 0) return "";

  const { subjectParam, styleParam } = input;
  if (
    subjectParam === MIXED_SUBJECT_ID ||
    (subjectParam === "mixed" && styleParam === "review_incorrect")
  ) {
    return MIXED_SUBJECT_ID;
  }
  if (subjectParam && !subjectIdBelongsToField(input.fieldId, subjectParam)) {
    return MIXED_SUBJECT_ID;
  }
  if (subjectParam && input.subjectIds.includes(subjectParam)) {
    return subjectParam;
  }

  const persisted = input.persistedSubjectId;
  if (
    !subjectParam &&
    persisted &&
    (persisted === MIXED_SUBJECT_ID || input.subjectIds.includes(persisted))
  ) {
    return persisted;
  }

  if (
    input.coverageLeadSubjectId &&
    input.subjectIds.includes(input.coverageLeadSubjectId)
  ) {
    return input.coverageLeadSubjectId;
  }

  if (input.preferWeak && input.weakSubjectId && input.subjectIds.includes(input.weakSubjectId)) {
    return input.weakSubjectId;
  }

  return MIXED_SUBJECT_ID;
}

/** Value equality, ignoring parameter order. */
export function questionBankQueriesMatch(a: URLSearchParams, b: URLSearchParams): boolean {
  const keys = new Set<string>([...a.keys(), ...b.keys()]);
  for (const key of keys) {
    if ((a.get(key) ?? null) !== (b.get(key) ?? null)) return false;
  }
  return true;
}
