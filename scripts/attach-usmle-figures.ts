#!/usr/bin/env node
/**
 * Attach approved educational figures (SVG catalog / CDN refs) to USMLE bank items by topic.
 * Also normalizes exhibit findings/labTable → renderable stem tables.
 *
 * Usage:
 *   npm run db:attach-usmle-figures -- --dry-run --limit 100
 *   npm run db:attach-usmle-figures -- --topic acute-coronary-syndrome
 *   npm run db:attach-usmle-figures -- --field usmle-step-2 --limit 500
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  enrichBankItemFromRow,
  serializeBankOptions,
} from "../src/lib/mpje/parse-bank-options";
import { normalizeUsmleExhibitPayload } from "../src/lib/exam-prep/usmle/normalize-exhibit";
import {
  attachFigureRefToNgn,
  findApprovedFiguresForTopic,
  type UsmleFigureRef,
} from "../src/lib/exam-prep/usmle/figure-assets";

const prisma = new PrismaClient();
const BATCH = 150;
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let field: string | "all" = "all";
  let topicFilter: string | null = null;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--force") force = true;
    else if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--topic" && args[i + 1]) topicFilter = args[++i]!.toLowerCase();
  }
  return { limit, dryRun, field, topicFilter, force };
}

function topicFromItem(item: ReturnType<typeof enrichBankItemFromRow>): string | null {
  const fromCol = item.blueprintTopic?.trim();
  if (fromCol) return fromCol;
  const fromNgn = item.ngnPayload?.blueprintTopic;
  if (typeof fromNgn === "string" && fromNgn.trim()) return fromNgn.trim();
  const tags = item.tags ?? [];
  for (const tag of tags) {
    const t = tag.toLowerCase();
    if (t.includes("acs") || t.includes("stemi") || t.includes("ecg") || t.includes("pneumothorax")) {
      return tag;
    }
  }
  return null;
}

function hasApprovedMedia(ngn: Record<string, unknown> | undefined): boolean {
  if (!Array.isArray(ngn?.media)) return false;
  return (ngn.media as UsmleFigureRef[]).some((m) => m?.reviewStatus === "approved");
}

function hasRenderableTable(ngn: Record<string, unknown> | undefined): boolean {
  const table = ngn?.table as { headers?: unknown[] } | undefined;
  return Boolean(table?.headers?.length);
}

async function main() {
  const { limit, dryRun, field, topicFilter, force } = parseArgs();
  const fields =
    field === "all"
      ? [...USMLE_FIELDS]
      : USMLE_FIELDS.includes(field as (typeof USMLE_FIELDS)[number])
        ? [field]
        : (() => {
            throw new Error(`Unknown field: ${field}`);
          })();

  let lastId: string | undefined;
  let scanned = 0;
  let attached = 0;
  let normalizedOnly = 0;
  let skipped = 0;

  console.log(
    `USMLE figure attach${dryRun ? " [dry-run]" : ""} fields=${fields.join(",")}${
      topicFilter ? ` topic~=${topicFilter}` : ""
    }${limit ? ` limit=${limit}` : ""}${force ? " force" : ""}\n`
  );

  while (true) {
    if (limit > 0 && scanned >= limit) break;

    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: { in: fields },
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
      const topic = topicFromItem(item);
      if (topicFilter) {
        const t = (topic ?? "").toLowerCase();
        if (!t.includes(topicFilter) && !topicFilter.includes(t)) {
          skipped++;
          continue;
        }
      }

      const organ =
        item.blueprintDomain ??
        (typeof item.ngnPayload?.blueprintSystem === "string"
          ? item.ngnPayload.blueprintSystem
          : null);

      let next = normalizeUsmleExhibitPayload(item);
      const figures = findApprovedFiguresForTopic(topic, organ);
      const already = hasApprovedMedia(next.ngnPayload);
      let didAttach = false;

      if (figures[0] && (!already || force)) {
        const ngn = attachFigureRefToNgn({ ...(next.ngnPayload ?? {}) }, figures[0]);
        next = {
          ...next,
          itemType: next.itemType === "biostats" ? "biostats" : "exhibit",
          ngnPayload: ngn,
        };
        didAttach = true;
      }

      const tableNow = hasRenderableTable(next.ngnPayload);
      const mediaNow = hasApprovedMedia(next.ngnPayload);
      const changed =
        didAttach ||
        tableNow !== hasRenderableTable(item.ngnPayload) ||
        JSON.stringify(next.ngnPayload?.table) !== JSON.stringify(item.ngnPayload?.table) ||
        (mediaNow && !already);

      if (!changed) {
        skipped++;
        continue;
      }

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            options: serializeBankOptions(next),
            itemType: next.itemType ?? row.itemType,
            updatedAt: new Date(),
          },
        });
      }

      if (didAttach) attached++;
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
