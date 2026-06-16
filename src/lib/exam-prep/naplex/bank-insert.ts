/**
 * Insert NAPLEX full-exam items and exam metadata into the database.
 */
import type { PrismaClient } from "@prisma/client";
import type { BankItem } from "@/lib/question-bank";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { assessNaplexFullExamItem } from "./quality-gate";
import type { NaplexFullExamBundle } from "./types";
import { NAPLEX_FULL_EXAM_VERSION } from "./types";

export type NaplexInsertResult = {
  examId: string;
  created: number;
  skipped: number;
  linked: number;
};

export async function insertNaplexFullExamItems(
  prisma: PrismaClient,
  exam: NaplexFullExamBundle
): Promise<NaplexInsertResult> {
  let created = 0;
  let skipped = 0;
  const questionIds: { sortOrder: number; questionBankItemId: string; blueprintArea?: string; itemFormat?: string }[] =
    [];

  for (let i = 0; i < exam.items.length; i++) {
    const item = exam.items[i]!;
    const subjectId = item.subjectId ?? "pharmacology";
    const hash = bankItemContentHash("pharmacy", subjectId, item);
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
      const qc = assessNaplexFullExamItem(item, i);
      const generationMeta = item.ngnPayload?.generationMeta ?? null;

      const createdItem = await prisma.questionBankItem.create({
        data: {
          fieldId: "pharmacy",
          subjectId,
          scenario: item.vignette ?? null,
          difficulty: item.difficulty ?? 3,
          topicCategory: item.topicCategory ?? subjectId,
          blueprintDomain: item.blueprintDomain ?? undefined,
          blueprintTopic:
            (item.ngnPayload?.blueprintTopic as string | undefined) ?? undefined,
          generationVersion: NAPLEX_FULL_EXAM_VERSION,
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
      blueprintArea:
        (item.ngnPayload?.blueprintArea as string | undefined) ?? item.blueprintDomain ?? undefined,
      itemFormat: item.itemType ?? "vignette",
    });
  }

  const examRecord = await prisma.naplexFullPracticeExam.upsert({
    where: { examNumber: exam.examNumber },
    create: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      formatSummary: exam.formatSummary,
      batchId: (exam.items[0]?.ngnPayload?.generationMeta as { batchId?: string })?.batchId,
      generationVersion: NAPLEX_FULL_EXAM_VERSION,
      qaPassed: exam.qaReport.allPassed,
      qaReport: exam.qaReport,
      active: exam.qaReport.allPassed,
    },
    update: {
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      formatSummary: exam.formatSummary,
      batchId: (exam.items[0]?.ngnPayload?.generationMeta as { batchId?: string })?.batchId,
      generationVersion: NAPLEX_FULL_EXAM_VERSION,
      qaPassed: exam.qaReport.allPassed,
      qaReport: exam.qaReport,
      active: exam.qaReport.allPassed,
    },
  });

  await prisma.naplexFullPracticeExamQuestion.deleteMany({
    where: { examId: examRecord.id },
  });

  await prisma.naplexFullPracticeExamQuestion.createMany({
    data: questionIds.map((q) => ({
      examId: examRecord.id,
      questionBankItemId: q.questionBankItemId,
      sortOrder: q.sortOrder,
      blueprintArea: q.blueprintArea,
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
