#!/usr/bin/env node
/**
 * Smoke-verify NPTE-PT bank, serve gate, blueprint, and full-exam presets.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { NPTE_PT_TARGET_TOTAL } from "../src/lib/exam-prep/npte-pt/types";
import { mergeNptePtQuotaWithCounts } from "../src/lib/exam-prep/npte-pt/blueprint-quota";
import { nptePtItemPassesTimedExamGate } from "../src/lib/exam-prep/npte-pt-serve-gate";
import { sampleQuestionBankItemsForField } from "../src/lib/question-bank-db";
import { listNptePtFullPracticeExams } from "../src/lib/exam-prep/npte-pt/load-preset-exam";
import { buildLandingBankCountsDisplay, getQuestionBankCounts } from "../src/lib/marketing/question-bank-counts";

const prisma = new PrismaClient();

type Check = { name: string; ok: boolean; detail: string };

async function main() {
  const checks: Check[] = [];

  const active = await prisma.questionBankItem.count({
    where: { fieldId: "npte-pt", active: true },
  });
  checks.push({
    name: "Bank active count",
    ok: active >= NPTE_PT_TARGET_TOTAL,
    detail: `${active} / ${NPTE_PT_TARGET_TOTAL}`,
  });

  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "npte-pt", active: true, qaPassed: true },
  });
  checks.push({
    name: "QA-passed items",
    ok: qaPassed > active * 0.5,
    detail: `${qaPassed} (${Math.round((qaPassed / active) * 100)}% of active)`,
  });

  const rows = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "npte-pt", active: true },
    _count: { id: true },
  });
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.subjectId] = r._count.id;
  const quota = mergeNptePtQuotaWithCounts(counts, NPTE_PT_TARGET_TOTAL);
  const deficits = quota.filter((q) => (q.deficit ?? 0) > 0);
  checks.push({
    name: "Blueprint category coverage",
    ok: deficits.length <= 3,
    detail: `${quota.length - deficits.length}/${quota.length} at quota (${deficits.length} deficits)`,
  });

  const sample = await sampleQuestionBankItemsForField({ fieldId: "npte-pt", count: 50 });
  let serveOk = 0;
  for (const item of sample) {
    if (nptePtItemPassesTimedExamGate(item)) serveOk++;
  }
  checks.push({
    name: "Timed exam serve gate (50 QA-passed sample)",
    ok: serveOk >= 45,
    detail: `${serveOk}/50 pass`,
  });

  const presets = await listNptePtFullPracticeExams();
  checks.push({
    name: "Full practice exam presets",
    ok: presets.length >= 1,
    detail: presets.length ? `${presets.length} preset(s)` : "none — run db:seed-npte-pt-full-exams",
  });

  const snapshot = await getQuestionBankCounts();
  const landing = buildLandingBankCountsDisplay(snapshot);
  const npteRow = landing.exams.find((e) => e.label === "NPTE-PT");
  checks.push({
    name: "Landing marketing count",
    ok: Boolean(npteRow?.questionsLabel?.includes("K") || npteRow?.countLabel),
    detail: npteRow?.questionsLabel ?? npteRow?.countLabel ?? "missing",
  });

  const categories = await prisma.nptePtBlueprintCategory.count();
  const topics = await prisma.nptePtTopic.count();
  checks.push({
    name: "Blueprint tables seeded",
    ok: categories >= 14 && topics >= 10,
    detail: `${categories} categories, ${topics} topics`,
  });

  console.log("\nNPTE-PT feature verification\n" + "=".repeat(40));
  let failed = 0;
  for (const c of checks) {
    const mark = c.ok ? "PASS" : "FAIL";
    if (!c.ok) failed++;
    console.log(`${mark}  ${c.name}: ${c.detail}`);
  }
  console.log("=".repeat(40));
  console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
  process.exit(failed ? 1 : 0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
