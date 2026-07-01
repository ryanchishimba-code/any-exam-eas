#!/usr/bin/env node
/**
 * Loop blueprint-balanced NCLEX gap-fill until best-tier (qaPassed) reaches target.
 * Uses OER-grounded gpt-4o generation + best QA gate each batch.
 *
 * Usage:
 *   npm run db:generate-nclex-best-to-4k
 *   npm run db:generate-nclex-best-to-target -- --target 4000 --batches-per-round 5
 *   npm run db:generate-nclex-best-to-target -- --max-rounds 3 --dry-run
 *
 * Checkpoint: artifacts/nclex-best-target-checkpoint.json
 * Log: artifacts/nclex-best-target-run.log
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { NCLEX_BEST_TARGET_TOTAL } from "../src/lib/exam-prep/nclex/types";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "nclex-best-target-checkpoint.json");
const LOG = path.join(ARTIFACTS, "nclex-best-target-run.log");

type Checkpoint = {
  target: number;
  roundsCompleted: number;
  lastQaPassed: number;
  consecutiveZeroInserts: number;
  startedAt: string;
  updatedAt: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NCLEX_BEST_TARGET_TOTAL;
  let batchesPerRound = 8;
  let examsPerBatch = 1;
  let maxRounds = 0;
  let curateEvery = 4;
  let curateLimit = 150;
  let dryRun = false;
  let resetCheckpoint = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--batches-per-round" && args[i + 1])
      batchesPerRound = parseInt(args[++i]!, 10);
    else if (a === "--exams-per-batch" && args[i + 1])
      examsPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--max-rounds" && args[i + 1]) maxRounds = parseInt(args[++i]!, 10);
    else if (a === "--curate-every" && args[i + 1]) curateEvery = parseInt(args[++i]!, 10);
    else if (a === "--curate-limit" && args[i + 1]) curateLimit = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
    else if (a === "--reset-checkpoint") resetCheckpoint = true;
  }

  return {
    target,
    batchesPerRound,
    examsPerBatch,
    maxRounds,
    curateEvery,
    curateLimit,
    dryRun,
    resetCheckpoint,
  };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function getCounts() {
  const [active, qaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "nursing", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "nursing", active: true, qaPassed: true },
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
  const {
    target,
    batchesPerRound,
    examsPerBatch,
    maxRounds,
    curateEvery,
    curateLimit,
    dryRun,
    resetCheckpoint,
  } = parseArgs();

  if (!dryRun && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const prior = resetCheckpoint ? {} : loadCheckpoint();
  const startedAt = prior.startedAt ?? new Date().toISOString();
  let roundsCompleted = prior.roundsCompleted ?? 0;
  let consecutiveZeroInserts = prior.consecutiveZeroInserts ?? 0;
  let lastQaPassedForRound = prior.lastQaPassed ?? 0;

  log(
    `NCLEX best-tier target run — goal ${target} qaPassed, ${batchesPerRound} batch(es)/round × ${examsPerBatch} exam(s), maxRounds ${maxRounds || "∞"}${dryRun ? " [dry-run]" : ""}`
  );

  while (true) {
    const { active, qaPassed } = await getCounts();

    if (roundsCompleted === 0 && lastQaPassedForRound === 0) {
      lastQaPassedForRound = qaPassed;
    }

    saveCheckpoint({
      target,
      roundsCompleted,
      lastQaPassed: qaPassed,
      consecutiveZeroInserts,
      startedAt,
      updatedAt: new Date().toISOString(),
    });

    log(
      `Progress: ${qaPassed}/${target} best-tier (active=${active}, rounds=${roundsCompleted})`
    );

    if (qaPassed >= target) {
      log(`Target reached (${qaPassed} >= ${target}). Done.`);
      break;
    }

    if (maxRounds > 0 && roundsCompleted >= maxRounds) {
      log(`Max rounds (${maxRounds}) reached. Stopping at ${qaPassed}/${target}.`);
      break;
    }

    if (dryRun) {
      log(
        `Dry run — would run ${batchesPerRound} gap-fill batch(es) (${qaPassed} → ${target}).`
      );
      break;
    }

    log(`▶ Round ${roundsCompleted + 1}: blueprint gap-fill (${batchesPerRound} batches)`);
    const rebalanceCode = await runScript("scripts/rebalance-nclex-blueprint.ts", [
      "--target",
      String(target),
      "--max-batches",
      String(batchesPerRound),
      "--exams-per-batch",
      String(examsPerBatch),
    ]);

    if (rebalanceCode !== 0) {
      log(`Rebalance exited ${rebalanceCode}. Waiting 60s before retry…`);
      await new Promise((r) => setTimeout(r, 60_000));
      continue;
    }

    if (curateEvery > 0 && (roundsCompleted + 1) % curateEvery === 0) {
      log(`▶ Curate failing items (limit ${curateLimit})`);
      await runScript("scripts/curate-nclex-questions.ts", [
        "--failing",
        "--force-ai",
        "--limit",
        String(curateLimit),
      ]);
      log("▶ Re-run best QA gate after curation");
      await runScript("scripts/qa-gate-nclex-best.ts", []);
    }

    const { active: activeAfter, qaPassed: qaAfter } = await getCounts();
    const insertedThisRound = qaAfter - lastQaPassedForRound;
    lastQaPassedForRound = qaAfter;

    log(
      `Round ${roundsCompleted + 1} done: +${insertedThisRound} best-tier (active=${activeAfter}, qaPassed=${qaAfter})`
    );

    if (insertedThisRound <= 0) {
      consecutiveZeroInserts++;
      log(`No new best-tier items (${consecutiveZeroInserts} consecutive rounds).`);
      if (consecutiveZeroInserts >= 4) {
        log("Stopping: 4 consecutive rounds with zero best-tier inserts.");
        break;
      }
    } else {
      consecutiveZeroInserts = 0;
    }

    roundsCompleted++;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
