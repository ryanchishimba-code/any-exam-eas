#!/usr/bin/env node
/**
 * Unified board curation — editorial AI, failing queue, and serve-ready polish across all exams.
 *
 * Usage:
 *   npm run db:curate-board -- --field pance --editorial --force-ai --limit 100
 *   npm run db:curate-board -- --field all --failing --force-ai
 *   npm run db:curate-board -- --field nursing --editorial --force-ai
 *
 * Requires OPENAI_API_KEY for AI rewrite stages.
 */
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient, type QuestionBankItem } from "@prisma/client";
import {
  curateNclexBankItem,
  curateNaplexBankItem,
  curateUsmleBankItem,
  needsNaplexCuration,
  triageNclexBankItem,
} from "../src/lib/engine/curation";
import {
  bankItemIsBoardBestQuality,
  boardFieldLabel,
  resolveBoardFieldArg,
  type BoardFieldId,
} from "../src/lib/exam-prep/board-serve-registry";
import { enrichBankItemGuidelines } from "../src/lib/exam-prep/enrich-guidelines";
import { hasNclexEditorialWarnFlags } from "../src/lib/exam-prep/nclex-bank-audit";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { nclexItemPassesBestExamGate, nclexItemPassesTimedExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import { needsNclexPolish } from "../src/lib/engine/polish/nclex-polish";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { usmleServeMinQaScore } from "../src/lib/exam-prep/usmle/steps";
import { isPanceBestQuality } from "../src/lib/exam-prep/pance/quality-gate";
import { isAanpFnpBestQuality } from "../src/lib/exam-prep/aanp-fnp/quality-gate";
import { isNptePtBestQuality } from "../src/lib/exam-prep/npte-pt/quality-gate";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();
const BATCH = 400;

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "all";
  let limit = 0;
  let subject: string | undefined;
  let dryRun = false;
  let aiOnly = false;
  let forceAi = false;
  let noAi = false;
  let all = false;
  let editorial = false;
  let failing = false;
  let serveReady = false;
  const excludeFields: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--exclude-field" && args[i + 1]) excludeFields.push(args[++i]!);
    else if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--subject" && args[i + 1]) subject = args[++i];
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--ai-only") aiOnly = true;
    else if (args[i] === "--force-ai") forceAi = true;
    else if (args[i] === "--no-ai") noAi = true;
    else if (args[i] === "--all") all = true;
    else if (args[i] === "--editorial") editorial = true;
    else if (args[i] === "--failing") failing = true;
    else if (args[i] === "--serve-ready") serveReady = true;
  }

  return {
    fields: resolveBoardFieldArg(field, excludeFields),
    limit,
    subject,
    dryRun,
    aiOnly,
    forceAi,
    noAi,
    all,
    editorial,
    failing,
    serveReady,
  };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function itemNeedsEditorial(fieldId: BoardFieldId, item: BankItem, source?: string | null): boolean {
  if (fieldId === "nursing") {
    return needsNclexPolish(item) || hasNclexEditorialWarnFlags(item);
  }
  if (fieldId === "pharmacy") {
    return needsNaplexCuration(item);
  }
  if (fieldId === "pance") return !isPanceBestQuality(item);
  if (fieldId === "aanp-fnp") return !isAanpFnpBestQuality(item);
  if (fieldId === "npte-pt") return !isNptePtBestQuality(item);

  if (!usmleBankItemIsServeReady(item, fieldId)) return true;
  const report = auditUsmleQaEditor(item, {
    fieldId,
    source: source ?? "bulk",
    itemId: "",
    difficulty: null,
  });
  const min = usmleServeMinQaScore(fieldId) ?? 8;
  return report.overallScore < min;
}

async function collectEditorialRows(
  fieldId: BoardFieldId,
  limit: number,
  subject?: string
): Promise<QuestionBankItem[]> {
  const picked: QuestionBankItem[] = [];
  let cursor: string | undefined;

  while (limit <= 0 || picked.length < limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId,
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
      if (itemNeedsEditorial(fieldId, item, row.source)) {
        picked.push(row);
        if (limit > 0 && picked.length >= limit) break;
      }
    }
    cursor = rows[rows.length - 1]!.id;
  }

  return picked;
}

