#!/usr/bin/env node
/**
 * Upsert hand-crafted USMLE seeds (physician-educator, quality-v2) and mark qaPassed.
 *
 * Usage:
 *   npx tsx scripts/sync-usmle-curated-seeds.ts
 *   npx tsx scripts/sync-usmle-curated-seeds.ts --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { collectHighYieldSeedRows } from "../src/lib/exam-prep/high-yield-index";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { isUsmleCuratedItem } from "../src/lib/question-bank/usmle-curated";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

function seedRowToData(fieldId: string, subjectId: string, item: BankItem) {
  const contentHash = bankItemContentHash(fieldId, subjectId, item);
  return {
    fieldId,
    subjectId,
    scenario: item.vignette ?? item.scenario ?? null,
    difficulty: item.difficulty ?? null,
    topicCategory: item.topicCategory ?? null,
    blueprintDomain: item.blueprintDomain ?? null,
    itemType: item.itemType ?? "mcq",
    stepLevel:
      typeof item.ngnPayload?.stepLevel === "string"
        ? (item.ngnPayload.stepLevel as string)
        : null,
    question: item.question,
    options: serializeBankOptions(item),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps ? JSON.stringify(item.solutionSteps) : null,
    tags: item.tags ? JSON.stringify(item.tags) : null,
    references: item.references?.length ? item.references : undefined,
    source: "seed" as const,
    contentHash,
    active: true,
    qaPassed: isUsmleCuratedItem(item),
  };
}

async function main() {
  const rows = collectHighYieldSeedRows().filter(
    (r) => r.fieldId.startsWith("usmle") && isUsmleCuratedItem(r.item)
  );

  console.log(`\nUSMLE curated seed sync — ${rows.length} item(s)${dryRun ? " [dry-run]" : ""}\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const data = seedRowToData(row.fieldId, row.subjectId, row.item);
    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: data.contentHash },
    });

    if (!existing) {
      if (!dryRun) await prisma.questionBankItem.create({ data });
      created++;
      console.log(`  + ${row.fieldId}/${row.subjectId} (${row.item.tags?.slice(0, 3).join(", ")})`);
      continue;
    }

    const unchanged =
      existing.question === data.question &&
      existing.correctAnswer === data.correctAnswer &&
      existing.options === data.options &&
      existing.qaPassed === data.qaPassed &&
      existing.active;

    if (unchanged) {
      skipped++;
      continue;
    }

    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { contentHash: data.contentHash },
        data,
      });
    }
    updated++;
    console.log(`  ~ ${row.fieldId}/${row.subjectId}`);
  }

  console.log(`\nCreated: ${created}  Updated: ${updated}  Skipped: ${skipped}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
