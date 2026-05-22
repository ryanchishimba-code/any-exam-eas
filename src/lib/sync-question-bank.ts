import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { collectSeedQuestionRows } from "@/lib/question-bank-seed";

export type SyncQuestionBankResult = {
  status: "success" | "failed";
  itemsTotal: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsSkipped: number;
  itemsRetired: number;
  errorMessage?: string;
};

export function questionContentHash(
  fieldId: string,
  subjectId: string,
  question: string
): string {
  return createHash("sha256")
    .update(`${fieldId}|${subjectId}|${question.trim().toLowerCase()}`)
    .digest("hex");
}

let inFlightSync: Promise<SyncQuestionBankResult> | null = null;

/** Upsert seed questions from repo sources; retire seed rows no longer in the bundle. */
export async function syncQuestionBank(): Promise<SyncQuestionBankResult> {
  if (inFlightSync) return inFlightSync;

  inFlightSync = runSync().finally(() => {
    inFlightSync = null;
  });

  return inFlightSync;
}

async function runSync(): Promise<SyncQuestionBankResult> {
  const seeds = collectSeedQuestionRows();
  let itemsCreated = 0;
  let itemsUpdated = 0;
  let itemsSkipped = 0;
  const activeHashes = new Set<string>();

  try {
    for (const row of seeds) {
      const contentHash = questionContentHash(row.fieldId, row.subjectId, row.item.question);
      activeHashes.add(contentHash);

      const data = {
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        question: row.item.question,
        options: JSON.stringify(row.item.options),
        correctAnswer: row.item.correctAnswer,
        explanation: row.item.explanation,
        solutionSteps: row.item.solutionSteps
          ? JSON.stringify(row.item.solutionSteps)
          : null,
        tags: row.item.tags ? JSON.stringify(row.item.tags) : null,
        source: row.source,
        active: true,
      };

      const existing = await prisma.questionBankItem.findUnique({
        where: { contentHash },
      });

      if (!existing) {
        await prisma.questionBankItem.create({ data: { ...data, contentHash } });
        itemsCreated++;
      } else {
        const unchanged =
          existing.question === data.question &&
          existing.correctAnswer === data.correctAnswer &&
          existing.options === data.options &&
          existing.active;

        if (unchanged) {
          itemsSkipped++;
        } else {
          await prisma.questionBankItem.update({
            where: { contentHash },
            data,
          });
          itemsUpdated++;
        }
      }
    }

    const retired = await prisma.questionBankItem.updateMany({
      where: {
        source: "seed",
        contentHash: { notIn: [...activeHashes] },
        active: true,
      },
      data: { active: false },
    });

    const result: SyncQuestionBankResult = {
      status: "success",
      itemsTotal: seeds.length,
      itemsCreated,
      itemsUpdated,
      itemsSkipped,
      itemsRetired: retired.count,
    };

    await prisma.questionBankSync.create({
      data: {
        status: result.status,
        itemsTotal: result.itemsTotal,
        itemsCreated: result.itemsCreated,
        itemsUpdated: result.itemsUpdated,
        itemsSkipped: result.itemsSkipped,
        itemsRetired: result.itemsRetired,
      },
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error";
    await prisma.questionBankSync.create({
      data: {
        status: "failed",
        itemsTotal: seeds.length,
        itemsCreated,
        itemsUpdated,
        itemsSkipped,
        itemsRetired: 0,
        errorMessage: message,
      },
    });
    return {
      status: "failed",
      itemsTotal: seeds.length,
      itemsCreated,
      itemsUpdated,
      itemsSkipped,
      itemsRetired: 0,
      errorMessage: message,
    };
  }
}

/** Seed the DB on first use when empty (local dev convenience). */
export async function ensureQuestionBankSeeded(): Promise<void> {
  const count = await prisma.questionBankItem.count({ where: { active: true } });
  if (count > 0) return;
  await syncQuestionBank();
}

export async function getLastQuestionBankSync() {
  return prisma.questionBankSync.findFirst({
    orderBy: { finishedAt: "desc" },
  });
}
