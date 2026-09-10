#!/usr/bin/env node
/**
 * Backfill structured visual rationale blocks on AANP FNP items (esp. after figure attach).
 *
 * Usage:
 *   npm run db:enrich-aanp-fnp-visual-rationales
 *   npm run db:enrich-aanp-fnp-visual-rationales -- --limit 500 --dry-run
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
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

function readVisualBlocks(meta: unknown): unknown[] {
  if (!meta || typeof meta !== "object") return [];
  const m = meta as Record<string, unknown>;
  const expert = m[EXPERT_RATIONALE_META_KEY];
  if (expert && typeof expert === "object") {
    const vb = (expert as { visualBlocks?: unknown[] }).visualBlocks;
    if (Array.isArray(vb)) return vb;
  }
  const standalone = m.visualRationale;
  return Array.isArray(standalone) ? standalone : [];
}

function hasVisualBlocks(meta: unknown): boolean {
  return readVisualBlocks(meta).length > 0;
}

function hasImageVisualBlock(meta: unknown): boolean {
  return readVisualBlocks(meta).some(
    (b) => b && typeof b === "object" && (b as { kind?: string }).kind === "image"
  );
}

function hasApprovedStemMedia(item: ReturnType<typeof enrichBankItemFromRow>): boolean {
  const media = item.ngnPayload?.media;
  if (!Array.isArray(media)) return false;
  return media.some(
    (m) => m && typeof m === "object" && (m as { reviewStatus?: string }).reviewStatus === "approved"
  );
}

async function main() {
  const { limit, dryRun } = parseArgs();
  let lastId: string | undefined;
  let scanned = 0;
  let updated = 0;
  let skipped = 0;

  console.log(
    `AANP FNP visual rationale enrich${dryRun ? " [dry-run]" : ""}${limit ? ` limit=${limit}` : ""}\n`
  );

  while (true) {
    if (limit > 0 && scanned >= limit) break;
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "aanp-fnp",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: Math.min(BATCH, limit > 0 ? limit - scanned : BATCH),
    });
    if (!rows.length) break;

    for (const row of rows) {
      scanned++;
      lastId = row.id;
      const item = enrichBankItemFromRow(row);
      const before = hasVisualBlocks(row.generationMeta);
      const needsImage =
        hasApprovedStemMedia(item) && !hasImageVisualBlock(row.generationMeta);
      if (before && !needsImage) {
        skipped++;
        continue;
      }

      const next = attachVisualRationaleToItem(item);
      const afterMeta = next.ngnPayload?.generationMeta ?? row.generationMeta;
      const after = hasVisualBlocks(afterMeta);
      if (!after || (before && !needsImage)) {
        skipped++;
        continue;
      }

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            options: serializeBankOptions(next),
            generationMeta:
              typeof afterMeta === "object" && afterMeta
                ? (afterMeta as object)
                : row.generationMeta ?? undefined,
            updatedAt: new Date(),
          },
        });
      }
      updated++;
    }
  }

  console.log(`Scanned: ${scanned}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
