#!/usr/bin/env node
/**
 * Full-bank QA gate: audit every active question and set qaPassed.
 * Only items with qaPassed=true are served in practice sessions.
 *
 * Usage:
 *   npm run db:qa-gate
 *   npm run db:qa-gate -- --field nursing
 *   npm run db:qa-gate -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem, summarizeBankAudit } from "../src/lib/exam-prep/bank-audit";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

const BATCH = 400;

function parseArgs() {
  const args = process.argv.slice(2);
  let field: string | undefined;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i];
    else if (args[i] === "--dry-run") dryRun = true;
  }
  return { field, dryRun };
}

async function main() {
  const { field, dryRun } = parseArgs();
  const where = { active: true, ...(field ? { fieldId: field } : {}) };

  const total = await prisma.questionBankItem.count({ where });
  console.log(`\nQA gate — auditing ${total} active item(s)${field ? ` (${field})` : ""}${dryRun ? " [dry-run]" : ""}\n`);

  let lastId: string | undefined;
  let processed = 0;
  let passCount = 0;
  let failCount = 0;
  const allResults: Array<{ ok: boolean; issues: ReturnType<typeof auditBankItem>["issues"]; fieldId: string }> = [];

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        ...where,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });

    if (rows.length === 0) break;

    const updates: Array<{ id: string; qaPassed: boolean }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const report = auditBankItem(item, row.fieldId);
      allResults.push({ ok: report.ok, issues: report.issues, fieldId: row.fieldId });

      if (report.ok) passCount++;
      else failCount++;

      updates.push({ id: row.id, qaPassed: report.ok });
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
      console.log(`  … ${processed}/${total} (${passCount} pass, ${failCount} fail)`);
    }
  }

  const summary = summarizeBankAudit(allResults);
  const passRate = summary.total ? ((summary.pass / summary.total) * 100).toFixed(1) : "0";

  console.log(`\n── QA gate complete ──`);
  console.log(`Processed:  ${processed}`);
  console.log(`Pass:       ${summary.pass} (${passRate}%)`);
  console.log(`Fail:       ${summary.fail}`);
  console.log(`\nBy field:`);
  for (const [fid, stats] of Object.entries(summary.byField).sort((a, b) => b[1].fail - a[1].fail)) {
    const rate = stats.total ? ((stats.pass / stats.total) * 100).toFixed(1) : "0";
    console.log(`  ${fid}: ${stats.pass}/${stats.total} pass (${rate}%)`);
  }
  console.log(`\nTop issue codes:`);
  for (const [code, count] of Object.entries(summary.byCode).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
    console.log(`  ${code}: ${count}`);
  }

  if (dryRun) {
    console.log(`\nDry-run — no database updates written.`);
  } else {
    const served = await prisma.questionBankItem.count({ where: { active: true, qaPassed: true } });
    console.log(`\nStudents will see: ${served} qaPassed items`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
