#!/usr/bin/env node
/**
 * Put the 147 NCLEX items relabelled on 2026-10-27 back to select_all.
 *
 * The relabel changed itemType from select_all to vignette. It did not change
 * the stem, options, key, or rationale. The Sep 25 studentEligibility record
 * was left in place because it does not hide a vignette; the full-row snapshot
 * qbi_nclex_relabel147_20261027_backup still holds that record.
 *
 * Dry run is the default and writes nothing. --apply sets itemType back to
 * select_all on the ids in scripts/data/nclex-relabel147-20261027/ids.csv.
 * This script does not DELETE any row and does not change curation_meta.
 * The backup table is left in place.
 *
 *   npx tsx scripts/restore-nclex-relabel147-20261027.ts
 *   npx tsx scripts/restore-nclex-relabel147-20261027.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
if (!ensureDatabaseUrlEnv()) {
  throw new Error("DATABASE_URL is not set");
}

import { Prisma, PrismaClient } from "@prisma/client";

const EXPECTED = 147;
const BACKUP = "qbi_nclex_relabel147_20261027_backup";
const IDS_PATH = path.join(process.cwd(), "scripts/data/nclex-relabel147-20261027/ids.csv");
const prisma = new PrismaClient();

type CsvRow = { id: string; contentHash: string };
type BankRow = {
  id: string;
  contentHash: string;
  fieldId: string;
  itemType: string | null;
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
    SELECT id, "contentHash", "fieldId", "itemType"
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
  const backupRows = await prisma.$queryRaw<Array<{ id: string; contentHash: string; itemType: string | null }>>`
    SELECT id, "contentHash", "itemType"
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
    if (saved.itemType !== "select_all") throw new Error(`${row.id} backup itemType is ${saved.itemType}`);
  }

  const found = await loadRows(ids);
  assertBatch(csv, found);
  const vignette = found.filter((row) => row.itemType === "vignette").length;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`ids: ${csv.length}`);
  console.log(`rows found: ${found.length}`);
  console.log(`backup rows: ${backupRows.length}`);
  console.log(`currently vignette: ${vignette}`);
  console.log("This script sets itemType back to select_all. It does not delete rows or edit curation_meta.");

  if (vignette !== EXPECTED) {
    throw new Error(`refusing to restore because ${vignette} of ${EXPECTED} rows are vignette`);
  }
  if (!apply) {
    console.log(`Would set itemType=select_all on ${vignette} rows.`);
    console.log("No rows written.");
    return;
  }

  const pairs = Prisma.join(csv.map((row) => Prisma.sql`(${row.id}, ${row.contentHash})`));
  const updated = await prisma.$transaction(async (tx) => {
    const live = await tx.$queryRaw<BankRow[]>`
      SELECT id, "contentHash", "fieldId", "itemType"
      FROM "QuestionBankItem"
      WHERE id IN (${Prisma.join(ids)})
    `;
    assertBatch(csv, live);
    const stillVignette = live.filter((row) => row.itemType === "vignette").length;
    if (stillVignette !== EXPECTED) {
      throw new Error(`refusing to restore because ${stillVignette} of ${EXPECTED} rows are vignette`);
    }
    return tx.$queryRaw<Array<{ id: string }>>`
      UPDATE "QuestionBankItem" AS q
      SET "itemType" = 'select_all',
          "updatedAt" = CURRENT_TIMESTAMP
      FROM (VALUES ${pairs}) AS v(id text, hash text)
      WHERE q.id = v.id
        AND q."contentHash" = v.hash
        AND q."fieldId" = 'nursing'
        AND q."itemType" = 'vignette'
      RETURNING q.id
    `;
  });

  const after = await loadRows(ids);
  assertBatch(csv, after);
  const stillVignette = after.filter((row) => row.itemType === "vignette").length;
  const selectAll = after.filter((row) => row.itemType === "select_all").length;
  if (after.length !== EXPECTED || stillVignette !== 0 || selectAll !== EXPECTED || updated.length !== EXPECTED) {
    throw new Error(
      `after apply, ${after.length} rows remain, ${selectAll} are select_all, and ${updated.length} were updated`
    );
  }
  console.log(`set itemType=select_all: ${updated.length}`);
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