async function loadRows(
  fieldId: BoardFieldId,
  opts: {
    limit: number;
    subject?: string;
    editorial: boolean;
    failing: boolean;
    serveReady: boolean;
  }
): Promise<QuestionBankItem[]> {
  if (opts.editorial) {
    return collectEditorialRows(fieldId, opts.limit > 0 ? opts.limit : 0, opts.subject);
  }

  return prisma.questionBankItem.findMany({
    where: {
      fieldId,
      active: true,
      ...(opts.failing ? { qaPassed: false } : {}),
      ...(opts.serveReady ? { qaPassed: true } : {}),
      ...(opts.subject ? { subjectId: opts.subject } : {}),
    },
    orderBy: { id: "asc" },
    ...(opts.limit > 0 ? { take: opts.limit } : {}),
  });
}

function qaOkAfterCuration(
  fieldId: BoardFieldId,
  item: BankItem,
  row: QuestionBankItem,
  serveReady: boolean,
  source: string
): boolean {
  if (fieldId === "nursing") {
    const itemForGate = { ...item, source };
    if (row.qaPassed || serveReady) return nclexItemPassesBestExamGate(itemForGate);
    return (
      assessNclexItemQuality(item, { source }).tier === "best" &&
      nclexItemPassesTimedExamGate(itemForGate)
    );
  }
  return bankItemIsBoardBestQuality(fieldId, { ...item, source }, { source: row.source });
}

async function curateRow(
  fieldId: BoardFieldId,
  row: QuestionBankItem,
  opts: {
    useForceAi: boolean;
    aiOnly: boolean;
    noAi: boolean;
    all: boolean;
  }
) {
  const item = enrichBankItemFromRow(row);
  const fieldSubject = getFieldSubject(fieldId, row.subjectId);
  const label = fieldSubject?.label ?? row.subjectId;

  if (fieldId === "nursing") {
    const triage = triageNclexBankItem(item);
    if (!opts.all && !opts.aiOnly && !opts.useForceAi && !triage.needsPolish && triage.qaGateOk) {
      return { kind: "skip" as const };
    }
    const result = await curateNclexBankItem(item, row.subjectId, {
      subjectLabel: label,
      seed: seedFromId(row.id),
      useAi: !opts.noAi,
      aiOnly: opts.aiOnly,
      forceAi: opts.useForceAi,
    });
    return {
      kind: "nclex" as const,
      result,
      item: result.item,
      changed: result.changed,
      validationOk: result.validationOk,
      validationIssues: result.validationIssues,
      stage: result.stage,
      qualityBefore: result.qualityBefore,
      qualityAfter: result.qualityAfter,
      aiUsed: result.aiUsed,
    };
  }

  if (fieldId === "pharmacy") {
    if (!opts.all && !needsNaplexCuration(item) && !opts.useForceAi) {
      return { kind: "skip" as const };
    }
    const result = await curateNaplexBankItem(item, row.subjectId, {
      subjectLabel: label,
      seed: seedFromId(row.id),
      useAi: !opts.noAi,
      aiOnly: opts.aiOnly,
      forceAi: opts.useForceAi,
    });
    return {
      kind: "naplex" as const,
      result,
      item: result.item,
      changed: result.changed,
      validationOk: result.validationOk,
      validationIssues: result.validationIssues,
      stage: result.stage,
      qualityBefore: result.qualityBefore,
      qualityAfter: result.qualityAfter,
      aiUsed: result.aiUsed,
    };
  }

  const minAccept = usmleServeMinQaScore(fieldId) ?? 8;
  if (
    !opts.all &&
    !opts.aiOnly &&
    !opts.useForceAi &&
    usmleBankItemIsServeReady(item, fieldId) &&
    bankItemIsBoardBestQuality(fieldId, item, { source: row.source })
  ) {
    return { kind: "skip" as const };
  }

  const result = await curateUsmleBankItem(item, {
    fieldId,
    itemId: row.id,
    source: row.source,
    difficulty: row.difficulty,
    minAcceptScore: minAccept,
    useRag: !opts.noAi,
    aiOnly: opts.aiOnly || opts.useForceAi,
    aiFirst: opts.useForceAi,
    maxAiAttempts: 3,
    seed: seedFromId(row.id),
  });

  const changed = result.action === "rule_polished" || result.action === "ai_curated";
  return {
    kind: "usmle" as const,
    result,
    item: result.item,
    changed,
    validationOk: result.bankOk && usmleBankItemIsServeReady(result.item, fieldId),
    validationIssues: result.notes,
    stage: result.action,
    qualityBefore: result.before.overallScore,
    qualityAfter: result.after.overallScore,
    aiUsed: result.action === "ai_curated",
  };
}

