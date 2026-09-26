import type { PublishedUnit } from "@/lib/assessment/serve";
import type { NgnReference } from "@/lib/assessment/types";

export type ClinicalSessionPayload = {
  practiceFormat: "ngn" | "case";
  field: string;
  fieldId: string;
  subjectId: string;
  sourcesById: Record<string, { title: string; url: string }>;
  caseReferences: Record<string, NgnReference[]>;
  units: PublishedUnit[];
};

export function readClinicalSession(value: unknown): ClinicalSessionPayload | null {
  if (!value || typeof value !== "object") return null;
  const record = value as ClinicalSessionPayload;
  if (record.practiceFormat !== "ngn" && record.practiceFormat !== "case") return null;
  if (!Array.isArray(record.units) || record.units.length === 0) return null;
  return record;
}
