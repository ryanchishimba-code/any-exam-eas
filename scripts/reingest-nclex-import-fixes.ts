#!/usr/bin/env node
/**
 * Re-ingest fixed community NCLEX seed packs without OpenAI.
 *
 * Deletes existing import-pack rows, inserts fresh seed rows from
 * community-nclex-practice-40 + community-nclex-dosage-calc-100, then runs
 * polish-nclex-import-packs.ts and qa-gate-nclex-best.ts.
 *
 * Usage:
 *   npm run db:reingest-nclex-import-fixes
 *   npm run db:reingest-nclex-import-fixes -- --dry-run
 *   npm run db:reingest-nclex-import-fixes -- --skip-polish
 */
import { execSync } from "node:child_process";
import { loadEnvFiles } from "./load-env";
import { ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  COMMUNITY_NCLEX_DOSAGE_CALC_100,
  communityDosageItemToBankItem,
} from "../src/lib/edtech/seeds/community-nclex-dosage-calc-100";
import {
  getActiveCommunityNclexPracticeItems,
  communityItemToBankItem,
} from "../src/lib/edtech/seeds/community-nclex-practice-40";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { NCLEX_FULL_EXAM_VERSION } from "../src/lib/exam-prep/nclex/types";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();

const PACKS = [
  {
    tag: "community-pack-40",
    generationVersion: `${NCLEX_FULL_EXAM_VERSION}-community-import`,
    items: getActiveCommunityNclexPracticeItems().map((row) => ({
      subjectId: row.subjectId,
      topicCategory: row.topicCategory,
      item: communityItemToBankItem(row),
    })),
  },
  {
    tag: "community-dosage-calc-100",
    generationVersion: `${NCLEX_FULL_EXAM_VERSION}-dosage-calc-import`,
    items: COMMUNITY_NCLEX_DOSAGE_CALC_100.map((row) => ({
      subjectId: row.subjectId,
      topicCategory: row.topicCategory,
      item: communityDosageItemToBankItem(row),
    })),
  },
] as const;

const dryRun = process.argv.includes("--dry-run");
const skipPolish = process.argv.includes("--skip-polish");

async function upsertSeedRow(
  packTag: string,
  generationVersion: string,
  subjectId: string,
  topicCategory: string,
  item: BankItem
): Promise<"inserted" | "reactivated" | "unchanged"> {
  const hash = bankItemContentHash("nursing", subjectId, item);
  const existing = await prisma.questionBankItem.findUnique({
    where: { contentHash: hash },
    select: { id: true, active: true },
  });

  if (existing) {
    if (!existing.active) {
      if (dryRun) return "reactivated";
      await prisma.questionBankItem.update({
        where: { id: existing.id },
        data: {
          active: true,
          qaPassed: false,
          reviewStatus: "pending",
          source: item.source ?? "ai-curated",
        },
      });
      return "reactivated";
    }
    return "unchanged";
  }

  if (dryRun) return "inserted";

  await prisma.questionBankItem.create({
    data: {
      fieldId: "nursing",
      subjectId,
      difficulty: item.difficulty ?? 3,
      topicCategory: item.topicCategory ?? topicCategory,
      blueprintDomain: "nclex-community-oer",
      generationVersion,
      reviewStatus: "pending",
      itemType: item.itemType ?? "vignette",
      question: item.question,
      scenario: item.vignette ?? null,
      options: serializeBankOptions(item),
      correctAnswer: item.correctAnswer,
      explanation: item.explanation ?? "",
      references: item.references ?? undefined,
      tags: JSON.stringify(item.tags ?? []),
      source: item.source ?? "ai-curated",
      contentHash: hash,
      active: true,
      qaPassed: false,
    },
  });
  return "inserted";
}

async function main() {
  console.log(
    `\nNCLEX import re-ingest — ${PACKS.reduce((n, p) => n + p.items.length, 0)} seed items${dryRun ? " [dry-run]" : ""}\n`
  );

  let deleted = 0;
  let inserted = 0;
  let reactivated = 0;
  let unchanged = 0;

  for (const pack of PACKS) {
    if (!dryRun) {
      const result = await prisma.questionBankItem.deleteMany({
        where: { fieldId: "nursing", tags: { contains: pack.tag } },
      });
      deleted += result.count;
      console.log(`  [delete] ${pack.tag}: ${result.count} row(s)`);
    } else {
      const count = await prisma.questionBankItem.count({
        where: { fieldId: "nursing", tags: { contains: pack.tag } },
      });
      console.log(`  [dry-run delete] ${pack.tag}: ${count} row(s)`);
    }

    for (const row of pack.items) {
      const outcome = await upsertSeedRow(
        pack.tag,
        pack.generationVersion,
        row.subjectId,
        row.topicCategory,
        row.item
      );
      if (outcome === "inserted") inserted++;
      else if (outcome === "reactivated") reactivated++;
      else unchanged++;
    }
  }

  console.log(
    `\nRe-ingest: deleted=${deleted}, inserted=${inserted}, reactivated=${reactivated}, unchanged=${unchanged}`
  );

  if (dryRun || skipPolish) {
    if (!dryRun) {
      await reportCounts();
    }
    return;
  }

  console.log("\nRunning import pack polish…\n");
  execSync("npx tsx scripts/polish-nclex-import-packs.ts --skip-qa-gate", {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  console.log("\nRunning NCLEX best QA gate…\n");
  execSync("npx tsx scripts/qa-gate-nclex-best.ts", {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  await reportCounts();
}

async function reportCounts() {
  const packTags = ["community-pack-40", "community-dosage-calc-100"];
  const importActive = await prisma.questionBankItem.count({
    where: {
      fieldId: "nursing",
      active: true,
      OR: packTags.map((tag) => ({ tags: { contains: tag } })),
    },
  });
  const importBest = await prisma.questionBankItem.count({
    where: {
      fieldId: "nursing",
      active: true,
      qaPassed: true,
      OR: packTags.map((tag) => ({ tags: { contains: tag } })),
    },
  });
  const totalBest = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  const importTarget =
    getActiveCommunityNclexPracticeItems().length + COMMUNITY_NCLEX_DOSAGE_CALC_100.length;

  console.log(`\nImport packs active: ${importActive}`);
  console.log(`Import packs best-tier (qaPassed): ${importBest} / ${importTarget} target`);
  console.log(`Total nursing bank best-tier (qaPassed): ${totalBest} / 4000 target`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
