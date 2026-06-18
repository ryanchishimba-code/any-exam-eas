#!/usr/bin/env node
/**
 * Keep only the top-quality NAPLEX items (default 6,500) and retire the rest.
 *
 * Ranking: best tier → acceptable tier (reject excluded), then quality score,
 * then fewer issue codes. Physician-educator / curated seeds get a small tie-break boost.
 *
 *   npm run db:trim-naplex-to-target:dry
 *   npm run db:trim-naplex-to-target
 *   npm run db:trim-naplex-to-target -- --target 6500
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { assessNaplexItemQuality, type NaplexQualityVerdict } from "../src/lib/exam-prep/naplex-quality-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const BATCH = 500;
const NAPLEX_TARGET_TOTAL = 6500;
const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "trim-naplex-to-target.json");

type RankedRow = {
  id: string;
  subjectId: string;
  tier: NaplexQualityVerdict["tier"];
  score: number;
  issueCount: number;
  rank: number;
  source: string | null;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NAPLEX_TARGET_TOTAL;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--target" && args[i + 1]) target = Number.parseInt(args[++i]!, 10);
  }
  return { target, dryRun };
}

function tierWeight(tier: NaplexQualityVerdict["tier"]): number {
  if (tier === "best") return 3;
  if (tier === "acceptable") return 2;
  return 0;
}

function sourceBoost(tags: string | null, source: string | null): number {
  const tagStr = tags ?? "";
  if (tagStr.includes("physician-educator")) return 0.08;
  if (source === "ai-curated" || tagStr.includes("ai-curated")) return 0.04;
  if (source === "seed" || source === "curated") return 0.02;
  return 0;
}

function computeRank(verdict: NaplexQualityVerdict, tags: string | null, source: string | null): number {
  return tierWeight(verdict.tier) * 1000 + verdict.score * 100 - verdict.issues.length + sourceBoost(tags, source);
}

async function main() {
  const { target, dryRun } = parseArgs();
  const total = await prisma.questionBankItem.count({ where: { fieldId: "pharmacy", active: true } });

  console.log(`\nNAPLEX trim — keep top ${target} by quality (${total} active now)${dryRun ? " [dry-run]" : ""}\n`);

  const ranked: RankedRow[] = [];
  let lastId: string | undefined;
  let scanned = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "pharmacy", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const verdict = assessNaplexItemQuality(item, { source: row.source });
      if (verdict.tier === "reject") continue;
      ranked.push({
        id: row.id,
        subjectId: row.subjectId,
        tier: verdict.tier,
        score: verdict.score,
        issueCount: verdict.issues.length,
        rank: computeRank(verdict, row.tags, row.source),
        source: row.source,
      });
    }

    scanned += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (scanned % 5000 === 0 || scanned === total) console.log(`  scored ${scanned}/${total}…`);
  }

  ranked.sort((a, b) => b.rank - a.rank || b.score - a.score || a.issueCount - b.issueCount);

  const eligible = ranked.length;
  const keep = ranked.slice(0, target);
  const keepIds = new Set(keep.map((r) => r.id));

  const bestKept = keep.filter((r) => r.tier === "best").length;
  const acceptableKept = keep.filter((r) => r.tier === "acceptable").length;

  console.log(`\nEligible (non-reject): ${eligible}`);
  console.log(`Keeping: ${keep.length} (best ${bestKept}, acceptable ${acceptableKept})`);
  console.log(`Retiring: ${total - keep.length} active rows`);

  const subjectCounts: Record<string, number> = {};
  for (const row of keep) subjectCounts[row.subjectId] = (subjectCounts[row.subjectId] ?? 0) + 1;

  if (!dryRun) {
    const now = new Date();
    let retireCursor: string | undefined;
    let retired = 0;

    while (true) {
      const rows = await prisma.questionBankItem.findMany({
        where: { fieldId: "pharmacy", active: true, ...(retireCursor ? { id: { gt: retireCursor } } : {}) },
        orderBy: { id: "asc" },
        take: BATCH,
        select: { id: true },
      });
      if (!rows.length) break;

      const toRetire = rows.filter((r) => !keepIds.has(r.id)).map((r) => r.id);
      if (toRetire.length) {
        await prisma.questionBankItem.updateMany({
          where: { id: { in: toRetire } },
          data: { active: false, qaPassed: false, qaAuditedAt: now },
        });
        retired += toRetire.length;
      }

      retireCursor = rows[rows.length - 1]!.id;
    }

    if (keepIds.size) {
      await prisma.questionBankItem.updateMany({
        where: { id: { in: [...keepIds] } },
        data: { active: true, qaPassed: true, qaAuditedAt: now },
      });
    }

    console.log(`\nRetired ${retired} rows; ${keep.length} remain active + qaPassed=true`);
  }

  mkdirSync(join(ROOT, "artifacts"), { recursive: true });
  writeFileSync(
    LOG,
    JSON.stringify(
      {
        at: new Date().toISOString(),
        dryRun,
        target,
        scanned,
        eligible,
        kept: keep.length,
        bestKept,
        acceptableKept,
        subjectCounts,
        minRank: keep[keep.length - 1]?.rank ?? null,
        maxRank: keep[0]?.rank ?? null,
      },
      null,
      2
    )
  );

  console.log(`Report: ${LOG}`);
  if (eligible < target) {
    console.log(`\n⚠ Only ${eligible} non-reject items — kept all eligible (below target ${target}).`);
  } else {
    console.log(`\n✓ NAPLEX bank capped at ${keep.length} serve-ready items.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
