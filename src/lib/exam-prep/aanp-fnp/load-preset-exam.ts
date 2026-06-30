/**
 * Load curated AANP FNP full-length practice exam presets from the database.
 */
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import { usmleBankItemIsServeReady } from "@/lib/exam-prep/usmle-clinical-gate";

export type AanpFnpPresetExamSummary = {
  examNumber: number;
  title: string;
  questionCount: number;
  linkedCount: number;
  blueprintSummary: Record<string, number> | null;
  qaPassed: boolean;
};

const MIN_SERVE_RATIO = 0.9;
const FIELD_ID = "aanp-fnp";

export function aanpFnpPresetExamIsServeReady(linkedCount: number, targetCount: number): boolean {
  if (targetCount <= 0 || linkedCount <= 0) return false;
  return linkedCount >= Math.floor(targetCount * MIN_SERVE_RATIO);
}

export async function listAanpFnpFullPracticeExams(): Promise<AanpFnpPresetExamSummary[]> {
  const rows = await prisma.aanpFnpFullPracticeExam.findMany({
    where: { active: true },
    orderBy: { examNumber: "asc" },
    include: { _count: { select: { questions: true } } },
  });

  return rows
    .filter((row) => row._count.questions > 0)
    .map((row) => ({
      examNumber: row.examNumber,
      title: row.title,
      questionCount: row.questionCount,
      linkedCount: row._count.questions,
      blueprintSummary: row.blueprintSummary as Record<string, number> | null,
      qaPassed:
        row.qaPassed || aanpFnpPresetExamIsServeReady(row._count.questions, row.questionCount),
    }));
}

export async function loadAanpFnpPresetExamItems(
  examNumber: number
): Promise<{ exam: AanpFnpPresetExamSummary; items: BankItem[] } | null> {
  const exam = await prisma.aanpFnpFullPracticeExam.findFirst({
    where: { examNumber, active: true },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { question: true },
      },
    },
  });

  if (!exam || exam.questions.length === 0) return null;
  if (!aanpFnpPresetExamIsServeReady(exam.questions.length, exam.questionCount)) return null;

  const items: BankItem[] = [];
  for (const link of exam.questions) {
    const item = enrichBankItemFromRow(link.question);
    item.id = link.question.id;
    item.source = link.question.source ?? undefined;
    if (!usmleBankItemIsServeReady(item, FIELD_ID)) continue;
    items.push(item);
  }

  if (!aanpFnpPresetExamIsServeReady(items.length, exam.questionCount)) return null;

  return {
    exam: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: items.length,
      linkedCount: items.length,
      blueprintSummary: exam.blueprintSummary as Record<string, number> | null,
      qaPassed:
        exam.qaPassed || aanpFnpPresetExamIsServeReady(items.length, exam.questionCount),
    },
    items,
  };
}
