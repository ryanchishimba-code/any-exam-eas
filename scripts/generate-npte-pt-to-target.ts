#!/usr/bin/env node
/**
 * Loop NPTE-PT generation until the bank reaches the target count.
 *
 * Usage:
 *   npm run db:generate-npte-pt-to-target
 *   npm run db:generate-npte-pt-to-target -- --batch-size 500 --target 6000
 *
 * Checkpoint: artifacts/npte-pt-target-checkpoint.json
 * Log: artifacts/npte-pt-target-run.log
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { NPTE_PT_TARGET_TOTAL } from "../src/lib/exam-prep/npte-pt";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "npte-pt-target-checkpoint.json");
const LOG = path.join(ARTIFACTS, "npte-pt-target-run.log");

type Checkpoint = {
  target: number;
  batchesCompleted: number;
  lastActive: number;
  consecutiveZeroInserts: number;
  startedAt: string;
  updatedAt: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let batchSize = 200;
  let target = NPTE_PT_TARGET_TOTAL;
  let maxBatches = 0;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--batch-size" && args[i + 1]) batchSize = parseInt(args[++i]!, 10);
    else if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
  }

  return { batchSize, target, maxBatches, dryRun };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function getActiveCount(): Promise<number> {
  return prisma.questionBankItem.count({
    where: { fieldId: "npte-pt", active: true },
  });
}

function runBatch(count: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", "scripts/generate-npte-pt-batch.ts", "--count", String(count)],
      { cwd: process.cwd(), stdio: "inherit", env: process.env }
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
  const { batchSize, target, maxBatches, dryRun } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const prior = loadCheckpoint();
  const startedAt = prior.startedAt ?? new Date().toISOString();
  let batchesCompleted = prior.batchesCompleted ?? 0;
  let consecutiveZeroInserts = prior.consecutiveZeroInserts ?? 0;
  let lastActiveForBatch = prior.lastActive ?? (await getActiveCount());

  log(
    `NPTE-PT target run — goal ${target}, batch ${batchSize}, maxBatches ${maxBatches || "∞"}${dryRun ? " [dry-run]" : ""}`
  );

  while (true) {
    const active = await getActiveCount();

    saveCheckpoint({
      target,
      batchesCompleted,
      lastActive: active,
      consecutiveZeroInserts,
      startedAt,
      updatedAt: new Date().toISOString(),
    });

    log(`Progress: ${active}/${target} batches=${batchesCompleted}`);

    if (active >= target) {
      log(`Target reached (${active} >= ${target}). Done.`);
      break;
    }

    if (maxBatches > 0 && batchesCompleted >= maxBatches) {
      log(`Max batches (${maxBatches}) reached. Stopping with ${active}/${target}.`);
      break;
    }

    const remaining = target - active;
    const count = Math.min(batchSize, remaining);

    if (dryRun) {
      log(`Dry run — would generate ${count} items (${active} → target ${target}).`);
      break;
    }

    log(`▶ Generate batch ${batchesCompleted + 1}: ${count} items`);
    const genCode = await runBatch(count);
    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 30s before retry…`);
      await new Promise((r) => setTimeout(r, 30_000));
      continue;
    }

    const activeAfterBatch = await getActiveCount();
    const insertedThisBatch = activeAfterBatch - lastActiveForBatch;
    lastActiveForBatch = activeAfterBatch;

    if (insertedThisBatch <= 0) {
      consecutiveZeroInserts++;
      log(`No new items this batch (${consecutiveZeroInserts} consecutive).`);
      if (consecutiveZeroInserts >= 3) {
        log(
          "Stopping: 3 consecutive batches with zero inserts. Review API key, quality gates, or blueprint deficits."
        );
        break;
      }
    } else {
      consecutiveZeroInserts = 0;
      log(`Batch inserted ${insertedThisBatch} items (${activeAfterBatch}/${target}).`);
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
