#!/usr/bin/env node
/**
 * Hide 13 PANCE pulmonary items flagged DANGEROUS or WRONG KEY on 2026-10-25.
 * MISCODED, AMBIGUOUS, and OK-after-review rows in the same flags file stay live.
 *
 * The live student-eligible predicate is active, qaPassed, and
 * studentEligibleAndSql(). These rows stay qaPassed. Setting active = false
 * removes them from that predicate. manual_correction is the lock earlier
 * hide scripts write so the nightly seed sync will not overwrite the row.
 * Question text, options, keys, and rationales are not changed.
 *
 * The flags file records the keyed answer as a letter. The script checks that
 * the letter's option text is the stored correctAnswer.
 *
 * The script refuses before it writes the undo file or updates the bank when
 * the hide set is not these 13 ids, an id is not a live PANCE pulmonary row,
 * the keyed letter does not match, a row is not currently student-eligible,
 * or the PANCE eligible count is not 3768.
 *
 *   npx tsx scripts/hide-pance-pulm-flags-20261025.ts
 *   npx tsx scripts/hide-pance-pulm-flags-20261025.ts --apply
 *   npx tsx scripts/hide-pance-pulm-flags-20261025.ts --verify
 *
 * Restore the active flag and the manual_correction lock from the undo file:
 *   npx tsx scripts/hide-pance-pulm-flags-20261025.ts --restore
 *   npx tsx scripts/hide-pance-pulm-flags-20261025.ts --restore --apply
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const EXPECTED = 13;
const EXPECTED_DANGEROUS = 5;
const EXPECTED_WRONG_KEY = 8;
const EXPECTED_PANCE_BEFORE = 3768;
const EXPECTED_PANCE_AFTER = 3755;
const HIDE_CLASSES = ["DANGEROUS", "WRONG KEY"] as const;
const APPROVED_IDS = [
  "cmqgw241l00011ytk4apqg38w",
  "cmqgz4cbj003p1ybcx24qxtyc",
  "cmqgz1dfo00241ybcr2qym6pq",
  "cmqgz35ti003b1ybcxaibpre0",
  "cmqgz018u001c1ybcdbar2z31",
  "cmqgvjfpa00021yifmmh1xggt",
  "cmqgyyq5h00011ybcsid9x589",
  "cmqgz4bj8003l1ybco6itmim0",
  "cmqgz60ku00011yqyy8g156c7",
  "cmqgz63hj00131yqy4h2s6wdc",
  "cmqgz7eov00381yqyaiakmxpo",
  "cmqgzadag007a1yqyf6awdb17",
  "cmr820hh0004p1y54fetlgicb",
] as const;
const DATA_DIR = path.join(process.cwd(), "scripts/data/pance-pulm-flags-20261025");
const FLAGS_PATH = path.join(DATA_DIR, "flags.json");
const UNDO_PATH = path.join(DATA_DIR, "undo.json");

/** Same fields as the live board-count query. */
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
  pharmacy: 5620,
  pance: EXPECTED_PANCE_BEFORE,
  "aanp-fnp": 5279,
  "npte-pt": 1748,
};

type HideClass = (typeof HIDE_CLASSES)[number];

type FlagEntry = {
  id: string;
  board: string;
  system: string;
  class: string;
  keyed: string;
};

type HideItem = {
  id: string;
  class: HideClass;
  letter: string;
};

type Column = { column_name: string; udt_name: string };

type UndoFile = {
  backedUpAt: string;
  table: "QuestionBankItem";
  reason: string;
  ids: string[];
  classes: Record<string, string[]>;
  columnTypes: Record<string, string>;
  studentEligibleBefore: {
    byField: Record<string, number>;
    items: Array<{ id: string; fieldId: string; eligible: boolean }>;
  };
  rows: Array<Record<string, unknown>>;
};

const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

