import type { BankItem } from "./question-bank";
import { prisma } from "@/lib/prisma";
import { ensureQuestionBankSeeded } from "@/lib/sync-question-bank";

function rowToBankItem(row: {
  id: string;
  subjectId: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: string | null;
  tags: string | null;
}): BankItem {
  const options = JSON.parse(row.options) as string[];
  return {
    id: row.id,
    subjectId: row.subjectId,
    question: row.question,
    options: options as [string, string, string, string],
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    solutionSteps: row.solutionSteps
      ? (JSON.parse(row.solutionSteps) as string[])
      : undefined,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : undefined,
  };
}

export async function fetchQuestionBankItems(params: {
  fieldId: string;
  subjectId: string;
}): Promise<BankItem[]> {
  await ensureQuestionBankSeeded();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      active: true,
    },
  });

  return rows.map(rowToBankItem);
}

export async function countActiveQuestions(fieldId?: string) {
  await ensureQuestionBankSeeded();
  return prisma.questionBankItem.count({
    where: {
      active: true,
      ...(fieldId ? { fieldId } : {}),
    },
  });
}
