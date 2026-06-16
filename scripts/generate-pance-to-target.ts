#!/usr/bin/env node
/**
 * Loop PANCE generation until the bank reaches the target count.
 *
 * Usage:
 *   npm run db:generate-pance-to-target
 *   npm run db:generate-pance-to-target -- --batch-size 500 --target 6000
 *   npm run db:generate-pance-to-target -- --mode procedural
 *   npm run db:generate-pance-to-target -- --max-batches 1   # single iteration
 *
 * Modes: auto (AI if OPENAI_API_KEY set, else procedural), ai, procedural
 *
 * Checkpoint: artifacts/pance-target-checkpoint.json
 * Log: artifacts/pance-target-run.log
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { PANCE_TARGET_TOTAL } from "../src/lib/exam-prep/pance";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "pance-target-checkpoint.json");
const LOG = path.join(ARTIFACTS, "pance-target-run.log");

type Checkpoint = {
  target: number;
  metric: "active" | "qaPassed";
  batchesCompleted: number;
  lastActive: number;
  lastQaPassed: number;
  consecutiveZeroInserts: number;
  startedAt: string;
  updatedAt: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let batchSize = 500;
  let target = PANCE_TARGET_TOTAL;
  let maxBatches = 0;
  let metric: "active" | "qaPassed" = "active";
  let dryRun = false;
  let mode: "auto" | "ai" | "procedural" = "auto";

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--batch-size" && args[i + 1]) batchSize = parseInt(args[++i]!, 10);
    else if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    } else if (a === "--mode" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "auto" || m === "ai" || m === "procedural") mode = m;
    } else if (a === "--dry-run") dryRun = true;
  }

  return { batchSize, target, maxBatches, metric, dryRun, mode };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function getCounts() {
  const [active, qaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "pance", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "pance", active: true, qaPassed: true },
    }),
  ]);
  return { active, qaPassed };
}

function runScript(script: string, scriptArgs: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", script, ...scriptArgs],
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

function resolveMode(mode: "auto" | "ai" | "procedural"): "ai" | "procedural" {
  if (mode === "procedural") return "procedural";
  if (mode === "ai") return "ai";
  const key = process.env.OPENAI_API_KEY?.trim();
  return key ? "ai" : "procedural";
}

async function main() {
  const { batchSize, target, maxBatches, metric, dryRun, mode } = parseArgs();
  const resolvedMode = resolveMode(mode);
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const prior = loadCheckpoint();
  const startedAt = prior.startedAt ?? new Date().toISOString();
  let batchesCompleted = prior.batchesCompleted ?? 0;
  let consecutiveZeroInserts = prior.consecutiveZeroInserts ?? 0;
  let lastActiveForBatch = prior.lastActive ?? 0;

  log(
    `PANCE target run — goal ${target} (${metric}), batch ${batchSize}, mode ${resolvedMode}, maxBatches ${maxBatches || "∞"}${dryRun ? " [dry-run]" : ""}`
  );

  if (resolvedMode === "ai" && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required for AI mode.");
    process.exit(1);
  }

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
    });

    log(`Progress: ${current}/${target} active=${active} qaPassed=${qaPassed} batches=${batchesCompleted}`);

    if (current >= target) {
      log(`Target reached (${current} >= ${target}). Done.`);
      break;
    }

    if (maxBatches > 0 && batchesCompleted >= maxBatches) {
      log(`Max batches (${maxBatches}) reached. Stopping with ${current}/${target}.`);
      break;
    }

    const remaining = target - current;
    const count = Math.min(batchSize, remaining);

    if (dryRun) {
      log(`Dry run — would generate ${count} items (${current} → target ${target}).`);
      break;
    }

    log(`▶ Generate batch ${batchesCompleted + 1}: ${count} items (${resolvedMode})`);
    const genScript =
      resolvedMode === "procedural"
        ? "scripts/fill-pance-procedural.ts"
        : "scripts/generate-pance-batch.ts";
    const genArgs =
      resolvedMode === "procedural"
        ? ["--count", String(count), "--target", String(target)]
        : ["--count", String(count)];
    const genCode = await runScript(genScript, genArgs);
    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 30s before retry…`);
      await new Promise((r) => setTimeout(r, 30_000));
      continue;
    }

    log("▶ QA gate (best tier)");
    const qaCode = await runScript("scripts/qa-gate-pance-best.ts", []);
    if (qaCode !== 0) {
      log(`QA gate failed (exit ${qaCode}) — continuing to next batch.`);
    }

    log("▶ Audit");
    await runScript("scripts/audit-pance-bank.ts", []);

    const { active: activeAfterBatch } = await getCounts();
    const insertedThisBatch = activeAfterBatch - lastActiveForBatch;
    lastActiveForBatch = activeAfterBatch;

    if (insertedThisBatch <= 0) {
      consecutiveZeroInserts++;
      log(`No new items this batch (${consecutiveZeroInserts} consecutive).`);
      if (consecutiveZeroInserts >= 3) {
        log(
          "Stopping: 3 consecutive batches with zero inserts. Set OPENAI_API_KEY for AI generation or review procedural saturation."
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
