/**
 * Insert NCLEX full-exam items and exam metadata into the database.
 */
import type { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { assessNclexFullExamItem } from "./quality-gate";
import type { NclexFullExamBundle } from "./types";
import { NCLEX_FULL_EXAM_VERSION } from "./types";

export type NclexInsertResult = {
  examId: string;
  created: number;
  skipped: number;
  linked: number;
  /** Items without a resolvable bank row (legacy alias). */
  missing: number;
};

export async function insertNclexFullExamItems(
  prisma: PrismaClient,
  exam: NclexFullExamBundle,
  opts?: { batchId?: string }
): Promise<NclexInsertResult> {
  let created = 0;
  let skipped = 0;
  let missing = 0;
  const links: {
    sortOrder: number;
    questionBankItemId: string;
    clientNeedsCategory?: string;
    itemFormat?: string;
  }[] = [];

  for (let i = 0; i < exam.items.length; i++) {
    const item = exam.items[i]!;
    const subjectId = item.subjectId ?? "basic-care-comfort";
    const hash = bankItemContentHash("nursing", subjectId, item);
    const sortOrder = i + 1;

    let questionBankItemId: string | undefined;

    if (item.id) {
      const byId = await prisma.questionBankItem.findUnique({
        where: { id: item.id },
        select: { id: true },
      });
      if (byId) {
        questionBankItemId = byId.id;
        skipped++;
      }
    }

    if (!questionBankItemId) {
      const existing = await prisma.questionBankItem.findUnique({
        where: { contentHash: hash },
        select: { id: true },
      });

      if (existing) {
        questionBankItemId = existing.id;
        skipped++;
      } else {
        const qc = assessNclexFullExamItem(item, i);
        const generationMeta = item.ngnPayload?.generationMeta ?? null;

        const createdItem = await prisma.questionBankItem.create({
          data: {
            fieldId: "nursing",
            subjectId,
            scenario: item.vignette ?? item.scenario ?? null,
            difficulty: item.difficulty ?? 3,
            topicCategory: item.topicCategory ?? subjectId,
            blueprintDomain: item.blueprintDomain ?? undefined,
            blueprintTopic:
              (item.ngnPayload?.blueprintTopic as string | undefined) ?? undefined,
            generationVersion: NCLEX_FULL_EXAM_VERSION,
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
    }

    if (!questionBankItemId) {
      missing++;
      continue;
    }

    links.push({
      sortOrder,
      questionBankItemId,
      clientNeedsCategory: item.topicCategory ?? item.subjectId ?? undefined,
      itemFormat: item.itemType ?? "vignette",
    });
  }

  const batchId =
    opts?.batchId ??
    (exam.items[0]?.ngnPayload?.generationMeta as { batchId?: string } | undefined)?.batchId;

  const examRecord = await prisma.nclexFullPracticeExam.upsert({
    where: { examNumber: exam.examNumber },
    create: {
      examNumber: exam.examNumber,
      title: exam.title,
      questionCount: exam.items.length,
      blueprintSummary: exam.blueprintSummary,
      caseStudySummary: exam.caseStudyGroups,
      batchId,
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
      batchId,
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

  return {
    examId: examRecord.id,
    created,
    skipped,
    linked: links.length,
    missing,
  };
}
