#!/usr/bin/env node
/**
 * Replace the explanations on 25 NAPLEX items.
 * Stems, option text, and answer keys stay as they are.
 *
 * Dry run is the default. It writes nothing.
 *
 *   npx tsx scripts/apply-naplex-rationale25-20260928.ts
 *   npx tsx scripts/apply-naplex-rationale25-20260928.ts --apply
 *
 * --apply copies the 25 current rows into qbi_naplex_rationale25_backup_20260928
 * (explicit column list, no SELECT *), then sets explanation and
 * manual_correction. Stored per-option explanations, clinical reasoning,
 * and expert rationales are left unchanged when the sheet does not supply
 * a replacement. None of these rows are static seeds, and none are in the
 * NAPLEX batch-4 hide list.
 *
 * Undo with: npx tsx scripts/restore-naplex-rationale25-20260928.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { publishedSiteQuestionCounts } from "../src/lib/counts";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import { collectSeedQuestionRows } from "../src/lib/question-bank-seed";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const BACKUP = "qbi_naplex_rationale25_backup_20260928";
const DATA = path.join(process.cwd(), "scripts/data/naplex-rationale25-20260928");
const EXPECTED = 25;
const prisma = new PrismaClient();

type Fix = {
  id: string;
  currentKey: string;
  explanation: string;
  fieldsToUpdate: string[];
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
  meta: unknown;
  hash: string;
  manual_correction: boolean;
  active: boolean;
  qa_passed: boolean;
  visible: boolean;
};

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function rationaleCopyReasons(optionsJson: string, meta: unknown): string[] {
  const parsed = JSON.parse(optionsJson) as Record<string, unknown>;
  const reasons: string[] = [];
  if (
    parsed.distractorRationale &&
    typeof parsed.distractorRationale === "object" &&
    !Array.isArray(parsed.distractorRationale) &&
    Object.keys(parsed.distractorRationale as Record<string, unknown>).length > 0
  ) {
    reasons.push("options.distractorRationale");
  }
  if (typeof parsed.clinicalReasoning === "string" && parsed.clinicalReasoning.trim()) {
    reasons.push("options.clinicalReasoning");
  }
  if (Array.isArray(parsed.keyTakeaways) && parsed.keyTakeaways.length > 0) {
    reasons.push("options.keyTakeaways");
  }
  const columnMeta = meta && typeof meta === "object" ? (meta as Record<string, unknown>) : {};
  if (columnMeta.expertRationale && typeof columnMeta.expertRationale === "object") {
    reasons.push("generationMeta.expertRationale");
  }
  const nested = parsed.generationMeta && typeof parsed.generationMeta === "object"
    ? (parsed.generationMeta as Record<string, unknown>)
    : {};
  if (nested.structuredRationale) reasons.push("options.generationMeta.structuredRationale");
  if (nested.expertRationale && typeof nested.expertRationale === "object") {
    reasons.push("options.generationMeta.expertRationale");
  }
  return reasons;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const fixes = JSON.parse(readFileSync(path.join(DATA, "corrections.json"), "utf8")) as Fix[];
  const listedFile = JSON.parse(readFileSync(path.join(DATA, "copies-left.json"), "utf8")) as Array<{
    id: string;
    reasons: string[];
  }>;
  if (fixes.length !== EXPECTED) throw new Error(`expected ${EXPECTED} fixes, found ${fixes.length}`);
  const ids = new Set<string>();
  for (const fix of fixes) {
    if (!/^[a-z0-9]+$/.test(fix.id)) throw new Error(`unexpected id: ${fix.id}`);
    if (ids.has(fix.id)) throw new Error(`duplicate id: ${fix.id}`);
    ids.add(fix.id);
    if (fix.fieldsToUpdate.join(",") !== "explanation") throw new Error(`${fix.id} updates another field`);
    if (!fix.explanation.trim() || !fix.currentKey.trim()) throw new Error(`${fix.id} is missing text`);
  }
  const idList = fixes.map((fix) => `'${fix.id}'`).join(", ");
  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  if (!names.includes("manual_correction")) throw new Error("manual_correction column is missing");
  const colSql = names.map(quoteIdent).join(", ");

  const live = (await prisma.$queryRawUnsafe(`
    SELECT
      id, source, "fieldId" AS field_id, "subjectId" AS subject_id, scenario,
      question, "correctAnswer" AS key, explanation, options,
      "generationMeta" AS meta, "contentHash" AS hash, manual_correction,
      active, "qaPassed" AS qa_passed,
      (
        active = true AND "qaPassed" = true AND "fieldId" = 'pharmacy'
        ${studentEligibleAndSql()}
      ) AS visible
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
  `)) as LiveRow[];
  const byId = new Map(live.map((row) => [row.id, row]));
  const seedHashes = new Set(
    collectSeedQuestionRows().map((row) => bankItemContentHash(row.fieldId, row.subjectId, row.item))
  );
  const naplex = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true AND "fieldId" = 'pharmacy'
    ${studentEligibleAndSql()}
  `)) as Array<{ n: number }>;
  const published = publishedSiteQuestionCounts();
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;

  const mismatches: Array<{ id: string; reason: string }> = [];
  const planned: Array<{ fix: Fix; row: LiveRow }> = [];
  const listed: Array<{ id: string; reasons: string[] }> = [];
  for (const fix of fixes) {
    const row = byId.get(fix.id);
    if (!row) {
      mismatches.push({ id: fix.id, reason: "missing" });
      continue;
    }
    if (row.key !== fix.currentKey || row.field_id !== "pharmacy") {
      mismatches.push({ id: fix.id, reason: `live key does not match (${row.key})` });
      continue;
    }
    if (!fix.explanation.trim() || row.explanation === fix.explanation) {
      mismatches.push({ id: fix.id, reason: "explanation is empty or already live" });
      continue;
    }
    if (seedHashes.has(row.hash) || row.source === "seed") {
      mismatches.push({ id: fix.id, reason: "seed row" });
      continue;
    }
    try {
      const reasons = rationaleCopyReasons(row.options, row.meta);
      if (reasons.length > 0) listed.push({ id: fix.id, reasons });
    } catch {
      mismatches.push({ id: fix.id, reason: "options-unparseable" });
      continue;
    }
    planned.push({ fix, row });
  }
  const listedIds = listed.map((row) => `${row.id}:${row.reasons.join("|")}`).sort();
  const fileIds = listedFile.map((row) => `${row.id}:${row.reasons.join("|")}`).sort();
  const listedSame = JSON.stringify(listedIds) === JSON.stringify(fileIds);
  const alreadyLocked = planned.filter((row) => row.row.manual_correction).map((row) => row.fix.id);
  const visible = planned.filter((row) => row.row.visible).length;

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup table: ${backup[0]?.reg ?? "absent"}`);
  console.log(`columns snapshotted: ${names.length}`);
  console.log(`explanation-only fixes: ${planned.length}${mismatches.length ? ` mismatches ${mismatches.map((row) => `${row.id} (${row.reason})`).join(", ")}` : ""}`);
  console.log(`key mismatches: ${mismatches.filter((row) => row.reason.startsWith("live key")).length}`);
  console.log(`seed rows: ${mismatches.filter((row) => row.reason === "seed row").length}`);
  console.log(`visible now: ${visible}`);
  console.log(`already manual_correction: ${alreadyLocked.length}${alreadyLocked.length ? ` ${alreadyLocked.join(", ")}` : ""}`);
  console.log(`explanation-only copies left: ${listed.length}`);
  console.log(`copies-left.json matches this run: ${listedSame}`);
  console.log(`live pharmacy eligible: ${naplex[0]?.n}`);
  console.log(`published NAPLEX stamp: ${published.boards.naplex.bankItems}`);
  console.log("Stems, option text, and answer keys are not changed.");

  const problems: string[] = [];
  if (backup[0]?.reg) problems.push(`${BACKUP} already exists`);
  if (mismatches.length !== 0 || planned.length !== EXPECTED) problems.push("explanation-only fixes are not all applicable");
  if (visible !== EXPECTED) problems.push("an explanation-only row is not currently visible");
  if (!listedSame) problems.push("copies-left.json is stale");
  if (naplex[0]?.n !== 9153 || published.boards.naplex.bankItems !== 9153) {
    problems.push(`NAPLEX stamp ${published.boards.naplex.bankItems} live eligible ${naplex[0]?.n}`);
  }
  if (problems.length > 0) {
    console.log(`Stopped: ${problems.join("; ")}`);
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No file or row written.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`CREATE TABLE ${BACKUP} (LIKE "QuestionBankItem" INCLUDING ALL)`);
    const inserted = (await tx.$queryRawUnsafe(`
      WITH ins AS (
        INSERT INTO ${BACKUP} (${colSql})
        SELECT ${colSql} FROM "QuestionBankItem" WHERE id IN (${idList})
        RETURNING id
      )
      SELECT COUNT(*)::int AS n FROM ins
    `)) as Array<{ n: number }>;
    if (inserted[0]?.n !== EXPECTED) throw new Error(`backup inserted ${inserted[0]?.n ?? 0}`);
    for (const item of planned) {
      const count = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET explanation = ${item.fix.explanation},
            manual_correction = true,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${item.fix.id}
          AND "correctAnswer" = ${item.row.key}
          AND question = ${item.row.question}
          AND options = ${item.row.options}
          AND explanation = ${item.row.explanation}
      `;
      if (count !== 1) throw new Error(`${item.fix.id} updated ${count} rows`);
    }
  }, { timeout: 60_000 });
  console.log(`Committed ${BACKUP}. explanation-only fixes updated: ${planned.length}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
