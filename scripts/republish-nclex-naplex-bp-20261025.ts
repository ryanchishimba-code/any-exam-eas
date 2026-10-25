#!/usr/bin/env node
/**
 * Republish the three blood-pressure rewrites the second blind solve approved.
 *
 * Option order is shuffled per item with a fixed seed so correct choices are
 * not bunched on A. Option text is not edited. correctAnswer stays the
 * approved answer text. Stale distractor rationales from the hidden row are
 * dropped. References are replaced with the 2025 AHA/ACC guideline.
 *
 * The phenytoin item, the GERD item, and the retired egg-allergy duplicate
 * stay hidden. Dry run is the default and rolls back. --apply commits.
 *
 *   npx tsx scripts/republish-nclex-naplex-bp-20261025.ts
 *   npx tsx scripts/republish-nclex-naplex-bp-20261025.ts --apply
 *   npx tsx scripts/republish-nclex-naplex-bp-20261025.ts --verify
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

const MAX_EXPLANATION = 1000;
const MAX_KEYS_ON_A = 2;
const DATA_DIR = path.join(process.cwd(), "scripts/data/nclex-naplex-outdated-20261025");
const REWRITES_PATH = path.join(DATA_DIR, "rewrites.json");
const UNDO_PATH = path.join(DATA_DIR, "undo-republish2.json");
const LETTERS = "ABCDE";

const PUBLISH_IDS = [
  "cmqxaus7p001f1ypr2elqbs2e",
  "cmr7tqqg2001n1yivy4gi52qz",
  "cmr7xthmz001n1yikcwuott43",
] as const;

const SELECT_ALL_ID = "";
const NURSING_ID = "";
const CLASSIFICATION_ID = "cmr7tqqg2001n1yivy4gi52qz";
const TIMING_ID = "cmr7xthmz001n1yikcwuott43";
const TIMING_KEY = "She had no cough before the first dose, and the cough began in week 3";
const CLASSIFICATION_KEY = "130/85 mm Hg is above goal (<130/80); BP not controlled";
const BP_GUARD_IDS = new Set<string>();

const STAY_HIDDEN_IDS = [
  "cmr7zzhz2000m1yafsbg3xkeh",
  "cmroigcz3000j1y7n1rmsnzr4",
  "cmrovw8ya000m1yu3299ty2aj",
] as const;

const ALREADY_LIVE_IDS = [
  "cmr815qlj00161ynm2bog3q9j",
  "cmsfy8gct001h1yth5rdikpww",
  "cmqvkwppi001m1y5yg7grxxi4",
  "cmr31diqh0097js047dx13msm",
  "cmr7zccnn000n1y1wdgqlj70o",
  "cmr0mlg1o001d1y34lanynyn7",
  "cmr7ugujq001n1yt3ee4zaua9",
  "cmqw33qs5001c1yawc9sc5grf",
  "cmqwnb0il000b1ynh10vm3wha",
] as const;

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

const EXPECTED_BEFORE: Record<(typeof BOARD_FIELDS)[number], number> = {
  nursing: 3754,
  "usmle-step-1": 3170,
  "usmle-step-2": 5165,
  "usmle-step-3": 8407,
  pharmacy: 5614,
  pance: 3755,
  "aanp-fnp": 5279,
  "npte-pt": 1748,
};

const EXPECTED_AFTER: Record<(typeof BOARD_FIELDS)[number], number> = {
  ...EXPECTED_BEFORE,
  pharmacy: 5617,
};

const STALE_ENVELOPE_KEYS = [
  "distractorRationale",
  "clinicalReasoning",
  "keyTakeaways",
  "keyTakeaway",
  "segments",
  "highlights",
] as const;

type RewriteItem = {
  id: string;
  status?: string;
  fieldId: string;
  guideline: string;
  guidelineUrl: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
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

function optionTreatsReadingAsFine(option: string): boolean {
  const text = option.toLowerCase();
  if (!/130\s*\/\s*8[05]/.test(text)) return false;
  return /\bnormal\b|\bat goal\b|within normal|\bacceptable\b|well[- ]controlled/.test(text);
}

function keyedParts(answer: string): string[] {
  return answer.includes("|||") ? answer.split("|||") : [answer];
}

function loadRewrites(): RewriteItem[] {
  const parsed = JSON.parse(readFileSync(REWRITES_PATH, "utf8")) as { items?: RewriteItem[] };
  if (!Array.isArray(parsed.items) || parsed.items.length !== 15) {
    throw new Error(`rewrites file has ${parsed.items?.length ?? 0} items, expected 15`);
  }
  return parsed.items;
}

function assertFileRewrites(items: RewriteItem[]): void {
  const byId = new Map(items.map((item) => [item.id, item]));
  const phenytoin = byId.get("cmroigcz3000j1y7n1rmsnzr4");
  if (!phenytoin) throw new Error("phenytoin rewrite is missing");
  if (!/350 mg daily and recheck the level in about 2 weeks/.test(phenytoin.correctAnswer)) {
    throw new Error("phenytoin key must be a 350 mg step rechecked in about 2 weeks");
  }
  if (!/about 50 mg/.test(phenytoin.explanation)) throw new Error("phenytoin rationale must use an about 50 mg step");
  if (!/omeprazole raises phenytoin/i.test(phenytoin.explanation)) {
    throw new Error("phenytoin rationale must say omeprazole raises phenytoin");
  }
  if (!/nonlinear kinetics/i.test(phenytoin.explanation) || !/steady state/i.test(phenytoin.explanation)) {
    throw new Error("phenytoin rationale must cover nonlinear kinetics and the new steady state");
  }
  const gerd = byId.get("cmrovw8ya000m1yu3299ty2aj");
  if (!gerd) throw new Error("GERD rewrite is missing");
  if (!/prescription/i.test(gerd.correctAnswer)) throw new Error("the 8-week omeprazole course must be a prescription");
  if (!/14 days/i.test(gerd.explanation) || !/prescription/i.test(gerd.explanation)) {
    throw new Error("GERD rationale must contrast the prescription course with the 14-day OTC label");
  }
  if (!/six weeks|6 weeks/i.test(gerd.scenario) || !/14-day course/i.test(gerd.scenario) || !/within 4 months/i.test(gerd.explanation)) {
    throw new Error("GERD stem must be recurrence within 4 months of a completed 14-day OTC course");
  }
  if (!/withdrawn|cannot be restarted/i.test(gerd.explanation)) {
    throw new Error("ranitidine must stay a withdrawn product");
  }
  const coughIds = [
    "cmqxaus7p001f1ypr2elqbs2e",
    "cmr7tqqg2001n1yivy4gi52qz",
    "cmr7xthmz001n1yikcwuott43",
  ];
  const coughs = coughIds.map((id) => {
    const item = byId.get(id);
    if (!item) throw new Error(`missing cough rewrite ${id}`);
    return item;
  });
  if (new Set(coughs.map((item) => item.correctAnswer)).size !== 3) {
    throw new Error("the three blood-pressure rewrites still share a key");
  }
  if (new Set(coughs.map((item) => item.question)).size !== 3) {
    throw new Error("the three blood-pressure rewrites still ask the same question");
  }
  const timing = byId.get(TIMING_ID);
  if (!timing) throw new Error("timing rewrite is missing");
  if (timing.correctAnswer !== TIMING_KEY) throw new Error("the cough-timing key changed");
  if (/is starting lisinopril/i.test(timing.scenario) || !/no cough before the first dose/i.test(timing.scenario)) {
    throw new Error("the cough timeline still says she is starting lisinopril with a cough already present");
  }
  if (/body mass|father has hypertension|family history|136\/86|130\s*\/\s*85/i.test(`${timing.scenario}\n${timing.options.join("\n")}`)) {
    throw new Error("the timing item still has filler or a 130/85 reading");
  }
  const classification = byId.get(CLASSIFICATION_ID);
  if (!classification) throw new Error("classification rewrite is missing");
  if (classification.correctAnswer !== CLASSIFICATION_KEY) throw new Error("the treated-blood-pressure key wording changed");
  if (/stage 1/i.test(`${classification.correctAnswer}\n${classification.explanation}`)) {
    throw new Error("the treated-blood-pressure item still relies on stage 1");
  }
  if (optionTreatsReadingAsFine(classification.correctAnswer)) {
    throw new Error("the treated-blood-pressure key calls 130/85 normal or at goal");
  }
  for (const id of STAY_HIDDEN_IDS) {
    if ((PUBLISH_IDS as readonly string[]).includes(id)) throw new Error(`${id} is both published and held back`);
  }
}

function assertPublishItem(item: RewriteItem): void {
  if (item.status === "file-only" || item.status === "retired") {
    throw new Error(`${item.id} is marked ${item.status} and cannot be published`);
  }
  if (!item.scenario.trim() || !item.question.trim() || !item.correctAnswer.trim()) {
    throw new Error(`${item.id} is missing stem text`);
  }
  if (item.explanation.length > MAX_EXPLANATION) {
    throw new Error(`${item.id} explanation is ${item.explanation.length} characters`);
  }
  if (/statpearls|\bjnc\b/i.test(`${item.explanation}\n${item.guideline}\n${item.guidelineUrl}`)) {
    throw new Error(`${item.id} still cites JNC or StatPearls`);
  }
  if (!/^https:\/\//.test(item.guidelineUrl)) throw new Error(`${item.id} guideline URL is missing`);
  const expectedOptions = item.id === SELECT_ALL_ID ? 5 : 4;
  if (item.options.length !== expectedOptions) {
    throw new Error(`${item.id} has ${item.options.length} options, expected ${expectedOptions}`);
  }
  if (new Set(item.options).size !== item.options.length) throw new Error(`${item.id} has duplicate options`);
  const parts = keyedParts(item.correctAnswer);
  if (item.id === SELECT_ALL_ID) {
    if (parts.length < 2) throw new Error(`${item.id} select-all key is not split with |||`);
  } else if (parts.length !== 1) {
    throw new Error(`${item.id} is not the select-all item`);
  }
  for (const part of parts) {
    if (!item.options.includes(part)) throw new Error(`${item.id} key text is not an option`);
  }
  if (BP_GUARD_IDS.has(item.id)) {
    for (const option of item.options) {
      if (optionTreatsReadingAsFine(option)) {
        throw new Error(`${item.id} option calls 130/85 or 130/80 normal or at goal: ${option}`);
      }
    }
  }
  const expectedField = item.id === NURSING_ID ? "nursing" : "pharmacy";
  if (item.fieldId !== expectedField) throw new Error(`${item.id} file field is ${item.fieldId}`);
}

function buildEnvelope(liveOptions: string, shuffled: readonly string[]): string {
  let envelope: Record<string, unknown> = {};
  const parsed = JSON.parse(liveOptions) as unknown;
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    envelope = { ...(parsed as Record<string, unknown>) };
  }
  for (const key of STALE_ENVELOPE_KEYS) delete envelope[key];
  envelope.options = [...shuffled];
  if ("distractorRationale" in envelope || "clinicalReasoning" in envelope) {
    throw new Error("stale rationale survived the envelope rebuild");
  }
  return JSON.stringify(envelope);
}

function buildPlans(items: RewriteItem[], liveById: Map<string, Record<string, unknown>>): Plan[] {
  const shuffled = items.map((item) => ({
    item,
    original: item.options.slice(),
    options: shuffleOptions(item.options, item.id),
  }));
  const single = shuffled.filter((row) => row.options.includes(row.item.correctAnswer));
  spreadKeysOffA(single.map((row) => ({ id: row.item.id, options: row.options, answer: row.item.correctAnswer })));

  return shuffled.map((row) => {
    const { item, original } = row;
    const options = row.options;
    if (!sameMembers(original, options)) throw new Error(`${item.id} shuffle changed option text`);
    const live = liveById.get(item.id);
    if (!live) throw new Error(`missing live row ${item.id}`);
    const fromTo = letterMap(original, options);
    const explanation = remapOptionLetters(item.explanation, fromTo);
    if (explanation.text.length > MAX_EXPLANATION) {
      throw new Error(`${item.id} explanation is ${explanation.text.length} characters`);
    }
    const parts = keyedParts(item.correctAnswer);
    const keyLetter = parts.map((part) => LETTERS[options.indexOf(part)] ?? "?").join("+");
    if (keyLetter.includes("?")) throw new Error(`${item.id} key is not in the shuffled options`);
    const fieldId = String(live.fieldId);
    const subjectId = String(live.subjectId);
    const references = [{ label: item.guideline, url: item.guidelineUrl }];
    return {
      id: item.id,
      fieldId,
      subjectId,
      oldScenario: live.scenario == null ? null : String(live.scenario),
      oldQuestion: String(live.question),
      oldCorrectAnswer: String(live.correctAnswer),
      oldContentHash: String(live.contentHash),
      scenario: item.scenario,
      question: item.question,
      correctAnswer: item.correctAnswer,
      explanation: explanation.text,
      optionsJson: buildEnvelope(String(live.options), options),
      optionTexts: options,
      keyLetter,
      contentHash: bankItemContentHash(fieldId, subjectId, {
        question: item.question,
        scenario: item.scenario,
      }),
      referencesJson: JSON.stringify(references),
      guidelineUrl: item.guidelineUrl,
      letterReplacements: explanation.count,
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

function assertCountMap(counts: Record<string, number>, expected: Record<string, number>, label: string): void {
  for (const field of BOARD_FIELDS) {
    if (counts[field] !== expected[field]) {
      throw new Error(`${label} ${field} is ${counts[field]}, expected ${expected[field]}`);
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
  const parsed = JSON.parse(String(raw)) as { options?: unknown };
  if (!Array.isArray(parsed.options)) throw new Error("stored options envelope has no options array");
  return parsed.options.map(String);
}

function referenceBlob(value: unknown): string {
  const parsed = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return parsed;
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
}

function keysOnA(plans: Plan[]): number {
  return plans.filter((plan) => !plan.correctAnswer.includes("|||") && plan.keyLetter === "A").length;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const verify = process.argv.includes("--verify");
  if (apply && verify) throw new Error("pass only one of --apply or --verify");
  assertRemapIsNarrow();
  const allItems = loadRewrites();
  assertFileRewrites(allItems);
  const byId = new Map(allItems.map((item) => [item.id, item]));
  const items = PUBLISH_IDS.map((id) => {
    const item = byId.get(id);
    if (!item) throw new Error(`publish id ${id} is not in the rewrites file`);
    assertPublishItem(item);
    return item;
  });
  const cols = await columns();
  const live = await loadRows(prisma, cols, PUBLISH_IDS);
  const liveById = new Map(live.map((row) => [String(row.id), row]));
  const held = await loadRows(prisma, cols, STAY_HIDDEN_IDS);
  const alreadyLive = await loadRows(prisma, cols, ALREADY_LIVE_IDS);
  for (const row of alreadyLive) {
    if (row.active !== true || row.qaPassed !== true || row.manual_correction !== true) {
      throw new Error(`${String(row.id)} from the first republish is not still live`);
    }
  }
  const alreadyAnswers = new Map(alreadyLive.map((row) => [String(row.id), String(row.correctAnswer)]));

  for (const item of items) {
    const row = liveById.get(item.id);
    if (!row) throw new Error(`missing row ${item.id}`);
    if (row.fieldId !== item.fieldId) throw new Error(`${item.id} is on ${String(row.fieldId)}`);
    if (verify) {
      if (row.correctAnswer !== item.correctAnswer) throw new Error(`${item.id} live key does not match the rewrite`);
    }
  }

  const plans = buildPlans(items, liveById);
  const onA = keysOnA(plans);
  if (onA > MAX_KEYS_ON_A) throw new Error(`${onA} keys are still on A`);

  if (verify) {
    const eligible = await eligibleIds(prisma, PUBLISH_IDS);
    const counts = await boardCounts(prisma);
    for (const plan of plans) {
      const row = liveById.get(plan.id)!;
      if (row.active !== true || row.qaPassed !== true || row.manual_correction !== true) {
        throw new Error(`${plan.id} flags are not active, qaPassed, and locked`);
      }
      if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text does not match`);
      if (row.explanation !== plan.explanation) throw new Error(`${plan.id} explanation does not match`);
      if (String(row.explanation).length > MAX_EXPLANATION) throw new Error(`${plan.id} explanation is too long`);
      if (storedOptions(row.options).join("\n") !== plan.optionTexts.join("\n")) {
        throw new Error(`${plan.id} stored options do not match the shuffle`);
      }
      const parsed = JSON.parse(String(row.options)) as Record<string, unknown>;
      if (parsed.distractorRationale || parsed.clinicalReasoning) {
        throw new Error(`${plan.id} still has a stale rationale in the options envelope`);
      }
      for (const part of keyedParts(plan.correctAnswer)) {
        const index = plan.optionTexts.indexOf(part);
        if (plan.optionTexts[index] !== part) throw new Error(`${plan.id} key letter does not point at the answer`);
      }
      if (row.contentHash !== plan.contentHash) throw new Error(`${plan.id} content hash was not refreshed`);
      const refs = referenceBlob(row.references);
      if (/jnc|statpearls/i.test(refs)) throw new Error(`${plan.id} still cites JNC or StatPearls`);
      if (!refs.includes(plan.guidelineUrl)) throw new Error(`${plan.id} is missing its guideline URL`);
      if (BP_GUARD_IDS.has(plan.id)) {
        for (const option of plan.optionTexts) {
          if (optionTreatsReadingAsFine(option)) throw new Error(`${plan.id} published an option that calls the reading normal`);
        }
      }
      if (!eligible.has(plan.id)) throw new Error(`${plan.id} is not student-eligible`);
    }
    for (const row of held) {
      if (row.active !== false || row.manual_correction !== true) throw new Error(`${String(row.id)} did not stay hidden`);
    }
    const stillLive = await loadRows(prisma, cols, ALREADY_LIVE_IDS);
    for (const row of stillLive) {
      if (String(row.correctAnswer) !== alreadyAnswers.get(String(row.id)) || row.active !== true) {
        throw new Error(`${String(row.id)} from the first republish changed`);
      }
    }
    assertCountMap(counts, EXPECTED_AFTER, "verified");
    console.log("VERIFY");
    console.log(`rows matched: ${plans.length}`);
    console.log(`student-eligible: ${eligible.size}`);
    for (const plan of plans) console.log(`${plan.fieldId} ${plan.id} ${plan.keyLetter}`);
    printCounts("after", counts);
    return;
  }

  for (const row of live) assertHiddenRow(row);
  for (const row of held) assertHiddenRow(row);
  await assertNoHashCollision(plans);
  const beforeCounts = await boardCounts(prisma);
  assertCountMap(beforeCounts, EXPECTED_BEFORE, "before");
  const beforeEligible = await eligibleIds(prisma, PUBLISH_IDS);
  if (beforeEligible.size !== 0) throw new Error(`${beforeEligible.size} items are already student-eligible`);

  let digest = "";
  if (!existsSync(UNDO_PATH)) {
    digest = writeUndo({
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Pre-image before three approved blood-pressure rewrites were published.",
      ids: [...PUBLISH_IDS],
      columnTypes: Object.fromEntries(cols.map((column) => [column.column_name, column.udt_name])),
      studentEligibleBefore: beforeCounts,
      rows: live,
    });
  } else {
    const undo = readUndo();
    if (undo.ids.join(",") !== PUBLISH_IDS.join(",")) throw new Error("undo file ids do not match the republish set");
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
  console.log(`keys on A: ${onA}`);
  for (const plan of plans) {
    console.log(
      `${plan.fieldId} ${plan.id} ${plan.keyLetter} options=${plan.optionTexts.length} explanation=${plan.explanation.length} letterRefs=${plan.letterReplacements}`
    );
  }
  printCounts("before", beforeCounts);
  if (digest) console.log(`undo sha256: ${digest}`);

  const heldAnswers = new Map(held.map((row) => [String(row.id), String(row.correctAnswer)]));

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
        await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
        const txBefore = await boardCounts(tx);
        assertCountMap(txBefore, EXPECTED_BEFORE, "transaction before");
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
          `;
          if (updated !== 1) throw new Error(`update touched ${updated} rows for ${plan.id}`);
        }
        const afterRows = await loadRows(tx, cols, PUBLISH_IDS);
        const afterById = new Map(afterRows.map((row) => [String(row.id), row]));
        for (const plan of plans) {
          const row = afterById.get(plan.id);
          if (!row) throw new Error(`missing updated row ${plan.id}`);
          if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text changed`);
          if (row.active !== true || row.qaPassed !== true || row.manual_correction !== true) {
            throw new Error(`${plan.id} flags were not set`);
          }
          if (String(row.explanation).length > MAX_EXPLANATION) throw new Error(`${plan.id} explanation is too long`);
          if (storedOptions(row.options).join("\n") !== plan.optionTexts.join("\n")) {
            throw new Error(`${plan.id} options were not stored in shuffled order`);
          }
          if (row.contentHash !== plan.contentHash) throw new Error(`${plan.id} content hash was not refreshed`);
          const refs = referenceBlob(row.references);
          if (/jnc|statpearls/i.test(refs) || !refs.includes(plan.guidelineUrl)) {
            throw new Error(`${plan.id} references were not replaced`);
          }
        }
        const stillHeld = await loadRows(tx, cols, STAY_HIDDEN_IDS);
        for (const row of stillHeld) {
          if (row.active !== false || String(row.correctAnswer) !== heldAnswers.get(String(row.id))) {
            throw new Error(`${String(row.id)} was changed even though it stays hidden`);
          }
        }
        const stillLive = await loadRows(tx, cols, ALREADY_LIVE_IDS);
        for (const row of stillLive) {
          if (row.active !== true || String(row.correctAnswer) !== alreadyAnswers.get(String(row.id))) {
            throw new Error(`${String(row.id)} from the first republish changed`);
          }
        }
        const eligible = await eligibleIds(tx, PUBLISH_IDS);
        if (eligible.size !== PUBLISH_IDS.length) {
          const missing = PUBLISH_IDS.filter((id) => !eligible.has(id));
          throw new Error(`not student-eligible after republish: ${missing.join(", ")}`);
        }
        const txAfter = await boardCounts(tx);
        assertCountMap(txAfter, EXPECTED_AFTER, "transaction after");
        console.log(`updated rows: ${PUBLISH_IDS.length}`);
        printCounts("after", txAfter);
        if (!apply) throw new DryRunRollback();
      },
      { timeout: 300_000 }
    );
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const after = await loadRows(prisma, cols, PUBLISH_IDS);
      for (const row of after) {
        const before = liveById.get(String(row.id));
        if (!before || before.correctAnswer !== row.correctAnswer || before.active !== row.active) {
          throw new Error("dry run changed a row");
        }
      }
      const counts = await boardCounts(prisma);
      assertCountMap(counts, EXPECTED_BEFORE, "after rollback");
      console.log("Rolled back. Rows are still hidden.");
      return;
    }
    throw error;
  }

  const eligible = await eligibleIds(prisma, PUBLISH_IDS);
  if (eligible.size !== PUBLISH_IDS.length) throw new Error("committed rows are not all student-eligible");
  const afterCounts = await boardCounts(prisma);
  assertCountMap(afterCounts, EXPECTED_AFTER, "committed");
  const retired = await loadRows(prisma, cols, ["cmr7zzhz2000m1yafsbg3xkeh"]);
  if (retired[0]?.active !== false) throw new Error("retired egg-allergy item is no longer hidden");
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
