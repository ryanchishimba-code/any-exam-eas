#!/usr/bin/env node
/**
 * Replace the explanations on five NAPLEX items that teach the wrong drug fact.
 * Stems, option text, and answer keys stay as they are.
 *
 * Dry run is the default. It writes nothing and prints the before/after
 * explanation for each row.
 *
 *   npx tsx scripts/fix-naplex-rationale5-20260928.ts
 *   npx tsx scripts/fix-naplex-rationale5-20260928.ts --apply
 *
 * --apply copies the five current rows into qbi_naplex_rationale5_backup_20260928
 * (every QuestionBankItem column, no SELECT *), then sets explanation and
 * manual_correction. The nightly seed sync skips a row with that flag.
 * None of these five are static seed rows.
 *
 * Undo with: npx tsx scripts/restore-naplex-rationale5-20260928.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { collectSeedQuestionRows } from "../src/lib/question-bank-seed";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const BACKUP = "qbi_naplex_rationale5_backup_20260928";
const DATA = path.join(process.cwd(), "scripts/data/naplex-rationale5-20260928/corrections.json");
const prisma = new PrismaClient();

type Correction = {
  id: string;
  expectedKey: string;
  fieldsToUpdate: string[];
  explanation: string;
  mustInclude: string[];
};

type LiveRow = {
  id: string;
  source: string;
  field_id: string;
  subject_id: string;
  scenario: string | null;
  question: string;
  key: string;
  explanation: string;
  options: string;
  hash: string;
  manual_correction: boolean;
  active: boolean;
  qa_passed: boolean;
};

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function loadCorrections(): Correction[] {
  const rows = JSON.parse(readFileSync(DATA, "utf8")) as Correction[];
  if (rows.length !== 5) throw new Error(`expected 5 corrections, found ${rows.length}`);
  const ids = new Set<string>();
  for (const row of rows) {
    if (!/^[a-z0-9]+$/.test(row.id)) throw new Error(`unexpected id: ${row.id}`);
    if (ids.has(row.id)) throw new Error(`duplicate id: ${row.id}`);
    ids.add(row.id);
    if (row.fieldsToUpdate.join(",") !== "explanation") {
      throw new Error(`${row.id} updates ${row.fieldsToUpdate.join(",")}, expected explanation only`);
    }
    if (!row.explanation.trim() || !row.expectedKey.trim()) {
      throw new Error(`${row.id} is missing explanation or key`);
    }
    for (const phrase of row.mustInclude) {
      if (!row.explanation.includes(phrase)) {
        throw new Error(`${row.id} explanation is missing: ${phrase}`);
      }
    }
  }
  return rows;
}

function optionTexts(raw: string): string[] {
  const parsed = JSON.parse(raw) as { options?: unknown };
  if (!Array.isArray(parsed.options) || parsed.options.some((option) => typeof option !== "string")) {
    throw new Error("options JSON is missing a string options array");
  }
  return parsed.options as string[];
}

async function main() {
  const apply = process.argv.includes("--apply");
  const corrections = loadCorrections();
  const byId = new Map(corrections.map((row) => [row.id, row]));
  const idList = corrections.map((row) => `'${row.id}'`).join(", ");

  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  if (!names.includes("manual_correction") || !names.includes("explanation")) {
    throw new Error("QuestionBankItem is missing explanation or manual_correction");
  }
  const colSql = names.map(quoteIdent).join(", ");

  const live = (await prisma.$queryRawUnsafe(`
    SELECT
      id,
      source,
      "fieldId" AS field_id,
      "subjectId" AS subject_id,
      scenario,
      question,
      "correctAnswer" AS key,
      explanation,
      options,
      "contentHash" AS hash,
      manual_correction,
      active,
      "qaPassed" AS qa_passed
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
  `)) as LiveRow[];
  const liveById = new Map(live.map((row) => [row.id, row]));

  const seedHashes = new Set(
    collectSeedQuestionRows().map((row) => bankItemContentHash(row.fieldId, row.subjectId, row.item))
  );
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup table: ${backup[0]?.reg ?? "absent"}`);
  console.log(`columns snapshotted: ${names.length}`);
  console.log("Stems, option text, and answer keys are not updated.");
  console.log("options.clinicalReasoning, distractorRationale, and generationMeta are not updated.");

  for (const correction of corrections) {
    const row = liveById.get(correction.id);
    console.log(`\n===== ${correction.id} =====`);
    if (!row) {
      console.log("missing from QuestionBankItem");
      continue;
    }
    const options = optionTexts(row.options);
    const seed = seedHashes.has(row.hash);
    console.log(`source: ${row.source}`);
    console.log(`field: ${row.field_id}`);
    console.log(`active: ${row.active} qaPassed: ${row.qa_passed} manual_correction: ${row.manual_correction}`);
    console.log(`seed hash match: ${seed ? "yes" : "no"}`);
    console.log(`key: ${row.key}`);
    console.log(`options: ${options.join(" | ")}`);
    console.log(`explanation length: ${row.explanation.length} -> ${correction.explanation.length}`);
    console.log("--- BEFORE explanation ---");
    console.log(row.explanation);
    console.log("--- AFTER explanation ---");
    console.log(correction.explanation);
    console.log(`key unchanged: ${row.key === correction.expectedKey}`);
  }

  const problems: string[] = [];
  if (backup[0]?.reg) problems.push(`${BACKUP} already exists`);
  if (live.length !== corrections.length) problems.push(`found ${live.length} of ${corrections.length}`);
  for (const correction of corrections) {
    const row = liveById.get(correction.id);
    if (!row) continue;
    if (row.field_id !== "pharmacy") problems.push(`${row.id} field is ${row.field_id}`);
    if (row.key !== correction.expectedKey) problems.push(`${row.id} key is ${row.key}`);
    if (row.explanation === correction.explanation) problems.push(`${row.id} explanation is already the new text`);
    if (row.manual_correction) problems.push(`${row.id} already has manual_correction`);
    if (seedHashes.has(row.hash) || row.source === "seed") problems.push(`${row.id} is a seed row`);
    if (!row.question.trim()) problems.push(`${row.id} has an empty stem`);
    optionTexts(row.options);
  }
  if (problems.length > 0) {
    console.log(`\nStopped: ${problems.join("; ")}`);
    process.exitCode = 1;
    return;
  }

  if (!apply) {
    console.log("\nNo file or row written.");
    return;
  }

  const updated = await prisma.$transaction(async (tx) => {
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
    if (inserted[0]?.n !== 5) throw new Error(`backup inserted ${inserted[0]?.n ?? 0} rows`);

    let changed = 0;
    for (const correction of corrections) {
      const row = liveById.get(correction.id);
      if (!row) throw new Error(`missing ${correction.id}`);
      const count = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET explanation = ${correction.explanation},
            manual_correction = true,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${correction.id}
          AND "correctAnswer" = ${row.key}
          AND explanation = ${row.explanation}
          AND question = ${row.question}
          AND options = ${row.options}
          AND manual_correction = false
      `;
      if (count !== 1) throw new Error(`${correction.id} updated ${count} rows`);
      changed += count;
    }
    return changed;
  }, { timeout: 60_000 });

  const after = (await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS backup_rows,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" q
        JOIN ${BACKUP} b ON b.id = q.id
        WHERE q.manual_correction = true
          AND q.explanation IS DISTINCT FROM b.explanation
          AND q.question IS NOT DISTINCT FROM b.question
          AND q.options IS NOT DISTINCT FROM b.options
          AND q."correctAnswer" IS NOT DISTINCT FROM b."correctAnswer"
          AND q."contentHash" IS NOT DISTINCT FROM b."contentHash") AS verified
  `)) as Array<{ backup_rows: number; verified: number }>;
  const digoxin = byId.get("cmshfncn9000r1y4n9bjpwd82");
  const liveDigoxin = (await prisma.$queryRawUnsafe(`
    SELECT explanation
    FROM "QuestionBankItem"
    WHERE id = 'cmshfncn9000r1y4n9bjpwd82'
  `)) as Array<{ explanation: string }>;
  console.log(`updated rows: ${updated}`);
  console.log(`backup rows: ${after[0]?.backup_rows}`);
  console.log(`verified locked rows: ${after[0]?.verified}`);
  const teaching = liveDigoxin[0]?.explanation.includes("IV dose = oral dose × F") &&
    liveDigoxin[0]?.explanation.includes("0.094 mg");
  console.log(`digoxin explanation teaches IV = oral × F = 0.094 mg: ${teaching ? "yes" : "no"}`);
  if (
    updated !== 5 ||
    after[0]?.backup_rows !== 5 ||
    after[0]?.verified !== 5 ||
    !teaching ||
    !digoxin
  ) {
    throw new Error("post-update check failed");
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
