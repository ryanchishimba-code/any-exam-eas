#!/usr/bin/env node
/**
 * Snapshot the 55 hidden PANCE pulmonary / AANP FNP pediatric rows before republish.
 *
 *   npx tsx scripts/backup-lung-fnp-republish-20261025.ts
 *
 * Writes scripts/data/lung-fnp-republish-20261025/backup-original.json only.
 * QuestionBankItem is not updated.
 */
import { writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { BACKUP_PATH, EXPECTED, loadRewrites, publishIds } from "./lung-fnp-republish-plan";

const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function jsonValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return value.toString();
  return value ?? null;
}

async function main() {
  if (existsSync(BACKUP_PATH)) throw new Error(`${BACKUP_PATH} already exists`);
  const rewrites = loadRewrites();
  const ids = publishIds(rewrites);
  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string; udt_name: string }>;
  if (!columns.some((column) => column.column_name === "manual_correction")) {
    throw new Error("QuestionBankItem is missing manual_correction");
  }
  const selectList = columns
    .map((column) =>
      column.udt_name === "vector"
        ? `${quoteIdent(column.column_name)}::text AS ${quoteIdent(column.column_name)}`
        : quoteIdent(column.column_name)
    )
    .join(", ");
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT ${selectList} FROM "QuestionBankItem" WHERE id IN (${idList})`
  )) as Array<Record<string, unknown>>;
  if (rows.length !== EXPECTED) throw new Error(`found ${rows.length} rows, expected ${EXPECTED}`);
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  const ordered = ids.map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`missing row ${id}`);
    if (row.active !== false || row.manual_correction !== true || row.qaPassed !== true) {
      throw new Error(`${id} is not hidden with qaPassed (active=${String(row.active)} manual=${String(row.manual_correction)})`);
    }
    return Object.fromEntries(columns.map((column) => [column.column_name, jsonValue(row[column.column_name])]));
  });
  const payload = {
    backedUpAt: new Date().toISOString(),
    table: "QuestionBankItem",
    reason: "Pre-republish snapshot for 55 verified PANCE pulmonary and AANP FNP pediatric rewrites (2026-10-25).",
    ids,
    columnTypes: Object.fromEntries(columns.map((column) => [column.column_name, column.udt_name])),
    rows: ordered,
  };
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(BACKUP_PATH, body);
  const digest = createHash("sha256").update(body).digest("hex");
  console.log(`backup file: ${BACKUP_PATH}`);
  console.log(`rows: ${ordered.length}`);
  console.log(`columns: ${columns.length}`);
  console.log(`sha256: ${digest}`);
  console.log("QuestionBankItem was not updated.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
