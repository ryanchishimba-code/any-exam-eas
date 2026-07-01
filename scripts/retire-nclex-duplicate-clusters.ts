#!/usr/bin/env node
/**
 * Retire near-duplicate NCLEX mega-clusters — keep one best item per cluster.
 *
 * Usage:
 *   npm run db:retire-nclex-dupes:dry
 *   npm run db:retire-nclex-dupes -- --apply
 *   npm run db:retire-nclex-dupes -- --apply --min-size 20 --assign-clusters
 *
 * Requires embeddings (run db:curate-nclex-engine:embed first if missing).
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { scoreNclexBankItem } from "../src/lib/engine/polish/nclex-polish";
import { runCurationPipeline, parseCurationCliArgs } from "../src/lib/bank-curation/pipeline";
import { countMissingEmbeddings } from "../src/lib/bank-curation/pgvector-store";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  let minSize = 20;
  let apply = false;
  let assignClusters = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--apply") apply = true;
    else if (a === "--dry-run") apply = false;
    else if (a === "--assign-clusters") assignClusters = true;
    else if (a === "--min-size" && args[i + 1]) minSize = parseInt(args[++i]!, 10);
  }

  return { minSize, apply, assignClusters };
}

function scoreRow(row: {
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  tags: string | null;
  source: string;
}): number {
  return scoreNclexBankItem(enrichBankItemFromRow(row));
}

async function main() {
  const { minSize, apply, assignClusters } = parseArgs();
  const missingEmb = await countMissingEmbeddings(prisma);

  if (assignClusters || missingEmb > 0) {
    if (missingEmb > 0) {
      console.log(`${missingEmb} items missing embeddings — run embed pass first (may take ~15 min).`);
      console.log("Assigning clusters only (--skip-embed requires existing embeddings)…");
    }
    if (missingEmb === 0 || assignClusters) {
      await runCurationPipeline(
        prisma,
        parseCurationCliArgs(["--cluster-only", "--skip-embed", "--dry-run"])
      );
    }
  }

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, clusterId: { not: null } },
    select: {
      id: true,
      clusterId: true,
      subjectId: true,
      source: true,
      question: true,
      scenario: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      tags: true,
      generationVersion: true,
    },
  });

  const byCluster = new Map<string, typeof rows>();
  for (const row of rows) {
    const cid = row.clusterId?.trim();
    if (!cid || cid.includes("-solo-")) continue;
    const list = byCluster.get(cid) ?? [];
    list.push(row);
    byCluster.set(cid, list);
  }

  const toRetire: string[] = [];
  const reportClusters: Array<{
    clusterId: string;
    size: number;
    keptId: string;
    retiredCount: number;
  }> = [];

  for (const [clusterId, members] of byCluster) {
    if (members.length < minSize) continue;

    const ranked = [...members].sort((a, b) => scoreRow(b) - scoreRow(a));
    const keeper = ranked[0]!;
    const retireIds = ranked.slice(1).map((r) => r.id);
    toRetire.push(...retireIds);
    reportClusters.push({
      clusterId,
      size: members.length,
      keptId: keeper.id,
      retiredCount: retireIds.length,
    });
  }

  reportClusters.sort((a, b) => b.retiredCount - a.retiredCount);

  const artifacts = path.join(process.cwd(), "artifacts");
  mkdirSync(artifacts, { recursive: true });
  const reportPath = path.join(artifacts, "nclex-retire-dupes-report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        minClusterSize: minSize,
        apply,
        clustersAffected: reportClusters.length,
        totalRetire: toRetire.length,
        clusters: reportClusters.slice(0, 50),
      },
      null,
      2
    )
  );

  console.log(`\nNCLEX duplicate cluster retire — min size ${minSize}${apply ? " [APPLY]" : " [dry-run]"}\n`);
  console.log(`Clusters ≥${minSize}: ${reportClusters.length}`);
  console.log(`Would retire: ${toRetire.length} items\n`);

  for (const c of reportClusters.slice(0, 12)) {
    console.log(`  ${c.clusterId}: ${c.size} items → keep ${c.keptId.slice(0, 10)}…, retire ${c.retiredCount}`);
  }

  if (apply && toRetire.length > 0) {
    const BATCH = 500;
    for (let i = 0; i < toRetire.length; i += BATCH) {
      const batch = toRetire.slice(i, i + BATCH);
      await prisma.questionBankItem.updateMany({
        where: { id: { in: batch } },
        data: { active: false, qaPassed: false },
      });
    }
    console.log(`\nRetired ${toRetire.length} duplicate items.`);
  }

  console.log(`\nReport: ${reportPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
