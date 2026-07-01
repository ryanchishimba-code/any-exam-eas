#!/usr/bin/env node
/**
 * Improve items flagged with warn-level issues from a QA scan report.
 *
 * Usage:
 *   npm run db:improve-qa-warns
 *   npm run db:improve-qa-warns -- --dry-run
 *   npm run db:improve-qa-warns -- --csv artifacts/qa-scan-all-2026-07-01T11-19-15-557Z.json
 *   npm run db:improve-qa-warns -- --polish-weak
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { loadEnvFiles } from "./load-env";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { runHeuristicPrefilter } from "../src/lib/qa-scan/heuristic-prefilter";
import {
  countNaplexWarnIssues,
  countUsmleWarnIssues,
  fixQaWarnIssues,
  normalizeUsmleActionStem,
  postFixNormalize,
} from "../src/lib/exam-prep/qa-warn-fixes";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { bankItemPassesIngestGate } from "../src/lib/exam-prep/bank-ingest-gate";
import { polishUsmleBankItem } from "../src/lib/engine/polish/usmle-polish";
import { normalizeUsmleBankItemFields } from "../src/lib/exam-prep/usmle-clinical-gate";
import { getFieldSubject } from "../src/lib/field-subjects";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

loadEnvFiles();

const prisma = new PrismaClient();

type ScanItem = {
  id: string;
  fieldId: string;
  heuristicIssues?: Array<{ code: string; severity: string }>;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let reportPath = path.join(process.cwd(), "artifacts/qa-scan-all-2026-07-01T11-19-15-557Z.json");
  let dryRun = false;
  let polishWeak = false;
  let limit = 0;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--polish-weak") polishWeak = true;
    else if (arg === "--csv" && args[i + 1]) reportPath = args[++i]!;
    else if (arg.startsWith("--csv=")) reportPath = arg.slice("--csv=".length);
    else if (arg === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
    else if (arg.startsWith("--limit=")) limit = Number.parseInt(arg.slice("--limit=".length), 10);
  }

  return { reportPath, dryRun, polishWeak, limit };
}

function loadWarnItemIds(reportPath: string): ScanItem[] {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Report not found: ${reportPath}`);
  }
  const parsed = JSON.parse(fs.readFileSync(reportPath, "utf8")) as { items: ScanItem[] };
  const seen = new Set<string>();
  const out: ScanItem[] = [];

  for (const item of parsed.items) {
    if (seen.has(item.id)) continue;
    const warns = item.heuristicIssues?.filter((h) => h.severity === "warn") ?? [];
    if (warns.length === 0) continue;
    seen.add(item.id);
    out.push(item);
  }

  return out;
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function warnCodes(item: ScanItem): string[] {
  return [...new Set(item.heuristicIssues?.filter((h) => h.severity === "warn").map((h) => h.code) ?? [])];
}

async function main() {
  const { reportPath, dryRun, polishWeak, limit } = parseArgs();
  let targets = loadWarnItemIds(reportPath);
  if (limit > 0) targets = targets.slice(0, limit);

  console.log(`\nImprove QA warn items — ${targets.length} from ${reportPath}`);
  console.log(`  dry-run: ${dryRun}  polish-weak: ${polishWeak}\n`);

  let updated = 0;
  let skipped = 0;
  let hashSkipped = 0;
  let warnsBefore = 0;
  let warnsAfter = 0;
  const fixedByCode: Record<string, number> = {};

  for (const target of targets) {
    const row = await prisma.questionBankItem.findUnique({ where: { id: target.id } });
    if (!row || !row.active) {
      skipped++;
      continue;
    }

    const beforeItem = enrichBankItemFromRow(row);
    const codesBefore =
      row.fieldId === "pharmacy"
        ? countNaplexWarnIssues(beforeItem)
        : countUsmleWarnIssues(beforeItem, row.fieldId, row.source, row.id);
    warnsBefore += codesBefore.length;

    let { item: next, changed, fixes } = fixQaWarnIssues(beforeItem, row.id, row.fieldId);

    const stemNorm = normalizeUsmleActionStem(next);
    if (stemNorm) {
      next = stemNorm;
      changed = true;
      fixes = [...fixes, "normalizeUsmleActionStem"];
    }

    next = postFixNormalize(next, row.fieldId);

    const needsPolish =
      polishWeak ||
      codesBefore.includes("weak_distractors") ||
      /^USMLE Step [123] CK reasoning:/i.test(beforeItem.explanation ?? "");

    if (needsPolish && row.fieldId.startsWith("usmle")) {
      const subject = getFieldSubject(row.fieldId, row.subjectId);
      const polished = polishUsmleBankItem(
        next,
        row.fieldId,
        row.subjectId,
        subject?.label ?? row.subjectId,
        seedFromId(row.id)
      );
      if (polished.changed) {
        next = normalizeUsmleBankItemFields(polished.item);
        changed = true;
        fixes.push("polishUsmleBankItem");
      }
    }

    const codesAfter =
      row.fieldId === "pharmacy"
        ? countNaplexWarnIssues(next)
        : countUsmleWarnIssues(next, row.fieldId, row.source, row.id);
    warnsAfter += codesAfter.length;

    if (!changed) {
      skipped++;
      continue;
    }

    const heuristicAfter = runHeuristicPrefilter(next, row.fieldId, row.source);
    const bankOk = auditBankItem(next, row.fieldId).ok;
    const ingestOk = bankItemPassesIngestGate(row.fieldId, next, row.source);
    if (!heuristicAfter.ok || !bankOk || !ingestOk) {
      console.warn(
        `  skip ${row.id} — post-fix gate fail: ${[
          ...heuristicAfter.issues.filter((i) => i.severity === "error").map((i) => i.code),
          !bankOk ? "bank_audit" : "",
          !ingestOk ? "ingest_gate" : "",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
      skipped++;
      continue;
    }

    const newHash = bankItemContentHash(row.fieldId, next.subjectId, next);
    const duplicate = await prisma.questionBankItem.findFirst({
      where: { contentHash: newHash, NOT: { id: row.id } },
      select: { id: true },
    });
    if (duplicate) {
      hashSkipped++;
      skipped++;
      continue;
    }

    for (const code of warnCodes(target)) {
      if (!codesAfter.includes(code)) fixedByCode[code] = (fixedByCode[code] ?? 0) + 1;
    }

    if (dryRun) {
      const qaBefore = row.fieldId.startsWith("usmle")
        ? auditUsmleQaEditor(beforeItem, { fieldId: row.fieldId, source: row.source, itemId: row.id }).overallScore
        : null;
      const qaAfter = row.fieldId.startsWith("usmle")
        ? auditUsmleQaEditor(next, { fieldId: row.fieldId, source: row.source, itemId: row.id }).overallScore
        : null;
      console.log(
        `  [dry-run] ${row.fieldId} ${row.id.slice(0, 10)}… warns ${codesBefore.length}→${codesAfter.length}` +
          (qaBefore != null ? ` QA ${qaBefore}→${qaAfter}` : "") +
          ` [${fixes.join(", ")}]`
      );
      updated++;
      continue;
    }

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        question: next.question,
        scenario: next.vignette ?? next.scenario ?? row.scenario,
        options: serializeBankOptions(next),
        correctAnswer: next.correctAnswer,
        explanation: next.explanation,
        tags: next.tags ? JSON.stringify(next.tags) : row.tags,
        contentHash: newHash,
        qaAuditedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    updated++;
  }

  console.log(`\n── Improve QA warns complete ──`);
  console.log(`Targets:     ${targets.length}`);
  console.log(`${dryRun ? "Would update" : "Updated"}:   ${updated}`);
  console.log(`Skipped:     ${skipped}`);
  console.log(`Hash skip:   ${hashSkipped}`);
  console.log(`Warn count:  ${warnsBefore} → ${warnsAfter}`);
  if (Object.keys(fixedByCode).length > 0) {
    console.log(`Resolved by code:`);
    for (const [code, n] of Object.entries(fixedByCode).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${code}: ${n}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
