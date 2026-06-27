#!/usr/bin/env node
/**
 * Verify DB connectivity and serve alignment for every board exam field used in
 * the question bank topic picker (including all USMLE steps).
 *
 * Usage:
 *   npm run db:verify-subject-selection
 *   npm run db:verify-subject-selection -- --field nursing
 */
import {
  assertScriptDbConnection,
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { bankItemPassesIngestGate } from "../src/lib/exam-prep/bank-ingest-gate";
import {
  countActiveSubjectQuestions,
  getSubjectServedCountsWithRetry,
  sampleQuestionBankItems,
} from "../src/lib/question-bank-db";
import { getSubjectsForFieldId } from "../src/lib/subjects/registry";

const BOARD_FIELDS = [
  "nursing",
  "pharmacy",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

const SERVE_SAMPLE = 200;

function parseFieldArg(): string | undefined {
  const idx = process.argv.indexOf("--field");
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

type FieldReport = {
  fieldId: string;
  dbOk: boolean;
  servedTotal: number;
  topicCount: number;
  catalogTopics: number;
  countConsistencyOk: boolean;
  serveAlignPct: number | null;
  sampleOk: boolean;
  sampleSubjectId?: string;
  errors: string[];
};

async function auditField(fieldId: string): Promise<FieldReport> {
  const errors: string[] = [];
  const catalogTopics = getSubjectsForFieldId(fieldId).length;

  let counts: Record<string, number> = {};
  try {
    counts = await getSubjectServedCountsWithRetry(fieldId);
  } catch (e) {
    errors.push(`getSubjectServedCounts: ${e instanceof Error ? e.message : String(e)}`);
    return {
      fieldId,
      dbOk: false,
      servedTotal: 0,
      topicCount: 0,
      catalogTopics,
      countConsistencyOk: false,
      serveAlignPct: null,
      sampleOk: false,
      errors,
    };
  }

  const servedTotal = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const topicCount = Object.keys(counts).length;

  let countConsistencyOk = true;
  const checkSubjects = Object.keys(counts).slice(0, 5);
  for (const subjectId of checkSubjects) {
    try {
      const perSubject = await countActiveSubjectQuestions(fieldId, subjectId);
      if (perSubject !== counts[subjectId]) {
        countConsistencyOk = false;
        errors.push(
          `count mismatch ${subjectId}: map=${counts[subjectId]} per-subject=${perSubject}`
        );
      }
    } catch (e) {
      countConsistencyOk = false;
      errors.push(
        `countActiveSubjectQuestions(${subjectId}): ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  const prisma = getScriptPrisma();
  const sampleRows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
    orderBy: { updatedAt: "desc" },
    take: Math.min(SERVE_SAMPLE, servedTotal || SERVE_SAMPLE),
  });

  let serveReady = 0;
  for (const row of sampleRows) {
    const item = enrichBankItemFromRow(row);
    if (bankItemPassesIngestGate(fieldId, item, row.source)) serveReady++;
  }
  const serveAlignPct =
    sampleRows.length > 0 ? Math.round((serveReady / sampleRows.length) * 1000) / 10 : null;

  const sampleSubjectId =
    Object.entries(counts).find(([, n]) => n >= 5)?.[0] ??
    Object.entries(counts).find(([, n]) => n > 0)?.[0];

  let sampleOk = false;
  if (sampleSubjectId) {
    try {
      const items = await sampleQuestionBankItems({
        fieldId,
        subjectId: sampleSubjectId,
        count: Math.min(5, counts[sampleSubjectId] ?? 5),
      });
      sampleOk = items.length > 0;
      if (!sampleOk) {
        errors.push(`sampleQuestionBankItems returned 0 for ${sampleSubjectId}`);
      }
    } catch (e) {
      errors.push(
        `sampleQuestionBankItems(${sampleSubjectId}): ${e instanceof Error ? e.message : String(e)}`
      );
    }
  } else if (servedTotal === 0) {
    errors.push("no serve-ready questions in bank");
  }

  if (serveAlignPct != null && serveAlignPct < 85) {
    errors.push(`serve alignment ${serveAlignPct}% on qaPassed sample (target ≥85%)`);
  }

  return {
    fieldId,
    dbOk: true,
    servedTotal,
    topicCount,
    catalogTopics,
    countConsistencyOk,
    serveAlignPct,
    sampleOk: servedTotal === 0 ? true : sampleOk,
    sampleSubjectId,
    errors,
  };
}

async function main() {
  console.log("\n=== Subject selection & serve alignment (all board fields) ===\n");

  await assertScriptDbConnection();
  console.log("DB connection: OK\n");

  const fieldFilter = parseFieldArg();
  const fields = fieldFilter ? [fieldFilter] : [...BOARD_FIELDS];

  console.log(
    "Field".padEnd(16) +
      "Served".padStart(8) +
      "Topics".padStart(8) +
      "Serve%".padStart(8) +
      "  Status"
  );
  console.log("-".repeat(52));

  let allOk = true;
  const reports: FieldReport[] = [];

  for (const fieldId of fields) {
    const report = await auditField(fieldId);
    reports.push(report);

    const ok =
      report.dbOk &&
      report.countConsistencyOk &&
      report.errors.length === 0 &&
      (report.servedTotal === 0 || report.sampleOk);

    if (!ok) allOk = false;

    const servePct =
      report.serveAlignPct != null ? `${report.serveAlignPct.toFixed(1)}%` : "n/a";
    const status = ok ? "ok" : "FAIL";

    console.log(
      report.fieldId.padEnd(16) +
        String(report.servedTotal).padStart(8) +
        `${report.topicCount}/${report.catalogTopics}`.padStart(8) +
        servePct.padStart(8) +
        `  ${status}`
    );
  }

  const failed = reports.filter(
    (r) =>
      !r.dbOk ||
      !r.countConsistencyOk ||
      r.errors.length > 0 ||
      (r.servedTotal > 0 && !r.sampleOk)
  );

  if (failed.length) {
    console.log("\n── Details ──\n");
    for (const r of failed) {
      console.log(`${r.fieldId}:`);
      for (const err of r.errors) console.log(`  • ${err}`);
    }
  }

  console.log(`\n${allOk ? "All fields passed." : "Some fields failed — see details above."}\n`);
  process.exit(allOk ? 0 : 1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectScriptPrisma());
