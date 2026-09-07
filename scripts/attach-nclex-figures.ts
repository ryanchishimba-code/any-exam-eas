#!/usr/bin/env node
/**
 * Attach approved educational figures to NCLEX (nursing) bank items by topic.
 * Also normalizes exhibit findings/labTable → renderable stem tables.
 * Preserves NGN kinds (bow_tie, matrix, etc.).
 *
 * Usage:
 *   npm run db:attach-nclex-figures -- --dry-run --limit 100
 *   npm run db:attach-nclex-figures -- --topic labor-fetal-monitoring
 *   npm run db:attach-nclex-figures -- --limit 2000
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  enrichBankItemFromRow,
  serializeBankOptions,
} from "../src/lib/mpje/parse-bank-options";
import { normalizeNclexExhibitPayload } from "../src/lib/exam-prep/nclex/normalize-exhibit";
import type { NclexFigureRef } from "../src/lib/exam-prep/nclex/figure-assets";
import { attachVisualRationaleToItem } from "../src/lib/engine/rationale/enrich-visual-rationale";

const prisma = new PrismaClient();
const BATCH = 150;
const NCLEX_FIELDS = ["nursing"] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let topicFilter: string | null = null;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--force") force = true;
    else if (args[i] === "--topic" && args[i + 1]) topicFilter = args[++i]!.toLowerCase();
  }
  return { limit, dryRun, topicFilter, force };
}

function hasApprovedMedia(ngn: Record<string, unknown> | undefined): boolean {
  if (!Array.isArray(ngn?.media)) return false;
  return (ngn.media as NclexFigureRef[]).some((m) => m?.reviewStatus === "approved");
}

function hasRenderableTable(ngn: Record<string, unknown> | undefined): boolean {
  const table = ngn?.table as { headers?: unknown[] } | undefined;
  return Boolean(table?.headers?.length);
}

function topicCandidates(item: ReturnType<typeof enrichBankItemFromRow>): string[] {
  return [
    item.blueprintTopic,
    typeof item.ngnPayload?.blueprintTopic === "string"
      ? item.ngnPayload.blueprintTopic
      : null,
    item.topicCategory,
    ...(item.tags ?? []),
  ]
    .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
    .filter(Boolean);
}

async function main() {
  const { limit, dryRun, topicFilter, force } = parseArgs();

  let lastId: string | undefined;
  let scanned = 0;
  let attached = 0;
  let normalizedOnly = 0;
  let skipped = 0;

  console.log(
    `NCLEX figure attach${dryRun ? " [dry-run]" : ""} field=nursing${
      topicFilter ? ` topic~=${topicFilter}` : ""
    }${limit ? ` limit=${limit}` : ""}${force ? " force" : ""}\n`
  );

  while (true) {
    if (limit > 0 && scanned >= limit) break;

    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: { in: [...NCLEX_FIELDS] },
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: Math.min(BATCH, limit > 0 ? limit - scanned : BATCH),
    });

    if (rows.length === 0) break;

    for (const row of rows) {
      scanned++;
      const item = enrichBankItemFromRow(row);
      const topics = topicCandidates(item);
      if (topicFilter) {
        const hit = topics.some(
          (t) => t.includes(topicFilter) || topicFilter.includes(t)
        );
        if (!hit) {
          skipped++;
          continue;
        }
      }

      const already = hasApprovedMedia(item.ngnPayload);
      if (already && !force) {
        // Still allow table normalize
        const next = normalizeNclexExhibitPayload(item);
        const tableChanged =
          JSON.stringify(next.ngnPayload?.table) !== JSON.stringify(item.ngnPayload?.table);
        if (!tableChanged) {
          skipped++;
          continue;
        }
        if (!dryRun) {
          await prisma.questionBankItem.update({
            where: { id: row.id },
            data: {
              options: serializeBankOptions(next),
              updatedAt: new Date(),
            },
          });
        }
        normalizedOnly++;
        continue;
      }

      const next = normalizeNclexExhibitPayload(item);
      const mediaNow = hasApprovedMedia(next.ngnPayload);
      const tableNow = hasRenderableTable(next.ngnPayload);
      const changed =
        mediaNow !== already ||
        tableNow !== hasRenderableTable(item.ngnPayload) ||
        JSON.stringify(next.ngnPayload?.table) !== JSON.stringify(item.ngnPayload?.table) ||
        JSON.stringify(next.ngnPayload?.media) !== JSON.stringify(item.ngnPayload?.media);

      if (!changed) {
        skipped++;
        continue;
      }

      // Merge stem media into rationale visualBlocks (image kind).
      const withVisuals = attachVisualRationaleToItem(next);
      const genMeta =
        typeof withVisuals.ngnPayload?.generationMeta === "object"
          ? (withVisuals.ngnPayload.generationMeta as object)
          : row.generationMeta && typeof row.generationMeta === "object"
            ? (row.generationMeta as object)
            : undefined;

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            options: serializeBankOptions(withVisuals),
            ...(genMeta ? { generationMeta: genMeta } : {}),
            updatedAt: new Date(),
          },
        });
      }

      if (mediaNow && !already) attached++;
      else normalizedOnly++;
    }

    lastId = rows[rows.length - 1]!.id;
    if (scanned % 500 === 0) {
      console.log(
        `  … ${scanned} scanned, ${attached} figures attached, ${normalizedOnly} tables normalized`
      );
    }
  }

  console.log(`\nScanned: ${scanned}`);
  console.log(`Figures attached: ${attached}`);
  console.log(`Tables normalized (no new figure): ${normalizedOnly}`);
  console.log(`Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
