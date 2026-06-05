/** Canonical exam field identifiers exposed in the product. */
export const EXAM_FIELD_IDS = [
  "nursing",
  "usmle-step-1",
  "usmle-step-2",
  "pharmacy",
  "mpje",
] as const;

export type ExamFieldId = (typeof EXAM_FIELD_IDS)[number];

/** Legacy or shorthand ids mapped to canonical field ids. */
export const FIELD_ID_ALIASES: Record<string, ExamFieldId> = {
  nursing: "nursing",
  nclex: "nursing",
  "nclex-ngn": "nursing",
  "nclex-rn": "nursing",
  pharmacy: "pharmacy",
  naplex: "pharmacy",
  mpje: "mpje",
  "usmle-step-1": "usmle-step-1",
  "usmle-step1": "usmle-step-1",
  "step-1": "usmle-step-1",
  "usmle-step-2": "usmle-step-2",
  "usmle-step2": "usmle-step-2",
  "step-2": "usmle-step-2",
  usmle: "usmle-step-2",
  medicine: "usmle-step-2",
};

/** Fields removed from the product — data should be purged from the database. */
export const RETIRED_FIELD_IDS = [
  "dentistry",
  "sat",
  "math",
  "biology",
  "chemistry",
  "medicine",
] as const;

export function normalizeFieldId(fieldId: string): string {
  const normalized = fieldId.toLowerCase().replace(/\s+/g, "-");
  return FIELD_ID_ALIASES[normalized] ?? normalized;
}

export function isExamFieldId(fieldId: string): fieldId is ExamFieldId {
  const normalized = normalizeFieldId(fieldId);
  return (EXAM_FIELD_IDS as readonly string[]).includes(normalized);
}
