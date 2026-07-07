#!/usr/bin/env node
/**
 * Backfill structured visual rationale blocks (lab tables, CJMM flowcharts) on NCLEX items.
 *
 * Usage:
 *   npm run db:enrich-nclex-visual-rationales
 *   npm run db:enrich-nclex-visual-rationales -- --limit 500 --dry-run
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { attachVisualRationaleToItem } from "../src/lib/engine/rationale/enrich-visual-rationale";
import { EXPERT_RATIONALE_META_KEY } from "../src/lib/engine/rationale/expert-rationale-types";

const prisma = new PrismaClient();
const BATCH = 200;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
  }
  return { limit, dryRun };
}

function hasVisualBlocks(meta: unknown): boolean {
  if (!meta || typeof meta !== "object") return false;
  const m = meta as Record<string, unknown>;
  const expert = m[EXPERT_RATIONALE_META_KEY];
  if (expert && typeof expert === "object") {
    const vb = (expert as { visualBlocks?: unknown[] }).visualBlocks;
    if (Array.isArray(vb) && vb.length > 0) return true;
  }
  const standalone = m.visualRationale;
  return Array.isArray(standalone) && standalone.length > 0;
}

async function main() {
  const { limit, dryRun } = parseArgs();
  let lastId: string | undefined;
  let scanned = 0;
  let updated = 0;
  let skipped = 0;
  let noVisual = 0;

  console.log(`NCLEX visual rationale enrich${dryRun ? " [dry-run]" : ""}${limit ? ` limit=${limit}` : ""}\n`);

  while (true) {
    if (limit > 0 && scanned >= limit) break;

    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: Math.min(BATCH, limit > 0 ? limit - scanned : BATCH),
      select: {
        id: true,
        fieldId: true,
        subjectId: true,
        scenario: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        itemType: true,
        tags: true,
        source: true,
        generationMeta: true,
      },
    });

    if (rows.length === 0) break;

    for (const row of rows) {
      scanned++;
      if (hasVisualBlocks(row.generationMeta)) {
        skipped++;
        continue;
      }

      const item = enrichBankItemFromRow(row);
      const enriched = attachVisualRationaleToItem(item);
      const meta =
        typeof enriched.ngnPayload?.generationMeta === "object"
          ? enriched.ngnPayload.generationMeta
          : null;

      if (!meta || !hasVisualBlocks(meta)) {
        noVisual++;
        continue;
      }

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: { generationMeta: meta as object },
        });
      }
      updated++;
    }

    lastId = rows[rows.length - 1]!.id;
    if (scanned % 1000 === 0) {
      console.log(`  … ${scanned} scanned, ${updated} updated, ${skipped} already had visuals`);
    }
  }

  console.log(`\nScanned: ${scanned}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (already had visuals): ${skipped}`);
  console.log(`No derivable visuals: ${noVisual}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
