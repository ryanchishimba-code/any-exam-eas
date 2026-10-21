/**
 * Load a bank or published clinical row and return the answer the reveal route serves.
 */
import { parseNgnQuestionKey, canonicalStoredQuestionKey } from "@/lib/assessment/serve";
import { findServedItem } from "@/lib/assessment/serve-db";
import { openStudentRef } from "@/lib/assessment/student-item-ref";
import { bankItemFromClinicalServeItem } from "@/lib/full-exam/catalog-exam-items";
import { bankItemToRawQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import { bankItemToNaplexRaw } from "@/lib/exam-prep/naplex-bank-bridge";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import { prisma } from "@/lib/prisma";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { revealStudyAnswer, type RevealedAnswerFields } from "@/lib/questions/reveal-study-answer";
import type { StudyQuestion } from "@/lib/questions/types";

function bankItemToStoredRaw(item: BankItem) {
  if (
    item.fieldId === "pharmacy" ||
    item.itemType === "constructed_response" ||
    item.itemType === "calculation"
  ) {
    return bankItemToNaplexRaw(item, 0);
  }
  return bankItemToRawQuestion(item, 0);
}

function catalogRef(itemId: string): { id: string; version: number } | null {
  const canonical = canonicalStoredQuestionKey(itemId);
  const parsed = parseNgnQuestionKey(canonical);
  if (parsed) return parsed;
  return openStudentRef(itemId);
}

/** Bank or published clinical row as the study question the server grades. */
/** Load many bank/clinical items in a small number of DB round-trips (submit grading). */
export async function loadStoredStudyQuestionsBatch(
  itemIds: string[]
): Promise<Map<string, StudyQuestion>> {
  const out = new Map<string, StudyQuestion>();
  const unique = [...new Set(itemIds.map((id) => id.trim()).filter(Boolean))];
  if (unique.length === 0) return out;

  const bankLookupIds = new Set<string>();
  const clinical: { originalId: string; ref: { id: string; version: number } }[] = [];

  for (const itemId of unique) {
    const ref = catalogRef(itemId);
    if (ref) {
      clinical.push({ originalId: itemId, ref });
      bankLookupIds.add(`ngn:${ref.id}:v${ref.version}`);
    }
    bankLookupIds.add(itemId);
  }

  const rows = await prisma.questionBankItem.findMany({
    where: { id: { in: [...bankLookupIds] } },
  });
  const rowById = new Map(rows.map((row) => [row.id, row]));

  function studyFromBankRow(row: (typeof rows)[number]): StudyQuestion {
    const item = enrichBankItemFromRow(row);
    return examQuestionToStudy(bankItemToRawQuestion(item, 0), 0, { shuffleOptions: false });
  }

  for (const itemId of unique) {
    const ref = catalogRef(itemId);
    const bankId = ref ? `ngn:${ref.id}:v${ref.version}` : itemId;
    const row = rowById.get(bankId) ?? rowById.get(itemId);
    if (row) {
      out.set(itemId, studyFromBankRow(row));
    }
  }

  const clinicalPending = clinical.filter((c) => !out.has(c.originalId));
  if (clinicalPending.length > 0) {
    await Promise.all(
      clinicalPending.map(async ({ originalId, ref }) => {
        const clinicalItem = await findServedItem(ref.id, ref.version);
        if (!clinicalItem) return;
        const bank = bankItemFromClinicalServeItem(clinicalItem);
        if (!bank) return;
        out.set(
          originalId,
          examQuestionToStudy(bankItemToRawQuestion(bank, 0), 0, { shuffleOptions: false })
        );
      })
    );
  }

  return out;
}

export async function loadStoredStudyQuestion(itemId: string): Promise<StudyQuestion | null> {
  const ref = catalogRef(itemId);
  if (ref) {
    const clinical = await findServedItem(ref.id, ref.version);
    if (clinical) {
      const bank = bankItemFromClinicalServeItem(clinical);
      if (!bank) return null;
      return examQuestionToStudy(bankItemToStoredRaw(bank), 0, { shuffleOptions: false });
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
  return examQuestionToStudy(bankItemToStoredRaw(item), 0, { shuffleOptions: false });
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
