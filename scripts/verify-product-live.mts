#!/usr/bin/env node
/**
 * End-to-end live product verification — DB serve alignment, exam assembly,
 * and marketing count consistency with the landing page.
 *
 * Usage:
 *   npm run verify:product-live
 *   npm run verify:product-live -- --skip-full-exam
 */
import { spawnSync } from "node:child_process";
import {
  assertScriptDbConnection,
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";
import {
  buildLandingBankCountsDisplay,
  landingServedTotal,
} from "../src/lib/marketing/question-bank-counts.ts";
import { EXAM_FIELD_IDS } from "../src/lib/subjects/field-ids.ts";

const skipFullExam = process.argv.includes("--skip-full-exam");

function runStep(label: string, cmd: string, args: string[]): boolean {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  const ok = result.status === 0;
  if (!ok) console.error(`✗ ${label} failed (exit ${result.status ?? "unknown"})`);
  else console.log(`✓ ${label}`);
  return ok;
}

async function verifyMarketingCountsMatchDb(): Promise<boolean> {
  console.log("\n▶ Marketing counts ↔ live DB serve-ready totals");
  await assertScriptDbConnection();

  const prisma = getScriptPrisma();
  const servedRows = await prisma.questionBankItem.groupBy({
    by: ["fieldId"],
    where: { active: true, qaPassed: true },
    _count: { _all: true },
  });

  const servedByField = new Map(servedRows.map((r) => [r.fieldId, r._count._all]));

  const usmleServed = ["usmle-step-1", "usmle-step-2", "usmle-step-3"].reduce(
    (sum, id) => sum + (servedByField.get(id) ?? 0),
    0
  );

  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => {
      const served =
        fieldId === "usmle-step-2"
          ? usmleServed
          : (servedByField.get(fieldId) ?? 0);
      return [
        fieldId,
        { fieldId, total: served, active: served, served },
      ];
    })
  );

  const snapshot = {
    fields,
    totals: {
      total: [...servedByField.values()].reduce((a, b) => a + b, 0),
      active: [...servedByField.values()].reduce((a, b) => a + b, 0),
      served: [...servedByField.values()].reduce((a, b) => a + b, 0),
    },
    updatedAt: new Date().toISOString(),
    degraded: false,
  };

  const display = buildLandingBankCountsDisplay(snapshot);
  const landingTotal = landingServedTotal(snapshot);
  let ok = true;

  console.log(`  Landing total: ${display.totalLabel} (${display.totalQuestionsLabel})`);
  for (const exam of display.exams) {
    console.log(`  ${exam.label.padEnd(22)} ${exam.countLabel.padStart(8)} serve-ready`);
  }

  if (display.totalServed !== landingTotal) {
    console.error(`  ✗ totalServed mismatch: ${display.totalServed} vs ${landingTotal}`);
    ok = false;
  }

  for (const exam of display.exams) {
    const expected =
      exam.slug === "usmle"
        ? usmleServed
        : (servedByField.get(
            exam.slug === "nclex"
              ? "nursing"
              : exam.slug === "naplex"
                ? "pharmacy"
                : exam.slug
          ) ?? 0);
    if (exam.served !== expected) {
      console.error(`  ✗ ${exam.slug}: display ${exam.served} vs DB ${expected}`);
      ok = false;
    }
  }

  if (ok) console.log("✓ Marketing counts match live DB");
  return ok;
}

async function main() {
  console.log("\n=== Live product verification ===\n");

  const steps: boolean[] = [];

  steps.push(await verifyMarketingCountsMatchDb());

  steps.push(
    runStep("Subject selection & serve gates", "npm", [
      "run",
      "db:verify-subject-selection",
    ])
  );

  if (!skipFullExam) {
    steps.push(
      runStep("Full exam assembly (all boards)", "npx", [
        "tsx",
        "scripts/verify-full-exam-all.mts",
      ])
    );
    steps.push(
      runStep("Exam modes & presets", "npx", ["tsx", "scripts/verify-exam-modes.mts"])
    );
  }

  steps.push(
    runStep("Marketing count unit tests", "npx", [
      "vitest",
      "run",
      "src/lib/marketing/question-bank-counts.test.ts",
      "src/lib/marketing/bank-stats.test.ts",
      "src/lib/exam-prep/naplex-serve-gate.test.ts",
    ])
  );

  await disconnectScriptPrisma();

  const failed = steps.filter((s) => !s).length;
  console.log(
    `\n${failed === 0 ? "All live product checks passed." : `${failed} check(s) failed.`}\n`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
