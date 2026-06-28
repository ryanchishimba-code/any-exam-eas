#!/usr/bin/env node
/**
 * Loop NAPLEX full-exam generation until the pharmacy bank reaches the target count.
 *
 * Usage:
 *   npm run db:generate-naplex-to-target
 *   npm run db:generate-naplex-to-target -- --target 1500 --exams-per-batch 2
 *   npm run db:generate-naplex-to-target -- --max-batches 1 --dry-run
 *
 * Checkpoint: artifacts/naplex-target-checkpoint.json
 * Log: artifacts/naplex-target-run.log
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { NAPLEX_TARGET_TOTAL, NAPLEX_FULL_EXAM_DEFAULT_COUNT } from "../src/lib/exam-prep/naplex/types";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "naplex-target-checkpoint.json");
const LOG = path.join(ARTIFACTS, "naplex-target-run.log");
const QA_GATE_EVERY_N_BATCHES = 3;

type Checkpoint = {
  target: number;
  metric: "active" | "qaPassed";
  batchesCompleted: number;
  lastActive: number;
  lastQaPassed: number;
  consecutiveZeroInserts: number;
  startedAt: string;
  updatedAt: string;
  legacyRetired?: boolean;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NAPLEX_TARGET_TOTAL;
  let examsPerBatch = 1;
  let countPerExam = NAPLEX_FULL_EXAM_DEFAULT_COUNT;
  let maxBatches = 0;
  let metric: "active" | "qaPassed" = "active";
  let dryRun = false;
  let retireLegacy = false;
  let skipRetire = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--exams-per-batch" && args[i + 1]) examsPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--count" && args[i + 1]) countPerExam = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    } else if (a === "--dry-run") dryRun = true;
    else if (a === "--retire-legacy") retireLegacy = true;
    else if (a === "--skip-retire") skipRetire = true;
  }

  return { target, examsPerBatch, countPerExam, maxBatches, metric, dryRun, retireLegacy, skipRetire };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function getCounts() {
  const [active, qaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "pharmacy", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true, qaPassed: true },
    }),
  ]);
  return { active, qaPassed };
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

function loadCheckpoint(): Partial<Checkpoint> {
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT, "utf8")) as Checkpoint;
  } catch {
    return {};
  }
}

function saveCheckpoint(cp: Checkpoint) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  fs.writeFileSync(CHECKPOINT, JSON.stringify(cp, null, 2));
}

async function main() {
  const { target, examsPerBatch, countPerExam, maxBatches, metric, dryRun, retireLegacy, skipRetire } =
    parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const prior = loadCheckpoint();
  const startedAt = prior.startedAt ?? new Date().toISOString();
  let batchesCompleted = prior.batchesCompleted ?? 0;
  let consecutiveZeroInserts = prior.consecutiveZeroInserts ?? 0;
  let lastActiveForBatch = prior.lastActive ?? 0;

  let legacyRetired = prior.legacyRetired ?? false;

  const shouldRetire =
    !skipRetire &&
    !dryRun &&
    (retireLegacy || batchesCompleted === 0) &&
    !legacyRetired;

  if (shouldRetire) {
    log("▶ Retiring legacy NAPLEX items (keep full-exam pipeline + physician-educator)…");
    const retireCode = await runScript("scripts/retire-naplex-legacy.ts", []);
    if (retireCode !== 0) {
      log(`Legacy retire failed (exit ${retireCode}). Aborting.`);
      process.exit(retireCode);
    }
    batchesCompleted = 0;
    consecutiveZeroInserts = 0;
    legacyRetired = true;
    lastActiveForBatch = (await getCounts()).active;
    const countsAfterRetire = await getCounts();
    saveCheckpoint({
      target,
      metric,
      batchesCompleted: 0,
      lastActive: countsAfterRetire.active,
      lastQaPassed: countsAfterRetire.qaPassed,
      consecutiveZeroInserts: 0,
      startedAt,
      updatedAt: new Date().toISOString(),
      legacyRetired: true,
    });
  }

  log(
    `NAPLEX target run — goal ${target} (${metric}), ${examsPerBatch} exam(s) × ${countPerExam} Q/batch, maxBatches ${maxBatches || "∞"}${dryRun ? " [dry-run]" : ""}`
  );

  while (true) {
    const { active, qaPassed } = await getCounts();
    const current = metric === "qaPassed" ? qaPassed : active;

    saveCheckpoint({
      target,
      metric,
      batchesCompleted,
      lastActive: active,
      lastQaPassed: qaPassed,
      consecutiveZeroInserts,
      startedAt,
      updatedAt: new Date().toISOString(),
      legacyRetired,
    });

    log(
      `Progress: ${current}/${target} (active=${active}, qaPassed=${qaPassed}, batches=${batchesCompleted})`
    );

    if (current >= target) {
      log(`Target reached (${current} >= ${target}). Done.`);
      break;
    }

    if (maxBatches > 0 && batchesCompleted >= maxBatches) {
      log(`Max batches (${maxBatches}) reached. Stopping at ${current}/${target}.`);
      break;
    }

    if (dryRun) {
      log(
        `Dry run — would generate ${examsPerBatch} exam(s) × ${countPerExam} (${current} → ${target}).`
      );
      break;
    }

    log(`▶ Generate batch ${batchesCompleted + 1}: ${examsPerBatch} exam(s) × ${countPerExam}`);
    const genCode = await runScript("scripts/generate-naplex-full-exams.ts", [
      "--exams",
      String(examsPerBatch),
      "--count",
      String(countPerExam),
      "--insert",
    ]);

    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 60s before retry…`);
      await new Promise((r) => setTimeout(r, 60_000));
      continue;
    }

    if (batchesCompleted === 0 || (batchesCompleted + 1) % QA_GATE_EVERY_N_BATCHES === 0) {
      log("▶ QA gate (best tier)");
      const qaCode = await runScript("scripts/qa-gate-naplex-best.ts", []);
      if (qaCode !== 0) {
        log(`QA gate failed (exit ${qaCode}) — continuing to next batch.`);
      }
    }

    const { active: activeAfterBatch, qaPassed: qaAfterBatch } = await getCounts();
    const insertedThisBatch = activeAfterBatch - lastActiveForBatch;
    lastActiveForBatch = activeAfterBatch;

    log(
      `Batch ${batchesCompleted + 1} done: +${insertedThisBatch} active (qaPassed=${qaAfterBatch})`
    );

    if (insertedThisBatch <= 0) {
      consecutiveZeroInserts++;
      log(`No new items this batch (${consecutiveZeroInserts} consecutive).`);
      if (consecutiveZeroInserts >= 3) {
        log(
          "Stopping: 3 consecutive batches with zero inserts. Review API key, QA gates, or dupes."
        );
        break;
      }
    } else {
      consecutiveZeroInserts = 0;
    }

    batchesCompleted++;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
