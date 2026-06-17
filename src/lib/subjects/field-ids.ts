import {
  USMLE_FIELD_IDS,
  resolveUsmleFieldId,
  type UsmleFieldId,
} from "@/lib/exam-prep/usmle/steps";

export { USMLE_FIELD_IDS, type UsmleFieldId } from "@/lib/exam-prep/usmle/steps";

/** Canonical exam field identifiers exposed in the product (six board exams). */
export const EXAM_FIELD_IDS = [
  "nursing",
  "usmle-step-2",
  "pharmacy",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type ExamFieldId = (typeof EXAM_FIELD_IDS)[number];

/** Any field id that can be practiced in the question bank. */
export type PracticeFieldId = ExamFieldId | UsmleFieldId;

/** Legacy or shorthand ids mapped to canonical exam field ids (non-USMLE). */
export const FIELD_ID_ALIASES: Record<string, ExamFieldId> = {
  nursing: "nursing",
  nclex: "nursing",
  "nclex-ngn": "nursing",
  "nclex-rn": "nursing",
  pharmacy: "pharmacy",
  naplex: "pharmacy",
  pance: "pance",
  "physician-assistant": "pance",
  pa: "pance",
  "aanp-fnp": "aanp-fnp",
  fnp: "aanp-fnp",
  "family-nurse-practitioner": "aanp-fnp",
  "npte-pt": "npte-pt",
  npte: "npte-pt",
  pt: "npte-pt",
  "physical-therapy": "npte-pt",
  mpje: "pance",
  "usmle-step-2": "usmle-step-2",
  "usmle-step-2-ck": "usmle-step-2",
  "usmle-step2": "usmle-step-2",
  "step-2": "usmle-step-2",
};

/** Fields removed from the product — data should be purged from the database. */
export const RETIRED_FIELD_IDS = [
  "dentistry",
  "sat",
  "math",
  "biology",
  "chemistry",
  "medicine",
  "mpje",
] as const;

export function normalizeFieldId(fieldId: string): string {
  const normalized = fieldId.toLowerCase().replace(/\s+/g, "-");
  const usmle = resolveUsmleFieldId(normalized);
  if (usmle) return usmle;
  return FIELD_ID_ALIASES[normalized] ?? normalized;
}

export function isExamFieldId(fieldId: string): fieldId is ExamFieldId {
  const normalized = normalizeFieldId(fieldId);
  return (EXAM_FIELD_IDS as readonly string[]).includes(normalized);
}

export function isPracticeFieldId(fieldId: string): fieldId is PracticeFieldId {
  const normalized = normalizeFieldId(fieldId);
  if (resolveUsmleFieldId(normalized)) return true;
  return isExamFieldId(normalized);
}
