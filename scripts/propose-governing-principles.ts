#!/usr/bin/env node
/**
 * Propose governing principles for items that fail only that schema check.
 *
 * Dry-run is the default. Nothing is written unless --apply is present.
 * --apply writes generationMeta.governingPrinciple only.
 * It does not change the stem, options, explanation, qaPassed, or active.
 * It does not clear Item QA flags. After a reviewed apply, clear resolved
 * schema flags with db:audit-item-qa --clear-resolved.
 * Near-duplicate rows are left untouched.
 *
 *   npm run db:propose-governing-principles -- --field nursing --subject management-of-care
 *   npm run db:propose-governing-principles -- --field nursing --subject management-of-care --limit 25
 *   npm run db:propose-governing-principles -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt
 *   npm run db:propose-governing-principles -- --field nursing --subject management-of-care --ids-file ./reviewed-ids.txt --apply
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
  governingPrincipleWrite,
  parsePrincipleAllowlist,
  parseProposeGoverningPrincipleArgs,
  planGoverningPrincipleProposals,
  rowFailsGoverningPrinciple,
  type GoverningPrincipleBankRow,
  type GoverningPrinciplePlan,
  type PrinciplePlanItem,
} from "../src/lib/exam-prep/item-qa";

const prisma = new PrismaClient();
const BATCH = 400;
const WRITE_BATCH = 20;

function loadAllowlist(filePath: string | undefined): Set<string> | null {
  if (!filePath) return null;
  const text = readFileSync(filePath, "utf8");
  return new Set(parsePrincipleAllowlist(text));
}

async function loadActive(field: string, subject?: string): Promise<GoverningPrincipleBankRow[]> {
  const rows: GoverningPrincipleBankRow[] = [];
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

function renderItem(item: PrinciplePlanItem): string {
  const alternates = item.alternates.length
    ? `- Alternates: ${item.alternates.map((line) => JSON.stringify(line)).join("; ")}`
    : "";
  return [
    `### ${item.id}`,
    "",
    `- Class: **${item.classification}**${item.wouldWrite ? " (would write)" : ""}`,
    `- Source: ${item.source}`,
    `- Subject: ${item.subjectId}; qaPassed: ${item.qaPassed}`,
    `- Codes: ${item.codes.length ? item.codes.join(", ") : "(unflagged)"}`,
    `- Stem: ${item.stemPreview || "(blank)"}`,
    `- Proposed principle: ${item.proposedPrinciple ? JSON.stringify(item.proposedPrinciple) : "(none)"}`,
    ...(alternates ? [alternates] : []),
    `- Why: ${item.reason}`,
    `- Explanation excerpt: ${item.explanationExcerpt || "(blank)"}`,
    "",
  ].join("\n");
}

function renderSection(title: string, items: readonly PrinciplePlanItem[]): string[] {
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
  plan: GoverningPrinciplePlan;
  written?: number;
  failingAfter?: number;
}): string {
  const lines = [
    "# Governing principle proposals",
    "",
    `Mode: ${input.mode}`,
    `Field: ${input.field}`,
    `Subject: ${input.subject ?? "all"}`,
    `Limit: ${input.limit > 0 ? input.limit : "none"}`,
    `Allowlist: ${input.allowlistActive ? "yes" : "no"}`,
    "",
    "Dry-run writes nothing. `--apply` writes `generationMeta.governingPrinciple` only.",
    "Stem, options, explanation, `qaPassed`, and `active` are not modified.",
    "Near-duplicate rows are not modified. Item QA flags are not cleared by this command.",
    "",
    "## Counts",
    "",
    `- Auto extract: ${input.plan.autoExtract.length}`,
    `- Needs human: ${input.plan.needsHuman.length}`,
    `- Failing principle before: ${input.plan.failingPrincipleBefore}`,
    `- Would write: ${input.plan.wouldWrite}`,
    `- Failing principle after (predicted): ${input.plan.failingPrincipleAfter}`,
    `- Skipped near-duplicate: ${input.plan.skipped.filter((skip) => skip.reason === "near_duplicate").length}`,
    `- Skipped already resolved: ${input.plan.skipped.filter((skip) => skip.reason === "already_resolved").length}`,
  ];
  if (input.plan.truncated) {
    lines.push("- Truncated: yes. Counts cover the first matching rows in id order.");
  }
  if (input.written !== undefined) lines.push(`- Rows updated: ${input.written}`);
  if (input.failingAfter !== undefined) lines.push(`- Failing principle after: ${input.failingAfter}`);
  lines.push(
    "",
    ...renderSection("Auto extract", input.plan.autoExtract),
    ...renderSection("Needs human", input.plan.needsHuman)
  );
  return lines.join("\n");
}

async function applyPrinciples(
  plan: GoverningPrinciplePlan,
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
        const freshRow: GoverningPrincipleBankRow = {
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
        const again = planGoverningPrincipleProposals({
          fieldId: field,
          rows: [freshRow],
          allowlist,
        });
        const still = [...again.autoExtract, ...again.needsHuman].find((candidate) => candidate.id === item.id);
        if (!still?.wouldWrite || still.proposedPrinciple !== item.proposedPrinciple) return 0;
        if (!rowFailsGoverningPrinciple(freshRow)) return 0;
        const write = governingPrincipleWrite({
          apply: true,
          generationMeta: fresh.generationMeta,
          proposedPrinciple: still.proposedPrinciple,
          classification: still.classification,
          allowlistActive: allowlist != null,
          idAllowlisted: allowlist?.has(fresh.id) ?? false,
          nearDuplicate: false,
        });
        if (!write || Object.keys(write).some((key) => key !== "generationMeta")) return 0;
        const data: Prisma.QuestionBankItemUpdateManyMutationInput = {
          generationMeta: write.generationMeta as Prisma.InputJsonValue,
        };
        if ("qaPassed" in data || "active" in data || "question" in data || "explanation" in data || "options" in data) {
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
  const args = parseProposeGoverningPrincipleArgs(process.argv.slice(2));
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. No rows were changed.");
  }
  const allowlist = loadAllowlist(args.idsFile);
  const mode = args.apply ? "apply" : "dry-run";
  console.log(
    `\nGoverning principle proposals — field ${args.field}${args.subject ? ` subject ${args.subject}` : ""} [${mode}]\n`
  );

  const rows = await loadActive(args.field, args.subject);
  const plan = planGoverningPrincipleProposals({
    fieldId: args.field,
    rows,
    limit: args.limit,
    allowlist,
  });

  console.log(`Active rows scanned: ${rows.length}`);
  console.log(`Auto extract: ${plan.autoExtract.length}`);
  console.log(`Needs human: ${plan.needsHuman.length}`);
  console.log(`Failing principle before: ${plan.failingPrincipleBefore}`);
  console.log(`Would write: ${plan.wouldWrite}`);
  console.log(`Failing principle after (predicted): ${plan.failingPrincipleAfter}`);
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
    written = await applyPrinciples(plan, args.field, allowlist);
    const freshRows = await loadActive(args.field, args.subject);
    const after = planGoverningPrincipleProposals({
      fieldId: args.field,
      rows: freshRows,
      limit: args.limit,
      allowlist,
    });
    failingAfter = after.failingPrincipleBefore;
    console.log(`Updated ${written} row(s). generationMeta.governingPrinciple only.`);
    console.log("qaPassed and active were not modified. Stem, options, and explanation were not modified.");
    console.log(`Failing principle after: ${failingAfter}`);
    console.log("Item QA flags were not cleared. Re-run db:audit-item-qa --clear-resolved after review.");
  }

  mkdirSync(args.outDir, { recursive: true });
  const slug = [args.field, args.subject].filter(Boolean).join("-");
  const jsonPath = path.join(args.outDir, `governing-principle-proposals-${slug}.json`);
  const mdPath = path.join(args.outDir, `governing-principle-proposals-${slug}.md`);
  const report = {
    mode,
    field: args.field,
    subject: args.subject ?? null,
    limit: args.limit > 0 ? args.limit : null,
    allowlist: allowlist ? [...allowlist] : null,
    counts: {
      autoExtract: plan.autoExtract.length,
      needsHuman: plan.needsHuman.length,
      failingPrincipleBefore: plan.failingPrincipleBefore,
      wouldWrite: plan.wouldWrite,
      failingPrincipleAfterPredicted: plan.failingPrincipleAfter,
      failingPrincipleAfter: failingAfter ?? null,
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
