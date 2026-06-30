#!/usr/bin/env node
/**
 * Refresh QA flags on seed calc items and deactivate non-calculation rejects.
 *
 * Usage:
 *   npx tsx scripts/refresh-naplex-calc-qa.ts
 */
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { resolveNaplexStem } from "../src/lib/exam-prep/naplex-bank-audit";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const REJECT_IDS = [
  "cmqd1mo7s008h1ych57ogyq6e", // bare MCQ calc, no vignette
  "cmqvw5rur0027ju04keh1vu6c",
  "cmqvw5rv40028ju04a3zp2lna",
  "cmqd1mop5008m1ychskgc9jfj", // select_all sterile prep, not calc
];

const CALC_STEM =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

const prisma = new PrismaClient();

async function main() {
  let promoted = 0;
  let deactivated = 0;

  for (const id of REJECT_IDS) {
    await prisma.questionBankItem.update({
      where: { id },
      data: { active: false, qaPassed: false, qaAuditedAt: new Date(), updatedAt: new Date() },
    });
    deactivated++;
  }

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true, itemType: "constructed_response" },
  });

  for (const row of rows) {
    let item = prepareNaplexBankItem(enrichBankItemFromRow(row));
    const stem = resolveNaplexStem(item);
    if (!CALC_STEM.test(stem)) continue;

    const tags = [...(item.tags ?? []), "physician-educator", "case-calculation"].filter(
      (t, i, arr) => arr.indexOf(t) === i
    );
    item = { ...item, tags };

    const qaPassed = isNaplexBestQuality(item, { source: row.source });
    const tagJson = JSON.stringify(tags);

    if (row.qaPassed !== qaPassed || row.tags !== tagJson) {
      if (qaPassed) promoted++;
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          tags: tagJson,
          qaPassed,
          options: serializeBankOptions(item),
          contentHash: bankItemContentHash("pharmacy", item.subjectId, item),
          qaAuditedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log(`Deactivated rejects: ${deactivated}`);
  console.log(`Promoted/refreshed CR calcs: ${promoted}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
