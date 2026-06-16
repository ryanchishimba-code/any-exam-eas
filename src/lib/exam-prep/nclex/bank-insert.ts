/**
 * Link QA-passed bank items into NCLEX full-length practice exam sets.
 */
import type { PrismaClient } from "@prisma/client";
import type { NclexFullExamBundle } from "./types";
import { NCLEX_FULL_EXAM_VERSION } from "./types";

export type NclexInsertResult = {
  examId: string;
  linked: number;
  missing: number;
};

export async function insertNclexFullExamItems(
  prisma: PrismaClient,
  exam: NclexFullExamBundle,
  opts?: { batchId?: string }
): Promise<NclexInsertResult> {
  const links: {
    sortOrder: number;
    questionBankItemId: string;
    clientNeedsCategory?: string;
    itemFormat?: string;
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
      clientNeedsCategory: item.topicCategory ?? item.subjectId ?? undefined,
      itemFormat: item.itemType ?? "vignette",
    });
  }

  const examRecord = await prisma.nclexFullPracticeExam.upsert({
    where: { examNumber: exam.examNumber },
    create: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      caseStudySummary: exam.caseStudyGroups,
      batchId: opts?.batchId,
      generationVersion: NCLEX_FULL_EXAM_VERSION,
      qaPassed: exam.qaReport.allPassed,
      qaReport: exam.qaReport,
      active: exam.qaReport.allPassed && links.length === exam.questionCount,
    },
    update: {
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      caseStudySummary: exam.caseStudyGroups,
      batchId: opts?.batchId,
      generationVersion: NCLEX_FULL_EXAM_VERSION,
      qaPassed: exam.qaReport.allPassed,
      qaReport: exam.qaReport,
      active: exam.qaReport.allPassed && links.length === exam.questionCount,
    },
  });

  await prisma.nclexFullPracticeExamQuestion.deleteMany({
    where: { examId: examRecord.id },
  });

  if (links.length > 0) {
    await prisma.nclexFullPracticeExamQuestion.createMany({
      data: links.map((q) => ({
        examId: examRecord.id,
        questionBankItemId: q.questionBankItemId,
        sortOrder: q.sortOrder,
        clientNeedsCategory: q.clientNeedsCategory,
        itemFormat: q.itemFormat,
      })),
    });
  }

  return { examId: examRecord.id, linked: links.length, missing };
}
