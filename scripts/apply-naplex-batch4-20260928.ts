#!/usr/bin/env node
/**
 * NAPLEX clean-up batch 4.
 *
 * Dry run is the default. It writes nothing.
 *
 *   npx tsx scripts/apply-naplex-batch4-20260928.ts
 *   npx tsx scripts/apply-naplex-batch4-20260928.ts --apply
 *
 * --apply copies every touched row into qbi_naplex_batch4_backup_20260928
 * (explicit column list, no SELECT *), then:
 * - sets the new answer key, explanation, and safe options-field copies
 *   on the key fixes
 * - sets the approved explanation on the 30 explanation-only fixes
 * - sets manual_correction on every key fix, explanation-only fix, and batch-4 hide
 *
 * Stems and option text are not changed. Explanation-only rows keep their
 * answer keys. cmr31dgmm is not in this batch. The two ids that are in both
 * the hide list and the key-fix sheet are hidden only.
 *
 * Undo with: npx tsx scripts/restore-naplex-batch4-20260928.ts --apply
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
import {
  answerFromLetters,
  lettersOfAnswer,
  planOptionsUpdate,
} from "./naplex-batch4-plan";

const BACKUP = "qbi_naplex_batch4_backup_20260928";
const DATA = path.join(process.cwd(), "scripts/data/naplex-batch4-20260928");
const prisma = new PrismaClient();

type Fix = {
  id: string;
  category: string;
  isSeed: boolean;
  currentLetters: string;
  currentKeyText: string;
  newLetters: string;
  newKeyText: string;
  explanation: string;
};

type RationaleFix = {
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
  hash: string;
  manual_correction: boolean;
  active: boolean;
  qa_passed: boolean;
  visible: boolean;
  visible_before: boolean;
};

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

function loadJson<T>(name: string): T {
  return JSON.parse(readFileSync(path.join(DATA, name), "utf8")) as T;
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

function eligibilityWithout(ids: readonly string[]): string {
  let sql = studentEligibleAndSql();
  for (const id of ids) {
    const token = `'${id}'`;
    if (sql.includes(`, ${token}`)) sql = sql.replace(`, ${token}`, "");
    else if (sql.includes(`${token}, `)) sql = sql.replace(`${token}, `, "");
    else throw new Error(`${id} is not in the current hide-list SQL`);
  }
  return sql;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const hideIds = loadJson<string[]>("hide-ids.json");
  const fixes = loadJson<Fix[]>("key-fixes.json");
  const rationales = loadJson<RationaleFix[]>("rationale-fixes.json");
  const listedFile = loadJson<Array<{ id: string; reasons: string[] }>>("option-copies-left.json");
  const rationaleLeftFile = loadJson<Array<{ id: string; reasons: string[] }>>("rationale-copies-left.json");
  const unhideIds = loadJson<Array<{ id: string }>>("unhide-entries.json").map((row) => row.id);
  for (const id of [...hideIds, ...fixes.map((fix) => fix.id), ...rationales.map((fix) => fix.id), ...unhideIds]) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
  }
  if (hideIds.length !== 1905) throw new Error(`hide list has ${hideIds.length} ids`);
  if (new Set(hideIds).size !== hideIds.length) throw new Error("hide list has duplicates");
  if (fixes.length !== 378) throw new Error(`key fixes has ${fixes.length} rows`);
  if (rationales.length !== 30) throw new Error(`explanation-only fixes has ${rationales.length} rows`);
  if (rationales.some((fix) => fix.fieldsToUpdate.join(",") !== "explanation")) {
    throw new Error("an explanation-only row names another field");
  }
  if (fixes.some((fix) => fix.id === "cmr31dgmm006vjs042cilnn5j")) throw new Error("cmr31dgmm must stay skipped");
  if (fixes.some((fix) => hideIds.includes(fix.id))) throw new Error("a key fix is also in the hide list");
  if (rationales.some((fix) => hideIds.includes(fix.id) || fixes.some((key) => key.id === fix.id))) {
    throw new Error("an explanation-only fix overlaps a hide or key fix");
  }

  const published = publishedSiteQuestionCounts();
  const columns = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  if (!names.includes("manual_correction")) throw new Error("manual_correction column is missing");
  const colSql = names.map(quoteIdent).join(", ");
  const touched = [...hideIds, ...fixes.map((fix) => fix.id), ...rationales.map((fix) => fix.id)];
  if (new Set(touched).size !== touched.length) throw new Error("touched ids overlap");
  const idList = touched.map((id) => `'${id}'`).join(", ");
  const unhideList = unhideIds.map((id) => `'${id}'`).join(", ");
  const beforeSql = eligibilityWithout(hideIds);

  const live = (await prisma.$queryRawUnsafe(`
    SELECT
      id, source, "fieldId" AS field_id, "subjectId" AS subject_id, scenario,
      question, "correctAnswer" AS key, explanation, options, "contentHash" AS hash,
      manual_correction, active, "qaPassed" AS qa_passed,
      (
        active = true AND "qaPassed" = true AND "fieldId" = 'pharmacy'
        ${studentEligibleAndSql()}
      ) AS visible,
      (
        active = true AND "qaPassed" = true AND "fieldId" = 'pharmacy'
        ${beforeSql}
      ) AS visible_before
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
      OR id IN (${unhideList})
  `)) as LiveRow[];
  const byId = new Map(live.map((row) => [row.id, row]));
  const naplex = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true AND "fieldId" = 'pharmacy'
    ${studentEligibleAndSql()}
  `)) as Array<{ n: number }>;

  const seedHashes = new Set(
    collectSeedQuestionRows().map((row) => bankItemContentHash(row.fieldId, row.subjectId, row.item))
  );
  const seedFile = readFileSync(
    path.join(process.cwd(), "src/lib/edtech/seeds/naplex-physician-educator-batch-01.ts"),
    "utf8"
  );

  const mismatches: Array<{ id: string; reason: string }> = [];
  const planned: Array<{ fix: Fix; row: LiveRow; nextKey: string; options: string; listed: string[] }> = [];
  let distractorsRewritten = 0;
  let distractorsRemoved = 0;
  let clinicalRewritten = 0;
  let takeawayRewritten = 0;
  const listed: Array<{ id: string; reasons: string[] }> = [];

  for (const fix of fixes) {
    const row = byId.get(fix.id);
    if (!row) {
      mismatches.push({ id: fix.id, reason: "missing" });
      continue;
    }
    let options: string[];
    try {
      options = (JSON.parse(row.options) as { options: string[] }).options;
    } catch {
      mismatches.push({ id: fix.id, reason: "options-unparseable" });
      continue;
    }
    const letters = lettersOfAnswer(options, row.key);
    if (letters !== fix.currentLetters || row.field_id !== "pharmacy") {
      mismatches.push({ id: fix.id, reason: `live ${letters ?? "unmap"} sheet ${fix.currentLetters}` });
      continue;
    }
    const nextKey = answerFromLetters(options, fix.newLetters);
    const nextParts = nextKey.split("|||");
    const sheetPieces = fix.newKeyText.split(", ").map((piece) => piece.trim()).filter(Boolean);
    const sheetMatches = nextParts.every(
      (part) =>
        fix.newKeyText.includes(part) ||
        sheetPieces.some((piece) => part.startsWith(piece) && piece.length >= 24)
    );
    if (!sheetMatches) {
      mismatches.push({ id: fix.id, reason: "new key text does not contain the option" });
      continue;
    }
    const plan = planOptionsUpdate({
      optionsJson: row.options,
      oldLetters: fix.currentLetters,
      newLetters: fix.newLetters,
      explanation: fix.explanation,
    });
    if (plan.listed.length > 0) listed.push({ id: fix.id, reasons: plan.listed });
    distractorsRewritten += plan.distractorsRewritten;
    distractorsRemoved += plan.distractorsRemoved;
    if (plan.clinicalRewritten) clinicalRewritten += 1;
    if (plan.takeawayRewritten) takeawayRewritten += 1;
    const seed = seedHashes.has(row.hash) || row.source === "seed";
    if (seed !== fix.isSeed) mismatches.push({ id: fix.id, reason: seed ? "unmarked-seed" : "marked-seed-but-not" });
    if (fix.isSeed && !seedFile.includes(fix.explanation.slice(0, 80))) {
      mismatches.push({ id: fix.id, reason: "seed file is missing the corrected rationale" });
    }
    planned.push({ fix, row, nextKey, options: plan.options, listed: plan.listed });
  }

  const rationaleList = rationales.map((fix) => `'${fix.id}'`).join(", ");
  const rationaleMeta = (await prisma.$queryRawUnsafe(`
    SELECT id, "generationMeta" AS meta
    FROM "QuestionBankItem"
    WHERE id IN (${rationaleList})
  `)) as Array<{ id: string; meta: unknown }>;
  const metaById = new Map(rationaleMeta.map((row) => [row.id, row.meta]));
  const rationaleMismatches: Array<{ id: string; reason: string }> = [];
  const rationalePlanned: Array<{ fix: RationaleFix; row: LiveRow }> = [];
  const rationaleListed: Array<{ id: string; reasons: string[] }> = [];
  for (const fix of rationales) {
    const row = byId.get(fix.id);
    if (!row) {
      rationaleMismatches.push({ id: fix.id, reason: "missing" });
      continue;
    }
    if (row.key !== fix.currentKey || row.field_id !== "pharmacy") {
      rationaleMismatches.push({ id: fix.id, reason: "live key does not match the sheet" });
      continue;
    }
    if (!fix.explanation.trim() || row.explanation === fix.explanation) {
      rationaleMismatches.push({ id: fix.id, reason: "explanation is empty or already live" });
      continue;
    }
    const seed = seedHashes.has(row.hash) || row.source === "seed";
    if (seed) {
      rationaleMismatches.push({ id: fix.id, reason: "seed row" });
      continue;
    }
    let reasons: string[] = [];
    try {
      reasons = rationaleCopyReasons(row.options, metaById.get(fix.id));
    } catch {
      rationaleMismatches.push({ id: fix.id, reason: "options-unparseable" });
      continue;
    }
    if (reasons.length > 0) rationaleListed.push({ id: fix.id, reasons });
    rationalePlanned.push({ fix, row });
  }

  const hideFound = hideIds.filter((id) => byId.has(id));
  const hideVisibleBefore = hideIds.filter((id) => byId.get(id)?.visible_before);
  const hideVisible = hideIds.filter((id) => byId.get(id)?.visible);
  const unhideVisible = unhideIds.filter((id) => byId.get(id)?.visible);
  const backupExists = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  const listedIds = listed.map((row) => `${row.id}:${row.reasons.join("|")}`).sort();
  const fileIds = listedFile.map((row) => `${row.id}:${row.reasons.join("|")}`).sort();
  const listedSame = JSON.stringify(listedIds) === JSON.stringify(fileIds);
  const rationaleListedIds = rationaleListed.map((row) => `${row.id}:${row.reasons.join("|")}`).sort();
  const rationaleFileIds = rationaleLeftFile.map((row) => `${row.id}:${row.reasons.join("|")}`).sort();
  const rationaleListedSame = JSON.stringify(rationaleListedIds) === JSON.stringify(rationaleFileIds);

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup table: ${backupExists[0]?.reg ?? "absent"}`);
  console.log(`columns snapshotted: ${names.length}`);
  console.log(`hide ids: ${hideIds.length}`);
  console.log(`hide rows found: ${hideFound.length}`);
  console.log(`hide rows visible before this list: ${hideVisibleBefore.length}`);
  console.log(`hide rows already hidden before this list: ${hideFound.length - hideVisibleBefore.length}`);
  console.log(`hide rows still visible with this list: ${hideVisible.length}`);
  console.log(`key-fix sheet rows applied: ${planned.length}`);
  console.log(`key mismatches: ${mismatches.length}${mismatches.length ? ` ${mismatches.map((row) => `${row.id} (${row.reason})`).join(", ")}` : ""}`);
  console.log(`seed rows in the applied fixes: ${planned.filter((row) => row.fix.isSeed).length}`);
  console.log(`unhide ids: ${unhideIds.length}`);
  console.log(`unhides that pass eligibility: ${unhideVisible.length}`);
  console.log(`option copies: distractors rewritten ${distractorsRewritten}, removed ${distractorsRemoved}, clinical ${clinicalRewritten}, takeaway ${takeawayRewritten}`);
  console.log(`option copies left: ${listed.length}`);
  console.log(`option-copies-left.json matches this run: ${listedSame}`);
  console.log(`explanation-only fixes: ${rationalePlanned.length}${rationaleMismatches.length ? ` mismatches ${rationaleMismatches.map((row) => `${row.id} (${row.reason})`).join(", ")}` : ""}`);
  console.log(`explanation-only copies left: ${rationaleListed.length}`);
  console.log(`expected NAPLEX: ${naplex[0]?.n}`);
  console.log(`expected six-board total: ${published.totalQuestions}`);
  console.log(`published NAPLEX stamp: ${published.boards.naplex.bankItems}`);
  console.log("Stems and option text are not changed.");

  const problems: string[] = [];
  if (backupExists[0]?.reg) problems.push(`${BACKUP} already exists`);
  if (hideFound.length !== 1905 || hideVisibleBefore.length !== 1905 || hideVisible.length !== 0) {
    problems.push("hide rows are not all present, visible before this list, and hidden by it");
  }
  if (unhideVisible.length !== unhideIds.length) problems.push("an unhide does not pass eligibility");
  if (mismatches.length !== 0 || planned.length !== 378) problems.push("key fixes are not all applicable");
  if (naplex[0]?.n !== 7300 || published.boards.naplex.bankItems !== 7300 || published.totalQuestions !== 43354) {
    problems.push(`count stamp ${published.boards.naplex.bankItems}/${published.totalQuestions} live eligible ${naplex[0]?.n}`);
  }
  if (!listedSame) problems.push("option-copies-left.json is stale");
  if (rationaleMismatches.length !== 0 || rationalePlanned.length !== 30) {
    problems.push("explanation-only fixes are not all applicable");
  }
  if (!rationaleListedSame) problems.push("rationale-copies-left.json is stale");
  if (problems.length > 0) {
    console.log(`Stopped: ${problems.join("; ")}`);
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No file or row written.");
    return;
  }

  const fixById = new Map(planned.map((row) => [row.fix.id, row]));
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
    if (inserted[0]?.n !== touched.length) throw new Error(`backup inserted ${inserted[0]?.n ?? 0}`);

    for (const item of planned) {
      const count = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET "correctAnswer" = ${item.nextKey},
            explanation = ${item.fix.explanation},
            options = ${item.options},
            manual_correction = true,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${item.fix.id}
          AND "correctAnswer" = ${item.row.key}
          AND question = ${item.row.question}
          AND options = ${item.row.options}
      `;
      if (count !== 1) throw new Error(`${item.fix.id} updated ${count} rows`);
    }
    for (const item of rationalePlanned) {
      const count = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET explanation = ${item.fix.explanation},
            manual_correction = true,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${item.fix.id}
          AND "correctAnswer" = ${item.row.key}
          AND question = ${item.row.question}
          AND options = ${item.row.options}
      `;
      if (count !== 1) throw new Error(`${item.fix.id} updated ${count} rows`);
    }
    const flagged = (await tx.$queryRawUnsafe(`
      WITH upd AS (
        UPDATE "QuestionBankItem"
        SET manual_correction = true
        WHERE id IN (${hideIds.map((id) => `'${id}'`).join(", ")})
          AND manual_correction = false
        RETURNING id
      )
      SELECT COUNT(*)::int AS n FROM upd
    `)) as Array<{ n: number }>;
    console.log(`key fixes updated: ${planned.length}`);
    console.log(`explanation-only fixes updated: ${rationalePlanned.length}`);
    console.log(`hide flags set: ${flagged[0]?.n}`);
    if (flagged[0]?.n !== hideIds.length) throw new Error(`hide flags set ${flagged[0]?.n}`);
    if (fixById.size !== planned.length) throw new Error("plan size changed");
  }, { timeout: 180_000 });
  console.log(`Committed ${BACKUP}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
