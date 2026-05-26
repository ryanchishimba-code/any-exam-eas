import { getFieldMeta } from "./fields";
import {
  getAllFieldSubjects,
  getSubjectArea as getRegistrySubjectArea,
  getSubjectsForFieldId,
} from "./subjects/registry";
import type { SubjectArea } from "./subjects/types";

/** @deprecated Use SubjectArea from subjects/types — kept for backward compatibility */
export type FieldSubject = SubjectArea;

/**
 * Subject areas per field — sourced from registered subject modules.
 * Add a new discipline by registering a module in subjects/registry.ts.
 */
export const FIELD_SUBJECTS: Record<string, FieldSubject[]> = getAllFieldSubjects();

export function getSubjectsForField(fieldLabel: string): FieldSubject[] {
  const meta = getFieldMeta(fieldLabel);
  const id = meta?.id ?? fieldLabel.toLowerCase().replace(/\s+/g, "-");
  return getSubjectsForFieldId(id);
}

export function getFieldSubject(
  fieldLabel: string,
  subjectId: string
): FieldSubject | undefined {
  const meta = getFieldMeta(fieldLabel);
  const id = meta?.id ?? fieldLabel.toLowerCase().replace(/\s+/g, "-");
  return getRegistrySubjectArea(id, subjectId);
}

export function buildScopedTopic(
  fieldLabel: string,
  subjectId: string,
  specificFocus?: string
): string {
  const subject = getFieldSubject(fieldLabel, subjectId);
  const base = subject?.label ?? subjectId;
  const focus = specificFocus?.trim();
  return focus ? `${base} — ${focus}` : base;
}

export function subjectMatchesQuestion(
  subject: FieldSubject,
  questionText: string,
  tags: string[] = []
): boolean {
  const haystack = `${questionText} ${tags.join(" ")}`.toLowerCase();
  return subject.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
