#!/usr/bin/env node
/**
 * Compare NAPLEX bank counts: total active, qaPassed, best-tier, and per-subject breakdown.
 *
 * Usage:
 *   npm run db:report-naplex-counts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../src/lib/exam-prep/naplex-quality-gate";

const prisma = new PrismaClient();
const TARGET = 16691;
const BATCH = 500;

async function main() {
  const total = await prisma.questionBankItem.count({ where: { fieldId: "pharmacy" } });
  const active = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });
  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true, qaPassed: true },
  });
  const inactive = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: false },
  });

  console.log(`\nNAPLEX production count report\n`);
  console.log(`Total rows:        ${total}`);
  console.log(`Active:            ${active}`);
  console.log(`Active + qaPassed: ${qaPassed} (served to students)`);
  console.log(`Inactive:          ${inactive}`);

  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let acceptable = 0;
  let reject = 0;
  let activeBest = 0;
  let activeQaPassedNotBest = 0;
  let activeNotQaPassed = 0;
  let inactiveBest = 0;
  const bySubject: Record<
    string,
    { total: number; best: number; qaPassed: number; active: number }
  > = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
      select: {
        id: true,
        subjectId: true,
        active: true,
        qaPassed: true,
        source: true,
        scenario: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        tags: true,
        topicCategory: true,
        itemType: true,
      },
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const verdict = assessNaplexItemQuality(item, { source: row.source });
      const isBest = isNaplexBestQuality(item, { source: row.source });

      if (isBest) best++;
      if (verdict.tier === "acceptable") acceptable++;
      if (verdict.tier === "reject") reject++;

      if (row.active && isBest) activeBest++;
      else if (row.active && row.qaPassed && !isBest) activeQaPassedNotBest++;
      else if (row.active && !row.qaPassed) activeNotQaPassed++;
      else if (!row.active && isBest) inactiveBest++;

      const sid = row.subjectId;
      if (!bySubject[sid]) {
        bySubject[sid] = { total: 0, best: 0, qaPassed: 0, active: 0 };
      }
      bySubject[sid].total++;
      if (isBest) bySubject[sid].best++;
      if (row.qaPassed) bySubject[sid].qaPassed++;
      if (row.active) bySubject[sid].active++;
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 5000 === 0 || processed === total) {
      console.log(`  … scored ${processed}/${total}`);
    }
  }

  const servedMatch = qaPassed === best;
  const targetMet = qaPassed >= 4000;

  const report = {
    generatedAt: new Date().toISOString(),
    targetAPlus: TARGET,
    total,
    active,
    inactive,
    qaPassedServed: qaPassed,
    bestTierScored: best,
    activeBestTier: activeBest,
    activeQaPassedNotBest,
    activeNotQaPassed,
    inactiveBestTier: inactiveBest,
    acceptableTier: acceptable,
    rejectTier: reject,
    servedMatchesBestTier: servedMatch,
    premiumTargetMet: targetMet,
    gapFromLocalReviewTarget: qaPassed - TARGET,
    bySubject: Object.fromEntries(
      Object.entries(bySubject).sort((a, b) => a[0].localeCompare(b[0]))
    ),
  };

  const outPath = path.join(process.cwd(), "artifacts", "naplex-production-counts.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`\n── Quality tiers (all rows) ──`);
  console.log(`Best tier:       ${best}`);
  console.log(`Acceptable:      ${acceptable}`);
  console.log(`Reject:          ${reject}`);
  console.log(`\n── Serve integrity ──`);
  console.log(`Active + best:           ${activeBest}`);
  console.log(`Active + qaPassed !best: ${activeQaPassedNotBest} (stale — served but below A+ bar)`);
  console.log(`Active, not qaPassed:    ${activeNotQaPassed}`);
  console.log(`Inactive + best:         ${inactiveBest} (archived A+ candidates)`);
  console.log(`qaPassed = active best:  ${qaPassed === activeBest ? "YES ✓" : "NO — re-run db:review-naplex"}`);
  console.log(`Premium ≥4k:     ${targetMet ? "YES ✓" : "NO"}`);
  console.log(`Gap vs review:   ${qaPassed - TARGET} (review kept ${TARGET})`);
  console.log(`\n── By subject (active / qaPassed / best) ──`);
  for (const [sid, s] of Object.entries(bySubject).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${sid}: active ${s.active}, qaPassed ${s.qaPassed}, best ${s.best}`);
  }
  console.log(`\nReport: ${outPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