function loadHideItems(): HideItem[] {
  const parsed = JSON.parse(readFileSync(FLAGS_PATH, "utf8")) as unknown;
  if (!Array.isArray(parsed)) throw new Error("flags.json is not an array");
  const counts: Record<string, number> = {};
  const items: HideItem[] = [];
  for (const entry of parsed) {
    if (!entry || typeof entry !== "object") throw new Error("flags.json has a non-object entry");
    const row = entry as FlagEntry;
    counts[row.class] = (counts[row.class] ?? 0) + 1;
    if (!HIDE_CLASSES.includes(row.class as HideClass)) continue;
    if (typeof row.id !== "string" || !/^[a-z0-9]+$/.test(row.id)) {
      throw new Error(`unexpected id in flags.json: ${String(row.id)}`);
    }
    if (row.board !== "PANCE") throw new Error(`${row.id} flags board is ${row.board}, expected PANCE`);
    if (row.system !== "pulmonary") throw new Error(`${row.id} flags system is ${row.system}, expected pulmonary`);
    if (typeof row.keyed !== "string" || !/^[A-E]$/.test(row.keyed)) {
      throw new Error(`${row.id} keyed answer is not a single letter`);
    }
    items.push({ id: row.id, class: row.class as HideClass, letter: row.keyed });
  }
  const summary = Object.entries(counts)
    .map(([name, count]) => `${name} ${count}`)
    .join(", ");
  console.log(`flags classes: ${summary}`);
  if (counts.DANGEROUS !== EXPECTED_DANGEROUS || counts["WRONG KEY"] !== EXPECTED_WRONG_KEY || items.length !== EXPECTED) {
    throw new Error(`hide classes have ${items.length} entries, expected ${EXPECTED}. No undo file and no update.`);
  }
  const byId = new Map(items.map((item) => [item.id, item]));
  if (byId.size !== items.length) throw new Error("hide id list has duplicates. No undo file and no update.");
  const missing = APPROVED_IDS.filter((id) => !byId.has(id));
  const extra = items.filter((item) => !APPROVED_IDS.includes(item.id)).map((item) => item.id);
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(`hide ids do not match the approved 13. missing ${missing.join(",") || "none"}; extra ${extra.join(",") || "none"}. No undo file and no update.`);
  }
  return APPROVED_IDS.map((id) => byId.get(id)!);
}

const ITEMS = loadHideItems();

function ids(): string[] {
  return ITEMS.map((item) => item.id);
}

function classesByName(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const name of HIDE_CLASSES) grouped[name] = [];
  for (const item of ITEMS) grouped[item.class]!.push(item.id);
  return grouped;
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

function idListSql(): string {
  return ids().map((id) => `'${id}'`).join(", ");
}

function boardListSql(): string {
  return BOARD_FIELDS.map((field) => `'${field}'`).join(", ");
}

