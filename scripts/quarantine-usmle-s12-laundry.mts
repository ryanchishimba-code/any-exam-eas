#!/usr/bin/env node
/**
 * Quarantine laundry-list / non-vignette serve items for USMLE Step1+Step2.
 * Pulls tough-rater rejects + heuristic short non-vignette stems.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-usmle-s12-laundry.mts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-usmle-s12-laundry.mts --limit 400
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FIELDS = ["usmle-step-1", "usmle-step-2"] as const;
const REVIEW = "usmle_s12_laundry_quarantine";

const PATIENT_RE =
  /\b(?:\d{1,3}[-\s]?year[-\s]?old|\d{1,2}[-\s]?yo\b|presents with|brought to|comes to|admitted|complains of|chief complaint|vital signs|BP\s*\d)/i;
const LAUNDRY_RE =
  /^(?:which of the following|all of the following|true statements? about|correct statements? regarding|most accurate statement)/i;

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let limit = 400;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
  }
  return { dryRun, limit };
}

function toughRejectIds(fieldId: string): string[] {
  const p = path.join(
    process.cwd(),
    "tmp",
    `usmle-nbme-tough-rating-${fieldId}.json`
  );
  if (!existsSync(p)) return [];
  const j = JSON.parse(readFileSync(p, "utf8")) as {
    itemScores?: Array<{ id: string; score: number; weaknesses?: string[] }>;
  };
  return (j.itemScores ?? [])
    .filter(
      (x) =>
        x.score <= 3 ||
        (x.weaknesses ?? []).some((w) => /laundry|non-vignette/i.test(w))
    )
    .map((x) => x.id);
}

function looksLikeLaundry(question: string, scenario: string | null): boolean {
  const stem = `${scenario ?? ""}\n${question}`.replace(/\s+/g, " ").trim();
  if (stem.length < 40) return true;
  if (PATIENT_RE.test(stem)) return false;
  const q = question.replace(/\s+/g, " ").trim();
  if (LAUNDRY_RE.test(q) && stem.length < 280) return true;
  if (!PATIENT_RE.test(stem) && stem.length < 160 && /which of the following/i.test(q))
    return true;
  return false;
}

async function main() {
  const { dryRun, limit } = parseArgs();
  const report: Record<
    string,
    { toughIds: number; heuristic: number; quarantined: number; ids: string[] }
  > = {};

  for (const fieldId of FIELDS) {
    const toughIds = toughRejectIds(fieldId);
    const idSet = new Set(toughIds);

    const serve = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, qaPassed: true },
      select: {
        id: true,
        question: true,
        scenario: true,
        itemType: true,
        qualityScore: true,
      },
      take: 8000,
      orderBy: { qualityScore: "asc" },
    });

    let heuristic = 0;
    for (const row of serve) {
      if (idSet.size >= limit) break;
      if (idSet.has(row.id)) continue;
      const type = row.itemType ?? "mcq";
      if (type !== "mcq" && type !== "vignette") continue;
      if (!looksLikeLaundry(row.question, row.scenario)) continue;
      idSet.add(row.id);
      heuristic++;
    }

    const ids = [...idSet].slice(0, limit);
    if (!dryRun && ids.length > 0) {
      await prisma.questionBankItem.updateMany({
        where: { id: { in: ids } },
        data: {
          active: false,
          qaPassed: false,
          reviewStatus: REVIEW,
          updatedAt: new Date(),
        },
      });
    }

    report[fieldId] = {
      toughIds: toughIds.length,
      heuristic,
      quarantined: ids.length,
      ids,
    };
    console.log(
      `${fieldId}: tough=${toughIds.length} heuristic+=${heuristic} → ${dryRun ? "would quarantine" : "quarantined"} ${ids.length}`
    );
  }

  const outDir = path.join(process.cwd(), "artifacts");
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "usmle-s12-laundry-quarantine.json");
  writeFileSync(
    out,
    JSON.stringify({ dryRun, reviewStatus: REVIEW, checkedAt: new Date().toISOString(), report }, null, 2)
  );
  console.log(`Wrote ${out}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
