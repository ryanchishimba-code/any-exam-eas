#!/usr/bin/env node
/**
 * Hide eight confirmed wrong-key items from the 2026-10-25 blind review.
 *
 * The live student-eligible predicate is active, qaPassed, and
 * studentEligibleAndSql(). These rows stay qaPassed. Setting active = false
 * removes them from that predicate on the live bank. manual_correction is the
 * lock earlier hide scripts write so the nightly seed sync will not overwrite
 * the row. Question text, options, keys, and rationales are not changed.
 *
 * The full pre-image is scripts/data/blind-review-wrong-key-20261025/undo.json.
 * Dry run is the default. The update runs inside a transaction and rolls back.
 *
 *   npx tsx scripts/hide-blind-review-wrong-keys-20261025.ts
 *   npx tsx scripts/hide-blind-review-wrong-keys-20261025.ts --apply
 *   npx tsx scripts/hide-blind-review-wrong-keys-20261025.ts --verify
 *
 * Restore the active flag and the manual_correction lock from the undo file:
 *   npx tsx scripts/hide-blind-review-wrong-keys-20261025.ts --restore
 *   npx tsx scripts/hide-blind-review-wrong-keys-20261025.ts --restore --apply
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const EXPECTED = 8;
const UNDO_DIR = path.join(process.cwd(), "scripts/data/blind-review-wrong-key-20261025");
const UNDO_PATH = path.join(UNDO_DIR, "undo.json");

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

type BoardField = (typeof BOARD_FIELDS)[number];

type HideItem = {
  id: string;
  fieldId: BoardField;
  correctAnswer: string;
  scenarioIncludes: string;
};

const ITEMS: readonly HideItem[] = [
  {
    id: "cmqgquzft00071y4vvxz3dhhm",
    fieldId: "pance",
    correctAnswer: "Administer intravenous heparin",
    scenarioIncludes: "large pulmonary embolism",
  },
  {
    id: "cmqwusvhh00e41yzeqhklmstn",
    fieldId: "pance",
    correctAnswer: "Troponin levels",
    scenarioIncludes: "ST-segment elevation",
  },
  {
    id: "cmqgw4lml000b1ytkjfwhid47",
    fieldId: "pance",
    correctAnswer: "Initiate iron supplementation",
    scenarioIncludes: "fainting during physical activity",
  },
  {
    id: "cmqwuk81u001v1yzeosaa79ai",
    fieldId: "pance",
    correctAnswer: "Cephalexin",
    scenarioIncludes: "4 cm fluctuant",
  },
  {
    id: "cmqgreoy100091yxdedz1asuu",
    fieldId: "pance",
    correctAnswer: "Perform tympanostomy tube placement",
    scenarioIncludes: "recurrent otitis media",
  },
  {
    id: "cmr83i5y4003h1yq5tr8no1s5",
    fieldId: "aanp-fnp",
    correctAnswer: "Physiologic jaundice",
    scenarioIncludes: "2-week-old",
  },
  {
    id: "cmqgvc7on00081yssvph08zgn",
    fieldId: "aanp-fnp",
    correctAnswer: "Obesity",
    scenarioIncludes: "BMI of 29",
  },
  {
    id: "cmr8311al003d1ykz36fuoljt",
    fieldId: "aanp-fnp",
    correctAnswer: "Add ezetimibe",
    scenarioIncludes: "LDL level of 160",
  },
];

const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

type Column = { column_name: string; udt_name: string };

type UndoFile = {
  backedUpAt: string;
  table: "QuestionBankItem";
  reason: string;
  ids: string[];
  columnTypes: Record<string, string>;
  studentEligibleBefore: {
    byField: Record<string, number>;
    items: Array<{ id: string; fieldId: string; eligible: boolean }>;
  };
  rows: Array<Record<string, unknown>>;
};

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

function ids(): string[] {
  return ITEMS.map((item) => item.id);
}

function assertIdList(): void {
  const list = ids();
  if (list.length !== EXPECTED) throw new Error(`hide list has ${list.length} ids, expected ${EXPECTED}`);
  if (new Set(list).size !== list.length) throw new Error("hide id list has duplicates");
  for (const id of list) {
    if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
  }
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
  for (const name of ["id", "fieldId", "active", "qaPassed", "manual_correction", "correctAnswer", "scenario", "contentHash"]) {
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
  return ids().map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`missing row ${id}`);
    return row;
  });
}

function assertFingerprints(rows: Array<Record<string, unknown>>): void {
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  const missing = ids().filter((id) => !byId.has(id));
  if (missing.length > 0) throw new Error(`not found: ${missing.join(", ")}`);
  for (const item of ITEMS) {
    const row = byId.get(item.id);
    if (!row) throw new Error(`missing row ${item.id}`);
    if (row.fieldId !== item.fieldId) throw new Error(`${item.id} is on ${String(row.fieldId)}, expected ${item.fieldId}`);
    if (row.correctAnswer !== item.correctAnswer) throw new Error(`${item.id} key does not match the confirmed wrong key`);
    const scenario = String(row.scenario ?? "");
    if (!scenario.includes(item.scenarioIncludes)) throw new Error(`${item.id} stem does not match the confirmed item`);
  }
}

function assertPreHide(rows: Array<Record<string, unknown>>): void {
  for (const row of rows) {
    if (row.active !== true) throw new Error(`${String(row.id)} is already inactive`);
    if (row.qaPassed !== true) throw new Error(`${String(row.id)} is not qaPassed`);
    if (row.manual_correction !== false) throw new Error(`${String(row.id)} is already manual_correction`);
  }
}

async function eligibleById(tx: Sql): Promise<
  Array<{ id: string; fieldId: string; eligible: boolean }>
> {
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

function expectedDrop(items: Array<{ fieldId: string; eligible: boolean }>): Record<string, number> {
  const drop: Record<string, number> = {};
  for (const field of BOARD_FIELDS) drop[field] = 0;
  for (const item of items) {
    if (!item.eligible) continue;
    drop[item.fieldId] = (drop[item.fieldId] ?? 0) + 1;
  }
  return drop;
}

function assertDrop(
  before: Record<string, number>,
  after: Record<string, number>,
  drop: Record<string, number>
): void {
  for (const field of BOARD_FIELDS) {
    const actual = before[field]! - after[field]!;
    if (actual !== drop[field]) {
      throw new Error(`${field} dropped by ${actual}, expected ${drop[field]} (${before[field]} -> ${after[field]})`);
    }
  }
}

function printCounts(label: string, counts: Record<string, number>): void {
  const parts = BOARD_FIELDS.map((field) => `${field} ${counts[field]}`);
  console.log(`${label}: ${parts.join(", ")}`);
}

function readUndo(): UndoFile {
  const parsed = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoFile;
  if (!Array.isArray(parsed.ids) || parsed.ids.join(",") !== ids().join(",")) {
    throw new Error("undo file ids do not match the hide list");
  }
  if (!Array.isArray(parsed.rows) || parsed.rows.length !== EXPECTED) {
    throw new Error("undo file does not hold 8 rows");
  }
  return parsed;
}

function writeUndo(payload: UndoFile): string {
  mkdirSync(UNDO_DIR, { recursive: true });
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
  assertIdList();

  const cols = await columns();
  const live = orderRows(await loadRows(prisma, cols));
  assertFingerprints(live);

  if (verify) {
    if (!existsSync(UNDO_PATH)) throw new Error(`missing undo file ${UNDO_PATH}`);
    const undo = readUndo();
    const undoById = new Map(undo.rows.map((row) => [String(row.id), row]));
    for (const row of live) {
      const snapshot = undoById.get(String(row.id));
      if (!snapshot || !sameContent(row, snapshot)) throw new Error(`${String(row.id)} content changed after the snapshot`);
      if (row.active !== false) throw new Error(`${String(row.id)} is still active`);
      if (row.manual_correction !== true) throw new Error(`${String(row.id)} is not locked`);
    }
    const items = await eligibleById(prisma);
    const counts = await boardCounts(prisma);
    const still = items.filter((item) => item.eligible);
    if (still.length > 0) throw new Error(`still student-eligible: ${still.map((item) => item.id).join(", ")}`);
    const drop = expectedDrop(undo.studentEligibleBefore.items);
    assertDrop(undo.studentEligibleBefore.byField, counts, drop);
    console.log("VERIFY");
    console.log(`rows matched: ${live.length}`);
    console.log(`student-eligible among the 8: 0`);
    printCounts("before", undo.studentEligibleBefore.byField);
    printCounts("after", counts);
    for (const field of ["pance", "aanp-fnp"] as const) {
      const hidden = ITEMS.filter((item) => item.fieldId === field).map((item) => item.id);
      console.log(`${field} hidden: ${hidden.join(", ")} (drop ${drop[field]})`);
    }
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
  for (const item of beforeItems) {
    const expectedField = ITEMS.find((row) => row.id === item.id)?.fieldId;
    if (item.fieldId !== expectedField) throw new Error(`${item.id} eligibility field drifted`);
  }
  const drop = expectedDrop(beforeItems);
  const eligibleCount = beforeItems.filter((item) => item.eligible).length;

  let digest = "";
  if (!existsSync(UNDO_PATH)) {
    const payload: UndoFile = {
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Blind review 2026-10-25 confirmed wrong or dangerous keys. Full QuestionBankItem pre-image.",
      ids: ids(),
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
  console.log(`student-eligible before hide: ${eligibleCount}`);
  printCounts("before", beforeCounts);
  for (const field of ["pance", "aanp-fnp"] as const) {
    const hidden = beforeItems.filter((item) => item.fieldId === field && item.eligible).map((item) => item.id);
    console.log(`${field} will hide: ${hidden.join(", ") || "(none)"} (expected drop ${drop[field]})`);
  }
  if (digest) console.log(`undo sha256: ${digest}`);
  console.log("Question text, options, keys, and rationales would not change.");

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
      const txBeforeItems = await eligibleById(tx);
      const txBefore = await boardCounts(tx);
      for (const field of BOARD_FIELDS) {
        if (txBefore[field] !== beforeCounts[field]) {
          throw new Error(`${field} count changed before the update (${beforeCounts[field]} vs ${txBefore[field]})`);
        }
      }
      for (const item of txBeforeItems) {
        const earlier = beforeItems.find((row) => row.id === item.id);
        if (!earlier || earlier.eligible !== item.eligible) throw new Error(`${item.id} eligibility changed before the update`);
      }
      const updated = (await tx.$queryRawUnsafe(`
        WITH upd AS (
          UPDATE "QuestionBankItem"
          SET active = false,
              manual_correction = true,
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE id IN (${idListSql()})
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
      }
      const afterItems = await eligibleById(tx);
      const still = afterItems.filter((item) => item.eligible);
      if (still.length > 0) throw new Error(`still student-eligible: ${still.map((item) => item.id).join(", ")}`);
      const txAfter = await boardCounts(tx);
      assertDrop(txBefore, txAfter, drop);
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
    if (row.active !== false || row.manual_correction !== true) throw new Error(`${String(row.id)} did not stay hidden`);
  }
  const afterItems = await eligibleById(prisma);
  const still = afterItems.filter((item) => item.eligible);
  if (still.length > 0) throw new Error(`committed rows still student-eligible: ${still.map((item) => item.id).join(", ")}`);
  const afterCounts = await boardCounts(prisma);
  assertDrop(beforeCounts, afterCounts, drop);
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
