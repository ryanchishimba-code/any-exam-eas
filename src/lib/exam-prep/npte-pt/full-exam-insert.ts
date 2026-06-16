/**
 * Link QA-passed bank items into NPTE-PT full-length practice exam sets.
 */
import type { PrismaClient } from "@prisma/client";
import type { NptePtFullExamBundle } from "./types";
import { NPTE_PT_FULL_EXAM_VERSION } from "./types";

export type NptePtFullExamInsertResult = {
  examId: string;
  linked: number;
  missing: number;
};

export async function insertNptePtFullExamItems(
  prisma: PrismaClient,
  exam: NptePtFullExamBundle,
  opts?: { batchId?: string }
): Promise<NptePtFullExamInsertResult> {
  const links: {
    sortOrder: number;
    questionBankItemId: string;
    contentCategory?: string;
    taskCategory?: string;
  }[] = [];
  let missing = 0;

  for (let i = 0; i < exam.items.length; i++) {
    const item = exam.items[i]!;
    const bankId = item.id;
    if (!bankId) {
      missing++;
      continue;
    }

    links.push({
      sortOrder: i + 1,
      questionBankItemId: bankId,
      contentCategory: item.topicCategory ?? item.subjectId ?? undefined,
      taskCategory:
        (item.ngnPayload?.taskCategory as string | undefined) ??
        (item as BankItemWithTask).taskCategory ??
        undefined,
    });
  }

  const examRecord = await prisma.nptePtFullPracticeExam.upsert({
    where: { examNumber: exam.examNumber },
    create: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      taskSummary: exam.taskSummary ?? undefined,
      batchId: opts?.batchId,
      generationVersion: NPTE_PT_FULL_EXAM_VERSION,
      qaPassed: exam.qaReport.allPassed,
      qaReport: exam.qaReport,
      active: exam.qaReport.allPassed && links.length === exam.questionCount,
    },
    update: {
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      taskSummary: exam.taskSummary ?? undefined,
      batchId: opts?.batchId,
      generationVersion: NPTE_PT_FULL_EXAM_VERSION,
      qaPassed: exam.qaReport.allPassed,
      qaReport: exam.qaReport,
      active: exam.qaReport.allPassed && links.length === exam.questionCount,
    },
  });

  await prisma.nptePtFullPracticeExamQuestion.deleteMany({
    where: { examId: examRecord.id },
  });

  if (links.length > 0) {
    await prisma.nptePtFullPracticeExamQuestion.createMany({
      data: links.map((q) => ({
        examId: examRecord.id,
        questionBankItemId: q.questionBankItemId,
        sortOrder: q.sortOrder,
        contentCategory: q.contentCategory,
        taskCategory: q.taskCategory,
      })),
    });
  }

  return { examId: examRecord.id, linked: links.length, missing };
}

type BankItemWithTask = { taskCategory?: string };
