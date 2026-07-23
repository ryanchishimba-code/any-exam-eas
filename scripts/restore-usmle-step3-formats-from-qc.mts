#!/usr/bin/env node
/**
 * Restore Step3 typed formats that craft-QC clone clustering wrongly quarantined.
 *
 *   bash scripts/run-with-node.sh npx tsx scripts/restore-usmle-step3-formats-from-qc.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/restore-usmle-step3-formats-from-qc.mts --dry-run
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
  const quarantined = await prisma.questionBankItem.findMany({
    where: {
      fieldId: FIELD,
      itemType: { in: [...TYPES] },
      reviewStatus: "usmle_craft_qc_quarantine",
    },
  });

  console.log(
    `\nRestore Step3 formats from craft-QC quarantine — ${quarantined.length} candidate(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let restored = 0;
  let skipped = 0;
  const byType: Record<string, number> = {};

  for (const row of quarantined) {
    const item = enrichBankItemFromRow(row);
    if (!usmleBankItemIsServeReady(item, FIELD)) {
      skipped++;
      continue;
    }
    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          active: true,
          qaPassed: true,
          reviewStatus: "usmle_step3_format_restored",
          updatedAt: new Date(),
        },
      });
    }
    restored++;
    const t = row.itemType ?? "unknown";
    byType[t] = (byType[t] ?? 0) + 1;
  }

  console.log(`Restored: ${restored}`);
  console.log(`Skipped (not serve-ready): ${skipped}`);
  console.log(`By type:`, byType);

  for (const t of TYPES) {
    const n = await prisma.questionBankItem.count({
      where: { fieldId: FIELD, itemType: t, active: true, qaPassed: true },
    });
    console.log(`serve ${t}: ${n}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
