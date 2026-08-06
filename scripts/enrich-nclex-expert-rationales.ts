#!/usr/bin/env node
/**
 * Bulk-upgrade NCLEX rationales to expert tier (UWorld-beating depth).
 *
 * Usage:
 *   npm run db:enrich-nclex-expert -- --missing-expert --limit 500
 *   npm run db:enrich-nclex-expert:dry -- --limit 10
 *   npm run db:enrich-nclex-expert -- --serve-only --limit 200
 *   bash scripts/run-with-node.sh npx tsx scripts/enrich-nclex-expert-rationales.ts \
 *     --subjects maternal-child,fundamentals --missing-expert --limit 500
 *
 * Requires OPENAI_API_KEY.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { isNclexServeQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { EXPERT_RATIONALE_META_KEY, EXPERT_RATIONALE_VERSION, readExpertRationaleFromMeta } from "../src/lib/engine/rationale/expert-rationale-types";
import { generateExpertNclexRationale } from "../src/lib/engine/rationale/generate-expert-rationale";
import { attachVisualRationaleToItem } from "../src/lib/engine/rationale/enrich-visual-rationale";
import { needsRationaleEnrichment, rationaleInputFromBankItem } from "../src/lib/engine/rationale";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH = 40;
const DELAY_MS = 500;

const FAIL_COUNT_KEY = "rationaleEnrichFailCount";
const FAIL_AT_KEY = "rationaleEnrichFailedAt";
const FAIL_REASON_KEY = "rationaleEnrichFailReason";
/** Skip items that already failed expert enrichment this many times (unless --force). */
const SKIP_AFTER_FAILS = 1;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 50;
  let dryRun = false;
  let serveOnly = true;
  let force = false;
  let missingExpert = false;
  let afterId: string | undefined;
  let subjects: string[] | undefined;
  let tagsContains: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--serve-only") serveOnly = true;
    else if (args[i] === "--all-active") serveOnly = false;
    else if (args[i] === "--force") force = true;
    else if (args[i] === "--missing-expert") missingExpert = true;
    else if (args[i] === "--after-id" && args[i + 1]) afterId = args[++i];
    else if (args[i] === "--subjects" && args[i + 1]) {
      subjects = args[++i]!
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (args[i] === "--tags-contains" && args[i + 1]) {
      tagsContains = args[++i];
    }
  }

  return { limit, dryRun, serveOnly, force, missingExpert, afterId, subjects, tagsContains };
}

function readMeta(row: { generationMeta: unknown }): Record<string, unknown> {
  return typeof row.generationMeta === "object" && row.generationMeta
    ? (row.generationMeta as Record<string, unknown>)
    : {};
}

function priorFailCount(meta: Record<string, unknown>): number {
  const n = meta[FAIL_COUNT_KEY];
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { limit, dryRun, serveOnly, force, missingExpert, afterId, subjects, tagsContains } =
    parseArgs();
  if (!dryRun) requireOpenAiKey();

  console.log(
    `\nNCLEX expert rationale enrichment${serveOnly ? " [serve-ready]" : ""}${missingExpert ? " [missing-expert]" : ""}${subjects?.length ? ` [subjects=${subjects.join(",")}]` : ""}${tagsContains ? ` [tags~${tagsContains}]` : ""}${afterId ? ` [after ${afterId.slice(0, 8)}…]` : ""}${dryRun ? " [dry-run]" : ""} limit ${limit}\n`
  );

  let lastId: string | undefined = afterId;
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
        ...(subjects?.length ? { subjectId: { in: subjects } } : {}),
        ...(tagsContains ? { tags: { contains: tagsContains } } : {}),
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

      const priorMeta = readMeta(row);

      if (!force && readExpertRationaleFromMeta(row.generationMeta)) {
        skipped++;
        continue;
      }

      if (!force && priorFailCount(priorMeta) >= SKIP_AFTER_FAILS) {
        skipped++;
        continue;
      }

      const item = enrichBankItemFromRow(row);
      if (serveOnly && !isNclexServeQuality(item, { source: row.source })) {
        skipped++;
        continue;
      }

      const check = needsRationaleEnrichment(item);
      const lacksExpertJson = !readExpertRationaleFromMeta(row.generationMeta);
      if (!force && !missingExpert && !check.needs) {
        skipped++;
        continue;
      }
      if (missingExpert && !lacksExpertJson && !force) {
        skipped++;
        continue;
      }

      if (dryRun) {
        const reason = missingExpert && lacksExpertJson ? "missing_expert_json" : check.reasons.join(", ");
        console.log(`  [dry-run] ${row.id.slice(0, 8)}… — ${reason}`);
        enriched++;
        continue;
      }

      const result = await generateExpertNclexRationale(
        rationaleInputFromBankItem(item, "nursing")
      );

      if (!result?.quality.ok) {
        failed++;
        const reason = !result
          ? "null_result_schema_or_api"
          : `score_${result.quality.score}:${result.quality.issues.join(",") || "unknown"}`;
        console.warn(`  ✗ ${row.id.slice(0, 8)}… — ${reason}`);
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            generationMeta: {
              ...priorMeta,
              [FAIL_COUNT_KEY]: priorFailCount(priorMeta) + 1,
              [FAIL_AT_KEY]: new Date().toISOString(),
              [FAIL_REASON_KEY]: reason,
            },
          },
        });
        await sleep(DELAY_MS);
        continue;
      }

      const withVisuals = attachVisualRationaleToItem({
        ...item,
        explanation: result.assembled.explanation,
        distractorRationale: result.assembled.distractorRationale,
        expertRationale: result.structured,
      });

      const expertPayload =
        withVisuals.expertRationale ??
        readExpertRationaleFromMeta(withVisuals.ngnPayload?.generationMeta) ??
        result.structured;

      const hash = bankItemContentHash("nursing", item.subjectId ?? "nursing", {
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
            ...priorMeta,
            [EXPERT_RATIONALE_META_KEY]: expertPayload,
            expertRationaleVersion: EXPERT_RATIONALE_VERSION,
            rationaleEnrichedAt: new Date().toISOString(),
            rationaleModel: result.model,
            rationaleQualityScore: result.quality.score,
            [FAIL_COUNT_KEY]: 0,
            [FAIL_REASON_KEY]: null,
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
    subjects: subjects ?? null,
    tagsContains: tagsContains ?? null,
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
