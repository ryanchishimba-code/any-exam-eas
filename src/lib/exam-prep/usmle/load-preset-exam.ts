/**
 * Load curated USMLE block-style practice exam presets from the database.
 */
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import type { UsmleStepLevel } from "./types";

export type UsmlePresetExamSummary = {
  examNumber: number;
  title: string;
  stepLevel: UsmleStepLevel;
  questionCount: number;
  linkedCount: number;
  blueprintSummary: Record<string, number> | null;
  formatSummary: Record<string, number> | null;
  taskSummary: Record<string, number> | null;
  qaPassed: boolean;
};

const MIN_SERVE_RATIO = 0.9;

export function usmlePresetExamIsServeReady(linkedCount: number, targetCount: number): boolean {
  if (targetCount <= 0 || linkedCount <= 0) return false;
  return linkedCount >= Math.floor(targetCount * MIN_SERVE_RATIO);
}

export async function listUsmleFullPracticeExams(): Promise<UsmlePresetExamSummary[]> {
  const rows = await prisma.usmleFullPracticeExam.findMany({
    orderBy: { examNumber: "asc" },
    include: {
      // Count only links to questions still in the curated serve bank so a preset
      // is never advertised once its items have been retired from the bank.
      _count: {
        select: { questions: { where: { question: { active: true, qaPassed: true } } } },
      },
    },
  });

  return rows
    .map((row) => ({
      examNumber: row.examNumber,
      title: row.title,
      stepLevel: row.stepLevel as UsmleStepLevel,
      questionCount: row.questionCount,
      linkedCount: row._count.questions,
      blueprintSummary: row.blueprintSummary as Record<string, number> | null,
      formatSummary: row.formatSummary as Record<string, number> | null,
      taskSummary: row.taskSummary as Record<string, number> | null,
      qaPassed: usmlePresetExamIsServeReady(row._count.questions, row.questionCount),
    }))
    .filter((row) => usmlePresetExamIsServeReady(row.linkedCount, row.questionCount));
}

export async function loadUsmlePresetExamItems(
  examNumber: number
): Promise<{ exam: UsmlePresetExamSummary; items: BankItem[]; fieldId: string } | null> {
  const row = await prisma.usmleFullPracticeExam.findFirst({
    where: { examNumber },
    include: {
      questions: {
        // Only serve linked items still active and serve-ready in the curated bank.
        where: { question: { active: true, qaPassed: true } },
        orderBy: { sortOrder: "asc" },
        include: { question: true },
      },
    },
  });

  if (!row || row.questions.length === 0) return null;
  if (!usmlePresetExamIsServeReady(row.questions.length, row.questionCount)) return null;

  const stepLevel = row.stepLevel as UsmleStepLevel;
  const fieldId = stepLevel === "step1" ? "usmle-step-1" : "usmle-step-2";

  const items: BankItem[] = row.questions.map((link) => {
    const item = enrichBankItemFromRow(link.question);
    item.id = link.question.id;
    item.source = link.question.source ?? undefined;
    return {
      ...item,
      ngnPayload: {
        ...(item.ngnPayload ?? {}),
        stepLevel,
        blueprintSystem: link.blueprintSystem ?? link.question.blueprintDomain,
        physicianTask: link.physicianTask ?? link.question.taskCategory,
      },
    };
  });

  return {
    exam: {
      examNumber: row.examNumber,
      title: row.title,
      stepLevel,
      questionCount: items.length,
      linkedCount: items.length,
      blueprintSummary: row.blueprintSummary as Record<string, number> | null,
      formatSummary: row.formatSummary as Record<string, number> | null,
      taskSummary: row.taskSummary as Record<string, number> | null,
      qaPassed: usmlePresetExamIsServeReady(items.length, row.questionCount),
    },
    items,
    fieldId,
  };
}
