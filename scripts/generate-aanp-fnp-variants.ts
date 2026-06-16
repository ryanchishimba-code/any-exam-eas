#!/usr/bin/env node
/**
 * Expand curated AANP FNP seeds into blueprint-aligned variants.
 *
 * Usage:
 *   npm run db:generate-aanp-fnp-variants
 *   npm run db:generate-aanp-fnp-variants -- --variants-per-seed 4 --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  generateAanpFnpVariantsFromSeeds,
  AANP_FNP_VARIANTS_PER_SEED,
} from "../src/lib/exam-prep/aanp-fnp";
import { collectAanpFnpSeedItems } from "../src/lib/edtech/seeds/aanp-fnp-seed-registry";
import { insertAanpFnpGeneratedItems } from "./aanp-fnp-insert";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");

function parseArgs() {
  const args = process.argv.slice(2);
  let variantsPerSeed = AANP_FNP_VARIANTS_PER_SEED;
  let dryRun = false;
  let concurrency = 5;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--variants-per-seed" && args[i + 1]) {
      variantsPerSeed = parseInt(args[++i]!, 10);
    } else if (args[i] === "--concurrency" && args[i + 1]) {
      concurrency = parseInt(args[++i]!, 10);
    } else if (args[i] === "--dry-run") dryRun = true;
  }

  return { variantsPerSeed, dryRun, concurrency };
}

async function main() {
  const { variantsPerSeed, dryRun, concurrency } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const seeds = collectAanpFnpSeedItems();
  const totalJobs = seeds.length * variantsPerSeed;

  console.log(
    `Generating ${variantsPerSeed} variant(s) per seed (${seeds.length} seeds → ${totalJobs} jobs, concurrency ${concurrency})…`
  );

  let totalCreated = 0;
  let totalSkipped = 0;

  const result = await generateAanpFnpVariantsFromSeeds({
    seeds,
    variantsPerSeed,
    concurrency,
    onProgress: (done, total) => {
      if (done % 10 === 0 || done === total) {
        console.log(`  Progress: ${done}/${total}`);
      }
    },
    onVariantAccepted: dryRun
      ? undefined
      : async (item) => {
          const { created, skipped } = await insertAanpFnpGeneratedItems(prisma, [item]);
          totalCreated += created;
          totalSkipped += skipped;
          if (created > 0) {
            console.log(`  +${created} variant saved (${totalCreated} total)`);
          }
        },
  });

  const reportPath = path.join(ARTIFACTS, `aanp-fnp-variants-${result.batchId}.json`);
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        batchId: result.batchId,
        accepted: result.items.length,
        rejected: result.rejected,
        variantsPerSeed,
        seedCount: seeds.length,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log(
    `\nVariant batch ${result.batchId}: ${result.items.length} accepted, ${result.rejected} rejected`
  );

  if (dryRun) {
    console.log(`Dry run — would insert ${result.items.length} items. Report: ${reportPath}`);
    return;
  }

  console.log(
    `Inserted ${totalCreated} variants (${totalSkipped} skipped as duplicates). Report: ${reportPath}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
