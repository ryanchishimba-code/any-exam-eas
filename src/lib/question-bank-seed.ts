import type { BankItem } from "./question-bank";
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

const HEALTH_FIELD_IDS = Object.keys(HEALTH_QUESTION_BANK);

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

  for (const fieldId of HEALTH_FIELD_IDS) {
    for (const subjectId of getHealthBankSubjectIds(fieldId)) {
      for (const item of getHealthBankItems(fieldId, subjectId)) {
        push(fieldId, subjectId, item);
      }
    }
  }

  return rows;
}
