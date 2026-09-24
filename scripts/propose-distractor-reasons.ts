#!/usr/bin/env node
/**
 * Propose per-option reasons for wrong answers that fail the distractor check.
 *
 * Dry-run is the default. Nothing is written unless --apply is present.
 * --apply writes distractorRationale only (generationMeta, plus the options
 * envelope when that envelope is the select-all store or already has a map).
 * It does not change the stem, option text, correct answer, explanation,
 * qaPassed, or active. It does not clear Item QA flags.
 * Near-duplicate rows are left untouched.
 *
 *   npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care
 *   npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care --limit 25
 *   npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt
 *   npm run db:propose-distractor-reasons -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt --apply
 *
 * Without --ids-file, --apply writes auto_extract rows only.
 * With --ids-file, --apply writes only those ids, including needs_human rows a person reviewed.
 * Do not pass --apply against production until that allowlist has been reviewed.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import {
  distractorReasonWrite,
  parseDistractorAllowlist,
  parseProposeDistractorReasonArgs,
  planDistractorReasonProposals,
  rowFailsDistractorReason,
  type DistractorReasonBankRow,
  type DistractorReasonPlan,
  type DistractorReasonPlanItem,
} from "../src/lib/exam-prep/item-qa";

const prisma = new PrismaClient();
const BATCH = 400;
const WRITE_BATCH = 20;

function loadAllowlist(filePath: string | undefined): Set<string> | null {
  if (!filePath) return null;
  const text = readFileSync(filePath, "utf8");
  return new Set(parseDistractorAllowlist(text));
}

async function loadActive(field: string, subject?: string): Promise<DistractorReasonBankRow[]> {
  const rows: DistractorReasonBankRow[] = [];
  let lastId: string | undefined;
  while (true) {
    const page = await prisma.questionBankItem.findMany({
      where: {
        fieldId: field,
        active: true,
        ...(subject ? { subjectId: subject } : {}),
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
      select: {
        id: true,
        fieldId: true,
        subjectId: true,
        itemType: true,
        active: true,
        qaPassed: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        references: true,
        generationMeta: true,
        curationMeta: true,
      },
    });
    if (!page.length) break;
    for (const row of page) {
      rows.push({
        id: row.id,
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        active: row.active,
        qaPassed: row.qaPassed,
        stem: row.question,
        explanation: row.explanation,
        options: row.options,
        correctAnswer: row.correctAnswer,
        itemType: row.itemType,
        references: row.references,
        generationMeta: row.generationMeta,
        curationMeta: row.curationMeta,
      });
    }
    lastId = page[page.length - 1]!.id;
    console.log(`  … scanned ${rows.length}`);
  }
  return rows;
}

function renderOption(option: DistractorReasonPlanItem["options"][number]): string {
  return [
    `- Option: ${JSON.stringify(option.option)}`,
    `  - Existing: ${option.existingReason ? JSON.stringify(option.existingReason) : "(none)"}`,
    `  - Proposed: ${option.proposedReason ? JSON.stringify(option.proposedReason) : "(none)"}`,
    `  - Note: ${option.note}`,
  ].join("\n");
}

function renderItem(item: DistractorReasonPlanItem): string {
  return [
    `### ${item.id}`,
    "",
    `- Class: **${item.classification}**${item.wouldWrite ? " (would write)" : ""}${item.wouldResolve ? " (would resolve)" : ""}`,
    `- Subject: ${item.subjectId}; itemType: ${item.itemType ?? "mcq"}; qaPassed: ${item.qaPassed}`,
    `- Codes: ${item.codes.length ? item.codes.join(", ") : "(unflagged)"}`,
    `- Stem: ${item.stemPreview || "(blank)"}`,
    `- Why: ${item.reason}`,
    ...(item.notes.length ? [`- Notes: ${item.notes.join(" | ")}`] : []),
    ...item.options.map((option) => renderOption(option)),
    "",
  ].join("\n");
}

function renderSection(title: string, items: readonly DistractorReasonPlanItem[]): string[] {
  const lines = [`## ${title} (${items.length})`, ""];
  if (!items.length) lines.push("None.", "");
  for (const item of items) lines.push(renderItem(item));
  return lines;
}

function renderMarkdown(input: {
  mode: "dry-run" | "apply";
  field: string;
  subject?: string;
  limit: number;
  allowlistActive: boolean;
  plan: DistractorReasonPlan;
  written?: number;
  failingAfter?: number;
}): string {
  const lines = [
    "# Distractor reason proposals",
    "",
    `Mode: ${input.mode}`,
    `Field: ${input.field}`,
    `Subject: ${input.subject ?? "all"}`,
    `Limit: ${input.limit > 0 ? input.limit : "none"}`,
    `Allowlist: ${input.allowlistActive ? "yes" : "no"}`,
    "",
    "Dry-run writes nothing. `--apply` writes `distractorRationale` only.",
    "Stem, option text, correct answer, explanation, `qaPassed`, and `active` are not modified.",
    "Near-duplicate rows are not modified. Item QA flags are not cleared by this command.",
    "",
    "## Counts",
    "",
    `- Auto extract: ${input.plan.autoExtract.length}`,
    `- Needs human: ${input.plan.needsHuman.length}`,
    `- Failing distractor before: ${input.plan.failingDistractorBefore}`,
    `- Would write: ${input.plan.wouldWrite}`,
    `- Failing distractor after (predicted): ${input.plan.failingDistractorAfter}`,
    `- Skipped near-duplicate: ${input.plan.skipped.filter((skip) => skip.reason === "near_duplicate").length}`,
    `- Skipped already resolved: ${input.plan.skipped.filter((skip) => skip.reason === "already_resolved").length}`,
  ];
  if (input.plan.truncated) {
    lines.push("- Truncated: yes. Counts cover the first matching rows in id order.");
  }
  if (input.written !== undefined) lines.push(`- Rows updated: ${input.written}`);
  if (input.failingAfter !== undefined) lines.push(`- Failing distractor after: ${input.failingAfter}`);
  lines.push(
    "",
    ...renderSection("Auto extract", input.plan.autoExtract),
    ...renderSection("Needs human", input.plan.needsHuman)
  );
  return lines.join("\n");
}

function reasonMap(item: DistractorReasonPlanItem): Record<string, string> {
  const out: Record<string, string> = {};
  for (const option of item.options) {
    if (option.proposedReason) out[option.option] = option.proposedReason;
  }
  return out;
}

async function applyReasons(
  plan: DistractorReasonPlan,
  field: string,
  allowlist: Set<string> | null
): Promise<number> {
  const queue = [...plan.autoExtract, ...plan.needsHuman].filter((item) => item.wouldWrite);
  let written = 0;
  for (let i = 0; i < queue.length; i += WRITE_BATCH) {
    const slice = queue.slice(i, i + WRITE_BATCH);
    const results = await Promise.all(
      slice.map(async (item) => {
        const fresh = await prisma.questionBankItem.findUnique({
          where: { id: item.id },
          select: {
            id: true,
            fieldId: true,
            subjectId: true,
            itemType: true,
            active: true,
            qaPassed: true,
            question: true,
            options: true,
            correctAnswer: true,
            explanation: true,
            references: true,
            generationMeta: true,
            curationMeta: true,
          },
        });
        if (!fresh || fresh.fieldId !== field || !fresh.active) return 0;
        const freshRow: DistractorReasonBankRow = {
          id: fresh.id,
          fieldId: fresh.fieldId,
          subjectId: fresh.subjectId,
          active: fresh.active,
          qaPassed: fresh.qaPassed,
          stem: fresh.question,
          explanation: fresh.explanation,
          options: fresh.options,
          correctAnswer: fresh.correctAnswer,
          itemType: fresh.itemType,
          references: fresh.references,
          generationMeta: fresh.generationMeta,
          curationMeta: fresh.curationMeta,
        };
        const again = planDistractorReasonProposals({
          fieldId: field,
          rows: [freshRow],
          allowlist,
        });
        const still = [...again.autoExtract, ...again.needsHuman].find((candidate) => candidate.id === item.id);
        if (!still?.wouldWrite) return 0;
        if (JSON.stringify(reasonMap(still)) !== JSON.stringify(reasonMap(item))) return 0;
        if (!rowFailsDistractorReason(freshRow)) return 0;
        const write = distractorReasonWrite({
          apply: true,
          generationMeta: fresh.generationMeta,
          optionsRaw: fresh.options,
          itemType: fresh.itemType,
          proposals: still.options,
          classification: still.classification,
          allowlistActive: allowlist != null,
          idAllowlisted: allowlist?.has(fresh.id) ?? false,
          nearDuplicate: false,
        });
        if (!write) return 0;
        const forbidden = ["qaPassed", "active", "question", "explanation", "correctAnswer", "reviewFlag", "curationMeta"];
        if (forbidden.some((key) => key in write)) return 0;
        if (write.options) {
          const afterParsed = JSON.parse(write.options) as { options?: unknown };
          const beforeParsed = JSON.parse(fresh.options) as { options?: unknown };
          if (JSON.stringify(beforeParsed.options) !== JSON.stringify(afterParsed.options)) return 0;
        }
        const data: Prisma.QuestionBankItemUpdateManyMutationInput = {
          generationMeta: write.generationMeta as Prisma.InputJsonValue,
          ...(write.options ? { options: write.options } : {}),
        };
        if ("qaPassed" in data || "active" in data || "question" in data || "explanation" in data || "correctAnswer" in data) {
          return 0;
        }
        const updated = await prisma.questionBankItem.updateMany({
          where: { id: item.id, fieldId: field, active: true },
          data,
        });
        return updated.count;
      })
    );
    written += results.reduce((sum, count) => sum + count, 0);
    console.log(`  … updated ${written}/${queue.length}`);
  }
  return written;
}

async function main() {
  const args = parseProposeDistractorReasonArgs(process.argv.slice(2));
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. No rows were changed.");
  }
  const allowlist = loadAllowlist(args.idsFile);
  const mode = args.apply ? "apply" : "dry-run";
  console.log(
    `\nDistractor reason proposals — field ${args.field}${args.subject ? ` subject ${args.subject}` : ""} [${mode}]\n`
  );

  const rows = await loadActive(args.field, args.subject);
  const plan = planDistractorReasonProposals({
    fieldId: args.field,
    rows,
    limit: args.limit,
    allowlist,
  });

  console.log(`Active rows scanned: ${rows.length}`);
  console.log(`Auto extract: ${plan.autoExtract.length}`);
  console.log(`Needs human: ${plan.needsHuman.length}`);
  console.log(`Failing distractor before: ${plan.failingDistractorBefore}`);
  console.log(`Would write: ${plan.wouldWrite}`);
  console.log(`Failing distractor after (predicted): ${plan.failingDistractorAfter}`);
  console.log(
    `Skipped near-duplicate: ${plan.skipped.filter((skip) => skip.reason === "near_duplicate").length}`
  );
  if (plan.truncated) console.log(`Stopped after ${args.limit} matching rows (--limit).`);

  let written: number | undefined;
  let failingAfter: number | undefined;
  if (!args.apply) {
    console.log("\nDry run. No rows were changed.");
    if (args.idsFile) {
      console.log("An allowlist was set, but --apply was not. No rows were changed.");
    } else {
      console.log("Pass --apply to write auto_extract rows, or --ids-file with --apply for a reviewed batch.");
    }
  } else {
    written = await applyReasons(plan, args.field, allowlist);
    const freshRows = await loadActive(args.field, args.subject);
    const after = planDistractorReasonProposals({
      fieldId: args.field,
      rows: freshRows,
      limit: args.limit,
      allowlist,
    });
    failingAfter = after.failingDistractorBefore;
    console.log(`Updated ${written} row(s). distractorRationale only.`);
    console.log("qaPassed and active were not modified. Stem, option text, correct answer, and explanation were not modified.");
    console.log(`Failing distractor after: ${failingAfter}`);
    console.log("Item QA flags were not cleared. Re-run db:audit-item-qa --include-rationale --clear-resolved after review.");
  }

  mkdirSync(args.outDir, { recursive: true });
  const slug = [args.field, args.subject].filter(Boolean).join("-");
  const jsonPath = path.join(args.outDir, `distractor-reason-proposals-${slug}.json`);
  const mdPath = path.join(args.outDir, `distractor-reason-proposals-${slug}.md`);
  const report = {
    mode,
    field: args.field,
    subject: args.subject ?? null,
    limit: args.limit > 0 ? args.limit : null,
    allowlist: allowlist ? [...allowlist] : null,
    counts: {
      autoExtract: plan.autoExtract.length,
      needsHuman: plan.needsHuman.length,
      failingDistractorBefore: plan.failingDistractorBefore,
      wouldWrite: plan.wouldWrite,
      failingDistractorAfterPredicted: plan.failingDistractorAfter,
      failingDistractorAfter: failingAfter ?? null,
      written: written ?? null,
      skippedNearDuplicate: plan.skipped.filter((skip) => skip.reason === "near_duplicate").length,
    },
    truncated: plan.truncated,
    autoExtract: plan.autoExtract,
    needsHuman: plan.needsHuman,
    skipped: plan.skipped,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(
    mdPath,
    renderMarkdown({
      mode,
      field: args.field,
      subject: args.subject,
      limit: args.limit,
      allowlistActive: allowlist != null,
      plan,
      written,
      failingAfter,
    })
  );
  console.log(`Report: ${mdPath}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
