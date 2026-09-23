#!/usr/bin/env node
/**
 * Classify Item QA text flags and, only with --apply, retire or clear them.
 *
 * Dry-run is the default. Nothing is written unless --apply is present.
 * --apply still does nothing unless --retire and/or --clear-resolved is set.
 * Choice text is never rewritten. qaPassed is never changed. Rows are never deleted.
 * Near-duplicate rows are left in the queue.
 *
 *   npm run db:remediate-text-flags -- --field nursing
 *   npm run db:remediate-text-flags -- --field nursing --retire
 *   npm run db:remediate-text-flags -- --field nursing --clear-resolved
 *   npm run db:remediate-text-flags -- --field nursing --retire --apply
 *   npm run db:remediate-text-flags -- --field nursing --clear-resolved --apply
 *
 * --retire sets active=false on rows classified retire (empty stem, or choices
 * that are only letters / single characters). --clear-resolved drops the text
 * flag when the current lint says the student-facing text is fine.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { contentFromStoredItem } from "../src/lib/exam-prep/item-qa/rationale-schema";
import {
  planTextFlagRemediation,
  textFlagClearWrite,
  textFlagRetireReason,
  textFlagRetireWrite,
  type TextFlagBankRow,
  type TextFlagPlanItem,
  type TextFlagRemediationPlan,
} from "../src/lib/exam-prep/item-qa";
import {
  requestActiveInventoryRevalidation,
  shouldRevalidateInventoryAfterRetire,
} from "../src/lib/inventory/active-inventory-cache";

const prisma = new PrismaClient();
const BATCH = 400;
const WRITE_BATCH = 20;

type Args = {
  field?: string;
  subject?: string;
  apply: boolean;
  retire: boolean;
  clearResolved: boolean;
  outDir: string;
};

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = {
    apply: false,
    retire: false,
    clearResolved: false,
    outDir: path.join(process.cwd(), "artifacts"),
  };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--field" && args[i + 1]) parsed.field = args[++i];
    else if (arg === "--subject" && args[i + 1]) parsed.subject = args[++i];
    else if (arg === "--out" && args[i + 1]) parsed.outDir = args[++i]!;
    else if (arg === "--apply") parsed.apply = true;
    else if (arg === "--dry-run") parsed.apply = false;
    else if (arg === "--retire") parsed.retire = true;
    else if (arg === "--clear-resolved") parsed.clearResolved = true;
    else {
      throw new Error(
        `Unknown argument: ${arg ?? ""}. Expected --field, --subject, --out, --dry-run, --apply, --retire, or --clear-resolved.`
      );
    }
  }
  if (args.includes("--apply") && args.includes("--dry-run")) {
    throw new Error("Pass either --apply or --dry-run, not both. No rows were changed.");
  }
  if (!parsed.field || parsed.field.startsWith("--")) {
    throw new Error("Pass --field <fieldId> (for example --field nursing). No rows were changed.");
  }
  if (parsed.apply && !parsed.retire && !parsed.clearResolved) {
    throw new Error(
      "Refusing --apply without --retire or --clear-resolved. No rows were changed. Run without --apply to list the classification."
    );
  }
  return parsed;
}

async function loadFlagged(field: string, subject?: string): Promise<TextFlagBankRow[]> {
  const rows: TextFlagBankRow[] = [];
  let lastId: string | undefined;
  while (true) {
    const page = await prisma.questionBankItem.findMany({
      where: {
        fieldId: field,
        active: true,
        reviewFlag: true,
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
        reviewFlag: true,
        reviewStatus: true,
        question: true,
        scenario: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        curationMeta: true,
      },
    });
    if (!page.length) break;
    for (const row of page) {
      const content = contentFromStoredItem(row);
      rows.push({
        id: row.id,
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        itemType: row.itemType,
        active: row.active,
        qaPassed: row.qaPassed,
        reviewFlag: row.reviewFlag,
        reviewStatus: row.reviewStatus,
        stem: row.question,
        scenario: row.scenario,
        options: content.options,
        ngnPayload: content.ngnPayload,
        correctAnswer: row.correctAnswer,
        explanation: row.explanation,
        curationMeta: row.curationMeta,
      });
    }
    lastId = page[page.length - 1]!.id;
  }
  return rows;
}

async function countInventory(field: string, subject?: string): Promise<{ active: number; published: number }> {
  const where = { fieldId: field, ...(subject ? { subjectId: subject } : {}) };
  const [active, published] = await Promise.all([
    prisma.questionBankItem.count({ where: { ...where, active: true } }),
    prisma.questionBankItem.count({ where: { ...where, active: true, qaPassed: true } }),
  ]);
  return { active, published };
}

async function countFullExamLinks(ids: string[]): Promise<number> {
  if (!ids.length) return 0;
  const where = { questionBankItemId: { in: ids } };
  const counts = await Promise.all([
    prisma.nclexFullPracticeExamQuestion.count({ where }),
    prisma.naplexFullPracticeExamQuestion.count({ where }),
    prisma.usmleFullPracticeExamQuestion.count({ where }),
    prisma.nptePtFullPracticeExamQuestion.count({ where }),
    prisma.panceFullPracticeExamQuestion.count({ where }),
    prisma.aanpFnpFullPracticeExamQuestion.count({ where }),
  ]);
  return counts.reduce((sum, count) => sum + count, 0);
}

function renderItem(item: TextFlagPlanItem): string {
  const options = item.triggeringOptions.length
    ? item.triggeringOptions.map((option) => JSON.stringify(option)).join(", ")
    : "(none)";
  const facing = item.studentFacingChoices.map((option) => JSON.stringify(option)).join(", ") || "(none)";
  const fix = item.proposedFixes.length
    ? ` Proposed: ${item.proposedFixes
        .map((entry) => `${JSON.stringify(entry.option)} → ${JSON.stringify(entry.completion)}`)
        .join("; ")}.`
    : "";
  return [
    `### ${item.id}`,
    "",
    `- Action: **${item.action}**${item.retireReason ? ` (${item.retireReason})` : ""}`,
    `- Subject: ${item.subjectId}; type: ${item.itemType ?? "mcq"}; qaPassed: ${item.qaPassed}; review: ${item.reviewStatus ?? "unset"}`,
    `- Codes: ${item.textCodes.join(", ")}`,
    `- Stem: ${item.stemPreview || "(blank)"}`,
    ...(item.scenarioPreview ? [`- Scenario: ${item.scenarioPreview}`] : []),
    `- Flagged choice text: ${options}`,
    `- Student-facing choices: ${facing}`,
    `- Why: ${item.reason}${fix}`,
    `- Stored detail: ${item.summary}`,
    "",
  ].join("\n");
}

function renderSection(title: string, items: readonly TextFlagPlanItem[]): string[] {
  const lines = [`## ${title} (${items.length})`, ""];
  if (!items.length) lines.push("None.", "");
  for (const item of items) lines.push(renderItem(item));
  return lines;
}

function renderMarkdown(input: {
  mode: "dry-run" | "apply";
  field: string;
  subject?: string;
  plan: TextFlagRemediationPlan;
  inventory: { active: number; published: number };
  fullExamLinks: number;
  retireRequested: boolean;
  clearRequested: boolean;
  retiredWritten?: number;
  clearedWritten?: number;
  cache?: { revalidated: boolean; url: string; error?: string };
}): string {
  const lines = [
    "# Text-flag remediation",
    "",
    `Mode: ${input.mode}`,
    `Field: ${input.field}`,
    `Subject: ${input.subject ?? "all"}`,
    `Retire requested: ${input.retireRequested}`,
    `Clear resolved requested: ${input.clearRequested}`,
    "",
    "Choice text is not rewritten. `qaPassed` is not changed. Rows are not deleted.",
    "Near-duplicate flags stay in the queue.",
    "",
    "## Counts",
    "",
    `- Retire: ${input.plan.retire.length}`,
    `- Clear false positive: ${input.plan.clear.length}`,
    `- Fix content (report only): ${input.plan.fixContent.length}`,
    `- Needs human: ${input.plan.needsHuman.length}`,
    `- Left in the Item QA queue (not these text codes): ${input.plan.leftInQueue}`,
    `- Full-exam links on retire rows (not removed): ${input.fullExamLinks}`,
    "",
    "## Inventory",
    "",
    "Public inventory is active and qaPassed. Retire sets active=false only.",
    "A clear does not change active or qaPassed, so it does not move the public count.",
    "",
    `- Active before: ${input.inventory.active}`,
    `- Published (active + qaPassed) before: ${input.inventory.published}`,
    `- Expected active drop if retire is applied: ${input.plan.retire.length}`,
    `- Expected published inventory drop if retire is applied: ${input.plan.publishedInventoryDrop}`,
    `- Expected published inventory after retire: ${input.inventory.published - input.plan.publishedInventoryDrop}`,
  ];
  if (input.retiredWritten !== undefined) lines.push(`- Rows retired: ${input.retiredWritten}`);
  if (input.clearedWritten !== undefined) lines.push(`- Text flags cleared: ${input.clearedWritten}`);
  if (input.cache) {
    lines.push(
      input.cache.revalidated
        ? `- Public inventory cache revalidated: ${input.cache.url}`
        : `- Public inventory cache NOT revalidated: ${input.cache.error ?? "unknown error"} (${input.cache.url})`
    );
  }
  lines.push(
    "",
    ...renderSection("Retire", input.plan.retire),
    ...renderSection("Clear false positive", input.plan.clear),
    ...renderSection("Fix content", input.plan.fixContent),
    ...renderSection("Needs human", input.plan.needsHuman)
  );
  return lines.join("\n");
}

async function applyRetire(plan: TextFlagRemediationPlan, field: string): Promise<number> {
  const retiredAt = new Date().toISOString();
  let written = 0;
  for (let i = 0; i < plan.retire.length; i += WRITE_BATCH) {
    const slice = plan.retire.slice(i, i + WRITE_BATCH);
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
            reviewFlag: true,
            reviewStatus: true,
            question: true,
            scenario: true,
            options: true,
            correctAnswer: true,
            explanation: true,
            curationMeta: true,
          },
        });
        if (!fresh || fresh.fieldId !== field || !fresh.active || fresh.reviewFlag !== true) return 0;
        const content = contentFromStoredItem(fresh);
        const again = planTextFlagRemediation({
          fieldId: field,
          rows: [
            {
              id: fresh.id,
              fieldId: fresh.fieldId,
              subjectId: fresh.subjectId,
              itemType: fresh.itemType,
              active: fresh.active,
              qaPassed: fresh.qaPassed,
              reviewFlag: fresh.reviewFlag,
              reviewStatus: fresh.reviewStatus,
              stem: fresh.question,
              scenario: fresh.scenario,
              options: content.options,
              ngnPayload: content.ngnPayload,
              correctAnswer: fresh.correctAnswer,
              explanation: fresh.explanation,
              curationMeta: fresh.curationMeta,
            },
          ],
        });
        const still = again.retire.find((candidate) => candidate.id === item.id);
        if (!still) return 0;
        const write = textFlagRetireWrite({
          curationMeta: fresh.curationMeta,
          retiredAt,
          retiredReason: textFlagRetireReason(still),
        });
        if (!write || write.active !== false || "qaPassed" in write) return 0;
        const updated = await prisma.questionBankItem.updateMany({
          where: { id: item.id, fieldId: field, active: true, reviewFlag: true },
          data: {
            active: write.active,
            reviewFlag: write.reviewFlag,
            curationMeta: write.curationMeta as Prisma.InputJsonValue,
          },
        });
        return updated.count;
      })
    );
    written += results.reduce((sum, count) => sum + count, 0);
    console.log(`  … retired ${written}/${plan.retire.length}`);
  }
  return written;
}

async function applyClear(plan: TextFlagRemediationPlan, field: string): Promise<number> {
  let written = 0;
  for (let i = 0; i < plan.clear.length; i += WRITE_BATCH) {
    const slice = plan.clear.slice(i, i + WRITE_BATCH);
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
            reviewFlag: true,
            reviewStatus: true,
            question: true,
            scenario: true,
            options: true,
            correctAnswer: true,
            explanation: true,
            curationMeta: true,
          },
        });
        if (!fresh || fresh.fieldId !== field || !fresh.active || fresh.reviewFlag !== true) return 0;
        const content = contentFromStoredItem(fresh);
        const again = planTextFlagRemediation({
          fieldId: field,
          rows: [
            {
              id: fresh.id,
              fieldId: fresh.fieldId,
              subjectId: fresh.subjectId,
              itemType: fresh.itemType,
              active: fresh.active,
              qaPassed: fresh.qaPassed,
              reviewFlag: fresh.reviewFlag,
              reviewStatus: fresh.reviewStatus,
              stem: fresh.question,
              scenario: fresh.scenario,
              options: content.options,
              ngnPayload: content.ngnPayload,
              correctAnswer: fresh.correctAnswer,
              explanation: fresh.explanation,
              curationMeta: fresh.curationMeta,
            },
          ],
        });
        if (!again.clear.some((candidate) => candidate.id === item.id)) return 0;
        const write = textFlagClearWrite({ curationMeta: fresh.curationMeta });
        if (!write || "active" in write || "qaPassed" in write) return 0;
        const updated = await prisma.questionBankItem.updateMany({
          where: { id: item.id, fieldId: field, active: true, reviewFlag: true },
          data: {
            reviewFlag: write.reviewFlag,
            curationMeta: write.curationMeta as Prisma.InputJsonValue,
          },
        });
        return updated.count;
      })
    );
    written += results.reduce((sum, count) => sum + count, 0);
    console.log(`  … cleared ${written}/${plan.clear.length}`);
  }
  return written;
}

async function main() {
  const args = parseArgs();
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. No rows were changed.");
  }
  const field = args.field!;
  const mode = args.apply ? "apply" : "dry-run";
  console.log(
    `\nText-flag remediation — field ${field}${args.subject ? ` subject ${args.subject}` : ""} [${mode}]\n`
  );

  const [rows, inventory] = await Promise.all([
    loadFlagged(field, args.subject),
    countInventory(field, args.subject),
  ]);
  const plan = planTextFlagRemediation({ fieldId: field, rows });
  const fullExamLinks = await countFullExamLinks(plan.retire.map((item) => item.id));

  console.log(`Flagged active rows scanned: ${rows.length}`);
  console.log(`Retire: ${plan.retire.length}`);
  console.log(`Clear false positive: ${plan.clear.length}`);
  console.log(`Fix content (not written): ${plan.fixContent.length}`);
  console.log(`Needs human: ${plan.needsHuman.length}`);
  console.log(`Left in queue (not these text codes): ${plan.leftInQueue}`);
  console.log(`Active before: ${inventory.active}`);
  console.log(`Published (active + qaPassed) before: ${inventory.published}`);
  console.log(`Expected published inventory drop if retire is applied: ${plan.publishedInventoryDrop}`);
  console.log(`Full-exam links on retire rows (left in place): ${fullExamLinks}`);

  const reportBase: Record<string, unknown> = {
    mode,
    field,
    subject: args.subject ?? null,
    retireRequested: args.retire,
    clearResolvedRequested: args.clearResolved,
    counts: {
      retire: plan.retire.length,
      clearFalsePositive: plan.clear.length,
      fixContent: plan.fixContent.length,
      needsHuman: plan.needsHuman.length,
      leftInQueue: plan.leftInQueue,
    },
    publishedInventoryDrop: plan.publishedInventoryDrop,
    inventoryBefore: inventory,
    expectedPublishedAfterRetire: inventory.published - plan.publishedInventoryDrop,
    fullExamLinks,
    retire: plan.retire,
    clear: plan.clear,
    fixContent: plan.fixContent,
    needsHuman: plan.needsHuman,
    generatedAt: new Date().toISOString(),
  };

  let retiredWritten: number | undefined;
  let clearedWritten: number | undefined;
  let cache: { revalidated: boolean; url: string; error?: string } | undefined;

  if (!args.apply) {
    console.log("\nDry run. No rows were changed.");
    if (!args.retire && !args.clearResolved) {
      console.log("Pass --retire and/or --clear-resolved with --apply to write. This command did not.");
    } else {
      console.log("Write flags were set, but --apply was not. No rows were changed.");
    }
  } else {
    if (args.retire) {
      retiredWritten = await applyRetire(plan, field);
      console.log(`Retired ${retiredWritten} row(s). qaPassed was not modified. No rows were deleted.`);
    }
    if (args.clearResolved) {
      clearedWritten = await applyClear(plan, field);
      console.log(`Cleared text flags on ${clearedWritten} row(s). active and qaPassed were not modified.`);
    }
    const after = await countInventory(field, args.subject);
    console.log(`Active after: ${after.active}`);
    console.log(`Published after: ${after.published}`);
    Object.assign(reportBase, {
      retiredWritten: retiredWritten ?? null,
      clearedWritten: clearedWritten ?? null,
      inventoryAfter: after,
    });

    if (shouldRevalidateInventoryAfterRetire(true, retiredWritten ?? 0)) {
      const result = await requestActiveInventoryRevalidation();
      cache = { revalidated: result.ok, url: result.url, error: result.error };
      Object.assign(reportBase, {
        cacheRevalidated: result.ok,
        cacheRevalidateUrl: result.url,
        cacheRevalidateError: result.error ?? null,
      });
      if (result.ok) console.log(`Inventory cache revalidated: ${result.url}`);
      else console.error(`Inventory cache was not revalidated (${result.url}): ${result.error}`);
    }
  }

  mkdirSync(args.outDir, { recursive: true });
  const slug = [field, args.subject].filter(Boolean).join("-");
  const jsonPath = path.join(args.outDir, `text-flag-remediation-${slug}.json`);
  const mdPath = path.join(args.outDir, `text-flag-remediation-${slug}.md`);
  writeFileSync(jsonPath, JSON.stringify(reportBase, null, 2));
  writeFileSync(
    mdPath,
    renderMarkdown({
      mode,
      field,
      subject: args.subject,
      plan,
      inventory,
      fullExamLinks,
      retireRequested: args.retire,
      clearRequested: args.clearResolved,
      retiredWritten,
      clearedWritten,
      cache,
    })
  );
  console.log(`Report: ${mdPath}`);

  if (cache && !cache.revalidated) {
    throw new Error(
      `Rows were updated, but the public inventory cache was not cleared. ${cache.error ?? ""}`.trim()
    );
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
