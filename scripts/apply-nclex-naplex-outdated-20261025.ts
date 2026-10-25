#!/usr/bin/env node
/**
 * Citation swaps and hides for the 2026-10-25 NCLEX/NAPLEX safety findings.
 *
 * WRONG KEY and OUTDATED only. AMBIGUOUS rows are not read into either update.
 *
 * Citation rows keep their stems, options, keys, and explanations. A JNC 8
 * reference is replaced with the 2025 AHA/ACC hypertension guideline. The two
 * COPD StatPearls references are removed; the GOLD 2026 reference stays.
 * manual_correction is set so seed sync cannot restore the old citation.
 *
 * Items whose teaching contradicts the new source are hidden instead
 * (active = false, manual_correction = true). Their rewrites are files only
 * and are not written to QuestionBankItem.
 *
 *   npx tsx scripts/apply-nclex-naplex-outdated-20261025.ts
 *   npx tsx scripts/apply-nclex-naplex-outdated-20261025.ts --apply
 *   npx tsx scripts/apply-nclex-naplex-outdated-20261025.ts --verify
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";

const DATA_DIR = path.join(process.cwd(), "scripts/data/nclex-naplex-outdated-20261025");
const FINDINGS_PATH = path.join(DATA_DIR, "findings.json");
const CITE_UNDO_PATH = path.join(DATA_DIR, "undo-citation.json");
const HIDE_UNDO_PATH = path.join(DATA_DIR, "undo-hide.json");
const AHA_URL = "https://www.ahajournals.org/doi/10.1161/HYP.0000000000000249";
const AHA_LABEL = "2025 AHA/ACC High Blood Pressure Guideline";
const GOLD_URL = "https://goldcopd.org/2026-gold-report/";

/**
 * Moved out of the citation swap because the stored teaching does not match
 * the source that would replace the old citation.
 */
const HIDE_IDS = [
  "cmr815qlj00161ynm2bog3q9j",
  "cmrovw8ya000m1yu3299ty2aj",
  "cmroigcz3000j1y7n1rmsnzr4",
  "cmsfy8gct001h1yth5rdikpww",
  "cmqvkwppi001m1y5yg7grxxi4",
  "cmr31diqh0097js047dx13msm",
  "cmr7zccnn000n1y1wdgqlj70o",
  "cmr7zzhz2000m1yafsbg3xkeh",
  "cmqxaus7p001f1ypr2elqbs2e",
  "cmr0mlg1o001d1y34lanynyn7",
  "cmr7tqqg2001n1yivy4gi52qz",
  "cmr7ugujq001n1yt3ee4zaua9",
  "cmr7xthmz001n1yikcwuott43",
  "cmqw33qs5001c1yawc9sc5grf",
  "cmqwnb0il000b1ynh10vm3wha",
] as const;

const GOLD_CITE_IDS = ["cmr8pmbmc00051yvfgxv5bhhh", "cmr8r0tu800201ye3wun9yrxi"] as const;

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
  pance: 3755,
  "aanp-fnp": 5279,
  "npte-pt": 1748,
};

const EXPECTED_PHARMACY_HIDES = 14;
const EXPECTED_NURSING_HIDES = 1;

type Finding = { id: string; board: string; cls: string; why: string; url: string };
type Column = { column_name: string; udt_name: string };
type Sql = PrismaClient | Prisma.TransactionClient;

const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

