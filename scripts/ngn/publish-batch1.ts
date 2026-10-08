#!/usr/bin/env node
/**
 * Publish NGN batch 1 into ngn_* tables only.
 *
 * Default is a dry run: validate the approved document against the keys file,
 * print the file sha256, and print batch counts before and after. Nothing is written.
 *
 *   npx tsx scripts/ngn/publish-batch1.ts
 *   npx tsx scripts/ngn/publish-batch1.ts --dry-run
 *   NGN_PUBLISH_CONFIRM=ngn-batch1-2026-10-08 npx tsx scripts/ngn/publish-batch1.ts --apply
 *
 * Requires DATABASE_URL for --apply and for live before/after counts.
 * A dry run with DATABASE_URL unset still validates and prints the planned counts.
 * Apply the migration prisma/migrations/20261008150000_ngn_manual_correction first.
 *
 * --apply refuses to run when VERCEL_ENV=production. Point DATABASE_URL at the
 * target database from a shell where VERCEL_ENV is unset.
 *
 * Re-running inserts only missing id+version rows. An existing row is not
 * rewritten: the only update is manual_correction=true when that flag is still
 * false. Scoring rules are copied from the document, which matches registry.ts
 * (zero_one, plus_minus, or rationale by response format).
 *
 * Rows are inserted as draft. Flip status with the pilot publish script after
 * this insert; that script updates status only and leaves manual_correction set:
 *   npx tsx scripts/ngn/publish.ts --batch ngn-batch1-2026-10-08 --owner-attest "Ryan Chishimba, PharmD" --license PharmD --accept-open-flags
 *   npx tsx scripts/ngn/publish.ts --batch ngn-batch1-2026-10-08 --owner-attest "Ryan Chishimba, PharmD" --license PharmD --accept-open-flags --apply
 *
 * This script never reads or writes QuestionBankItem, and it never edits
 * stems, options, keys, rationales, references, or sources.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertKeysMatchDocument,
  buildBatch1Plan,
  diffBatch1,
  formatBatchCounts,
  NGN_BATCH1_DOCUMENT,
  NGN_BATCH1_KEYS,
  NGN_PUBLISH_CONFIRM_ENV,
  projectBatchCounts,
  type Batch1Actions,
  type ExistingNgnRow,
  type NgnBatchCounts,
} from "../../src/lib/assessment/import/batch1";
import type { PilotDocument } from "../../src/lib/assessment/types";
import { loadEnvFiles } from "../load-env";

type CountRow = {
  batches: number;
  cases: number;
  items: number;
  manual_cases: number;
  manual_items: number;
};

type IdRow = { id: string; version: number; manual_correction: boolean };

type PrismaLike = {
  $transaction: <T>(fn: (tx: PrismaLike) => Promise<T>) => Promise<T>;
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
  ngnImportBatch: {
    findUnique: (args: { where: { batchId: string } }) => Promise<{ batchId: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  ngnCase: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id_version: { id: string; version: number } };
      data: { manualCorrection: true };
    }) => Promise<unknown>;
  };
  ngnItem: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id_version: { id: string; version: number } };
      data: { manualCorrection: true };
    }) => Promise<unknown>;
  };
  $disconnect: () => Promise<void>;
};

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function toCounts(row: CountRow | undefined): NgnBatchCounts {
  return {
    batches: row?.batches ?? 0,
    cases: row?.cases ?? 0,
    items: row?.items ?? 0,
    manualCorrectionCases: row?.manual_cases ?? 0,
    manualCorrectionItems: row?.manual_items ?? 0,
  };
}

function printLines(lines: string[]) {
  for (const line of lines) console.log(line);
}

async function readSnapshot(prisma: PrismaLike, batchId: string): Promise<{
  counts: NgnBatchCounts;
  batch: boolean;
  cases: ExistingNgnRow[];
  items: ExistingNgnRow[];
}> {
  const counts = await prisma.$queryRaw<CountRow[]>`
    SELECT
      (SELECT COUNT(*)::int FROM ngn_import_batch WHERE batch_id = ${batchId}) AS batches,
      (SELECT COUNT(*)::int FROM ngn_case WHERE batch_id = ${batchId}) AS cases,
      (SELECT COUNT(*)::int FROM ngn_item WHERE batch_id = ${batchId}) AS items,
      (SELECT COUNT(*)::int FROM ngn_case WHERE batch_id = ${batchId} AND manual_correction) AS manual_cases,
      (SELECT COUNT(*)::int FROM ngn_item WHERE batch_id = ${batchId} AND manual_correction) AS manual_items
  `;
  const cases = await prisma.$queryRaw<IdRow[]>`
    SELECT id, version, manual_correction FROM ngn_case WHERE batch_id = ${batchId}
  `;
  const items = await prisma.$queryRaw<IdRow[]>`
    SELECT id, version, manual_correction FROM ngn_item WHERE batch_id = ${batchId}
  `;
  return {
    counts: toCounts(counts[0]),
    batch: (counts[0]?.batches ?? 0) > 0,
    cases: cases.map((row) => ({
      id: row.id,
      version: row.version,
      manualCorrection: row.manual_correction,
    })),
    items: items.map((row) => ({
      id: row.id,
      version: row.version,
      manualCorrection: row.manual_correction,
    })),
  };
}

function printActions(actions: Batch1Actions) {
  console.log(
    `inserts: batch ${actions.insertBatch ? 1 : 0}, cases ${actions.insertCases.length}, items ${actions.insertItems.length}`
  );
  console.log(
    `manual_correction flag only: cases ${actions.flagCases.length}, items ${actions.flagItems.length}`
  );
  console.log(`unchanged: cases ${actions.unchangedCases}, items ${actions.unchangedItems}`);
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

async function applyWrites(prisma: PrismaLike, plan: ReturnType<typeof buildBatch1Plan>, actions: Batch1Actions) {
  await prisma.$transaction(async (tx) => {
    if (actions.insertBatch) {
      await tx.ngnImportBatch.create({
        data: {
          batchId: plan.batch.batchId,
          schemaVersion: plan.batch.schemaVersion,
          boardProfile: plan.batch.boardProfile,
          sourceSha256: plan.batch.sourceSha256,
          sources: plan.batch.sources,
          rowCounts: plan.batch.rowCounts,
          notes: plan.batch.notes,
          importedBy: process.env.USER || process.env.USERNAME || "publish-batch1",
        },
      });
    }
    for (const row of actions.insertCases) {
      await tx.ngnCase.create({ data: { ...row, manualCorrection: true } });
    }
    for (const row of actions.flagCases) {
      await tx.ngnCase.update({
        where: { id_version: { id: row.id, version: row.version } },
        data: { manualCorrection: true },
      });
    }
    for (const row of actions.insertItems) {
      await tx.ngnItem.create({ data: { ...row, manualCorrection: true } });
    }
    for (const row of actions.flagItems) {
      await tx.ngnItem.update({
        where: { id_version: { id: row.id, version: row.version } },
        data: { manualCorrection: true },
      });
    }
  });
}

async function main() {
  const apply = hasFlag("--apply");
  const dryRun = hasFlag("--dry-run") || !apply;
  if (apply && hasFlag("--dry-run")) fail("Pass either --dry-run or --apply, not both.");

  const file = resolve(argValue("--file") ?? NGN_BATCH1_DOCUMENT);
  const keysFile = resolve(argValue("--keys") ?? NGN_BATCH1_KEYS);
  const bytes = readFileSync(file);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const doc = JSON.parse(bytes.toString("utf8")) as PilotDocument;
  const keys = JSON.parse(readFileSync(keysFile, "utf8")) as unknown;
  assertKeysMatchDocument(doc, keys);
  const plan = buildBatch1Plan(doc, sha256);
  const errors = plan.issues.filter((issue) => issue.level === "error");
  const warnings = plan.issues.filter((issue) => issue.level === "warning");

  console.log(`NGN batch 1 publish — ${apply ? "APPLY" : "DRY RUN (no database writes)"}`);
  console.log(`file: ${file}`);
  console.log(`keys: ${keysFile}`);
  console.log(`sha256: ${sha256}`);
  console.log(`batch: ${plan.batch.batchId}`);
  console.log(`schema: ${plan.batch.schemaVersion}`);
  console.log(`board: ${plan.batch.boardProfile}`);
  console.log(`validators: ${errors.length} errors, ${warnings.length} warnings`);
  for (const issue of errors.slice(0, 40)) console.log(`  error ${issue.path}: ${issue.message}`);
  console.log("scoring rules: copied from the document (registry zero_one / plus_minus / rationale by format)");
  if (errors.length > 0) fail("Refusing to continue because validators reported errors.");

  const absent: NgnBatchCounts = {
    batches: 0,
    cases: 0,
    items: 0,
    manualCorrectionCases: 0,
    manualCorrectionItems: 0,
  };

  if (!process.env.DATABASE_URL) loadEnvFiles();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    if (apply) fail("DATABASE_URL is not set.");
    const actions = diffBatch1(plan, { batch: false, cases: [], items: [] });
    console.log("database: not contacted (DATABASE_URL unset)");
    printLines(formatBatchCounts("before", absent));
    printLines(formatBatchCounts("after (planned if this batch is absent)", projectBatchCounts(absent, actions)));
    printActions(actions);
    console.log("Dry run complete. No rows written.");
    console.log(
      `Re-run with ${NGN_PUBLISH_CONFIRM_ENV}=${plan.batch.batchId} and --apply to insert. Status stays draft.`
    );
    return;
  }

  if (!dryRun) {
    if (process.env.VERCEL_ENV === "production") fail("Refusing --apply when VERCEL_ENV=production.");
    if (process.env[NGN_PUBLISH_CONFIRM_ENV] !== plan.batch.batchId) {
      fail(`Refusing --apply. Set ${NGN_PUBLISH_CONFIRM_ENV}=${plan.batch.batchId} to confirm this batch.`);
    }
  }

  await withPrisma(async (prisma) => {
    const before = await readSnapshot(prisma, plan.batch.batchId);
    const actions = diffBatch1(plan, before);
    printLines(formatBatchCounts("before", before.counts));
    printLines(formatBatchCounts(apply ? "after (planned)" : "after (planned, no writes)", projectBatchCounts(before.counts, actions)));
    printActions(actions);
    if (!apply) {
      console.log("Dry run complete. No rows written.");
      console.log(
        `Re-run with ${NGN_PUBLISH_CONFIRM_ENV}=${plan.batch.batchId} and --apply to insert. Status stays draft.`
      );
      return;
    }
    await applyWrites(prisma, plan, actions);
    const after = await readSnapshot(prisma, plan.batch.batchId);
    printLines(formatBatchCounts("after", after.counts));
    console.log("apply complete. New rows are draft with manual_correction=true.");
    console.log("No QuestionBankItem rows were written. Stems, keys, and rationales were not edited.");
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
