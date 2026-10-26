#!/usr/bin/env node
/**
 * Put the 2026-10-25 PANCE retire rows back to the snapshot in
 * qbi_pance_retire_20261025_backup.
 *
 * Dry run is the default and writes nothing. --apply copies every backed-up
 * column onto the live row. It does not delete rows and it does not drop the
 * backup table.
 *
 *   npx tsx scripts/restore-pance-retire-20261025.ts
 *   npx tsx scripts/restore-pance-retire-20261025.ts --apply
 *
 * The backup csv must list the same ids and columns as the backup table.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  PANCE_RETIRE_BACKUP,
  PANCE_RETIRE_CSV,
  assertProductionHost,
  parseCsv,
  quoteIdent,
  redact,
  rowTextMd5,
} from "./pance-retire-20261025-lib";

const prisma = new PrismaClient();

async function tableColumns(table: string): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    table
  )) as Array<{ column_name: string }>;
  return rows.map((row) => row.column_name);
}

async function backupReg(): Promise<string | null> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${PANCE_RETIRE_BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  return rows[0]?.reg ?? null;
}

function loadCsv(columns: readonly string[]): Array<Array<string | null>> {
  const parsed = parseCsv(readFileSync(path.join(process.cwd(), PANCE_RETIRE_CSV), "utf8"));
  const header = parsed[0];
  if (!header || header.length !== columns.length || header.some((name, index) => name !== columns[index])) {
    throw new Error("backup csv columns do not match QuestionBankItem");
  }
  const body = parsed.slice(1);
  for (const row of body) {
    if (row.length !== columns.length) throw new Error("backup csv has a short row");
  }
  return body;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const unknown = process.argv.slice(2).filter((arg) => arg !== "--apply");
  if (unknown.length > 0) throw new Error(`unknown argument ${unknown.join(" ")}`);
  const host = assertProductionHost();
  const columns = await tableColumns("QuestionBankItem");
  if (!columns.includes("id") || !columns.includes("active") || !columns.includes("manual_correction")) {
    throw new Error("QuestionBankItem is missing an expected column");
  }
  const csvRows = loadCsv(columns);
  const idIndex = columns.indexOf("id");
  const csvIds = csvRows.map((row) => {
    const id = row[idIndex];
    if (typeof id !== "string" || !/^[a-z0-9]+$/.test(id)) throw new Error("backup csv has an unexpected id");
    return id;
  });
  if (new Set(csvIds).size !== csvIds.length) throw new Error("backup csv has duplicate ids");

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`database host: ${host}`);
  console.log(`backup csv rows: ${csvRows.length}`);
  const reg = await backupReg();
  if (!reg) {
    console.log(`${PANCE_RETIRE_BACKUP} does not exist.`);
    if (apply) throw new Error("refusing --apply without the backup table");
    console.log("No row written.");
    return;
  }
  const backupColumns = await tableColumns(PANCE_RETIRE_BACKUP);
  if (backupColumns.join(",") !== columns.join(",")) {
    throw new Error("backup table columns do not match QuestionBankItem");
  }
  const packed = columns
    .map((column) => `COALESCE(${quoteIdent(column)}::text, CHR(92) || 'N')`)
    .join(` || CHR(31) || `);
  const stored = (await prisma.$queryRawUnsafe(
    `SELECT id, md5(${packed}) AS row_md5 FROM ${PANCE_RETIRE_BACKUP} ORDER BY id`
  )) as Array<{ id: string; row_md5: string }>;
  if (stored.length !== csvRows.length) {
    throw new Error(`${PANCE_RETIRE_BACKUP} has ${stored.length} rows, csv has ${csvRows.length}`);
  }
  const csvById = new Map(csvRows.map((row) => [row[idIndex] as string, row]));
  for (const row of stored) {
    const csv = csvById.get(row.id);
    if (!csv) throw new Error(`backup table id ${row.id} is missing from the csv`);
    if (rowTextMd5(csv) !== row.row_md5) throw new Error(`csv does not match the backup table for ${row.id}`);
  }

  const selects = columns
    .map(
      (column, index) =>
        `COUNT(*) FILTER (WHERE q.${quoteIdent(column)} IS DISTINCT FROM b.${quoteIdent(column)})::int AS d${index}`
    )
    .join(", ");
  const diffRows = (await prisma.$queryRawUnsafe(
    `SELECT ${selects}
     FROM "QuestionBankItem" q
     JOIN ${PANCE_RETIRE_BACKUP} b ON q.id = b.id`
  )) as Array<Record<string, number>>;
  const present = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n FROM "QuestionBankItem" WHERE id IN (SELECT id FROM ${PANCE_RETIRE_BACKUP})`
  )) as Array<{ n: number }>;
  if (Number(present[0]?.n) !== stored.length) {
    throw new Error(`only ${present[0]?.n} of ${stored.length} backup ids still exist`);
  }
  const diffs = columns
    .map((column, index) => ({ column, n: Number(diffRows[0]?.[`d${index}`] ?? 0) }))
    .filter((entry) => entry.n > 0);
  console.log(`backup table rows: ${stored.length}`);
  console.log(`live rows: ${present[0]?.n}`);
  if (diffs.length === 0) console.log("live rows already match every backed-up column");
  else console.log(`columns that differ: ${diffs.map((entry) => `${entry.column} ${entry.n}`).join(", ")}`);
  if (!apply) {
    console.log("No row written.");
    return;
  }

  const assignments = columns.map((column) => `${quoteIdent(column)} = b.${quoteIdent(column)}`).join(", ");
  const restored = (await prisma.$queryRawUnsafe(`
    WITH upd AS (
      UPDATE "QuestionBankItem" AS q
      SET ${assignments}
      FROM ${PANCE_RETIRE_BACKUP} AS b
      WHERE q.id = b.id
      RETURNING q.id
    )
    SELECT COUNT(*)::int AS n FROM upd
  `)) as Array<{ n: number }>;
  if (Number(restored[0]?.n) !== stored.length) {
    throw new Error(`restore updated ${restored[0]?.n} rows, expected ${stored.length}`);
  }
  const after = (await prisma.$queryRawUnsafe(
    `SELECT ${selects}
     FROM "QuestionBankItem" q
     JOIN ${PANCE_RETIRE_BACKUP} b ON q.id = b.id`
  )) as Array<Record<string, number>>;
  const left = columns.filter((column, index) => Number(after[0]?.[`d${index}`] ?? 0) > 0);
  if (left.length > 0) throw new Error(`restore left diffs in ${left.join(", ")}`);
  console.log(`Restored ${stored.length} rows from ${PANCE_RETIRE_BACKUP}.`);
  console.log("The backup table was left in place.");
}

main()
  .catch((error) => {
    console.error(redact(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
