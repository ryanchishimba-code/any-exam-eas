import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";

/**
 * A USMLE exam starts on the step the student selected.
 * Step 1, Step 2 CK, and Step 3 are separate banks. Omitting a step keeps
 * the saved one. A non-step field is not a start.
 */
export function resolveUsmleExamStartField(input: {
  requestedField: string | null;
  savedField: string;
}): { ok: true; fieldId: string } | { ok: false; expectedFieldId: string } {
  if (input.requestedField && isUsmleFieldId(input.requestedField)) {
    return { ok: true, fieldId: input.requestedField };
  }
  if (isUsmleFieldId(input.savedField)) {
    return { ok: true, fieldId: input.savedField };
  }
  return { ok: false, expectedFieldId: input.savedField };
}
