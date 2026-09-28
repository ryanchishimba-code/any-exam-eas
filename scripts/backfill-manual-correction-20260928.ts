#!/usr/bin/env node
/**
 * Mark hand-corrected QuestionBankItem rows so seed sync will not overwrite them.
 *
 * The set is the NAPLEX round-1 proposed changes, both NCLEX key-fix batches,
 * and any typo-only ids in those batches. Text is not changed.
 *
 * Dry run is the default.
 *
 *   npx tsx scripts/backfill-manual-correction-20260928.ts
 *   npx tsx scripts/backfill-manual-correction-20260928.ts --apply
 *
 * --apply requires migration 20260928120000_manual_correction_flag.
 * It does not change updatedAt.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { collectHandFixedIds } from "@/lib/sync-question-bank-guard";

const prisma = new PrismaClient();

function readJson(name: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(path.join(process.cwd(), "scripts/data", name), "utf8")
  ) as Record<string, unknown>;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const collected = collectHandFixedIds({
    naplexProposed: readJson("naplex-keyfix-20260927/proposed-changes.json"),
    nclexBatch1: readJson("nclex-keyfix-20260927/proposed-changes.json"),
    nclexBatch2: readJson("nclex-keyfix-20260927-b2/proposed-changes.json"),
    nclexTypos: readJson("nclex-keyfix-20260927/typo-fixes.json"),
    naplexTypos: readJson("naplex-keyfix-20260927/typo-fixes.json"),
  });
  if (new Set(collected.ids).size !== collected.ids.length) {
    throw new Error("hand-fixed id list has duplicates");
  }
  for (const id of collected.ids) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
  }
  const idList = collected.ids.map((id) => `'${id}'`).join(", ");

  const column = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'QuestionBankItem'
      AND column_name = 'manual_correction'
  `)) as Array<{ n: number }>;
  const columnReady = column[0]?.n === 1;

  const counts = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS present
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
  `)) as Array<{ present: number }>;

  let alreadyLocked = 0;
  if (columnReady) {
    const locked = (await prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS n
      FROM "QuestionBankItem"
      WHERE id IN (${idList}) AND manual_correction = true
    `)) as Array<{ n: number }>;
    alreadyLocked = locked[0]?.n ?? 0;
  }

  const present = counts[0]?.present ?? 0;
  const wouldMark = columnReady ? present - alreadyLocked : present;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`proposed-change ids: ${collected.proposedIds.length}`);
  console.log(`typo-only ids: ${collected.typoOnlyIds.length} (${collected.typoOnlyIds.join(", ")})`);
  console.log(`hand-fixed ids: ${collected.ids.length}`);
  console.log(`present in QuestionBankItem: ${present}`);
  console.log(`missing: ${collected.ids.length - present}`);
  console.log(`manual_correction column: ${columnReady ? "present" : "absent"}`);
  console.log(`already locked: ${columnReady ? alreadyLocked : "n/a"}`);
  console.log(`rows that would be marked: ${wouldMark}`);
  console.log("correctAnswer, explanation, options, generationMeta, and updatedAt would not change.");

  if (!apply) {
    if (!columnReady) {
      console.log(
        "No row written. --apply refuses until migration 20260928120000_manual_correction_flag is applied."
      );
    } else {
      console.log("No row written.");
    }
    return;
  }

  if (!columnReady) {
    throw new Error("manual_correction is missing. Apply migration 20260928120000_manual_correction_flag first.");
  }
  const updated = await prisma.$executeRawUnsafe(`
    UPDATE "QuestionBankItem"
    SET manual_correction = true
    WHERE id IN (${idList})
      AND manual_correction = false
  `);
  console.log(`marked rows: ${updated}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
