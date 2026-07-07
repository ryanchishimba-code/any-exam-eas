#!/usr/bin/env node
/**
 * Fill NAPLEX blueprint deficits using full-exam generation (NABP 2026 slots).
 * Generates blueprint-balanced 80Q exams until each area meets its target or limits hit.
 *
 * Usage:
 *   npm run db:rebalance-naplex
 *   npm run db:rebalance-naplex -- --exams-per-batch 2 --max-batches 5
 *   npm run db:rebalance-naplex -- --dry-run
 *
 * Checkpoint: artifacts/naplex-rebalance-checkpoint.json
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { mergeNaplexQuotaWithCounts, NAPLEX_PHARMACOTHERAPY_SUBJECT_IDS } from "../src/lib/exam-prep/naplex/blueprint-quota";
import { aggregateNaplex2026BlueprintCounts } from "../src/lib/exam-prep/naplex/legacy-blueprint-map";
import type { NaplexBlueprintAreaId } from "../src/lib/exam-prep/naplex/types";
import { NAPLEX_TARGET_TOTAL } from "../src/lib/exam-prep/naplex/types";

const DEFAULT_PHARM_SUBJECTS = [...NAPLEX_PHARMACOTHERAPY_SUBJECT_IDS];

/** Map 2026 deficit areas → generation subject focus. */
const AREA_FOCUS_SUBJECTS: Record<NaplexBlueprintAreaId, string[]> = {
  "naplex-2026-pharmacotherapy": [...NAPLEX_PHARMACOTHERAPY_SUBJECT_IDS],
  "naplex-2026-patient-centered-care": ["patient-counseling", "pharmacology"],
  "naplex-2026-pharmacist-tasks": ["pharmacy-law", "patient-counseling"],
  "naplex-2026-medication-dispensing": ["compounding-calculations", "pharmaceutics"],
  "naplex-2026-drug-information": ["pharmacology", "pharmacokinetics"],
  "naplex-2026-health-wellness": ["otc-self-care", "patient-counseling"],
};

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const CHECKPOINT = path.join(ARTIFACTS, "naplex-rebalance-checkpoint.json");
const LOG = path.join(ARTIFACTS, "naplex-rebalance-run.log");

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NAPLEX_TARGET_TOTAL;
  let examsPerBatch = 2;
  let countPerExam = 80;
  let maxBatches = 10;
  let metric: "active" | "qaPassed" = "active";
  let dryRun = false;
  let subjects: string[] = [];
  let focusArea = "naplex-2026-pharmacotherapy";
  let fillDeficits = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--exams-per-batch" && args[i + 1]) examsPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--count" && args[i + 1]) countPerExam = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    } else if (a === "--subjects" && args[i + 1]) {
      subjects = args[++i]!.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--area" && args[i + 1]) focusArea = args[++i]!;
    else if (a === "--fill-deficits") fillDeficits = true;
    else if (a === "--dry-run") dryRun = true;
  }

  if (subjects.length === 0 && args.includes("--pharmacotherapy")) {
    subjects = DEFAULT_PHARM_SUBJECTS;
  }

  return { target, examsPerBatch, countPerExam, maxBatches, metric, dryRun, subjects, focusArea, fillDeficits };
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
  const rows = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain", "subjectId", "itemType"],
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(metric === "qaPassed" ? { qaPassed: true } : {}),
    },
    _count: { id: true },
  });

  const aggregated = aggregateNaplex2026BlueprintCounts(
    rows.map((row) => ({
      blueprintDomain: row.blueprintDomain,
      subjectId: row.subjectId,
      itemType: row.itemType,
      count: row._count.id,
    }))
  );

  const counts: Record<string, number> = { ...aggregated };
  const quotas = mergeNaplexQuotaWithCounts(counts, target);
  const totalDeficit = quotas.reduce((s, q) => s + (q.deficit ?? 0), 0);
  return { quotas, totalDeficit };
}

