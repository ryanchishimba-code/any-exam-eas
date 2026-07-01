#!/usr/bin/env node
/**
 * Ingest community NCLEX practice pack → AI elevate → best QA gate.
 *
 * Usage:
 *   npm run db:ingest-nclex-community-pack
 *   npm run db:ingest-nclex-community-pack -- --dry-run
 *   npm run db:ingest-nclex-community-pack -- --skip-curate
 *   npm run db:ingest-nclex-community-pack -- --curate-only
 *
 * After OpenAI quota is restored, run the full resume pipeline:
 *   npm run db:resume-nclex-after-quota
 * (community curate-only → dosage curate-only → generate to 4000 best-tier, 8 batches/round)
 */
import { loadEnvFiles, requireOpenAiKey } from "./load-env";
import { ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  getActiveCommunityNclexPracticeItems,
  communityItemToBankItem,
} from "../src/lib/edtech/seeds/community-nclex-practice-40";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { curateNclexBankItem } from "../src/lib/engine/curation";
import { enrichBankItemGuidelines } from "../src/lib/exam-prep/enrich-guidelines";
import { nclexItemPassesBestExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import { getFieldSubject } from "../src/lib/field-subjects";
import { NCLEX_FULL_EXAM_VERSION } from "../src/lib/exam-prep/nclex/types";

const prisma = new PrismaClient();
const PACK_TAG = "community-pack-40";

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    skipCurate: args.includes("--skip-curate"),
    curateOnly: args.includes("--curate-only"),
  };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function main() {
  const { dryRun, skipCurate, curateOnly } = parseArgs();
  if (!dryRun && !skipCurate) requireOpenAiKey();

  const practiceItems = getActiveCommunityNclexPracticeItems();
  console.log(`\nNCLEX community pack — ${practiceItems.length} items${dryRun ? " [dry-run]" : ""}${curateOnly ? " [curate-only]" : ""}\n`);

  const insertedIds: string[] = [];
  let skipped = 0;

  if (curateOnly) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, tags: { contains: PACK_TAG }, qaPassed: false },
      select: { id: true },
    });
    insertedIds.push(...rows.map((r) => r.id));
    console.log(`Curate-only: ${insertedIds.length} pending item(s)`);
  } else for (const row of practiceItems) {
    const item = communityItemToBankItem(row);
    const hash = bankItemContentHash("nursing", row.subjectId, item);

    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      insertedIds.push(existing.id);
      continue;
    }

    if (dryRun) {
      console.log(`  [dry-run] would insert: ${row.question.slice(0, 60)}…`);
      continue;
    }

    const created = await prisma.questionBankItem.create({
      data: {
        fieldId: "nursing",
        subjectId: row.subjectId,
        difficulty: item.difficulty ?? 3,
        topicCategory: item.topicCategory ?? row.topicCategory,
        blueprintDomain: "nclex-community-oer",
        generationVersion: `${NCLEX_FULL_EXAM_VERSION}-community-import`,
        reviewStatus: "pending",
        itemType: item.itemType ?? "vignette",
        question: item.question,
        scenario: item.vignette ?? null,
        options: serializeBankOptions(item),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation ?? "",
        tags: JSON.stringify(item.tags ?? []),
        source: item.source ?? "ai-curated",
        contentHash: hash,
        active: true,
        qaPassed: false,
      },
    });
    insertedIds.push(created.id);
  }

  if (curateOnly) {
    console.log(`Curate-only mode — skipping insert`);
  } else {
    console.log(`Inserted: ${insertedIds.length - skipped} new, ${skipped} existing`);
  }

  if (dryRun || skipCurate) {
    return;
  }

  let curated = 0;
  let best = 0;

  for (const id of insertedIds) {
    const row = await prisma.questionBankItem.findUnique({ where: { id } });
    if (!row) continue;

    const fieldSubject = getFieldSubject("nursing", row.subjectId);
    const item = enrichBankItemFromRow(row);

    const result = await curateNclexBankItem(item, row.subjectId, {
      subjectLabel: fieldSubject?.label ?? row.subjectId,
      seed: seedFromId(row.id),
      useAi: true,
      forceAi: true,
    });

    if (!result.changed || !result.validationOk) {
      console.log(`  [curate-fail] ${id.slice(0, 10)}… ${result.validationIssues.slice(0, 2).join("; ")}`);
      continue;
    }

    curated++;
    const { item: enriched } = enrichBankItemGuidelines(result.item, "nursing");
    const pass = nclexItemPassesBestExamGate(enriched);

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        question: enriched.question,
        scenario: enriched.vignette ?? enriched.scenario ?? null,
        options: serializeBankOptions(enriched),
        correctAnswer: enriched.correctAnswer,
        explanation: enriched.explanation ?? "",
        tags: JSON.stringify([...new Set([...(enriched.tags ?? []), PACK_TAG, "curated"])]),
        source: "ai-curated",
        reviewStatus: pass ? "approved" : "pending",
        qaPassed: pass,
      },
    });

    if (pass) best++;
  }

  console.log(`\nCurated: ${curated}/${insertedIds.length} | Best-tier: ${best}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
