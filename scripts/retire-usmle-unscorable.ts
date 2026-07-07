#!/usr/bin/env node
/**
 * Retire USMLE items that fail structural bank audit (unscorable).
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

async function main() {
  let retired = 0;
  for (const fieldId of FIELDS) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true },
      orderBy: { id: "asc" },
    });
    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const audit = auditBankItem(item, fieldId);
      if (audit.ok) continue;
      const hard = audit.issues.filter((i) => i.severity === "error");
      if (hard.length === 0) continue;

      console.log(`  retire ${row.id.slice(0, 12)}… [${fieldId}] — ${hard.map((i) => i.code).join(", ")}`);
      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: { active: false, qaPassed: false, qaAuditedAt: new Date() },
        });
      }
      retired++;
    }
  }
  console.log(`\n${dryRun ? "[dry-run] would retire" : "Retired"} ${retired} unscorable item(s)\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
