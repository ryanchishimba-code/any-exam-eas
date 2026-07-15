#!/usr/bin/env node
/**
 * Quarantine NCLEX items that ask for physician-level diagnosis / etiology
 * instead of nursing judgment (priority, action, teaching, cue recognition).
 *
 * Default: deactivate failing serve items (qaPassed=false, active=false).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/fix-nclex-rn-scope-stems.ts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/fix-nclex-rn-scope-stems.ts --apply
 */
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Hard physician-scope stems — not nursing priority/action/teaching. */
const DIAGNOSIS_STEM =
  /\b(most likely diagnosis|which diagnosis|diagnos(e|is) (for|of|is)|diagnostic impression|which disease process|pathophysiology of this presentation)\b/i;

/** Etiology stems without a nursing ask. */
const ETIOLOGY_ONLY_STEM =
  /^\s*what is the most likely cause of (this|the) client'?s (symptoms|presentation|condition)\??\s*$/i;

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: !args.includes("--apply"),
    limit: (() => {
      const i = args.indexOf("--limit");
      return i >= 0 && args[i + 1] ? Number(args[i + 1]) : 500;
    })(),
  };
}

async function main() {
  const { dryRun, limit } = parseArgs();
  console.log(
    `\nNCLEX RN-scope diagnosis quarantine${dryRun ? " [dry-run]" : " [apply]"} limit ${limit}\n`
  );

  let scanned = 0;
  let flagged = 0;
  let lastId: string | undefined;
  const examples: Array<{ id: string; stem: string }> = [];

  while (flagged < limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        qaPassed: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: 200,
      select: { id: true, question: true, scenario: true },
    });
    if (!rows.length) break;

    for (const row of rows) {
      scanned++;
      lastId = row.id;
      const q = row.question.trim();
      if (!DIAGNOSIS_STEM.test(q) && !ETIOLOGY_ONLY_STEM.test(q)) continue;

      flagged++;
      if (examples.length < 12) {
        examples.push({ id: row.id, stem: row.question.slice(0, 140) });
      }

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            active: false,
            qaPassed: false,
            reviewStatus: "rn_scope_quarantine",
            updatedAt: new Date(),
          },
        });
      }

      if (flagged >= limit) break;
    }
    if (rows.length < 200) break;
  }

  console.log(`Scanned: ${scanned}`);
  console.log(`${dryRun ? "Would quarantine" : "Quarantined"}: ${flagged}`);
  for (const ex of examples) {
    console.log(`  · ${ex.id} — ${ex.stem}`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
