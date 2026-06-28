#!/usr/bin/env node
/**
 * Promote NCLEX bank to serve-ready target (default 5,000):
 * elevate active failures → reactivate best inactive → sync qaPassed.
 *
 * Usage:
 *   npm run db:promote-nclex-5k
 *   npm run db:promote-nclex-5k -- --dry-run
 *   npm run db:promote-nclex-5k -- --target 5000 --skip-reactivate
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { elevateNclexBankItem } from "../src/lib/engine/polish/nclex-elevate";
import {
  assessNclexServeQuality,
  isNclexServeQuality,
  NCLEX_SERVE_TARGET,
} from "../src/lib/exam-prep/nclex-quality-gate";
import { nclexBankItemIsServeReady } from "../src/lib/exam-prep/nclex-serve-gate";
import { buildNclexStudyMetaPatch } from "../src/lib/exam-prep/nclex-study-meta";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const BATCH = 300;
const ARTIFACT = path.join(process.cwd(), "artifacts", "nclex-promote-5k-report.json");

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NCLEX_SERVE_TARGET;
  let dryRun = false;
  let skipReactivate = false;
  let skipElevate = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--skip-reactivate") skipReactivate = true;
    else if (args[i] === "--skip-elevate") skipElevate = true;
  }
  return { target, dryRun, skipReactivate, skipElevate };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Candidate = {
  id: string;
  score: number;
  tier: string;
  item: import("../src/lib/question-bank").BankItem;
  subjectId: string;
  itemType: string | null;
  tags: string | null;
};

async function writeServeReadyItem(
  row: { id: string; subjectId: string; itemType: string | null; tags: string | null },
  item: import("../src/lib/question-bank").BankItem,
  dryRun: boolean
): Promise<boolean> {
  if (dryRun) return true;

  const finalHash = bankItemContentHash("nursing", row.subjectId, item);
  const collision = await prisma.questionBankItem.findFirst({
    where: { contentHash: finalHash, NOT: { id: row.id } },
  });
  if (collision) return false;

  const meta = buildNclexStudyMetaPatch(item);
  await prisma.questionBankItem.update({
    where: { id: row.id },
    data: {
      active: true,
      scenario: item.vignette ?? item.scenario ?? null,
      question: item.question,
      explanation: item.explanation,
      correctAnswer: item.correctAnswer,
      options: serializeBankOptions(item),
      references: item.references ?? undefined,
      tags: item.tags ? JSON.stringify(item.tags) : row.tags,
      itemType: item.itemType ?? row.itemType,
      source: "polished",
      contentHash: finalHash,
      subjectId: meta.subjectId,
      topicCategory: meta.topicCategory,
      qaPassed: true,
      qaAuditedAt: new Date(),
    },
  });
  return true;
}

async function countServed() {
  return prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });
}

/** Accurate serve count — re-audits each row (qaPassed can be stale). */
async function countActualServeReady(): Promise<number> {
  let lastId: string | undefined;
  let serve = 0;
  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;
    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      if (nclexBankItemIsServeReady(item, { source: row.source })) serve++;
    }
    lastId = rows[rows.length - 1]!.id;
  }
  return serve;
}

async function elevateActiveFailures(dryRun: boolean) {
  let lastId: string | undefined;
  let scanned = 0;
  let updated = 0;
  let nowServe = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;
    lastId = rows[rows.length - 1]!.id;

    for (const row of rows) {
      scanned++;
      const item = enrichBankItemFromRow(row);
      if (nclexBankItemIsServeReady(item, { source: row.source })) {
        nowServe++;
        continue;
      }

      const subject = getFieldSubject("nursing", row.subjectId);
      const elevated = elevateNclexBankItem(
        item,
        row.subjectId,
        subject?.label ?? row.subjectId,
        seedFromId(row.id),
        { forcePolish: true }
      );
      const verdict = assessNclexServeQuality(elevated.item, { source: "polished" });
      if (!nclexBankItemIsServeReady(elevated.item, { source: "polished" })) continue;

      if (dryRun) {
        updated++;
        nowServe++;
        continue;
      }

      const wrote = await writeServeReadyItem(row, elevated.item, dryRun);
      if (!wrote) continue;

      updated++;
      nowServe++;
    }

    if (scanned % 1500 === 0) console.log(`  elevate … ${scanned} scanned, ${updated} promoted`);
  }

  return { scanned, updated, nowServe };
}