async function main() {
  let { target, examsPerBatch, countPerExam, maxBatches, metric, dryRun, subjects, focusArea, fillDeficits } =
    parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  if (!dryRun && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  let subjectRotation = subjects.length > 0 ? subjects : DEFAULT_PHARM_SUBJECTS;
  let subjectMode = subjects.length > 0 || process.argv.includes("--pharmacotherapy") || fillDeficits;

  log(
    `NAPLEX blueprint rebalance — target ${target} (${metric}), ${examsPerBatch} exam(s) × ${countPerExam}/batch, max ${maxBatches}${dryRun ? " [dry-run]" : ""}${fillDeficits ? " [fill-deficits]" : subjectMode ? ` [subjects: ${subjectRotation.join(", ")}]` : ""}`
  );

  let batches = 0;
  let consecutiveNoProgress = 0;
  let lastActive = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });

  while (true) {
    const { quotas, totalDeficit } = await blueprintDeficits(target, metric);
    const under = quotas.filter((q) => (q.deficit ?? 0) > 0);

    if (fillDeficits && under.length > 0) {
      const top = [...under].sort((a, b) => (b.deficit ?? 0) - (a.deficit ?? 0))[0]!;
      focusArea = top.blueprintArea;
      subjectRotation = AREA_FOCUS_SUBJECTS[top.blueprintArea as NaplexBlueprintAreaId] ?? DEFAULT_PHARM_SUBJECTS;
      subjectMode = true;
    }

    const focusQuota = quotas.find((q) => q.blueprintArea === focusArea);
    const areaDeficit = fillDeficits
      ? (focusQuota?.deficit ?? 0)
      : subjectMode
        ? (focusQuota?.deficit ?? 0)
        : totalDeficit;

    log(`Blueprint deficit: ${totalDeficit} across ${under.length} areas`);
    if (subjectMode && focusQuota) {
      log(
        `  Focus area ${focusQuota.label}: ${focusQuota.currentCount ?? 0}/${focusQuota.targetCount} (need ${areaDeficit})`
      );
    }
    for (const q of under) {
      log(`  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} (need ${q.deficit})`);
    }

    fs.writeFileSync(
      CHECKPOINT,
      JSON.stringify({ target, metric, totalDeficit, quotas, batches, updatedAt: new Date().toISOString() }, null, 2)
    );

    if (areaDeficit === 0) {
      log(
        subjectMode
          ? `Focus area ${focusArea} at or above target. Done.`
          : "All blueprint areas at or above target. Done."
      );
      break;
    }

    if (batches >= maxBatches) {
      log(`Max batches (${maxBatches}) reached. Stopping with deficit ${areaDeficit}.`);
      break;
    }

    if (dryRun) {
      log(
        `Dry run — would generate ${examsPerBatch} exam(s) × ${countPerExam} to fill ${areaDeficit} deficit.`
      );
      break;
    }

    const batchSubject = subjectRotation[batches % subjectRotation.length]!;
    log(`▶ Generate batch ${batches + 1}: ${examsPerBatch} exam(s) × ${countPerExam}${subjectMode ? ` [${batchSubject}]` : ""}`);
    const genArgs = [
      "--exams",
      String(examsPerBatch),
      "--count",
      String(countPerExam),
      "--insert",
    ];
    if (subjectMode) {
      genArgs.push("--subjects", batchSubject);
    }
    const genCode = await runScript("scripts/generate-naplex-full-exams.ts", genArgs);

    if (genCode !== 0) {
      log(`Generate failed (exit ${genCode}). Waiting 60s…`);
      await new Promise((r) => setTimeout(r, 60_000));
      continue;
    }

    if (batches === 0 || (batches + 1) % 3 === 0) {
      log("▶ QA gate (best tier)");
      const qaCode = await runScript("scripts/qa-gate-naplex-best.ts", []);
      if (qaCode !== 0) log(`QA gate exit ${qaCode} — continuing.`);
    }

    const activeAfter = await prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true },
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
