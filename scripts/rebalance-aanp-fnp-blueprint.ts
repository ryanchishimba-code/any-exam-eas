#!/usr/bin/env node
/**
 * Fill AANP FNP blueprint deficits using deficit-driven batch generation.
 *
 * Usage:
 *   npm run db:rebalance-aanp-fnp
 *   npm run db:rebalance-aanp-fnp -- --count 500 --max-batches 10
 *   npm run db:rebalance-aanp-fnp:dry
 *
 * Checkpoint: artifacts/aanp-fnp-rebalance-checkpoint.json
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  mergeAanpFnpAgeGroupQuotaWithCounts,
  mergeAanpFnpClinicalSystemQuotaWithCounts,
  mergeAanpFnpDomainQuotaWithCounts,
} from "../src/lib/exam-prep/aanp-fnp/blueprint-quota";
import { AANP_FNP_TARGET_TOTAL } from "../src/lib/exam-prep/aanp-fnp/types";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "aanp-fnp-rebalance-checkpoint.json");
const LOG = path.join(ARTIFACTS, "aanp-fnp-rebalance-run.log");

function parseArgs() {
  const args = process.argv.slice(2);
  let target = AANP_FNP_TARGET_TOTAL;
  let countPerBatch = 500;
  let maxBatches = 10;
  let metric: "active" | "qaPassed" = "active";
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--count" && args[i + 1]) countPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    } else if (a === "--dry-run") dryRun = true;
  }

  return { target, countPerBatch, maxBatches, metric, dryRun };
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

async function blueprintDeficits(target: number, metric: "active" | "qaPassed") {
  const where = {
    fieldId: "aanp-fnp" as const,
    active: true,
    ...(metric === "qaPassed" ? { qaPassed: true } : {}),
  };

  const [byDomain, byAge, bySystem] = await Promise.all([
    prisma.questionBankItem.groupBy({
      by: ["blueprintDomain"],
      where: { ...where, blueprintDomain: { not: null } },
      _count: { id: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["patientAgeGroup"],
      where: { ...where, patientAgeGroup: { not: null } },
      _count: { id: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where,
      _count: { id: true },
    }),
  ]);

  const domainCounts: Record<string, number> = {};
  for (const row of byDomain) {
    if (row.blueprintDomain) domainCounts[row.blueprintDomain] = row._count.id;
  }
  const ageCounts: Record<string, number> = {};
  for (const row of byAge) {
    if (row.patientAgeGroup) ageCounts[row.patientAgeGroup] = row._count.id;
  }
  const systemCounts: Record<string, number> = {};
  for (const row of bySystem) {
    systemCounts[row.subjectId] = (systemCounts[row.subjectId] ?? 0) + row._count.id;
  }

  const domainQuotas = mergeAanpFnpDomainQuotaWithCounts(domainCounts, target);
  const ageQuotas = mergeAanpFnpAgeGroupQuotaWithCounts(ageCounts, target);
  const systemQuotas = mergeAanpFnpClinicalSystemQuotaWithCounts(systemCounts, target);

  const domainDeficit = domainQuotas.reduce((s, q) => s + (q.deficit ?? 0), 0);
  const ageDeficit = ageQuotas.reduce((s, q) => s + (q.deficit ?? 0), 0);
  const systemDeficit = systemQuotas.reduce((s, q) => s + (q.deficit ?? 0), 0);

  return {
    domainQuotas,
    ageQuotas,
    systemQuotas,
    totalDeficit: Math.max(domainDeficit, ageDeficit, systemDeficit),
  };
}

async function main() {
  const { target, countPerBatch, maxBatches, metric, dryRun } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  if (!dryRun && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  log(
    `AANP FNP blueprint rebalance — target ${target} (${metric}), ${countPerBatch}/batch, max ${maxBatches}${dryRun ? " [dry-run]" : ""}`
  );

  let batches = 0;
  let consecutiveNoProgress = 0;
  let lastActive = await prisma.questionBankItem.count({
    where: { fieldId: "aanp-fnp", active: true },
  });

  while (true) {
    const { domainQuotas, systemQuotas, totalDeficit } = await blueprintDeficits(target, metric);
    const underDomains = domainQuotas.filter((q) => (q.deficit ?? 0) > 0);
    const underSystems = systemQuotas.filter((q) => (q.deficit ?? 0) > 0);

    log(`Blueprint deficit: ${totalDeficit} (domains: ${underDomains.length}, systems: ${underSystems.length})`);
    for (const q of underDomains) {
      log(`  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} (need ${q.deficit})`);
    }

    fs.writeFileSync(
      CHECKPOINT,
      JSON.stringify(
        { target, metric, totalDeficit, domainQuotas, systemQuotas, batches, updatedAt: new Date().toISOString() },
        null,
        2
      )
    );

    if (totalDeficit === 0) {
      log("All blueprint dimensions at or above target. Done.");
      break;
    }

    if (batches >= maxBatches) {
      log(`Max batches (${maxBatches}) reached. Stopping with deficit ${totalDeficit}.`);
      break;
    }

    if (dryRun) {
      log(`Dry run — would generate ${countPerBatch} items to fill ${totalDeficit} deficit.`);
      break;
    }

    log(`▶ Generate batch ${batches + 1}: ${countPerBatch} items`);
    const genCode = await runScript("scripts/generate-aanp-fnp-batch.ts", [
      "--count",
      String(countPerBatch),
    ]);

    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 60s…`);
      await new Promise((r) => setTimeout(r, 60_000));
      continue;
    }

    const activeAfter = await prisma.questionBankItem.count({
      where: { fieldId: "aanp-fnp", active: true },
    });
    const inserted = activeAfter - lastActive;
    lastActive = activeAfter;
    log(`Batch ${batches + 1} done: +${inserted} active (total ${activeAfter})`);

    if (inserted <= 0) {
      consecutiveNoProgress++;
      if (consecutiveNoProgress >= 3) {
        log("Stopping: 3 consecutive batches with zero inserts.");
        break;
      }
    } else {
      consecutiveNoProgress = 0;
    }

    batches++;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
