#!/usr/bin/env node
/** Force-upsert all AANP FNP physician-educator seeds into Neon. */
import { collectHighYieldSeedRows } from "../src/lib/exam-prep/high-yield-index";
import { prisma } from "../src/lib/prisma";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { bankItemPassesIngestGate } from "../src/lib/exam-prep/bank-ingest-gate";

async function main() {
  const rows = collectHighYieldSeedRows().filter((r) => r.fieldId === "aanp-fnp");
  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const hash = bankItemContentHash(row.fieldId, row.subjectId, row.item);
    const qaPassed = bankItemPassesIngestGate(row.fieldId, row.item, "seed");
    const data = {
      fieldId: row.fieldId,
      subjectId: row.subjectId,
      scenario: row.item.vignette ?? null,
      difficulty: row.item.difficulty ?? 3,
      topicCategory: row.item.topicCategory ?? row.subjectId,
      blueprintDomain: row.item.blueprintDomain ?? row.subjectId,
      patientAgeGroup:
        row.item.patientAgeGroup ??
        (row.item.ngnPayload?.patientAgeGroup as string | undefined) ??
        null,
      blueprintTopic: row.item.blueprintTopic ?? null,
      itemType: row.item.itemType ?? "vignette",
      question: row.item.question,
      options: JSON.stringify(row.item.options),
      correctAnswer: row.item.correctAnswer,
      explanation: row.item.explanation,
      tags: row.item.tags ? JSON.stringify(row.item.tags) : null,
      references: row.item.references?.length ? row.item.references : undefined,
      source: "seed" as const,
      contentHash: hash,
      active: true,
      qaPassed,
      reviewStatus: "approved" as const,
      lastReviewedAt: new Date(),
    };

    const existing = await prisma.questionBankItem.findUnique({ where: { contentHash: hash } });
    if (existing) {
      await prisma.questionBankItem.update({ where: { contentHash: hash }, data });
      updated++;
    } else {
      await prisma.questionBankItem.create({ data });
      created++;
    }
  }

  console.log(`AANP FNP force-upsert: ${created} created, ${updated} updated (${rows.length} total)`);
  const active = await prisma.questionBankItem.count({
    where: { fieldId: "aanp-fnp", active: true, qaPassed: true },
  });
  console.log(`Active QA-passed: ${active}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
