#!/usr/bin/env node
/**
 * Restore the 58 NCLEX items hidden on 2026-10-27.
 *
 * Hiding set active=false and did not change question text. Dry run is the
 * default and writes nothing. --apply sets active=true on the ids in
 * scripts/data/nclex-hide58-20261027/ids.csv.
 * This script does not DELETE any row. The snapshot table
 * qbi_nclex_hide58_20261027_backup is left in place.
 *
 *   npx tsx scripts/restore-nclex-hide58-20261027.ts
 *   npx tsx scripts/restore-nclex-hide58-20261027.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
if (!ensureDatabaseUrlEnv()) {
  throw new Error("DATABASE_URL is not set");
}

import { Prisma, PrismaClient } from "@prisma/client";

const EXPECTED = 58;
const BACKUP = "qbi_nclex_hide58_20261027_backup";
const IDS_PATH = path.join(process.cwd(), "scripts/data/nclex-hide58-20261027/ids.csv");
const prisma = new PrismaClient();

type CsvRow = { id: string; contentHash: string };
type BankRow = {
  id: string;
  contentHash: string;
  fieldId: string;
  active: boolean;
};

function readCsv(filePath: string): CsvRow[] {
  const lines = readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const [header, ...rest] = lines;
  if (header !== "id,contentHash") {
    throw new Error("ids.csv header must be id,contentHash");
  }
  if (rest.length !== EXPECTED) {
    throw new Error(`ids.csv has ${rest.length} rows, expected ${EXPECTED}`);
  }
  const rows = rest.map((line) => {
    const parts = line.split(",");
    if (parts.length !== 2) throw new Error("ids.csv row must be id,contentHash");
    const [id, contentHash] = parts;
    if (!id || !/^c[a-z0-9]{24}$/.test(id)) throw new Error("ids.csv has an id that is not a cuid");
    if (!contentHash || !/^[a-f0-9]{64}$/.test(contentHash)) {
      throw new Error("ids.csv has a contentHash that is not 64 hex characters");
    }
    return { id, contentHash };
  });
  if (new Set(rows.map((row) => row.id)).size !== EXPECTED) {
    throw new Error("ids.csv has duplicate ids");
  }
  return rows;
}

async function loadRows(ids: string[]): Promise<BankRow[]> {
  return prisma.$queryRaw<BankRow[]>`
    SELECT id, "contentHash", "fieldId", active
    FROM "QuestionBankItem"
    WHERE id IN (${Prisma.join(ids)})
  `;
}

function assertBatch(csv: CsvRow[], found: BankRow[]) {
  const byId = new Map(found.map((row) => [row.id, row]));
  const problems: string[] = [];
  for (const row of csv) {
    const live = byId.get(row.id);
    if (!live) {
      problems.push(`${row.id} is not in QuestionBankItem`);
      continue;
    }
    if (live.contentHash !== row.contentHash) problems.push(`${row.id} contentHash does not match the csv`);
    if (live.fieldId !== "nursing") problems.push(`${row.id} fieldId is ${live.fieldId}`);
  }
  if (found.length !== EXPECTED) problems.push(`found ${found.length} rows, expected ${EXPECTED}`);
  if (problems.length > 0) throw new Error(problems.slice(0, 8).join("; "));
}

async function main() {
  const apply = process.argv.includes("--apply");
  const csv = readCsv(IDS_PATH);
  const ids = csv.map((row) => row.id);

  const backup = await prisma.$queryRaw<Array<{ reg: string | null }>>`
    SELECT to_regclass(${`public.${BACKUP}`})::text AS reg
  `;
  if (!backup[0]?.reg) throw new Error(`${BACKUP} does not exist`);
  const backupRows = await prisma.$queryRaw<Array<{ id: string; contentHash: string; active: boolean }>>`
    SELECT id, "contentHash", active
    FROM ${Prisma.raw(BACKUP)}
  `;
  if (backupRows.length !== EXPECTED) {
    throw new Error(`${BACKUP} has ${backupRows.length} rows, expected ${EXPECTED}`);
  }
  const backupById = new Map(backupRows.map((row) => [row.id, row]));
  for (const row of csv) {
    const saved = backupById.get(row.id);
    if (!saved) throw new Error(`${row.id} is not in ${BACKUP}`);
    if (saved.contentHash !== row.contentHash) throw new Error(`${row.id} backup contentHash does not match the csv`);
    if (saved.active !== true) throw new Error(`${row.id} was not active in the backup`);
  }

  const found = await loadRows(ids);
  assertBatch(csv, found);
  const inactive = found.filter((row) => !row.active).length;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`ids: ${csv.length}`);
  console.log(`rows found: ${found.length}`);
  console.log(`backup rows: ${backupRows.length}`);
  console.log(`currently inactive: ${inactive}`);
  console.log(`already active: ${found.length - inactive}`);
  console.log("This script sets active=true. It does not delete rows.");

  if (inactive !== EXPECTED) {
    throw new Error(`refusing to restore because ${inactive} of ${EXPECTED} rows are inactive`);
  }
  if (!apply) {
    console.log(`Would set active=true on ${inactive} rows.`);
    console.log("No rows written.");
    return;
  }

  const pairs = Prisma.join(csv.map((row) => Prisma.sql`(${row.id}, ${row.contentHash})`));
  const updated = await prisma.$transaction(async (tx) => {
    const live = await tx.$queryRaw<BankRow[]>`
      SELECT id, "contentHash", "fieldId", active
      FROM "QuestionBankItem"
      WHERE id IN (${Prisma.join(ids)})
    `;
    assertBatch(csv, live);
    const stillInactive = live.filter((row) => !row.active).length;
    if (stillInactive !== EXPECTED) {
      throw new Error(`refusing to restore because ${stillInactive} of ${EXPECTED} rows are inactive`);
    }
    return tx.$queryRaw<Array<{ id: string }>>`
      UPDATE "QuestionBankItem" AS q
      SET active = true,
          "updatedAt" = CURRENT_TIMESTAMP
      FROM (VALUES ${pairs}) AS v(id text, hash text)
      WHERE q.id = v.id
        AND q."contentHash" = v.hash
        AND q."fieldId" = 'nursing'
        AND q.active = false
      RETURNING q.id
    `;
  });

  const after = await loadRows(ids);
  assertBatch(csv, after);
  const stillInactive = after.filter((row) => !row.active).length;
  if (after.length !== EXPECTED || stillInactive !== 0 || updated.length !== EXPECTED) {
    throw new Error(`after apply, ${after.length} rows remain, ${stillInactive} are inactive, and ${updated.length} were updated`);
  }
  console.log(`set active=true: ${updated.length}`);
  console.log(`rows still present: ${after.length}`);
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted-url]"));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
