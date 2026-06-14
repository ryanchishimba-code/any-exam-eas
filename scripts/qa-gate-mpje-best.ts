#!/usr/bin/env node
/**
 * Strict MPJE QA gate — only A+ best-tier items get qaPassed=true.
 *
 * Usage:
 *   npm run db:qa-gate-mpje-best
 *   npm run db:qa-gate-mpje-best -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import {
  assessMpjeItemQuality,
  isMpjeBestQuality,
} from "../src/lib/exam-prep/mpje-quality-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const total = await prisma.questionBankItem.count({
    where: { fieldId: "mpje", active: true },
  });

  console.log(
    `\nMPJE A+ QA gate — ${total} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let acceptable = 0;
  let rejected = 0;
  const rejectCodes: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "mpje",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });

    if (rows.length === 0) break;

    const updates: Array<{ id: string; qaPassed: boolean; active: boolean }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const audit = auditBankItem(item, "mpje");
      const verdict = assessMpjeItemQuality(item, { source: row.source });
      const pass = isMpjeBestQuality(item, { source: row.source }) && audit.ok;

      if (verdict.tier === "best") best++;
      else if (verdict.tier === "acceptable") acceptable++;
      else rejected++;

      for (const code of [...verdict.issues, ...audit.issues.filter((i) => i.severity === "error").map((i) => i.code)]) {
        rejectCodes[code] = (rejectCodes[code] ?? 0) + 1;
      }

      updates.push({
        id: row.id,
        qaPassed: pass,
        active: verdict.tier !== "reject" || pass,
      });
    }

    if (!dryRun) {
      const now = new Date();
      await prisma.$transaction(
        updates.map((u) =>
          prisma.questionBankItem.update({
            where: { id: u.id },
            data: {
              qaPassed: u.qaPassed,
              qaAuditedAt: now,
              active: u.active,
            },
          })
        )
      );
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 500 === 0 || processed === total) {
      console.log(
        `  … ${processed}/${total} (best ${best}, rewrite ${acceptable}, reject ${rejected})`
      );
    }
  }

  console.log(`\n── MPJE A+ gate complete ──`);
  console.log(`Processed:    ${processed}`);
  console.log(`Best (serve): ${best}`);
  console.log(`Rewrite:      ${acceptable}`);
  console.log(`Rejected:     ${rejected}`);
  console.log(`\nTop issue codes:`);
  for (const [code, count] of Object.entries(rejectCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)) {
    console.log(`  ${code}: ${count}`);
  }

  if (!dryRun) {
    const served = await prisma.questionBankItem.count({
      where: { fieldId: "mpje", active: true, qaPassed: true },
    });
    console.log(`\nStudents will see: ${served} A+ MPJE items`);
  } else {
    console.log(`\nDry-run — no database updates written.`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
