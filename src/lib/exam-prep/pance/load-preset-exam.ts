/**
 * Load curated PANCE full-length practice exam presets from the database.
 */
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import { usmleBankItemPassesStructuralGate } from "@/lib/exam-prep/usmle-clinical-gate";

export type PancePresetExamSummary = {
  examNumber: number;
  title: string;
  questionCount: number;
  linkedCount: number;
  blueprintSummary: Record<string, number> | null;
  qaPassed: boolean;
};

const MIN_SERVE_RATIO = 0.9;
const FIELD_ID = "pance";

export function pancePresetExamIsServeReady(linkedCount: number, targetCount: number): boolean {
  if (targetCount <= 0 || linkedCount <= 0) return false;
  return linkedCount >= Math.floor(targetCount * MIN_SERVE_RATIO);
}

export async function listPanceFullPracticeExams(): Promise<PancePresetExamSummary[]> {
  const rows = await prisma.panceFullPracticeExam.findMany({
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
        row.qaPassed || pancePresetExamIsServeReady(row._count.questions, row.questionCount),
    }));
}

export async function loadPancePresetExamItems(
  examNumber: number
): Promise<{ exam: PancePresetExamSummary; items: BankItem[] } | null> {
  const exam = await prisma.panceFullPracticeExam.findFirst({
    where: { examNumber, active: true },
    include: {
      questions: {
        where: { question: { active: true, qaPassed: true } },
        orderBy: { sortOrder: "asc" },
        include: { question: true },
      },
    },
  });

  if (!exam || exam.questions.length === 0) return null;
  if (!pancePresetExamIsServeReady(exam.questions.length, exam.questionCount)) return null;

  const items: BankItem[] = [];
  for (const link of exam.questions) {
    const item = enrichBankItemFromRow(link.question);
    item.id = link.question.id;
    item.source = link.question.source ?? undefined;
    if (!usmleBankItemPassesStructuralGate(item, FIELD_ID)) continue;
    items.push(item);
  }

  if (!pancePresetExamIsServeReady(items.length, exam.questionCount)) return null;

  return {
    exam: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: items.length,
      linkedCount: items.length,
      blueprintSummary: exam.blueprintSummary as Record<string, number> | null,
      qaPassed:
        exam.qaPassed || pancePresetExamIsServeReady(items.length, exam.questionCount),
    },
    items,
  };
}
