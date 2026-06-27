#!/usr/bin/env node
/**
 * Raise USMLE Step 1 / Step 3 editorial exam-ready rate to a target (default 90%).
 *
 * 1. Deterministic gap fixes
 * 2. Optional strict AI curation on failing cohort
 * 3. Retire lowest-scoring failing items + generate exam-ready replacements
 *
 * Usage:
 *   npx tsx scripts/raise-usmle-exam-ready.ts --field usmle-step-1
 *   npx tsx scripts/raise-usmle-exam-ready.ts --field usmle-step-1 --field usmle-step-3
 *   npx tsx scripts/raise-usmle-exam-ready.ts --target 0.9 --curation-limit 100 --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { fixUsmleAuditGaps } from "../src/lib/exam-prep/usmle-audit-gap-fixes";
import { fixUsmleEditorialGaps } from "../src/lib/exam-prep/usmle-editorial-gap-fixes";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { generateUsmleFullExam } from "../src/lib/exam-prep/usmle";
import type { UsmleStepLevel } from "../src/lib/exam-prep/usmle/types";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "raise-usmle-exam-ready.log");

const FIELD_TO_STEP: Record<string, UsmleStepLevel> = {
  "usmle-step-1": "step1",
  "usmle-step-2": "step2",
  "usmle-step-3": "step3",
};

function parseArgs() {
  const args = process.argv.slice(2);
  const fields: string[] = [];
  let target = 0.9;
  let curationLimit = 0;
  let skipCuration = false;
  let skipGenerate = false;
  let dryRun = false;
  let replaceBatch = 100;
  let generateOnly = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) fields.push(args[++i]!);
    else if (args[i] === "--target" && args[i + 1]) target = Number.parseFloat(args[++i]!);
    else if (args[i] === "--curation-limit" && args[i + 1])
      curationLimit = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--replace-batch" && args[i + 1])
      replaceBatch = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--generate-only" && args[i + 1])
      generateOnly = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--skip-curation") skipCuration = true;
    else if (args[i] === "--skip-generate") skipGenerate = true;
    else if (args[i] === "--dry-run") dryRun = true;
  }

  if (fields.length === 0) fields.push("usmle-step-1", "usmle-step-3");
  return { fields, target, curationLimit, skipCuration, skipGenerate, dryRun, replaceBatch, generateOnly };
}

function log(msg: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + "\n");
}

function sleepMs(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type FieldStats = {
  total: number;
  examReady: number;
  rate: number;
  failing: Array<{ id: string; score: number }>;
};

async function measureField(fieldId: string): Promise<FieldStats> {
  log(`  measuring ${fieldId}…`);
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true },
    orderBy: { id: "asc" },
  });

  let examReady = 0;
  const failing: Array<{ id: string; score: number }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    const item = enrichBankItemFromRow(row);
    const report = auditUsmleQaEditor(item, {
      fieldId,
      source: row.source,
      itemId: row.id,
      difficulty: row.difficulty,
    });
    if (report.examReady) examReady++;
    else failing.push({ id: row.id, score: report.overallScore });
    if ((i + 1) % 2000 === 0) log(`    … ${i + 1}/${rows.length} scored`);
  }

  failing.sort((a, b) => a.score - b.score);
  const total = rows.length;
  return { total, examReady, rate: total ? examReady / total : 0, failing };
}

async function runGapFixes(fieldId: string, dryRun: boolean): Promise<number> {
  let updated = 0;
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true },
    orderBy: { id: "asc" },
  });

  for (const row of rows) {
    let item = enrichBankItemFromRow(row);
    const beforeReady = auditUsmleQaEditor(item, {
      fieldId,
      source: row.source,
      itemId: row.id,
    }).examReady;
    if (beforeReady) continue;

    for (const fix of [fixUsmleAuditGaps, fixUsmleEditorialGaps]) {
      const result = fix(item);
      if (result.changed) item = result.item;
    }

    const afterReady = auditUsmleQaEditor(item, {
      fieldId,
      source: row.source,
      itemId: row.id,
    }).examReady;
    if (!afterReady && JSON.stringify(item) === JSON.stringify(enrichBankItemFromRow(row))) continue;

    const hash = bankItemContentHash(fieldId, row.subjectId, item);
    const collision = await prisma.questionBankItem.findFirst({
      where: { contentHash: hash, NOT: { id: row.id } },
    });
    if (collision) continue;

    if (dryRun) {
      updated++;
      continue;
    }

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        question: item.question,
        scenario: item.vignette ?? item.scenario ?? row.scenario,
        options: serializeBankOptions(item),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        contentHash: hash,
        source: "polished",
        qaPassed: usmleBankItemIsServeReady(item, fieldId),
        qaAuditedAt: new Date(),
      },
    });
    updated++;
  }

  return updated;
}

async function runStrictCuration(
  fieldId: string,
  ids: string[],
  dryRun: boolean
): Promise<{ updated: number; accepted: number; rejected: number }> {
  const { curateUsmleBankItem, isUsmleCurationEnabled } = await import(
    "../src/lib/engine/curation"
  );
  if (!isUsmleCurationEnabled()) {
    log("  curation skipped — OPENAI_API_KEY not set");
    return { updated: 0, accepted: 0, rejected: 0 };
  }

  let updated = 0;
  let accepted = 0;
  let rejected = 0;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!;
    const row = await prisma.questionBankItem.findUnique({ where: { id } });
    if (!row?.active || row.fieldId !== fieldId) continue;

    const item = enrichBankItemFromRow(row);
    try {
      const result = await curateUsmleBankItem(item, {
        fieldId,
        itemId: row.id,
        source: row.source,
        difficulty: row.difficulty,
        minAcceptScore: 8,
        requireExamReady: true,
        aiFirst: true,
        maxAiAttempts: 3,
        seed: Math.abs(id.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)),
      });

      if (result.action === "accepted") {
        accepted++;
        continue;
      }
      if (result.action === "rejected" || !result.after.examReady) {
        rejected++;
        continue;
      }
      if (!auditBankItem(result.item, fieldId).ok) {
        rejected++;
        continue;
      }

      const hash = bankItemContentHash(fieldId, row.subjectId, result.item);
      const collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: hash, NOT: { id: row.id } },
      });
      if (collision) {
        rejected++;
        continue;
      }

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            question: result.item.question,
            scenario: result.item.vignette ?? result.item.scenario ?? row.scenario,
            options: serializeBankOptions(result.item),
            correctAnswer: result.item.correctAnswer,
            explanation: result.item.explanation,
            contentHash: hash,
            source: "ai-curated",
            itemType: "vignette",
            qaPassed: true,
            qaAuditedAt: new Date(),
          },
        });
      }
      updated++;
      if ((i + 1) % 10 === 0) {
        log(`  curated ${i + 1}/${ids.length} — updated ${updated}, accepted ${accepted}, rejected ${rejected}`);
      }
    } catch (e) {
      rejected++;
      log(`  curation error ${id.slice(0, 10)}: ${e instanceof Error ? e.message : String(e)}`);
    }
    await sleepMs(7000);
  }

  return { updated, accepted, rejected };
}

async function retireWorst(fieldId: string, ids: string[], dryRun: boolean): Promise<number> {
  if (ids.length === 0) return 0;
  if (dryRun) return ids.length;
  await prisma.questionBankItem.updateMany({
    where: { id: { in: ids } },
    data: { active: false, qaPassed: false },
  });
  return ids.length;
}

async function generateReplacements(
  fieldId: string,
  stepLevel: UsmleStepLevel,
  needed: number,
  dryRun: boolean
): Promise<number> {
  if (needed <= 0 || dryRun) return dryRun ? needed : 0;
  if (!process.env.OPENAI_API_KEY) {
    log("  generation skipped — OPENAI_API_KEY not set");
    return 0;
  }

  let inserted = 0;
  let examNumber = 9000 + (stepLevel === "step1" ? 0 : 500);
  const batchId = `raise-exam-ready-${fieldId}-${Date.now()}`;

  while (inserted < needed) {
    const chunk = Math.min(60, needed - inserted + 15);
    log(`  generating ${chunk} ${stepLevel} items (exam ${examNumber})…`);
    const exam = await generateUsmleFullExam({
      examNumber,
      questionCount: chunk,
      batchId,
      stepLevel,
    });

    for (const item of exam.items) {
      if (inserted >= needed) break;
      const report = auditUsmleQaEditor(item, {
        fieldId,
        source: "ai-curated",
        difficulty: item.difficulty ?? null,
      });
      if (!report.examReady) continue;

      const subjectId = item.subjectId ?? "internal-medicine";
      const hash = bankItemContentHash(fieldId, subjectId, item);
      const exists = await prisma.questionBankItem.findUnique({ where: { contentHash: hash } });
      if (exists) continue;

      await prisma.questionBankItem.create({
        data: {
          fieldId,
          subjectId,
          scenario: item.vignette ?? null,
          difficulty: item.difficulty ?? 3,
          topicCategory: item.topicCategory ?? subjectId,
          blueprintDomain: item.blueprintDomain ?? undefined,
          stepLevel,
          itemType: item.itemType ?? "vignette",
          question: item.question,
          options: serializeBankOptions(item),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          tags: item.tags ? JSON.stringify(item.tags) : JSON.stringify(["ai-curated", "USMLE-2026"]),
          source: "ai-curated",
          contentHash: hash,
          active: true,
          qaPassed: true,
          qaAuditedAt: new Date(),
        },
      });
      inserted++;
    }

    log(`  +${inserted}/${needed} exam-ready replacements inserted`);
    examNumber++;
    if (exam.items.length === 0) break;
  }

  return inserted;
}

async function raiseField(
  fieldId: string,
  target: number,
  curationLimit: number,
  skipCuration: boolean,
  skipGenerate: boolean,
  dryRun: boolean,
  replaceBatch: number
) {
  const stepLevel = FIELD_TO_STEP[fieldId];
  if (!stepLevel) throw new Error(`Unsupported field: ${fieldId}`);

  log(`\n══ ${fieldId} → target ${(target * 100).toFixed(0)}% exam-ready ══`);

  let stats = await measureField(fieldId);
  log(`  baseline: ${stats.examReady}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);

  const gapFixed = await runGapFixes(fieldId, dryRun);
  log(`  gap fixes: ${gapFixed} updated`);
  stats = await measureField(fieldId);
  log(`  after gaps: ${stats.examReady}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);

  if (!skipCuration && stats.rate < target && stats.failing.length > 0) {
    const toCurate = curationLimit > 0 ? stats.failing.slice(0, curationLimit) : stats.failing;
    log(`  strict curation: ${toCurate.length} item(s)…`);
    const c = await runStrictCuration(
      fieldId,
      toCurate.map((f) => f.id),
      dryRun
    );
    log(`  curation done — updated ${c.updated}, accepted ${c.accepted}, rejected ${c.rejected}`);
    stats = await measureField(fieldId);
    log(`  after curation: ${stats.examReady}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);
  }

  if (!skipGenerate) {
    while (stats.rate < target && stats.failing.length > 0) {
      const needReady = Math.ceil(target * stats.total) - stats.examReady;
      if (needReady <= 0) break;

      const retireCount = Math.min(
        replaceBatch > 0 ? replaceBatch : needReady,
        needReady,
        stats.failing.length
      );
      const toRetire = stats.failing.slice(0, retireCount).map((f) => f.id);
      log(`  below target — generating ${retireCount} replacements, retiring ${retireCount} worst failing…`);

      const generated = await generateReplacements(fieldId, stepLevel, retireCount, dryRun);
      log(`  generated ${generated} exam-ready replacement(s)`);

      const toRetireFinal = toRetire.slice(0, Math.min(retireCount, generated || 0));
      if (toRetireFinal.length === 0) break;

      const retired = await retireWorst(fieldId, toRetireFinal, dryRun);
      log(`  retired ${retired} failing item(s)`);

      stats = await measureField(fieldId);
      log(`  after swap: ${stats.examReady}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);

      if (generated === 0) break;
      if (stats.rate >= target) break;
    }
  }

  if (stats.rate < target && stats.failing.length > 0) {
    const retireOnly = Math.min(
      stats.failing.length,
      Math.ceil(stats.total - stats.examReady / target)
    );
    if (retireOnly > 0) {
      log(`  retire-only fallback: deactivating ${retireOnly} lowest-scoring failing item(s)…`);
      await retireWorst(
        fieldId,
        stats.failing.slice(0, retireOnly).map((f) => f.id),
        dryRun
      );
      stats = await measureField(fieldId);
      log(`  after retire-only: ${stats.examReady}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);
    }
  }

  if (stats.rate < target && skipGenerate) {
    const needDeactivate = Math.ceil(stats.total - stats.examReady / target);
    log(
      `  still ${(stats.rate * 100).toFixed(1)}% — would need ~${needDeactivate} more retirements without generation`
    );
  }

  log(`  final: ${stats.examReady}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);
  return stats;
}

async function main() {
  const { fields, target, curationLimit, skipCuration, skipGenerate, dryRun, replaceBatch, generateOnly } =
    parseArgs();
  log(
    `raise-usmle-exam-ready — fields=${fields.join(",")} target=${target} replaceBatch=${replaceBatch} dryRun=${dryRun}`
  );

  for (const fieldId of fields) {
    if (generateOnly > 0) {
      const stepLevel = FIELD_TO_STEP[fieldId];
      if (!stepLevel) throw new Error(`Unsupported field: ${fieldId}`);
      log(`\n══ ${fieldId} — generate-only backfill ${generateOnly} ══`);
      const n = await generateReplacements(fieldId, stepLevel, generateOnly, dryRun);
      log(`  backfill inserted: ${n}`);
      continue;
    }
    await raiseField(
      fieldId,
      target,
      curationLimit,
      skipCuration,
      skipGenerate,
      dryRun,
      replaceBatch
    );
  }

  log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
