#!/usr/bin/env node
/**
 * Board-generic item QA: near-duplicate stems/options, text lint, rationale schema.
 *
 * Report only (does not unpublish or change qaPassed):
 *   npm run db:audit-item-qa -- --field nursing --subject management-of-care --limit 50
 *
 * Flag failures onto the admin Item QA queue (reviewFlag + curationMeta.itemQa).
 * Still does not change qaPassed or active:
 *   npm run db:audit-item-qa -- --field nursing --flag
 *   npm run db:audit-item-qa -- --field nursing --subject management-of-care --limit 50 --flag --include-rationale
 *
 * --flag marks text defects and near-duplicates.
 * Add --include-rationale to also queue schema gaps as `fails_schema` (expected on older items).
 * That flag does not rewrite rationale text, qaPassed, or active.
 * --clear-resolved removes this pipeline's flag when a previously flagged item now passes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { parseBankOptions } from "../src/lib/mpje/parse-bank-options";
import {
  contentFromStoredItem,
  evaluateItemPublishGate,
  findNearDuplicatePairs,
  ITEM_QA_PIPELINE,
  NEAR_DUPLICATE_CODE,
  readItemQaRecord,
  schemaFailureCodesFromIssues,
  withItemQaRecord,
  type DuplicatePair,
  type ItemPublishIssue,
} from "../src/lib/exam-prep/item-qa";

const prisma = new PrismaClient();
const BATCH = 400;

type Args = {
  field?: string;
  subject?: string;
  limit: number;
  flag: boolean;
  includeRationale: boolean;
  clearResolved: boolean;
  outDir: string;
};

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = {
    limit: 0,
    flag: false,
    includeRationale: false,
    clearResolved: false,
    outDir: path.join(process.cwd(), "artifacts"),
  };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--field" && args[i + 1]) parsed.field = args[++i];
    else if (arg === "--subject" && args[i + 1]) parsed.subject = args[++i];
    else if (arg === "--limit" && args[i + 1]) parsed.limit = Number.parseInt(args[++i]!, 10) || 0;
    else if (arg === "--out" && args[i + 1]) parsed.outDir = args[++i]!;
    else if (arg === "--flag") parsed.flag = true;
    else if (arg === "--include-rationale") parsed.includeRationale = true;
    else if (arg === "--clear-resolved") parsed.clearResolved = true;
  }
  return parsed;
}

type Scanned = {
  id: string;
  fieldId: string;
  subjectId: string;
  stem: string;
  options: string[];
  curationMeta: unknown;
  issues: ItemPublishIssue[];
};

function shouldQueue(item: Scanned, duplicate: boolean, includeRationale: boolean): boolean {
  const textError = item.issues.some((issue) => issue.area === "text" && issue.severity === "error");
  const rationaleError =
    includeRationale &&
    item.issues.some((issue) => issue.area === "rationale" && issue.severity === "error");
  return textError || rationaleError || duplicate;
}

function renderMarkdown(input: {
  scanned: number;
  field?: string;
  subject?: string;
  pairs: DuplicatePair[];
  byCode: Record<string, number>;
  queued: number;
}): string {
  const lines = [
    "# Item QA report",
    "",
    `Scanned: ${input.scanned}`,
    `Field: ${input.field ?? "all"}`,
    `Subject: ${input.subject ?? "all"}`,
    `Duplicate pairs: ${input.pairs.length}`,
    `Queued this run: ${input.queued}`,
    "",
    "## Issue counts",
    "",
  ];
  const codes = Object.entries(input.byCode).sort((a, b) => b[1] - a[1]);
  if (!codes.length) lines.push("No issues.");
  for (const [code, count] of codes) lines.push(`- ${code}: ${count}`);
  lines.push("", "## Duplicate pairs (first 30)", "");
  if (!input.pairs.length) lines.push("None.");
  for (const pair of input.pairs.slice(0, 30)) {
    lines.push(
      `- ${pair.kind}: keep ${pair.keepId}, flag ${pair.flagId} (stem ${pair.stemSimilarity}, options ${pair.optionSimilarity})`
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function applyFlags(
  rows: Scanned[],
  duplicateOf: Map<string, string>,
  includeRationale: boolean,
  clearResolved: boolean
): Promise<number> {
  let written = 0;
  const now = new Date().toISOString();
  for (const row of rows) {
    const partnerId = duplicateOf.get(row.id);
    const queue = shouldQueue(row, Boolean(partnerId), includeRationale);
    const existing = readItemQaRecord(row.curationMeta);
    const fullyClean = !shouldQueue(row, Boolean(partnerId), true);
    if (!queue && !(clearResolved && existing && fullyClean)) continue;
    if (!queue && clearResolved && existing) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          reviewFlag: false,
          curationMeta: withItemQaRecord(row.curationMeta, null) as Prisma.InputJsonValue,
        },
      });
      written += 1;
      continue;
    }
    const relevant = row.issues.filter(
      (issue) => issue.severity === "error" && (includeRationale || issue.area === "text")
    );
    const codes = [
      ...new Set([
        ...relevant.map((issue) => issue.code),
        ...(includeRationale ? schemaFailureCodesFromIssues(row.issues) : []),
        ...(partnerId ? [NEAR_DUPLICATE_CODE] : []),
      ]),
    ];
    const summaryParts = [
      partnerId ? `Near-duplicate of ${partnerId}.` : "",
      ...relevant.slice(0, 4).map((issue) => issue.message),
    ].filter(Boolean);
    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        reviewFlag: true,
        curationMeta: withItemQaRecord(row.curationMeta, {
          pipeline: ITEM_QA_PIPELINE,
          checkedAt: now,
          codes,
          summary: summaryParts.join(" ") || "Flagged by item QA.",
          partnerId,
        }) as Prisma.InputJsonValue,
      },
    });
    written += 1;
  }
  return written;
}

async function main() {
  const args = parseArgs();
  const where = {
    active: true,
    ...(args.field ? { fieldId: args.field } : {}),
    ...(args.subject ? { subjectId: args.subject } : {}),
  };

  const scanned: Scanned[] = [];
  let lastId: string | undefined;

  while (true) {
    const remaining = args.limit > 0 ? args.limit - scanned.length : BATCH;
    if (remaining <= 0) break;
    const rows = await prisma.questionBankItem.findMany({
      where: { ...where, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: Math.min(BATCH, remaining),
      select: {
        id: true,
        fieldId: true,
        subjectId: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        itemType: true,
        references: true,
        generationMeta: true,
        curationMeta: true,
      },
    });
    if (!rows.length) break;
    for (const row of rows) {
      const content = contentFromStoredItem(row);
      const gate = evaluateItemPublishGate(content);
      const options = parseBankOptions(row.options).options;
      scanned.push({
        id: row.id,
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        stem: row.question,
        options,
        curationMeta: row.curationMeta,
        issues: gate.issues,
      });
    }
    lastId = rows[rows.length - 1]!.id;
    console.log(`  … scanned ${scanned.length}`);
  }

  const pairs = findNearDuplicatePairs(
    scanned.map((row) => ({
      id: row.id,
      fieldId: row.fieldId,
      stem: row.stem,
      options: row.options,
    }))
  );
  const duplicateOf = new Map<string, string>();
  for (const pair of pairs) duplicateOf.set(pair.flagId, pair.keepId);

  const byCode: Record<string, number> = {};
  let queued = 0;
  for (const row of scanned) {
    for (const issue of row.issues) byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
    if (duplicateOf.has(row.id)) {
      byCode[NEAR_DUPLICATE_CODE] = (byCode[NEAR_DUPLICATE_CODE] ?? 0) + 1;
    }
    if (shouldQueue(row, duplicateOf.has(row.id), args.includeRationale)) queued += 1;
  }

  const slug = [args.field ?? "all", args.subject].filter(Boolean).join("-");
  mkdirSync(args.outDir, { recursive: true });
  const jsonPath = path.join(args.outDir, `item-qa-${slug}.json`);
  const mdPath = path.join(args.outDir, `item-qa-${slug}.md`);
  const report = {
    scanned: scanned.length,
    field: args.field ?? null,
    subject: args.subject ?? null,
    duplicatePairs: pairs,
    byCode,
    queued,
    items: scanned
      .filter((row) => row.issues.some((issue) => issue.severity === "error") || duplicateOf.has(row.id))
      .slice(0, 500)
      .map((row) => ({
        id: row.id,
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        partnerId: duplicateOf.get(row.id) ?? null,
        issues: row.issues,
      })),
  };
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(
    mdPath,
    renderMarkdown({
      scanned: scanned.length,
      field: args.field,
      subject: args.subject,
      pairs,
      byCode,
      queued,
    })
  );

  console.log(`\nScanned ${scanned.length} active item(s)`);
  console.log(`Duplicate pairs: ${pairs.length}`);
  console.log(`Would queue: ${queued} (text${args.includeRationale ? " + rationale" : ""} + duplicates)`);
  console.log(`Report: ${mdPath}`);

  if (args.flag || args.clearResolved) {
    const written = await applyFlags(scanned, duplicateOf, args.includeRationale, args.clearResolved);
    console.log(`Queue updates written: ${written} (qaPassed and active unchanged)`);
  } else {
    console.log("Report only. Pass --flag to mark reviewFlag without unpublishing.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