async function processField(
  fieldId: BoardFieldId,
  opts: ReturnType<typeof parseArgs>
) {
  const useForceAi = opts.forceAi || opts.serveReady;
  const rows = await loadRows(fieldId, {
    limit: opts.limit,
    subject: opts.subject,
    editorial: opts.editorial,
    failing: opts.failing,
    serveReady: opts.serveReady,
  });

  const label = boardFieldLabel(fieldId);
  console.log(
    `\n${label} curation — ${rows.length} item(s)${opts.dryRun ? " [dry-run]" : ""}${opts.aiOnly ? " [AI only]" : ""}${opts.editorial ? " [editorial]" : ""}${opts.failing ? " [qa failures]" : ""}${opts.serveReady ? " [serve-ready]" : ""}\n`
  );

  const stats = {
    scanned: 0,
    skipped: 0,
    pass: 0,
    rulePolish: 0,
    aiRewrite: 0,
    failed: 0,
    updated: 0,
    keptOriginal: 0,
    errors: 0,
  };

  for (const row of rows) {
    stats.scanned++;

    try {
      const curated = await curateRow(fieldId, row, {
        useForceAi,
        aiOnly: opts.aiOnly,
        noAi: opts.noAi,
        all: opts.all,
      });

      if (curated.kind === "skip") {
        stats.skipped++;
        stats.pass++;
        continue;
      }

      if (curated.stage === "pass" || curated.stage === "accepted") {
        if (!curated.changed) {
          stats.pass++;
          continue;
        }
      }

      if (
        curated.stage === "rule_polish" ||
        curated.stage === "rule_polished"
      ) {
        stats.rulePolish++;
      } else if (
        curated.stage === "ai_rewrite" ||
        curated.stage === "ai_curated"
      ) {
        stats.aiRewrite++;
      } else {
        stats.failed++;
      }

      if (!curated.changed || !curated.validationOk) {
        if (!curated.validationOk) {
          console.log(
            `  [fail] ${row.id.slice(0, 10)}… ${curated.qualityBefore.toFixed(1)}→${curated.qualityAfter.toFixed(1)} | ${curated.validationIssues.slice(0, 2).join("; ")}`
          );
        }
        continue;
      }

      const guidelineEnriched =
        fieldId === "nursing" || fieldId === "pharmacy"
          ? enrichBankItemGuidelines(curated.item, fieldId)
          : { item: curated.item };
      const finalItem = guidelineEnriched.item;
      const finalHash = bankItemContentHash(fieldId, row.subjectId, finalItem);
      const collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });
      if (collision) {
        stats.skipped++;
        console.log(`  [collision] ${row.id.slice(0, 10)}…`);
        continue;
      }

      const source = curated.aiUsed ? "ai-curated" : "curated";
      const qaOk = qaOkAfterCuration(fieldId, finalItem, row, opts.serveReady, source);

      if (row.qaPassed && !qaOk) {
        stats.keptOriginal++;
        console.log(
          `  [keep] ${row.id.slice(0, 10)}… ${curated.qualityBefore.toFixed(1)}→${curated.qualityAfter.toFixed(1)} — rewrite below best gate`
        );
        continue;
      }

      if (opts.dryRun) {
        console.log(
          `  [dry-run] ${row.id.slice(0, 10)}… ${curated.stage} ${curated.qualityBefore.toFixed(1)}→${curated.qualityAfter.toFixed(1)} qa=${qaOk}${curated.aiUsed ? " (AI)" : ""}`
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
          references: finalItem.references ?? undefined,
          tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
          topicCategory: finalItem.topicCategory ?? row.topicCategory,
          itemType: finalItem.itemType ?? row.itemType,
          contentHash: finalHash,
          qaPassed: qaOk,
          qaAuditedAt: new Date(),
          source,
        },
      });
      stats.updated++;
    } catch (e) {
      stats.errors++;
      console.error(`  error ${row.id}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`\n── ${label} summary ──`);
  console.log(`Scanned:      ${stats.scanned}`);
  console.log(`Skipped OK:   ${stats.skipped}`);
  console.log(`Already pass: ${stats.pass}`);
  console.log(`Rule polish:  ${stats.rulePolish}`);
  console.log(`AI rewrite:   ${stats.aiRewrite}`);
  console.log(`Failed QA:    ${stats.failed}`);
  if (stats.keptOriginal) console.log(`Kept original: ${stats.keptOriginal}`);
  console.log(`${opts.dryRun ? "Would update" : "Updated"}:    ${stats.updated}`);
  console.log(`Errors:       ${stats.errors}`);
}

async function main() {
  const opts = parseArgs();
  const useForceAi = opts.forceAi || opts.serveReady;

  if (!opts.noAi && (opts.aiOnly || useForceAi)) requireOpenAiKey();

  for (const fieldId of opts.fields) {
    await processField(fieldId, opts);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
