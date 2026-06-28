#!/usr/bin/env node
/**
 * Fill PANCE bank to target using polished procedural templates (no OpenAI).
 *
 * Usage:
 *   npm run db:fill-pance-procedural -- --count 500
 *   npm run db:fill-pance-procedural -- --target 6000
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { generateBulkQuestionsForSubject } from "../src/lib/bulk-question-generator";
import { polishUsmleBankItem } from "../src/lib/engine/polish/usmle-polish";
import {
  assessPanceBankItem,
  isPanceBestQuality,
  mergePanceQuotaWithCounts,
  planPanceGenerationSlots,
  PANCE_GENERATION_VERSION,
  PANCE_TARGET_TOTAL,
} from "../src/lib/exam-prep/pance";
import { getFieldSubject } from "../src/lib/field-subjects";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const SEQ_FILE = path.join(ARTIFACTS, "pance-generation-seq.txt");

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 500;
  let target = PANCE_TARGET_TOTAL;
  let dryRun = false;
  let minScore = 8;
  let seqStart: number | undefined;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--min-score" && args[i + 1]) minScore = parseFloat(args[++i]!);
    else if (a === "--seq-start" && args[i + 1]) seqStart = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
  }
  return { count, target, dryRun, minScore, seqStart };
}

function readGenerationSeq(): number {
  try {
    const n = parseInt(fs.readFileSync(SEQ_FILE, "utf8").trim(), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeGenerationSeq(seq: number) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  fs.writeFileSync(SEQ_FILE, String(seq));
}

async function currentActive() {
  return prisma.questionBankItem.count({
    where: { fieldId: "pance", active: true },
  });
}

async function categoryCounts() {
  const rows = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pance", active: true },
    _count: { id: true },
  });
  const out: Record<string, number> = {};
  for (const row of rows) out[row.subjectId] = row._count.id;
  return out;
}

function buildProceduralItem(
  generationSeq: number,
  slot: ReturnType<typeof planPanceGenerationSlots>[number]
) {
  const subject = getFieldSubject("pance", slot.contentCategory);
  if (!subject) return null;

  const bulkIndex = generationSeq * 97 + slot.contentCategory.length;
  const raw = generateBulkQuestionsForSubject("pance", subject, bulkIndex, 1)[0];
  if (!raw) return null;

  const polished = polishUsmleBankItem(
    raw,
    "pance",
    slot.contentCategory,
    "PANCE",
    generationSeq
  ).item;

  return {
    ...polished,
    subjectId: slot.contentCategory,
    topicCategory: slot.contentCategory,
    blueprintDomain: slot.contentCategory,
    difficulty: slot.difficulty,
    tags: [
      ...(polished.tags ?? []).filter((t) => t !== "bulk-bank"),
      "pance-procedural",
      "PANCE-2025",
      slot.contentCategory,
      slot.taskCategory,
    ],
    ngnPayload: {
      ...polished.ngnPayload,
      taskCategory: slot.taskCategory,
      blueprintTopic: slot.blueprintTopic,
      blueprintSystem: slot.contentCategory,
      generationMeta: {
        pipelineVersion: PANCE_GENERATION_VERSION,
        procedural: true,
        generationSeq,
        generatedAt: new Date().toISOString(),
      },
    },
  };
}

async function main() {
  const { count, target, dryRun, minScore, seqStart } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const activeBefore = await currentActive();
  const remaining = Math.max(0, target - activeBefore);
  const countsByCategory = await categoryCounts();
  const quota = mergePanceQuotaWithCounts(countsByCategory, target);
  const deficitsByCategory: Record<string, number> = {};
  for (const q of quota) {
    deficitsByCategory[q.contentCategory] = q.deficit ?? 0;
  }
  const totalDeficit = Object.values(deficitsByCategory).reduce((s, d) => s + d, 0);

  if (remaining === 0 && totalDeficit === 0) {
    console.log(`PANCE bank already at ${activeBefore}/${target}.`);
    return;
  }

  // Rebalance path: total may exceed target while categories remain under-filled.
  const insertBudget =
    remaining > 0 ? Math.min(count, remaining) : Math.min(count, totalDeficit);

  if (remaining === 0 && totalDeficit > 0) {
    console.log(
      `PANCE bank at ${activeBefore}/${target} — rebalancing ${totalDeficit} category deficit (${insertBudget} insert budget)`
    );
  }

  let generationSeq = seqStart ?? readGenerationSeq();
  if (generationSeq < activeBefore) generationSeq = activeBefore;
  const generationSeqStart = generationSeq;

  const attemptCount = Math.ceil(insertBudget * 3.5);

  console.log(
    `PANCE procedural fill: ${activeBefore}/${target} — attempting ${attemptCount} slots from seq ${generationSeq}`
  );

  const slots = planPanceGenerationSlots({
    count: attemptCount,
    deficitsByCategory,
    seed: generationSeq,
  });

  let accepted = 0;
  let rejected = 0;
  let inserted = 0;
  let skipped = 0;
  const batchId = `proc-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

  for (let i = 0; i < slots.length; i++) {
    if (inserted >= insertBudget) break;

    const slot = slots[i]!;
    const seq = generationSeq++;
    const item = buildProceduralItem(seq, slot);
    if (!item) {
      rejected++;
      continue;
    }

    if (!isPanceBestQuality(item, { minScore })) {
      rejected++;
      continue;
    }

    accepted++;
    if (dryRun) continue;

    const subjectId = slot.contentCategory;
    const hash = bankItemContentHash("pance", subjectId, item);
    const exists = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });
    if (exists) {
      skipped++;
      continue;
    }

    const qc = assessPanceBankItem(item, { source: "generated" });
    const taskCategory = slot.taskCategory;
    const blueprintTopic = slot.blueprintTopic;
    const generationMeta = item.ngnPayload?.generationMeta ?? null;

    await prisma.questionBankItem.create({
      data: {
        fieldId: "pance",
        subjectId,
        scenario: item.vignette ?? null,
        difficulty: item.difficulty ?? slot.difficulty,
        topicCategory: subjectId,
        blueprintDomain: subjectId,
        taskCategory,
        blueprintTopic,
        generationVersion: PANCE_GENERATION_VERSION,
        reviewStatus: qc.reviewStatus,
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
        qaPassed: true,
        qaAuditedAt: new Date(),
        lastReviewedAt: new Date(),
      },
    });
    inserted++;

    if (inserted % 100 === 0) {
      console.log(`  Inserted ${inserted} (${accepted} accepted, ${rejected} rejected)`);
    }
  }

  if (!dryRun) writeGenerationSeq(generationSeq);

  const activeAfter = dryRun ? activeBefore : await currentActive();
  const report = {
    batchId,
    activeBefore,
    activeAfter,
    target,
    attemptCount,
    generationSeqStart,
    generationSeqEnd: generationSeq,
    accepted,
    rejected,
    inserted,
    skipped,
    dryRun,
    generatedAt: new Date().toISOString(),
  };

  const reportPath = path.join(ARTIFACTS, `pance-procedural-${batchId}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(
    `\nBatch ${batchId}: ${inserted} inserted, ${accepted} accepted, ${rejected} rejected, ${skipped} dupes`
  );
  console.log(`Bank: ${activeAfter}/${target} (${Math.round((activeAfter / target) * 100)}%)`);
  console.log(`Report: ${reportPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
