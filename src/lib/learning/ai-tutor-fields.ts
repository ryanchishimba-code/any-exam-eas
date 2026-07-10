import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";

/** NCLEX, NAPLEX, and USMLE (all steps) — AI Tutor enabled. */
export const AI_TUTOR_FIELD_IDS = new Set([
  "nursing",
  "pharmacy",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
]);

export function resolveAiTutorFieldId(fieldId: string): string | null {
  const normalized = normalizeFieldId(fieldId);
  if (AI_TUTOR_FIELD_IDS.has(normalized)) return normalized;
  if (isUsmleFieldId(normalized)) return normalized;
  return null;
}

export function isAiTutorFieldId(fieldId: string): boolean {
  return resolveAiTutorFieldId(fieldId) != null;
}

export function aiTutorExamLabel(fieldId: string): string {
  const id = resolveAiTutorFieldId(fieldId);
  if (id === "nursing") return "NCLEX";
  if (id === "pharmacy") return "NAPLEX";
  if (id?.startsWith("usmle")) return "USMLE";
  return "Board exam";
}
