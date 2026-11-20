#!/usr/bin/env node
/**
 * Put the eight blind-review items back in the student pool with the approved
 * rewrites.
 *
 * Option order is shuffled per item with a fixed seed so the correct choices
 * are not bunched on A. Option text is not edited. correctAnswer stays the
 * approved answer text. Explicit option-letter mentions in the explanation,
 * distractor rationales, clinical reasoning, and key takeaway are remapped.
 * "type B" and similar words are left alone.
 *
 * Dry run is the default. The update runs inside a transaction and rolls back.
 * --apply sets the rewritten text, active = true, qaPassed = true, and leaves
 * manual_correction = true. contentHash is refreshed to the new scenario and
 * question. A full pre-image is written to undo-rewrite.json before any commit.
 *
 *   npx tsx scripts/apply-blind-review-rewrites-20261025.ts
 *   npx tsx scripts/apply-blind-review-rewrites-20261025.ts --apply
 *   npx tsx scripts/apply-blind-review-rewrites-20261025.ts --verify
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import { bankItemContentHash } from "../src/lib/sync-question-bank-guard";

const EXPECTED = 8;
const MAX_EXPLANATION = 1000;
const MAX_KEYS_ON_A = 2;
const DATA_DIR = path.join(process.cwd(), "scripts/data/blind-review-wrong-key-20261025");
const REWRITES_PATH = path.join(DATA_DIR, "rewrites.json");
const UNDO_PATH = path.join(DATA_DIR, "undo-rewrite.json");
const LETTERS = "ABCDE";

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

const EXPECTED_BEFORE = { pance: 3790, "aanp-fnp": 5325 } as const;
const EXPECTED_AFTER = { pance: 3795, "aanp-fnp": 5328 } as const;

type RewriteFile = {
  items: Array<{
    id: string;
    fieldId: "pance" | "aanp-fnp";
    oldCorrectAnswer: string;
    changes: {
      scenario: string;
      question: string;
      options: string;
      correctAnswer: string;
      explanation: string;
    };
  }>;
};

type Column = { column_name: string; udt_name: string };
type Sql = PrismaClient | Prisma.TransactionClient;

type Plan = {
  id: string;
  fieldId: "pance" | "aanp-fnp";
  subjectId: string;
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
  letterReplacements: number;
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

function fnv(id: string): number {
  let hash = 2166136261;
  for (const char of id) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates. The returned list is a permutation; no string is edited. */
function shuffleOptions(options: readonly string[], id: string): string[] {
  const rng = mulberry32(fnv(id));
  const next = options.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const swap = next[i]!;
    next[i] = next[j]!;
    next[j] = swap;
  }
  return next;
}

function rotateLeft(options: readonly string[], by: number): string[] {
  const count = options.length;
  const shift = ((by % count) + count) % count;
  return options.slice(shift).concat(options.slice(0, shift));
}

function sameMembers(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const counts = new Map<string, number>();
  for (const item of left) counts.set(item, (counts.get(item) ?? 0) + 1);
  for (const item of right) {
    const remaining = counts.get(item);
    if (!remaining) return false;
    counts.set(item, remaining - 1);
  }
  return true;
}

/**
 * Remap explicit option letters ("option A", "choice B") from the pre-shuffle
 * order to the shuffled order. Ordinary prose, including "type B" and
 * "Category E", is not a letter reference.
 */
function remapOptionLetters(text: string, fromTo: ReadonlyMap<string, string>): { text: string; count: number } {
  const pattern = /\b(option|choice|answer|key)\s+([A-E])\b/gi;
  let count = 0;
  const next = text.replace(pattern, (full, label: string, letter: string) => {
    const mapped = fromTo.get(letter.toUpperCase());
    if (!mapped || mapped === letter.toUpperCase()) return full;
    count += 1;
    const replacement = letter === letter.toLowerCase() ? mapped.toLowerCase() : mapped;
    return `${label} ${replacement}`;
  });
  return { text: next, count };
}

