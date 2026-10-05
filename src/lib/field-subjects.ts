import { getFieldMeta } from "./fields";
import {
  getSubjectArea,
  getSubjectsForFieldId,
  PRACTICE_FIELD_META,
} from "./subjects/subject-catalog";
import { normalizeFieldId } from "./subjects/field-ids";
import type { SubjectArea } from "./subjects/types";

/** @deprecated Use SubjectArea from subjects/types — kept for backward compatibility */
export type FieldSubject = SubjectArea;

/**
 * Subject areas per field — topic lists only.
 * Generation modules stay in subjects/registry.ts.
 */
export const FIELD_SUBJECTS: Record<string, FieldSubject[]> = Object.fromEntries(
  PRACTICE_FIELD_META.map((meta) => [meta.id, getSubjectsForFieldId(meta.id)])
);

export function getSubjectsForField(fieldLabel: string): FieldSubject[] {
  const meta = getFieldMeta(fieldLabel);
  const id = normalizeFieldId(meta?.id ?? fieldLabel);
  return getSubjectsForFieldId(id);
}

export function getFieldSubject(
  fieldLabel: string,
  subjectId: string
): FieldSubject | undefined {
  const meta = getFieldMeta(fieldLabel);
  const id = normalizeFieldId(meta?.id ?? fieldLabel);
  return getSubjectArea(id, subjectId);
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
