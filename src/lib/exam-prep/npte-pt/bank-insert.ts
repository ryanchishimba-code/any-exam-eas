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
const INSERT_CONCURRENCY = 8;

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

type PreparedRow = {
  item: BankItem;
  subjectId: string;
  hash: string;
  qc: ReturnType<typeof assessNptePtBankItem>;
};

function prepareRow(item: BankItem): PreparedRow {
  const subjectId = item.subjectId ?? item.topicCategory ?? "cardiovascular";
  const hash = bankItemContentHash("npte-pt", subjectId, item);
  const qc = assessNptePtBankItem(item, { source: "generated" });
  return { item, subjectId, hash, qc };
}

async function insertOne(
  prisma: PrismaClient,
  row: PreparedRow
): Promise<"created" | "skipped"> {
  const { item, subjectId, hash, qc } = row;
  const taskCategory =
    (item.ngnPayload?.taskCategory as string | undefined) ?? null;
  const blueprintTopic =
    (item.ngnPayload?.blueprintTopic as string | undefined) ?? null;
  const generationMeta = item.ngnPayload?.generationMeta ?? null;
  const qaPassed = qc.serveReady && qc.reviewStatus === "approved";

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
        qaPassed,
      },
    })
  );
  return "created";
}

export async function insertNptePtBankItems(
  prisma: PrismaClient,
  items: BankItem[]
): Promise<NptePtInsertResult> {
  if (items.length === 0) return { created: 0, skipped: 0 };

  const prepared = items.map(prepareRow);
  const hashes = prepared.map((row) => row.hash);
  const existing = await withDbRetry("findMany", () =>
    prisma.questionBankItem.findMany({
      where: { contentHash: { in: hashes } },
      select: { contentHash: true },
    })
  );
  const existingSet = new Set(existing.map((row) => row.contentHash));
  const toInsert = prepared.filter((row) => !existingSet.has(row.hash));
  let skipped = prepared.length - toInsert.length;

  let created = 0;
  for (let i = 0; i < toInsert.length; i += INSERT_CONCURRENCY) {
    const slice = toInsert.slice(i, i + INSERT_CONCURRENCY);
    const results = await Promise.all(
      slice.map((row) =>
        insertOne(prisma, row).catch((err) => {
          if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code?: string }).code === "P2002"
          ) {
            return "skipped" as const;
          }
          throw err;
        })
      )
    );
    for (const result of results) {
      if (result === "created") created++;
      else skipped++;
    }
  }

  return { created, skipped };
}