async function columns(): Promise<Column[]> {
  const found = (await prisma.$queryRawUnsafe(`
    SELECT column_name, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Column[];
  const names = found.map((column) => column.column_name);
  for (const name of ["id", "fieldId", "subjectId", "active", "qaPassed", "manual_correction", "correctAnswer", "scenario", "contentHash"]) {
    if (!names.includes(name)) throw new Error(`QuestionBankItem is missing ${name}`);
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

type Sql = PrismaClient | Prisma.TransactionClient;

async function loadRows(client: Sql, cols: Column[]): Promise<Array<Record<string, unknown>>> {
  const rows = (await client.$queryRawUnsafe(
    `SELECT ${selectList(cols)} FROM "QuestionBankItem" WHERE id IN (${idListSql()})`
  )) as Array<Record<string, unknown>>;
  return rows.map((row) =>
    Object.fromEntries(cols.map((column) => [column.column_name, jsonValue(row[column.column_name])]))
  );
}

function orderRows(rows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  const missing = ids().filter((id) => !byId.has(id));
  if (missing.length > 0) {
    throw new Error(`not a live QuestionBankItem row: ${missing.join(", ")}. No undo file and no update.`);
  }
  return ids().map((id) => byId.get(id)!);
}

function optionAtLetter(raw: unknown, letter: string): string {
  let parsed: unknown;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new Error("options are not JSON");
  }
  const list = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { options?: unknown }).options)
      ? (parsed as { options: unknown[] }).options
      : null;
  if (!list) throw new Error("options list missing");
  const option = list[letter.charCodeAt(0) - 65];
  if (typeof option !== "string") throw new Error(`option ${letter} is not text`);
  return option;
}

function assertLivePance(rows: Array<Record<string, unknown>>): void {
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  for (const item of ITEMS) {
    const row = byId.get(item.id);
    if (!row) throw new Error(`${item.id} is not a live QuestionBankItem row. No undo file and no update.`);
    if (row.fieldId !== "pance") {
      throw new Error(`${item.id} is on ${String(row.fieldId)}, not a live PANCE row. No undo file and no update.`);
    }
    if (row.subjectId !== "pulmonary") {
      throw new Error(`${item.id} subject is ${String(row.subjectId)}, not pulmonary. No undo file and no update.`);
    }
    if (optionAtLetter(row.options, item.letter) !== row.correctAnswer) {
      throw new Error(`${item.id} option ${item.letter} is not the stored key. No undo file and no update.`);
    }
  }
}

function assertPreHide(rows: Array<Record<string, unknown>>): void {
  for (const row of rows) {
    if (row.active !== true) throw new Error(`${String(row.id)} is already inactive. No undo file and no update.`);
    if (row.qaPassed !== true) throw new Error(`${String(row.id)} is not qaPassed. No undo file and no update.`);
    if (row.manual_correction !== false) {
      throw new Error(`${String(row.id)} is already manual_correction. No undo file and no update.`);
    }
  }
}

async function eligibleById(tx: Sql): Promise<Array<{ id: string; fieldId: string; eligible: boolean }>> {
  const rows = (await tx.$queryRawUnsafe(`
    SELECT
      id,
      "fieldId" AS field_id,
      (
        active = true
        AND "qaPassed" = true
        ${studentEligibleAndSql()}
      ) AS eligible
    FROM "QuestionBankItem"
    WHERE id IN (${idListSql()})
  `)) as Array<{ id: string; field_id: string; eligible: boolean }>;
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids().map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`missing eligibility row ${id}`);
    return { id, fieldId: row.field_id, eligible: row.eligible === true };
  });
}

async function boardCounts(tx: Sql): Promise<Record<string, number>> {
  const rows = (await tx.$queryRawUnsafe(`
    SELECT "fieldId" AS field_id, COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" IN (${boardListSql()})
      AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
      ${studentEligibleAndSql()}
    GROUP BY "fieldId"
  `)) as Array<{ field_id: string; n: unknown }>;
  const counts: Record<string, number> = {};
  for (const field of BOARD_FIELDS) counts[field] = 0;
  for (const row of rows) counts[row.field_id] = asInt(row.n);
  return counts;
}

function assertBaseline(counts: Record<string, number>, items: Array<{ id: string; fieldId: string; eligible: boolean }>): void {
  const ineligible = items.filter((item) => !item.eligible || item.fieldId !== "pance");
  if (ineligible.length > 0) {
    throw new Error(
      `not currently student-eligible PANCE rows: ${ineligible.map((item) => item.id).join(", ")}. No undo file and no update.`
    );
  }
  for (const field of BOARD_FIELDS) {
    if (counts[field] !== EXPECTED_BEFORE[field]) {
      throw new Error(
        `${field} eligible count is ${counts[field]}, expected ${EXPECTED_BEFORE[field]}. No undo file and no update.`
      );
    }
  }
}

function assertDrop(before: Record<string, number>, after: Record<string, number>): void {
  for (const field of BOARD_FIELDS) {
    const expected = field === "pance" ? EXPECTED : 0;
    const actual = before[field]! - after[field]!;
    if (actual !== expected) {
      throw new Error(`${field} dropped by ${actual}, expected ${expected} (${before[field]} -> ${after[field]})`);
    }
  }
  if (after.pance !== EXPECTED_PANCE_AFTER) {
    throw new Error(`pance after is ${after.pance}, expected ${EXPECTED_PANCE_AFTER}`);
  }
}

function printCounts(label: string, counts: Record<string, number>): void {
  const parts = BOARD_FIELDS.map((field) => `${field} ${counts[field]}`);
  console.log(`${label}: ${parts.join(", ")}`);
}

function printHiddenIds(): void {
  const grouped = classesByName();
  for (const name of HIDE_CLASSES) {
    console.log(`${name} (${grouped[name]!.length}): ${grouped[name]!.join(", ")}`);
  }
}

function readUndo(): UndoFile {
  const parsed = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoFile;
  if (!Array.isArray(parsed.ids) || parsed.ids.join(",") !== ids().join(",")) {
    throw new Error("undo file ids do not match the hide list");
  }
  if (!Array.isArray(parsed.rows) || parsed.rows.length !== EXPECTED) {
    throw new Error(`undo file does not hold ${EXPECTED} rows`);
  }
  return parsed;
}

function writeUndo(payload: UndoFile): string {
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(UNDO_PATH)) throw new Error(`${UNDO_PATH} already exists`);
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(UNDO_PATH, body, { flag: "wx" });
  return createHash("sha256").update(body).digest("hex");
}

function sameContent(live: Record<string, unknown>, snapshot: Record<string, unknown>): boolean {
  return (
    live.question === snapshot.question &&
    live.options === snapshot.options &&
    live.correctAnswer === snapshot.correctAnswer &&
    live.explanation === snapshot.explanation &&
    live.scenario === snapshot.scenario &&
    live.contentHash === snapshot.contentHash
  );
}

async function main() {
  const apply = process.argv.includes("--apply");
  const restore = process.argv.includes("--restore");
  const verify = process.argv.includes("--verify");
  if (restore && verify) throw new Error("pass only one of --restore or --verify");
  if ([apply, restore, verify].filter(Boolean).length > 1 && !(restore && apply)) {
    throw new Error("pass only one of --apply, --verify, or --restore");
  }

  const cols = await columns();
  const live = orderRows(await loadRows(prisma, cols));
  assertLivePance(live);

  if (verify) {
    if (!existsSync(UNDO_PATH)) throw new Error(`missing undo file ${UNDO_PATH}`);
    const undo = readUndo();
    const undoById = new Map(undo.rows.map((row) => [String(row.id), row]));
    for (const row of live) {
      const snapshot = undoById.get(String(row.id));
      if (!snapshot || !sameContent(row, snapshot)) throw new Error(`${String(row.id)} content changed after the snapshot`);
      if (row.active !== false) throw new Error(`${String(row.id)} is still active`);
      if (row.manual_correction !== true) throw new Error(`${String(row.id)} is not locked`);
      if (row.qaPassed !== true) throw new Error(`${String(row.id)} qaPassed changed`);
    }
    const items = await eligibleById(prisma);
    const counts = await boardCounts(prisma);
    const still = items.filter((item) => item.eligible);
    if (still.length > 0) throw new Error(`still student-eligible: ${still.map((item) => item.id).join(", ")}`);
    assertDrop(undo.studentEligibleBefore.byField, counts);
    console.log("VERIFY");
    console.log(`rows matched: ${live.length}`);
    console.log("student-eligible among the 13: 0");
    printCounts("before", undo.studentEligibleBefore.byField);
    printCounts("after", counts);
    printHiddenIds();
    return;
  }

  if (restore) {
    if (!existsSync(UNDO_PATH)) throw new Error(`missing undo file ${UNDO_PATH}`);
    const undo = readUndo();
    const undoById = new Map(undo.rows.map((row) => [String(row.id), row]));
    for (const row of live) {
      const snapshot = undoById.get(String(row.id));
      if (!snapshot || !sameContent(row, snapshot)) throw new Error(`${String(row.id)} content no longer matches the undo snapshot`);
      if (snapshot.active !== true || snapshot.manual_correction !== false) {
        throw new Error(`${String(row.id)} undo snapshot is not the pre-hide row`);
      }
    }
    console.log(apply ? "RESTORE APPLY" : "RESTORE DRY RUN");
    try {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
        await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
        let restored = 0;
        for (const snapshot of undo.rows) {
          const id = String(snapshot.id);
          if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
          const updated = await tx.$queryRaw<Array<{ id: string }>>`
            UPDATE "QuestionBankItem"
            SET active = true,
                manual_correction = false,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = ${id}
              AND "contentHash" = ${String(snapshot.contentHash)}
              AND question = ${String(snapshot.question)}
              AND "correctAnswer" = ${String(snapshot.correctAnswer)}
              AND active = false
              AND manual_correction = true
            RETURNING id
          `;
          restored += updated.length;
        }
        if (restored !== EXPECTED) throw new Error(`restored ${restored} rows, expected ${EXPECTED}`);
        const after = orderRows(await loadRows(tx, cols));
        for (const row of after) {
          const snapshot = undoById.get(String(row.id));
          if (!snapshot || !sameContent(row, snapshot)) throw new Error(`${String(row.id)} content changed during restore`);
          if (row.active !== true || row.manual_correction !== false) {
            throw new Error(`${String(row.id)} did not return to the pre-hide flags`);
          }
        }
        const items = await eligibleById(tx);
        const counts = await boardCounts(tx);
        for (const item of undo.studentEligibleBefore.items) {
          const now = items.find((row) => row.id === item.id);
          if (!now || now.eligible !== item.eligible) {
            throw new Error(`${item.id} eligibility did not return to the snapshot`);
          }
        }
        for (const field of BOARD_FIELDS) {
          if (counts[field] !== undo.studentEligibleBefore.byField[field]) {
            throw new Error(`${field} count ${counts[field]} did not return to ${undo.studentEligibleBefore.byField[field]}`);
          }
        }
        console.log(`rows matched: ${EXPECTED}`);
        printCounts("restored", counts);
        if (!apply) throw new DryRunRollback();
      }, { timeout: 300_000 });
    } catch (error) {
      if (error instanceof DryRunRollback) {
        console.log("Rolled back. No restore was committed.");
        return;
      }
      throw error;
    }
    console.log("Committed restore.");
    return;
  }

  assertPreHide(live);
  const beforeItems = await eligibleById(prisma);
  const beforeCounts = await boardCounts(prisma);
  assertBaseline(beforeCounts, beforeItems);

  let digest = "";
  if (!existsSync(UNDO_PATH)) {
    const payload: UndoFile = {
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "PANCE pulmonary flags 2026-10-25: DANGEROUS and WRONG KEY. MISCODED, AMBIGUOUS, and OK-after-review rows were not hidden. Full QuestionBankItem pre-image.",
      ids: ids(),
      classes: classesByName(),
      columnTypes: Object.fromEntries(cols.map((column) => [column.column_name, column.udt_name])),
      studentEligibleBefore: { byField: beforeCounts, items: beforeItems },
      rows: live,
    };
    digest = writeUndo(payload);
  } else {
    const undo = readUndo();
    const undoById = new Map(undo.rows.map((row) => [String(row.id), row]));
    for (const row of live) {
      const snapshot = undoById.get(String(row.id));
      if (!snapshot || !sameContent(row, snapshot)) throw new Error(`${String(row.id)} no longer matches the undo snapshot`);
      if (snapshot.active !== true || snapshot.manual_correction !== false) {
        throw new Error(`${String(row.id)} undo snapshot is not the pre-hide row`);
      }
    }
    for (const field of BOARD_FIELDS) {
      if (undo.studentEligibleBefore.byField[field] !== beforeCounts[field]) {
        throw new Error(`${field} eligible count changed since the undo snapshot`);
      }
    }
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`rows matched: ${live.length}`);
  console.log(`columns: ${cols.length}`);
  console.log(`student-eligible before hide: ${beforeItems.filter((item) => item.eligible).length}`);
  printCounts("before", beforeCounts);
  printHiddenIds();
  if (digest) console.log(`undo sha256: ${digest}`);
  console.log("Question text, options, keys, and rationales would not change.");

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
      const txBeforeItems = await eligibleById(tx);
      const txBefore = await boardCounts(tx);
      assertBaseline(txBefore, txBeforeItems);
      const updated = (await tx.$queryRawUnsafe(`
        WITH upd AS (
          UPDATE "QuestionBankItem"
          SET active = false,
              manual_correction = true,
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE id IN (${idListSql()})
            AND "fieldId" = 'pance'
            AND "subjectId" = 'pulmonary'
            AND active = true
            AND "qaPassed" = true
            AND manual_correction = false
          RETURNING id
        )
        SELECT COUNT(*)::int AS n FROM upd
      `)) as Array<{ n: unknown }>;
      if (asInt(updated[0]?.n) !== EXPECTED) throw new Error(`updated ${String(updated[0]?.n)} rows, expected ${EXPECTED}`);

      const afterRows = orderRows(
        ((await tx.$queryRawUnsafe(
          `SELECT ${selectList(cols)} FROM "QuestionBankItem" WHERE id IN (${idListSql()})`
        )) as Array<Record<string, unknown>>).map((row) =>
          Object.fromEntries(cols.map((column) => [column.column_name, jsonValue(row[column.column_name])]))
        )
      );
      const liveById = new Map(live.map((row) => [String(row.id), row]));
      for (const row of afterRows) {
        const before = liveById.get(String(row.id));
        if (!before || !sameContent(row, before)) throw new Error(`${String(row.id)} content changed`);
        if (row.active !== false) throw new Error(`${String(row.id)} stayed active`);
        if (row.manual_correction !== true) throw new Error(`${String(row.id)} was not locked`);
        if (row.qaPassed !== true) throw new Error(`${String(row.id)} qaPassed changed`);
        if (row.fieldId !== "pance" || row.subjectId !== "pulmonary") throw new Error(`${String(row.id)} field changed`);
      }
      const afterItems = await eligibleById(tx);
      const still = afterItems.filter((item) => item.eligible);
      if (still.length > 0) throw new Error(`still student-eligible: ${still.map((item) => item.id).join(", ")}`);
      const txAfter = await boardCounts(tx);
      assertDrop(txBefore, txAfter);
      console.log(`updated rows: ${EXPECTED}`);
      printCounts("after", txAfter);
      if (!apply) throw new DryRunRollback();
    }, { timeout: 300_000 });
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const after = orderRows(await loadRows(prisma, cols));
      assertPreHide(after);
      for (const row of after) {
        const before = live.find((item) => item.id === row.id);
        if (!before || !sameContent(row, before)) throw new Error("dry run changed question content");
      }
      const counts = await boardCounts(prisma);
      for (const field of BOARD_FIELDS) {
        if (counts[field] !== beforeCounts[field]) throw new Error(`dry run left ${field} count at ${counts[field]}`);
      }
      console.log("Rolled back. active and manual_correction unchanged.");
      return;
    }
    throw error;
  }

  const committed = orderRows(await loadRows(prisma, cols));
  for (const row of committed) {
    if (row.active !== false || row.manual_correction !== true || row.qaPassed !== true) {
      throw new Error(`${String(row.id)} did not stay hidden`);
    }
  }
  const afterItems = await eligibleById(prisma);
  const still = afterItems.filter((item) => item.eligible);
  if (still.length > 0) throw new Error(`committed rows still student-eligible: ${still.map((item) => item.id).join(", ")}`);
  const afterCounts = await boardCounts(prisma);
  assertDrop(beforeCounts, afterCounts);
  console.log("Committed.");
  printCounts("verified after", afterCounts);
  printHiddenIds();
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]"));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
