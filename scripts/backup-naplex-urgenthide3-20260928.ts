#!/usr/bin/env node
/**
 * Snapshot the batch-3 NAPLEX hide ids into
 * qbi_naplex_urgenthide3_backup_20260928.
 *
 * Dry run is the default. It creates the table and inserts the rows inside a
 * transaction, then rolls back, so nothing is left behind. The insert names
 * every QuestionBankItem column, including manual_correction. It does not use
 * SELECT *.
 *
 *   npx tsx scripts/backup-naplex-urgenthide3-20260928.ts
 *   npx tsx scripts/backup-naplex-urgenthide3-20260928.ts --apply
 *
 * --apply commits the table. QuestionBankItem text is not changed.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_urgenthide3_backup_20260928";
const IDS = path.join(process.cwd(), "scripts/data/naplex-urgenthide3-20260928/hide-ids.json");
const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const ids = JSON.parse(readFileSync(IDS, "utf8")) as string[];
  if (ids.length !== 122) throw new Error(`id list has ${ids.length} ids, expected 122`);
  if (new Set(ids).size !== ids.length) throw new Error("hide id list has duplicates");
  for (const id of ids) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
  }
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const columns = (await prisma.$queryRawUnsafe(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
     ORDER BY ordinal_position`
  )) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  if (!names.includes("manual_correction")) throw new Error("QuestionBankItem is missing manual_correction");
  if (!names.includes("id")) throw new Error("QuestionBankItem is missing id");
  const colSql = names.map(quoteIdent).join(", ");

  const prior = (await prisma.$queryRawUnsafe(`
    SELECT
      to_regclass('public.${BACKUP}')::text AS reg,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" WHERE id IN (${idList})) AS live_rows,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide_backup_20260927) AS u1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide2_backup_20260928) AS u2,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{
    reg: string | null;
    live_rows: number;
    u1: number;
    u2: number;
    keyfix: number;
    b1: number;
    b2: number;
  }>;
  const row = prior[0];
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide ids: ${ids.length}`);
  console.log(`live rows for those ids: ${row?.live_rows}`);
  console.log(`columns: ${names.join(", ")}`);
  console.log(
    `other backups: urgent1 ${row?.u1}, urgent2 ${row?.u2}, keyfix ${row?.keyfix}, nclex b1 ${row?.b1}, nclex b2 ${row?.b2}`
  );
  console.log("QuestionBankItem text would not change.");
  if (row?.reg) throw new Error(`${BACKUP} already exists`);
  if (row?.live_rows !== ids.length) throw new Error(`only ${row?.live_rows} of ${ids.length} hide ids exist`);
  if (row?.u1 !== 336 || row?.u2 !== 247 || row?.keyfix !== 278 || row?.b1 !== 125 || row?.b2 !== 105) {
    throw new Error("an earlier backup count changed");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `CREATE TABLE ${BACKUP} (LIKE "QuestionBankItem" INCLUDING ALL)`
      );
      const inserted = (await tx.$queryRawUnsafe(`
        WITH ins AS (
          INSERT INTO ${BACKUP} (${colSql})
          SELECT ${colSql}
          FROM "QuestionBankItem"
          WHERE id IN (${idList})
          RETURNING id
        )
        SELECT COUNT(*)::int AS n FROM ins
      `)) as Array<{ n: number }>;
      const created = (await tx.$queryRawUnsafe(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1
         ORDER BY ordinal_position`,
        BACKUP
      )) as Array<{ column_name: string }>;
      const createdNames = created.map((column) => column.column_name);
      if (createdNames.join(",") !== names.join(",")) {
        throw new Error("backup columns do not match QuestionBankItem");
      }
      const count = (await tx.$queryRawUnsafe(
        `SELECT COUNT(*)::int AS n, COUNT(DISTINCT id)::int AS distinct_ids FROM ${BACKUP}`
      )) as Array<{ n: number; distinct_ids: number }>;
      console.log(`inserted rows: ${inserted[0]?.n}`);
      console.log(`backup rows: ${count[0]?.n}`);
      console.log(`distinct backup ids: ${count[0]?.distinct_ids}`);
      if (inserted[0]?.n !== ids.length || count[0]?.n !== ids.length || count[0]?.distinct_ids !== ids.length) {
        throw new Error("backup row count did not match the hide list");
      }
      if (!apply) throw new DryRunRollback();
    }, { timeout: 60_000 });
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const left = (await prisma.$queryRawUnsafe(
        `SELECT to_regclass('public.${BACKUP}')::text AS reg`
      )) as Array<{ reg: string | null }>;
      if (left[0]?.reg) throw new Error("dry run left the backup table behind");
      console.log("Rolled back. No table left.");
      return;
    }
    throw error;
  }
  console.log(`Committed ${BACKUP}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
