#!/usr/bin/env node
/**
 * Add any batch-2 hide ids that are not yet in
 * qbi_naplex_urgenthide2_backup_20260928.
 *
 * Dry run is the default. It writes nothing.
 *
 *   npx tsx scripts/extend-naplex-urgenthide2-backup-20260928.ts
 *   npx tsx scripts/extend-naplex-urgenthide2-backup-20260928.ts --apply
 *
 * The table must already exist. This does not drop it and does not change
 * QuestionBankItem text.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_urgenthide2_backup_20260928";
const IDS = path.join(process.cwd(), "scripts/data/naplex-urgenthide2-20260928/hide-ids.json");
const prisma = new PrismaClient();

async function main() {
  const apply = process.argv.includes("--apply");
  const ids = JSON.parse(readFileSync(IDS, "utf8")) as string[];
  if (new Set(ids).size !== ids.length) throw new Error("hide id list has duplicates");
  for (const id of ids) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
  }
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const reg = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (!reg[0]?.reg) throw new Error(`${BACKUP} does not exist`);

  const summary = (await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS backup_rows,
      (SELECT COUNT(*)::int FROM ${BACKUP} WHERE id IN (${idList})) AS already_backed_up,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" WHERE id IN (${idList})) AS live_rows,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide_backup_20260927) AS u1,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{
    backup_rows: number;
    already_backed_up: number;
    live_rows: number;
    u1: number;
    keyfix: number;
    b1: number;
    b2: number;
  }>;
  const missing = (await prisma.$queryRawUnsafe(`
    SELECT id
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
      AND id NOT IN (SELECT id FROM ${BACKUP})
    ORDER BY id
  `)) as Array<{ id: string }>;
  const row = summary[0];
  const wouldInsert = missing.length;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide ids: ${ids.length}`);
  console.log(`live rows for those ids: ${row?.live_rows}`);
  console.log(`backup rows now: ${row?.backup_rows}`);
  console.log(`already in backup: ${row?.already_backed_up}`);
  console.log(`rows that would be inserted: ${wouldInsert}`);
  console.log(`backup rows after insert: ${(row?.backup_rows ?? 0) + wouldInsert}`);
  console.log(`missing ids: ${missing.map((item) => item.id).join(", ") || "(none)"}`);
  console.log(`other backups: urgent1 ${row?.u1}, keyfix ${row?.keyfix}, nclex b1 ${row?.b1}, nclex b2 ${row?.b2}`);
  console.log("QuestionBankItem text would not change.");
  if (row?.u1 !== 336 || row?.keyfix !== 278 || row?.b1 !== 125 || row?.b2 !== 105) {
    throw new Error("an earlier backup count changed");
  }
  if (row?.live_rows !== ids.length) {
    throw new Error(`only ${row?.live_rows} of ${ids.length} hide ids exist`);
  }
  if (!apply) {
    console.log("No row written.");
    return;
  }
  if (wouldInsert === 0) {
    console.log("Nothing to insert.");
    return;
  }
  const inserted = (await prisma.$queryRawUnsafe(`
    WITH ins AS (
      INSERT INTO ${BACKUP}
      SELECT * FROM "QuestionBankItem"
      WHERE id IN (${idList})
        AND id NOT IN (SELECT id FROM ${BACKUP})
      RETURNING id
    )
    SELECT COUNT(*)::int AS n FROM ins
  `)) as Array<{ n: number }>;
  console.log(`inserted rows: ${inserted[0]?.n}`);
  if (inserted[0]?.n !== wouldInsert) throw new Error("insert count did not match the dry-run set");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
