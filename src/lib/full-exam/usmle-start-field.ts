import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";

/**
 * A USMLE exam starts on the saved step.
 * A request for a different step is refused before a session row is created,
 * so question load does not later fail with a step mismatch.
 */
export function resolveUsmleExamStartField(input: {
  requestedField: string | null;
  savedField: string;
}): { ok: true; fieldId: string } | { ok: false; expectedFieldId: string } {
  if (
    input.requestedField &&
    isUsmleFieldId(input.requestedField) &&
    input.requestedField !== input.savedField
  ) {
    return { ok: false, expectedFieldId: input.savedField };
  }
  return { ok: true, fieldId: input.savedField };
}