function loadPartition(): { citeIds: string[]; hideIds: string[] } {
  const parsed = JSON.parse(readFileSync(FINDINGS_PATH, "utf8")) as Finding[];
  if (!Array.isArray(parsed)) throw new Error("findings.json is not an array");
  const counts: Record<string, number> = {};
  const work: Finding[] = [];
  for (const row of parsed) {
    counts[row.cls] = (counts[row.cls] ?? 0) + 1;
    if (row.cls === "AMBIGUOUS") continue;
    if (row.cls !== "WRONG KEY" && row.cls !== "OUTDATED") {
      throw new Error(`unexpected class ${row.cls}`);
    }
    if (!/^[a-z0-9]+$/.test(row.id)) throw new Error(`unexpected id ${row.id}`);
    work.push(row);
  }
  console.log(`findings classes: ${Object.entries(counts).map(([name, n]) => `${name} ${n}`).join(", ")}`);
  if (work.length !== 67 || counts["WRONG KEY"] !== 1 || counts.OUTDATED !== 66 || counts.AMBIGUOUS !== 20) {
    throw new Error(`expected 67 WRONG KEY/OUTDATED and 20 AMBIGUOUS, found ${work.length}. No undo file and no update.`);
  }
  const hide = new Set<string>(HIDE_IDS);
  const gold = new Set<string>(GOLD_CITE_IDS);
  if (hide.size !== HIDE_IDS.length) throw new Error("duplicate hide id");
  const citeIds = work.map((row) => row.id).filter((id) => !hide.has(id));
  const workIds = new Set(work.map((row) => row.id));
  const missingHide = HIDE_IDS.filter((id) => !workIds.has(id));
  const overlap = GOLD_CITE_IDS.filter((id) => hide.has(id) || !workIds.has(id));
  if (missingHide.length || overlap.length || citeIds.length + hide.size !== 67) {
    throw new Error("citation and hide sets do not partition the 67 findings. No undo file and no update.");
  }
  if (!GOLD_CITE_IDS.every((id) => citeIds.includes(id))) throw new Error("GOLD citation ids missing");
  return { citeIds, hideIds: [...HIDE_IDS] };
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

function sqlList(ids: string[]): string {
  return ids.map((id) => `'${id}'`).join(", ");
}

function parseRefs(value: unknown): Array<Record<string, unknown>> {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) throw new Error("references are not an array");
  return parsed as Array<Record<string, unknown>>;
}

function swapJnc(refs: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  let swapped = 0;
  const next = refs.map((ref) => {
    if (!/jnc/i.test(String(ref.label ?? ""))) return ref;
    swapped += 1;
    return { label: AHA_LABEL, url: AHA_URL };
  });
  if (swapped !== 1) throw new Error(`expected one JNC reference, found ${swapped}`);
  if (next.some((ref) => /jnc|statpearls/i.test(JSON.stringify(ref)))) throw new Error("old citation remains");
  return next;
}

function dropStatPearls(refs: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const next = refs.filter((ref) => !/statpearls/i.test(JSON.stringify(ref)));
  if (next.length !== refs.length - 1) throw new Error("expected exactly one StatPearls reference");
  if (!next.some((ref) => JSON.stringify(ref).includes(GOLD_URL))) throw new Error("GOLD 2026 reference missing");
  if (next.some((ref) => /statpearls|jnc/i.test(JSON.stringify(ref)))) throw new Error("old citation remains");
  return next;
}

