#!/usr/bin/env npx tsx
/**
 * Backfill reviewModuleSlug + memoryCardIds into AANP FNP question options JSON.
 * Idempotent — skips rows that already have memoryCardIds.
 *
 * Usage:
 *   npx tsx scripts/backfill-aanp-fnp-study-links.ts
 *   npx tsx scripts/backfill-aanp-fnp-study-links.ts --dry-run
 */
import { attachAanpFnpStudyLinks } from "../src/lib/exam-prep/aanp-fnp/study-links";
import {
  enrichBankItemFromRow,
  serializeBankOptions,
} from "../src/lib/mpje/parse-bank-options";
import { prisma } from "../src/lib/prisma";

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "aanp-fnp", active: true },
    select: {
      id: true,
      subjectId: true,
      stateCode: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      solutionSteps: true,
      tags: true,
      itemType: true,
      scenario: true,
      difficulty: true,
      topicCategory: true,
      blueprintDomain: true,
      taskCategory: true,
      blueprintTopic: true,
      patientAgeGroup: true,
      reviewStatus: true,
      generationVersion: true,
      generationMeta: true,
      references: true,
    },
  });

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const payload = item.ngnPayload ?? {};
    const existingIds = Array.isArray(payload.memoryCardIds) ? payload.memoryCardIds : [];
    const existingDrugs = Array.isArray(payload.top500Drugs) ? payload.top500Drugs : [];

    if (existingIds.length > 0 && existingDrugs.length > 0) {
      skipped++;
      continue;
    }

    const domain =
      item.blueprintDomain ??
      (typeof payload.blueprintDomain === "string" ? payload.blueprintDomain : undefined) ??
      item.subjectId ??
      "assess";
    const clinicalSystem =
      (typeof payload.clinicalSystem === "string" ? payload.clinicalSystem : undefined) ??
      item.subjectId ??
      "assess";
    const topic =
      item.blueprintTopic ??
      (typeof payload.blueprintTopic === "string" ? payload.blueprintTopic : undefined) ??
      "primary care";
    const ageGroup =
      item.patientAgeGroup ??
      (typeof payload.patientAgeGroup === "string" ? payload.patientAgeGroup : undefined);

    const nextPayload = attachAanpFnpStudyLinks(payload, {
      blueprintDomain: domain,
      clinicalSystem,
      blueprintTopic: topic,
      patientAgeGroup: ageGroup,
      text: [
        item.vignette,
        item.scenario,
        item.question,
        item.explanation,
        ...(item.options ?? []),
        item.correctAnswer,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    const nextIds = Array.isArray(nextPayload.memoryCardIds) ? nextPayload.memoryCardIds : [];
    const nextDrugs = Array.isArray(nextPayload.top500Drugs) ? nextPayload.top500Drugs : [];
    if (nextIds.length === 0 && !nextPayload.reviewModuleSlug && nextDrugs.length === 0) {
      skipped++;
      continue;
    }

    item.ngnPayload = nextPayload;
    const options = serializeBankOptions(item);

    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: { options },
      });
    }
    updated++;
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        scanned: rows.length,
        updated,
        skipped,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
