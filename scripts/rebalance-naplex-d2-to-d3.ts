/**
 * Rebalance NAPLEX Domain 2 → Domain 3 when patient-counseling items are
 * clearly disease-state treatment planning (not med-use process).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/rebalance-naplex-d2-to-d3.ts --dry-run --limit 1200
 *   bash scripts/run-with-node.sh npx tsx scripts/rebalance-naplex-d2-to-d3.ts --limit 1200
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const AREA2 = "naplex-area2-therapeutics";
const AREA3 = "naplex-area3-treatment-planning";

const DISEASE_RE =
  /\b(hypertens|diabetes|insulin|metformin|heart failure|GDMT|HF|anticoagul|DOAC|warfarin|statin|dyslipid|ACS|MI|stroke|pneumonia|MRSA|Pseudomonas|antibiotic|stewardship|COPD|asthma|GINA|GOLD|GERD|CKD|dialysis|epilepsy|lamotrigine|depression|SSRI|Parkinson|migraine|thyroid|levothyroxine|contracept|BPH|ED|vaccine|immuniz|oncolog|chemo|BEERS|geriatr)\b/i;

const MED_USE_KEEP_RE =
  /\b(dispens|reconcil|verify|verification|label|ISMP|LASA|high[- ]alert|adherence|TDM|trough|inhaler technique|device|administration|drug information|prescription process|medication error|barcode|DUR|auxillary|auxiliary label|pill box|MedWatch)\b/i;

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let limit = 1000;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number(args[++i]);
  }
  return { dryRun, limit: Math.max(50, Math.min(3000, limit || 1000)) };
}

async function main() {
  const { dryRun, limit } = parseArgs();
  console.log(`\nRebalance D2→D3 disease-counseling${dryRun ? " [dry-run]" : ""} limit=${limit}\n`);

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      qaPassed: true,
      blueprintDomain: AREA2,
      subjectId: "patient-counseling",
    },
    select: {
      id: true,
      question: true,
      scenario: true,
      tags: true,
      blueprintTopic: true,
    },
    take: Math.min(limit * 3, 8000),
    orderBy: { id: "asc" },
  });

  const moveIds: string[] = [];
  for (const row of rows) {
    if (moveIds.length >= limit) break;
    const text = `${row.scenario ?? ""}\n${row.question ?? ""}\n${row.tags ?? ""}\n${row.blueprintTopic ?? ""}`;
    if (MED_USE_KEEP_RE.test(text)) continue;
    if (DISEASE_RE.test(text)) moveIds.push(row.id);
  }

  console.log(`Scanned ${rows.length}; disease-state candidates to move: ${moveIds.length}`);

  let updated = 0;
  if (!dryRun && moveIds.length) {
    const CHUNK = 200;
    for (let i = 0; i < moveIds.length; i += CHUNK) {
      const slice = moveIds.slice(i, i + CHUNK);
      const res = await prisma.questionBankItem.updateMany({
        where: { id: { in: slice } },
        data: { blueprintDomain: AREA3, updatedAt: new Date() },
      });
      updated += res.count;
    }
  } else {
    updated = moveIds.length;
  }

  const domains = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain"],
    where: { fieldId: "pharmacy", active: true, qaPassed: true },
    _count: { _all: true },
  });
  const byDomain = Object.fromEntries(
    domains
      .filter((g) => g.blueprintDomain)
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => [g.blueprintDomain!, g._count._all])
  );

  const summary = {
    dryRun,
    completedAt: new Date().toISOString(),
    moved: updated,
    sampleIds: moveIds.slice(0, 20),
    byDomain,
  };
  mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
  const out = path.join(process.cwd(), "artifacts/naplex-d2-to-d3-rebalance.json");
  writeFileSync(out, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Wrote ${out}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
