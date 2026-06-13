#!/usr/bin/env node
/**
 * Smart NAPLEX curation — triage, rule-polish, optional AI rewrite, QA gate update.
 *
 * Usage:
 *   npm run db:curate-naplex              # all items needing curation
 *   npm run db:curate-naplex:all          # every active pharmacy row
 *   npm run db:curate-naplex -- --dry-run --limit 20
 *   npm run db:curate-naplex -- --ai-only --limit 50
 *
 * Requires OPENAI_API_KEY for AI rewrite stages.
 */
import { PrismaClient } from "@prisma/client";
import {
  curateNaplexBankItem,
  needsNaplexCuration,
} from "../src/lib/engine/curation";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH_SIZE = 40;
const PROGRESS_EVERY = 250;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let subject: string | undefined;
  let dryRun = false;
  let aiOnly = false;
  let forceAi = false;
  let noAi = false;
  let all = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10);
    else if (args[i] === "--subject" && args[i + 1]) subject = args[++i];
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--ai-only") aiOnly = true;
    else if (args[i] === "--force-ai") forceAi = true;
    else if (args[i] === "--no-ai") noAi = true;
    else if (args[i] === "--all") all = true;
  }

  return { limit, subject, dryRun, aiOnly, forceAi, noAi, all };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type RowUpdate = {
  id: string;
  data: {
    scenario: string | null;
    question: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    tags: string | null;
    topicCategory: string | null;
    itemType: string | null;
    contentHash: string;
    qaPassed: boolean;
    qaAuditedAt: Date;
    source: string;
  };
};

async function flushUpdates(pending: RowUpdate[]) {
  if (pending.length === 0) return;
  const now = new Date();
  await prisma.$transaction(
    pending.map((u) =>
      prisma.questionBankItem.update({
        where: { id: u.id },
        data: { ...u.data, qaAuditedAt: now },
      })
    )
  );
  pending.length = 0;
}

function shouldProcess(
  item: ReturnType<typeof enrichBankItemFromRow>,
  all: boolean,
  aiOnly: boolean,
  forceAi: boolean
): boolean {
  if (all || aiOnly || forceAi) return true;
  return needsNaplexCuration(item, true);
}

async function main() {
  const { limit, subject, dryRun, aiOnly, forceAi, noAi, all } = parseArgs();

  if (!process.env.OPENAI_API_KEY && !noAi && (aiOnly || forceAi)) {
    console.error("OPENAI_API_KEY required for --ai-only / --force-ai");
    process.exit(1);
  }

  const totalCount = await prisma.questionBankItem.count({
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(subject ? { subjectId: subject } : {}),
    },
  });

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(subject ? { subjectId: subject } : {}),
    },
    orderBy: { id: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(
    `\nNAPLEX curation engine — ${rows.length}/${totalCount} item(s)${dryRun ? " [dry-run]" : ""}${all ? " [all]" : ""}${aiOnly ? " [AI only]" : ""}\n`
  );

  const stats = {
    scanned: 0,
    skipped: 0,
    pass: 0,
    rulePolish: 0,
    aiRewrite: 0,
    failed: 0,
    updated: 0,
    errors: 0,
  };

  const pending: RowUpdate[] = [];

  for (const row of rows) {
    stats.scanned++;
    const item = enrichBankItemFromRow(row);

    if (!shouldProcess(item, all, aiOnly, forceAi)) {
      stats.skipped++;
      stats.pass++;
      if (stats.scanned % PROGRESS_EVERY === 0) {
        console.log(`  … ${stats.scanned}/${rows.length} scanned, ${stats.updated} updated`);
      }
      continue;
    }

    const fieldSubject = getFieldSubject("pharmacy", row.subjectId);
    const label = fieldSubject?.label ?? row.subjectId;

    try {
      const result = await curateNaplexBankItem(item, row.subjectId, {
        subjectLabel: label,
        seed: seedFromId(row.id),
        useAi: !noAi,
        aiOnly,
        forceAi,
      });

      if (result.stage === "pass" && !result.changed) {
        stats.pass++;
        continue;
      }
      if (result.stage === "rule_polish") stats.rulePolish++;
      else if (result.stage === "ai_rewrite") stats.aiRewrite++;
      else stats.failed++;

      if (!result.changed || !result.validationOk) {
        if (!result.validationOk) {
          console.log(
            `  [fail] ${row.id.slice(0, 10)}… score ${result.qualityBefore.toFixed(2)}→${result.qualityAfter.toFixed(2)} | ${result.validationIssues.slice(0, 2).join("; ")}`
          );
        }
        continue;
      }

      const finalItem = result.item;
      const finalHash = bankItemContentHash("pharmacy", row.subjectId, finalItem);
      const collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });
      if (collision) {
        stats.skipped++;
        console.log(`  [collision] ${row.id.slice(0, 10)}…`);
        continue;
      }

      const qaOk = auditBankItem(finalItem, "pharmacy").ok;

      if (dryRun) {
        console.log(
          `  [dry-run] ${row.id.slice(0, 10)}… ${result.stage} ${result.qualityBefore.toFixed(2)}→${result.qualityAfter.toFixed(2)} qa=${qaOk}${result.aiUsed ? " (AI)" : ""}`
        );
        stats.updated++;
        continue;
      }

      pending.push({
        id: row.id,
        data: {
          scenario: finalItem.vignette ?? finalItem.scenario ?? null,
          question: finalItem.question,
          options: serializeBankOptions(finalItem),
          correctAnswer: finalItem.correctAnswer,
          explanation: finalItem.explanation,
          tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
          topicCategory: finalItem.topicCategory ?? row.topicCategory,
          itemType: finalItem.itemType ?? row.itemType,
          contentHash: finalHash,
          qaPassed: qaOk,
          qaAuditedAt: new Date(),
          source: result.aiUsed ? "ai-curated" : "curated",
        },
      });
      stats.updated++;

      if (pending.length >= BATCH_SIZE) {
        await flushUpdates(pending);
      }
    } catch (e) {
      stats.errors++;
      console.error(`  error ${row.id}:`, e instanceof Error ? e.message : e);
    }

    if (stats.scanned % PROGRESS_EVERY === 0) {
      console.log(
        `  … ${stats.scanned}/${rows.length} scanned, ${stats.updated} updated, ${stats.rulePolish} polished, ${stats.aiRewrite} AI`
      );
    }
  }

  await flushUpdates(pending);

  console.log(`\n── Curation summary ──`);
  console.log(`Scanned:      ${stats.scanned}`);
  console.log(`Skipped OK:   ${stats.skipped}`);
  console.log(`Already pass: ${stats.pass}`);
  console.log(`Rule polish:  ${stats.rulePolish}`);
  console.log(`AI rewrite:   ${stats.aiRewrite}`);
  console.log(`Failed QA:    ${stats.failed}`);
  console.log(`${dryRun ? "Would update" : "Updated"}:    ${stats.updated}`);
  console.log(`Errors:       ${stats.errors}`);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
