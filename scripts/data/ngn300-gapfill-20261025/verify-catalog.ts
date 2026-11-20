#!/usr/bin/env node
/**
 * Verify published NGN catalog counts and per-item scoring keys (serve.ts filter).
 *
 *   npx tsx scripts/data/ngn300-gapfill-20261025/verify-catalog.ts
 *   npx tsx scripts/data/ngn300-gapfill-20261025/verify-catalog.ts --expect 300
 */
import { perfect, score } from "@/lib/assessment/scoring/registry";
import { selectPublishedCatalog, type ServeCase, type ServeItem } from "@/lib/assessment/serve";
import { BATCH_ID, loadGapfillFile } from "./gapfill-lib";
import { catalogCountsFromRows } from "./catalog-counts";
import { loadEnvFiles } from "../../load-env";

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main() {
  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set.");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const cases = await prisma.ngnCase.findMany();
    const items = await prisma.ngnItem.findMany();
    const serveCases: ServeCase[] = cases.map((row) => ({
      id: row.id,
      version: row.version,
      batchId: row.batchId,
      boardProfile: row.boardProfile,
      status: row.status,
      title: row.title,
      primaryClientNeed: row.primaryClientNeed,
      setting: row.setting,
      patient: row.patient as ServeCase["patient"],
      timepoints: row.timepoints as ServeCase["timepoints"],
      chart: row.chart as ServeCase["chart"],
      revealRule: row.revealRule,
      references: row.references as ServeCase["references"],
    }));
    const serveItems: ServeItem[] = items.map((row) => ({
      id: row.id,
      version: row.version,
      batchId: row.batchId,
      itemType: row.itemType as ServeItem["itemType"],
      caseId: row.caseId,
      caseStep: row.caseStep,
      caseVersion: row.caseVersion,
      cjmmFunction: (Array.isArray(row.cjmmFunction) || typeof row.cjmmFunction === "string"
        ? row.cjmmFunction
        : []) as ServeItem["cjmmFunction"],
      timepoint: row.timepoint,
      responseFormat: row.responseFormat as ServeItem["responseFormat"],
      scoringRule: row.scoringRule as ServeItem["scoringRule"],
      maxPoints: row.maxPoints,
      stem: row.stem,
      payload: row.payload as ServeItem["payload"],
      exhibit: row.exhibit as ServeItem["exhibit"],
      rationale: row.rationale as ServeItem["rationale"],
      clientNeeds: row.clientNeeds as ServeItem["clientNeeds"],
      references: row.references as ServeItem["references"],
      rnFlags: Array.isArray(row.rnFlags)
        ? row.rnFlags.filter((flag): flag is string => typeof flag === "string")
        : [],
      status: row.status,
    }));

    const counts = catalogCountsFromRows(serveCases, serveItems);
    console.log("Published catalog (selectPublishedCatalog):", counts);

    const file = loadGapfillFile();
    const newIds = new Set(file.items.map((row) => String(row.id)));
    const catalog = selectPublishedCatalog({ cases: serveCases, items: serveItems });
    const scoringErrors: string[] = [];
    for (const unit of catalog.cases) {
      for (const item of unit.items) {
        if (!newIds.has(item.id)) continue;
        try {
          const earned = score(item, perfect(item));
          if (earned !== item.maxPoints) {
            scoringErrors.push(`${item.id}: perfect ${earned} !== max ${item.maxPoints}`);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          scoringErrors.push(`${item.id}: ${message}`);
        }
      }
    }
    for (const unit of catalog.standalones) {
      if (!newIds.has(unit.item.id)) continue;
      try {
        const earned = score(unit.item, perfect(unit.item));
        if (earned !== unit.item.maxPoints) {
          scoringErrors.push(`${unit.item.id}: perfect ${earned} !== max ${unit.item.maxPoints}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        scoringErrors.push(`${unit.item.id}: ${message}`);
      }
    }

    const batchItems = serveItems.filter((row) => row.batchId === BATCH_ID && row.status === "published");
    console.log(`Batch ${BATCH_ID} published item rows in DB: ${batchItems.length}`);

    if (scoringErrors.length > 0) {
      console.error("\nScoring errors for new items:");
      for (const line of scoringErrors) console.error(`  ${line}`);
      fail(`${scoringErrors.length} scoring error(s).`);
    }
    console.log(`New batch items in catalog: keys valid for ${newIds.size} ids`);

    const expect = hasFlag("--expect") ? Number(process.argv[process.argv.indexOf("--expect") + 1]) : null;
    if (expect != null && counts.scoredItems !== expect) {
      fail(`Expected scoredItems ${expect}, got ${counts.scoredItems}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
