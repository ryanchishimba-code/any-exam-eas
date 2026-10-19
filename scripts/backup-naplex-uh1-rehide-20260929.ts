#!/usr/bin/env node
/**
 * Snapshot 16 NAPLEX items into qbi_naplex_uh1_rehide_backup_20260929, then
 * mark those rows manual_correction so the nightly seed sync will not
 * overwrite them.
 *
 * These are the original 2026-09-27 urgent-hide items that batch 4 returned
 * to students without correcting the answer key. Sixteen other ids from that
 * same gap were left visible because the live key and explanation already
 * resolve the original defect. This script does not touch those rows.
 *
 * Dry run is the default. The backup insert and the flag update run inside
 * a transaction and roll back, so nothing is left behind. The insert names
 * every QuestionBankItem column. It does not use SELECT *. Question text,
 * options, keys, and rationales are not changed.
 *
 *   npx tsx scripts/backup-naplex-uh1-rehide-20260929.ts
 *   npx tsx scripts/backup-naplex-uh1-rehide-20260929.ts --apply
 *
 * The student hide itself is the code list. syncQuestionBank passes
 * KEY_WRONG_ITEM_IDS to nextSeedActive, so these ids are not reactivated.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { KEY_WRONG_ITEM_IDS } from "../src/lib/exam-prep/reviewed-key-queue";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const BACKUP = "qbi_naplex_uh1_rehide_backup_20260929";
const EXPECTED = 16;
const IDS = path.join(process.cwd(), "scripts/data/naplex-uh1-rehide-20260929/hide-ids.json");
const prisma = new PrismaClient();

const STEMS: Array<{ id: string; questionLike: string; key: string }> = [
  {
    id: "cmqvmk3g8001b1ydnqgymwtll",
    questionLike: "%monitoring parameter%",
    key: "Renal function (eGFR)",
  },
  {
    id: "cmqvqc9lf000t1yys5hya9593",
    questionLike: "%metformin therapy%",
    key: "Discontinue metformin until renal function improves.",
  },
  {
    id: "cmqvsvh0t001m1yuool6knxt0",
    questionLike: "%counseling point is most important%",
    key: "Hold metformin and consult her healthcare provider due to renal impairment.",
  },
  {
    id: "cmqw508zu001g1yq28e63go3p",
    questionLike: "%metformin prescription%",
    key: "Contact the prescriber to discuss the appropriateness of metformin given her renal function.",
  },
  {
    id: "cmqw7d7hd001d1yfanxpg72cu",
    questionLike: "%new metformin prescription%",
    key: "Metformin should be taken with food to minimize gastrointestinal side effects.",
  },
  {
    id: "cmqxaurxd001c1yprzyyp1n4k",
    questionLike: "%laboratory value%",
    key: "Low sodium levels.",
  },
  {
    id: "cmr0q12uc001h1y9a02tjh4n4",
    questionLike: "%sertraline therapy%",
    key: "It may take several weeks to feel the full effects of sertraline.",
  },
  {
    id: "cmr0ri55k001i1y8jwlhd6tst",
    questionLike: "%best choice to add%",
    key: "Ipratropium bromide",
  },
  {
    id: "cmr7xe1lj000y1ydxyjh25fni",
    questionLike: "%drug interaction%",
    key: "Cephalexin",
  },
  {
    id: "cmr7yhwa7001c1yr34xluyvha",
    questionLike: "%pharmacist take first%",
    key: "Contact the prescriber to discuss the patient's renal function.",
  },
  {
    id: "cmr7yy1oh00151yu82cl9q1ra",
    questionLike: "%metformin therapy%",
    key: "Monitor for signs of lactic acidosis.",
  },
  {
    id: "cmr7yy23f001a1yu8p1xogsrq",
    questionLike: "%immediate follow-up%",
    key: "Shortness of breath at rest.",
  },
  {
    id: "cmra72a7k004r1ybj9kql64j9",
    questionLike: "%adjusted or discontinued%",
    key: "Metformin",
  },
  {
    id: "cmsfj9z5a00001ymsjk3jd5en",
    questionLike: "%alendronate%",
    key: "Take alendronate with a full glass of water and remain upright for 30 minutes.",
  },
  {
    id: "cmshcyzzz002h1yarlluf8rq0",
    questionLike: "%enoxaparin order%",
    key: "Recommend holding the enoxaparin dose until warfarin is discontinued.",
  },
  {
    id: "cmshkb54a00071ys71be8jfgd",
    questionLike: "%loading dose of digoxin%",
    key: "490 mcg",
  },
];

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

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
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
  if (ids.join(",") !== STEMS.map((stem) => stem.id).join(",")) {
    throw new Error("hide id list does not match the expected ids");
  }
  for (const id of ids) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
    if (!KEY_WRONG_ITEM_IDS.includes(id)) throw new Error(`${id} is missing from the hide list`);
  }
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const earlier = new Set(KEY_WRONG_ITEM_IDS.filter((id) => !ids.includes(id)));
  const beforeSql = eligibilityWithout(ids);
  const stemSql = STEMS.map(
    (stem) =>
      `(id = '${stem.id}' AND question ILIKE ${sqlLiteral(stem.questionLike)} AND "correctAnswer" = ${sqlLiteral(stem.key)})`
  ).join(" OR ");
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
        active = true AND "qaPassed" = true
        AND "fieldId" = 'pharmacy'
        ${studentEligibleAndSql()}
      ) AS visible_now,
      (
        active = true AND "qaPassed" = true
        AND "fieldId" = 'pharmacy'
        ${beforeSql}
      ) AS visible_before,
      (${stemSql}) AS stem_ok
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
    stem_ok: boolean;
  }>;
  const byId = new Map(found.map((row) => [row.id, row]));
  const missing = ids.filter((id) => !byId.has(id));
  const wrongField = ids.filter((id) => byId.get(id)?.field_id !== "pharmacy");
  const stemMiss = ids.filter((id) => byId.get(id)?.stem_ok !== true);
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
      (SELECT COUNT(*)::int FROM qbi_nclex_urgenthide2_backup_20260928) AS nclex2,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide_backup_20260927) AS u1,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide2_backup_20260928) AS u2,
      (SELECT COUNT(*)::int FROM qbi_naplex_urgenthide3_backup_20260928) AS u3,
      (SELECT COUNT(*)::int FROM qbi_naplex_keyfix_backup_20260927) AS keyfix,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2,
      (SELECT COUNT(*)::int FROM qbi_naplex_rationale5_backup_20260928) AS r5,
      (SELECT COUNT(*)::int FROM qbi_naplex_batch4_backup_20260928) AS b4,
      (SELECT COUNT(*)::int FROM qbi_cmr31dgmm_backup_20260928) AS cmr,
      (SELECT COUNT(*)::int FROM qbi_urgenthide3_backup_20260928) AS uh3,
      (SELECT COUNT(*)::int FROM qbi_urgenthide4_backup_20260928) AS uh4
  `)) as Array<{
    reg: string | null;
    nclex1: number;
    nclex2: number;
    u1: number;
    u2: number;
    u3: number;
    keyfix: number;
    b1: number;
    b2: number;
    r5: number;
    b4: number;
    cmr: number;
    uh3: number;
    uh4: number;
  }>;
  const row = prior[0];
  const counts = (await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM "QuestionBankItem"
        WHERE active = true AND "qaPassed" = true AND "fieldId" = 'pharmacy'
        ${studentEligibleAndSql()}) AS pharmacy,
      (SELECT COUNT(*)::int FROM "QuestionBankItem"
        WHERE active = true AND "qaPassed" = true AND "fieldId" = 'nursing'
        ${studentEligibleAndSql()}) AS nursing,
      (SELECT COUNT(*)::int FROM "QuestionBankItem"
        WHERE active = true AND "qaPassed" = true AND "fieldId" = 'aanp-fnp'
        ${studentEligibleAndSql()}) AS aanp
  `)) as Array<{ pharmacy: number; nursing: number; aanp: number }>;
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`hide ids: ${ids.length}`);
  console.log(`found: ${found.length}`);
  console.log(`not found: ${missing.join(", ") || "(none)"}`);
  console.log(`wrong field: ${wrongField.join(", ") || "(none)"}`);
  console.log(`stem mismatch: ${stemMiss.join(", ") || "(none)"}`);
  console.log(`currently visible before this hide: ${visibleBefore}`);
  console.log(`visible ids: ${visibleBeforeIds.join(", ") || "(none)"}`);
  console.log(`visible with this hide list loaded: ${found.filter((item) => item.visible_now).length}`);
  console.log(`already hidden: ${alreadyHidden.join(", ") || "(none)"}`);
  console.log(`item types: ${[...new Set(found.map((item) => item.item_type))].join(", ") || "(none)"}`);
  console.log(`would set manual_correction: ${unlocked}`);
  console.log(`columns: ${names.length}`);
  console.log(`pharmacy eligible with this list: ${counts[0]?.pharmacy}`);
  console.log(`nursing eligible with this list: ${counts[0]?.nursing}`);
  console.log(`aanp-fnp eligible with this list: ${counts[0]?.aanp}`);
  console.log(
    `other backups: nclex urgent1 ${row?.nclex1}, nclex urgent2 ${row?.nclex2}, urgent1 ${row?.u1}, urgent2 ${row?.u2}, urgent3 ${row?.u3}, keyfix ${row?.keyfix}, nclex b1 ${row?.b1}, nclex b2 ${row?.b2}, rationale5 ${row?.r5}, batch4 ${row?.b4}, cmr31dgmm ${row?.cmr}, urgenthide3 ${row?.uh3}, urgenthide4 ${row?.uh4}`
  );
  console.log("Question text, options, keys, and rationales would not change.");
  if (row?.reg) throw new Error(`${BACKUP} already exists`);
  if (found.length !== ids.length) throw new Error(`only ${found.length} of ${ids.length} hide ids exist`);
  if (wrongField.length > 0) throw new Error("a hide id is on the wrong board");
  if (stemMiss.length > 0) throw new Error("a hide id does not match the expected stem");
  if (visibleBefore !== EXPECTED || found.some((item) => item.visible_now)) {
    throw new Error("hide rows are not all visible before this list and hidden by it");
  }
  if (
    row?.nclex1 !== 96 ||
    row?.nclex2 !== 6 ||
    row?.u1 !== 336 ||
    row?.u2 !== 247 ||
    row?.u3 !== 122 ||
    row?.keyfix !== 278 ||
    row?.b1 !== 125 ||
    row?.b2 !== 105 ||
    row?.r5 !== 5 ||
    row?.b4 !== 2313 ||
    row?.cmr !== 1 ||
    row?.uh3 !== 6 ||
    row?.uh4 !== 4
  ) {
    throw new Error("an earlier backup count changed");
  }
  if (counts[0]?.pharmacy !== 7284) throw new Error(`pharmacy eligible is ${counts[0]?.pharmacy}, expected 7284`);
  if (counts[0]?.nursing !== 5413) throw new Error(`nursing eligible is ${counts[0]?.nursing}, expected 5413`);
  if (counts[0]?.aanp !== 6101) throw new Error(`aanp-fnp eligible is ${counts[0]?.aanp}, expected 6101`);

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
