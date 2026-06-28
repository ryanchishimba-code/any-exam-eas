#!/usr/bin/env npx tsx
/**
 * Exam Generation & QA Engine CLI — compose, self-heal, validate, export SQL.
 *
 * Usage:
 *   npx tsx scripts/compose-validated-exam.ts --exam usmle-step-1 --count 40
 *   npx tsx scripts/compose-validated-exam.ts --exam naplex --count 80 --sql-out artifacts/exam.sql
 *
 * Requires DATABASE_URL (Neon Postgres) for bank sampling.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import { composeValidatedExam } from "../src/lib/exam-prep/exam-qa-engine";

function parseArgs() {
  const args = process.argv.slice(2);
  let exam = "";
  let count = 40;
  let seed: number | undefined;
  let sqlOut = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exam" && args[i + 1]) exam = args[++i]!;
    else if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (args[i] === "--seed" && args[i + 1]) seed = parseInt(args[++i]!, 10);
    else if (args[i] === "--sql-out" && args[i + 1]) sqlOut = args[++i]!;
  }

  return { exam, count, seed, sqlOut };
}

async function main() {
  const { exam, count, seed, sqlOut } = parseArgs();

  if (!exam) {
    console.error(
      "Usage: npx tsx scripts/compose-validated-exam.ts --exam <slug> --count <n> [--seed N] [--sql-out path]"
    );
    console.error(
      "Supported: nclex, naplex, usmle-step-1, usmle-step-2, usmle-step-3, pance, aanp-fnp, npte-pt"
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  console.log(`Composing ${count}-question ${exam} exam with mandatory final check…`);

  const result = await composeValidatedExam({
    examSlug: exam,
    numQuestions: count,
    seed,
  });

  console.log(`\nStatus: ${result.status} Final Check`);
  console.log(`Exam: ${result.examName}`);
  console.log(`Questions: ${result.returned}/${result.requested}`);

  if (result.fixes.length > 0) {
    console.log(`\nIssues Fixed (${result.fixes.length}):`);
    for (const fix of result.fixes) {
      console.log(`  [${fix.code}] ${fix.message}`);
    }
  } else {
    console.log("\nIssues Fixed: none");
  }

  if (result.status === "FAILED") {
    console.error("\nFinal check failures:");
    for (const issue of result.finalCheck.qualityIssues) console.error(`  - ${issue}`);
    for (const issue of result.finalCheck.similarityIssues.slice(0, 10)) {
      console.error(`  - ${issue.code}: ${issue.message}`);
    }
    if (result.finalCheck.blueprintShortfalls.length) {
      console.error(`  Blueprint shortfalls: ${result.finalCheck.blueprintShortfalls.join(", ")}`);
    }
  }

  const outPath =
    sqlOut ||
    path.join(
      process.cwd(),
      "artifacts",
      `validated-exam-${exam}-${count}-${result.status.toLowerCase()}.sql`
    );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, result.sql);
  console.log(`\nSQL manifest → ${outPath}`);

  if (result.status === "FAILED") process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
