#!/usr/bin/env node
/**
 * Strict USMLE QA gate — only exam-ready items (≥8/10 overall, no errors) get qaPassed=true.
 *
 * Usage:
 *   npm run db:qa-gate-usmle-best
 *   npm run db:qa-gate-usmle-best:dry
 */
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

function parseFieldArg(): string | undefined {
  const idx = process.argv.indexOf("--field");
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function gateField(fieldId: (typeof USMLE_FIELDS)[number]) {
  const where = { fieldId, active: true };
  const total = await prisma.questionBankItem.count({ where });

  console.log(`\nUSMLE best gate — ${fieldId} (${total} active)${dryRun ? " [dry-run]" : ""}\n`);

  let lastId: string | undefined;
  let processed = 0;
  let ready = 0;
  let notReady = 0;
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

      if (report.examReady) ready++;
      else notReady++;

      for (const issue of report.issues) {
        issueCounts[issue.code] = (issueCounts[issue.code] ?? 0) + 1;
      }

      updates.push({ id: row.id, qaPassed: report.examReady });
    }

    if (!dryRun) {
      const now = new Date();
      await prisma.$transaction(
        updates.map((u) =>
          prisma.questionBankItem.update({
            where: { id: u.id },
            data: { qaPassed: u.qaPassed, qaAuditedAt: now },
          })
        )
      );
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} (ready ${ready}, blocked ${notReady})`);
    }
  }

  console.log(`\n── ${fieldId} gate complete ──`);
  console.log(`Processed:  ${processed}`);
  console.log(`Exam-ready: ${ready} (${processed ? ((ready / processed) * 100).toFixed(1) : 0}%)`);
  console.log(`Blocked:    ${notReady}`);
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
