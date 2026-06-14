#!/usr/bin/env node
/**
 * Attach structured guideline references to question bank rows.
 *
 * Usage:
 *   npm run db:enrich-nclex-guidelines
 *   npm run db:enrich-nclex-guidelines -- --dry-run --limit 100
 *   npm run db:enrich-naplex-guidelines
 *   npm run db:enrich-guidelines -- --field nursing --best-only
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { enrichBankItemGuidelines } from "../src/lib/exam-prep/enrich-guidelines";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const BATCH = 400;

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "nursing";
  let limit = 0;
  let dryRun = false;
  let bestOnly = false;
  let json = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i];
    else if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--best-only") bestOnly = true;
    else if (args[i] === "--json") json = true;
  }
  return { field, limit, dryRun, bestOnly, json };
}

function assessBest(fieldId: string, item: ReturnType<typeof enrichBankItemFromRow>, source: string | null) {
  if (fieldId === "nursing") return assessNclexItemQuality(item, { source }).tier === "best";
  if (fieldId === "pharmacy") return assessNaplexItemQuality(item, { source }).tier === "best";
  return true;
}

async function main() {
  const { field, limit, dryRun, bestOnly, json } = parseArgs();
  const where = { fieldId: field, active: true };
  const total = await prisma.questionBankItem.count({ where });

  console.log(
    `\nGuideline enrichment — ${field} (${total} active)${bestOnly ? " [best-tier candidates]" : ""}${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let updated = 0;
  let refsOnly = 0;
  let explAugmented = 0;
  let skipped = 0;
  const ruleHits: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { ...where, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      if (limit > 0 && processed >= limit) break;

      processed++;
      const item = enrichBankItemFromRow(row);

      if (bestOnly && !assessBest(field, item, row.source)) {
        skipped++;
        continue;
      }

      const result = enrichBankItemGuidelines(item, field);
      if (!result.changed) {
        skipped++;
        continue;
      }

      for (const id of result.matchedRuleIds) {
        ruleHits[id] = (ruleHits[id] ?? 0) + 1;
      }
      if (result.referencesAdded) refsOnly++;
      if (result.explanationAugmented) explAugmented++;

      if (dryRun) {
        updated++;
        continue;
      }

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          references: result.item.references ?? undefined,
          explanation: result.item.explanation,
          qaAuditedAt: new Date(),
        },
      });
      updated++;
    }

    if (limit > 0 && processed >= limit) break;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0) console.log(`  … ${processed} processed, ${updated} enriched`);
  }

  const report = {
    field,
    total,
    processed,
    updated,
    skipped,
    refsOnly,
    explanationAugmented: explAugmented,
    topRules: Object.entries(ruleHits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([id, count]) => ({ id, count })),
  };

  console.log(`\nProcessed: ${processed}`);
  console.log(`${dryRun ? "Would enrich" : "Enriched"}: ${updated}`);
  console.log(`Skipped (already had refs or filtered): ${skipped}`);
  console.log(`Explanation augmented: ${explAugmented}`);
  console.log(`Top rules:`);
  for (const { id, count } of report.topRules) console.log(`  ${id}: ${count}`);

  if (json) {
    const outPath = path.join(process.cwd(), "artifacts", `guideline-enrich-${field}.json`);
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`\nReport: ${outPath}`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
