#!/usr/bin/env node
/**
 * Add ~N qaPassed questions to each board exam bank (generate + QA gate loop).
 *
 * Usage:
 *   npx tsx scripts/generate-increment-all-exams.ts
 *   npx tsx scripts/generate-increment-all-exams.ts --increment 50 --field pance
 *   npx tsx scripts/generate-increment-all-exams.ts --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  generateUsmleFullExam,
  insertUsmleFullExam,
  type UsmleStepLevel,
} from "../src/lib/exam-prep/usmle";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "increment-all-exams.log");
const REPORT = path.join(ARTIFACTS, "increment-all-exams-report.json");

type FieldSpec = {
  fieldId: string;
  label: string;
  generateScript?: string;
  generateArgs?: (batchCount: number) => string[];
  qaGateScript: string;
  qaGateArgs?: string[];
  usmleStep?: UsmleStepLevel;
};

const FIELD_SPECS: FieldSpec[] = [
  {
    fieldId: "nursing",
    label: "NCLEX",
    generateScript: "scripts/generate-nclex-full-exams.ts",
    generateArgs: (n) => ["--exams", "1", "--count", String(n), "--insert"],
    qaGateScript: "scripts/qa-gate-nclex-best.ts",
  },
  {
    fieldId: "pharmacy",
    label: "NAPLEX",
    generateScript: "scripts/generate-naplex-full-exams.ts",
    generateArgs: (n) => ["--exams", "1", "--count", String(n), "--insert"],
    qaGateScript: "scripts/qa-gate-naplex-best.ts",
  },
  {
    fieldId: "pance",
    label: "PANCE",
    generateScript: "scripts/generate-pance-batch.ts",
    generateArgs: (n) => ["--count", String(n)],
    qaGateScript: "scripts/qa-gate-pance-best.ts",
    qaGateArgs: ["--only-pending"],
  },
  {
    fieldId: "aanp-fnp",
    label: "AANP FNP",
    generateScript: "scripts/generate-aanp-fnp-batch.ts",
    generateArgs: (n) => ["--count", String(n)],
    qaGateScript: "scripts/qa-gate-question-bank.ts",
    qaGateArgs: ["--field", "aanp-fnp"],
  },
  {
    fieldId: "npte-pt",
    label: "NPTE-PT",
    generateScript: "scripts/generate-npte-pt-batch.ts",
    generateArgs: (n) => ["--count", String(n)],
    qaGateScript: "scripts/qa-gate-question-bank.ts",
    qaGateArgs: ["--field", "npte-pt"],
  },
  {
    fieldId: "usmle-step-1",
    label: "USMLE Step 1",
    usmleStep: "step1",
    qaGateScript: "scripts/qa-gate-usmle-best.ts",
    qaGateArgs: ["--field", "usmle-step-1"],
  },
  {
    fieldId: "usmle-step-2",
    label: "USMLE Step 2 CK",
    usmleStep: "step2",
    qaGateScript: "scripts/qa-gate-usmle-best.ts",
    qaGateArgs: ["--field", "usmle-step-2"],
  },
  {
    fieldId: "usmle-step-3",
    label: "USMLE Step 3",
    usmleStep: "step3",
    qaGateScript: "scripts/qa-gate-usmle-best.ts",
    qaGateArgs: ["--field", "usmle-step-3"],
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  let increment = 50;
  let field: string | undefined;
  let dryRun = false;
  let maxRounds = 4;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--increment" && args[i + 1]) increment = parseInt(args[++i]!, 10);
    else if (a === "--field" && args[i + 1]) field = args[++i];
    else if (a === "--max-rounds" && args[i + 1]) maxRounds = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
  }

  return { increment, field, dryRun, maxRounds };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}`;
  fs.appendFileSync(LOG, msg + "\n");
  console.log(msg);
}

async function qaPassedCount(fieldId: string): Promise<number> {
  return prisma.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true },
  });
}

function runScript(script: string, scriptArgs: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", script, ...scriptArgs],
      {
        cwd: process.cwd(),
        stdio: "inherit",
        env: { ...process.env, OPENAI_GENERATION_ONLY: "1" },
      }
    );
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

function batchSizeFor(remaining: number): number {
  return Math.min(80, Math.max(55, Math.ceil(remaining * 1.4)));
}

async function generateUsmleBatch(stepLevel: UsmleStepLevel, count: number): Promise<number> {
  const examNumber = (Date.now() % 9000) + 1000;
  const batchId = `increment-${stepLevel}-${Date.now()}`;
  log(`  USMLE inline generate: ${stepLevel} × ${count} (exam #${examNumber})`);
  const exam = await generateUsmleFullExam({
    examNumber,
    questionCount: count,
    batchId,
    stepLevel,
    onProgress: (done, total) => {
      if (done % 20 === 0 || done === total) log(`    progress ${done}/${total}`);
    },
  });
  log(`  accepted ${exam.qaReport.accepted}/${exam.questionCount}, rejected ${exam.qaReport.rejected}`);
  const insert = await insertUsmleFullExam(prisma, exam);
  log(`  DB: +${insert.created} inserted, ${insert.skipped} skipped`);
  return insert.created > 0 ? 0 : 1;
}

async function runField(spec: FieldSpec, increment: number, maxRounds: number, dryRun: boolean) {
  const baseline = await qaPassedCount(spec.fieldId);
  const target = baseline + increment;
  log(`\n=== ${spec.label} (${spec.fieldId}) baseline qaPassed=${baseline} target=${target} ===`);

  if (dryRun) {
    log(`Dry run — would generate until qaPassed >= ${target}`);
    return { fieldId: spec.fieldId, label: spec.label, baseline, final: baseline, gained: 0, ok: false, dryRun: true };
  }

  let rounds = 0;
  while (rounds < maxRounds) {
    const current = await qaPassedCount(spec.fieldId);
    if (current >= target) break;

    const remaining = target - current;
    const batchCount = batchSizeFor(remaining);
    rounds++;
    log(`Round ${rounds}: qaPassed=${current}, need +${remaining}, generating ${batchCount}`);

    let genCode = 0;
    if (spec.usmleStep) {
      genCode = await generateUsmleBatch(spec.usmleStep, batchCount);
    } else if (spec.generateScript && spec.generateArgs) {
      genCode = await runScript(spec.generateScript, spec.generateArgs(batchCount));
    } else {
      log("No generator configured — skipping.");
      break;
    }

    if (genCode !== 0) log(`Generate exited ${genCode} — continuing to QA gate.`);

    const qaArgs = spec.qaGateArgs ?? [];
    const qaCode = await runScript(spec.qaGateScript, qaArgs);
    if (qaCode !== 0) log(`QA gate exited ${qaCode}.`);

    const after = await qaPassedCount(spec.fieldId);
    log(`After round ${rounds}: qaPassed=${after} (+${after - current})`);
    if (after >= target) break;
    if (after <= current && rounds >= 2) {
      log("No net progress over recent rounds — stopping.");
      break;
    }
  }

  const final = await qaPassedCount(spec.fieldId);
  const gained = final - baseline;
  const ok = gained >= increment;
  log(`${spec.label}: ${baseline} → ${final} (+${gained}) ${ok ? "OK" : "SHORT"}`);
  return { fieldId: spec.fieldId, label: spec.label, baseline, final, gained, ok, rounds };
}

async function main() {
  const { increment, field, dryRun, maxRounds } = parseArgs();

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const specs = field
    ? FIELD_SPECS.filter((s) => s.fieldId === field || s.label.toLowerCase().includes(field.toLowerCase()))
    : FIELD_SPECS;

  if (specs.length === 0) {
    console.error(`Unknown field: ${field}`);
    process.exit(1);
  }

  log(`Increment run — +${increment} qaPassed per exam, maxRounds=${maxRounds}, fields=${specs.length}`);

  const results = [];
  for (const spec of specs) {
    results.push(await runField(spec, increment, maxRounds, dryRun));
  }

  fs.writeFileSync(REPORT, JSON.stringify({ increment, results, finishedAt: new Date().toISOString() }, null, 2));
  log(`\nReport → ${REPORT}`);

  const allOk = results.every((r) => r.ok || r.dryRun);
  if (!allOk) process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