async function columns(): Promise<Column[]> {
  const found = (await prisma.$queryRawUnsafe(`
    SELECT column_name, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Column[];
  for (const name of ["id", "fieldId", "active", "qaPassed", "manual_correction", "correctAnswer", "question", "references", "contentHash"]) {
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
  const rows = (await client.$queryRawUnsafe(
    `SELECT ${selectList(cols)} FROM "QuestionBankItem" WHERE id IN (${sqlList(ids)})`
  )) as Array<Record<string, unknown>>;
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  const missing = ids.filter((id) => !byId.has(id));
  if (missing.length > 0) throw new Error(`not a live row: ${missing.join(", ")}. No undo file and no update.`);
  return ids.map((id) =>
    Object.fromEntries(cols.map((column) => [column.column_name, jsonValue(byId.get(id)![column.column_name])]))
  );
}

async function eligibleById(client: Sql, ids: string[]): Promise<Array<{ id: string; fieldId: string; eligible: boolean }>> {
  const rows = (await client.$queryRawUnsafe(`
    SELECT id, "fieldId" AS field_id,
      (active = true AND "qaPassed" = true ${studentEligibleAndSql()}) AS eligible
    FROM "QuestionBankItem"
    WHERE id IN (${sqlList(ids)})
  `)) as Array<{ id: string; field_id: string; eligible: boolean }>;
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids.map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`missing eligibility row ${id}`);
    return { id, fieldId: row.field_id, eligible: row.eligible === true };
  });
}

async function boardCounts(client: Sql): Promise<Record<string, number>> {
  const rows = (await client.$queryRawUnsafe(`
    SELECT "fieldId" AS field_id, COUNT(*)::int AS n
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true
      AND "fieldId" IN (${BOARD_FIELDS.map((field) => `'${field}'`).join(", ")})
      AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
      ${studentEligibleAndSql()}
    GROUP BY "fieldId"
  `)) as Array<{ field_id: string; n: unknown }>;
  const counts: Record<string, number> = {};
  for (const field of BOARD_FIELDS) counts[field] = 0;
  for (const row of rows) counts[row.field_id] = asInt(row.n);
  return counts;
}

function printCounts(label: string, counts: Record<string, number>): void {
  console.log(`${label}: ${BOARD_FIELDS.map((field) => `${field} ${counts[field]}`).join(", ")}`);
}

function sameStem(live: Record<string, unknown>, snapshot: Record<string, unknown>): boolean {
  return (
    live.question === snapshot.question &&
    live.options === snapshot.options &&
    live.correctAnswer === snapshot.correctAnswer &&
    live.explanation === snapshot.explanation &&
    live.scenario === snapshot.scenario &&
    live.contentHash === snapshot.contentHash
  );
}

function writeUndo(filePath: string, payload: unknown): string {
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(filePath)) throw new Error(`${filePath} already exists`);
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(filePath, body, { flag: "wx" });
  return createHash("sha256").update(body).digest("hex");
}

async function main() {
  const apply = process.argv.includes("--apply");
  const verify = process.argv.includes("--verify");
  if (apply && verify) throw new Error("pass only one of --apply or --verify");
  const { citeIds, hideIds } = loadPartition();
  const cols = await columns();
  const citeRows = await loadRows(prisma, cols, citeIds);
  const hideRows = await loadRows(prisma, cols, hideIds);
  const gold = new Set<string>(GOLD_CITE_IDS);

  const citePlan = citeRows.map((row) => {
    const id = String(row.id);
    if (gold.has(id) && row.fieldId !== "nursing") throw new Error(`${id} is not a live NCLEX row`);
    if (!gold.has(id) && row.fieldId !== "pharmacy") throw new Error(`${id} is not a live NAPLEX row`);
    if (verify) return { id, nextRefs: parseRefs(row.references) };
    if (row.active !== true || row.qaPassed !== true) throw new Error(`${id} is not a live active row`);
    const nextRefs = gold.has(id) ? dropStatPearls(parseRefs(row.references)) : swapJnc(parseRefs(row.references));
    return { id, nextRefs };
  });

  for (const row of hideRows) {
    const id = String(row.id);
    const expectedField = id === "cmqwnb0il000b1ynh10vm3wha" ? "nursing" : "pharmacy";
    if (row.fieldId !== expectedField) throw new Error(`${id} is on ${String(row.fieldId)}, not ${expectedField}`);
    if (!verify && (row.active !== true || row.qaPassed !== true)) {
      throw new Error(`${id} is not a live active row. No undo file and no update.`);
    }
  }

  if (verify) {
    for (const plan of citePlan) {
      const row = citeRows.find((item) => item.id === plan.id)!;
      const refs = JSON.stringify(parseRefs(row.references));
      if (/jnc|statpearls/i.test(refs)) throw new Error(`${plan.id} still has the old citation`);
      if (gold.has(plan.id) && !refs.includes(GOLD_URL)) throw new Error(`${plan.id} lost GOLD 2026`);
      if (!gold.has(plan.id) && !refs.includes(AHA_URL)) throw new Error(`${plan.id} lost the 2025 guideline`);
      if (row.active !== true || row.manual_correction !== true) throw new Error(`${plan.id} citation lock missing`);
    }
    for (const row of hideRows) {
      if (row.active !== false || row.manual_correction !== true) throw new Error(`${String(row.id)} is not hidden`);
    }
    const still = (await eligibleById(prisma, hideIds)).filter((item) => item.eligible);
    if (still.length) throw new Error(`still student-eligible: ${still.map((item) => item.id).join(", ")}`);
    const counts = await boardCounts(prisma);
    if (counts.pharmacy !== EXPECTED_BEFORE.pharmacy - EXPECTED_PHARMACY_HIDES) {
      throw new Error(`pharmacy is ${counts.pharmacy}`);
    }
    if (counts.nursing !== EXPECTED_BEFORE.nursing - EXPECTED_NURSING_HIDES) {
      throw new Error(`nursing is ${counts.nursing}`);
    }
    console.log("VERIFY");
    console.log(`citation rows: ${citePlan.length}`);
    console.log(`hidden rows: ${hideIds.length}`);
    printCounts("after", counts);
    return;
  }

  const beforeCounts = await boardCounts(prisma);
  for (const field of BOARD_FIELDS) {
    if (beforeCounts[field] !== EXPECTED_BEFORE[field]) {
      throw new Error(`${field} eligible count is ${beforeCounts[field]}, expected ${EXPECTED_BEFORE[field]}. No undo file and no update.`);
    }
  }
  const hideEligibility = await eligibleById(prisma, hideIds);
  const pharmacyHides = hideEligibility.filter((item) => item.eligible && item.fieldId === "pharmacy");
  const nursingHides = hideEligibility.filter((item) => item.eligible && item.fieldId === "nursing");
  const ineligible = hideEligibility.filter((item) => !item.eligible);
  if (ineligible.length || pharmacyHides.length !== EXPECTED_PHARMACY_HIDES || nursingHides.length !== EXPECTED_NURSING_HIDES) {
    throw new Error(
      `hide eligibility is pharmacy ${pharmacyHides.length}, nursing ${nursingHides.length}, ineligible ${ineligible.map((item) => item.id).join(",") || "none"}. No undo file and no update.`
    );
  }

  if (!existsSync(CITE_UNDO_PATH)) {
    const digest = writeUndo(CITE_UNDO_PATH, {
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Pre-image before replacing JNC 8 and StatPearls citations. Stems were not changed.",
      ids: citeIds,
      rows: citeRows,
    });
    console.log(`citation undo sha256: ${digest}`);
  }
  if (!existsSync(HIDE_UNDO_PATH)) {
    const digest = writeUndo(HIDE_UNDO_PATH, {
      backedUpAt: new Date().toISOString(),
      table: "QuestionBankItem",
      reason: "Pre-image before hiding NCLEX/NAPLEX items that need a content rewrite. Rewrites were not published.",
      ids: hideIds,
      rows: hideRows,
    });
    console.log(`hide undo sha256: ${digest}`);
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`citation rows: ${citePlan.length} (${citePlan.length - GOLD_CITE_IDS.length} JNC 8, ${GOLD_CITE_IDS.length} StatPearls)`);
  console.log(`hide rows: ${hideIds.length} (pharmacy ${EXPECTED_PHARMACY_HIDES}, nursing ${EXPECTED_NURSING_HIDES})`);
  printCounts("before", beforeCounts);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '180s'`);
      let cited = 0;
      for (const plan of citePlan) {
        const row = citeRows.find((item) => item.id === plan.id)!;
        const updated = await tx.$queryRaw<Array<{ id: string }>>`
          UPDATE "QuestionBankItem"
          SET "references" = ${JSON.stringify(plan.nextRefs)}::jsonb,
              manual_correction = true,
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${plan.id}
            AND "contentHash" = ${String(row.contentHash)}
            AND question = ${String(row.question)}
            AND "correctAnswer" = ${String(row.correctAnswer)}
            AND active = true
            AND "qaPassed" = true
          RETURNING id
        `;
        cited += updated.length;
      }
      if (cited !== citePlan.length) throw new Error(`updated ${cited} citation rows, expected ${citePlan.length}`);
      const citeAfter = await loadRows(tx, cols, citeIds);
      for (const row of citeAfter) {
        const before = citeRows.find((item) => item.id === row.id)!;
        if (!sameStem(row, before)) throw new Error(`${String(row.id)} stem changed during the citation swap`);
        const refs = JSON.stringify(parseRefs(row.references));
        if (/jnc|statpearls/i.test(refs)) throw new Error(`${String(row.id)} still cites the old source`);
        if (row.manual_correction !== true || row.active !== true) throw new Error(`${String(row.id)} citation flags wrong`);
      }
      const midCounts = await boardCounts(tx);
      for (const field of BOARD_FIELDS) {
        if (midCounts[field] !== beforeCounts[field]) throw new Error(`${field} changed during the citation swap`);
      }
      printCounts("after citation swap", midCounts);

      let hidden = 0;
      for (const row of hideRows) {
        const updated = await tx.$queryRaw<Array<{ id: string }>>`
          UPDATE "QuestionBankItem"
          SET active = false,
              manual_correction = true,
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${String(row.id)}
            AND "contentHash" = ${String(row.contentHash)}
            AND question = ${String(row.question)}
            AND "correctAnswer" = ${String(row.correctAnswer)}
            AND active = true
            AND "qaPassed" = true
          RETURNING id
        `;
        hidden += updated.length;
      }
      if (hidden !== hideIds.length) throw new Error(`hid ${hidden} rows, expected ${hideIds.length}`);
      const hideAfter = await loadRows(tx, cols, hideIds);
      for (const row of hideAfter) {
        const before = hideRows.find((item) => item.id === row.id)!;
        if (!sameStem(row, before)) throw new Error(`${String(row.id)} stem changed during the hide`);
        if (row.active !== false || row.manual_correction !== true || row.qaPassed !== true) {
          throw new Error(`${String(row.id)} did not hide cleanly`);
        }
      }
      const still = (await eligibleById(tx, hideIds)).filter((item) => item.eligible);
      if (still.length) throw new Error(`still student-eligible: ${still.map((item) => item.id).join(", ")}`);
      const afterCounts = await boardCounts(tx);
      if (afterCounts.pharmacy !== EXPECTED_BEFORE.pharmacy - EXPECTED_PHARMACY_HIDES) {
        throw new Error(`pharmacy after is ${afterCounts.pharmacy}`);
      }
      if (afterCounts.nursing !== EXPECTED_BEFORE.nursing - EXPECTED_NURSING_HIDES) {
        throw new Error(`nursing after is ${afterCounts.nursing}`);
      }
      for (const field of BOARD_FIELDS) {
        if (field === "pharmacy" || field === "nursing") continue;
        if (afterCounts[field] !== beforeCounts[field]) throw new Error(`${field} changed`);
      }
      printCounts("after hide", afterCounts);
      if (!apply) throw new DryRunRollback();
    }, { timeout: 300_000 });
  } catch (error) {
    if (error instanceof DryRunRollback) {
      const counts = await boardCounts(prisma);
      for (const field of BOARD_FIELDS) {
        if (counts[field] !== beforeCounts[field]) throw new Error(`dry run left ${field} at ${counts[field]}`);
      }
      console.log("Rolled back. Citations and active flags unchanged.");
      return;
    }
    throw error;
  }

  const counts = await boardCounts(prisma);
  const still = (await eligibleById(prisma, hideIds)).filter((item) => item.eligible);
  if (still.length) throw new Error(`committed rows still eligible: ${still.map((item) => item.id).join(", ")}`);
  if (counts.pharmacy !== 5606 || counts.nursing !== 3753 || counts.pance !== 3755 || counts["aanp-fnp"] !== 5279) {
    throw new Error(`unexpected committed counts pharmacy ${counts.pharmacy} nursing ${counts.nursing}`);
  }
  console.log("Committed.");
  printCounts("verified after", counts);
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
