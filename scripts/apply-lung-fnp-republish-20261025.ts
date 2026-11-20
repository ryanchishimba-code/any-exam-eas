#!/usr/bin/env node
/**
 * Republish 55 verified PANCE pulmonary and AANP FNP pediatric rewrites.
 * Seven retire ids in retire.json stay hidden and are not updated.
 *
 * Dry run rolls back inside a transaction. --apply commits and writes undo.json
 * on first apply when the live rows still match the hidden pre-image.
 *
 *   npx tsx scripts/apply-lung-fnp-republish-20261025.ts
 *   npx tsx scripts/apply-lung-fnp-republish-20261025.ts --apply
 *   npx tsx scripts/apply-lung-fnp-republish-20261025.ts --verify
 *
 * Requires scripts/data/lung-fnp-republish-20261025/backup-original.json.
 * Undo: npx tsx scripts/restore-lung-fnp-republish-20261025.ts --apply
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import {
  BACKUP_PATH,
  DATA_DIR,
  EXPECTED,
  EXPECTED_PANCE_BEFORE,
  FNP_DELTA,
  PANCE_DELTA,
  UNDO_PATH,
  buildPlans,
  loadRetireIds,
  loadRewrites,
  publishIds,
  type RepublishPlan,
} from "./lung-fnp-republish-plan";

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

type Column = { column_name: string; udt_name: string };
type Sql = PrismaClient | Prisma.TransactionClient;

type UndoFile = {
  backedUpAt: string;
  table: "QuestionBankItem";
  reason: string;
  ids: string[];
  columnTypes: Record<string, string>;
  studentEligibleBefore: Record<string, number>;
  rows: Array<Record<string, unknown>>;
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

function assertOtherBoardsUnchanged(before: Record<string, number>, after: Record<string, number>): void {
  for (const field of BOARD_FIELDS) {
    if (field === "pance" || field === "aanp-fnp") continue;
    if (before[field] !== after[field]) {
      throw new Error(`${field} changed ${before[field]} -> ${after[field]}, expected no change`);
    }
  }
}

function assertRepublishCounts(
  before: Record<string, number>,
  after: Record<string, number>,
  label: string,
  phase: "before" | "after"
): void {
  if (phase === "before") {
    if (before.pance !== EXPECTED_PANCE_BEFORE) {
      throw new Error(`${label} pance is ${before.pance}, expected ${EXPECTED_PANCE_BEFORE}`);
    }
    return;
  }
  if (after.pance !== before.pance + PANCE_DELTA) {
    throw new Error(`${label} pance is ${after.pance}, expected ${before.pance + PANCE_DELTA} (+${PANCE_DELTA})`);
  }
  if (after["aanp-fnp"] !== before["aanp-fnp"] + FNP_DELTA) {
    throw new Error(
      `${label} aanp-fnp is ${after["aanp-fnp"]}, expected ${before["aanp-fnp"] + FNP_DELTA} (+${FNP_DELTA})`
    );
  }
  assertOtherBoardsUnchanged(before, after);
}

function assertHiddenRow(row: Record<string, unknown>): void {
  const id = String(row.id);
  if (row.active !== false) throw new Error(`${id} is not hidden`);
  if (row.manual_correction !== true) throw new Error(`${id} is not locked`);
  if (row.qaPassed !== true) throw new Error(`${id} is not qaPassed`);
}

function readUndo(): UndoFile {
  return JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoFile;
}

function writeUndo(payload: UndoFile): string {
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(UNDO_PATH)) throw new Error(`${UNDO_PATH} already exists`);
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(UNDO_PATH, body, { flag: "wx" });
  return createHash("sha256").update(body).digest("hex");
}

async function assertNoHashCollision(plans: RepublishPlan[]): Promise<void> {
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

function assertPlanMatchesRow(plan: RepublishPlan, row: Record<string, unknown>): void {
  if (row.correctAnswer !== plan.correctAnswer) throw new Error(`${plan.id} key text does not match`);
  if (row.explanation !== plan.explanation) throw new Error(`${plan.id} explanation does not match`);
  if (String(row.options) !== plan.optionsJson) throw new Error(`${plan.id} options do not match`);
  if (row.contentHash !== plan.contentHash) throw new Error(`${plan.id} content hash does not match`);
  if (row.active !== true || row.qaPassed !== true || row.manual_correction !== true) {
    throw new Error(`${plan.id} flags are not active, qaPassed, and manual_correction`);
  }
  const letter = plan.keyLetter;
  if (letter.includes("?")) throw new Error(`${plan.id} served key letter is invalid`);
}

async function updatePlan(tx: Sql, plan: RepublishPlan): Promise<void> {
  const updated = await tx.$executeRaw`
    UPDATE "QuestionBankItem"
    SET "subjectId" = ${plan.subjectId},
        scenario = ${plan.scenario},
        question = ${plan.question},
        options = ${plan.optionsJson},
        "correctAnswer" = ${plan.correctAnswer},
        explanation = ${plan.explanation},
        "solutionSteps" = ${plan.solutionSteps},
        tags = ${plan.tags},
        source = ${plan.source},
        "stateCode" = ${plan.stateCode},
        difficulty = ${plan.difficulty},
        "topicCategory" = ${plan.topicCategory},
        "blueprintDomain" = ${plan.blueprintDomain},
        "itemType" = ${plan.itemType},
        "references" = ${plan.referencesJson}::jsonb,
        "stepLevel" = ${plan.stepLevel},
        "qaPassed" = true,
        "qaAuditedAt" = ${plan.qaAuditedAt ? new Date(plan.qaAuditedAt) : null},
        "taskCategory" = ${plan.taskCategory},
        "blueprintTopic" = ${plan.blueprintTopic},
        "generationVersion" = ${plan.generationVersion},
        "reviewStatus" = ${plan.reviewStatus},
        "lastReviewedAt" = ${plan.lastReviewedAt ? new Date(plan.lastReviewedAt) : null},
        "generationMeta" = ${plan.generationMetaJson}::jsonb,
        "patientAgeGroup" = ${plan.patientAgeGroup},
        "clientNeeds" = ${plan.clientNeeds},
        "cjmmFunction" = ${plan.cjmmFunction},
        "contentHash" = ${plan.contentHash},
        active = true,
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

async function main() {
  const apply = process.argv.includes("--apply");
  const verify = process.argv.includes("--verify");
  if (apply && verify) throw new Error("pass only one of --apply or --verify");
  if (!existsSync(BACKUP_PATH)) throw new Error(`missing backup file ${BACKUP_PATH}`);

  const rewrites = loadRewrites();
  const publish = publishIds(rewrites);
  const retireIds = loadRetireIds();
  const backup = JSON.parse(readFileSync(BACKUP_PATH, "utf8")) as { ids: string[] };
  if (backup.ids.join(",") !== publish.join(",")) throw new Error("backup ids do not match rewrites.json");

  const cols = await columns();
  const live = await loadRows(prisma, cols, publish);
  const liveById = new Map(live.map((row) => [String(row.id), row]));
  const held = await loadRows(prisma, cols, retireIds);
  const heldById = new Map(held.map((row) => [String(row.id), row]));

  const plans = buildPlans(rewrites, liveById);

  if (verify) {
    for (const row of live) {
      if (row.active !== true || row.manual_correction !== true || row.qaPassed !== true) {
        throw new Error(`${String(row.id)} is not published with qaPassed and manual_correction`);
      }
    }
    const eligible = await eligibleIds(prisma, publish);
    const counts = await boardCounts(prisma);
    for (const plan of plans) {
      const row = liveById.get(plan.id)!;
      assertPlanMatchesRow(plan, row);
      if (!eligible.has(plan.id)) throw new Error(`${plan.id} is not student-eligible`);
    }
    for (const id of retireIds) {
      const row = heldById.get(id);
      if (!row || row.active !== false) throw new Error(`${id} retire row is not hidden`);
    }
    const undoBefore = existsSync(UNDO_PATH) ? readUndo().studentEligibleBefore : null;
    if (!undoBefore) throw new Error("verify needs undo.json with studentEligibleBefore");
    assertRepublishCounts(undoBefore, counts, "verified", "after");
    console.log("VERIFY");
    console.log(`rows matched: ${plans.length}`);
    console.log(`student-eligible: ${eligible.size}`);
    for (const plan of plans) console.log(`${plan.fieldId} ${plan.id} key=${plan.keyLetter}`);
    printCounts("after", counts);
    return;
  }

  for (const row of held) assertHiddenRow(row);
  for (const row of live) assertHiddenRow(row);
  await assertNoHashCollision(plans);
  const beforeCounts = await boardCounts(prisma);
  assertRepublishCounts(beforeCounts, beforeCounts, "before", "before");
  const beforeEligible = await eligibleIds(prisma, publish);
  if (beforeEligible.size !== 0) throw new Error(`${beforeEligible.size} republish rows are already student-eligible`);

  let digest = "";
  if (!existsSync(UNDO_PATH)) {
    digest = writeUndo({
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Pre-image before 55 PANCE/FNP rewrites were republished (2026-10-25).",
      ids: publish,
      columnTypes: Object.fromEntries(cols.map((column) => [column.column_name, column.udt_name])),
      studentEligibleBefore: beforeCounts,
      rows: live,
    });
  } else {
    const undo = readUndo();
    if (undo.ids.join(",") !== publish.join(",")) throw new Error("undo file ids do not match");
    const undoById = new Map(undo.rows.map((row) => [String(row.id), row]));
    for (const row of live) {
      const snapshot = undoById.get(String(row.id));
      if (!snapshot) throw new Error(`undo file is missing ${String(row.id)}`);
      if (
        snapshot.correctAnswer !== row.correctAnswer ||
        snapshot.contentHash !== row.contentHash ||
        snapshot.active !== false ||
        snapshot.manual_correction !== true
      ) {
        throw new Error(`${String(row.id)} no longer matches the undo snapshot`);
      }
    }
  }

  const heldFingerprints = new Map(
    held.map((row) => [
      String(row.id),
      `${row.contentHash}|${row.correctAnswer}|${row.active}|${row.manual_correction}`,
    ])
  );

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`rows matched: ${live.length}`);
  console.log(`pance: ${plans.filter((plan) => plan.fieldId === "pance").length}, fnp: ${plans.filter((plan) => plan.fieldId === "aanp-fnp").length}`);
  for (const plan of plans) {
    console.log(`${plan.fieldId} ${plan.id} key=${plan.keyLetter} hash=${plan.contentHash.slice(0, 12)}…`);
  }
  printCounts("before", beforeCounts);
  console.log(
    `expected after: pance ${beforeCounts.pance + PANCE_DELTA} (+${PANCE_DELTA}), aanp-fnp ${beforeCounts["aanp-fnp"] + FNP_DELTA} (+${FNP_DELTA})`
  );
  if (digest) console.log(`undo sha256: ${digest}`);

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
        await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '300s'`);
        const txBefore = await boardCounts(tx);
        assertRepublishCounts(txBefore, txBefore, "transaction before", "before");
        for (const plan of plans) {
          await updatePlan(tx, plan);
        }
        const afterRows = await loadRows(tx, cols, publish);
        const afterById = new Map(afterRows.map((row) => [String(row.id), row]));
        for (const plan of plans) {
          assertPlanMatchesRow(plan, afterById.get(plan.id)!);
        }
        const stillHeld = await loadRows(tx, cols, retireIds);
        for (const row of stillHeld) {
          const id = String(row.id);
          const fingerprint = `${row.contentHash}|${row.correctAnswer}|${row.active}|${row.manual_correction}`;
          if (fingerprint !== heldFingerprints.get(id)) {
            throw new Error(`${id} retire row changed during republish`);
          }
          if (row.active !== false) throw new Error(`${id} retire row is no longer hidden`);
        }
        const eligible = await eligibleIds(tx, publish);
        if (eligible.size !== publish.length) {
          const missing = publish.filter((id) => !eligible.has(id));
          throw new Error(`not student-eligible after republish: ${missing.join(", ")}`);
        }
        const txAfter = await boardCounts(tx);
        assertRepublishCounts(txBefore, txAfter, "transaction after", "after");
        console.log(`updated rows: ${publish.length}`);
        printCounts("after", txAfter);
        if (!apply) throw new DryRunRollback();
      },
      { timeout: 300_000 }
    );
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const after = await loadRows(prisma, cols, publish);
      for (const row of after) {
        const before = liveById.get(String(row.id));
        if (!before || before.correctAnswer !== row.correctAnswer || before.active !== row.active) {
          throw new Error("dry run changed a row");
        }
      }
      const counts = await boardCounts(prisma);
      assertRepublishCounts(beforeCounts, counts, "after rollback", "before");
      console.log("Rolled back. Rows are still hidden.");
      return;
    }
    throw error;
  }

  const eligible = await eligibleIds(prisma, publish);
  if (eligible.size !== publish.length) throw new Error("committed rows are not all student-eligible");
  const afterCounts = await boardCounts(prisma);
  assertRepublishCounts(beforeCounts, afterCounts, "committed", "after");
  for (const id of retireIds) {
    const row = (await loadRows(prisma, cols, [id]))[0];
    if (row?.active !== false) throw new Error(`${id} retire row is no longer hidden`);
  }
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
