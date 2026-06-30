#!/usr/bin/env node
/**
 * NCLEX Question Bank Curation Engine
 *
 * Semantic dedup + quality scoring + blueprint-balanced selection (~3,000 keepers).
 *
 * Usage:
 *   npm run db:curate-nclex-engine:dry          # full pipeline, no retire
 *   npm run db:curate-nclex-engine:embed        # embeddings only
 *   npm run db:curate-nclex-engine -- --apply   # retire non-keepers
 *   npm run db:curate-nclex-engine -- --limit 100 --llm
 *
 * Requires: DATABASE_URL, OPENAI_API_KEY (curation or rag purpose allowed)
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { parseCurationCliArgs, runCurationPipeline } from "../src/lib/bank-curation/pipeline";
import { requireOpenAiKey } from "./load-env";

const prisma = new PrismaClient();

async function main() {
  const opts = parseCurationCliArgs(process.argv.slice(2));

  if (!opts.skipEmbed || opts.useLlm) {
    requireOpenAiKey();
  }

  console.log("\nNCLEX Question Bank Curation Engine");
  console.log(`  target: ${opts.target}`);
  console.log(`  mode: ${opts.embedOnly ? "embed" : opts.clusterOnly ? "cluster" : opts.scoreOnly ? "score" : "full"}`);
  console.log(`  dry-run: ${opts.dryRun}${opts.apply ? " (apply enabled)" : ""}`);
  if (opts.limit) console.log(`  limit: ${opts.limit}`);
  if (opts.useLlm) console.log(`  LLM scoring: on`);

  const report = await runCurationPipeline(prisma, opts);

  console.log("\nSummary");
  console.log(`  input: ${report.inputCount}`);
  console.log(`  clusters: ${report.clusterCount} (${report.duplicateClusters} duplicate groups)`);
  console.log(`  keep: ${report.recommendedKeep}`);
  console.log(`  review: ${report.recommendedReview}`);
  console.log(`  drop: ${report.recommendedDrop}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
