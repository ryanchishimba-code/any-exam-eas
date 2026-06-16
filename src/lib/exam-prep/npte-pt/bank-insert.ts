/**
 * Insert NPTE-PT bank items with content-hash dedup and connection retries.
 */
import type { PrismaClient } from "@prisma/client";
import type { BankItem } from "@/lib/question-bank";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";
import { assessNptePtBankItem } from "./quality-gate";
import { NPTE_PT_GENERATION_VERSION } from "./types";

const MAX_DB_RETRIES = 4;
const DB_RETRY_BASE_MS = 1500;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function isConnectionError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("Closed") ||
    msg.includes("ECONNRESET") ||
    msg.includes("Connection") ||
    msg.includes("P1001") ||
    msg.includes("P1017")
  );
}

async function withDbRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isConnectionError(err) || attempt === MAX_DB_RETRIES) break;
      const waitMs = DB_RETRY_BASE_MS * attempt;
      console.warn(`[npte-pt] ${label} DB retry ${attempt}/${MAX_DB_RETRIES} in ${waitMs}ms…`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

export type NptePtInsertResult = {
  created: number;
  skipped: number;
};

export async function insertNptePtBankItems(
  prisma: PrismaClient,
  items: BankItem[]
): Promise<NptePtInsertResult> {
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const subjectId = item.subjectId ?? item.topicCategory ?? "cardiovascular";
    const hash = bankItemContentHash("npte-pt", subjectId, item);
    const exists = await withDbRetry("findUnique", () =>
      prisma.questionBankItem.findUnique({ where: { contentHash: hash }, select: { id: true } })
    );
    if (exists) {
      skipped++;
      continue;
    }

    const taskCategory =
      (item.ngnPayload?.taskCategory as string | undefined) ?? null;
    const blueprintTopic =
      (item.ngnPayload?.blueprintTopic as string | undefined) ?? null;
    const generationMeta = item.ngnPayload?.generationMeta ?? null;
    const qc = assessNptePtBankItem(item, { source: "generated" });

    await withDbRetry("create", () =>
      prisma.questionBankItem.create({
        data: {
          fieldId: "npte-pt",
          subjectId,
          scenario: item.vignette ?? null,
          difficulty: item.difficulty ?? 3,
          topicCategory: subjectId,
          blueprintDomain: item.blueprintDomain ?? subjectId,
          taskCategory,
          blueprintTopic,
          generationVersion: NPTE_PT_GENERATION_VERSION,
          reviewStatus: qc.reviewStatus,
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
          qaPassed: false,
        },
      })
    );
    created++;
  }

  return { created, skipped };
}
