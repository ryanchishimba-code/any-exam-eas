/**
 * Insert USMLE full-exam items and exam metadata into the database.
 */
import type { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { assessUsmleFullExamItem } from "./quality-gate";
import { usmlePresetExamIsServeReady } from "./load-preset-exam";
import type { UsmleFullExamBundle } from "./types";
import { USMLE_FULL_EXAM_VERSION } from "./types";

export type UsmleInsertResult = {
  examId: string;
  created: number;
  skipped: number;
  linked: number;
};

export async function insertUsmleFullExam(
  prisma: PrismaClient,
  exam: UsmleFullExamBundle
): Promise<UsmleInsertResult> {
  let created = 0;
  let skipped = 0;
  // Keep fieldId aligned with the step so per-step serving/counts stay exact.
  const fieldId =
    exam.stepLevel === "step1"
      ? "usmle-step-1"
      : exam.stepLevel === "step3"
        ? "usmle-step-3"
        : "usmle-step-2";
  const questionIds: {
    sortOrder: number;
    questionBankItemId: string;
    blueprintSystem?: string;
    physicianTask?: string;
    itemFormat?: string;
  }[] = [];

  for (let i = 0; i < exam.items.length; i++) {
    const item = exam.items[i]!;
    const subjectId = item.subjectId ?? "internal-medicine";
    const hash = bankItemContentHash(fieldId, subjectId, item);
    const sortOrder = i + 1;

    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });

    let questionBankItemId: string;

    if (existing) {
      questionBankItemId = existing.id;
      skipped++;
    } else {
      const qc = assessUsmleFullExamItem(item, i, exam.stepLevel);
      const generationMeta = item.ngnPayload?.generationMeta ?? null;

      const createdItem = await prisma.questionBankItem.create({
        data: {
          fieldId,
          subjectId,
          scenario: item.vignette ?? null,
          difficulty: item.difficulty ?? 3,
          topicCategory: item.topicCategory ?? subjectId,
          blueprintDomain: item.blueprintDomain ?? undefined,
          blueprintTopic:
            (item.ngnPayload?.blueprintTopic as string | undefined) ?? undefined,
          taskCategory:
            (item.ngnPayload?.physicianTask as string | undefined) ?? undefined,
          stepLevel: exam.stepLevel,
          generationVersion: USMLE_FULL_EXAM_VERSION,
          reviewStatus: qc.ok ? "approved" : "pending",
          generationMeta: generationMeta ?? undefined,
          itemType: item.itemType ?? "vignette",
          question: item.question,
          options: serializeBankOptions(item),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          tags: item.tags ? JSON.stringify(item.tags) : null,
          references: item.references?.length ? item.references : undefined,
          source: "ai-curated",
          contentHash: hash,
          active: true,
          qaPassed: qc.ok,
        },
      });
      questionBankItemId = createdItem.id;
      created++;
    }

    questionIds.push({
      sortOrder,
      questionBankItemId,
      blueprintSystem:
        (item.ngnPayload?.blueprintSystem as string | undefined) ??
        item.blueprintDomain ??
        undefined,
      physicianTask: item.ngnPayload?.physicianTask as string | undefined,
      itemFormat: item.itemType ?? "vignette",
    });
  }

  const batchId = (exam.items[0]?.ngnPayload?.generationMeta as { batchId?: string })?.batchId;
  const serveReady = usmlePresetExamIsServeReady(exam.items.length, exam.questionCount);

  const examRecord = await prisma.usmleFullPracticeExam.upsert({
    where: { examNumber: exam.examNumber },
    create: {
      examNumber: exam.examNumber,
      title: exam.title,
      stepLevel: exam.stepLevel,
      questionCount: exam.questionCount,
      blueprintSummary: exam.blueprintSummary,
      formatSummary: exam.formatSummary,
      taskSummary: exam.taskSummary,
      batchId,
      generationVersion: USMLE_FULL_EXAM_VERSION,
      qaPassed: serveReady,
      qaReport: exam.qaReport,
      active: serveReady,
    },
    update: {
      title: exam.title,
      stepLevel: exam.stepLevel,
      questionCount: exam.questionCount,
      blueprintSummary: exam.blueprintSummary,
      formatSummary: exam.formatSummary,
      taskSummary: exam.taskSummary,
      batchId,
      generationVersion: USMLE_FULL_EXAM_VERSION,
      qaPassed: serveReady,
      qaReport: exam.qaReport,
      active: serveReady,
    },
  });

  await prisma.usmleFullPracticeExamQuestion.deleteMany({
    where: { examId: examRecord.id },
  });

  await prisma.usmleFullPracticeExamQuestion.createMany({
    data: questionIds.map((q) => ({
      examId: examRecord.id,
      questionBankItemId: q.questionBankItemId,
      sortOrder: q.sortOrder,
      blueprintSystem: q.blueprintSystem,
      physicianTask: q.physicianTask,
      itemFormat: q.itemFormat,
    })),
  });

  return {
    examId: examRecord.id,
    created,
    skipped,
    linked: questionIds.length,
  };
}
