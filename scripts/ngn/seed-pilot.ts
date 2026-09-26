#!/usr/bin/env node
/**
 * Seed or restore the NGN pilot into ngn_* tables only.
 *
 * Default is a dry run: parse, validate, print the file sha256 and planned
 * inserts. Nothing is written.
 *
 *   npx tsx scripts/ngn/seed-pilot.ts
 *   npx tsx scripts/ngn/seed-pilot.ts --file content/ngn-pilot/pilot-items.json
 *   NGN_SEED_CONFIRM=ngn-pilot-2026-09-26 npx tsx scripts/ngn/seed-pilot.ts --apply
 *
 * Restore (deletes only rows for that batch_id):
 *   npx tsx scripts/ngn/seed-pilot.ts --restore --batch ngn-pilot-2026-09-26
 *   npx tsx scripts/ngn/seed-pilot.ts --restore --batch ngn-pilot-2026-09-26 --apply
 *   npx tsx scripts/ngn/seed-pilot.ts --restore --batch ngn-pilot-2026-09-26 --apply --include-reviews
 *
 * Do not point DATABASE_URL at production. This script refuses --apply when
 * VERCEL_ENV=production. It never reads or writes QuestionBankItem.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSeedPlan } from "../../src/lib/assessment/import/plan";
import type { PilotDocument } from "../../src/lib/assessment/types";
import { loadEnvFiles } from "../load-env";

type PrismaLike = {
  $transaction: <T>(fn: (tx: PrismaLike) => Promise<T>) => Promise<T>;
  $executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<number>;
  $executeRawUnsafe: (query: string) => Promise<number>;
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
  ngnImportBatch: {
    findUnique: (args: { where: { batchId: string } }) => Promise<{ batchId: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  ngnCase: {
    findUnique: (args: { where: { id_version: { id: string; version: number } } }) => Promise<{ id: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  ngnItem: {
    findUnique: (args: { where: { id_version: { id: string; version: number } } }) => Promise<{ id: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  $disconnect: () => Promise<void>;
};

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function printIssues(plan: ReturnType<typeof buildSeedPlan>) {
  const errors = plan.issues.filter((issue) => issue.level === "error");
  const warnings = plan.issues.filter((issue) => issue.level === "warning");
  console.log(`validators: ${errors.length} errors, ${warnings.length} warnings`);
  for (const issue of errors.slice(0, 40)) {
    console.log(`  error ${issue.path}: ${issue.message}`);
  }
  if (errors.length > 40) console.log(`  … ${errors.length - 40} more errors`);
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

async function restore(batchId: string, apply: boolean, includeReviews: boolean) {
  if (!batchId) fail("--restore requires --batch <batchId>.");
  await withPrisma(async (prisma) => {
    const counts = await prisma.$queryRaw<
      { items: number; cases: number; batches: number; reviews: number }[]
    >`
      SELECT
        (SELECT COUNT(*)::int FROM ngn_item WHERE batch_id = ${batchId}) AS items,
        (SELECT COUNT(*)::int FROM ngn_case WHERE batch_id = ${batchId}) AS cases,
        (SELECT COUNT(*)::int FROM ngn_import_batch WHERE batch_id = ${batchId}) AS batches,
        (SELECT COUNT(*)::int FROM ngn_item_review r
          WHERE (r.item_id, r.item_version) IN (
            SELECT id, version FROM ngn_item WHERE batch_id = ${batchId}
          )) AS reviews
    `;
    const row = counts[0] ?? { items: 0, cases: 0, batches: 0, reviews: 0 };
    console.log(`restore batch ${batchId}${apply ? "" : " (dry run, no deletes)"}`);
    console.log(`  ngn_item: ${row.items}`);
    console.log(`  ngn_case: ${row.cases}`);
    console.log(`  ngn_import_batch: ${row.batches}`);
    console.log(
      `  ngn_item_review: ${row.reviews}${includeReviews ? " (would delete)" : " (preserved)"}`
    );
    if (!apply) return;

    if (process.env.VERCEL_ENV === "production") {
      fail("Refusing --apply when VERCEL_ENV=production.");
    }
    await prisma.$transaction(async (tx) => {
      if (includeReviews) {
        await tx.$executeRawUnsafe(`SELECT set_config('ngn.allow_review_delete', 'on', true)`);
        await tx.$executeRaw`
          DELETE FROM ngn_item_review
          WHERE (item_id, item_version) IN (
            SELECT id, version FROM ngn_item WHERE batch_id = ${batchId}
          )
        `;
      }
      await tx.$executeRaw`DELETE FROM ngn_item WHERE batch_id = ${batchId}`;
      await tx.$executeRaw`DELETE FROM ngn_case WHERE batch_id = ${batchId}`;
      await tx.$executeRaw`DELETE FROM ngn_import_batch WHERE batch_id = ${batchId}`;
    });
    console.log("restore applied.");
  });
}

async function main() {
  const apply = hasFlag("--apply");
  const restoreMode = hasFlag("--restore");
  const includeReviews = hasFlag("--include-reviews");
  if (restoreMode) {
    const batchId = argValue("--batch");
    if (!batchId) fail("--restore requires --batch <batchId>.");
    if (includeReviews && !apply) {
      console.log("--include-reviews is noted; reviews are listed and kept until --apply.");
    }
    await restore(batchId, apply, includeReviews);
    return;
  }

  const file = resolve(argValue("--file") ?? "content/ngn-pilot/pilot-items.json");
  const bytes = readFileSync(file);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const doc = JSON.parse(bytes.toString("utf8")) as PilotDocument;
  const plan = buildSeedPlan(doc, sha256);

  console.log(`NGN pilot seed — ${apply ? "APPLY" : "DRY RUN (no database writes)"}`);
  console.log(`file: ${file}`);
  console.log(`sha256: ${sha256}`);
  console.log(`batch: ${plan.batch.batchId}`);
  console.log(`schema: ${plan.batch.schemaVersion}`);
  console.log(`board: ${plan.batch.boardProfile}`);
  printIssues(plan);
  console.log("planned inserts:");
  console.log(`  ngn_import_batch: 1`);
  console.log(`  ngn_case: ${plan.cases.length}`);
  console.log(`  ngn_item: ${plan.items.length}`);
  console.log(`    case_item: ${plan.batch.rowCounts.caseItems}`);
  console.log(`    bowtie: ${plan.batch.rowCounts.bowties}`);
  console.log(`    trend: ${plan.batch.rowCounts.trends}`);
  console.log("status written on apply: draft (any status in the file is ignored)");

  if (plan.errorCount > 0) {
    fail("Refusing to continue because validators reported errors.");
  }
  if (!apply) {
    console.log("Dry run complete. Re-run with --apply and NGN_SEED_CONFIRM=<batchId> to insert.");
    return;
  }
  if (process.env.VERCEL_ENV === "production") {
    fail("Refusing --apply when VERCEL_ENV=production.");
  }
  if (process.env.NGN_SEED_CONFIRM !== plan.batch.batchId) {
    fail(
      `Refusing --apply. Set NGN_SEED_CONFIRM=${plan.batch.batchId} to confirm this batch.`
    );
  }

  await withPrisma(async (prisma) => {
    await prisma.$transaction(async (tx) => {
      const existingBatch = await tx.ngnImportBatch.findUnique({
        where: { batchId: plan.batch.batchId },
      });
      if (existingBatch) {
        console.log(`skip ngn_import_batch ${plan.batch.batchId} (already present)`);
      } else {
        await tx.ngnImportBatch.create({
          data: {
            batchId: plan.batch.batchId,
            schemaVersion: plan.batch.schemaVersion,
            boardProfile: plan.batch.boardProfile,
            sourceSha256: plan.batch.sourceSha256,
            sources: plan.batch.sources,
            rowCounts: plan.batch.rowCounts,
            notes: plan.batch.notes,
            importedBy: process.env.USER || process.env.USERNAME || "seed-pilot",
          },
        });
        console.log(`insert ngn_import_batch ${plan.batch.batchId}`);
      }

      for (const row of plan.cases) {
        const existing = await tx.ngnCase.findUnique({
          where: { id_version: { id: row.id, version: row.version } },
        });
        if (existing) {
          console.log(`skip ngn_case ${row.id} v${row.version}`);
          continue;
        }
        await tx.ngnCase.create({ data: row });
        console.log(`insert ngn_case ${row.id} v${row.version}`);
      }

      for (const row of plan.items) {
        const existing = await tx.ngnItem.findUnique({
          where: { id_version: { id: row.id, version: row.version } },
        });
        if (existing) {
          console.log(`skip ngn_item ${row.id} v${row.version}`);
          continue;
        }
        await tx.ngnItem.create({ data: row });
        console.log(`insert ngn_item ${row.id} v${row.version}`);
      }
    });
  });
  console.log("apply complete. Rows are draft. No QuestionBankItem rows were written.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
