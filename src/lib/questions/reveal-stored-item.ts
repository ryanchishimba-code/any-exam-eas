/**
 * Load a bank or published clinical row and return the answer the reveal route serves.
 */
import { parseNgnQuestionKey, canonicalStoredQuestionKey } from "@/lib/assessment/serve";
import { findServedItem } from "@/lib/assessment/serve-db";
import { openStudentRef } from "@/lib/assessment/student-item-ref";
import { bankItemFromClinicalServeItem } from "@/lib/full-exam/catalog-exam-items";
import { bankItemToRawQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { prisma } from "@/lib/prisma";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { revealStudyAnswer, type RevealedAnswerFields } from "@/lib/questions/reveal-study-answer";
import type { StudyQuestion } from "@/lib/questions/types";

function catalogRef(itemId: string): { id: string; version: number } | null {
  const canonical = canonicalStoredQuestionKey(itemId);
  const parsed = parseNgnQuestionKey(canonical);
  if (parsed) return parsed;
  return openStudentRef(itemId);
}

/** Bank or published clinical row as the study question the server grades. */
export async function loadStoredStudyQuestion(itemId: string): Promise<StudyQuestion | null> {
  const ref = catalogRef(itemId);
  if (ref) {
    const clinical = await findServedItem(ref.id, ref.version);
    if (clinical) {
      const bank = bankItemFromClinicalServeItem(clinical);
      if (!bank) return null;
      return examQuestionToStudy(bankItemToRawQuestion(bank, 0), 0, { shuffleOptions: false });
    }
  }

  const bankId = ref ? `ngn:${ref.id}:v${ref.version}` : itemId;
  const row =
    (await prisma.questionBankItem.findUnique({ where: { id: bankId } })) ??
    (bankId === itemId
      ? null
      : await prisma.questionBankItem.findUnique({ where: { id: itemId } }));
  if (!row) return null;
  const item = enrichBankItemFromRow(row);
  return examQuestionToStudy(bankItemToRawQuestion(item, 0), 0, { shuffleOptions: false });
}

export async function revealStoredItem(input: {
  itemId: string;
  selected: string[];
  options?: string[];
}): Promise<(RevealedAnswerFields & { correct: boolean }) | null> {
  const study = await loadStoredStudyQuestion(input.itemId);
  if (!study) return null;
  return revealStudyAnswer(study, { selected: input.selected, options: input.options });
}
