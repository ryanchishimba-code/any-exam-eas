#!/usr/bin/env node
/**
 * Remove exactly the rows listed in undo.json for batch ngn300-gapfill-2026-10-25.
 *
 *   npx tsx scripts/data/ngn300-gapfill-20261025/undo.ts
 *   NGN_GAPFILL_UNDO_CONFIRM=ngn300-gapfill-2026-10-25 npx tsx scripts/data/ngn300-gapfill-20261025/undo.ts --apply
 */
import { readFileSync } from "node:fs";
import { BATCH_ID, UNDO_PATH, type UndoManifest } from "./gapfill-lib";
import { catalogCountsFromRows, type CatalogCounts } from "./catalog-counts";
import { loadEnvFiles } from "../../load-env";

const CONFIRM_ENV = "NGN_GAPFILL_UNDO_CONFIRM";

type PrismaLike = {
  $transaction: <T>(fn: (tx: PrismaLike) => Promise<T>) => Promise<T>;
  ngnItem: {
    deleteMany: (args: { where: Record<string, unknown> }) => Promise<{ count: number }>;
    findMany: () => Promise<unknown[]>;
  };
  ngnCase: {
    deleteMany: (args: { where: Record<string, unknown> }) => Promise<{ count: number }>;
    findMany: () => Promise<unknown[]>;
  };
  ngnImportBatch: {
    delete: (args: { where: { batchId: string } }) => Promise<unknown>;
  };
  $disconnect: () => Promise<void>;
};

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function loadUndo(): UndoManifest {
  const manifest = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoManifest;
  if (manifest.batch_id !== BATCH_ID) {
    fail(`undo.json batch_id must be ${BATCH_ID}`);
  }
  return manifest;
}

async function main() {
  const apply = hasFlag("--apply");
  const manifest = loadUndo();
  console.log(`NGN gap-fill undo — ${apply ? "APPLY" : "DRY RUN"}`);
  console.log(`cases: ${manifest.cases.length}, items: ${manifest.items.length}`);
  if (manifest.neon_snapshot) console.log(`neon snapshot: ${manifest.neon_snapshot}`);

  if (!apply) {
    console.log("Dry run only. Re-run with --apply and confirmation env to delete rows.");
    return;
  }
  if (process.env[CONFIRM_ENV] !== BATCH_ID) {
    fail(`Refusing --apply. Set ${CONFIRM_ENV}=${BATCH_ID}`);
  }

  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set.");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient() as unknown as PrismaLike;

  try {
    await prisma.$transaction(async (tx) => {
      for (const row of manifest.items) {
        await tx.ngnItem.deleteMany({ where: { id: row.id, version: row.version } });
      }
      for (const row of manifest.cases) {
        await tx.ngnCase.deleteMany({ where: { id: row.id, version: row.version } });
      }
      await tx.ngnImportBatch.delete({ where: { batchId: manifest.batch_id } });
    });
    console.log("Undo complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
