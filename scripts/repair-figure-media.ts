#!/usr/bin/env node
/**
 * Re-normalize NCLEX (+ optional USMLE) figure media: prune misfits, keep content-fitting attaches.
 *
 * Usage:
 *   npm run db:repair-figure-media -- --field nursing --limit 5000
 *   npm run db:repair-figure-media -- --field usmle --limit 2000 --dry-run
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
import { normalizeUsmleFullExamItem } from "../src/lib/exam-prep/usmle/quality-gate";
import { attachVisualRationaleToItem } from "../src/lib/engine/rationale/enrich-visual-rationale";

const prisma = new PrismaClient();
const BATCH = 100;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let field: "nursing" | "usmle" | "all" = "nursing";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--field" && args[i + 1]) {
      field = args[++i]! as "nursing" | "usmle" | "all";
    }
  }
  return { limit, dryRun, field };
}

function mediaIds(ngn: Record<string, unknown> | undefined): string[] {
  if (!Array.isArray(ngn?.media)) return [];
  return (ngn.media as { id?: string }[])
    .map((m) => m?.id)
    .filter((id): id is string => Boolean(id));
}

async function repairFields(fieldIds: string[], limit: number, dryRun: boolean) {
  let lastId: string | undefined;
  let scanned = 0;
  let changed = 0;
  let pruned = 0;
  let kept = 0;

  while (true) {
    if (limit > 0 && scanned >= limit) break;
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: { in: fieldIds },
        active: true,
        OR: [{ options: { contains: '"media"' } }],
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: Math.min(BATCH, limit > 0 ? limit - scanned : BATCH),
    });
    if (!rows.length) break;

    for (const row of rows) {
      scanned++;
      const item = enrichBankItemFromRow(row);
      const before = mediaIds(item.ngnPayload).sort().join(",");
      const next =
        row.fieldId === "nursing"
          ? normalizeNclexExhibitPayload(item)
          : normalizeUsmleFullExamItem(item);
      const afterIds = mediaIds(next.ngnPayload);
      const after = afterIds.sort().join(",");
      if (before === after) {
        kept++;
        continue;
      }

      if (afterIds.length < before.split(",").filter(Boolean).length) pruned++;

      const withVisuals = attachVisualRationaleToItem(next);
      const genMeta =
        typeof withVisuals.ngnPayload?.generationMeta === "object"
          ? (withVisuals.ngnPayload.generationMeta as object)
          : undefined;

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            options: serializeBankOptions(withVisuals),
            itemType: withVisuals.itemType ?? row.itemType,
            ...(genMeta ? { generationMeta: genMeta } : {}),
            updatedAt: new Date(),
          },
        });
      }
      changed++;
    }

    lastId = rows[rows.length - 1]!.id;
    if (scanned % 500 === 0) {
      console.log(`  … ${scanned} scanned, ${changed} changed, ${pruned} pruned-ish`);
    }
  }

  console.log(`fields=${fieldIds.join(",")}`);
  console.log(`Scanned: ${scanned}`);
  console.log(`Changed: ${changed}`);
  console.log(`Unchanged: ${kept}`);
}

async function main() {
  const { limit, dryRun, field } = parseArgs();
  console.log(`Repair figure media${dryRun ? " [dry-run]" : ""} field=${field}${limit ? ` limit=${limit}` : ""}\n`);

  if (field === "nursing" || field === "all") {
    await repairFields(["nursing"], limit, dryRun);
  }
  if (field === "usmle" || field === "all") {
    await repairFields(["usmle-step-1", "usmle-step-2", "usmle-step-3"], limit, dryRun);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