function assertRemapIsNarrow(): void {
  const sample = "tympanometry is flat (type B). Category E (high risk). A 58-year-old.";
  const mapped = remapOptionLetters(sample, new Map([["A", "B"], ["B", "C"], ["E", "A"]]));
  if (mapped.text !== sample || mapped.count !== 0) throw new Error("letter remap would edit ordinary prose");
  const hit = remapOptionLetters("Choose option A, not choice B.", new Map([["A", "C"], ["B", "D"]]));
  if (hit.text !== "Choose option C, not choice D." || hit.count !== 2) {
    throw new Error("letter remap missed an explicit option letter");
  }
}

function letterMap(before: readonly string[], after: readonly string[]): Map<string, string> {
  const map = new Map<string, string>();
  before.forEach((option, index) => {
    const nextIndex = after.indexOf(option);
    if (nextIndex < 0) throw new Error("shuffled options lost a choice");
    map.set(LETTERS[index]!, LETTERS[nextIndex]!);
  });
  return map;
}

function remapTree(value: unknown, fromTo: ReadonlyMap<string, string>, count: { n: number }): unknown {
  if (typeof value === "string") {
    const mapped = remapOptionLetters(value, fromTo);
    count.n += mapped.count;
    return mapped.text;
  }
  if (Array.isArray(value)) return value.map((item) => remapTree(item, fromTo, count));
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (key === "distractorRationale" && entry && typeof entry === "object" && !Array.isArray(entry)) {
      const reasons: Record<string, unknown> = {};
      for (const [option, reason] of Object.entries(entry as Record<string, unknown>)) {
        reasons[option] = remapTree(reason, fromTo, count);
      }
      next[key] = reasons;
      continue;
    }
    if (key === "clinicalReasoning" || key === "keyTakeaway" || key === "keyTakeaways") {
      next[key] = remapTree(entry, fromTo, count);
      continue;
    }
    next[key] = entry;
  }
  return next;
}

function loadRewrites(): RewriteFile["items"] {
  const parsed = JSON.parse(readFileSync(REWRITES_PATH, "utf8")) as RewriteFile;
  if (!Array.isArray(parsed.items) || parsed.items.length !== EXPECTED) {
    throw new Error(`rewrites file has ${parsed.items?.length ?? 0} items, expected ${EXPECTED}`);
  }
  const ids = parsed.items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) throw new Error("rewrite ids are duplicated");
  for (const item of parsed.items) {
    if (!/^[a-z0-9]+$/.test(item.id)) throw new Error(`unexpected id: ${item.id}`);
    if (item.fieldId !== "pance" && item.fieldId !== "aanp-fnp") throw new Error(`${item.id} is not PANCE or FNP`);
  }
  return parsed.items;
}

function spreadKeysOffA(rows: Array<{ id: string; options: string[]; answer: string }>): void {
  let guard = 0;
  const keysOnA = () => rows.filter((row) => row.options.indexOf(row.answer) === 0).length;
  while (keysOnA() > MAX_KEYS_ON_A) {
    const item = rows
      .filter((row) => row.options.indexOf(row.answer) === 0)
      .sort((left, right) => (left.id < right.id ? -1 : 1))[0];
    if (!item) break;
    const rotated = rotateLeft(item.options, 1);
    item.options.splice(0, item.options.length, ...rotated);
    guard += 1;
    if (guard > 20) throw new Error("could not spread correct answers off A");
  }
}