async function reactivateInactive(target: number, dryRun: boolean) {
  const served = await countActualServeReady();
  const gap = Math.max(0, target - served);
  if (gap === 0) return { scanned: 0, reactivated: 0, candidates: 0 };

  console.log(`  Need ${gap} more serve-ready items — scanning inactive pool…`);

  const candidates: Candidate[] = [];
  let lastId: string | undefined;
  let scanned = 0;

  while (candidates.length < gap + 200) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: false,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;
    lastId = rows[rows.length - 1]!.id;

    for (const row of rows) {
      scanned++;
      const item = enrichBankItemFromRow(row);
      let working = item;
      let verdict = assessNclexServeQuality(working, { source: row.source });
      let serveReady = nclexBankItemIsServeReady(working, { source: row.source });

      if (!serveReady) {
        const subject = getFieldSubject("nursing", row.subjectId);
        const elevated = elevateNclexBankItem(
          item,
          row.subjectId,
          subject?.label ?? row.subjectId,
          seedFromId(row.id),
          { forcePolish: true }
        );
        working = elevated.item;
        verdict = assessNclexServeQuality(working, { source: "polished" });
        serveReady = nclexBankItemIsServeReady(working, { source: "polished" });
      }

      if (!serveReady) continue;
      candidates.push({
        id: row.id,
        score: verdict.score,
        tier: verdict.tier,
        item: working,
        subjectId: row.subjectId,
        itemType: row.itemType,
        tags: row.tags,
      });
    }

    if (scanned % 3000 === 0) console.log(`  inactive … ${scanned} scanned, ${candidates.length} candidates`);
  }

  candidates.sort((a, b) => b.score - a.score || (a.tier === "best" ? -1 : 1));
  const pick = candidates.slice(0, gap);
  let reactivated = 0;

  for (const c of pick) {
    const wrote = await writeServeReadyItem(
      { id: c.id, subjectId: c.subjectId, itemType: c.itemType, tags: c.tags },
      c.item,
      dryRun
    );
    if (wrote) reactivated++;
  }

  return { scanned, reactivated, candidates: candidates.length };
}

async function syncAllQaPassed(dryRun: boolean) {
  let lastId: string | undefined;
  let processed = 0;
  let serve = 0;
  const qaUpdates: Array<{ id: string; qaPassed: boolean }> = [];

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;
    lastId = rows[rows.length - 1]!.id;

    for (const row of rows) {
      processed++;
      const item = enrichBankItemFromRow(row);
      const shouldServe = nclexBankItemIsServeReady(item, { source: row.source });
      if (shouldServe) serve++;
      qaUpdates.push({ id: row.id, qaPassed: shouldServe });
    }

    if (!dryRun && qaUpdates.length >= BATCH) {
      await applyQaPassedBatch(prisma, qaUpdates.splice(0, qaUpdates.length), dryRun);
    }
  }

  if (!dryRun && qaUpdates.length > 0) {
    await applyQaPassedBatch(prisma, qaUpdates, dryRun);
  }

  return { processed, serve };
}

async function main() {
  const { target, dryRun, skipReactivate, skipElevate } = parseArgs();
  const startServed = await countActualServeReady();
  const inactiveTotal = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: false },
  });

  console.log(
    `\nNCLEX promote → ${target} serve-ready${dryRun ? " [dry-run]" : ""}\n` +
      `  Current served: ${startServed}\n` +
      `  Inactive pool: ${inactiveTotal}\n`
  );

  let elevateStats = { scanned: 0, updated: 0, nowServe: 0 };
  if (!skipElevate) {
    console.log("▶ Elevate active items failing serve bar…");
    elevateStats = await elevateActiveFailures(dryRun);
    console.log(
      `  elevated ${elevateStats.updated} / ${elevateStats.scanned} active (${elevateStats.nowServe} now pass serve)`
    );
  }

  let reactivateStats = { scanned: 0, reactivated: 0, candidates: 0 };
  if (!skipReactivate) {
    console.log("\n▶ Reactivate inactive serve-ready candidates…");
    reactivateStats = await reactivateInactive(target, dryRun);
    console.log(
      `  reactivated ${reactivateStats.reactivated} from ${reactivateStats.candidates} candidates (${reactivateStats.scanned} inactive scanned)`
    );
  }

  console.log("\n▶ Sync qaPassed flags…");
  const syncStats = await syncAllQaPassed(dryRun);

  const finalServed = dryRun ? startServed + reactivateStats.reactivated : await countActualServeReady();
  const report = {
    generatedAt: new Date().toISOString(),
    target,
    dryRun,
    startServed,
    finalServed,
    gapRemaining: Math.max(0, target - finalServed),
    elevate: elevateStats,
    reactivate: reactivateStats,
    sync: syncStats,
  };

  mkdirSync(path.dirname(ARTIFACT), { recursive: true });
  writeFileSync(ARTIFACT, JSON.stringify(report, null, 2));

  console.log(`\n  Serve-ready: ${finalServed} / ${target}`);
  if (report.gapRemaining > 0) {
    console.log(
      `  ⚠ Still ${report.gapRemaining} short — run:\n` +
        `    npm run db:enrich-nclex-guidelines\n` +
        `    npm run db:generate-nclex-to-target -- --target ${target} --metric qaPassed\n` +
        `    npm run db:promote-nclex-5k`
    );
  } else {
    console.log("  ✓ 5K serve-ready target met.");
  }
  console.log(`  Report: ${ARTIFACT}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
