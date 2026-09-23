#!/usr/bin/env node
/**
 * Retire Item QA near-duplicates by setting active=false.
 *
 * Dry-run is the default. Nothing is written unless --apply is present.
 * The higher flagged id is retired. The lower kept twin is not updated.
 * qaPassed is never changed, and rows are never deleted.
 *
 * Partner chains have no hop cap. A row is eligible only when each hop goes to
 * a strictly lower id and the walk ends at an active keeper in this field.
 * A decreasing id sequence cannot cycle. A repeated id is skipped as `cycle`
 * and is not retired. The old cap of 12 (`chain_too_long`) is gone.
 *
 *   npm run db:retire-near-duplicates -- --field nursing
 *   npm run db:retire-near-duplicates -- --field nursing --apply
 *
 * A successful --apply also asks the site to drop the public inventory cache
 * (`POST /api/cron/revalidate-inventory` with CRON_SECRET) so /nclex and the
 * question bank match the database without waiting out the one-hour TTL.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import {
  nearDuplicateRetireWrite,
  planNearDuplicateRetirements,
  type NearDuplicateBankRow,
  type NearDuplicateKeeperRow,
  type NearDuplicateRetirePlan,
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
  outDir: string;
};

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { apply: false, outDir: path.join(process.cwd(), "artifacts") };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--field" && args[i + 1]) parsed.field = args[++i];
    else if (arg === "--subject" && args[i + 1]) parsed.subject = args[++i];
    else if (arg === "--out" && args[i + 1]) parsed.outDir = args[++i]!;
    else if (arg === "--apply") parsed.apply = true;
    else if (arg === "--dry-run") parsed.apply = false;
    else {
      throw new Error(`Unknown argument: ${arg ?? ""}. Expected --field, --subject, --out, --dry-run, or --apply.`);
    }
  }
  if (args.includes("--apply") && args.includes("--dry-run")) {
    throw new Error("Pass either --apply or --dry-run, not both. No rows were changed.");
  }
  if (!parsed.field || parsed.field.startsWith("--")) {
    throw new Error("Pass --field <fieldId> (for example --field nursing). No rows were changed.");
  }
  return parsed;
}

async function loadFlagged(field: string, subject?: string): Promise<NearDuplicateBankRow[]> {
  const rows: NearDuplicateBankRow[] = [];
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
        active: true,
        qaPassed: true,
        reviewFlag: true,
        curationMeta: true,
      },
    });
    if (!page.length) break;
    rows.push(...page);
    lastId = page[page.length - 1]!.id;
  }
  return rows;
}

async function loadKeepers(ids: string[]): Promise<Map<string, NearDuplicateKeeperRow>> {
  const keepers = new Map<string, NearDuplicateKeeperRow>();
  for (let i = 0; i < ids.length; i += BATCH) {
    const slice = ids.slice(i, i + BATCH);
    const page = await prisma.questionBankItem.findMany({
      where: { id: { in: slice } },
      select: { id: true, fieldId: true, active: true },
    });
    for (const row of page) keepers.set(row.id, row);
  }
  return keepers;
}

function partnerIds(rows: readonly NearDuplicateBankRow[]): string[] {
  const ids = new Set<string>();
  for (const row of rows) {
    const meta = row.curationMeta;
    if (!meta || typeof meta !== "object" || Array.isArray(meta)) continue;
    const itemQa = (meta as Record<string, unknown>).itemQa;
    if (!itemQa || typeof itemQa !== "object" || Array.isArray(itemQa)) continue;
    const partnerId = (itemQa as Record<string, unknown>).partnerId;
    if (typeof partnerId === "string" && partnerId.trim()) ids.add(partnerId.trim());
  }
  return [...ids];
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

function skipCounts(plan: NearDuplicateRetirePlan): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const skip of plan.skipped) counts[skip.reason] = (counts[skip.reason] ?? 0) + 1;
  return counts;
}

function renderMarkdown(input: {
  mode: "dry-run" | "apply";
  field: string;
  subject?: string;
  plan: NearDuplicateRetirePlan;
  inventory: { active: number; published: number };
  fullExamLinks: number;
  written?: number;
  cache?: { revalidated: boolean; url: string; error?: string };
}): string {
  const drop = input.plan.publishedInventoryDrop;
  const lines = [
    "# Near-duplicate retire",
    "",
    `Mode: ${input.mode}`,
    `Field: ${input.field}`,
    `Subject: ${input.subject ?? "all"}`,
    `Eligible to retire: ${input.plan.retire.length}`,
    `Left in the Item QA queue (not near-duplicates): ${input.plan.leftInQueue}`,
    `Skipped near-duplicates: ${input.plan.skipped.length}`,
    `Full-exam links on eligible rows (not removed): ${input.fullExamLinks}`,
    "",
    "## Inventory",
    "",
    "Public inventory is active and qaPassed. This tool sets active=false on the eligible rows only.",
    "qaPassed is not changed, so the published count drops by the eligible rows that are already qaPassed.",
    "That drop is roughly the retired count when most queued near-duplicates are published.",
    "",
    "Partner chains are walked to the active lower keeper. Each hop must be a strictly lower id, so a long chain cannot cycle. There is no hop cap.",
    "",
    `- Active before: ${input.inventory.active}`,
    `- Published (active + qaPassed) before: ${input.inventory.published}`,
    `- Expected active drop: ${input.plan.retire.length}`,
    `- Expected published inventory drop: ${drop}`,
    `- Expected published inventory after: ${input.inventory.published - drop}`,
  ];
  if (input.written !== undefined) lines.push(`- Rows updated: ${input.written}`);
  if (input.cache) {
    lines.push(
      input.cache.revalidated
        ? `- Public inventory cache revalidated: ${input.cache.url}`
        : `- Public inventory cache NOT revalidated: ${input.cache.error ?? "unknown error"} (${input.cache.url})`
    );
  }
  lines.push("", "## Skips", "");
  const skips = Object.entries(skipCounts(input.plan));
  if (!skips.length) lines.push("None.");
  for (const [reason, count] of skips) lines.push(`- ${reason}: ${count}`);
  lines.push("", "## Eligible rows (first 40)", "");
  if (!input.plan.retire.length) lines.push("None.");
  for (const item of input.plan.retire.slice(0, 40)) {
    lines.push(
      `- ${item.id} subject ${item.subjectId}; partner ${item.partnerId}; keep ${item.rootKeepId}; qaPassed ${item.qaPassed}`
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function applyPlan(plan: NearDuplicateRetirePlan, field: string): Promise<number> {
  const keeperIds = new Set(plan.retire.map((item) => item.rootKeepId));
  if (plan.retire.some((item) => keeperIds.has(item.id))) {
    throw new Error("Refusing to apply: a keeper id is in the retire set. No rows were changed.");
  }

  const retiredAt = new Date().toISOString();
  let written = 0;
  for (let i = 0; i < plan.retire.length; i += WRITE_BATCH) {
    const slice = plan.retire.slice(i, i + WRITE_BATCH);
    const results = await Promise.all(
      slice.map(async (item) => {
        if (keeperIds.has(item.id)) return 0;
        const fresh = await prisma.questionBankItem.findUnique({
          where: { id: item.id },
          select: { id: true, fieldId: true, active: true, reviewFlag: true, curationMeta: true },
        });
        if (!fresh || fresh.fieldId !== field || !fresh.active || fresh.reviewFlag !== true) return 0;
        const write = nearDuplicateRetireWrite({
          curationMeta: fresh.curationMeta,
          retiredAt,
          rootKeepId: item.rootKeepId,
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
    console.log(`  … updated ${written}/${plan.retire.length}`);
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
  console.log(`\nNear-duplicate retire — field ${field}${args.subject ? ` subject ${args.subject}` : ""} [${mode}]\n`);

  const [rows, inventory] = await Promise.all([
    loadFlagged(field, args.subject),
    countInventory(field, args.subject),
  ]);
  const keepers = await loadKeepers(partnerIds(rows));
  const plan = planNearDuplicateRetirements({ fieldId: field, rows, keepers });
  const fullExamLinks = await countFullExamLinks(plan.retire.map((item) => item.id));

  console.log(`Flagged active rows scanned: ${rows.length}`);
  console.log(`Eligible near-duplicates: ${plan.retire.length}`);
  console.log(`Left in queue (other Item QA codes): ${plan.leftInQueue}`);
  console.log(`Skipped: ${plan.skipped.length}`);
  for (const [reason, count] of Object.entries(skipCounts(plan))) {
    console.log(`  ${reason}: ${count}`);
  }
  console.log(`Active before: ${inventory.active}`);
  console.log(`Published (active + qaPassed) before: ${inventory.published}`);
  console.log(`Expected published inventory drop: ${plan.publishedInventoryDrop}`);
  console.log(
    `Expected published inventory after: ${inventory.published - plan.publishedInventoryDrop}`
  );
  console.log(`Full-exam links on eligible rows (left in place): ${fullExamLinks}`);

  const reportBase = {
    mode,
    field,
    subject: args.subject ?? null,
    eligible: plan.retire.length,
    leftInQueue: plan.leftInQueue,
    skipped: plan.skipped,
    publishedInventoryDrop: plan.publishedInventoryDrop,
    inventoryBefore: inventory,
    expectedPublishedAfter: inventory.published - plan.publishedInventoryDrop,
    fullExamLinks,
    retire: plan.retire,
  };

  let written: number | undefined;
  let cache: { revalidated: boolean; url: string; error?: string } | undefined;
  if (!args.apply) {
    console.log(
      "\nDry run. No rows were changed. Pass --apply to set active=false on the eligible ids only and refresh the public inventory cache."
    );
  } else {
    written = await applyPlan(plan, field);
    const after = await countInventory(field, args.subject);
    console.log(`\nUpdated ${written} row(s). qaPassed was not modified. No rows were deleted.`);
    console.log(`Active after: ${after.active}`);
    console.log(`Published after: ${after.published}`);
    Object.assign(reportBase, { written, inventoryAfter: after });

    if (shouldRevalidateInventoryAfterRetire(true, written)) {
      const result = await requestActiveInventoryRevalidation();
      cache = {
        revalidated: result.ok,
        url: result.url,
        error: result.error,
      };
      Object.assign(reportBase, {
        cacheRevalidated: result.ok,
        cacheRevalidateUrl: result.url,
        cacheRevalidateError: result.error ?? null,
      });
      if (result.ok) {
        console.log(`Inventory cache revalidated: ${result.url}`);
      } else {
        console.error(`Inventory cache was not revalidated (${result.url}): ${result.error}`);
        console.error(
          `Rows are already updated. Retry: curl -X POST -H "Authorization: Bearer $CRON_SECRET" ${result.url}`
        );
      }
    } else {
      console.log("No rows updated. Public inventory cache left as-is.");
    }
  }

  mkdirSync(args.outDir, { recursive: true });
  const slug = [field, args.subject].filter(Boolean).join("-");
  const jsonPath = path.join(args.outDir, `retire-near-duplicates-${slug}.json`);
  const mdPath = path.join(args.outDir, `retire-near-duplicates-${slug}.md`);
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
      written,
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
