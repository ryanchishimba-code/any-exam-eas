import { Prisma } from "@prisma/client";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  generateBulkQuestionsForSubject,
  MIN_QUESTIONS_PER_SUBJECT,
} from "@/lib/bulk-question-generator";
import {
  collectAllSubjectAreas,
  collectSeedQuestionRows,
} from "@/lib/question-bank-seed";
import type { FieldSubject } from "./field-subjects";
import type { BankItem } from "./question-bank";
import { bankItemPassesIngestGate } from "@/lib/exam-prep/bank-ingest-gate";
import { serializeBankOptions } from "@/lib/mpje/parse-bank-options";

export type SyncQuestionBankResult = {
  status: "success" | "failed";
  itemsTotal: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsSkipped: number;
  itemsRetired: number;
  subjectsToppedUp: number;
  errorMessage?: string;
};

/** SQLite caps bind variables per statement (~999); keep batches small. */
const BATCH_SIZE = 40;

export function questionContentHash(
  fieldId: string,
  subjectId: string,
  question: string
): string {
  return createHash("sha256")
    .update(`${fieldId}|${subjectId}|${question.trim().toLowerCase()}`)
    .digest("hex");
}

/** Hash including scenario/vignette so split vignette updates do not collide. */
export function bankItemContentHash(
  fieldId: string,
  subjectId: string,
  item: Pick<BankItem, "question" | "vignette" | "scenario">
): string {
  const scenario = (item.vignette ?? item.scenario ?? "").trim().toLowerCase();
  const stem = item.question.trim().toLowerCase();
  return createHash("sha256")
    .update(`${fieldId}|${subjectId}|${scenario}|${stem}`)
    .digest("hex");
}

let inFlightSync: Promise<SyncQuestionBankResult> | null = null;

/** Upsert seed questions and top up each subject to MIN_QUESTIONS_PER_SUBJECT. */
export async function syncQuestionBank(): Promise<SyncQuestionBankResult> {
  if (inFlightSync) return inFlightSync;

  inFlightSync = runSync().finally(() => {
    inFlightSync = null;
  });

  return inFlightSync;
}

function resolveQaPassed(fieldId: string, item: BankItem, source: "seed" | "generated"): boolean {
  return bankItemPassesIngestGate(fieldId, item, source);
}

function rowToCreateData(
  fieldId: string,
  subjectId: string,
  item: BankItem,
  source: "seed" | "generated"
) {
  const contentHash = bankItemContentHash(fieldId, subjectId, item);
  const taskCategory =
    item.taskCategory ??
    (typeof item.ngnPayload?.taskCategory === "string"
      ? item.ngnPayload.taskCategory
      : null);
  const patientAgeGroup =
    item.patientAgeGroup ??
    (typeof item.ngnPayload?.patientAgeGroup === "string"
      ? item.ngnPayload.patientAgeGroup
      : null);
  const blueprintTopic =
    item.blueprintTopic ??
    (typeof item.ngnPayload?.blueprintTopic === "string"
      ? item.ngnPayload.blueprintTopic
      : null);
  const generationMeta =
    item.generationMeta ??
    (item.ngnPayload?.generationMeta as Record<string, unknown> | undefined);

  return {
    fieldId,
    subjectId,
    stateCode: item.stateCode ?? null,
    scenario: item.vignette ?? item.scenario ?? null,
    difficulty: item.difficulty ?? null,
    topicCategory: item.topicCategory ?? null,
    blueprintDomain: item.blueprintDomain ?? null,
    taskCategory,
    patientAgeGroup,
    blueprintTopic,
    generationVersion: item.generationVersion ?? null,
    reviewStatus:
      item.reviewStatus ??
      (source === "seed" && item.tags?.includes("physician-educator")
        ? "approved"
        : "pending"),
    lastReviewedAt:
      item.reviewStatus === "approved" || item.tags?.includes("physician-educator")
        ? new Date()
        : null,
    generationMeta: generationMeta
      ? (generationMeta as Prisma.InputJsonValue)
      : undefined,
    itemType: item.itemType ?? "mcq",
    stepLevel:
      typeof item.ngnPayload?.stepLevel === "string"
        ? (item.ngnPayload.stepLevel as string)
        : null,
    question: item.question,
    options: serializeBankOptions(item),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps ? JSON.stringify(item.solutionSteps) : null,
    tags: item.tags ? JSON.stringify(item.tags) : null,
    references: item.references?.length ? item.references : undefined,
    source,
    contentHash,
    active: true,
    qaPassed: resolveQaPassed(fieldId, item, source),
  };
}

