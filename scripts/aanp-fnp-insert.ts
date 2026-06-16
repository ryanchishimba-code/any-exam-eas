/**
 * Shared Neon insert helpers for AANP FNP generation scripts.
 */
import { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { AANP_FNP_GENERATION_VERSION } from "@/lib/exam-prep/aanp-fnp";
import { aanpFnpPassesHybridIngestGate } from "@/lib/exam-prep/aanp-fnp/hybrid-gate";
import type { BankItem } from "@/lib/question-bank";

export async function insertAanpFnpGeneratedItems(
  prisma: PrismaClient,
  items: BankItem[]
): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const subjectId = item.subjectId ?? "assess";
    const hash = bankItemContentHash("aanp-fnp", subjectId, item);
    const exists = await prisma.questionBankItem.findUnique({ where: { contentHash: hash } });
    if (exists) {
      skipped++;
      continue;
    }

    const patientAgeGroup =
      item.patientAgeGroup ??
      (item.ngnPayload?.patientAgeGroup as string | undefined) ??
      null;
    const blueprintTopic =
      item.blueprintTopic ??
      (item.ngnPayload?.blueprintTopic as string | undefined) ??
      null;
    const generationMeta = item.ngnPayload?.generationMeta ?? null;

    const ingestReady = aanpFnpPassesHybridIngestGate(item, "generated");
    const reviewStatus =
      (generationMeta as { reviewStatus?: string } | null)?.reviewStatus ??
      (ingestReady ? "approved" : "rejected");

    await prisma.questionBankItem.create({
      data: {
        fieldId: "aanp-fnp",
        subjectId,
        scenario: item.vignette ?? null,
        difficulty: item.difficulty ?? 3,
        topicCategory: item.topicCategory ?? subjectId,
        blueprintDomain: item.blueprintDomain ?? item.ngnPayload?.blueprintDomain ?? "assess",
        patientAgeGroup,
        blueprintTopic,
        generationVersion: AANP_FNP_GENERATION_VERSION,
        reviewStatus,
        generationMeta: generationMeta ?? undefined,
        itemType: "vignette",
        question: item.question,
        options: serializeBankOptions(item),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        tags: item.tags ? JSON.stringify(item.tags) : null,
        references: item.references?.length ? item.references : undefined,
        source: "generated",
        contentHash: hash,
        active: true,
        qaPassed: ingestReady,
        qaAuditedAt: ingestReady ? new Date() : undefined,
      },
    });
    created++;
  }

  return { created, skipped };
}
