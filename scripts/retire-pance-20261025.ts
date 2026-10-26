#!/usr/bin/env node
/**
 * Retire approved PANCE rows from the 2026-10-25 audit.
 *
 * The id file is the retire action only. Seed #4 (cmqgdhw0r00051yr8ap2l03oh)
 * and seed #41 (cmqgdi0qp001h1yr8tipvhp6v) are rewrites and are not in it.
 * This script sets active=false and manual_correction=true on each retire id
 * that is exactly one served PANCE row. It does not delete rows and it does
 * not change stems, options, keys, or rationales.
 *
 * A served row has fieldId pance, active, qaPassed, and passes
 * studentEligibleAndSql().
 *
 *   npx tsx scripts/retire-pance-20261025.ts
 *   npx tsx scripts/retire-pance-20261025.ts --backup
 *   npx tsx scripts/retire-pance-20261025.ts --dry-run
 *   npx tsx scripts/retire-pance-20261025.ts --apply
 *
 * --backup copies every column into qbi_pance_retire_20261025_backup and
 * scripts/data/pance-retire-20261025/backup.csv. --dry-run updates inside a
 * transaction and rolls it back. --apply commits that same update.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import { KEYFIX_BACKUP_TABLES } from "../src/lib/sync-question-bank-guard";
import {
  PANCE_RETIRE_BACKUP,
  PANCE_RETIRE_CSV,
  PANCE_RETIRE_IDS,
  PANCE_REWRITE_IDS,
  assertProductionHost,
  assertRetireId,
  csvEscape,
  parseCsv,
  quoteIdent,
  redact,
  rowTextMd5,
} from "./pance-retire-20261025-lib";

const SERVED_MIN = 3500;
const SERVED_MAX = 4200;
const MIN_TARGETS = 2600;
const DATA_DIR = path.join(process.cwd(), "scripts/data/pance-retire-20261025");
const CSV_PATH = path.join(process.cwd(), PANCE_RETIRE_CSV);

const prisma = new PrismaClient();

class DryRunRollback extends Error {
  readonly updated: number;
  readonly projectedServed: number;

  constructor(updated: number, projectedServed: number) {
    super("dry-run rollback");
    this.name = "DryRunRollback";
    this.updated = updated;
    this.projectedServed = projectedServed;
  }
}

type Mode = "resolve" | "backup" | "dry-run" | "apply";

type FoundRow = {
  id: string;
  field_id: string;
  active: boolean;
  qa_passed: boolean;
  manual_correction: boolean;
  item_type: string;
  served: boolean;
};

type Skip = { id: string; reason: string };

type Resolution = {
  targets: string[];
  skips: Skip[];
  itemTypes: Map<string, number>;
};

function modeOf(argv: string[]): Mode {
  const flags = argv.filter((arg) => arg.startsWith("--"));
  const known = new Set(["--backup", "--dry-run", "--apply", "--resolve"]);
  for (const flag of flags) {
    if (!known.has(flag)) throw new Error(`unknown argument ${flag}`);
  }
  const chosen = flags.filter((flag) => flag !== "--resolve");
  if (chosen.length > 1) throw new Error("pass only one of --backup, --dry-run, --apply");
  if (chosen[0] === "--backup") return "backup";
  if (chosen[0] === "--dry-run") return "dry-run";
  if (chosen[0] === "--apply") return "apply";
  return "resolve";
}

function loadRetireIds(): string[] {
  const ids = JSON.parse(readFileSync(path.join(process.cwd(), PANCE_RETIRE_IDS), "utf8")) as unknown;
  if (!Array.isArray(ids) || ids.length !== 2672) throw new Error("retire id file must contain 2672 ids");
  const rewrite = new Set<string>(PANCE_REWRITE_IDS);
  for (const id of ids) {
    if (typeof id !== "string") throw new Error("retire id file has a non-string id");
    assertRetireId(id);
    if (rewrite.has(id)) throw new Error(`rewrite id is in the retire file: ${id}`);
  }
  if (new Set(ids).size !== ids.length) throw new Error("retire id file has duplicates");
  return ids as string[];
}

function idList(ids: readonly string[]): string {
  return ids.map((id) => `'${id}'`).join(", ");
}

function servedCountSql(): string {
  return `
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE "fieldId" = 'pance'
      AND active = true
      AND "qaPassed" = true
      ${studentEligibleAndSql()}
  `;
}

async function countServed(db: Pick<PrismaClient, "$queryRawUnsafe"> = prisma): Promise<number> {
  const rows = (await db.$queryRawUnsafe(servedCountSql())) as Array<{ n: number }>;
  return Number(rows[0]?.n ?? 0);
}

async function loadColumns(): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
     ORDER BY ordinal_position`
  )) as Array<{ column_name: string }>;
  const names = rows.map((row) => row.column_name);
  for (const required of ["id", "active", "manual_correction", "contentHash", "fieldId", "qaPassed"]) {
    if (!names.includes(required)) throw new Error(`QuestionBankItem is missing ${required}`);
  }
  return names;
}

function skipReason(row: FoundRow): string {
  const parts: string[] = [];
  if (row.field_id !== "pance") parts.push(`fieldId is ${row.field_id}`);
  if (row.active !== true) parts.push("active is false");
  if (row.qa_passed !== true) parts.push("qaPassed is false");
  if (parts.length === 0) parts.push("fails the student-eligibility rule");
  return parts.join("; ");
}

async function resolveIds(ids: readonly string[]): Promise<Resolution> {
  const found = (await prisma.$queryRawUnsafe(`
    SELECT
      id,
      "fieldId" AS field_id,
      active,
      "qaPassed" AS qa_passed,
      manual_correction,
      COALESCE("itemType", '') AS item_type,
      (
        "fieldId" = 'pance'
        AND active = true
        AND "qaPassed" = true
        ${studentEligibleAndSql()}
      ) AS served
    FROM "QuestionBankItem"
    WHERE id IN (${idList(ids)})
  `)) as FoundRow[];
  const byId = new Map<string, FoundRow[]>();
  for (const row of found) {
    const list = byId.get(row.id) ?? [];
    list.push(row);
    byId.set(row.id, list);
  }
  const targets: string[] = [];
  const skips: Skip[] = [];
  const itemTypes = new Map<string, number>();
  for (const id of ids) {
    const matches = byId.get(id) ?? [];
    if (matches.length === 0) {
      skips.push({ id, reason: "no QuestionBankItem row" });
      continue;
    }
    if (matches.length > 1) {
      skips.push({ id, reason: `matched ${matches.length} rows` });
      continue;
    }
    const row = matches[0]!;
    if (!row.served) {
      skips.push({ id, reason: skipReason(row) });
      continue;
    }
    targets.push(id);
    itemTypes.set(row.item_type, (itemTypes.get(row.item_type) ?? 0) + 1);
  }
  return { targets, skips, itemTypes };
}

function assertWritable(served: number, resolution: Resolution): void {
  if (!(KEYFIX_BACKUP_TABLES as readonly string[]).includes(PANCE_RETIRE_BACKUP)) {
    throw new Error(`${PANCE_RETIRE_BACKUP} is missing from KEYFIX_BACKUP_TABLES`);
  }
  if (served < SERVED_MIN || served > SERVED_MAX) {
    throw new Error(`served count ${served} is outside ${SERVED_MIN}..${SERVED_MAX}; no write`);
  }
  if (resolution.targets.length < MIN_TARGETS) {
    throw new Error(`only ${resolution.targets.length} retire ids resolved to a served row; no write`);
  }
  const rewrite = new Set<string>(PANCE_REWRITE_IDS);
  for (const id of resolution.targets) {
    if (rewrite.has(id)) throw new Error(`refusing to retire rewrite id ${id}`);
  }
}

async function backupExists(): Promise<boolean> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${PANCE_RETIRE_BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  return Boolean(rows[0]?.reg);
}

async function backupIds(): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT id FROM ${PANCE_RETIRE_BACKUP} ORDER BY id`
  )) as Array<{ id: string }>;
  return rows.map((row) => row.id);
}

function sameSet(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const have = new Set(right);
  return left.every((id) => have.has(id));
}

async function columnDiffs(columns: readonly string[]): Promise<Array<{ column: string; n: number }>> {
  const selects = columns
    .map(
      (column, index) =>
        `COUNT(*) FILTER (WHERE q.${quoteIdent(column)} IS DISTINCT FROM b.${quoteIdent(column)})::int AS d${index}`
    )
    .join(", ");
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT ${selects}
     FROM "QuestionBankItem" q
     JOIN ${PANCE_RETIRE_BACKUP} b ON q.id = b.id`
  )) as Array<Record<string, number>>;
  const row = rows[0] ?? {};
  return columns
    .map((column, index) => ({ column, n: Number(row[`d${index}`] ?? 0) }))
    .filter((entry) => entry.n > 0);
}

async function totals(): Promise<{ allRows: number; panceRows: number; panceActive: number }> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM "QuestionBankItem") AS all_rows,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'pance') AS pance_rows,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'pance' AND active = true) AS pance_active
  `)) as Array<{ all_rows: number; pance_rows: number; pance_active: number }>;
  const row = rows[0];
  return {
    allRows: Number(row?.all_rows ?? 0),
    panceRows: Number(row?.pance_rows ?? 0),
    panceActive: Number(row?.pance_active ?? 0),
  };
}

async function rewriteFingerprint(): Promise<string> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT md5(string_agg(
      id || '|' || active::text || '|' || manual_correction::text || '|' || "qaPassed"::text
        || '|' || "contentHash" || '|' || md5(question) || '|' || md5("correctAnswer")
        || '|' || md5(explanation) || '|' || md5(options) || '|' || "updatedAt"::text,
      ',' ORDER BY id
    )) AS fingerprint,
    COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE id IN (${idList(PANCE_REWRITE_IDS)})
  `)) as Array<{ fingerprint: string | null; n: number }>;
  return `${rows[0]?.n ?? 0}:${rows[0]?.fingerprint ?? "none"}`;
}

function printResolution(served: number, resolution: Resolution, host: string): void {
  const grouped = new Map<string, string[]>();
  for (const skip of resolution.skips) {
    const list = grouped.get(skip.reason) ?? [];
    list.push(skip.id);
    grouped.set(skip.reason, list);
  }
  console.log(`database host: ${host}`);
  console.log(`served before: ${served}`);
  console.log(`retire ids: 2672`);
  console.log(`resolved to one served row: ${resolution.targets.length}`);
  console.log(`retire ids skipped: ${resolution.skips.length}`);
  for (const [reason, ids] of grouped) {
    const sample = ids.slice(0, 15).join(", ");
    console.log(`  ${ids.length} ${reason}${ids.length > 15 ? ` (${sample}, ...)` : `: ${sample}`}`);
  }
  console.log(
    "rewrite rows skipped: 2 (seed #4 cmqgdhw0r00051yr8ap2l03oh, seed #41 cmqgdi0qp001h1yr8tipvhp6v) — action is rewrite"
  );
  const types = [...resolution.itemTypes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([itemType, count]) => `${itemType || "(blank)"} ${count}`)
    .join(", ");
  console.log(`resolved item types: ${types || "(none)"}`);
}

async function createBackup(targets: readonly string[], columns: readonly string[]): Promise<void> {
  const colSql = columns.map(quoteIdent).join(", ");
  if (await backupExists()) {
    const existing = await backupIds();
    if (!sameSet(existing, targets)) {
      throw new Error(`${PANCE_RETIRE_BACKUP} exists and its ids do not match the resolved retire set`);
    }
    console.log(`backup table already has the ${existing.length} resolved ids`);
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
    await tx.$executeRawUnsafe(
      `CREATE TABLE ${PANCE_RETIRE_BACKUP} (LIKE "QuestionBankItem" INCLUDING ALL)`
    );
    const inserted = (await tx.$queryRawUnsafe(`
      WITH ins AS (
        INSERT INTO ${PANCE_RETIRE_BACKUP} (${colSql})
        SELECT ${colSql}
        FROM "QuestionBankItem"
        WHERE id IN (${idList(targets)})
        RETURNING id
      )
      SELECT COUNT(*)::int AS n FROM ins
    `)) as Array<{ n: number }>;
    if (Number(inserted[0]?.n) !== targets.length) {
      throw new Error(`backup inserted ${inserted[0]?.n} rows, expected ${targets.length}`);
    }
  }, { timeout: 180_000, maxWait: 20_000 });
  console.log(`committed ${PANCE_RETIRE_BACKUP}: ${targets.length} rows`);
}

async function writeBackupCsv(columns: readonly string[]): Promise<void> {
  const selectList = columns
    .map((column) => `${quoteIdent(column)}::text AS ${quoteIdent(column)}`)
    .join(", ");
  const packed = columns
    .map((column) => `COALESCE(${quoteIdent(column)}::text, CHR(92) || 'N')`)
    .join(` || CHR(31) || `);
  const hashes = (await prisma.$queryRawUnsafe(`
    SELECT id, md5(${packed}) AS row_md5
    FROM ${PANCE_RETIRE_BACKUP}
    ORDER BY id
  `)) as Array<{ id: string; row_md5: string }>;
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT ${selectList}
    FROM ${PANCE_RETIRE_BACKUP}
    ORDER BY id
  `)) as Array<Record<string, string | null>>;
  if (rows.length !== hashes.length) throw new Error("backup text export row count mismatch");
  const lines = [columns.map(csvEscape).join(",")];
  for (let index = 0; index < rows.length; index += 1) {
    const record = rows[index]!;
    const values = columns.map((column) => {
      if (!Object.prototype.hasOwnProperty.call(record, column)) {
        throw new Error(`export row is missing ${column}`);
      }
      const value = record[column];
      if (value !== null && typeof value !== "string") {
        throw new Error(`export column ${column} was not text`);
      }
      return value;
    });
    if (rowTextMd5(values) !== hashes[index]?.row_md5) {
      throw new Error(`csv checksum mismatch for ${hashes[index]?.id}`);
    }
    lines.push(values.map(csvEscape).join(","));
  }
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(CSV_PATH, `${lines.join("\n")}\n`);
  const parsed = parseCsv(readFileSync(CSV_PATH, "utf8"));
  const header = parsed[0];
  const body = parsed.slice(1);
  if (!header || header.some((name, index) => name !== columns[index])) {
    throw new Error("reread backup csv header does not match QuestionBankItem columns");
  }
  if (body.length !== hashes.length) throw new Error("reread backup csv row count mismatch");
  for (let index = 0; index < body.length; index += 1) {
    const values = body[index]!;
    if (values.length !== columns.length) throw new Error(`csv row ${index + 1} has ${values.length} columns`);
    if (rowTextMd5(values) !== hashes[index]?.row_md5) {
      throw new Error(`reread csv checksum mismatch for ${hashes[index]?.id}`);
    }
  }
  console.log(`wrote ${PANCE_RETIRE_CSV}: ${body.length} rows, ${columns.length} columns`);
}

async function mutate(
  targets: readonly string[],
  apply: boolean
): Promise<{ updated: number; projectedServed: number }> {
  let updated = 0;
  let projectedServed = 0;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
      const locked = (await tx.$queryRawUnsafe(
        `SELECT id FROM "QuestionBankItem" WHERE id IN (${idList(targets)}) FOR UPDATE`
      )) as Array<{ id: string }>;
      if (locked.length !== targets.length) {
        throw new Error(`locked ${locked.length} rows, expected ${targets.length}`);
      }
      const returned = (await tx.$queryRawUnsafe(`
        UPDATE "QuestionBankItem"
        SET active = false,
            manual_correction = true
        WHERE id IN (${idList(targets)})
          AND "fieldId" = 'pance'
          AND active = true
          AND "qaPassed" = true
          AND id NOT IN (${idList(PANCE_REWRITE_IDS)})
          ${studentEligibleAndSql()}
        RETURNING id
      `)) as Array<{ id: string }>;
      updated = returned.length;
      if (!sameSet(returned.map((row) => row.id), targets)) {
        throw new Error(`update returned ${updated} ids that do not match the resolved set`);
      }
      projectedServed = await countServed(tx);
      console.log(`in-transaction rows updated: ${updated}`);
      console.log(`in-transaction projected served: ${projectedServed}`);
      if (!apply) throw new DryRunRollback(updated, projectedServed);
    }, { timeout: 180_000, maxWait: 20_000 });
  } catch (error) {
    const dryRun = findDryRun(error);
    if (dryRun) {
      return {
        updated: typeof dryRun.updated === "number" ? dryRun.updated : updated,
        projectedServed: typeof dryRun.projectedServed === "number" ? dryRun.projectedServed : projectedServed,
      };
    }
    throw error;
  }
  return { updated, projectedServed };
}

function findDryRun(error: unknown): DryRunRollback | null {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    if (current instanceof DryRunRollback) return current;
    if (current instanceof Error && current.name === "DryRunRollback") return current as DryRunRollback;
    current = "cause" in current ? (current as { cause?: unknown }).cause : undefined;
  }
  return null;
}

function isDryRun(error: unknown): boolean {
  return findDryRun(error) !== null;
}

async function retiredState(targets: readonly string[]): Promise<{
  present: number;
  inactive: number;
  locked: number;
}> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT
      COUNT(*)::int AS present,
      COUNT(*) FILTER (WHERE active = false)::int AS inactive,
      COUNT(*) FILTER (WHERE manual_correction = true)::int AS locked
    FROM "QuestionBankItem"
    WHERE id IN (${idList(targets)})
  `)) as Array<{ present: number; inactive: number; locked: number }>;
  const row = rows[0];
  return {
    present: Number(row?.present ?? 0),
    inactive: Number(row?.inactive ?? 0),
    locked: Number(row?.locked ?? 0),
  };
}

async function main() {
  const mode = modeOf(process.argv.slice(2));
  const host = assertProductionHost();
  const ids = loadRetireIds();
  const columns = await loadColumns();
  const resolution = await resolveIds(ids);
  const served = await countServed();
  console.log(mode === "apply" ? "APPLY" : mode === "dry-run" ? "DRY RUN" : mode === "backup" ? "BACKUP" : "RESOLVE");
  printResolution(served, resolution, host);
  if (mode === "resolve") {
    console.log("No row written.");
    return;
  }
  assertWritable(served, resolution);
  const beforeTotals = await totals();
  const beforeRewrite = await rewriteFingerprint();
  if (mode === "backup") {
    await createBackup(resolution.targets, columns);
    await writeBackupCsv(columns);
    const afterServed = await countServed();
    if (afterServed !== served) throw new Error("backup changed the served count");
    console.log("Backup committed. Question rows were not updated.");
    return;
  }
  if (!(await backupExists())) throw new Error(`${PANCE_RETIRE_BACKUP} does not exist. Run --backup first.`);
  const stored = await backupIds();
  if (!sameSet(stored, resolution.targets)) {
    throw new Error("backup ids do not match the rows that still resolve as served");
  }
  const beforeDiffs = await columnDiffs(columns);
  if (beforeDiffs.length > 0) {
    throw new Error(
      `live rows already differ from the backup: ${beforeDiffs.map((entry) => `${entry.column} ${entry.n}`).join(", ")}`
    );
  }
  let outcome: { updated: number; projectedServed: number };
  try {
    outcome = await mutate(resolution.targets, mode === "apply");
  } catch (error) {
    if (!isDryRun(error)) throw error;
    outcome = { updated: resolution.targets.length, projectedServed: -1 };
  }
  console.log(`rows updated: ${outcome.updated}`);
  console.log(`projected served: ${outcome.projectedServed}`);
  if (mode === "dry-run") {
    const afterServed = await countServed();
    const afterDiffs = await columnDiffs(columns);
    const afterTotals = await totals();
    const afterRewrite = await rewriteFingerprint();
    const state = await retiredState(resolution.targets);
    if (afterServed !== served) throw new Error(`rollback served ${afterServed}, before was ${served}`);
    if (afterDiffs.length > 0) {
      throw new Error(`rollback left column diffs: ${afterDiffs.map((entry) => entry.column).join(", ")}`);
    }
    if (
      afterTotals.allRows !== beforeTotals.allRows ||
      afterTotals.panceRows !== beforeTotals.panceRows ||
      afterTotals.panceActive !== beforeTotals.panceActive
    ) {
      throw new Error("rollback changed a row count");
    }
    if (afterRewrite !== beforeRewrite) throw new Error("rollback changed a rewrite row");
    if (state.present !== resolution.targets.length) throw new Error("rollback lost a row");
    if (!(await backupExists())) throw new Error("rollback dropped the backup table");
    console.log(`served after rollback: ${afterServed}`);
    console.log("Rolled back. Served count, row text, and rewrite rows match the pre-update snapshot.");
    return;
  }
  const afterServed = await countServed();
  const afterDiffs = await columnDiffs(columns);
  const afterTotals = await totals();
  const afterRewrite = await rewriteFingerprint();
  const state = await retiredState(resolution.targets);
  const unexpected = afterDiffs.filter(
    (entry) => entry.column !== "active" && entry.column !== "manual_correction"
  );
  if (outcome.updated !== resolution.targets.length) {
    throw new Error(`committed update count ${outcome.updated} did not match ${resolution.targets.length}`);
  }
  if (afterServed !== outcome.projectedServed) {
    throw new Error(`served after commit is ${afterServed}, projected ${outcome.projectedServed}`);
  }
  if (unexpected.length > 0) {
    throw new Error(`unexpected column changes: ${unexpected.map((entry) => entry.column).join(", ")}`);
  }
  if (state.present !== resolution.targets.length || state.inactive !== resolution.targets.length) {
    throw new Error(`present ${state.present}, inactive ${state.inactive}, expected ${resolution.targets.length}`);
  }
  if (state.locked !== resolution.targets.length) {
    throw new Error(`manual_correction is true on ${state.locked} of ${resolution.targets.length} rows`);
  }
  if (afterTotals.allRows !== beforeTotals.allRows || afterTotals.panceRows !== beforeTotals.panceRows) {
    throw new Error("a row count changed");
  }
  if (afterTotals.panceActive !== beforeTotals.panceActive - resolution.targets.length) {
    throw new Error(
      `pance active ${afterTotals.panceActive}, expected ${beforeTotals.panceActive - resolution.targets.length}`
    );
  }
  if (afterRewrite !== beforeRewrite) throw new Error("a rewrite row changed");
  console.log(`served after: ${afterServed}`);
  console.log(`rows set inactive: ${state.inactive}`);
  console.log(`rows still present: ${state.present}`);
  console.log(`manual_correction true: ${state.locked}`);
  console.log(`pance rows: ${afterTotals.panceRows} (unchanged)`);
  console.log(`all question rows: ${afterTotals.allRows} (unchanged)`);
  console.log("Committed. Rewrite rows were not updated.");
}

main()
  .catch((error) => {
    console.error(redact(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
