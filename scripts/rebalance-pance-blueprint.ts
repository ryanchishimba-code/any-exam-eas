#!/usr/bin/env node
/**
 * Rebalance the PANCE bank to the NCCPA blueprint by filling ONLY under-target
 * content categories until each reaches its blueprint target. No deletions —
 * the bank grows past 6000 if over-target categories already overshot.
 *
 * Usage:
 *   npm run db:rebalance-pance
 *   npm run db:rebalance-pance -- --batch-size 400 --max-batches 20
 *   npm run db:rebalance-pance -- --engine procedural
 *
 * Stops when every category >= blueprint target, max-batches hit, or 3
 * consecutive batches make no progress.
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  computePanceContentQuotas,
  PANCE_TARGET_TOTAL,
} from "../src/lib/exam-prep/pance";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "pance-rebalance-run.log");
const CHECKPOINT = path.join(ARTIFACTS, "pance-rebalance-checkpoint.json");

function parseArgs() {
  const args = process.argv.slice(2);
  let batchSize = 400;
  let maxBatches = 30;
  let engine: "ai" | "procedural" = "ai";
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--batch-size" && args[i + 1]) batchSize = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--engine" && args[i + 1]) {
      const e = args[++i]!;
      if (e === "ai" || e === "procedural") engine = e;
    } else if (a === "--dry-run") dryRun = true;
  }
  return { batchSize, maxBatches, engine, dryRun };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
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

async function categoryDeficits() {
  const rows = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pance", active: true },
    _count: { id: true },
  });
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.subjectId] = r._count.id;

  const quotas = computePanceContentQuotas(PANCE_TARGET_TOTAL);
  const deficits = quotas.map((q) => ({
    category: q.contentCategory,
    have: counts[q.contentCategory] ?? 0,
    target: q.targetCount,
    deficit: Math.max(0, q.targetCount - (counts[q.contentCategory] ?? 0)),
  }));
  const total = deficits.reduce((s, d) => s + d.deficit, 0);
  return { deficits, total };
}

async function main() {
  const { batchSize, maxBatches, engine, dryRun } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  if (engine === "ai" && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY required for --engine ai.");
    process.exit(1);
  }

  log(`PANCE blueprint rebalance — engine ${engine}, batch ${batchSize}, maxBatches ${maxBatches}${dryRun ? " [dry-run]" : ""}`);

  let batches = 0;
  let consecutiveNoProgress = 0;

  while (true) {
    const { deficits, total } = await categoryDeficits();
    const under = deficits.filter((d) => d.deficit > 0);

    log(`Total blueprint deficit: ${total} across ${under.length} categories`);
    for (const d of under) {
      log(`  ${d.category}: ${d.have}/${d.target} (need ${d.deficit})`);
    }

    fs.writeFileSync(
      CHECKPOINT,
      JSON.stringify({ total, deficits, batches, updatedAt: new Date().toISOString() }, null, 2)
    );

    if (total === 0) {
      log("All content categories at or above blueprint target. Rebalance complete.");
      break;
    }
    if (batches >= maxBatches) {
      log(`Max batches (${maxBatches}) reached. Remaining deficit: ${total}.`);
      break;
    }

    const count = Math.min(batchSize, total);
    if (dryRun) {
      log(`Dry run — would generate ${count} items biased to under-target categories.`);
      break;
    }

    log(`▶ Generate batch ${batches + 1}: ${count} items (${engine})`);
    const script =
      engine === "procedural"
        ? "scripts/fill-pance-procedural.ts"
        : "scripts/generate-pance-batch.ts";
    const genArgs =
      engine === "procedural"
        ? ["--count", String(count), "--target", String(PANCE_TARGET_TOTAL)]
        : ["--count", String(count)];

    const genCode = await runScript(script, genArgs);
    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 30s…`);
      await new Promise((r) => setTimeout(r, 30_000));
      continue;
    }

    log("▶ QA gate (pending only)");
    await runScript("scripts/qa-gate-pance-best.ts", ["--only-pending"]);

    const after = await categoryDeficits();
    const progress = total - after.total;
    log(`Batch ${batches + 1} progress: deficit ${total} → ${after.total} (filled ${progress})`);

    if (progress <= 0) {
      consecutiveNoProgress++;
      if (consecutiveNoProgress >= 3) {
        log("No progress for 3 consecutive batches — stopping to avoid a spin loop.");
        break;
      }
    } else {
      consecutiveNoProgress = 0;
    }

    batches++;
  }

  await runScript("scripts/audit-pance-bank.ts", []);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
