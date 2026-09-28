#!/usr/bin/env node
/**
 * Unhide the second NCLEX urgent-hide batch from 2026-09-28.
 *
 * Hiding did not change question text. This script removes the
 * nclex-urgent-hide-2-2026-09-28 block from KEY_WRONG_PENDING_RN_REVIEW.
 * On --apply it also copies manual_correction back from
 * qbi_nclex_urgenthide2_backup_20260928. No other column is written.
 * After it runs, set the NCLEX bank count back to 5,425 (public NCLEX
 * 5,495) and the six-board total back to 45,207, then deploy.
 *
 *   npx tsx scripts/restore-nclex-urgenthide2-20260928.ts
 *   npx tsx scripts/restore-nclex-urgenthide2-20260928.ts --apply
 *
 * The backup table is left in place. This script does not touch earlier
 * backup tables. Dry run does not require the backup table. --apply refuses
 * until that table has 6 rows.
 *
 * cmqwjuudm000a1yvmde6a50d2 stays in KEY_UNCERTAIN_RN_REVIEW. Removing this
 * hide block makes that uncertain entry visible again.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_nclex_urgenthide2_backup_20260928";
const EXPECTED = 6;
const BEGIN = "// nclex-urgent-hide-2-2026-09-28 BEGIN";
const END = "// nclex-urgent-hide-2-2026-09-28 END";
const QUEUE = path.join(process.cwd(), "src/lib/exam-prep/reviewed-key-queue.ts");
const IDS = path.join(process.cwd(), "scripts/data/nclex-urgenthide2-20260928/hide-ids.json");
const prisma = new PrismaClient();

function hideBlock(source: string): { start: number; end: number; count: number } {
  const start = source.indexOf(BEGIN);
  const end = source.indexOf(END);
  if (start < 0 || end < 0 || end < start) throw new Error("urgent-hide batch 2 markers are missing");
  if (source.indexOf(BEGIN, start + BEGIN.length) >= 0) throw new Error("urgent-hide batch 2 begin marker is duplicated");
  const block = source.slice(start, end);
  const count = block.split("auditRef: NCLEX_URGENT_HIDE_2_AUDIT_REF").length - 1;
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
      (SELECT COUNT(*)::int FROM qbi_nclex_urgenthide1_backup_20260928) AS nclex1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide_backup_20260927) AS u1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide2_backup_20260928) AS u2,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide3_backup_20260928) AS u3,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{ reg: string | null; nclex1: number; u1: number; u2: number; u3: number; keyfix: number; b1: number; b2: number }>;
  if (
    counts[0]?.nclex1 !== 96 ||
    counts[0]?.u1 !== 336 ||
    counts[0]?.u2 !== 247 ||
    counts[0]?.u3 !== 122 ||
    counts[0]?.keyfix !== 278 ||
    counts[0]?.b1 !== 125 ||
    counts[0]?.b2 !== 105
  ) {
    throw new Error("an earlier backup count changed");
  }
  let backupRows: number | null = null;
  if (counts[0]?.reg) {
    const rows = (await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM ${BACKUP}`)) as Array<{ n: number }>;
    backupRows = rows[0]?.n ?? null;
    if (backupRows !== EXPECTED) throw new Error(`${BACKUP} has ${backupRows} rows, expected ${EXPECTED}`);
  } else if (apply) {
    throw new Error(`${BACKUP} does not exist. Apply scripts/backup-nclex-urgenthide2-20260928.ts --apply first.`);
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide-list entries: ${block.count}`);
  console.log(`id file entries: ${ids.length}`);
  console.log(backupRows === null ? "backup table: not created yet" : `backup rows: ${backupRows}`);
  console.log("Question text was not changed by this hide.");
  console.log("After unhiding, restore NCLEX bankItems to 5425 and the six-board total to 45207.");
  if (block.count !== EXPECTED) {
    console.log(`Stopped. The hide block does not contain ${EXPECTED} entries.`);
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No file written.");
    return;
  }

  const idList = ids.map((id) => `'${id}'`).join(", ");
  const restored = (await prisma.$queryRawUnsafe(`
    WITH upd AS (
      UPDATE "QuestionBankItem" AS q
      SET manual_correction = b.manual_correction
      FROM ${BACKUP} AS b
      WHERE q.id = b.id
        AND q.id IN (${idList})
        AND q.manual_correction IS DISTINCT FROM b.manual_correction
      RETURNING q.id
    )
    SELECT COUNT(*)::int AS n FROM upd
  `)) as Array<{ n: number }>;
  console.log(`manual_correction rows restored: ${restored[0]?.n ?? 0}`);

  const next = `${source.slice(0, block.start).replace(/[ \t]*$/, "")}${source.slice(block.end).replace(/^\n/, "")}`;
  if (next.includes(BEGIN) || next.includes("NCLEX_URGENT_HIDE_2_AUDIT_REF,")) {
    throw new Error("removal left urgent-hide batch 2 entries behind");
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
