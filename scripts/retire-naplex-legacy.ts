#!/usr/bin/env node
/**
 * Soft-retire legacy NAPLEX bank items before a full rebuild.
 *
 * Keeps:
 *   - Items from the new full-exam pipeline (generationVersion = NAPLEX_FULL_EXAM_VERSION)
 *   - Physician-educator hand-authored seeds (tags contain "physician-educator")
 *
 * Retires everything else (old seed, bulk ai-curated, polished templates).
 *
 * Usage:
 *   npm run db:retire-naplex-legacy
 *   npm run db:retire-naplex-legacy:dry
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { NAPLEX_FULL_EXAM_VERSION } from "../src/lib/exam-prep/naplex/types";

const prisma = new PrismaClient();
const BATCH = 500;
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "retire-naplex-legacy.json");

const dryRun = process.argv.includes("--dry-run");

function shouldKeep(row: {
  generationVersion: string | null;
  tags: string | null;
}): boolean {
  if (row.generationVersion === NAPLEX_FULL_EXAM_VERSION) return true;
  const tags = row.tags ?? "";
  if (tags.includes("physician-educator")) return true;
  return false;
}

async function main() {
  const before = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });

  console.log(
    `\nRetire NAPLEX legacy — ${before} active pharmacy item(s)${dryRun ? " [dry-run]" : ""}\n`
  );
  console.log(`Keep: generationVersion="${NAPLEX_FULL_EXAM_VERSION}" OR tag physician-educator\n`);

  let cursor: string | undefined;
  let scanned = 0;
  let kept = 0;
  let retired = 0;
  const bySource: Record<string, { kept: number; retired: number }> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        ...(cursor ? { id: { gt: cursor } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
      select: { id: true, source: true, generationVersion: true, tags: true },
    });
    if (!rows.length) break;

    const toRetire: string[] = [];
    for (const row of rows) {
      scanned++;
      const src = row.source ?? "(null)";
      if (!bySource[src]) bySource[src] = { kept: 0, retired: 0 };

      if (shouldKeep(row)) {
        kept++;
        bySource[src].kept++;
      } else {
        toRetire.push(row.id);
        bySource[src].retired++;
      }
    }

    if (toRetire.length && !dryRun) {
      await prisma.questionBankItem.updateMany({
        where: { id: { in: toRetire } },
        data: { active: false, qaPassed: false, qaAuditedAt: new Date() },
      });
      retired += toRetire.length;
    } else if (toRetire.length) {
      retired += toRetire.length;
    }

    cursor = rows[rows.length - 1]!.id;
  }

  const after = dryRun
    ? before - retired
    : await prisma.questionBankItem.count({ where: { fieldId: "pharmacy", active: true } });

  const report = {
    at: new Date().toISOString(),
    dryRun,
    before,
    after,
    scanned,
    kept,
    retired,
    bySource,
    keepVersion: NAPLEX_FULL_EXAM_VERSION,
  };

  fs.mkdirSync(ARTIFACTS, { recursive: true });
  fs.writeFileSync(LOG, JSON.stringify(report, null, 2));

  console.log(`Scanned: ${scanned}`);
  console.log(`Kept:    ${kept}`);
  console.log(`Retired: ${retired}`);
  console.log(`Active after: ${after}`);
  console.log(`\nBy source:`);
  for (const [src, counts] of Object.entries(bySource).sort()) {
    console.log(`  ${src}: kept ${counts.kept}, retired ${counts.retired}`);
  }
  console.log(`\nReport: ${LOG}`);

  if (dryRun) {
    console.log("\nDry run — no DB changes.");
  } else {
    console.log("\n✓ Legacy NAPLEX items retired.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
