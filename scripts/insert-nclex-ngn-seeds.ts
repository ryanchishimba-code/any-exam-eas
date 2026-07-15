#!/usr/bin/env node
/**
 * Upsert curated NCLEX NGN seed packs (bowtie / matrix / ordered / case / SATA / highlight).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/insert-nclex-ngn-seeds.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/insert-nclex-ngn-seeds.ts --dry-run
 */
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { NGN_NURSING_SEEDS } from "../src/lib/exam-prep/ngn-nursing-seeds";
import { NGN_NURSING_QUALITY_V2 } from "../src/lib/exam-prep/ngn-nursing-quality-v2";
import { assessNclexServeQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { auditNclexBankItem } from "../src/lib/exam-prep/nclex-bank-audit";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import type { EnrichedBankItem } from "../src/lib/exam-prep/seed-helpers";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

const ALL: EnrichedBankItem[] = [...NGN_NURSING_SEEDS, ...NGN_NURSING_QUALITY_V2];

async function main() {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const byType: Record<string, number> = {};

  console.log(`\nNCLEX NGN seeds — ${ALL.length} item(s)${dryRun ? " [dry-run]" : ""}\n`);

  for (const raw of ALL) {
    const vignette = (raw.vignette ?? "").trim();
    let question = raw.question.trim();
    if (vignette && question.toLowerCase().startsWith(vignette.toLowerCase())) {
      question = question.slice(vignette.length).replace(/^\s*\n+/, "").trim();
    }
    const item: EnrichedBankItem = { ...raw, question, vignette: vignette || raw.vignette };
    const subjectId = item.subjectId ?? "physiological-adaptation";
    const itemType = item.itemType ?? "vignette";
    const hash = bankItemContentHash("nursing", subjectId, item);
    const audit = auditNclexBankItem(item);
    const quality = assessNclexServeQuality(item, { source: "seed" });
    const softOnly =
      quality.issues.length > 0 &&
      quality.issues.every((code) =>
        [
          "missing_distractor_rationales",
          "explanation_too_short",
          "score_below_serve_bar",
          "not_curated_source",
          "missing_guideline_reference",
          "weak_distractor_rationales",
        ].includes(code)
      );
    // Curated NGN packs are format-authentic; allow serve when audit is clean and only soft craft bars fail.
    const qaPassed =
      quality.ok || (audit.ok && softOnly && !quality.issues.includes("ngn_answer_invalid"));

    byType[itemType] = (byType[itemType] ?? 0) + 1;

    const existing = await prisma.questionBankItem.findFirst({
      where: { contentHash: hash },
      select: { id: true },
    });

    const data = {
      scenario: item.vignette ?? null,
      question: item.question,
      options: serializeBankOptions(item),
      correctAnswer: item.correctAnswer,
      explanation: item.explanation ?? "",
      itemType,
      subjectId,
      difficulty: item.difficulty ?? 4,
      topicCategory: item.topicCategory ?? subjectId,
      blueprintDomain: item.blueprintDomain ?? "nclex-physiological",
      blueprintTopic: item.blueprintTopic ?? null,
      tags: JSON.stringify([...(item.tags ?? []), "nclex-ngn", "curated-ngn-seed"]),
      references: item.references ?? undefined,
      source: "seed",
      qaPassed,
      qaAuditedAt: new Date(),
      active: true,
      updatedAt: new Date(),
    };

    if (existing) {
      if (!dryRun) {
        await prisma.questionBankItem.update({ where: { id: existing.id }, data });
      }
      updated++;
      continue;
    }

    if (quality.tier === "reject" && !audit.ok) {
      skipped++;
      console.log(
        `  ✗ skip — ${itemType} · ${audit.issues.map((i) => i.code).join(",") || quality.issues.join(",")}`
      );
      continue;
    }

    if (!dryRun) {
      await prisma.questionBankItem.create({
        data: {
          fieldId: "nursing",
          contentHash: hash,
          ...data,
        },
      });
    }
    inserted++;
  }

  console.log(`By type (pack): ${JSON.stringify(byType)}`);
  console.log(`Inserted: ${inserted} | Updated: ${updated} | Skipped: ${skipped}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
