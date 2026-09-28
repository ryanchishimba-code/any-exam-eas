#!/usr/bin/env node
/**
 * Unhide the NAPLEX items hidden in urgent batch 3 on 2026-09-28.
 *
 * Hiding did not change QuestionBankItem text. This script removes the
 * naplex-urgent-hide-3-2026-09-28 block from KEY_WRONG_PENDING_RN_REVIEW.
 * After it runs, set the NAPLEX bank count back to 9,275 and the six-board
 * total back to 45,425, then deploy.
 *
 *   npx tsx scripts/restore-naplex-urgenthide3-20260928.ts
 *   npx tsx scripts/restore-naplex-urgenthide3-20260928.ts --apply
 *
 * The backup table qbi_naplex_urgenthide3_backup_20260928 is left in place.
 * This script does not touch the earlier backup tables.
 * Dry run does not require the backup table, because creating it is also
 * dry-run by default. --apply refuses until that table has 122 rows.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_urgenthide3_backup_20260928";
const EXPECTED = 122;
const BEGIN = "// naplex-urgent-hide-3-2026-09-28 BEGIN";
const END = "// naplex-urgent-hide-3-2026-09-28 END";
const QUEUE = path.join(process.cwd(), "src/lib/exam-prep/reviewed-key-queue.ts");
const IDS = path.join(process.cwd(), "scripts/data/naplex-urgenthide3-20260928/hide-ids.json");
const prisma = new PrismaClient();

function hideBlock(source: string): { start: number; end: number; count: number } {
  const start = source.indexOf(BEGIN);
  const end = source.indexOf(END);
  if (start < 0 || end < 0 || end < start) throw new Error("urgent-hide batch 3 markers are missing");
  if (source.indexOf(BEGIN, start + BEGIN.length) >= 0) throw new Error("urgent-hide batch 3 begin marker is duplicated");
  const block = source.slice(start, end);
  const count = block.split("auditRef: NAPLEX_URGENT_HIDE_3_AUDIT_REF").length - 1;
  return { start, end: end + END.length, count };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const source = readFileSync(QUEUE, "utf8");
  const block = hideBlock(source);
  const ids = JSON.parse(readFileSync(IDS, "utf8")) as string[];
  if (ids.length !== EXPECTED) throw new Error(`id list has ${ids.length} ids, expected ${EXPECTED}`);

  const counts = (await prisma.$queryRawUnsafe(`
    SELECT
      to_regclass('public.${BACKUP}')::text AS reg,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide_backup_20260927) AS u1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide2_backup_20260928) AS u2,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{ reg: string | null; u1: number; u2: number; keyfix: number; b1: number; b2: number }>;
  if (counts[0]?.u1 !== 336 || counts[0]?.u2 !== 247 || counts[0]?.keyfix !== 278 || counts[0]?.b1 !== 125 || counts[0]?.b2 !== 105) {
    throw new Error("an earlier backup count changed");
  }
  let backupRows: number | null = null;
  if (counts[0]?.reg) {
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int AS n FROM ${BACKUP}`
    )) as Array<{ n: number }>;
    backupRows = rows[0]?.n ?? null;
    if (backupRows !== EXPECTED) throw new Error(`${BACKUP} has ${backupRows} rows, expected ${EXPECTED}`);
  } else if (apply) {
    throw new Error(`${BACKUP} does not exist. Apply scripts/backup-naplex-urgenthide3-20260928.ts --apply first.`);
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide-list entries: ${block.count}`);
  console.log(`id file entries: ${ids.length}`);
  console.log(backupRows === null ? "backup table: not created yet" : `backup rows: ${backupRows}`);
  console.log("QuestionBankItem text was not changed by this hide.");
  console.log("After unhiding, restore NAPLEX bankItems to 9275 and the six-board total to 45425.");
  if (block.count !== EXPECTED) {
    console.log(`Stopped. The hide block does not contain ${EXPECTED} entries.`);
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No file written.");
    return;
  }

  const next = `${source.slice(0, block.start).replace(/[ \t]*$/, "")}${source.slice(block.end).replace(/^\n/, "")}`;
  if (next.includes(BEGIN) || next.includes("NAPLEX_URGENT_HIDE_3_AUDIT_REF,")) {
    throw new Error("removal left urgent-hide batch 3 entries behind");
  }
  writeFileSync(QUEUE, next);
  console.log(`Removed ${EXPECTED} entries from src/lib/exam-prep/reviewed-key-queue.ts.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
