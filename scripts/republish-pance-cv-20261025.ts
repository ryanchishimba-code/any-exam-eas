#!/usr/bin/env node
/**
 * Republish 27 hidden PANCE cardiovascular items with owner-approved rewrites.
 *
 * Rows must currently be hidden (active = false, manual_correction = true,
 * qaPassed = true) with keys matching oldCorrectAnswer in rewrites.json.
 * Option order and envelope metadata come from the rewrite file as-is; keys
 * must match newKeyLetter.
 *
 *   npx tsx scripts/republish-pance-cv-20261025.ts
 *   npx tsx scripts/republish-pance-cv-20261025.ts --apply
 *   npx tsx scripts/republish-pance-cv-20261025.ts --verify
 *
 * Undo pre-image: scripts/data/pance-cv-republish-20261025/undo.json
 * Restore: npx tsx scripts/restore-pance-cv-republish-20261025.ts --apply
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const EXPECTED = 27;
const MAX_EXPLANATION = 1000;
const LETTERS = "ABCDE";
const DATA_DIR = path.join(process.cwd(), "scripts/data/pance-cv-republish-20261025");
const REWRITES_PATH = path.join(DATA_DIR, "rewrites.json");
const FLAG_IDS_PATH = path.join(DATA_DIR, "flag-hide-ids.json");
const UNDO_PATH = path.join(DATA_DIR, "undo.json");

const BOARD_FIELDS = [
  "nursing",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pharmacy",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

const EXPECTED_PANCE_BEFORE = 3755;
const EXPECTED_PANCE_AFTER = 3782;

type RewriteFile = {
  items: RewriteItem[];
};

type RewriteItem = {
  id: string;
  fieldId: string;
  oldCorrectAnswer: string;
  newKeyLetter: string;
  guideline: string;
  guidelineUrl: string;
  explanationChars?: number;
  changes: {
    scenario: string;
    question: string;
    options: string;
    correctAnswer: string;
    explanation: string;
  };
};

type Column = { column_name: string; udt_name: string };
type Sql = PrismaClient | Prisma.TransactionClient;

type Plan = {
  id: string;
  fieldId: string;
  subjectId: string;
  oldScenario: string | null;
  oldQuestion: string;
  oldCorrectAnswer: string;
  oldContentHash: string;
  scenario: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  optionsJson: string;
  optionTexts: string[];
  keyLetter: string;
  contentHash: string;
  referencesJson: string;
  guidelineUrl: string;
};

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

function jsonValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return value.toString();
  return value ?? null;
}

function asInt(value: unknown): number {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number" && Number.isInteger(value)) return value;
  throw new Error(`unexpected count value ${String(value)}`);
}

function loadFlagIds(): string[] {
  const parsed = JSON.parse(readFileSync(FLAG_IDS_PATH, "utf8")) as { ids?: string[] };
  if (!Array.isArray(parsed.ids) || parsed.ids.length !== EXPECTED) {
    throw new Error(`flag-hide-ids.json has ${parsed.ids?.length ?? 0} ids, expected ${EXPECTED}`);
  }
  for (const id of parsed.ids) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected flag id: ${id}`);
  }
  return parsed.ids;
}

const FLAG_IDS = loadFlagIds();

function loadRewrites(): RewriteItem[] {
  const parsed = JSON.parse(readFileSync(REWRITES_PATH, "utf8")) as RewriteFile;
  if (!Array.isArray(parsed.items) || parsed.items.length !== EXPECTED) {
    throw new Error(`rewrites file has ${parsed.items?.length ?? 0} items, expected ${EXPECTED}`);
  }
  const ids = new Set<string>();
  const byId = new Map<string, RewriteItem>();
  for (const item of parsed.items) {
    if (!item?.id || !/^[a-z0-9]+$/.test(item.id)) throw new Error(`unexpected rewrite id: ${String(item.id)}`);
    if (ids.has(item.id)) throw new Error(`duplicate rewrite id: ${item.id}`);
    ids.add(item.id);
    byId.set(item.id, item);
    if (item.fieldId !== "pance") throw new Error(`${item.id} fieldId is ${item.fieldId}, expected pance`);
    if (!item.oldCorrectAnswer?.trim()) throw new Error(`${item.id} is missing oldCorrectAnswer`);
    if (!/^[A-E]$/.test(item.newKeyLetter)) throw new Error(`${item.id} newKeyLetter is ${item.newKeyLetter}`);
    const { changes } = item;
    if (!changes?.scenario?.trim() || !changes.question?.trim() || !changes.correctAnswer?.trim()) {
      throw new Error(`${item.id} is missing stem fields in changes`);
    }
    if (!changes.explanation?.trim()) throw new Error(`${item.id} is missing explanation`);
    if (changes.explanation.length > MAX_EXPLANATION) {
      throw new Error(`${item.id} explanation is ${changes.explanation.length} characters`);
    }
    if (item.explanationChars != null && item.explanationChars !== changes.explanation.length) {
      throw new Error(`${item.id} explanationChars ${item.explanationChars} does not match text length`);
    }
    if (!/^https:\/\//.test(item.guidelineUrl)) throw new Error(`${item.id} guideline URL is missing`);
    if (!item.guideline?.trim()) throw new Error(`${item.id} is missing guideline label`);
    parseOptionsEnvelope(changes.options, item.id);
  }
  const flagSet = new Set(FLAG_IDS);
  for (const id of FLAG_IDS) {
    if (!byId.has(id)) throw new Error(`rewrites.json is missing flag hide id ${id}`);
  }
  for (const id of ids) {
    if (!flagSet.has(id)) throw new Error(`${id} is in rewrites but not in flag-hide-ids.json`);
  }
  return FLAG_IDS.map((id) => byId.get(id)!);
}

function parseOptionsEnvelope(raw: string, id: string): string[] {
  let parsed: { options?: unknown };
  try {
    parsed = JSON.parse(raw) as { options?: unknown };
  } catch {
    throw new Error(`${id} options is not valid JSON`);
  }
  if (!Array.isArray(parsed.options) || parsed.options.some((option) => typeof option !== "string")) {
    throw new Error(`${id} options JSON is missing a string options array`);
  }
  const texts = parsed.options as string[];
  if (new Set(texts).size !== texts.length) throw new Error(`${id} has duplicate options`);
  if (texts.length < 4 || texts.length > 5) throw new Error(`${id} has ${texts.length} options`);
  return texts;
}

function buildPlans(items: RewriteItem[], liveById: Map<string, Record<string, unknown>>): Plan[] {
  return items.map((item) => {
    const live = liveById.get(item.id);
    if (!live) throw new Error(`missing live row ${item.id}`);
    const fieldId = String(live.fieldId);
    const subjectId = String(live.subjectId);
    if (fieldId !== "pance") throw new Error(`${item.id} is on ${fieldId}`);
    const optionTexts = parseOptionsEnvelope(item.changes.options, item.id);
    const { correctAnswer } = item.changes;
    const index = optionTexts.indexOf(correctAnswer);
    if (index < 0) throw new Error(`${item.id} correctAnswer is not in the options array`);
    const keyLetter = LETTERS[index]!;
    if (keyLetter !== item.newKeyLetter) {
      throw new Error(`${item.id} key letter is ${keyLetter}, file says ${item.newKeyLetter}`);
    }
    const references = [{ label: item.guideline, url: item.guidelineUrl }];
    return {
      id: item.id,
      fieldId,
      subjectId,
      oldScenario: live.scenario == null ? null : String(live.scenario),
      oldQuestion: String(live.question),
      oldCorrectAnswer: item.oldCorrectAnswer,
      oldContentHash: String(live.contentHash),
      scenario: item.changes.scenario,
      question: item.changes.question,
      correctAnswer,
      explanation: item.changes.explanation,
      optionsJson: item.changes.options,
      optionTexts,
      keyLetter,
      contentHash: bankItemContentHash(fieldId, subjectId, {
        question: item.changes.question,
        scenario: item.changes.scenario,
      }),
      referencesJson: JSON.stringify(references),
      guidelineUrl: item.guidelineUrl,
    };
  });
}

async function columns(): Promise<Column[]> {
  const found = (await prisma.$queryRawUnsafe(`
    SELECT column_name, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Column[];
  for (const name of ["id", "active", "qaPassed", "manual_correction", "correctAnswer", "contentHash", "options", "references"]) {
    if (!found.some((column) => column.column_name === name)) throw new Error(`QuestionBankItem is missing ${name}`);
  }
  return found;
}

function selectList(cols: Column[]): string {
  return cols
    .map((column) =>
      column.udt_name === "vector"
        ? `${quoteIdent(column.column_name)}::text AS ${quoteIdent(column.column_name)}`
        : quoteIdent(column.column_name)
    )
    .join(", ");
}

async function loadRows(client: Sql, cols: Column[], ids: readonly string[]): Promise<Array<Record<string, unknown>>> {
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const rows = (await client.$queryRawUnsafe(
    `SELECT ${selectList(cols)} FROM "QuestionBankItem" WHERE id IN (${idList})`
  )) as Array<Record<string, unknown>>;
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  return ids.map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`missing row ${id}`);
    return Object.fromEntries(cols.map((column) => [column.column_name, jsonValue(row[column.column_name])]));
  });
}

async function boardCounts(client: Sql): Promise<Record<string, number>> {
  const list = BOARD_FIELDS.map((field) => `'${field}'`).join(", ");
  const rows = (await client.$queryRawUnsafe(`
    SELECT "fieldId" AS field_id, COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" IN (${list})
      AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
      ${studentEligibleAndSql()}
    GROUP BY "fieldId"
  `)) as Array<{ field_id: string; n: unknown }>;
  const counts: Record<string, number> = {};
  for (const field of BOARD_FIELDS) counts[field] = 0;
  for (const row of rows) counts[row.field_id] = asInt(row.n);
  return counts;
}

async function eligibleIds(client: Sql, ids: readonly string[]): Promise<Set<string>> {
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const rows = (await client.$queryRawUnsafe(`
    SELECT id
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
      AND active = true
      AND "qaPassed" = true
      ${studentEligibleAndSql()}
  `)) as Array<{ id: string }>;
  return new Set(rows.map((row) => row.id));
}

function printCounts(label: string, counts: Record<string, number>): void {
  console.log(`${label}: ${BOARD_FIELDS.map((field) => `${field} ${counts[field]}`).join(", ")}`);
}

function assertPanceCount(counts: Record<string, number>, expected: number, label: string): void {
  if (counts.pance !== expected) {
    throw new Error(`${label} pance is ${counts.pance}, expected ${expected}`);
  }
}

function assertOtherBoardsUnchanged(
  before: Record<string, number>,
  after: Record<string, number>,
  label: string
): void {
  for (const field of BOARD_FIELDS) {
    if (field === "pance") continue;
    if (before[field] !== after[field]) {
      throw new Error(`${label} ${field} moved ${before[field]} -> ${after[field]}`);
    }
  }
}

async function assertNoHashCollision(plans: Plan[]): Promise<void> {
  const hashes = new Set(plans.map((plan) => plan.contentHash));
  if (hashes.size !== plans.length) throw new Error("two rewrites share a content hash");
  for (const plan of plans) {
    const clash = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "QuestionBankItem"
      WHERE "contentHash" = ${plan.contentHash} AND id <> ${plan.id}
    `;
    if (clash.length > 0) throw new Error(`${plan.id} new content hash collides with ${clash[0]?.id}`);
  }
}

function storedOptions(raw: unknown): string[] {
  return parseOptionsEnvelope(String(raw), "row");
}

function referenceBlob(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value ?? null);
}

function writeUndo(payload: unknown): string {
  if (existsSync(UNDO_PATH)) throw new Error(`${UNDO_PATH} already exists`);
  mkdirSync(DATA_DIR, { recursive: true });
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(UNDO_PATH, body, { flag: "wx" });
  return createHash("sha256").update(body).digest("hex");
}

function readUndo(): { ids: string[]; rows: Array<Record<string, unknown>> } {
  return JSON.parse(readFileSync(UNDO_PATH, "utf8")) as {
    ids: string[];
    rows: Array<Record<string, unknown>>;
  };
}

function assertHiddenRow(row: Record<string, unknown>): void {
  const id = String(row.id);
  if (row.active !== false) throw new Error(`${id} is not hidden`);
  if (row.manual_correction !== true) throw new Error(`${id} is not locked`);
  if (row.qaPassed !== true) throw new Error(`${id} is not qaPassed`);
  if (row.fieldId !== "pance") throw new Error(`${id} is not pance`);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const verify = process.argv.includes("--verify");
  if (apply && verify) throw new Error("pass only one of --apply or --verify");

  const items = loadRewrites();
  const publishIds = items.map((item) => item.id);
  const cols = await columns();
  const live = await loadRows(prisma, cols, publishIds);
  const liveById = new Map(live.map((row) => [String(row.id), row]));

  const plans = buildPlans(items, liveById);

  if (verify) {
    const eligible = await eligibleIds(prisma, publishIds);
    const counts = await boardCounts(prisma);
    for (const plan of plans) {
      const row = liveById.get(plan.id)!;
      if (row.active !== true || row.qaPassed !== true) {
        throw new Error(`${plan.id} is not active and qaPassed`);
      }
      if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text does not match rewrite`);
      if (row.explanation !== plan.explanation) throw new Error(`${plan.id} explanation does not match`);
      if (storedOptions(row.options).join("\n") !== plan.optionTexts.join("\n")) {
        throw new Error(`${plan.id} stored options do not match rewrite`);
      }
      const index = plan.optionTexts.indexOf(plan.correctAnswer);
      const letter = LETTERS[index]!;
      if (letter !== plan.keyLetter) throw new Error(`${plan.id} key letter mismatch`);
      if (row.contentHash !== plan.contentHash) throw new Error(`${plan.id} content hash does not match`);
      const refs = referenceBlob(row.references);
      if (!refs.includes(plan.guidelineUrl)) throw new Error(`${plan.id} is missing guideline URL in references`);
      if (!eligible.has(plan.id)) throw new Error(`${plan.id} is not student-eligible`);
    }
    assertPanceCount(counts, EXPECTED_PANCE_AFTER, "verified");
    console.log("VERIFY");
    console.log(`rows matched: ${plans.length}`);
    console.log(`student-eligible: ${eligible.size}`);
    for (const plan of plans) console.log(`pance ${plan.id} ${plan.keyLetter}`);
    printCounts("after", counts);
    return;
  }

  for (const item of items) {
    const row = liveById.get(item.id);
    if (!row) throw new Error(`missing row ${item.id}`);
    if (String(row.correctAnswer) !== item.oldCorrectAnswer) {
      throw new Error(`${item.id} live key is "${String(row.correctAnswer)}", expected "${item.oldCorrectAnswer}"`);
    }
  }

  for (const row of live) assertHiddenRow(row);
  await assertNoHashCollision(plans);
  const beforeCounts = await boardCounts(prisma);
  assertPanceCount(beforeCounts, EXPECTED_PANCE_BEFORE, "before");
  const beforeEligible = await eligibleIds(prisma, publishIds);
  if (beforeEligible.size !== 0) throw new Error(`${beforeEligible.size} items are already student-eligible`);

  let digest = "";
  if (!existsSync(UNDO_PATH)) {
    digest = writeUndo({
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Pre-image before 27 approved PANCE cardiovascular rewrites were republished.",
      ids: [...publishIds],
      columnTypes: Object.fromEntries(cols.map((column) => [column.column_name, column.udt_name])),
      studentEligibleBefore: beforeCounts,
      rows: live,
    });
  } else {
    const undo = readUndo();
    if (undo.ids.join(",") !== publishIds.join(",")) throw new Error("undo file ids do not match the republish set");
    const undoById = new Map(undo.rows.map((row) => [String(row.id), row]));
    for (const row of live) {
      const snapshot = undoById.get(String(row.id));
      if (!snapshot) throw new Error(`undo file is missing ${String(row.id)}`);
      if (
        snapshot.correctAnswer !== row.correctAnswer ||
        snapshot.scenario !== row.scenario ||
        snapshot.question !== row.question ||
        snapshot.options !== row.options ||
        snapshot.explanation !== row.explanation ||
        snapshot.contentHash !== row.contentHash ||
        snapshot.active !== false ||
        snapshot.manual_correction !== true
      ) {
        throw new Error(`${String(row.id)} no longer matches the republish undo snapshot`);
      }
    }
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`rows matched: ${live.length}`);
  for (const plan of plans) {
    console.log(
      `pance ${plan.id} ${plan.keyLetter} options=${plan.optionTexts.length} explanation=${plan.explanation.length}`
    );
  }
  printCounts("before", beforeCounts);
  if (digest) console.log(`undo sha256: ${digest}`);

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
        await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
        const txBefore = await boardCounts(tx);
        assertPanceCount(txBefore, EXPECTED_PANCE_BEFORE, "transaction before");
        for (const plan of plans) {
          const updated = await tx.$executeRaw`
            UPDATE "QuestionBankItem"
            SET scenario = ${plan.scenario},
                question = ${plan.question},
                options = ${plan.optionsJson},
                "correctAnswer" = ${plan.correctAnswer},
                explanation = ${plan.explanation},
                "references" = ${plan.referencesJson}::jsonb,
                "contentHash" = ${plan.contentHash},
                active = true,
                "qaPassed" = true,
                manual_correction = true,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = ${plan.id}
              AND "correctAnswer" = ${plan.oldCorrectAnswer}
              AND "contentHash" = ${plan.oldContentHash}
              AND question = ${plan.oldQuestion}
              AND scenario IS NOT DISTINCT FROM ${plan.oldScenario}
              AND active = false
              AND manual_correction = true
              AND "qaPassed" = true
              AND "fieldId" = 'pance'
          `;
          if (updated !== 1) throw new Error(`update touched ${updated} rows for ${plan.id}`);
        }
        const afterRows = await loadRows(tx, cols, publishIds);
        const afterById = new Map(afterRows.map((row) => [String(row.id), row]));
        for (const plan of plans) {
          const row = afterById.get(plan.id);
          if (!row) throw new Error(`missing updated row ${plan.id}`);
          if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text changed`);
          if (row.active !== true || row.qaPassed !== true || row.manual_correction !== true) {
            throw new Error(`${plan.id} flags were not set`);
          }
          if (storedOptions(row.options).join("\n") !== plan.optionTexts.join("\n")) {
            throw new Error(`${plan.id} options were not stored`);
          }
          if (row.contentHash !== plan.contentHash) throw new Error(`${plan.id} content hash was not refreshed`);
          const refs = referenceBlob(row.references);
          if (!refs.includes(plan.guidelineUrl)) throw new Error(`${plan.id} references were not replaced`);
        }
        const eligible = await eligibleIds(tx, publishIds);
        if (eligible.size !== EXPECTED) {
          const missing = publishIds.filter((id) => !eligible.has(id));
          throw new Error(`not student-eligible after republish: ${missing.join(", ")}`);
        }
        const txAfter = await boardCounts(tx);
        assertPanceCount(txAfter, EXPECTED_PANCE_AFTER, "transaction after");
        assertOtherBoardsUnchanged(txBefore, txAfter, "transaction after");
        console.log(`updated rows: ${EXPECTED}`);
        printCounts("after", txAfter);
        if (!apply) throw new DryRunRollback();
      },
      { timeout: 300_000 }
    );
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const after = await loadRows(prisma, cols, publishIds);
      for (const row of after) {
        const before = liveById.get(String(row.id));
        if (!before || before.correctAnswer !== row.correctAnswer || before.active !== row.active) {
          throw new Error("dry run changed a row");
        }
      }
      const counts = await boardCounts(prisma);
      assertPanceCount(counts, EXPECTED_PANCE_BEFORE, "after rollback");
      console.log("Rolled back. Rows are still hidden.");
      return;
    }
    throw error;
  }

  const eligible = await eligibleIds(prisma, publishIds);
  if (eligible.size !== EXPECTED) throw new Error("committed rows are not all student-eligible");
  const afterCounts = await boardCounts(prisma);
  assertPanceCount(afterCounts, EXPECTED_PANCE_AFTER, "committed");
  console.log("Committed.");
  printCounts("verified after", afterCounts);
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://[redacted]"));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
