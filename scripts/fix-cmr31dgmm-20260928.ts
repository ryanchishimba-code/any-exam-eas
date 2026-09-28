#!/usr/bin/env node
/**
 * Put the hand-corrected Cockcroft-Gault key back on cmr31dgmm006vjs042cilnn5j
 * and lock the row so the nightly seed sync cannot overwrite it.
 *
 * Dry run is the default. It writes nothing.
 *
 *   npx tsx scripts/fix-cmr31dgmm-20260928.ts
 *   npx tsx scripts/fix-cmr31dgmm-20260928.ts --apply
 *
 * --apply requires migration 20260928120000_manual_correction_flag.
 * It copies the current row into qbi_cmr31dgmm_backup_20260928, then sets
 * correctAnswer and explanation only when the live key is still "38 mL/min".
 * options and generationMeta are not updated.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const ID = "cmr31dgmm006vjs042cilnn5j";
const OLD_KEY = "38 mL/min";
const NEW_KEY = "28 mL/min";
const BACKUP = "qbi_cmr31dgmm_backup_20260928";
const prisma = new PrismaClient();

function explanationFromProposedChanges(): string {
  const file = path.join(
    process.cwd(),
    "scripts/data/naplex-keyfix-20260927/proposed-changes.json"
  );
  const rows = JSON.parse(readFileSync(file, "utf8")) as Record<
    string,
    { set_explanation?: string; set_correctAnswer?: string }
  >;
  const row = rows[ID];
  if (!row?.set_explanation || row.set_correctAnswer !== NEW_KEY) {
    throw new Error(`${ID} is missing set_explanation or set_correctAnswer is not ${NEW_KEY}`);
  }
  return row.set_explanation;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const explanation = explanationFromProposedChanges();
  const column = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'QuestionBankItem'
      AND column_name = 'manual_correction'
  `)) as Array<{ n: number }>;
  const columnReady = column[0]?.n === 1;
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;

  const live = (await prisma.$queryRawUnsafe(
    `
    SELECT
      id,
      source,
      "correctAnswer" AS key,
      explanation,
      active,
      "updatedAt"::text AS updated_at,
      md5(options) AS options_md5,
      md5("generationMeta"::text) AS generation_meta_md5
    FROM "QuestionBankItem"
    WHERE id = $1
    `,
    ID
  )) as Array<{
    id: string;
    source: string;
    key: string;
    explanation: string;
    active: boolean;
    updated_at: string;
    options_md5: string;
    generation_meta_md5: string;
  }>;

  const row = live[0];
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`id: ${ID}`);
  console.log(`manual_correction column: ${columnReady ? "present" : "absent"}`);
  console.log(`backup table: ${backup[0]?.reg ?? "absent"}`);
  if (!row) {
    console.log("Stopped. The question id is not in QuestionBankItem.");
    process.exitCode = 1;
    return;
  }
  console.log(`source: ${row.source}`);
  console.log(`active: ${row.active}`);
  console.log(`live correctAnswer: ${row.key}`);
  console.log(`live updatedAt: ${row.updated_at}`);
  console.log(`live explanation length: ${row.explanation.length}`);
  console.log(`options md5: ${row.options_md5}`);
  console.log(`generationMeta md5: ${row.generation_meta_md5}`);
  console.log(`planned correctAnswer: ${NEW_KEY}`);
  console.log(`planned explanation length: ${explanation.length}`);
  console.log(
    `planned explanation starts: ${explanation.slice(0, 120).replace(/\s+/g, " ")}`
  );
  console.log("options and generationMeta would not be changed.");
  console.log("manual_correction would be set to true.");
  const wouldMatch = row.key === OLD_KEY;
  console.log(`WHERE correctAnswer = '${OLD_KEY}' matches: ${wouldMatch ? 1 : 0}`);

  if (!apply) {
    if (!columnReady) {
      console.log(
        "No file or row written. --apply refuses until migration 20260928120000_manual_correction_flag is applied."
      );
    } else if (!wouldMatch) {
      console.log("No file or row written. The guarded WHERE would match 0 rows.");
    } else if (backup[0]?.reg) {
      console.log("No file or row written. The backup table already exists, so --apply would refuse.");
    } else {
      console.log("No file or row written.");
    }
    return;
  }

  if (!columnReady) {
    throw new Error("manual_correction is missing. Apply migration 20260928120000_manual_correction_flag first.");
  }
  if (backup[0]?.reg) throw new Error(`${BACKUP} already exists`);
  if (!wouldMatch) throw new Error(`live correctAnswer is ${row.key}, expected ${OLD_KEY}`);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `CREATE TABLE ${BACKUP} AS SELECT * FROM "QuestionBankItem" WHERE id = $1`,
      ID
    );
    const copied = (await tx.$queryRawUnsafe(
      `SELECT COUNT(*)::int AS n FROM ${BACKUP}`
    )) as Array<{ n: number }>;
    if (copied[0]?.n !== 1) throw new Error(`${BACKUP} has ${copied[0]?.n ?? 0} rows`);

    const count = await tx.$executeRaw`
      UPDATE "QuestionBankItem"
      SET "correctAnswer" = ${NEW_KEY},
          explanation = ${explanation},
          manual_correction = true,
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${ID}
        AND "correctAnswer" = ${OLD_KEY}
    `;
    if (count !== 1) throw new Error(`UPDATE changed ${count} rows`);
    return count;
  });

  const after = (await prisma.$queryRawUnsafe(
    `
    SELECT
      q."correctAnswer" AS key,
      q.explanation = $2 AS explanation_ok,
      q.manual_correction AS locked,
      q.options = b.options AS options_same,
      q."generationMeta" IS NOT DISTINCT FROM b."generationMeta" AS meta_same
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE q.id = $1
    `,
    ID,
    explanation
  )) as Array<{
    key: string;
    explanation_ok: boolean;
    locked: boolean;
    options_same: boolean;
    meta_same: boolean;
  }>;
  console.log(`updated rows: ${updated}`);
  console.log(JSON.stringify(after[0]));
  if (
    after[0]?.key !== NEW_KEY ||
    !after[0]?.explanation_ok ||
    !after[0]?.locked ||
    !after[0]?.options_same ||
    !after[0]?.meta_same
  ) {
    throw new Error("post-update check failed");
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