function buildPlans(items: RewriteFile["items"], liveById: Map<string, Record<string, unknown>>): Plan[] {
  const shuffled = items.map((item) => {
    const envelope = JSON.parse(item.changes.options) as Record<string, unknown>;
    const original = envelope.options;
    if (!Array.isArray(original) || original.some((option) => typeof option !== "string")) {
      throw new Error(`${item.id} options are not a string list`);
    }
    const options = original.map(String);
    const expectedCount = item.fieldId === "pance" ? 5 : 4;
    if (options.length !== expectedCount) {
      throw new Error(`${item.id} has ${options.length} options, expected ${expectedCount}`);
    }
    if (new Set(options).size !== options.length) throw new Error(`${item.id} has duplicate options`);
    if (!options.includes(item.changes.correctAnswer)) {
      throw new Error(`${item.id} correct answer is not one of the options`);
    }
    return {
      item,
      envelope,
      original: options,
      options: shuffleOptions(options, item.id),
    };
  });
  spreadKeysOffA(shuffled.map((row) => ({ id: row.item.id, options: row.options, answer: row.item.changes.correctAnswer })));

  return shuffled.map((row) => {
    const { item, envelope, original } = row;
    const options = row.options;
    if (!sameMembers(original, options)) throw new Error(`${item.id} shuffle changed option text`);
    const keyIndex = options.indexOf(item.changes.correctAnswer);
    if (options[keyIndex] !== item.changes.correctAnswer) throw new Error(`${item.id} key text changed`);
    const fromTo = letterMap(original, options);
    const count = { n: 0 };
    const explanation = remapOptionLetters(item.changes.explanation, fromTo);
    count.n += explanation.count;
    const remapped = remapTree(envelope, fromTo, count) as Record<string, unknown>;
    remapped.options = options;
    if (explanation.text.length > MAX_EXPLANATION) {
      throw new Error(`${item.id} explanation is ${explanation.text.length} characters`);
    }
    const live = liveById.get(item.id);
    if (!live) throw new Error(`missing live row ${item.id}`);
    const subjectId = String(live.subjectId);
    const reasons = remapped.distractorRationale;
    if (reasons && typeof reasons === "object" && !Array.isArray(reasons)) {
      for (const key of Object.keys(reasons as Record<string, unknown>)) {
        if (!options.includes(key)) throw new Error(`${item.id} rationale names an option that is not in the list`);
      }
    }
    return {
      id: item.id,
      fieldId: item.fieldId,
      subjectId,
      oldCorrectAnswer: item.oldCorrectAnswer,
      oldContentHash: String(live.contentHash),
      scenario: item.changes.scenario,
      question: item.changes.question,
      correctAnswer: item.changes.correctAnswer,
      explanation: explanation.text,
      optionsJson: JSON.stringify(remapped),
      optionTexts: options,
      keyLetter: LETTERS[keyIndex]!,
      contentHash: bankItemContentHash(item.fieldId, subjectId, {
        question: item.changes.question,
        scenario: item.changes.scenario,
      }),
      letterReplacements: count.n,
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
  for (const name of ["id", "active", "qaPassed", "manual_correction", "correctAnswer", "contentHash", "options"]) {
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

async function loadRows(client: Sql, cols: Column[], ids: string[]): Promise<Array<Record<string, unknown>>> {
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const rows = (await client.$queryRawUnsafe(
    `SELECT ${selectList(cols)} FROM "QuestionBankItem" WHERE id IN (${idList})`
  )) as Array<Record<string, unknown>>;
  return rows.map((row) =>
    Object.fromEntries(cols.map((column) => [column.column_name, jsonValue(row[column.column_name])]))
  );
}

function orderRows(rows: Array<Record<string, unknown>>, ids: string[]): Array<Record<string, unknown>> {
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  return ids.map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`missing row ${id}`);
    return row;
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

async function eligibleIds(client: Sql, ids: string[]): Promise<Set<string>> {
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

function assertCounts(before: Record<string, number>, after: Record<string, number>): void {
  if (before.pance !== EXPECTED_BEFORE.pance || before["aanp-fnp"] !== EXPECTED_BEFORE["aanp-fnp"]) {
    throw new Error(`before counts were pance ${before.pance}, aanp-fnp ${before["aanp-fnp"]}`);
  }
  if (after.pance !== EXPECTED_AFTER.pance || after["aanp-fnp"] !== EXPECTED_AFTER["aanp-fnp"]) {
    throw new Error(`after counts were pance ${after.pance}, aanp-fnp ${after["aanp-fnp"]}`);
  }
  for (const field of BOARD_FIELDS) {
    if (field === "pance" || field === "aanp-fnp") continue;
    if (before[field] !== after[field]) throw new Error(`${field} changed from ${before[field]} to ${after[field]}`);
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

function writeUndo(payload: unknown): string {
  if (existsSync(UNDO_PATH)) throw new Error(`${UNDO_PATH} already exists`);
  mkdirSync(DATA_DIR, { recursive: true });
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(UNDO_PATH, body, { flag: "wx" });
  return createHash("sha256").update(body).digest("hex");
}

function readUndo(): { ids: string[]; rows: Array<Record<string, unknown>> } {
  const parsed = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as {
    ids: string[];
    rows: Array<Record<string, unknown>>;
  };
  return parsed;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const verify = process.argv.includes("--verify");
  assertRemapIsNarrow();
  const items = loadRewrites();
  const ids = items.map((item) => item.id);
  const cols = await columns();
  const live = orderRows(await loadRows(prisma, cols, ids), ids);
  const liveById = new Map(live.map((row) => [String(row.id), row]));

  for (const item of items) {
    const row = liveById.get(item.id);
    if (!row) throw new Error(`missing row ${item.id}`);
    if (row.fieldId !== item.fieldId) throw new Error(`${item.id} is on ${String(row.fieldId)}`);
    const expectedKey = verify ? item.changes.correctAnswer : item.oldCorrectAnswer;
    if (row.correctAnswer !== expectedKey) {
      throw new Error(`${item.id} live key does not match the ${verify ? "rewritten" : "hidden"} answer`);
    }
  }

  const plans = buildPlans(items, liveById);
  const keysOnA = plans.filter((plan) => plan.keyLetter === "A").length;
  if (keysOnA > MAX_KEYS_ON_A) throw new Error(`${keysOnA} keys are still on A`);

  if (verify) {
    const eligible = await eligibleIds(prisma, ids);
    const counts = await boardCounts(prisma);
    for (const plan of plans) {
      const row = liveById.get(plan.id)!;
      if (row.active !== true) throw new Error(`${plan.id} is not active`);
      if (row.manual_correction !== true) throw new Error(`${plan.id} is not locked`);
      if (row.qaPassed !== true) throw new Error(`${plan.id} is not qaPassed`);
      if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text does not match the rewrite`);
      if (row.explanation !== plan.explanation) throw new Error(`${plan.id} explanation does not match the rewrite`);
      if (String(row.explanation).length > MAX_EXPLANATION) throw new Error(`${plan.id} explanation is too long`);
      const stored = JSON.parse(String(row.options)) as { options?: string[] };
      if (!stored.options || stored.options.join("\n") !== plan.optionTexts.join("\n")) {
        throw new Error(`${plan.id} stored options do not match the shuffle`);
      }
      if (stored.options[LETTERS.indexOf(plan.keyLetter)] !== plan.correctAnswer) {
        throw new Error(`${plan.id} key letter does not point at the answer`);
      }
      if (!eligible.has(plan.id)) throw new Error(`${plan.id} is not student-eligible`);
    }
    if (counts.pance !== EXPECTED_AFTER.pance || counts["aanp-fnp"] !== EXPECTED_AFTER["aanp-fnp"]) {
      throw new Error(`verified counts were pance ${counts.pance}, aanp-fnp ${counts["aanp-fnp"]}`);
    }
    console.log("VERIFY");
    console.log(`rows matched: ${plans.length}`);
    console.log(`student-eligible: ${eligible.size}`);
    for (const plan of plans) console.log(`${plan.fieldId} ${plan.id} ${plan.keyLetter}`);
    printCounts("after", counts);
    return;
  }

  for (const row of live) {
    if (row.active !== false) throw new Error(`${String(row.id)} is not hidden`);
    if (row.manual_correction !== true) throw new Error(`${String(row.id)} is not locked`);
    if (row.qaPassed !== true) throw new Error(`${String(row.id)} is not qaPassed`);
  }
  await assertNoHashCollision(plans);

  const beforeCounts = await boardCounts(prisma);
  const beforeEligible = await eligibleIds(prisma, ids);
  if (beforeEligible.size !== 0) throw new Error(`${beforeEligible.size} items are already student-eligible`);
  if (beforeCounts.pance !== EXPECTED_BEFORE.pance || beforeCounts["aanp-fnp"] !== EXPECTED_BEFORE["aanp-fnp"]) {
    throw new Error(`refusing to write: pance ${beforeCounts.pance}, aanp-fnp ${beforeCounts["aanp-fnp"]}`);
  }

  let digest = "";
  if (!existsSync(UNDO_PATH)) {
    digest = writeUndo({
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Pre-image before the blind-review rewrites were published and the eight items reactivated.",
      ids,
      columnTypes: Object.fromEntries(cols.map((column) => [column.column_name, column.udt_name])),
      studentEligibleBefore: beforeCounts,
      rows: live,
    });
  } else {
    const undo = readUndo();
    if (undo.ids.join(",") !== ids.join(",")) throw new Error("undo file ids do not match the rewrites");
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
        throw new Error(`${String(row.id)} no longer matches the rewrite undo snapshot`);
      }
    }
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`rows matched: ${live.length}`);
  console.log(`keys on A: ${keysOnA}`);
  for (const plan of plans) {
    console.log(
      `${plan.fieldId} ${plan.id} ${plan.keyLetter} options=${plan.optionTexts.length} explanation=${plan.explanation.length} letterRefs=${plan.letterReplacements}`
    );
  }
  printCounts("before", beforeCounts);
  if (digest) console.log(`undo sha256: ${digest}`);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
      const txBefore = await boardCounts(tx);
      for (const field of BOARD_FIELDS) {
        if (txBefore[field] !== beforeCounts[field]) throw new Error(`${field} changed before the update`);
      }
      for (const plan of plans) {
        const updated = await tx.$executeRaw`
          UPDATE "QuestionBankItem"
          SET scenario = ${plan.scenario},
              question = ${plan.question},
              options = ${plan.optionsJson},
              "correctAnswer" = ${plan.correctAnswer},
              explanation = ${plan.explanation},
              "contentHash" = ${plan.contentHash},
              active = true,
              "qaPassed" = true,
              manual_correction = true,
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${plan.id}
            AND "correctAnswer" = ${plan.oldCorrectAnswer}
            AND "contentHash" = ${plan.oldContentHash}
            AND active = false
            AND manual_correction = true
            AND "qaPassed" = true
        `;
        if (updated !== 1) throw new Error(`update touched ${updated} rows for ${plan.id}`);
      }
      const afterRows = orderRows(await loadRows(tx, cols, ids), ids);
      const afterById = new Map(afterRows.map((row) => [String(row.id), row]));
      for (const plan of plans) {
        const row = afterById.get(plan.id);
        if (!row) throw new Error(`missing updated row ${plan.id}`);
        if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text changed`);
        if (row.active !== true || row.qaPassed !== true || row.manual_correction !== true) {
          throw new Error(`${plan.id} flags were not set`);
        }
        if (String(row.explanation).length > MAX_EXPLANATION) throw new Error(`${plan.id} explanation is too long`);
        const stored = JSON.parse(String(row.options)) as { options?: string[] };
        if (!stored.options || stored.options.join("\n") !== plan.optionTexts.join("\n")) {
          throw new Error(`${plan.id} options were not stored in shuffled order`);
        }
        if (stored.options[LETTERS.indexOf(plan.keyLetter)] !== plan.correctAnswer) {
          throw new Error(`${plan.id} stored key letter does not match`);
        }
        if (row.contentHash !== plan.contentHash) throw new Error(`${plan.id} content hash was not refreshed`);
      }
      const eligible = await eligibleIds(tx, ids);
      if (eligible.size !== EXPECTED) {
        const missing = ids.filter((id) => !eligible.has(id));
        throw new Error(`not student-eligible after rewrite: ${missing.join(", ")}`);
      }
      const txAfter = await boardCounts(tx);
      assertCounts(txBefore, txAfter);
      console.log(`updated rows: ${EXPECTED}`);
      printCounts("after", txAfter);
      if (!apply) throw new DryRunRollback();
    }, { timeout: 300_000 });
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const after = orderRows(await loadRows(prisma, cols, ids), ids);
      for (const row of after) {
        const before = liveById.get(String(row.id));
        if (!before || before.correctAnswer !== row.correctAnswer || before.active !== row.active) {
          throw new Error("dry run changed a row");
        }
      }
      const counts = await boardCounts(prisma);
      for (const field of BOARD_FIELDS) {
        if (counts[field] !== beforeCounts[field]) throw new Error(`dry run left ${field} at ${counts[field]}`);
      }
      console.log("Rolled back. Rows are still hidden.");
      return;
    }
    throw error;
  }

  const eligible = await eligibleIds(prisma, ids);
  if (eligible.size !== EXPECTED) throw new Error("committed rows are not all student-eligible");
  const afterCounts = await boardCounts(prisma);
  assertCounts(beforeCounts, afterCounts);
  console.log("Committed.");
  printCounts("verified after", afterCounts);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
