#!/usr/bin/env node
/**
 * Delete QuestionBankItem rows inserted by scripts/pance-batch-insert.ts.
 *
 * Dry-run is the default and only reads. Pass --apply to delete the manifest
 * ids. A row is deleted only when id, fieldId, contentHash, question, and
 * source still match the manifest. Rows linked from an exam or a readiness
 * check are left in place and the delete is refused.
 *
 * Usage:
 *   npx tsx scripts/pance-batch-undo.ts
 *   npx tsx scripts/pance-batch-undo.ts scripts/data/pance-batch-insert/inserted-ids.json
 *   npx tsx scripts/pance-batch-undo.ts scripts/data/pance-batch-insert/inserted-ids.json --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const DEFAULT_MANIFEST = path.join(process.cwd(), "scripts/data/pance-batch-insert/inserted-ids.json");
const prisma = new PrismaClient();

type ManifestRow = {
  id: string;
  fieldId: string;
  contentHash: string;
  question: string;
  source: string;
  blueprintTopic?: string | null;
};

type Manifest = {
  rows: ManifestRow[];
};

function parseArgs(argv: string[]) {
  let manifestPath = DEFAULT_MANIFEST;
  let apply = false;
  let dryRunFlag = false;
  for (const arg of argv) {
    if (arg === "--apply") apply = true;
    else if (arg === "--dry-run") dryRunFlag = true;
    else if (arg.startsWith("-")) throw new Error(`Unknown argument: ${arg}`);
    else manifestPath = arg;
  }
  if (apply && dryRunFlag) throw new Error("Pass either --apply or --dry-run, not both.");
  return { manifestPath, apply };
}

function loadManifest(file: string): ManifestRow[] {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Manifest;
  if (!parsed || !Array.isArray(parsed.rows) || parsed.rows.length === 0) {
    throw new Error("Manifest rows must be a non-empty array.");
  }
  for (const row of parsed.rows) {
    if (!row || typeof row.id !== "string" || typeof row.contentHash !== "string" || typeof row.question !== "string") {
      throw new Error("Each manifest row needs id, contentHash, and question.");
    }
    if (row.fieldId !== "pance" || row.source !== "generated") {
      throw new Error(`Manifest row ${row.id} is not a generated pance insert.`);
    }
  }
  const ids = parsed.rows.map((row) => row.id);
  if (new Set(ids).size !== ids.length) throw new Error("Manifest has duplicate ids.");
  return parsed.rows;
}

async function linkedCounts(ids: string[]) {
  const where = { questionBankItemId: { in: ids } };
  const [
    pance,
    naplex,
    usmle,
    nclex,
    npte,
    aanp,
    readiness,
  ] = await Promise.all([
    prisma.panceFullPracticeExamQuestion.count({ where }),
    prisma.naplexFullPracticeExamQuestion.count({ where }),
    prisma.usmleFullPracticeExamQuestion.count({ where }),
    prisma.nclexFullPracticeExamQuestion.count({ where }),
    prisma.nptePtFullPracticeExamQuestion.count({ where }),
    prisma.aanpFnpFullPracticeExamQuestion.count({ where }),
    prisma.readinessCheckItem.count({ where }),
  ]);
  return { pance, naplex, usmle, nclex, npte, aanp, readiness };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = path.resolve(args.manifestPath);
  const rows = loadManifest(manifestPath);
  const ids = rows.map((row) => row.id);
  const live = await prisma.questionBankItem.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      fieldId: true,
      contentHash: true,
      question: true,
      source: true,
      active: true,
      qaPassed: true,
      reviewStatus: true,
    },
  });
  const byId = new Map(live.map((row) => [row.id, row]));
  const mismatches: string[] = [];
  for (const row of rows) {
    const found = byId.get(row.id);
    if (!found) {
      mismatches.push(`${row.id} is not in QuestionBankItem`);
      continue;
    }
    if (found.fieldId !== row.fieldId) mismatches.push(`${row.id} fieldId is ${found.fieldId}`);
    if (found.contentHash !== row.contentHash) mismatches.push(`${row.id} contentHash changed`);
    if (found.question !== row.question) mismatches.push(`${row.id} question changed`);
    if (found.source !== row.source) mismatches.push(`${row.id} source is ${found.source}`);
  }
  const links = await linkedCounts(ids);
  const linkTotal = Object.values(links).reduce((sum, count) => sum + count, 0);
  const beforeLive = await prisma.questionBankItem.count({
    where: { fieldId: "pance", active: true, qaPassed: true },
  });

  console.log(args.apply ? "PANCE batch undo — APPLY" : "PANCE batch undo — DRY RUN");
  console.log(`manifest: ${manifestPath}`);
  console.log(`ids: ${rows.length}`);
  console.log(`matched: ${rows.length - mismatches.length}`);
  console.log(`mismatches: ${mismatches.length}`);
  console.log(`linked rows: ${linkTotal} ${JSON.stringify(links)}`);
  console.log(`live pance before: ${beforeLive}`);
  for (const line of mismatches) console.log(`MISMATCH ${line}`);

  if (mismatches.length > 0 || linkTotal > 0) {
    console.log("Stopped. No rows deleted.");
    process.exitCode = 1;
    return;
  }
  if (!args.apply) {
    console.log(`Would delete ${rows.length} rows. Live pance would go ${beforeLive} -> ${beforeLive - rows.length}.`);
    console.log("No rows deleted.");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const row of rows) {
        const deleted = await tx.questionBankItem.deleteMany({
          where: {
            id: row.id,
            fieldId: "pance",
            contentHash: row.contentHash,
            question: row.question,
            source: "generated",
          },
        });
        if (deleted.count !== 1) {
          throw new Error(`Expected to delete 1 row for ${row.id}, deleted ${deleted.count}.`);
        }
      }
    },
    { timeout: 120_000, maxWait: 30_000 }
  );

  const afterLive = await prisma.questionBankItem.count({
    where: { fieldId: "pance", active: true, qaPassed: true },
  });
  const remaining = await prisma.questionBankItem.count({ where: { id: { in: ids } } });
  console.log(`Deleted ${rows.length} rows.`);
  console.log(`live pance after: ${afterLive}`);
  console.log(`ids still present: ${remaining}`);
  if (remaining !== 0 || afterLive !== beforeLive - rows.length) {
    throw new Error("Undo verification failed.");
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
