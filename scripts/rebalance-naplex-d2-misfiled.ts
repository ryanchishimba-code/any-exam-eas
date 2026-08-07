/**
 * Rebalance misfiled Domain 2 items onto D1 / D4 / D5 when stem text
 * clearly belongs to foundations, professional practice, or management.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/rebalance-naplex-d2-misfiled.ts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/rebalance-naplex-d2-misfiled.ts --limit 800
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const AREA2 = "naplex-area2-therapeutics";
const AREA1 = "naplex-area1-foundations";
const AREA4 = "naplex-area4-safety";
const AREA5 = "naplex-area5-management";

const MGMT_RE =
  /\b(formulary|inventory|shortage|reimburs|billing|workflow|USP\s*<?\s*7(95|97)|accreditation|DEA compliance|human resources|leadership|operations|P&T|pharmacy benefit|prior auth|quality assurance|lean six|Six Sigma|drug shortage)\b/i;
const D1_RE =
  /\b(alligation|half-?life|bioavailability|volume of distribution|clearance|CrCl|creatinine clearance|CYP\d|pharmacokinetic|NNT|ARR|osmolarity|isotonic|buffer capacity|excipient|biostatistic|study design|power calculation)\b/i;
const D4_RE =
  /\b(HIPAA|teach-?back|ethical dilemma|cultural competency|health equity|IRB|public health|emergency preparedness|scope of practice|informed consent|research ethics)\b/i;
const MED_USE_KEEP_RE =
  /\b(dispens|reconcil|verify|verification|label|ISMP|LASA|high[- ]alert|adherence|TDM|trough|inhaler technique|device|administration|prescription process|medication error|barcode|DUR|auxiliary label)\b/i;

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let limit = 800;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number(args[++i]);
  }
  return { dryRun, limit: Math.max(50, Math.min(3000, limit || 800)) };
}

async function main() {
  const { dryRun, limit } = parseArgs();
  console.log(`\nRebalance misfiled D2 → D1/D4/D5${dryRun ? " [dry-run]" : ""} limit=${limit}\n`);

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      qaPassed: true,
      blueprintDomain: AREA2,
    },
    select: {
      id: true,
      question: true,
      scenario: true,
      tags: true,
      blueprintTopic: true,
    },
    take: Math.min(limit * 4, 10000),
    orderBy: { id: "asc" },
  });

  const moves: Array<{ id: string; to: string }> = [];
  for (const row of rows) {
    if (moves.length >= limit) break;
    const text = `${row.scenario ?? ""}\n${row.question ?? ""}\n${row.tags ?? ""}\n${row.blueprintTopic ?? ""}`;
    if (MED_USE_KEEP_RE.test(text)) continue;
    let to: string | null = null;
    if (MGMT_RE.test(text)) to = AREA5;
    else if (D1_RE.test(text)) to = AREA1;
    else if (D4_RE.test(text)) to = AREA4;
    if (to) moves.push({ id: row.id, to });
  }

  const byTarget = moves.reduce<Record<string, number>>((acc, m) => {
    acc[m.to] = (acc[m.to] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`Scanned ${rows.length}; move candidates: ${moves.length}`, byTarget);

  let updated = 0;
  if (!dryRun && moves.length) {
    for (const m of moves) {
      const res = await prisma.questionBankItem.updateMany({
        where: { id: m.id, blueprintDomain: AREA2 },
        data: { blueprintDomain: m.to, updatedAt: new Date() },
      });
      updated += res.count;
    }
  } else {
    updated = moves.length;
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
    byTarget,
    sample: moves.slice(0, 25),
    byDomain,
  };
  mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
  const out = path.join(process.cwd(), "artifacts/naplex-d2-misfiled-rebalance.json");
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
