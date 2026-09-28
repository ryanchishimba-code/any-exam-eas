#!/usr/bin/env node
/**
 * Restore the five NAPLEX rationale rows from qbi_naplex_rationale5_backup_20260928.
 *
 * Dry run is the default. It writes nothing and does not drop the backup.
 * --apply copies every non-id column back, including manual_correction.
 *
 *   npx tsx scripts/restore-naplex-rationale5-20260928.ts
 *   npx tsx scripts/restore-naplex-rationale5-20260928.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_rationale5_backup_20260928";
const DATA = path.join(process.cwd(), "scripts/data/naplex-rationale5-20260928/corrections.json");
const EXPECTED = 5;
const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const corrections = JSON.parse(readFileSync(DATA, "utf8")) as Array<{ id: string }>;
  if (corrections.length !== EXPECTED) throw new Error(`expected ${EXPECTED} ids`);
  for (const row of corrections) {
    if (!/^[a-z0-9]+$/.test(row.id)) throw new Error(`unexpected id: ${row.id}`);
  }
  const idList = corrections.map((row) => `'${row.id}'`).join(", ");
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;

  console.log(apply ? "APPLY" : "DRY RUN");
  if (!backup[0]?.reg) {
    console.log(`${BACKUP} does not exist. Nothing to restore.`);
    if (apply) process.exitCode = 1;
    return;
  }

  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${BACKUP}'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  const names = columns.map((row) => row.column_name).filter((name) => name !== "id");
  const differs = names
    .map((name) => `q.${quoteIdent(name)} IS DISTINCT FROM b.${quoteIdent(name)}`)
    .join(" OR ");
  const preview = (await prisma.$queryRawUnsafe(`
    SELECT
      q.id,
      q."correctAnswer" AS live_key,
      b."correctAnswer" AS backup_key,
      length(q.explanation) AS live_explanation,
      length(b.explanation) AS backup_explanation,
      q.manual_correction AS live_locked,
      b.manual_correction AS backup_locked,
      q.question IS NOT DISTINCT FROM b.question AS question_same,
      q.options IS NOT DISTINCT FROM b.options AS options_same,
      (${differs}) AS differs
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE q.id IN (${idList})
    ORDER BY q.id
  `)) as Array<{
    id: string;
    live_key: string;
    backup_key: string;
    live_explanation: number;
    backup_explanation: number;
    live_locked: boolean;
    backup_locked: boolean;
    question_same: boolean;
    options_same: boolean;
    differs: boolean;
  }>;
  const count = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n FROM ${BACKUP}`
  )) as Array<{ n: number }>;
  console.log(`backup rows: ${count[0]?.n}`);
  console.log(`joined live rows: ${preview.length}`);
  for (const row of preview) {
    console.log(
      `${row.id} key ${row.live_key} -> ${row.backup_key}; explanation ${row.live_explanation} -> ${row.backup_explanation}; manual_correction ${row.live_locked} -> ${row.backup_locked}; question same ${row.question_same}; options same ${row.options_same}; differs ${row.differs}`
    );
  }
  if (count[0]?.n !== EXPECTED || preview.length !== EXPECTED) {
    console.log(`Refusing: expected ${EXPECTED} backup rows joined to the five ids.`);
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No row written. The backup table is left in place.");
    return;
  }

  const assignments = names.map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`).join(", ");
  const restored = await prisma.$executeRawUnsafe(`
    UPDATE "QuestionBankItem" q
    SET ${assignments}
    FROM ${BACKUP} b
    WHERE q.id = b.id AND q.id IN (${idList})
  `);
  console.log(`restored rows: ${restored}`);
  if (restored !== EXPECTED) throw new Error(`expected to restore ${EXPECTED} rows, restored ${restored}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
