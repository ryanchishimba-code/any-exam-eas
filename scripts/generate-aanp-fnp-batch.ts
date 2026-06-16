#!/usr/bin/env node
/**
 * Generate AANP FNP questions in blueprint-aligned batches (default 500).
 *
 * Usage:
 *   npm run db:generate-aanp-fnp -- --count 500
 *   npm run db:generate-aanp-fnp:dry -- --count 10
 *
 * Requires OPENAI_API_KEY and DATABASE_URL.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  generateAanpFnpBatch,
  mergeAanpFnpAgeGroupQuotaWithCounts,
  mergeAanpFnpDomainQuotaWithCounts,
  AANP_FNP_TARGET_TOTAL,
} from "../src/lib/exam-prep/aanp-fnp";
import { collectAanpFnpSeedItems } from "../src/lib/edtech/seeds/aanp-fnp-seed-registry";
import { insertAanpFnpGeneratedItems } from "./aanp-fnp-insert";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 500;
  let dryRun = false;
  let domain: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--domain" && args[i + 1]) domain = args[++i];
  }
  return { count, dryRun, domain };
}

async function main() {
  const { count, dryRun, domain } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const byDomain = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain"],
    where: { fieldId: "aanp-fnp", active: true, blueprintDomain: { not: null } },
    _count: { id: true },
  });
  const countsByDomain: Record<string, number> = {};
  for (const row of byDomain) {
    countsByDomain[row.blueprintDomain ?? "unset"] = row._count.id;
  }

  const byAge = await prisma.questionBankItem.groupBy({
    by: ["patientAgeGroup"],
    where: { fieldId: "aanp-fnp", active: true, patientAgeGroup: { not: null } },
    _count: { id: true },
  });
  const countsByAgeGroup: Record<string, number> = {};
  for (const row of byAge) {
    countsByAgeGroup[row.patientAgeGroup ?? "unset"] = row._count.id;
  }

  const domainQuota = mergeAanpFnpDomainQuotaWithCounts(countsByDomain, AANP_FNP_TARGET_TOTAL);
  const ageQuota = mergeAanpFnpAgeGroupQuotaWithCounts(countsByAgeGroup, AANP_FNP_TARGET_TOTAL);

  const domainDeficits: Record<string, number> = {};
  for (const q of domainQuota) {
    domainDeficits[q.domain] = domain
      ? q.domain === domain
        ? (q.deficit ?? q.targetCount)
        : 0
      : (q.deficit ?? 0);
  }

  const ageGroupDeficits: Record<string, number> = {};
  for (const q of ageQuota) {
    ageGroupDeficits[q.ageGroup] = q.deficit ?? 0;
  }

  console.log(`AANP FNP bank progress (${AANP_FNP_TARGET_TOTAL} target):`);
  for (const q of domainQuota) {
    console.log(
      `  ${q.domain}: ${q.currentCount ?? 0}/${q.targetCount} (deficit ${q.deficit ?? 0})`
    );
  }

  const exemplars = collectAanpFnpSeedItems();
  console.log(`\nGenerating ${count} items using ${exemplars.length} seed exemplars…`);

  let totalCreated = 0;
  let totalSkipped = 0;

  const result = await generateAanpFnpBatch({
    count,
    domainDeficits,
    ageGroupDeficits,
    exemplarItems: exemplars,
    onProgress: (done, total) => {
      if (done % 50 === 0 || done === total) {
        console.log(`  Progress: ${done}/${total}`);
      }
    },
    onChunkAccepted: dryRun
      ? undefined
      : async (items) => {
          const { created, skipped } = await insertAanpFnpGeneratedItems(prisma, items);
          totalCreated += created;
          totalSkipped += skipped;
          if (created > 0) {
            console.log(`  +${created} saved to Neon (${totalCreated} total this run)`);
          }
        },
  });

  console.log(
    `\nBatch ${result.batchId}: ${result.items.length} accepted, ${result.rejected} rejected, ${result.diversityIssues} diversity flags`
  );

  const reportPath = path.join(ARTIFACTS, `aanp-fnp-generate-${result.batchId}.json`);
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        batchId: result.batchId,
        accepted: result.items.length,
        rejected: result.rejected,
        diversityIssues: result.diversityIssues,
        domainQuota,
        ageQuota,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  if (dryRun) {
    console.log(`Dry run — would insert ${result.items.length} items. Report: ${reportPath}`);
    return;
  }

  console.log(
    `Inserted ${totalCreated} items (${totalSkipped} skipped as duplicates). Report: ${reportPath}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
