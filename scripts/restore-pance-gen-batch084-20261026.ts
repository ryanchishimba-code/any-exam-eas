#!/usr/bin/env node
/**
 * Deactivate the 100 PANCE items inserted from batch 084 on 2026-10-26.
 *
 * Dry run is the default and writes nothing. --apply sets active=false on
 * the ids in scripts/data/pance-gen-batch084-20261026/inserted-ids.csv.
 * This script does not DELETE any row. The snapshot table
 * qbi_pance_gen_batch084_20261026_backup is left in place.
 * This batch assigned no cluster_id. The script does not change cluster_id.
 *
 *   npx tsx scripts/restore-pance-gen-batch084-20261026.ts
 *   npx tsx scripts/restore-pance-gen-batch084-20261026.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
if (!ensureDatabaseUrlEnv()) {
  throw new Error("DATABASE_URL is not set");
}

import { Prisma, PrismaClient } from "@prisma/client";

const EXPECTED = 100;
const GENERATION = "pance-gen-2026-10-batch084-v1";
const IDS_PATH = path.join(
  process.cwd(),
  "scripts/data/pance-gen-batch084-20261026/inserted-ids.csv"
);
const prisma = new PrismaClient();

type CsvRow = { id: string; contentHash: string };
type BankRow = {
  id: string;
  contentHash: string;
  fieldId: string;
  generationVersion: string | null;
  active: boolean;
  manual_correction: boolean;
};

function readCsv(filePath: string): CsvRow[] {
  const lines = readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const [header, ...rest] = lines;
  if (header !== "id,contentHash") {
    throw new Error("inserted-ids.csv header must be id,contentHash");
  }
  if (rest.length !== EXPECTED) {
    throw new Error(`inserted-ids.csv has ${rest.length} rows, expected ${EXPECTED}`);
  }
  const rows = rest.map((line) => {
    const parts = line.split(",");
    if (parts.length !== 2) throw new Error("inserted-ids.csv row must be id,contentHash");
    const [id, contentHash] = parts;
    if (!id || !/^c[a-z0-9]{24}$/.test(id)) throw new Error("inserted-ids.csv has an id that is not a cuid");
    if (!contentHash || !/^[a-f0-9]{64}$/.test(contentHash)) {
      throw new Error("inserted-ids.csv has a contentHash that is not 64 hex characters");
    }
    return { id, contentHash };
  });
  if (new Set(rows.map((row) => row.id)).size !== EXPECTED) {
    throw new Error("inserted-ids.csv has duplicate ids");
  }
  return rows;
}

async function loadRows(ids: string[]): Promise<BankRow[]> {
  return prisma.$queryRaw<BankRow[]>`
    SELECT
      id,
      "contentHash",
      "fieldId",
      "generationVersion",
      active,
      manual_correction
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
    if (live.fieldId !== "pance") problems.push(`${row.id} fieldId is ${live.fieldId}`);
    if (live.generationVersion !== GENERATION) problems.push(`${row.id} generationVersion does not match this batch`);
    if (live.manual_correction !== true) problems.push(`${row.id} manual_correction is not true`);
  }
  if (problems.length > 0) {
    throw new Error(problems.slice(0, 8).join("; "));
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  const csv = readCsv(IDS_PATH);
  const ids = csv.map((row) => row.id);
  const found = await loadRows(ids);
  assertBatch(csv, found);

  const active = found.filter((row) => row.active).length;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`ids: ${csv.length}`);
  console.log(`rows found: ${found.length}`);
  console.log(`currently active: ${active}`);
  console.log(`already inactive: ${found.length - active}`);
  console.log("This script sets active=false. It does not delete rows.");

  if (!apply) {
    console.log(`Would set active=false on ${active} rows.`);
    console.log("No rows written.");
    return;
  }

  const pairs = Prisma.join(csv.map((row) => Prisma.sql`(${row.id}, ${row.contentHash})`));
  const updated = await prisma.$transaction(async (tx) => {
    const live = await tx.$queryRaw<BankRow[]>`
      SELECT
        id,
        "contentHash",
        "fieldId",
        "generationVersion",
        active,
        manual_correction
      FROM "QuestionBankItem"
      WHERE id IN (${Prisma.join(ids)})
    `;
    assertBatch(csv, live);
    return tx.$queryRaw<Array<{ id: string }>>`
      UPDATE "QuestionBankItem" AS q
      SET active = false,
          "updatedAt" = CURRENT_TIMESTAMP
      FROM (VALUES ${pairs}) AS v(id text, hash text)
      WHERE q.id = v.id
        AND q."contentHash" = v.hash
        AND q."fieldId" = 'pance'
        AND q."generationVersion" = ${GENERATION}
        AND q.manual_correction = true
        AND q.active = true
      RETURNING q.id
    `;
  });

  const after = await loadRows(ids);
  assertBatch(csv, after);
  const stillActive = after.filter((row) => row.active).length;
  if (after.length !== EXPECTED || stillActive !== 0) {
    throw new Error(`after apply, ${after.length} rows remain and ${stillActive} are still active`);
  }
  console.log(`set active=false: ${updated.length}`);
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
