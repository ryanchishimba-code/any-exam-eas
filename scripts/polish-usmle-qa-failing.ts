#!/usr/bin/env node
/**
 * Re-polish USMLE items flagged by the QA audit (low scores / critical issue codes).
 *
 * Usage:
 *   npm run db:polish-usmle:qa-failing
 *   npm run db:polish-usmle:qa-failing -- --limit 500 --max-score 6.5
 *   npm run db:polish-usmle:qa-failing -- --csv artifacts/usmle-qa-failing.csv --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import {
  needsUsmlePolish,
  polishUsmleBankItem,
  scoreUsmleBankItem,
} from "../src/lib/engine/polish/usmle-polish";
import { normalizeUsmleBankItemFields } from "../src/lib/exam-prep/usmle-clinical-gate";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { questionContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();

const CRITICAL_ISSUES = new Set([
  "missing_vignette",
  "thin_vignette",
  "weak_distractors",
  "weak_correct",
  "correct_not_in_options",
  "duplicate_vignette",
  "criteria_only_in_explanation",
]);

function parseArgs() {
  const args = process.argv.slice(2);
  let csv = path.join(process.cwd(), "artifacts/usmle-qa-failing.csv");
  let limit = 500;
  let maxScore = 7.9;
  let dryRun = false;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--csv" && args[i + 1]) csv = args[++i]!;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--max-score" && args[i + 1]) maxScore = Number.parseFloat(args[++i]!);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--force") force = true;
  }
  return { csv, limit, maxScore, dryRun, force };
}

function parseCsvIds(csvPath: string, maxScore: number, limit: number): string[] {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found: ${csvPath}. Run npm run db:audit-usmle first.`);
  }
  const lines = fs.readFileSync(csvPath, "utf8").trim().split("\n");

  const rows = lines
    .slice(1)
    .map((line) => {
      const m = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),([0-9.]+),/);
      if (!m) return null;
      const [, itemId, , , , scoreStr] = m;
      const overallScore = Number.parseFloat(scoreStr!);
      const critical = CRITICAL_ISSUES.has(
        line.split("|").find((p) => p.includes(":"))?.split(":")[0] ?? ""
      ) || [...CRITICAL_ISSUES].some((code) => line.includes(`${code}:`));
      return { itemId: itemId!, overallScore, critical };
    })
    .filter((r): r is { itemId: string; overallScore: number; critical: boolean } => r !== null)
    .filter((r) => r.overallScore <= maxScore || r.critical);

  rows.sort((a, b) => a.overallScore - b.overallScore);
  return rows.slice(0, limit).map((r) => r.itemId);
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function main() {
  const { csv, limit, maxScore, dryRun, force } = parseArgs();
  const ids = parseCsvIds(csv, maxScore, limit);

  console.log(`\nUSMLE QA failing rewrite — ${ids.length} item(s) from ${csv}`);
  console.log(`  max-score: ${maxScore}  dry-run: ${dryRun}  force: ${force}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let qaBeforeSum = 0;
  let qaAfterSum = 0;
  let measured = 0;

  for (const id of ids) {
    const row = await prisma.questionBankItem.findUnique({ where: { id } });
    if (!row || !row.active) {
      skipped++;
      continue;
    }

    const item = enrichBankItemFromRow(row);
    const beforeAudit = auditUsmleQaEditor(item, {
      fieldId: row.fieldId,
      source: row.source,
      itemId: row.id,
      difficulty: row.difficulty,
    });
    qaBeforeSum += beforeAudit.overallScore;

    if (!force && !needsUsmlePolish(item, row.fieldId) && beforeAudit.overallScore >= 7.5) {
      skipped++;
      continue;
    }

    const subject = getFieldSubject(row.fieldId, row.subjectId);
    const label = subject?.label ?? row.subjectId;

    try {
      let result = polishUsmleBankItem(
        item,
        row.fieldId,
        row.subjectId,
        label,
        seedFromId(row.id)
      );
      let finalItem = normalizeUsmleBankItemFields(result.item);

      for (let attempt = 0; attempt < 6; attempt++) {
        const hash = questionContentHash(row.fieldId, row.subjectId, finalItem.question);
        const collision = await prisma.questionBankItem.findFirst({
          where: { contentHash: hash, NOT: { id: row.id } },
        });
        if (!collision) break;
        result = polishUsmleBankItem(
          item,
          row.fieldId,
          row.subjectId,
          label,
          seedFromId(row.id) + attempt * 7919
        );
        finalItem = normalizeUsmleBankItemFields(result.item);
      }

      const afterAudit = auditUsmleQaEditor(finalItem, {
        fieldId: row.fieldId,
        source: "polished",
        itemId: row.id,
        difficulty: row.difficulty,
      });
      qaAfterSum += afterAudit.overallScore;
      measured++;

      if (!result.changed && afterAudit.overallScore <= beforeAudit.overallScore) {
        skipped++;
        continue;
      }

      const finalHash = questionContentHash(row.fieldId, row.subjectId, finalItem.question);
      const stillCollides = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });
      if (stillCollides) {
        console.warn(`  skip ${id} — hash collision`);
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(
          `  [dry-run] ${row.fieldId}/${row.subjectId} ${id.slice(0, 10)}… QA ${beforeAudit.overallScore} → ${afterAudit.overallScore}  polish ${result.qualityBefore.toFixed(2)} → ${result.qualityAfter.toFixed(2)}`
        );
        updated++;
        continue;
      }

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          question: finalItem.question,
          scenario: finalItem.vignette ?? finalItem.scenario ?? row.scenario,
          options: JSON.stringify(finalItem.options),
          correctAnswer: finalItem.correctAnswer,
          explanation: finalItem.explanation,
          tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
          contentHash: finalHash,
          source: "polished",
          itemType: "vignette",
        },
      });
      updated++;
    } catch (e) {
      errors++;
      console.error(`  error ${id}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`\n── QA failing rewrite complete ──`);
  console.log(`Queued:   ${ids.length}`);
  console.log(`${dryRun ? "Would update" : "Updated"}: ${updated}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors}`);
  if (measured > 0) {
    console.log(`Avg QA:   ${(qaBeforeSum / measured).toFixed(2)} → ${(qaAfterSum / measured).toFixed(2)}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
