#!/usr/bin/env node
/**
 * Backfill NCLEX blueprintTopic + blueprintDomain for bank rows missing specific topics.
 *
 *   npx tsx scripts/reseed-nclex-blueprint-topics.ts              # dry-run stats
 *   npx tsx scripts/reseed-nclex-blueprint-topics.ts --apply
 *   npx tsx scripts/reseed-nclex-blueprint-topics.ts --apply --force-broad
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { primaryTestedConceptKey } from "../src/lib/exam-prep/exam-similarity";
import {
  inferNclexBlueprint,
  isSkillOnlyNclexBlueprintTopic,
} from "../src/lib/exam-prep/nclex/infer-blueprint-topic";

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    apply: args.includes("--apply"),
    forceBroad: args.includes("--force-broad"),
    limit: (() => {
      const i = args.indexOf("--limit");
      return i >= 0 && args[i + 1] ? Number.parseInt(args[i + 1]!, 10) : 0;
    })(),
  };
}

function shouldUpdateRow(
  blueprintTopic: string | null,
  forceBroad: boolean
): boolean {
  if (!blueprintTopic?.trim()) return true;
  // Only replace skill-level topics (delegation, prioritization) — keep full-exam
  // rotation topics like electrolytes, respiratory failure, medication rights.
  return forceBroad && isSkillOnlyNclexBlueprintTopic(blueprintTopic);
}

async function main() {
  const { apply, forceBroad, limit } = parseArgs();
  const prisma = new PrismaClient();

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    orderBy: { updatedAt: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  const beforeKeys = new Set<string>();
  const updates: {
    id: string;
    blueprintTopic: string;
    blueprintDomain: string | null;
    source: string;
    prevTopic: string | null;
  }[] = [];

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    beforeKeys.add(primaryTestedConceptKey(item));

    if (!shouldUpdateRow(row.blueprintTopic, forceBroad)) continue;

    const inferred = inferNclexBlueprint(item);
    const prev = row.blueprintTopic?.trim() || null;
    const nextDomain = inferred.blueprintDomain ?? row.blueprintDomain;
    const changed =
      inferred.blueprintTopic !== prev ||
      (inferred.blueprintDomain && inferred.blueprintDomain !== row.blueprintDomain);

    if (!changed) continue;

    updates.push({
      id: row.id,
      blueprintTopic: inferred.blueprintTopic,
      blueprintDomain: nextDomain,
      source: inferred.source,
      prevTopic: prev,
    });
  }

  const afterItems = rows.map((row) => {
    const u = updates.find((x) => x.id === row.id);
    if (!u) return enrichBankItemFromRow(row);
    return enrichBankItemFromRow({
      ...row,
      blueprintTopic: u.blueprintTopic,
      blueprintDomain: u.blueprintDomain ?? row.blueprintDomain,
    });
  });
  const afterKeys = new Set(afterItems.map(primaryTestedConceptKey));

  const bySource: Record<string, number> = {};
  for (const u of updates) bySource[u.source] = (bySource[u.source] ?? 0) + 1;

  console.log("\nNCLEX blueprintTopic reseed");
  console.log(`  mode: ${apply ? "APPLY" : "dry-run"}${forceBroad ? " (+ force-broad)" : ""}`);
  console.log(`  scanned: ${rows.length}`);
  console.log(`  to update: ${updates.length}`);
  console.log(`  unique concept keys: ${beforeKeys.size} → ${afterKeys.size}`);
  console.log(`  by source:`, bySource);

  console.log("\n  Sample updates:");
  for (const u of updates.slice(0, 8)) {
    console.log(`    ${u.prevTopic ?? "(null)"} → ${u.blueprintTopic} [${u.source}]`);
  }

  if (!apply) {
    console.log("\n  Pass --apply to write changes.");
    await prisma.$disconnect();
    return;
  }

  let written = 0;
  const BATCH = 50;
  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);
    await prisma.$transaction(
      batch.map((u) =>
        prisma.questionBankItem.update({
          where: { id: u.id },
          data: {
            blueprintTopic: u.blueprintTopic,
            ...(u.blueprintDomain ? { blueprintDomain: u.blueprintDomain } : {}),
          },
        })
      )
    );
    written += batch.length;
    if (written % 200 === 0 || written === updates.length) {
      console.log(`  written ${written}/${updates.length}`);
    }
  }

  console.log(`\nDone. Updated ${written} rows.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
