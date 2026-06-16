#!/usr/bin/env node
/**
 * Loop AANP FNP generation until the bank reaches target — mirrors generate-pance-to-target.
 *
 * Usage:
 *   npm run db:generate-aanp-fnp-to-target
 *   npm run db:generate-aanp-fnp-to-target -- --mode hybrid
 *   npm run db:generate-aanp-fnp-to-target -- --mode procedural
 *   npm run db:generate-aanp-fnp-to-target -- --batch-size 500 --target 6000
 *
 * Modes:
 *   auto       — hybrid if OPENAI_API_KEY set, else procedural
 *   hybrid     — AI + procedural in parallel each iteration (PANCE ramp technique)
 *   ai         — OpenAI only
 *   procedural — template fill only (fast, no API)
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { AANP_FNP_TARGET_TOTAL } from "../src/lib/exam-prep/aanp-fnp";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "aanp-fnp-target-checkpoint.json");
const LOG = path.join(ARTIFACTS, "aanp-fnp-target-run.log");
const AUDIT_EVERY_N_BATCHES = 5;

type RunMode = "auto" | "ai" | "procedural" | "hybrid";
type ResolvedMode = "ai" | "procedural" | "hybrid";

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
  let target = AANP_FNP_TARGET_TOTAL;
  let maxBatches = 0;
  let metric: "active" | "qaPassed" = "active";
  let dryRun = false;
  let mode: RunMode = "auto";
  let turbo = args.includes("--turbo");

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--batch-size" && args[i + 1]) batchSize = parseInt(args[++i]!, 10);
    else if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    } else if (a === "--mode" && args[i + 1]) {
      const m = args[++i]! as RunMode;
      if (m === "auto" || m === "ai" || m === "procedural" || m === "hybrid") mode = m;
    } else if (a === "--dry-run") dryRun = true;
  }

  return { batchSize, target, maxBatches, metric, dryRun, mode, turbo };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function getCounts() {
  const [active, qaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "aanp-fnp", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "aanp-fnp", active: true, qaPassed: true },
    }),
  ]);
  return { active, qaPassed };
}

function runScript(script: string, scriptArgs: string[], turbo: boolean): Promise<number> {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      ...(turbo
        ? {
            AANP_FNP_TURBO: "1",
            AANP_FNP_CONCURRENCY: process.env.AANP_FNP_CONCURRENCY ?? "20",
            AANP_FNP_CHUNK_SIZE: process.env.AANP_FNP_CHUNK_SIZE ?? "20",
          }
        : {}),
    };
    const child = spawn(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", script, ...scriptArgs],
      { cwd: process.cwd(), stdio: "inherit", env }
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

function resolveMode(mode: RunMode): ResolvedMode {
  if (mode === "hybrid") return "hybrid";
  if (mode === "procedural") return "procedural";
  if (mode === "ai") return "ai";
  return process.env.OPENAI_API_KEY?.trim() ? "hybrid" : "procedural";
}

async function runGenerationBatch(
  resolvedMode: ResolvedMode,
  count: number,
  target: number,
  turbo: boolean
): Promise<number> {
  if (resolvedMode === "hybrid") {
    log(`▶ Hybrid batch: AI (${count}) + procedural (${count}) in parallel`);
    const [aiCode, procCode] = await Promise.all([
      runScript("scripts/generate-aanp-fnp-batch.ts", ["--count", String(count)], turbo),
      runScript(
        "scripts/fill-aanp-fnp-procedural.ts",
        ["--count", String(count), "--target", String(target)],
        false
      ),
    ]);
    if (aiCode !== 0 && procCode !== 0) return 1;
    if (aiCode !== 0) log(`AI leg failed (exit ${aiCode}); procedural may have succeeded.`);
    if (procCode !== 0) log(`Procedural leg failed (exit ${procCode}); AI may have succeeded.`);
    return aiCode === 0 || procCode === 0 ? 0 : 1;
  }

  if (resolvedMode === "procedural") {
    return runScript(
      "scripts/fill-aanp-fnp-procedural.ts",
      ["--count", String(count), "--target", String(target)],
      false
    );
  }

  return runScript("scripts/generate-aanp-fnp-batch.ts", ["--count", String(count)], turbo);
}

async function main() {
  const { batchSize, target, maxBatches, metric, dryRun, mode, turbo } = parseArgs();
  const resolvedMode = resolveMode(mode);
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const prior = loadCheckpoint();
  const startedAt = prior.startedAt ?? new Date().toISOString();
  let batchesCompleted = prior.batchesCompleted ?? 0;
  let consecutiveZeroInserts = prior.consecutiveZeroInserts ?? 0;
  let lastActiveForBatch = prior.lastActive ?? 0;

  log(
    `AANP FNP target run — goal ${target} (${metric}), batch ${batchSize}, mode ${resolvedMode}${turbo ? " [turbo]" : ""}, maxBatches ${maxBatches || "∞"}${dryRun ? " [dry-run]" : ""}`
  );

  if ((resolvedMode === "ai" || resolvedMode === "hybrid") && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required for AI/hybrid mode.");
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
    const genCode = await runGenerationBatch(resolvedMode, count, target, turbo);
    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 30s before retry…`);
      await new Promise((r) => setTimeout(r, 30_000));
      continue;
    }

    log("▶ QA gate (aanp-fnp field)");
    const qaCode = await runScript(
      "scripts/qa-gate-question-bank.ts",
      ["--field", "aanp-fnp"],
      false
    );
    if (qaCode !== 0) log(`QA gate failed (exit ${qaCode}) — continuing.`);

    if (batchesCompleted === 0 || (batchesCompleted + 1) % AUDIT_EVERY_N_BATCHES === 0) {
      log("▶ Audit");
      await runScript("scripts/audit-aanp-fnp-bank.ts", ["--json"], false);
    }

    const { active: activeAfterBatch } = await getCounts();
    const insertedThisBatch = activeAfterBatch - lastActiveForBatch;
    lastActiveForBatch = activeAfterBatch;

    if (insertedThisBatch <= 0) {
      consecutiveZeroInserts++;
      log(`No new items this batch (${consecutiveZeroInserts} consecutive).`);
      if (consecutiveZeroInserts >= 3) {
        log("Stopping: 3 consecutive zero-insert batches.");
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
