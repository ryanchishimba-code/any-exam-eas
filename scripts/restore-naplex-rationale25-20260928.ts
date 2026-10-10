#!/usr/bin/env node
/**
 * Undo the 25 NAPLEX explanation-only fixes.
 *
 * Dry run is the default. It writes nothing and does not drop the backup.
 *
 *   npx tsx scripts/restore-naplex-rationale25-20260928.ts
 *   npx tsx scripts/restore-naplex-rationale25-20260928.ts --apply
 *
 * --apply copies every non-id column from qbi_naplex_rationale25_backup_20260928
 * back onto QuestionBankItem. Question counts do not change, because these
 * rows stay visible either way. The backup table is left in place.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_rationale25_backup_20260928";
const DATA = path.join(process.cwd(), "scripts/data/naplex-rationale25-20260928/corrections.json");
const EXPECTED = 25;
const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const fixes = JSON.parse(readFileSync(DATA, "utf8")) as Array<{ id: string }>;
  if (fixes.length !== EXPECTED) throw new Error(`expected ${EXPECTED} ids, found ${fixes.length}`);
  for (const fix of fixes) {
    if (!/^[a-z0-9]+$/.test(fix.id)) throw new Error(`unexpected id: ${fix.id}`);
  }
  const idList = fixes.map((fix) => `'${fix.id}'`).join(", ");
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  console.log(apply ? "APPLY" : "DRY RUN");
  if (!backup[0]?.reg) {
    console.log("backup table: not created yet");
    console.log("No row written.");
    if (apply) process.exitCode = 1;
    return;
  }
  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${BACKUP}'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  const count = (await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM ${BACKUP}`)) as Array<{ n: number }>;
  console.log(`backup rows: ${count[0]?.n}`);
  if (count[0]?.n !== EXPECTED) {
    console.log(`Stopped. Expected ${EXPECTED} backup rows.`);
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No row written. The backup table is left in place.");
    return;
  }
  const assignments = names
    .filter((name) => name !== "id")
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(", ");
  const restored = await prisma.$executeRawUnsafe(`
    UPDATE "QuestionBankItem" q
    SET ${assignments}
    FROM ${BACKUP} b
    WHERE q.id = b.id AND q.id IN (${idList})
  `);
  if (restored !== EXPECTED) throw new Error(`restored ${restored} rows, expected ${EXPECTED}`);
  console.log(`Restored ${restored} rows.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
