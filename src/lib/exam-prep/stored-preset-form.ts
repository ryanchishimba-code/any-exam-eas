/**
 * Load one active composed form's questions in stored order.
 * No shuffle and no second draw from the bank.
 */
import type { BankItem } from "@/lib/question-bank";
import { prisma } from "@/lib/prisma";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { prepareBoardBankItem } from "@/lib/exam-prep/board-serve-registry";
import { timedExamPrepareItemForField } from "@/lib/exam-prep/compose/exam-compose-config";
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";
import { listPresetExamsForSlug } from "@/lib/exam-prep/load-preset-exam";
import type { ExamSlug } from "@/types/edtech";

export type ActivePresetForm = {
  examNumber: number;
  title: string;
  questionCount: number;
  fieldId: string;
};

export type ExactPresetForm = ActivePresetForm & {
  questionIds: string[];
  items: BankItem[];
};

type LoosePresetRow = {
  examNumber: number;
  title: string;
  questionCount: number;
  stepLevel?: string;
};

function fieldIdForStep(stepLevel: string | undefined): string {
  if (stepLevel === "step1") return "usmle-step-1";
  if (stepLevel === "step3") return "usmle-step-3";
  return "usmle-step-2";
}

function formFieldId(examSlug: ExamSlug, row: LoosePresetRow): string {
  if (examSlug === "usmle") return fieldIdForStep(row.stepLevel);
  return EXAM_CATALOG[examSlug].fieldId;
}

export async function listActivePresetForms(
  examSlug: ExamSlug,
  fieldId: string
): Promise<ActivePresetForm[]> {
  const rows = (await listPresetExamsForSlug(examSlug)) as LoosePresetRow[];
  return rows
    .map((row) => ({
      examNumber: row.examNumber,
      title: row.title,
      questionCount: row.questionCount,
      fieldId: formFieldId(examSlug, row),
    }))
    .filter((form) => form.fieldId === fieldId && form.questionCount > 0)
    .sort((a, b) => a.examNumber - b.examNumber);
}

type LinkRow = { questionBankItemId: string; sortOrder: number };

function orderedIds(links: readonly LinkRow[], questionCount: number): string[] | null {
  const questionIds = [...links]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.questionBankItemId.localeCompare(b.questionBankItemId))
    .map((link) => link.questionBankItemId);
  if (questionIds.length !== questionCount || questionIds.length === 0) return null;
  if (new Set(questionIds).size !== questionIds.length) return null;
  return questionIds;
}

async function storedLinks(
  examSlug: ExamSlug,
  examNumber: number,
  fieldId: string
): Promise<{ title: string; questionCount: number; questionIds: string[] } | null> {
  if (examSlug === "nclex") {
    const row = await prisma.nclexFullPracticeExam.findFirst({
      where: { examNumber, active: true },
      select: {
        title: true,
        questionCount: true,
        questions: { select: { questionBankItemId: true, sortOrder: true } },
      },
    });
    if (!row) return null;
    const questionIds = orderedIds(row.questions, row.questionCount);
    if (!questionIds) return null;
    return { title: row.title, questionCount: row.questionCount, questionIds };
  }
  if (examSlug === "naplex") {
    const row = await prisma.naplexFullPracticeExam.findFirst({
      where: { examNumber, active: true },
      select: {
        title: true,
        questionCount: true,
        questions: { select: { questionBankItemId: true, sortOrder: true } },
      },
    });
    if (!row) return null;
    const questionIds = orderedIds(row.questions, row.questionCount);
    if (!questionIds) return null;
    return { title: row.title, questionCount: row.questionCount, questionIds };
  }
  if (examSlug === "usmle") {
    const row = await prisma.usmleFullPracticeExam.findFirst({
      where: { examNumber, active: true },
      select: {
        title: true,
        questionCount: true,
        stepLevel: true,
        questions: { select: { questionBankItemId: true, sortOrder: true } },
      },
    });
    if (!row || fieldIdForStep(row.stepLevel) !== fieldId) return null;
    const questionIds = orderedIds(row.questions, row.questionCount);
    if (!questionIds) return null;
    return { title: row.title, questionCount: row.questionCount, questionIds };
  }
  if (examSlug === "pance") {
    const row = await prisma.panceFullPracticeExam.findFirst({
      where: { examNumber, active: true },
      select: {
        title: true,
        questionCount: true,
        questions: { select: { questionBankItemId: true, sortOrder: true } },
      },
    });
    if (!row) return null;
    const questionIds = orderedIds(row.questions, row.questionCount);
    if (!questionIds) return null;
    return { title: row.title, questionCount: row.questionCount, questionIds };
  }
  if (examSlug === "aanp-fnp") {
    const row = await prisma.aanpFnpFullPracticeExam.findFirst({
      where: { examNumber, active: true },
      select: {
        title: true,
        questionCount: true,
        questions: { select: { questionBankItemId: true, sortOrder: true } },
      },
    });
    if (!row) return null;
    const questionIds = orderedIds(row.questions, row.questionCount);
    if (!questionIds) return null;
    return { title: row.title, questionCount: row.questionCount, questionIds };
  }
  if (examSlug === "npte-pt") {
    const row = await prisma.nptePtFullPracticeExam.findFirst({
      where: { examNumber, active: true },
      select: {
        title: true,
        questionCount: true,
        questions: { select: { questionBankItemId: true, sortOrder: true } },
      },
    });
    if (!row) return null;
    const questionIds = orderedIds(row.questions, row.questionCount);
    if (!questionIds) return null;
    return { title: row.title, questionCount: row.questionCount, questionIds };
  }
  return null;
}

function prepareInStoredOrder(fieldId: string, ids: readonly string[], items: readonly BankItem[]): BankItem[] | null {
  const prepare =
    timedExamPrepareItemForField(fieldId) ?? ((item: BankItem) => prepareBoardBankItem(fieldId, item));
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: BankItem[] = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (!item) return null;
    ordered.push(prepare(item));
  }
  return ordered.length === ids.length ? ordered : null;
}

/** Exact stored membership. Null when any linked item cannot be served. */
export async function loadExactPresetForm(params: {
  examSlug: ExamSlug;
  fieldId: string;
  examNumber: number;
}): Promise<ExactPresetForm | null> {
  const stored = await storedLinks(params.examSlug, params.examNumber, params.fieldId);
  if (!stored) return null;
  const loaded = await loadBankItemsByIds(params.fieldId, stored.questionIds);
  const items = prepareInStoredOrder(params.fieldId, stored.questionIds, loaded);
  if (!items) return null;
  return {
    examNumber: params.examNumber,
    title: stored.title,
    questionCount: stored.questionCount,
    fieldId: params.fieldId,
    questionIds: stored.questionIds,
    items,
  };
}
