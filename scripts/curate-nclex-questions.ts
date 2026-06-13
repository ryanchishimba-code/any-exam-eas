#!/usr/bin/env node
/**
 * Smart NCLEX curation — triage, rule-polish, optional AI rewrite, QA gate update.
 *
 * Usage:
 *   npm run db:curate-nclex -- --dry-run --limit 20
 *   npm run db:curate-nclex -- --ai-only --limit 50
 *   npm run db:curate-nclex -- --force-ai --limit 10
 *   npm run db:curate-nclex -- --editorial --force-ai --limit 500
 *   npm run db:curate-nclex -- --subject med-surg
 *
 * Requires OPENAI_API_KEY for AI rewrite stages.
 */
import { loadEnvFiles, requireOpenAiKey } from "./load-env";
loadEnvFiles();
import { PrismaClient } from "@prisma/client";
import { curateNclexBankItem, triageNclexBankItem } from "../src/lib/engine/curation";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { hasNclexEditorialWarnFlags, nclexHasServeBlockIssues } from "../src/lib/exam-prep/nclex-bank-audit";
import { needsNclexPolish } from "../src/lib/engine/polish/nclex-polish";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import type { QuestionBankItem } from "@prisma/client";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let subject: string | undefined;
  let dryRun = false;
  let aiOnly = false;
  let forceAi = false;
  let noAi = false;
  let all = false;
  let editorial = false;
  let failing = false;
  let safety = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10);
    else if (args[i] === "--subject" && args[i + 1]) subject = args[++i];
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--ai-only") aiOnly = true;
    else if (args[i] === "--force-ai") forceAi = true;
    else if (args[i] === "--no-ai") noAi = true;
    else if (args[i] === "--all") all = true;
    else if (args[i] === "--editorial") editorial = true;
    else if (args[i] === "--failing") failing = true;
    else if (args[i] === "--safety") safety = true;
  }

  return { limit, subject, dryRun, aiOnly, forceAi, noAi, all, editorial, failing, safety };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function needsCurationRow(item: ReturnType<typeof enrichBankItemFromRow>): boolean {
  return needsNclexPolish(item) || hasNclexEditorialWarnFlags(item);
}

async function collectEditorialRows(
  limit: number,
  subject?: string
): Promise<QuestionBankItem[]> {
  const BATCH = 400;
  const picked: QuestionBankItem[] = [];
  let cursor: string | undefined;

  while (limit <= 0 || picked.length < limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        ...(subject ? { subjectId: subject } : {}),
        ...(cursor ? { id: { gt: cursor } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      if (needsCurationRow(item)) {
        picked.push(row);
        if (limit > 0 && picked.length >= limit) break;
      }
    }
    cursor = rows[rows.length - 1]!.id;
  }

  return picked;
}

async function collectSafetyRows(
  limit: number,
  subject?: string
): Promise<QuestionBankItem[]> {
  const BATCH = 400;
  const picked: QuestionBankItem[] = [];
  let cursor: string | undefined;

  while (limit <= 0 || picked.length < limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        ...(subject ? { subjectId: subject } : {}),
        ...(cursor ? { id: { gt: cursor } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      if (nclexHasServeBlockIssues(item)) {
        picked.push(row);
        if (limit > 0 && picked.length >= limit) break;
      }
    }
    cursor = rows[rows.length - 1]!.id;
  }

  return picked;
}

async function main() {
  const { limit, subject, dryRun, aiOnly, forceAi, noAi, all, editorial, failing, safety } =
    parseArgs();

  if (!noAi && (aiOnly || forceAi)) requireOpenAiKey();

  const rows = editorial
    ? await collectEditorialRows(limit > 0 ? limit : 0, subject)
    : safety
      ? await collectSafetyRows(limit > 0 ? limit : 0, subject)
      : await prisma.questionBankItem.findMany({
          where: {
            fieldId: "nursing",
            active: true,
            ...(failing ? { qaPassed: false } : {}),
            ...(subject ? { subjectId: subject } : {}),
          },
          orderBy: { id: "asc" },
          ...(limit > 0 ? { take: limit } : {}),
        });

  console.log(
    `\nNCLEX curation engine — ${rows.length} item(s)${dryRun ? " [dry-run]" : ""}${aiOnly ? " [AI only]" : ""}${editorial ? " [editorial queue]" : ""}${failing ? " [qa failures]" : ""}${safety ? " [safety blocks]" : ""}\n`
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

  for (const row of rows) {
    stats.scanned++;
    const item = enrichBankItemFromRow(row);
    const triage = triageNclexBankItem(item);

    if (!all && !aiOnly && !forceAi && !triage.needsPolish && triage.qaGateOk) {
      stats.skipped++;
      stats.pass++;
      continue;
    }

    const fieldSubject = getFieldSubject("nursing", row.subjectId);
    const label = fieldSubject?.label ?? row.subjectId;

    try {
      const result = await curateNclexBankItem(item, row.subjectId, {
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
      const finalHash = bankItemContentHash("nursing", row.subjectId, finalItem);
      const collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });
      if (collision) {
        stats.skipped++;
        console.log(`  [collision] ${row.id.slice(0, 10)}…`);
        continue;
      }

      const qaOk = auditBankItem(finalItem, "nursing").ok;

      if (dryRun) {
        console.log(
          `  [dry-run] ${row.id.slice(0, 10)}… ${result.stage} ${result.qualityBefore.toFixed(2)}→${result.qualityAfter.toFixed(2)} qa=${qaOk}${result.aiUsed ? " (AI)" : ""}`
        );
        stats.updated++;
        continue;
      }

      await prisma.questionBankItem.update({
        where: { id: row.id },
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
    } catch (e) {
      stats.errors++;
      console.error(`  error ${row.id}:`, e instanceof Error ? e.message : e);
    }
  }

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
