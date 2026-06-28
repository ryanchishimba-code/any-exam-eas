#!/usr/bin/env node
/**
 * Backfill structured rationales for bank items that fail quality checks.
 *
 * Usage:
 *   npm run db:enrich-rationales -- --field nursing --limit 25
 *   npm run db:enrich-rationales:dry -- --field pharmacy --best-only
 *   npm run db:enrich-rationales -- --field nursing --all-active --limit 100
 *
 * Requires OPENAI_API_KEY.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import {
  generateStructuredRationale,
  needsRationaleEnrichment,
  rationaleInputFromBankItem,
} from "../src/lib/engine/rationale";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH = 50;
const DELAY_MS = 400;

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "nursing";
  let limit = 25;
  let dryRun = false;
  let bestOnly = true;
  let allActive = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--best-only") bestOnly = true;
    else if (args[i] === "--all-active") {
      bestOnly = false;
      allActive = true;
    }
  }

  return { field, limit, dryRun, bestOnly, allActive };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isBestTier(fieldId: string, item: ReturnType<typeof enrichBankItemFromRow>, source: string | null) {
  if (fieldId === "nursing") return assessNclexItemQuality(item, { source }).tier === "best";
  if (fieldId === "pharmacy") return assessNaplexItemQuality(item, { source }).tier === "best";
  return true;
}

async function main() {
  const { field, limit, dryRun, bestOnly } = parseArgs();
  if (!dryRun) requireOpenAiKey();

  console.log(
    `\nRationale enrichment — ${field}${bestOnly ? " [best-tier]" : ""}${dryRun ? " [dry-run]" : ""} limit ${limit}\n`
  );

  let lastId: string | undefined;
  let scanned = 0;
  let candidates = 0;
  let enriched = 0;
  let skipped = 0;
  let failed = 0;
  const reasonCounts: Record<string, number> = {};

  while (enriched < limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: field, active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      if (enriched >= limit) break;
      scanned++;
      lastId = row.id;

      const item = enrichBankItemFromRow(row);
      if (bestOnly && !isBestTier(field, item, row.source)) {
        skipped++;
        continue;
      }

      const check = needsRationaleEnrichment(item);
      if (!check.needs) {
        skipped++;
        continue;
      }

      candidates++;
      for (const r of check.reasons) reasonCounts[r] = (reasonCounts[r] ?? 0) + 1;

      if (dryRun) {
        console.log(`  [dry-run] ${row.id.slice(0, 8)}… — ${check.reasons.join(", ")}`);
        enriched++;
        continue;
      }

      const input = rationaleInputFromBankItem(item, field);
      const result = await generateStructuredRationale(input);

      if (!result?.quality.ok) {
        failed++;
        console.warn(`  ✗ ${row.id.slice(0, 8)}… — generation failed or low quality`);
        await sleep(DELAY_MS);
        continue;
      }

      const hash = bankItemContentHash(field, item.subjectId ?? field, {
        ...item,
        explanation: result.assembled.explanation,
        distractorRationale: result.assembled.distractorRationale,
      });

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          explanation: result.assembled.explanation,
          options: serializeBankOptions({
            ...item,
            distractorRationale: result.assembled.distractorRationale,
            clinicalReasoning: result.assembled.clinicalReasoning,
            keyTakeaways: result.assembled.keyTakeaways,
          }),
          contentHash: hash,
          generationMeta: {
            ...(typeof row.generationMeta === "object" && row.generationMeta
              ? (row.generationMeta as Record<string, unknown>)
              : {}),
            rationaleEnrichedAt: new Date().toISOString(),
            rationaleModel: result.model,
            rationaleQualityScore: result.quality.score,
          },
        },
      });

      enriched++;
      console.log(`  ✓ ${row.id.slice(0, 8)}… — score ${result.quality.score}`);
      await sleep(DELAY_MS);
    }
  }

  const report = {
    field,
    dryRun,
    scanned,
    candidates,
    enriched,
    skipped,
    failed,
    reasonCounts,
    completedAt: new Date().toISOString(),
  };

  const out = path.join(process.cwd(), "artifacts", "rationale-enrichment-report.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(`\nDone — enriched ${enriched}, failed ${failed}, skipped ${skipped}, scanned ${scanned}`);
  console.log(`Report: ${out}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
