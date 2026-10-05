/**
 * Study fields for nav and the question bank.
 * Labels come from the light catalog, not the generation modules in registry.ts,
 * so a client import does not download seed audits or anatomy geometry.
 */
import { normalizeFieldId } from "./subjects/field-ids";
import { PRACTICE_FIELD_META, type PracticeFieldMeta } from "./subjects/subject-catalog";

export type StudyField = PracticeFieldMeta;

/** All practice boards, in registry order. */
export const STUDY_FIELDS: StudyField[] = PRACTICE_FIELD_META;

/** Default field label for study/generate UI when none is selected. */
export const DEFAULT_STUDY_FIELD_LABEL = STUDY_FIELDS[0]?.label ?? "NCLEX";

export const FIELD_LABELS = STUDY_FIELDS.map((f) => f.label);

export function getFieldMeta(labelOrId: string): StudyField | undefined {
  const normalized = normalizeFieldId(labelOrId);
  return (
    STUDY_FIELDS.find(
      (f) =>
        f.label.toLowerCase() === labelOrId.toLowerCase() ||
        f.id === normalized
    ) ?? STUDY_FIELDS.find((f) => f.id === labelOrId)
  );
}

export function getFieldMetaById(fieldId: string): StudyField | undefined {
  const normalized = normalizeFieldId(fieldId);
  return STUDY_FIELDS.find((f) => f.id === normalized);
}
