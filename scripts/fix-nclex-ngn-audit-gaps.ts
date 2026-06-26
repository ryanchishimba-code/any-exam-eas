#!/usr/bin/env node
/**
 * Fix NCLEX NGN audit gaps — restore payload options, split duplicated vignettes, refresh qaPassed.
 *
 * Usage:
 *   npm run db:fix-nclex-ngn-audit-gaps
 *   npm run db:fix-nclex-ngn-audit-gaps -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { auditNclexBankItem } from "../src/lib/exam-prep/nclex-bank-audit";
import { repairNclexNgnPayloadFromSeed } from "../src/lib/exam-prep/nclex-ngn-payload-repair";
import { splitNclexDuplicateVignette } from "../src/lib/exam-prep/nclex-ngn-audit";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

function itemPassesAudit(item: ReturnType<typeof enrichBankItemFromRow>): boolean {
  return auditNclexBankItem(item).ok && auditBankItem(item, "nursing").ok;
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    orderBy: { id: "asc" },
  });

  console.log(
    `\nNCLEX NGN audit gap repair — ${rows.length} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let payloadFixed = 0;
  let vignetteFixed = 0;
  let hashSkipped = 0;
  let stillFailing = 0;

  for (const row of rows) {
    let item = enrichBankItemFromRow(row);
    const beforeOk = itemPassesAudit(item);

    const repaired = repairNclexNgnPayloadFromSeed(item);
    if (repaired) {
      item = repaired;
      payloadFixed++;
    }

    const split = splitNclexDuplicateVignette(item);
    if (split) item = split;

    const afterOk = itemPassesAudit(item);
    const changed = Boolean(repaired || split);
    if (!changed && beforeOk) continue;

    if (!dryRun && (changed || beforeOk !== afterOk)) {
      const newHash = bankItemContentHash("nursing", item.subjectId, item);
      const duplicate = await prisma.questionBankItem.findFirst({
        where: { contentHash: newHash, NOT: { id: row.id } },
        select: { id: true },
      });

      if (duplicate && split && !repaired) {
        hashSkipped++;
        item = enrichBankItemFromRow(row);
        const reRepaired = repairNclexNgnPayloadFromSeed(item);
        if (reRepaired) item = reRepaired;
      }

      const finalOk = itemPassesAudit(item);
      const finalHash = bankItemContentHash("nursing", item.subjectId, item);
      const finalDuplicate = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
        select: { id: true },
      });

      if (finalDuplicate) {
        hashSkipped++;
        continue;
      }

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          scenario: item.vignette ?? item.scenario ?? null,
          question: item.question,
          options: serializeBankOptions(item),
          correctAnswer: item.correctAnswer,
          contentHash: finalHash,
          qaPassed: finalOk,
          qaAuditedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (split && !duplicate) vignetteFixed++;
    } else if (split) {
      vignetteFixed++;
    }

    if (!afterOk) {
      stillFailing++;
      if (stillFailing <= 10) {
        const codes = [
          ...auditNclexBankItem(item).issues.filter((i) => i.severity === "error").map((i) => i.code),
          ...auditBankItem(item, "nursing").issues.filter((i) => i.severity === "error").map((i) => i.code),
        ];
        console.log(`  ✗ ${row.id}: ${[...new Set(codes)].join(", ") || "unknown"}`);
      }
    }
  }

  console.log(`Restored NGN payload options: ${payloadFixed}`);
  console.log(`Updated vignette/stem splits: ${vignetteFixed}`);
  console.log(`Skipped (contentHash clash):  ${hashSkipped}`);
  console.log(`Still failing audit:         ${stillFailing}`);
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
