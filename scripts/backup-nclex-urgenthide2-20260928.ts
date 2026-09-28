#!/usr/bin/env node
/**
 * Snapshot the second NCLEX urgent-hide ids into
 * qbi_nclex_urgenthide2_backup_20260928, then mark those rows
 * manual_correction so the nightly seed sync will not overwrite them.
 *
 * Dry run is the default. The backup insert and the flag update run inside
 * a transaction and roll back, so nothing is left behind. The insert names
 * every QuestionBankItem column. It does not use SELECT *. Question text,
 * options, keys, and rationales are not changed.
 *
 *   npx tsx scripts/backup-nclex-urgenthide2-20260928.ts
 *   npx tsx scripts/backup-nclex-urgenthide2-20260928.ts --apply
 *
 * The student hide itself is the code list. syncQuestionBank passes
 * KEY_WRONG_ITEM_IDS to nextSeedActive, so these ids are not reactivated.
 * cmqwjuudm000a1yvmde6a50d2 stays in KEY_UNCERTAIN_RN_REVIEW; this hide
 * list takes precedence.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { KEY_WRONG_ITEM_IDS } from "../src/lib/exam-prep/reviewed-key-queue";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const BACKUP = "qbi_nclex_urgenthide2_backup_20260928";
const EXPECTED = 6;
const IDS = path.join(process.cwd(), "scripts/data/nclex-urgenthide2-20260928/hide-ids.json");
const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function eligibilityWithout(ids: readonly string[]): string {
  let sql = studentEligibleAndSql();
  for (const id of ids) {
    const token = `'${id}'`;
    if (sql.includes(`, ${token}`)) sql = sql.replace(`, ${token}`, "");
    else if (sql.includes(`${token}, `)) sql = sql.replace(`${token}, `, "");
    else throw new Error(`${id} is not in the current hide list`);
  }
  return sql;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const ids = JSON.parse(readFileSync(IDS, "utf8")) as string[];
  if (ids.length !== EXPECTED) throw new Error(`id list has ${ids.length} ids, expected ${EXPECTED}`);
  if (new Set(ids).size !== ids.length) throw new Error("hide id list has duplicates");
  for (const id of ids) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
    if (!KEY_WRONG_ITEM_IDS.includes(id)) throw new Error(`${id} is missing from the hide list`);
  }
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const earlier = new Set(KEY_WRONG_ITEM_IDS.filter((id) => !ids.includes(id)));
  const beforeSql = eligibilityWithout(ids);
  const columns = (await prisma.$queryRawUnsafe(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
     ORDER BY ordinal_position`
  )) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  if (!names.includes("manual_correction")) throw new Error("QuestionBankItem is missing manual_correction");
  const colSql = names.map(quoteIdent).join(", ");

  const found = (await prisma.$queryRawUnsafe(`
    SELECT
      id,
      "fieldId" AS field_id,
      COALESCE("itemType", '') AS item_type,
      active,
      "qaPassed" AS qa_passed,
      manual_correction,
      (
        active = true AND "qaPassed" = true AND "fieldId" = 'nursing'
        ${studentEligibleAndSql()}
      ) AS visible_now,
      (
        active = true AND "qaPassed" = true AND "fieldId" = 'nursing'
        ${beforeSql}
      ) AS visible_before
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
  `)) as Array<{
    id: string;
    field_id: string;
    item_type: string;
    active: boolean;
    qa_passed: boolean;
    manual_correction: boolean;
    visible_now: boolean;
    visible_before: boolean;
  }>;
  const byId = new Map(found.map((row) => [row.id, row]));
  const missing = ids.filter((id) => !byId.has(id));
  const ngn = found.filter(
    (row) => row.item_type.startsWith("ngn") || ["matrix", "bow_tie", "highlight", "cloze", "trend"].includes(row.item_type)
  );
  const alreadyHidden = ids.filter((id) => {
    const row = byId.get(id);
    if (!row) return true;
    return earlier.has(id) || !row.visible_before;
  });
  const visibleBeforeIds = ids.filter((id) => byId.get(id)?.visible_before);
  const visibleBefore = visibleBeforeIds.length;
  const unlocked = found.filter((row) => !row.manual_correction).length;

  const prior = (await prisma.$queryRawUnsafe(`
    SELECT
      to_regclass('public.${BACKUP}')::text AS reg,
      (SELECT COUNT(*)::int FROM qbi_nclex_urgenthide1_backup_20260928) AS nclex1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide_backup_20260927) AS u1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide2_backup_20260928) AS u2,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide3_backup_20260928) AS u3,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{
    reg: string | null;
    nclex1: number;
    u1: number;
    u2: number;
    u3: number;
    keyfix: number;
    b1: number;
    b2: number;
  }>;
  const row = prior[0];
  const nursing = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true AND "fieldId" = 'nursing'
    ${studentEligibleAndSql()}
  `)) as Array<{ n: number }>;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide ids: ${ids.length}`);
  console.log(`found: ${found.length}`);
  console.log(`not found: ${missing.join(", ") || "(none)"}`);
  console.log(`currently visible before this hide: ${visibleBefore}`);
  console.log(`visible ids: ${visibleBeforeIds.join(", ") || "(none)"}`);
  console.log(`visible with this hide list loaded: ${found.filter((item) => item.visible_now).length}`);
  console.log(`already hidden: ${alreadyHidden.join(", ") || "(none)"}`);
  console.log(`ngn: ${ngn.length}`);
  console.log(`item types: ${[...new Set(found.map((item) => item.item_type))].join(", ") || "(none)"}`);
  console.log(`would set manual_correction: ${unlocked}`);
  console.log(`columns: ${names.length}`);
  console.log(`nursing eligible with this list: ${nursing[0]?.n}`);
  console.log(
    `other backups: nclex urgent1 ${row?.nclex1}, urgent1 ${row?.u1}, urgent2 ${row?.u2}, urgent3 ${row?.u3}, keyfix ${row?.keyfix}, nclex b1 ${row?.b1}, nclex b2 ${row?.b2}`
  );
  console.log("Question text, options, keys, and rationales would not change.");
  if (row?.reg) throw new Error(`${BACKUP} already exists`);
  if (found.length !== ids.length) throw new Error(`only ${found.length} of ${ids.length} hide ids exist`);
  if (visibleBefore !== EXPECTED || found.some((item) => item.visible_now)) {
    throw new Error("hide rows are not all visible before this list and hidden by it");
  }
  if (
    row?.nclex1 !== 96 ||
    row?.u1 !== 336 ||
    row?.u2 !== 247 ||
    row?.u3 !== 122 ||
    row?.keyfix !== 278 ||
    row?.b1 !== 125 ||
    row?.b2 !== 105
  ) {
    throw new Error("an earlier backup count changed");
  }
  if (nursing[0]?.n !== 5419) throw new Error(`nursing eligible is ${nursing[0]?.n}, expected 5419`);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`CREATE TABLE ${BACKUP} (LIKE "QuestionBankItem" INCLUDING ALL)`);
      const inserted = (await tx.$queryRawUnsafe(`
        WITH ins AS (
          INSERT INTO ${BACKUP} (${colSql})
          SELECT ${colSql}
          FROM "QuestionBankItem"
          WHERE id IN (${idList})
          RETURNING id
        )
        SELECT COUNT(*)::int AS n FROM ins
      `)) as Array<{ n: number }>;
      const flagged = (await tx.$queryRawUnsafe(`
        WITH upd AS (
          UPDATE "QuestionBankItem"
          SET manual_correction = true
          WHERE id IN (${idList})
            AND manual_correction = false
          RETURNING id
        )
        SELECT COUNT(*)::int AS n FROM upd
      `)) as Array<{ n: number }>;
      const count = (await tx.$queryRawUnsafe(
        `SELECT COUNT(*)::int AS n, COUNT(DISTINCT id)::int AS distinct_ids FROM ${BACKUP}`
      )) as Array<{ n: number; distinct_ids: number }>;
      console.log(`inserted rows: ${inserted[0]?.n}`);
      console.log(`backup rows: ${count[0]?.n}`);
      console.log(`distinct backup ids: ${count[0]?.distinct_ids}`);
      console.log(`manual_correction rows updated: ${flagged[0]?.n}`);
      if (inserted[0]?.n !== EXPECTED || count[0]?.n !== EXPECTED || count[0]?.distinct_ids !== EXPECTED) {
        throw new Error("backup row count did not match the hide list");
      }
      if ((flagged[0]?.n ?? -1) !== unlocked) throw new Error("flag update count did not match the dry-run set");
      if (!apply) throw new DryRunRollback();
    }, { timeout: 60_000 });
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const left = (await prisma.$queryRawUnsafe(`
        SELECT
          to_regclass('public.${BACKUP}')::text AS reg,
          (SELECT COUNT(*)::int FROM "QuestionBankItem" WHERE id IN (${idList}) AND manual_correction = true) AS locked
      `)) as Array<{ reg: string | null; locked: number }>;
      if (left[0]?.reg) throw new Error("dry run left the backup table behind");
      const lockedBefore = found.filter((item) => item.manual_correction).length;
      if (left[0]?.locked !== lockedBefore) throw new Error("dry run changed manual_correction");
      console.log("Rolled back. No table left. manual_correction unchanged.");
      return;
    }
    throw error;
  }
  console.log(`Committed ${BACKUP} and set manual_correction.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
