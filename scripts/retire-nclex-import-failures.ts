#!/usr/bin/env node
/**
 * Retire active NCLEX import-pack rows that fail the best-tier QA gate.
 *
 * Usage:
 *   npm run db:retire-nclex-import-failures:dry
 *   npm run db:retire-nclex-import-failures -- --apply
 */
import { loadEnvFiles } from "./load-env";
import { ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { nclexItemPassesBestExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";

const prisma = new PrismaClient();

const PACK_TAGS = ["community-pack-40", "community-dosage-calc-100"] as const;

function parseArgs() {
  return { apply: process.argv.includes("--apply") };
}

async function main() {
  const { apply } = parseArgs();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "nursing",
      active: true,
      OR: PACK_TAGS.map((tag) => ({ tags: { contains: tag } })),
    },
  });

  const toRetire: Array<{ id: string; issues: string[]; preview: string }> = [];

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    if (nclexItemPassesBestExamGate(item)) continue;
    const verdict = assessNclexItemQuality(item, "best", { source: item.source ?? null });
    toRetire.push({
      id: row.id,
      issues: verdict.issues,
      preview: row.question.slice(0, 90),
    });
  }

  console.log(
    `\nNCLEX import failure retire — ${rows.length} active import rows, ${toRetire.length} failing best gate${apply ? " [APPLY]" : " [dry-run]"}\n`
  );

  for (const row of toRetire.slice(0, 20)) {
    console.log(`  ${row.id.slice(0, 12)}… ${row.issues.join(", ")}`);
    console.log(`    ${row.preview}…`);
  }
  if (toRetire.length > 20) console.log(`  … and ${toRetire.length - 20} more`);

  if (apply && toRetire.length > 0) {
    const ids = toRetire.map((r) => r.id);
    await prisma.questionBankItem.updateMany({
      where: { id: { in: ids } },
      data: { active: false, qaPassed: false },
    });
    console.log(`\nRetired ${ids.length} import item(s).`);
  }

  const importActive = await prisma.questionBankItem.count({
    where: {
      fieldId: "nursing",
      active: true,
      OR: PACK_TAGS.map((tag) => ({ tags: { contains: tag } })),
    },
  });
  const importBest = await prisma.questionBankItem.count({
    where: {
      fieldId: "nursing",
      active: true,
      qaPassed: true,
      OR: PACK_TAGS.map((tag) => ({ tags: { contains: tag } })),
    },
  });
  const totalBest = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  console.log(`\nImport packs active: ${importActive}`);
  console.log(`Import packs best-tier: ${importBest}`);
  console.log(`Total nursing best-tier: ${totalBest} / 4000 target\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
