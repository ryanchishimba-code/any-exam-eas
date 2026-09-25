import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { isBlueprintAreaId } from "@/lib/inventory/blueprint-domain-pool";
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

  const blueprintArea = next.get("blueprintArea");
  if (blueprintArea && !isBlueprintAreaId(fieldId, blueprintArea)) {
    next.delete("blueprintArea");
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
  /**
   * A topic the student picked on this visit before the URL caught up.
   * Not a remembered topic and not a coverage lead.
   */
  explicitSubjectId: string | null;
};

/**
 * Topic to show when the bank opens.
 *
 * No valid subjectId means Mixed topics. An untouched or low-coverage chip
 * stays a suggestion. A valid subjectId, or a topic picked in this visit,
 * is kept. Callers must not write the automatic Mixed choice into the URL.
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

  const picked = input.explicitSubjectId;
  if (
    !subjectParam &&
    picked &&
    (picked === MIXED_SUBJECT_ID || input.subjectIds.includes(picked))
  ) {
    return picked;
  }

  return MIXED_SUBJECT_ID;
}

/**
 * Subject written onto the question-bank URL.
 * An automatic Mixed opening is omitted. An explicit pick, or a subject
 * already on the URL, is kept. A blueprint-area pick replaces the subject.
 */
export function subjectIdForPracticeUrl(input: {
  fieldId: string;
  overrideProvided: boolean;
  override?: string | null;
  browserSubjectId: string | null;
  blueprintAreaId: string | null;
}): string | null {
  if (input.blueprintAreaId) return null;
  if (input.overrideProvided) {
    const value = input.override?.trim() || null;
    if (!value || !subjectIdBelongsToField(input.fieldId, value)) return null;
    return value;
  }
  const browser = input.browserSubjectId?.trim() || null;
  if (browser && subjectIdBelongsToField(input.fieldId, browser)) return browser;
  return null;
}

/** Value equality, ignoring parameter order. */
export function questionBankQueriesMatch(a: URLSearchParams, b: URLSearchParams): boolean {
  const keys = new Set<string>([...a.keys(), ...b.keys()]);
  for (const key of keys) {
    if ((a.get(key) ?? null) !== (b.get(key) ?? null)) return false;
  }
  return true;
}
