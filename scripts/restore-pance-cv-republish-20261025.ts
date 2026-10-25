#!/usr/bin/env node
/**
 * Restore the 27 PANCE cardiovascular rows from
 * scripts/data/pance-cv-republish-20261025/undo.json (pre-republish snapshot).
 *
 *   npx tsx scripts/restore-pance-cv-republish-20261025.ts
 *   npx tsx scripts/restore-pance-cv-republish-20261025.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const EXPECTED = 27;
const UNDO_PATH = path.join(process.cwd(), "scripts/data/pance-cv-republish-20261025/undo.json");

const prisma = new PrismaClient();

type UndoFile = {
  ids: string[];
  columnTypes: Record<string, string>;
  rows: Array<Record<string, unknown>>;
};

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function sameValue(left: unknown, right: unknown): boolean {
  const normalize = (value: unknown): unknown => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
    return value ?? null;
  };
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

async function main() {
  const apply = process.argv.includes("--apply");
  const undo = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoFile;
  if (undo.rows.length !== EXPECTED || undo.ids.length !== EXPECTED) {
    throw new Error(`undo file does not contain ${EXPECTED} rows`);
  }
  const columns = Object.keys(undo.columnTypes);
  const selectList = columns
    .map((column) =>
      undo.columnTypes[column] === "vector"
        ? `${quoteIdent(column)}::text AS ${quoteIdent(column)}`
        : quoteIdent(column)
    )
    .join(", ");
  const idList = undo.ids.map((id) => `'${id}'`).join(", ");
  const live = (await prisma.$queryRawUnsafe(
    `SELECT ${selectList} FROM "QuestionBankItem" WHERE id IN (${idList})`
  )) as Array<Record<string, unknown>>;
  const liveById = new Map(live.map((row) => [String(row.id), row]));
  let changedRows = 0;
  const changedColumns = new Map<string, string[]>();
  for (const row of undo.rows) {
    const current = liveById.get(String(row.id));
    if (!current) throw new Error(`live row missing: ${row.id}`);
    const diffs = columns.filter((column) => !sameValue(current[column], row[column]));
    if (diffs.length > 0) {
      changedRows += 1;
      changedColumns.set(String(row.id), diffs);
    }
  }
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`undo rows: ${undo.rows.length}`);
  console.log(`live rows: ${live.length}`);
  console.log(`rows that differ from undo: ${changedRows}`);
  for (const [id, diffs] of changedColumns) console.log(`${id}: ${diffs.join(", ")}`);
  if (!apply) {
    console.log("No row written.");
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const row of undo.rows) {
      const assignments = columns.map((column) => {
        const type = undo.columnTypes[column];
        const value = row[column];
        if (value === null || value === undefined) {
          return Prisma.sql`${Prisma.raw(quoteIdent(column))} = NULL`;
        }
        if (type === "jsonb") {
          return Prisma.sql`${Prisma.raw(quoteIdent(column))} = ${JSON.stringify(value)}::jsonb`;
        }
        if (type === "vector") {
          return Prisma.sql`${Prisma.raw(quoteIdent(column))} = ${String(value)}::vector`;
        }
        if (type === "timestamp") {
          return Prisma.sql`${Prisma.raw(quoteIdent(column))} = ${new Date(String(value))}`;
        }
        if (type === "bool") {
          return Prisma.sql`${Prisma.raw(quoteIdent(column))} = ${Boolean(value)}`;
        }
        if (type === "int2" || type === "float8") {
          return Prisma.sql`${Prisma.raw(quoteIdent(column))} = ${Number(value)}`;
        }
        return Prisma.sql`${Prisma.raw(quoteIdent(column))} = ${value}`;
      });
      const updated = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET ${Prisma.join(assignments, ", ")}
        WHERE id = ${String(row.id)}
      `;
      if (updated !== 1) throw new Error(`restore updated ${updated} rows for ${row.id}`);
    }
  });
  console.log(`Restored ${EXPECTED} rows from ${UNDO_PATH}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
