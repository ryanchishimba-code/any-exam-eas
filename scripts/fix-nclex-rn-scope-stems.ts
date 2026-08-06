#!/usr/bin/env node
/**
 * Quarantine NCLEX items that ask for physician-level diagnosis / etiology
 * instead of nursing judgment (priority, action, teaching, cue recognition),
 * plus known tough-bar commercial fails from NCSBN rating samples.
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
  /\b(most likely diagnosis|which diagnosis|what is the diagnosis|diagnos(e|is) (for|of|is)|diagnostic impression|which disease process|pathophysiology of this presentation)\b/i;

/** Etiology stems without a nursing ask (priority / action / teaching / cue). */
const ETIOLOGY_ONLY_STEM =
  /^\s*what is the most likely cause of (this|the) (client'?s|patient'?s) (symptoms|presentation|condition)\??\s*$/i;

/** Tough-rating commercial-bar fails: would not appear on NCLEX or critically weak craft. */
const TOUGH_BAR_QUARANTINE_IDS = [
  "cmr31dfoj005sjs04eek08mw2", // missing distractor rationales; wouldAppear=false
  "cmr31dfpc005tjs04qsdl7ge6", // missing distractor rationales + weak prioritization; wouldAppear=false
  "cmrm5gw10006u1yno6468vkbc", // score 5; weak prioritization critical flag
] as const;

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

async function quarantineRow(
  id: string,
  dryRun: boolean,
  reviewStatus: string
): Promise<void> {
  if (dryRun) return;
  await prisma.questionBankItem.update({
    where: { id },
    data: {
      active: false,
      qaPassed: false,
      reviewStatus,
      updatedAt: new Date(),
    },
  });
}

async function main() {
  const { dryRun, limit } = parseArgs();
  console.log(
    `\nNCLEX RN-scope + tough-bar quarantine${dryRun ? " [dry-run]" : " [apply]"} limit ${limit}\n`
  );

  let scanned = 0;
  let flagged = 0;
  let lastId: string | undefined;
  const examples: Array<{ id: string; stem: string; reason: string }> = [];
  const seen = new Set<string>();

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
      const isDiagnosis = DIAGNOSIS_STEM.test(q);
      const isEtiology = ETIOLOGY_ONLY_STEM.test(q);
      if (!isDiagnosis && !isEtiology) continue;

      flagged++;
      seen.add(row.id);
      if (examples.length < 12) {
        examples.push({
          id: row.id,
          stem: row.question.slice(0, 140),
          reason: isDiagnosis ? "diagnosis_stem" : "etiology_only_stem",
        });
      }

      await quarantineRow(row.id, dryRun, "rn_scope_quarantine");

      if (flagged >= limit) break;
    }
    if (rows.length < 200) break;
  }

  let toughFlagged = 0;
  const toughRows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "nursing",
      active: true,
      id: { in: [...TOUGH_BAR_QUARANTINE_IDS] },
    },
    select: { id: true, question: true, qaPassed: true },
  });
  for (const row of toughRows) {
    if (seen.has(row.id)) continue;
    toughFlagged++;
    examples.push({
      id: row.id,
      stem: row.question.slice(0, 140),
      reason: "tough_bar_fail",
    });
    await quarantineRow(row.id, dryRun, "nclex_tough_bar_quarantine");
  }

  console.log(`Scanned serve pool: ${scanned}`);
  console.log(
    `${dryRun ? "Would quarantine (RN-scope)" : "Quarantined (RN-scope)"}: ${flagged}`
  );
  console.log(
    `${dryRun ? "Would quarantine (tough-bar)" : "Quarantined (tough-bar)"}: ${toughFlagged}`
  );
  for (const ex of examples) {
    console.log(`  · [${ex.reason}] ${ex.id} — ${ex.stem}`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
