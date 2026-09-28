#!/usr/bin/env node
/**
 * Unhide the 336 NAPLEX items hidden on 2026-09-27.
 *
 * Hiding did not change QuestionBankItem text. This script removes the
 * naplex-urgent-hide-2026-09-27 block from KEY_WRONG_PENDING_RN_REVIEW.
 * After it runs, set the NAPLEX bank count back to 9,858 and the six-board
 * total back to 46,008, then deploy.
 *
 *   npx tsx scripts/restore-naplex-urgenthide-20260927.ts
 *   npx tsx scripts/restore-naplex-urgenthide-20260927.ts --apply
 *
 * The backup table qbi_naplex_urgenthide_backup_20260927 is left in place.
 * This script does not touch the NCLEX or round-1 NAPLEX backup tables.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_urgenthide_backup_20260927";
const EXPECTED = 336;
const BEGIN = "// naplex-urgent-hide-2026-09-27 BEGIN";
const END = "// naplex-urgent-hide-2026-09-27 END";
const QUEUE = path.join(process.cwd(), "src/lib/exam-prep/reviewed-key-queue.ts");
const IDS = path.join(process.cwd(), "scripts/data/naplex-urgenthide-20260927/hide-ids.json");
const prisma = new PrismaClient();

function hideBlock(source: string): { start: number; end: number; count: number } {
  const start = source.indexOf(BEGIN);
  const end = source.indexOf(END);
  if (start < 0 || end < 0 || end < start) throw new Error("urgent-hide markers are missing");
  if (source.indexOf(BEGIN, start + BEGIN.length) >= 0) throw new Error("urgent-hide begin marker is duplicated");
  const block = source.slice(start, end);
  const count = block.split("auditRef: NAPLEX_URGENT_HIDE_AUDIT_REF").length - 1;
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
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS n,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{ reg: string | null; n: number; keyfix: number; b1: number; b2: number }>;
  if (!counts[0]?.reg) throw new Error(`${BACKUP} does not exist`);
  if (counts[0].n !== EXPECTED) throw new Error(`${BACKUP} has ${counts[0].n} rows, expected ${EXPECTED}`);
  if (counts[0].keyfix !== 278 || counts[0].b1 !== 125 || counts[0].b2 !== 105) {
    throw new Error("another keyfix backup count changed");
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide-list entries: ${block.count}`);
  console.log(`id file entries: ${ids.length}`);
  console.log(`backup rows: ${counts[0].n}`);
  console.log("QuestionBankItem text was not changed by this hide.");
  console.log("After unhiding, restore NAPLEX bankItems to 9858 and the six-board total to 46008.");
  if (block.count !== EXPECTED) {
    console.log("Stopped. The hide block does not contain 336 entries.");
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No file written.");
    return;
  }

  const next = `${source.slice(0, block.start).replace(/[ \t]*$/, "")}${source.slice(block.end).replace(/^\n/, "")}`;
  if (next.includes(BEGIN) || next.includes("NAPLEX_URGENT_HIDE_AUDIT_REF,")) {
    throw new Error("removal left urgent-hide entries behind");
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
