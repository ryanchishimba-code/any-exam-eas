/**
 * Study fields — derived from registered subject modules (not hardcoded).
 * Add a discipline by registering a module in subjects/registry.ts.
 */
import {
  getRegisteredSubjectIds,
  resolveSubjectModule,
} from "./subjects/registry";
import { normalizeFieldId } from "./subjects/field-ids";

export type StudyField = {
  id: string;
  label: string;
  category: "professional" | "stem";
  oerDomains: string[];
  examFocus: string;
  topicPlaceholder: string;
  boardExam: string;
};

function moduleToStudyField(fieldId: string): StudyField {
  const mod = resolveSubjectModule(fieldId);
  const meta = mod.metadata;
  const category: StudyField["category"] =
    meta.category === "stem" ? "stem" : "professional";

  return {
    id: meta.id,
    label: meta.label,
    category,
    boardExam: meta.boardExam ?? "Board-style exams",
    oerDomains: meta.oerDomains,
    examFocus: meta.examFocus,
    topicPlaceholder: meta.topicPlaceholder,
  };
}

/** All registered disciplines in stable registry order. */
export const STUDY_FIELDS: StudyField[] = getRegisteredSubjectIds().map(moduleToStudyField);

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
