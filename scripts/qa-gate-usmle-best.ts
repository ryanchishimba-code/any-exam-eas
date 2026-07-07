#!/usr/bin/env node
/**
 * USMLE serve QA gate — aligns qaPassed with runtime usmleBankItemIsServeReady.
 * Step 1 / Step 3: ≥7.5 editorial score; Step 2 CK: ≥8.0 (exam-ready).
 *
 * Usage:
 *   npm run db:qa-gate-usmle-best
 *   npm run db:qa-gate-usmle-best:dry
 *   npm run db:qa-gate-usmle-best -- --field usmle-step-1
 *   npm run db:qa-gate-usmle-best -- --topics
 *   npm run db:qa-gate-usmle-best -- --topics-only
 *   npm run db:qa-gate-usmle-best -- --skip-topics
 */
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { usmleServeMinQaScore } from "../src/lib/exam-prep/usmle/steps";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");
const topicsOnly = process.argv.includes("--topics-only");
const topicsFlag = process.argv.includes("--topics") || topicsOnly;

function parseFieldArg(): string | undefined {
  const idx = process.argv.indexOf("--field");
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function runTopicGate(): boolean {
  console.log("\nUSMLE topic integration gate (registry, content, roadmap links)\n");
  try {
    execSync("bash scripts/run-with-node.sh npx tsx scripts/usmle-topic-qa-gate.ts", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    return true;
  } catch {
    return false;
  }
}

async function gateField(fieldId: (typeof USMLE_FIELDS)[number]) {
  const where = { fieldId, active: true };
  const total = await prisma.questionBankItem.count({ where });
  const minScore = usmleServeMinQaScore(fieldId) ?? 8;

  console.log(
    `\nUSMLE serve gate — ${fieldId} (${total} active, min QA ${minScore})${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let serveReady = 0;
  let notReady = 0;
  let examReadyOnly = 0;
  const issueCounts: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { ...where, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    const updates: Array<{ id: string; qaPassed: boolean }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const report = auditUsmleQaEditor(item, {
        fieldId,
        source: row.source ?? "bulk",
        itemId: row.id,
        difficulty: row.difficulty ?? null,
      });
      const passes = usmleBankItemIsServeReady(item, fieldId);

      if (passes) serveReady++;
      else notReady++;

      if (report.examReady && !passes) examReadyOnly++;

      for (const issue of report.issues) {
        issueCounts[issue.code] = (issueCounts[issue.code] ?? 0) + 1;
      }

      updates.push({ id: row.id, qaPassed: passes });
    }

    if (!dryRun) {
      await applyQaPassedBatch(prisma, updates, dryRun);
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} (serve-ready ${serveReady}, blocked ${notReady})`);
    }
  }

  console.log(`\n── ${fieldId} gate complete ──`);
  console.log(`Processed:       ${processed}`);
  console.log(
    `Serve-ready:     ${serveReady} (${processed ? ((serveReady / processed) * 100).toFixed(1) : 0}%)`
  );
  console.log(`Blocked:         ${notReady}`);
  if (examReadyOnly > 0) {
    console.log(`Exam-ready only: ${examReadyOnly} (≥8 QA but failed serve bar)`);
  }
  console.log(`Top blockers:`);
  for (const [code, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`  ${code}: ${count}`);
  }

  if (!dryRun) {
    const served = await prisma.questionBankItem.count({
      where: { fieldId, active: true, qaPassed: true },
    });
    console.log(`Students will see: ${served} ${fieldId} items`);
  }
}

async function main() {
  const skipTopics = process.argv.includes("--skip-topics");

  if (topicsFlag || !skipTopics) {
    const ok = runTopicGate();
    if (!ok) process.exit(1);
    if (topicsOnly) {
      console.log("");
      return;
    }
  }

  const fieldFilter = parseFieldArg();
  if (fieldFilter && !USMLE_FIELDS.includes(fieldFilter as (typeof USMLE_FIELDS)[number])) {
    console.error(`Unknown --field "${fieldFilter}". Expected: ${USMLE_FIELDS.join(", ")}`);
    process.exit(1);
  }

  const fields = fieldFilter ? [fieldFilter as (typeof USMLE_FIELDS)[number]] : [...USMLE_FIELDS];
  for (const fieldId of fields) {
    await gateField(fieldId);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
