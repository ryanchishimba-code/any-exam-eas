import { resolveBlueprintCategoryIdForAttempt } from "@/lib/learning/attempt-blueprint-attribution";
import type { PracticeAnswer } from "@/lib/learning/practice-measure";

export type AttemptPracticeRow = {
  bankItemId?: string | null;
  questionKey?: string | null;
  correct: boolean;
  createdAt: Date | string;
  subjectId?: string | null;
  clientNeeds?: string | null;
  topicCategory?: string | null;
  blueprintDomain?: string | null;
  difficultyAtAttempt?: string | null;
  questionType?: string | null;
};

export type BankPracticeFact = {
  active: boolean;
  difficulty: number | null;
  itemType: string | null;
};

const SPECIFIC_FORMAT = /sata|select[_-]?all|bow[_-]?tie|matrix|highlight|ordered|unfolding|ngn|grid/i;

function specificFormat(questionType: string | null | undefined, itemType: string | null | undefined): string | null {
  const fromBank = itemType?.trim() ?? "";
  if (SPECIFIC_FORMAT.test(fromBank)) return fromBank;
  const fromAttempt = questionType?.trim() ?? "";
  return fromAttempt || null;
}

/** Map saved attempts to measure rows. Missing bank rows that were looked up count as deleted. */
export function practiceAnswersFromRows(input: {
  boardId: string;
  fieldId: string;
  rows: AttemptPracticeRow[];
  bank: ReadonlyMap<string, BankPracticeFact>;
  lookedUp: ReadonlySet<string>;
}): PracticeAnswer[] {
  return input.rows.map((row) => {
    const questionId = row.bankItemId?.trim() || row.questionKey?.trim() || null;
    const bank = questionId ? input.bank.get(questionId) : undefined;
    const looked = Boolean(questionId && input.lookedUp.has(questionId));
    const difficulty =
      row.difficultyAtAttempt?.trim() ||
      (bank?.difficulty != null ? String(bank.difficulty) : undefined);
    return {
      questionId,
      boardId: input.boardId,
      domainId: resolveBlueprintCategoryIdForAttempt(input.fieldId, row),
      correct: row.correct,
      createdAt:
        row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      difficulty,
      format: specificFormat(row.questionType, bank?.itemType),
      deleted: Boolean(questionId && looked && !bank),
      active: bank ? bank.active : undefined,
      hidden: bank ? bank.active === false : false,
    };
  });
}
