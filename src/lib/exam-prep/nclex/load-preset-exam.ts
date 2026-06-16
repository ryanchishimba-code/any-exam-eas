/**
 * Load curated NCLEX full-length practice exam presets from the database.
 */
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import { nclexItemPassesTimedExamGate } from "@/lib/exam-prep/nclex-serve-gate";

export type NclexPresetExamSummary = {
  examNumber: number;
  title: string;
  questionCount: number;
  blueprintSummary: Record<string, number> | null;
  caseStudySummary: unknown;
  qaPassed: boolean;
};

export async function listNclexFullPracticeExams(): Promise<NclexPresetExamSummary[]> {
  const rows = await prisma.nclexFullPracticeExam.findMany({
    where: { active: true },
    orderBy: { examNumber: "asc" },
  });

  return rows.map((row) => ({
    examNumber: row.examNumber,
    title: row.title,
    questionCount: row.questionCount,
    blueprintSummary: row.blueprintSummary as Record<string, number> | null,
    caseStudySummary: row.caseStudySummary,
    qaPassed: row.qaPassed,
  }));
}

export async function loadNclexPresetExamItems(
  examNumber: number
): Promise<{ exam: NclexPresetExamSummary; items: BankItem[] } | null> {
  const exam = await prisma.nclexFullPracticeExam.findFirst({
    where: { examNumber, active: true },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { question: true },
      },
    },
  });

  if (!exam) return null;

  const items: BankItem[] = [];
  for (const link of exam.questions) {
    const item = enrichBankItemFromRow(link.question);
    item.id = link.question.id;
    item.source = link.question.source ?? undefined;
    if (!nclexItemPassesTimedExamGate(item)) continue;
    items.push(item);
  }

  if (items.length !== exam.questionCount) return null;

  return {
    exam: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: exam.questionCount,
      blueprintSummary: exam.blueprintSummary as Record<string, number> | null,
      caseStudySummary: exam.caseStudySummary,
      qaPassed: exam.qaPassed,
    },
    items,
  };
}
