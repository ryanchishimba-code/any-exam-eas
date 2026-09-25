import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
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

/** Value equality, ignoring parameter order. */
export function questionBankQueriesMatch(a: URLSearchParams, b: URLSearchParams): boolean {
  const keys = new Set<string>([...a.keys(), ...b.keys()]);
  for (const key of keys) {
    if ((a.get(key) ?? null) !== (b.get(key) ?? null)) return false;
  }
  return true;
}
