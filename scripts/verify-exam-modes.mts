#!/usr/bin/env node
/**
 * Verify marketing counts, bank serve pools, and full-exam simulator assembly.
 *
 * Usage:
 *   npm run db:verify-exam-modes
 *   npm run db:verify-exam-modes -- --quick
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { USMLE_STEPS } from "../src/lib/exam-prep/usmle/steps";
import { getTimedExamQuestionCount } from "../src/lib/exam/exam-lengths";
import { countActiveQuestions } from "../src/lib/question-bank-db";
import { listNclexFullPracticeExams } from "../src/lib/exam-prep/nclex/load-preset-exam";
import { listUsmleFullPracticeExams } from "../src/lib/exam-prep/usmle/load-preset-exam";
import {
  NCLEX_TARGET_TOTAL,
} from "../src/lib/exam-prep/nclex/types";
import {
  PANCE_TARGET_TOTAL,
} from "../src/lib/exam-prep/pance/types";
import {
  AANP_FNP_TARGET_TOTAL,
} from "../src/lib/exam-prep/aanp-fnp/types";
import {
  NPTE_PT_TARGET_TOTAL,
} from "../src/lib/exam-prep/npte-pt/types";
import { USMLE_PUBLISHED_BANK_TOTAL } from "../src/lib/exam-prep/usmle/steps";

const prisma = new PrismaClient();

import { NAPLEX_TARGET_TOTAL } from "@/lib/exam-prep/naplex/types";

type FieldSpec = {
  fieldId: string;
  label: string;
  marketingTarget?: number;
};

const BOARD_FIELDS: FieldSpec[] = [
  { fieldId: "nursing", label: "NCLEX", marketingTarget: NCLEX_TARGET_TOTAL },
  { fieldId: "pharmacy", label: "NAPLEX", marketingTarget: NAPLEX_TARGET_TOTAL },
  { fieldId: "usmle-step-1", label: "USMLE Step 1" },
  { fieldId: "usmle-step-2", label: "USMLE Step 2 CK" },
  { fieldId: "usmle-step-3", label: "USMLE Step 3" },
  { fieldId: "pance", label: "PANCE", marketingTarget: PANCE_TARGET_TOTAL },
  { fieldId: "aanp-fnp", label: "AANP FNP", marketingTarget: AANP_FNP_TARGET_TOTAL },
  { fieldId: "npte-pt", label: "NPTE-PT", marketingTarget: NPTE_PT_TARGET_TOTAL },
];

async function auditBankCounts(): Promise<boolean> {
  console.log("\n── Bank counts (active + qaPassed = simulatable) ──\n");
  let ok = true;
  let usmleServed = 0;

  for (const { fieldId, label, marketingTarget } of BOARD_FIELDS) {
    const served = await countActiveQuestions(fieldId);
    if (fieldId.startsWith("usmle")) usmleServed += served;

    const fullSim = getTimedExamQuestionCount(fieldId);
    const simOk = served >= fullSim;
    const targetOk = marketingTarget == null || served <= marketingTarget + 100;

    if (!simOk || !targetOk) ok = false;

    const flags = [
      !simOk ? `NEED ${fullSim} for full sim` : null,
      marketingTarget != null && served > marketingTarget
        ? `OVER marketing cap ${marketingTarget}`
        : null,
      marketingTarget != null && served < marketingTarget
        ? `under cap ${marketingTarget} (OK if trimmed)`
        : null,
    ]
      .filter(Boolean)
      .join(" · ");

    console.log(
      `${label.padEnd(18)} ${String(served).padStart(6)} served · full sim ${fullSim}${flags ? ` · ${flags}` : ""}`
    );
  }

  const usmleMarketingOk = usmleServed <= USMLE_PUBLISHED_BANK_TOTAL + 500;
  console.log(
    `\nUSMLE combined: ${usmleServed} (marketing constant ${USMLE_PUBLISHED_BANK_TOTAL})`
  );
  if (!usmleMarketingOk) {
    console.log("  WARN: update USMLE_PUBLISHED_BANK_TOTAL to match live served total");
    ok = false;
  }

  const totalServed = await prisma.questionBankItem.count({
    where: { active: true, qaPassed: true },
  });
  console.log(`All fields total served: ${totalServed}`);
  return ok;
}

async function auditPresetExams(): Promise<boolean> {
  console.log("\n── Preset practice exams ──\n");
  let ok = true;

  const nclex = await listNclexFullPracticeExams();
  const usmle = await listUsmleFullPracticeExams();
  console.log(`NCLEX presets ready: ${nclex.length}/10`);
  console.log(`USMLE presets ready: ${usmle.length}/10`);

  if (nclex.length < 10) {
    ok = false;
    console.log("  → Run: npm run db:seed-nclex-full-exams");
  }
  if (usmle.length < 10) {
    console.log(`  → USMLE presets: ${usmle.length}/10 ready (optional — run db:generate-usmle-full-exams)`);
  }

  return ok;
}

async function main() {
  const quick = process.argv.includes("--quick");
  console.log("\n=== Exam mode verification ===");

  const countsOk = await auditBankCounts();
  const presetsOk = await auditPresetExams();

  const verifyScript = quick ? "--quick" : "";
  console.log("\n── Full exam assembly (verify-full-exam-all) ──\n");

  const { spawnSync } = await import("node:child_process");
  const child = spawnSync(
    "npx",
    ["tsx", "scripts/verify-full-exam-all.mts", ...(verifyScript ? [verifyScript] : [])],
    { stdio: "inherit", cwd: process.cwd(), env: process.env }
  );

  await prisma.$disconnect();

  const assemblyOk = child.status === 0;
  const ok = countsOk && presetsOk && assemblyOk;

  console.log(`\n${ok ? "All exam mode checks passed." : "Some checks failed — see above."}`);
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
