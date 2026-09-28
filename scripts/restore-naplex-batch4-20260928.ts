#!/usr/bin/env node
/**
 * Undo NAPLEX clean-up batch 4.
 *
 * Dry run is the default. It writes nothing and does not drop the backup.
 *
 *   npx tsx scripts/restore-naplex-batch4-20260928.ts
 *   npx tsx scripts/restore-naplex-batch4-20260928.ts --apply
 *
 * --apply copies every non-id column from qbi_naplex_batch4_backup_20260928
 * back onto QuestionBankItem (2,283 key-fix and hide rows plus 30
 * explanation-only rows), removes the naplex-cleanup-batch-4-2026-09-28
 * hide block, and puts the 52 unhide entries back on their previous lists.
 * Then set the NAPLEX bank count back to 9,153 and the six-board total back
 * to 45,207, and deploy.
 *
 * Earlier hide-batch restore scripts count the entries in their own blocks.
 * Those counts drop while these 52 entries are removed, so those restores
 * refuse until this script has put the entries back.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_batch4_backup_20260928";
const EXPECTED = 2313;
const HIDE_EXPECTED = 1905;
const BEGIN = "// naplex-cleanup-batch-4-2026-09-28 BEGIN";
const END = "// naplex-cleanup-batch-4-2026-09-28 END";
const DATA = path.join(process.cwd(), "scripts/data/naplex-batch4-20260928");
const QUEUE = path.join(process.cwd(), "src/lib/exam-prep/reviewed-key-queue.ts");
const prisma = new PrismaClient();

type UnhideEntry = {
  id: string;
  objectSource: string;
  insertBefore: string;
};

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function hideBlock(source: string): { start: number; end: number; count: number } {
  const start = source.indexOf(BEGIN);
  const end = source.indexOf(END);
  if (start < 0 || end < 0 || end < start) throw new Error("batch 4 hide markers are missing");
  if (source.indexOf(BEGIN, start + BEGIN.length) >= 0) throw new Error("batch 4 begin marker is duplicated");
  const block = source.slice(start, end);
  const count = block.split("auditRef: NAPLEX_CLEANUP_BATCH_4_AUDIT_REF").length - 1;
  return { start, end: end + END.length, count };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const source = readFileSync(QUEUE, "utf8");
  const block = hideBlock(source);
  const unhides = JSON.parse(readFileSync(path.join(DATA, "unhide-entries.json"), "utf8")) as UnhideEntry[];
  const fixes = JSON.parse(readFileSync(path.join(DATA, "key-fixes.json"), "utf8")) as Array<{ id: string }>;
  const rationales = JSON.parse(readFileSync(path.join(DATA, "rationale-fixes.json"), "utf8")) as Array<{ id: string }>;
  const hides = JSON.parse(readFileSync(path.join(DATA, "hide-ids.json"), "utf8")) as string[];
  if (
    hides.length !== HIDE_EXPECTED ||
    fixes.length !== 378 ||
    rationales.length !== 30 ||
    hides.length + fixes.length + rationales.length !== EXPECTED
  ) {
    throw new Error("batch 4 id files do not add up to 2313 touched rows");
  }
  if (unhides.length !== 52) throw new Error(`expected 52 unhide entries, found ${unhides.length}`);
  const stillPresent = unhides.filter((entry) => source.includes(`id: "${entry.id}"`));
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  let backupRows: number | null = null;
  if (backup[0]?.reg) {
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int AS n FROM ${BACKUP}`
    )) as Array<{ n: number }>;
    backupRows = rows[0]?.n ?? null;
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide-list entries: ${block.count}`);
  console.log(`unhide entries to put back: ${unhides.length}`);
  console.log(`unhide ids still in the queue: ${stillPresent.length}`);
  console.log(backupRows === null ? "backup table: not created yet" : `backup rows: ${backupRows}`);
  console.log("After restoring, set NAPLEX bankItems back to 9153 and the six-board total back to 45207.");
  if (block.count !== HIDE_EXPECTED) {
    console.log(`Stopped. The hide block does not contain ${HIDE_EXPECTED} entries.`);
    process.exitCode = 1;
    return;
  }
  if (stillPresent.length !== 0) {
    console.log("Stopped. An unhide id is still in the queue.");
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    if (backupRows !== null && backupRows !== EXPECTED) {
      console.log(`Stopped. ${BACKUP} has ${backupRows} rows, expected ${EXPECTED}.`);
      process.exitCode = 1;
      return;
    }
    console.log("No file or row written. The backup table is left in place.");
    return;
  }
  if (backupRows !== EXPECTED) {
    throw new Error(`${BACKUP} has ${backupRows ?? "no"} rows, expected ${EXPECTED}. Apply scripts/apply-naplex-batch4-20260928.ts --apply first.`);
  }

  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${BACKUP}'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  const assignments = columns
    .map((column) => column.column_name)
    .filter((name) => name !== "id")
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(", ");
  const idList = [...hides, ...fixes.map((fix) => fix.id), ...rationales.map((fix) => fix.id)]
    .map((id) => `'${id}'`)
    .join(", ");
  const restored = await prisma.$executeRawUnsafe(`
    UPDATE "QuestionBankItem" q
    SET ${assignments}
    FROM ${BACKUP} b
    WHERE q.id = b.id AND q.id IN (${idList})
  `);
  if (restored !== EXPECTED) throw new Error(`restored ${restored} rows, expected ${EXPECTED}`);

  let next = `${source.slice(0, block.start).replace(/[ \t]*$/, "")}${source.slice(block.end).replace(/^\n/, "")}`;
  if (next.includes(BEGIN) || next.includes("NAPLEX_CLEANUP_BATCH_4_AUDIT_REF,")) {
    throw new Error("removal left batch 4 hide entries behind");
  }
  for (const entry of unhides) {
    const at = next.indexOf(entry.insertBefore);
    if (at < 0 || next.indexOf(entry.insertBefore, at + entry.insertBefore.length) >= 0) {
      throw new Error(`cannot put ${entry.id} back; anchor is missing or duplicated`);
    }
    next = `${next.slice(0, at)}${entry.objectSource}${next.slice(at)}`;
  }
  for (const entry of unhides) {
    if (!next.includes(`id: "${entry.id}"`)) throw new Error(`${entry.id} was not put back`);
  }
  writeFileSync(QUEUE, next);
  console.log(`Restored ${restored} rows and put ${unhides.length} hide-list entries back.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
