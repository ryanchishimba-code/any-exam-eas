#!/usr/bin/env node
/**
 * Restore cmr31dgmm006vjs042cilnn5j from qbi_cmr31dgmm_backup_20260928.
 *
 * Dry run is the default. It writes nothing and does not drop the backup.
 *
 *   npx tsx scripts/restore-cmr31dgmm-20260928.ts
 *   npx tsx scripts/restore-cmr31dgmm-20260928.ts --apply
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const ID = "cmr31dgmm006vjs042cilnn5j";
const BACKUP = "qbi_cmr31dgmm_backup_20260928";
const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`Unexpected column: ${name}`);
  return `"${name}"`;
}

async function main() {
  const apply = process.argv.includes("--apply");
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
  const preview = (await prisma.$queryRawUnsafe(
    `
    SELECT
      q."correctAnswer" AS live_key,
      b."correctAnswer" AS backup_key,
      length(q.explanation) AS live_explanation,
      length(b.explanation) AS backup_explanation,
      (${differs}) AS differs
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE q.id = $1
    `,
    ID
  )) as Array<{
    live_key: string;
    backup_key: string;
    live_explanation: number;
    backup_explanation: number;
    differs: boolean;
  }>;
  const row = preview[0];
  if (!row) {
    console.log("The backup row is not joined to a live QuestionBankItem.");
    process.exitCode = 1;
    return;
  }
  console.log(`live correctAnswer: ${row.live_key}`);
  console.log(`backup correctAnswer: ${row.backup_key}`);
  console.log(`live explanation length: ${row.live_explanation}`);
  console.log(`backup explanation length: ${row.backup_explanation}`);
  console.log(`row differs from backup: ${row.differs}`);
  if (!apply) {
    console.log("No row written.");
    return;
  }

  const assignments = names
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(", ");
  const count = await prisma.$executeRawUnsafe(
    `
    UPDATE "QuestionBankItem" q
    SET ${assignments}
    FROM ${BACKUP} b
    WHERE q.id = b.id AND q.id = $1
    `,
    ID
  );
  console.log(`restored rows: ${count}`);
  if (count !== 1) throw new Error(`expected to restore 1 row, restored ${count}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
