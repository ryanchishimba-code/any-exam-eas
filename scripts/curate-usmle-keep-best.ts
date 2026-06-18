#!/usr/bin/env node
/**
 * Keep only the N best USMLE questions — rank every active USMLE item across
 * Step 1 + Step 2 CK + Step 3 by editorial QA quality and deactivate the rest.
 *
 * "Best" = auditUsmleQaEditor overallScore (1–10), tie-broken by polishScore,
 * physician-educator provenance, and current serve-ready (qaPassed) status.
 *
 * Non-destructive: retired items are set active=false (rows are kept and can be
 * reactivated). Does NOT touch users, subscriptions, or other tables.
 *
 * Usage:
 *   npm run db:curate-usmle-keep-best:dry            # preview, no writes
 *   npm run db:curate-usmle-keep-best                # apply (keep 11,000)
 *   npm run db:curate-usmle-keep-best -- --keep 9000 # custom target
 */
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const READ_BATCH = 400;
const WRITE_BATCH = 500;
const DEFAULT_KEEP = 11_000;

type ScoredItem = {
  id: string;
  fieldId: string;
  score: number;
  polish: number;
  physicianEducator: boolean;
  qaPassed: boolean;
};

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  let keep = DEFAULT_KEEP;
  const idx = args.indexOf("--keep");
  if (idx >= 0 && args[idx + 1]) {
    const n = Number.parseInt(args[idx + 1]!, 10);
    if (Number.isFinite(n) && n > 0) keep = n;
  }
  return { dryRun, keep };
}

/** Descending quality order: score → polish → physician-educator → serve-ready → id. */
function compareQuality(a: ScoredItem, b: ScoredItem): number {
  if (b.score !== a.score) return b.score - a.score;
  if (b.polish !== a.polish) return b.polish - a.polish;
  if (a.physicianEducator !== b.physicianEducator) return a.physicianEducator ? -1 : 1;
  if (a.qaPassed !== b.qaPassed) return a.qaPassed ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

async function loadAndScore(): Promise<ScoredItem[]> {
  const scored: ScoredItem[] = [];

  for (const fieldId of USMLE_FIELDS) {
    let lastId: string | undefined;
    let processed = 0;
    const total = await prisma.questionBankItem.count({ where: { fieldId, active: true } });
    process.stdout.write(`Scoring ${fieldId} (${total} active)…`);

    while (true) {
      const rows = await prisma.questionBankItem.findMany({
        where: { fieldId, active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
        orderBy: { id: "asc" },
        take: READ_BATCH,
      });
      if (rows.length === 0) break;

      for (const row of rows) {
        const item = enrichBankItemFromRow(row);
        const report = auditUsmleQaEditor(item, {
          fieldId,
          source: row.source ?? "bulk",
          itemId: row.id,
          difficulty: row.difficulty ?? null,
        });
        scored.push({
          id: row.id,
          fieldId,
          score: report.overallScore,
          polish: report.polishScore,
          physicianEducator: (item.tags ?? []).includes("physician-educator"),
          qaPassed: row.qaPassed,
        });
      }

      processed += rows.length;
      lastId = rows[rows.length - 1]!.id;
    }
    process.stdout.write(` done (${processed})\n`);
  }

  return scored;
}

function summarize(label: string, items: ScoredItem[]) {
  const byField: Record<string, number> = {};
  let qaPassed = 0;
  let scoreSum = 0;
  for (const it of items) {
    byField[it.fieldId] = (byField[it.fieldId] ?? 0) + 1;
    if (it.qaPassed) qaPassed++;
    scoreSum += it.score;
  }
  const avg = items.length ? (scoreSum / items.length).toFixed(2) : "0";
  console.log(`\n${label}: ${items.length} items (avg QA ${avg}, serve-ready ${qaPassed})`);
  for (const f of USMLE_FIELDS) console.log(`  ${f}: ${byField[f] ?? 0}`);
}

async function main() {
  const { dryRun, keep } = parseArgs();
  console.log(
    `\nUSMLE keep-best — target ${keep.toLocaleString()} across ${USMLE_FIELDS.join(", ")}${
      dryRun ? " [dry-run]" : ""
    }\n`
  );

  const scored = await loadAndScore();
  console.log(`\nTotal active USMLE items scored: ${scored.length.toLocaleString()}`);

  if (scored.length <= keep) {
    console.log(
      `\nNothing to retire — ${scored.length.toLocaleString()} active ≤ keep target ${keep.toLocaleString()}.`
    );
    return;
  }

  scored.sort(compareQuality);
  const kept = scored.slice(0, keep);
  const retired = scored.slice(keep);
  const cutoff = kept[kept.length - 1]!;

  summarize("KEEP", kept);
  summarize("RETIRE", retired);
  console.log(
    `\nQuality cutoff at rank ${keep}: score ${cutoff.score} (polish ${cutoff.polish}).`
  );

  if (dryRun) {
    console.log(`\n[dry-run] Would deactivate ${retired.length.toLocaleString()} items. No writes.`);
    return;
  }

  const now = new Date();
  const retireIds = retired.map((r) => r.id);
  let done = 0;
  for (let i = 0; i < retireIds.length; i += WRITE_BATCH) {
    const slice = retireIds.slice(i, i + WRITE_BATCH);
    await prisma.questionBankItem.updateMany({
      where: { id: { in: slice } },
      data: { active: false, qaAuditedAt: now },
    });
    done += slice.length;
    if (done % 5000 === 0 || done === retireIds.length) {
      console.log(`  … deactivated ${done}/${retireIds.length}`);
    }
  }

  const remaining = await prisma.questionBankItem.count({
    where: { fieldId: { in: [...USMLE_FIELDS] }, active: true },
  });
  console.log(`\nDeactivated ${retireIds.length.toLocaleString()} items.`);
  console.log(`Active USMLE items remaining: ${remaining.toLocaleString()}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