async function insertBatch(
  rows: ReturnType<typeof rowToCreateData>[]
): Promise<number> {
  if (rows.length === 0) return 0;

  const hashes = rows.map((r) => r.contentHash);
  const existing = await prisma.questionBankItem.findMany({
    where: { contentHash: { in: hashes } },
    select: { contentHash: true },
  });
  const seen = new Set(existing.map((e) => e.contentHash));
  const freshByHash = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (!seen.has(row.contentHash) && !freshByHash.has(row.contentHash)) {
      freshByHash.set(row.contentHash, row);
    }
  }
  const fresh = [...freshByHash.values()];
  if (fresh.length === 0) return 0;

  const result = await prisma.questionBankItem.createMany({ data: fresh, skipDuplicates: true });
  return result.count;
}

async function upsertSeedRow(
  row: ReturnType<typeof collectSeedQuestionRows>[number]
): Promise<"created" | "updated" | "skipped"> {
  const data = rowToCreateData(row.fieldId, row.subjectId, row.item, "seed");

  const existing = await prisma.questionBankItem.findUnique({
    where: { contentHash: data.contentHash },
  });

  if (!existing) {
    await prisma.questionBankItem.create({ data });
    return "created";
  }

  const unchanged =
    existing.question === data.question &&
    existing.correctAnswer === data.correctAnswer &&
    existing.options === data.options &&
    existing.active;

  if (unchanged) return "skipped";

  await prisma.questionBankItem.update({
    where: { contentHash: data.contentHash },
    data,
  });
  return "updated";
}

async function topUpSubject(fieldId: string, subject: FieldSubject): Promise<number> {
  // PANCE and AANP FNP banks are filled via curated seeds + AI batch generation — not procedural bulk templates.
  if (fieldId === "pance" || fieldId === "aanp-fnp") return 0;

  const existingCount = await prisma.questionBankItem.count({
    where: { fieldId, subjectId: subject.id, active: true },
  });

  const needed = MIN_QUESTIONS_PER_SUBJECT - existingCount;
  if (needed <= 0) return 0;

  const bulk = generateBulkQuestionsForSubject(
    fieldId,
    subject,
    existingCount,
    needed
  ).filter((item) => bankItemPassesIngestGate(fieldId, item, "generated"));

  let created = 0;
  for (let i = 0; i < bulk.length; i += BATCH_SIZE) {
    const slice = bulk.slice(i, i + BATCH_SIZE);
    const rows = slice.map((item) =>
      rowToCreateData(fieldId, subject.id, item, "generated")
    );
    created += await insertBatch(rows);
  }

  if (created < needed) {
    console.warn(
      `[question-bank] ${fieldId}/${subject.label}: created ${created} of ${needed} requested`
    );
  }

  return created;
}

async function runSync(): Promise<SyncQuestionBankResult> {
  const seeds = collectSeedQuestionRows();
  let itemsCreated = 0;
  let itemsUpdated = 0;
  let itemsSkipped = 0;
  let bulkCreated = 0;
  let subjectsToppedUp = 0;
  const activeHashes = new Set<string>();

  try {
    for (const row of seeds) {
      activeHashes.add(
        bankItemContentHash(row.fieldId, row.subjectId, row.item)
      );
      const result = await upsertSeedRow(row);
      if (result === "created") itemsCreated++;
      else if (result === "updated") itemsUpdated++;
      else itemsSkipped++;
    }

    const retired = await prisma.questionBankItem.updateMany({
      where: {
        source: "seed",
        contentHash: { notIn: [...activeHashes] },
        active: true,
      },
      data: { active: false },
    });

    for (const { fieldId, subject } of collectAllSubjectAreas()) {
      const added = await topUpSubject(fieldId, subject);
      if (added > 0) subjectsToppedUp++;
      bulkCreated += added;
    }

    const result: SyncQuestionBankResult = {
      status: "success",
      itemsTotal: seeds.length + bulkCreated,
      itemsCreated: itemsCreated + bulkCreated,
      itemsUpdated,
      itemsSkipped,
      itemsRetired: retired.count,
      subjectsToppedUp,
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
      subjectsToppedUp: 0,
      errorMessage: message,
    };
  }
}

export async function subjectBankNeedsTopUp(): Promise<boolean> {
  for (const { fieldId, subject } of collectAllSubjectAreas()) {
    const count = await prisma.questionBankItem.count({
      where: { fieldId, subjectId: subject.id, active: true },
    });
    if (count < MIN_QUESTIONS_PER_SUBJECT) return true;
  }
  return false;
}

/**
 * Local dev only — full bank sync can insert ~78k rows and exceeds serverless limits.
 * On Vercel, rely on `vercel-build` (with DATABASE_URL on Build) or the weekly cron job.
 */
export async function ensureQuestionBankSeeded(): Promise<void> {
  if (process.env.VERCEL) return;

  if (await subjectBankNeedsTopUp()) {
    await syncQuestionBank();
  }
}

export async function getLastQuestionBankSync() {
  return prisma.questionBankSync.findFirst({
    orderBy: { finishedAt: "desc" },
  });
}

export async function getSubjectQuestionCount(fieldId: string, subjectId: string) {
  return prisma.questionBankItem.count({
    where: { fieldId, subjectId, active: true },
  });
}
