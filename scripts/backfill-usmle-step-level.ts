/**
 * Idempotent audit + backfill for USMLE `stepLevel`.
 *
 * USMLE questions are separated by `fieldId` (usmle-step-1/2/3). The `stepLevel`
 * column should always mirror that field, but older rows may predate the column.
 * This script sets `stepLevel` from `fieldId` wherever it's missing or mismatched.
 * Safe to run repeatedly — it only touches rows that are actually wrong.
 *
 * Usage:
 *   npx tsx scripts/backfill-usmle-step-level.ts            # apply
 *   npx tsx scripts/backfill-usmle-step-level.ts --dry-run  # report only
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIELD_TO_STEP: Record<string, "step1" | "step2" | "step3"> = {
  "usmle-step-1": "step1",
  "usmle-step-2": "step2",
  "usmle-step-3": "step3",
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`USMLE stepLevel backfill ${dryRun ? "(dry run)" : "(apply)"}\n`);

  let totalFixed = 0;

  for (const [fieldId, stepLevel] of Object.entries(FIELD_TO_STEP)) {
    // Rows in this USMLE field whose stepLevel does not already match.
    const needsFix = await prisma.questionBankItem.count({
      where: { fieldId, OR: [{ stepLevel: null }, { stepLevel: { not: stepLevel } }] },
    });

    const total = await prisma.questionBankItem.count({ where: { fieldId } });
    console.log(`  ${fieldId}: ${total} items, ${needsFix} need stepLevel="${stepLevel}"`);

    if (!dryRun && needsFix > 0) {
      const result = await prisma.questionBankItem.updateMany({
        where: { fieldId, OR: [{ stepLevel: null }, { stepLevel: { not: stepLevel } }] },
        data: { stepLevel },
      });
      totalFixed += result.count;
    } else {
      totalFixed += needsFix;
    }
  }

  console.log(
    `\n${dryRun ? "Would update" : "Updated"} ${totalFixed} row(s). Done.`
  );
}

main()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
