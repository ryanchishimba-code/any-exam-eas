import { examSlugForFieldId, fieldMatchesExamSlug } from "@/lib/edtech/exam-field-ids";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { isOtherOpenSubject } from "@/lib/learning/other-open-subject";
import { isBlueprintAreaId } from "@/lib/inventory/blueprint-domain-pool";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
import { usmleBlueprintPracticeSlug } from "@/lib/exam-prep/usmle/blueprint-practice-subject";
import { usmleWeakAreaServedSubject } from "@/lib/exam-prep/usmle/weak-area-served-subject";

const MIXED_SUBJECT_IDS = new Set([MIXED_SUBJECT_ID, "mixed"]);

/**
 * True when `subjectId` is a topic on `fieldId`.
 * Mixed is board-agnostic. A subject from another board (physiology on AANP) is not.
 */
export function subjectIdBelongsToField(fieldId: string, subjectId: string): boolean {
  if (MIXED_SUBJECT_IDS.has(subjectId) || isOtherOpenSubject(subjectId)) return true;
  if (usmleBlueprintPracticeSlug(fieldId, subjectId)) return true;
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
  const blueprintSubject = subjectId ? usmleBlueprintPracticeSlug(fieldId, subjectId) : null;
  if (blueprintSubject) {
    const served = usmleWeakAreaServedSubject({ fieldId, topicKey: blueprintSubject });
    if (served) {
      next.set("subjectId", served.subjectId);
      if (served.blueprintTopics.length) {
        if (!next.get("blueprintTopics")) next.set("blueprintTopics", served.blueprintTopics.join(","));
        if (!next.get("usmleTopic")) next.set("usmleTopic", served.blueprintTopics[0]!);
      } else {
        if (next.get("blueprintTopics") === blueprintSubject) next.delete("blueprintTopics");
        if (next.get("usmleTopic") === blueprintSubject) next.delete("usmleTopic");
      }
      const style = next.get("style");
      if (!style || style === "adaptive") next.set("style", "standard");
    } else if (subjectId) {
      next.delete("subjectId");
    }
  } else if (subjectId && !subjectIdBelongsToField(fieldId, subjectId)) {
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
 * The saved account exam is the source of truth, same as the header chip.
 * A URL field from another board (PANCE while the account is NCLEX) is ignored
 * so practice does not call the API with a field the account cannot use.
 * A field on the same exam, including a USMLE step, is kept.
 */
export function questionBankPageFieldId(
  requestedFieldId: string | null,
  savedFieldId: string
): string {
  if (requestedFieldId && isPracticeFieldId(requestedFieldId)) {
    const accountExam = examSlugForFieldId(savedFieldId);
    if (accountExam && fieldMatchesExamSlug(requestedFieldId, accountExam)) {
      return requestedFieldId;
    }
  }
  return savedFieldId;
}

/**
 * Href to replace with, or null when the query is already canonical.
 * Drops a subject that does not belong to the page field. Replaces a field
 * from another board with the saved account exam.
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
  if (subjectParam && usmleBlueprintPracticeSlug(input.fieldId, subjectParam)) {
    return (
      usmleWeakAreaServedSubject({ fieldId: input.fieldId, topicKey: subjectParam })?.subjectId ??
      MIXED_SUBJECT_ID
    );
  }
  if (
    subjectParam === MIXED_SUBJECT_ID ||
    (subjectParam === "mixed" && styleParam === "review_incorrect")
  ) {
    return MIXED_SUBJECT_ID;
  }
  if (subjectParam && isOtherOpenSubject(subjectParam)) return subjectParam.trim();
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
  const servedId = (value: string | null): string | null => {
    if (!value) return null;
    if (usmleBlueprintPracticeSlug(input.fieldId, value)) {
      return usmleWeakAreaServedSubject({ fieldId: input.fieldId, topicKey: value })?.subjectId ?? null;
    }
    return subjectIdBelongsToField(input.fieldId, value) ? value : null;
  };
  if (input.blueprintAreaId) return null;
  if (input.overrideProvided) {
    return servedId(input.override?.trim() || null);
  }
  return servedId(input.browserSubjectId?.trim() || null);
}

/** Value equality, ignoring parameter order. */
export function questionBankQueriesMatch(a: URLSearchParams, b: URLSearchParams): boolean {
  const keys = new Set<string>([...a.keys(), ...b.keys()]);
  for (const key of keys) {
    if ((a.get(key) ?? null) !== (b.get(key) ?? null)) return false;
  }
  return true;
}
