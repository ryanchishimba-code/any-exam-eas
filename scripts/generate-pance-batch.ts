#!/usr/bin/env node
/**
 * Generate PANCE questions in blueprint-aligned batches (default 500).
 *
 * Usage:
 *   npm run db:generate-pance -- --count 500
 *   npm run db:generate-pance:dry -- --count 10
 *
 * Requires OPENAI_API_KEY and DATABASE_URL.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  generatePanceBatch,
  mergePanceQuotaWithCounts,
  PANCE_GENERATION_VERSION,
  PANCE_TARGET_TOTAL,
} from "../src/lib/exam-prep/pance";
import { collectPanceSeedItems } from "../src/lib/edtech/seeds/pance-seed-registry";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 500;
  let dryRun = false;
  let category: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--category" && args[i + 1]) category = args[++i];
  }
  return { count, dryRun, category };
}

async function main() {
  const { count, dryRun, category } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const rows = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pance", active: true },
    _count: { id: true },
  });

  const countsByCategory: Record<string, number> = {};
  for (const row of rows) {
    countsByCategory[row.subjectId] = row._count.id;
  }

  const quota = mergePanceQuotaWithCounts(countsByCategory, PANCE_TARGET_TOTAL);
  const deficitsByCategory: Record<string, number> = {};
  for (const q of quota) {
    deficitsByCategory[q.contentCategory] = category
      ? q.contentCategory === category
        ? q.deficit ?? q.targetCount
        : 0
      : (q.deficit ?? 0);
  }

  console.log(`PANCE bank progress (${PANCE_TARGET_TOTAL} target):`);
  for (const q of quota) {
    console.log(
      `  ${q.contentCategory}: ${q.currentCount ?? 0}/${q.targetCount} (deficit ${q.deficit ?? 0})`
    );
  }

  const exemplars = collectPanceSeedItems();
  console.log(`\nGenerating ${count} items using ${exemplars.length} seed exemplars…`);

  const result = await generatePanceBatch({
    count,
    deficitsByCategory,
    exemplarItems: exemplars,
    onProgress: (done, total) => {
      if (done % 50 === 0 || done === total) {
        console.log(`  Progress: ${done}/${total}`);
      }
    },
  });

  console.log(
    `\nBatch ${result.batchId}: ${result.items.length} accepted, ${result.rejected} rejected, ${result.diversityIssues} diversity flags`
  );

  const reportPath = path.join(ARTIFACTS, `pance-generate-${result.batchId}.json`);
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        batchId: result.batchId,
        accepted: result.items.length,
        rejected: result.rejected,
        diversityIssues: result.diversityIssues,
        quota,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  if (dryRun) {
    console.log(`Dry run — would insert ${result.items.length} items. Report: ${reportPath}`);
    return;
  }

  let created = 0;
  let skipped = 0;
  for (const item of result.items) {
    const subjectId = item.subjectId ?? "cardiovascular";
    const hash = bankItemContentHash("pance", subjectId, item);
    const exists = await prisma.questionBankItem.findUnique({ where: { contentHash: hash } });
    if (exists) {
      skipped++;
      continue;
    }

    const taskCategory =
      (item.ngnPayload?.taskCategory as string | undefined) ?? null;
    const blueprintTopic =
      (item.ngnPayload?.blueprintTopic as string | undefined) ?? null;
    const generationMeta = item.ngnPayload?.generationMeta ?? null;

    await prisma.questionBankItem.create({
      data: {
        fieldId: "pance",
        subjectId,
        scenario: item.vignette ?? null,
        difficulty: item.difficulty ?? 3,
        topicCategory: item.topicCategory ?? subjectId,
        blueprintDomain: item.blueprintDomain ?? subjectId,
        taskCategory,
        blueprintTopic,
        generationVersion: PANCE_GENERATION_VERSION,
        reviewStatus: "pending",
        generationMeta: generationMeta ?? undefined,
        itemType: "vignette",
        question: item.question,
        options: serializeBankOptions(item),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        tags: item.tags ? JSON.stringify(item.tags) : null,
        references: item.references?.length ? item.references : undefined,
        source: "generated",
        contentHash: hash,
        active: true,
        qaPassed: false,
      },
    });
    created++;
  }

  console.log(`Inserted ${created} items (${skipped} duplicates skipped).`);
  console.log(`Next: npm run db:qa-gate-pance-best`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
