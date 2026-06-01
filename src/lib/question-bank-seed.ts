import type { BankItem } from "./question-bank";
import { FIELD_SUBJECTS, type FieldSubject } from "./field-subjects";
import {
  getHealthBankItems,
  getHealthBankSubjectIds,
  HEALTH_QUESTION_BANK,
} from "./health-sciences-question-bank";

export type SeedQuestionRow = {
  fieldId: string;
  subjectId: string;
  item: BankItem;
  source: "seed";
};

/**
 * All static questions shipped in the repo — used to populate and refresh the database.
 */
export function collectSeedQuestionRows(): SeedQuestionRow[] {
  const rows: SeedQuestionRow[] = [];
  const seen = new Set<string>();

  const push = (fieldId: string, subjectId: string, item: BankItem) => {
    const key = `${fieldId}|${subjectId}|${item.question.trim().toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({
      fieldId,
      subjectId,
      item: { ...item, subjectId: item.subjectId ?? subjectId },
      source: "seed",
    });
  };

  for (const fieldId of Object.keys(HEALTH_QUESTION_BANK)) {
    for (const subjectId of getHealthBankSubjectIds(fieldId)) {
      for (const item of getHealthBankItems(fieldId, subjectId)) {
        push(fieldId, subjectId, item);
      }
    }
  }

  return rows;
}

/** Every field + subject area that must meet the minimum bank size. */
export function collectAllSubjectAreas(): { fieldId: string; subject: FieldSubject }[] {
  const areas: { fieldId: string; subject: FieldSubject }[] = [];
  for (const [fieldId, subjects] of Object.entries(FIELD_SUBJECTS)) {
    for (const subject of subjects) {
      areas.push({ fieldId, subject });
    }
  }
  return areas;
}
