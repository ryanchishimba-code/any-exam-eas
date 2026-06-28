#!/usr/bin/env node
/**
 * Bulk-upgrade NCLEX rationales to expert tier (UWorld-beating depth).
 *
 * Usage:
 *   npm run db:enrich-nclex-expert -- --limit 50
 *   npm run db:enrich-nclex-expert:dry -- --limit 10
 *   npm run db:enrich-nclex-expert -- --serve-only --limit 200
 *
 * Requires OPENAI_API_KEY.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { isNclexServeQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { EXPERT_RATIONALE_META_KEY, EXPERT_RATIONALE_VERSION } from "../src/lib/engine/rationale/expert-rationale-types";
import { generateExpertNclexRationale } from "../src/lib/engine/rationale/generate-expert-rationale";
import { needsRationaleEnrichment, rationaleInputFromBankItem } from "../src/lib/engine/rationale";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH = 40;
const DELAY_MS = 500;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 50;
  let dryRun = false;
  let serveOnly = true;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--serve-only") serveOnly = true;
    else if (args[i] === "--all-active") serveOnly = false;
    else if (args[i] === "--force") force = true;
  }

  return { limit, dryRun, serveOnly, force };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { limit, dryRun, serveOnly, force } = parseArgs();
  if (!dryRun) requireOpenAiKey();

  console.log(
    `\nNCLEX expert rationale enrichment${serveOnly ? " [serve-ready]" : ""}${dryRun ? " [dry-run]" : ""} limit ${limit}\n`
  );

  let lastId: string | undefined;
  let scanned = 0;
  let enriched = 0;
  let skipped = 0;
  let failed = 0;

  while (enriched < limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        ...(serveOnly ? { qaPassed: true } : {}),
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;

    for (const row of rows) {
      if (enriched >= limit) break;
      scanned++;
      lastId = row.id;

      const item = enrichBankItemFromRow(row);
      if (serveOnly && !isNclexServeQuality(item, { source: row.source })) {
        skipped++;
        continue;
      }

      const check = needsRationaleEnrichment(item);
      if (!force && !check.needs) {
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(`  [dry-run] ${row.id.slice(0, 8)}… — ${check.reasons.join(", ")}`);
        enriched++;
        continue;
      }

      const result = await generateExpertNclexRationale(
        rationaleInputFromBankItem(item, "nursing")
      );

      if (!result?.quality.ok) {
        failed++;
        console.warn(`  ✗ ${row.id.slice(0, 8)}… — quality ${result?.quality.score ?? 0}`);
        await sleep(DELAY_MS);
        continue;
      }

      const hash = bankItemContentHash("nursing", item.subjectId ?? "nursing", {
        ...item,
        explanation: result.assembled.explanation,
        distractorRationale: result.assembled.distractorRationale,
      });

      const priorMeta =
        typeof row.generationMeta === "object" && row.generationMeta
          ? (row.generationMeta as Record<string, unknown>)
          : {};

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
            ...priorMeta,
            [EXPERT_RATIONALE_META_KEY]: result.structured,
            expertRationaleVersion: EXPERT_RATIONALE_VERSION,
            rationaleEnrichedAt: new Date().toISOString(),
            rationaleModel: result.model,
            rationaleQualityScore: result.quality.score,
          },
        },
      });

      enriched++;
      console.log(`  ✓ ${row.id.slice(0, 8)}… — expert score ${result.quality.score}`);
      await sleep(DELAY_MS);
    }
  }

  const report = {
    field: "nursing",
    dryRun,
    serveOnly,
    scanned,
    enriched,
    skipped,
    failed,
    completedAt: new Date().toISOString(),
  };

  const out = path.join(process.cwd(), "artifacts", "nclex-expert-rationale-report.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(`\nDone — expert enriched ${enriched}, failed ${failed}, skipped ${skipped}`);
  console.log(`Report: ${out}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
