#!/usr/bin/env node
/**
 * Publish Ryan-approved NGN gap-fill batch into ngn_* tables (published status).
 *
 *   npx tsx scripts/data/ngn300-gapfill-20261025/insert-publish.ts
 *   npx tsx scripts/data/ngn300-gapfill-20261025/insert-publish.ts --dry-run-transaction
 *   NGN_GAPFILL_CONFIRM=ngn300-gapfill-2026-10-25 npx tsx scripts/data/ngn300-gapfill-20261025/insert-publish.ts --apply
 *
 * Idempotent: skips existing (id, version) rows. Never updates other batches.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BATCH_ID,
  DATA_DIR,
  ITEMS_PATH,
  UNDO_PATH,
  assertScoringKeys,
  batchMeta,
  buildUndoManifest,
  fileSha256,
  loadGapfillFile,
  loadSourcesSupplement,
  mergeSources,
  prismaRowsFromFile,
  toPilotDocument,
  validateGapfillForPublish,
} from "./gapfill-lib";
import { catalogCountsFromRows, type ServeCase, type ServeItem } from "./catalog-counts";
import type { SourceRef } from "@/lib/assessment/types";
import { loadEnvFiles } from "../../load-env";

const CONFIRM_ENV = "NGN_GAPFILL_CONFIRM";
const BACKUP_DIR = resolve(DATA_DIR, "backup");

type PrismaLike = {
  $transaction: <T>(fn: (tx: PrismaLike) => Promise<T>, opts?: { timeout?: number }) => Promise<T>;
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
  ngnImportBatch: {
    findUnique: (args: { where: { batchId: string } }) => Promise<{ batchId: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  ngnCase: {
    findUnique: (args: { where: { id_version: { id: string; version: number } } }) => Promise<unknown | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: { where?: Record<string, unknown> }) => Promise<ServeCaseRow[]>;
  };
  ngnItem: {
    findUnique: (args: { where: { id_version: { id: string; version: number } } }) => Promise<unknown | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: { where?: Record<string, unknown> }) => Promise<ServeItemRow[]>;
  };
  $disconnect: () => Promise<void>;
};

type ServeCaseRow = {
  id: string;
  version: number;
  batchId: string;
  boardProfile: string;
  status: string;
  title: string;
  primaryClientNeed: string;
  setting: string;
  patient: unknown;
  timepoints: unknown;
  chart: unknown;
  revealRule: string;
  references: unknown;
};

type ServeItemRow = {
  id: string;
  version: number;
  batchId: string;
  caseId: string | null;
  caseVersion: number | null;
  caseStep: number | null;
  itemType: string;
  cjmmFunction: unknown;
  timepoint: string | null;
  responseFormat: string;
  scoringRule: string;
  maxPoints: number;
  stem: string;
  payload: unknown;
  exhibit: unknown;
  rationale: unknown;
  clientNeeds: unknown;
  references: unknown;
  rnFlags: unknown;
  status: string;
};

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function rowsToServe(cases: ServeCaseRow[], items: ServeItemRow[]): { cases: ServeCase[]; items: ServeItem[] } {
  return {
    cases: cases.map((row) => ({
      id: row.id,
      version: row.version,
      batchId: row.batchId,
      boardProfile: row.boardProfile,
      status: row.status,
      title: row.title,
      primaryClientNeed: row.primaryClientNeed,
      setting: row.setting,
      patient: row.patient as ServeCase["patient"],
      timepoints: row.timepoints as ServeCase["timepoints"],
      chart: row.chart as ServeCase["chart"],
      revealRule: row.revealRule,
      references: (Array.isArray(row.references) ? row.references : []) as ServeCase["references"],
    })),
    items: items.map((row) => ({
      id: row.id,
      version: row.version,
      batchId: row.batchId,
      itemType: row.itemType as ServeItem["itemType"],
      caseId: row.caseId,
      caseStep: row.caseStep,
      caseVersion: row.caseVersion,
      cjmmFunction: (Array.isArray(row.cjmmFunction) || typeof row.cjmmFunction === "string"
        ? row.cjmmFunction
        : []) as ServeItem["cjmmFunction"],
      timepoint: row.timepoint,
      responseFormat: row.responseFormat as ServeItem["responseFormat"],
      scoringRule: row.scoringRule as ServeItem["scoringRule"],
      maxPoints: row.maxPoints,
      stem: row.stem,
      payload: (row.payload ?? {}) as ServeItem["payload"],
      exhibit: row.exhibit as ServeItem["exhibit"],
      rationale: row.rationale as ServeItem["rationale"],
      clientNeeds: (row.clientNeeds ?? {}) as ServeItem["clientNeeds"],
      references: (Array.isArray(row.references) ? row.references : []) as ServeItem["references"],
      rnFlags: Array.isArray(row.rnFlags)
        ? row.rnFlags.filter((flag): flag is string => typeof flag === "string")
        : [],
      status: row.status,
    })),
  };
}

async function readCatalog(prisma: PrismaLike) {
  const cases = await prisma.ngnCase.findMany();
  const items = await prisma.ngnItem.findMany();
  const mapped = rowsToServe(cases, items);
  return catalogCountsFromRows(mapped.cases, mapped.items);
}

async function insertBatch(prisma: PrismaLike, meta: ReturnType<typeof batchMeta>, actions: InsertPlan) {
  if (actions.insertBatch) {
    await prisma.ngnImportBatch.create({
      data: {
        batchId: meta.batchId,
        schemaVersion: meta.schemaVersion,
        boardProfile: meta.boardProfile,
        sourceSha256: meta.sourceSha256,
        sources: meta.sources,
        rowCounts: meta.rowCounts,
        notes: meta.notes,
        importedBy: process.env.USER || process.env.USERNAME || "ngn300-gapfill",
      },
    });
  }
  for (const row of actions.insertCases) {
    await prisma.ngnCase.create({ data: row });
  }
  for (const row of actions.insertItems) {
    await prisma.ngnItem.create({ data: row });
  }
}

type InsertPlan = {
  insertBatch: boolean;
  insertCases: ReturnType<typeof prismaRowsFromFile>["cases"];
  insertItems: ReturnType<typeof prismaRowsFromFile>["items"];
};

async function planInserts(prisma: PrismaLike, file: ReturnType<typeof loadGapfillFile>): Promise<InsertPlan> {
  const { cases, items } = prismaRowsFromFile(file);
  const existingBatch = await prisma.ngnImportBatch.findUnique({ where: { batchId: BATCH_ID } });
  const insertCases: InsertPlan["insertCases"] = [];
  const insertItems: InsertPlan["insertItems"] = [];
  for (const row of cases) {
    const existing = await prisma.ngnCase.findUnique({
      where: { id_version: { id: row.id, version: row.version } },
    });
    if (!existing) insertCases.push(row);
  }
  for (const row of items) {
    const existing = await prisma.ngnItem.findUnique({
      where: { id_version: { id: row.id, version: row.version } },
    });
    if (!existing) insertItems.push(row);
  }
  return {
    insertBatch: !existingBatch,
    insertCases,
    insertItems,
  };
}

async function withPrisma<T>(fn: (prisma: PrismaLike) => Promise<T>): Promise<T> {
  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set.");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient() as unknown as PrismaLike;
  try {
    return await fn(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const apply = hasFlag("--apply");
  const validateOnly = hasFlag("--validate-only");
  const file = loadGapfillFile();
  const sha256 = fileSha256();
  const supplement = loadSourcesSupplement();

  const batchSources = mergeSources([], supplement);
  const doc = toPilotDocument(file, batchSources);
  const publishErrors = validateGapfillForPublish(file, batchSources);
  const scoringErrors = assertScoringKeys(doc);

  console.log(`NGN gap-fill ${BATCH_ID} — ${apply ? "APPLY" : validateOnly ? "VALIDATE" : "DRY RUN"}`);
  console.log(`items file: ${ITEMS_PATH}`);
  console.log(`sha256: ${sha256}`);
  console.log(`planned rows: cases ${file.cases.length}, items ${file.items.length} (published)`);

  if (publishErrors.length > 0) {
    console.error("\nPublish validation errors:");
    for (const message of publishErrors) console.error(`  ${message}`);
    fail(`Refusing to continue: ${publishErrors.length} validation error(s).`);
  }
  if (scoringErrors.length > 0) {
    console.error("\nScoring/key errors:");
    for (const message of scoringErrors) console.error(`  ${message}`);
    fail(`Refusing to continue: ${scoringErrors.length} scoring error(s).`);
  }
  console.log("publish validation: ok");
  console.log("scoring: all items accept a perfect response at maxPoints");

  if (validateOnly) return;

  await withPrisma(async (prisma) => {
    const before = await readCatalog(prisma);
    console.log("\nCatalog before:", before);

    const plan = await planInserts(prisma, file);
    console.log(
      `\nInserts planned: batch ${plan.insertBatch ? 1 : 0}, cases ${plan.insertCases.length}, items ${plan.insertItems.length}`
    );

    const meta = batchMeta(file, sha256, batchSources);

    if (!apply) {
      await prisma.$transaction(
        async (tx) => {
          await insertBatch(tx, meta, plan);
          const after = await readCatalog(tx);
          console.log("\nCatalog after (transaction, will roll back):", after);
          if (after.scoredItems !== before.scoredItems + file.items.length) {
            throw new Error(
              `expected scoredItems ${before.scoredItems + file.items.length}, got ${after.scoredItems}`
            );
          }
          throw new Error("ROLLBACK_DRY_RUN");
        },
        { timeout: 120_000 }
      ).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (message !== "ROLLBACK_DRY_RUN") throw error;
      });
      console.log("\nDry run complete (transaction rolled back).");
      console.log(`Expected published scored catalog: ${before.scoredItems + file.items.length}`);
      return;
    }

    if (process.env[CONFIRM_ENV] !== BATCH_ID) {
      fail(`Refusing --apply. Set ${CONFIRM_ENV}=${BATCH_ID}`);
    }

    mkdirSync(BACKUP_DIR, { recursive: true });
    writeFileSync(
      resolve(BACKUP_DIR, "catalog-before.json"),
      JSON.stringify({ captured_at: new Date().toISOString(), ...before }, null, 2)
    );

    await insertBatch(prisma, meta, plan);
    const after = await readCatalog(prisma);
    console.log("\nCatalog after apply:", after);

    const undo = buildUndoManifest(file, process.env.NGN_GAPFILL_SNAPSHOT_ID);
    writeFileSync(UNDO_PATH, JSON.stringify(undo, null, 2));
    writeFileSync(resolve(BACKUP_DIR, "undo-manifest.json"), JSON.stringify(undo, null, 2));

    console.log(`\nApply complete. Undo manifest: ${UNDO_PATH}`);
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
