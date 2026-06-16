/**
 * Insert NCLEX full-exam items into question bank.
 */
import type { PrismaClient } from "@prisma/client";
import type { BankItem } from "@/lib/question-bank";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { assessNclexFullExamItem } from "./quality-gate";
import { NCLEX_FULL_EXAM_VERSION } from "./types";

export type NclexInsertResult = {
  created: number;
  skipped: number;
};

export async function insertNclexFullExamItems(
  prisma: PrismaClient,
  items: BankItem[]
): Promise<NclexInsertResult> {
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const subjectId = item.subjectId ?? "management-of-care";
    const hash = bankItemContentHash("nursing", subjectId, item);
    const exists = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });
    if (exists) {
      skipped++;
      continue;
    }

    const qc = assessNclexFullExamItem(item, created);
    const generationMeta = item.ngnPayload?.generationMeta ?? null;

    await prisma.questionBankItem.create({
      data: {
        fieldId: "nursing",
        subjectId,
        scenario: item.vignette ?? null,
        difficulty: item.difficulty ?? 3,
        topicCategory: item.topicCategory ?? subjectId,
        blueprintDomain: item.blueprintDomain ?? "nclex-physiological",
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
    created++;
  }

  return { created, skipped };
}
