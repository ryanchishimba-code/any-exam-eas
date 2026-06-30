/**
 * Load curated NAPLEX full-length practice exam presets from the database.
 */
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import { naplexItemPassesTimedExamGate } from "@/lib/exam-prep/naplex-serve-gate";

export type NaplexPresetExamSummary = {
  examNumber: number;
  title: string;
  questionCount: number;
  linkedCount: number;
  blueprintSummary: Record<string, number> | null;
  qaPassed: boolean;
};

const MIN_SERVE_RATIO = 0.9;

export function naplexPresetExamIsServeReady(linkedCount: number, targetCount: number): boolean {
  if (targetCount <= 0 || linkedCount <= 0) return false;
  return linkedCount >= Math.floor(targetCount * MIN_SERVE_RATIO);
}

export async function listNaplexFullPracticeExams(): Promise<NaplexPresetExamSummary[]> {
  const rows = await prisma.naplexFullPracticeExam.findMany({
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
        row.qaPassed || naplexPresetExamIsServeReady(row._count.questions, row.questionCount),
    }));
}

export async function loadNaplexPresetExamItems(
  examNumber: number
): Promise<{ exam: NaplexPresetExamSummary; items: BankItem[] } | null> {
  const exam = await prisma.naplexFullPracticeExam.findFirst({
    where: { examNumber, active: true },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { question: true },
      },
    },
  });

  if (!exam || exam.questions.length === 0) return null;
  if (!naplexPresetExamIsServeReady(exam.questions.length, exam.questionCount)) return null;

  const items: BankItem[] = [];
  for (const link of exam.questions) {
    const item = enrichBankItemFromRow(link.question);
    item.id = link.question.id;
    item.source = link.question.source ?? undefined;
    if (!naplexItemPassesTimedExamGate(item)) continue;
    items.push(item);
  }

  if (!naplexPresetExamIsServeReady(items.length, exam.questionCount)) return null;

  return {
    exam: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: items.length,
      linkedCount: items.length,
      blueprintSummary: exam.blueprintSummary as Record<string, number> | null,
      qaPassed:
        exam.qaPassed || naplexPresetExamIsServeReady(items.length, exam.questionCount),
    },
    items,
  };
}
