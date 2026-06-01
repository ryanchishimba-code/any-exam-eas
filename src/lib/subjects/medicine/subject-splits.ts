import type { SubjectArea } from "../types";
import { MEDICINE_SUBJECTS } from "./subjects";

const STEP_1_IDS = new Set([
  "anatomy",
  "physiology",
  "pathology",
  "pharmacology",
  "biochemistry",
  "microbiology",
]);

const STEP_2_IDS = new Set([
  "cardiology",
  "pulmonology",
  "nephrology",
  "neurology",
  "internal-medicine",
  "pediatrics",
  "obgyn",
  "psychiatry",
  "emergency-medicine",
]);

export const USMLE_STEP_1_SUBJECTS: SubjectArea[] = MEDICINE_SUBJECTS.filter((s) =>
  STEP_1_IDS.has(s.id)
);

export const USMLE_STEP_2_SUBJECTS: SubjectArea[] = MEDICINE_SUBJECTS.filter((s) =>
  STEP_2_IDS.has(s.id)
);

export function isUsmleStep1Subject(subjectId: string): boolean {
  return STEP_1_IDS.has(subjectId);
}

export function isUsmleStep2Subject(subjectId: string): boolean {
  return STEP_2_IDS.has(subjectId);
}
