#!/usr/bin/env node
/**
 * Insert curated NCLEX strategy question seeds (trap-tier, SATA, calc, gap topics).
 *
 * Usage:
 *   npm run db:insert-nclex-strategy
 *   npm run db:insert-nclex-strategy:dry
 */
import { PrismaClient } from "@prisma/client";
import { NCLEX_STRATEGY_QUESTION_SEEDS } from "../src/lib/edtech/seeds/nclex-strategy-questions";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { auditNclexBankItem } from "../src/lib/exam-prep/nclex-bank-audit";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  console.log(
    `\nNCLEX strategy seeds — ${NCLEX_STRATEGY_QUESTION_SEEDS.length} item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  for (const item of NCLEX_STRATEGY_QUESTION_SEEDS) {
    const hash = bankItemContentHash("nursing", item.subjectId ?? "management-of-care", item);
    const audit = auditNclexBankItem(item);
    const quality = assessNclexItemQuality(item, { source: "curated" });
    const qaPassed = quality.tier === "best" && audit.ok;

    const existing = await prisma.questionBankItem.findFirst({
      where: { contentHash: hash },
      select: { id: true },
    });

    if (existing) {
      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: existing.id },
          data: {
            scenario: item.vignette ?? null,
            question: item.question,
            options: serializeBankOptions(item),
            correctAnswer: item.correctAnswer,
            explanation: item.explanation ?? "",
            itemType: item.itemType ?? "vignette",
            blueprintTopic: item.blueprintTopic ?? null,
            tags: JSON.stringify(item.tags ?? []),
            references: item.references ?? undefined,
            source: "curated",
            qaPassed,
            qaAuditedAt: new Date(),
            active: true,
            updatedAt: new Date(),
          },
        });
      }
      updated++;
      console.log(
        `  ↻ ${existing.id} — ${item.question.slice(0, 60)}… (tier ${quality.tier}${qaPassed ? ", qaPassed" : ""})`
      );
      continue;
    }

    if (!audit.ok) {
      skipped++;
      console.log(`  ✗ skip audit — ${audit.issues.map((i) => i.code).join(", ")}`);
      continue;
    }

    if (!dryRun) {
      await prisma.questionBankItem.create({
        data: {
          fieldId: "nursing",
          subjectId: item.subjectId ?? "management-of-care",
          scenario: item.vignette ?? null,
          question: item.question,
          options: serializeBankOptions(item),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation ?? "",
          itemType: item.itemType ?? "vignette",
          blueprintTopic: item.blueprintTopic ?? null,
          tags: JSON.stringify(item.tags ?? []),
          references: item.references ?? undefined,
          source: "curated",
          contentHash: hash,
          qaPassed,
          qaAuditedAt: new Date(),
          active: true,
        },
      });
    }
    inserted++;
    console.log(`  ✓ insert — ${item.question.slice(0, 60)}… (tier ${quality.tier})`);
  }

  console.log(`\nInserted: ${inserted} | Updated: ${updated} | Skipped: ${skipped}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
