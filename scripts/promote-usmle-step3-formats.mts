#!/usr/bin/env node
/**
 * Promote existing Step 3 abstract / drug_ad / ccs_prompt items into serve
 * when they already clear the clinical gate (many sit qaPassed=false).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/promote-usmle-step3-formats.mts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/promote-usmle-step3-formats.mts
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";

const prisma = new PrismaClient();
const FIELD = "usmle-step-3";
const TYPES = ["abstract", "drug_ad", "ccs_prompt"] as const;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: FIELD,
      active: true,
      qaPassed: false,
      itemType: { in: [...TYPES] },
    },
  });

  console.log(
    `\nPromote Step3 formats — ${rows.length} candidate(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let promoted = 0;
  let skipped = 0;
  const byType: Record<string, number> = {};

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    if (!usmleBankItemIsServeReady(item, FIELD)) {
      skipped++;
      continue;
    }
    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          qaPassed: true,
          reviewStatus: "usmle_step3_format_promoted",
          updatedAt: new Date(),
        },
      });
    }
    promoted++;
    const t = row.itemType ?? "unknown";
    byType[t] = (byType[t] ?? 0) + 1;
  }

  console.log(`Promoted: ${promoted}`);
  console.log(`Skipped (not serve-ready): ${skipped}`);
  console.log(`By type:`, byType);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
