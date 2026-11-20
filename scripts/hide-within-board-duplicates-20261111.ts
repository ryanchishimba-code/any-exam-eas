#!/usr/bin/env node
/**
 * Hide the extra copies in the 10 Nov 2026 within-board combined-stem groups.
 *
 * Each group keeps one served item. The others are set active=false.
 * Stems, options, keys, and rationales are not edited.
 *
 *   npx tsx scripts/hide-within-board-duplicates-20261111.ts
 *   npx tsx scripts/hide-within-board-duplicates-20261111.ts --apply
 *
 * --apply commits qbi_within_board_dups_20261111_backup, then hides the
 * listed ids. Undo:
 *   npx tsx scripts/undo-within-board-duplicates-20261111.ts --apply
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { prisma, snapshotQuestionRows } from "./qbi-snapshot-20261111";

const BACKUP = "qbi_within_board_dups_20261111_backup";
const UNDO = "scripts/data/20261111/within-board-dups-undo.json";

type Choice = {
  group: string;
  keep: string;
  hide: string[];
  reason: string;
};

const CHOICES: Choice[] = [
  {
    group: "fnp-dup-1",
    keep: "cmqgdi1id001p1yr82oul54ej",
    hide: ["cmqgryvia000i1yi4gp12cm1f"],
    reason:
      "Same hypothyroidism stem, options, key, and rationale. The hidden copy adds a vital-sign table (blood pressure and heart rate) that is not in the vignette.",
  },
  {
    group: "fnp-dup-2",
    keep: "cmqgttvhj001k1yfjjya9rgzh",
    hide: ["cmqgsn5kg001k1ydhc10e0e8w"],
    reason:
      "Same ADHD stem, options, key, and rationale. The kept copy is filed under pediatrics. The hidden copy is filed under geriatrics with a Beers Criteria topic.",
  },
  {
    group: "fnp-dup-3",
    keep: "cmqgnpuny001r1ywqdtfbej6n",
    hide: [
      "cmr1dfaxu00021yuulg0ftaod",
      "cmr1dfc0b000d1yuugd32bgph",
      "cmr1dfdkm000s1yuuquvvkitz",
      "cmr1dfdye000w1yuuwgsgsvd9",
      "cmr1dfe8s000z1yuu1nbb5y0j",
    ],
    reason:
      "Same STEMI stem, key, and rationale. The kept copy is cardiovascular / ACS. The hidden copies are the same item filed under pulmonary, pediatrics, women's health, infectious disease, and endocrine.",
  },
  {
    group: "nclex-dup-1",
    keep: "cmr1d6mdo00091ydf0iphrjx8",
    hide: ["cmr1d6lic00031ydfwu8mnzu2", "cmr1d6m7k00081ydf0ewprz33", "cmr1d6mvu000c1ydfnt12fsz3"],
    reason:
      "Same charge-nurse lead-in. The kept copy has the structured why-correct and why-each-option rationale. The hidden copies are shorter, and one has a failed rationale enrichment.",
  },
  {
    group: "usmle-step-cross-1",
    keep: "cmrrvnlrj007r1yl8d989w5lr",
    hide: ["cmr9861n300dy1ywym0a4x5q9"],
    reason:
      "Same preeclampsia stem and key on Step 2 and Step 3. The kept Step 2 copy has the full distractor rationale. The hidden Step 3 copy is shorter and tagged as biostatistics.",
  },
];

const EXPECTED_FIELD: Record<string, string> = {
  cmqgdi1id001p1yr82oul54ej: "aanp-fnp",
  cmqgryvia000i1yi4gp12cm1f: "aanp-fnp",
  cmqgttvhj001k1yfjjya9rgzh: "aanp-fnp",
  cmqgsn5kg001k1ydhc10e0e8w: "aanp-fnp",
  cmqgnpuny001r1ywqdtfbej6n: "aanp-fnp",
  cmr1dfaxu00021yuulg0ftaod: "aanp-fnp",
  cmr1dfc0b000d1yuugd32bgph: "aanp-fnp",
  cmr1dfdkm000s1yuuquvvkitz: "aanp-fnp",
  cmr1dfdye000w1yuuwgsgsvd9: "aanp-fnp",
  cmr1dfe8s000z1yuu1nbb5y0j: "aanp-fnp",
  cmr1d6mdo00091ydf0iphrjx8: "nursing",
  cmr1d6lic00031ydfwu8mnzu2: "nursing",
  cmr1d6m7k00081ydf0ewprz33: "nursing",
  cmr1d6mvu000c1ydfnt12fsz3: "nursing",
  cmrrvnlrj007r1yl8d989w5lr: "usmle-step-2",
  cmr9861n300dy1ywym0a4x5q9: "usmle-step-3",
};

function hideIds(): string[] {
  return CHOICES.flatMap((choice) => choice.hide);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const ids = hideIds();
  if (ids.length !== 11) throw new Error(`expected 11 hide ids, found ${ids.length}`);
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT id, "fieldId", active
     FROM "QuestionBankItem"
     WHERE id IN (${idList})`
  )) as Array<{ id: string; fieldId: string; active: boolean }>;
  if (rows.length !== ids.length) throw new Error(`found ${rows.length} hide rows, expected ${ids.length}`);
  for (const row of rows) {
    if (EXPECTED_FIELD[row.id] !== row.fieldId) {
      throw new Error(`${row.id} is ${row.fieldId}, expected ${EXPECTED_FIELD[row.id]}`);
    }
    if (row.active !== true) throw new Error(`${row.id} is already inactive`);
  }
  const kept = (await prisma.$queryRawUnsafe(
    `SELECT id, "fieldId", active
     FROM "QuestionBankItem"
     WHERE id IN (${CHOICES.map((choice) => `'${choice.keep}'`).join(", ")})`
  )) as Array<{ id: string; fieldId: string; active: boolean }>;
  if (kept.length !== CHOICES.length) throw new Error("a kept id is missing");
  for (const row of kept) {
    if (EXPECTED_FIELD[row.id] !== row.fieldId || row.active !== true) {
      throw new Error(`kept row ${row.id} is not an active row on ${EXPECTED_FIELD[row.id]}`);
    }
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup: ${BACKUP}`);
  for (const choice of CHOICES) {
    console.log(`KEEP ${choice.group} ${choice.keep}`);
    console.log(`HIDE ${choice.group} ${choice.hide.join(" ")}`);
    console.log(`WHY ${choice.reason}`);
  }
  console.log(`rows to hide: ${ids.length}`);
  if (!apply) {
    console.log("No table created and no row updated.");
    return;
  }

  await snapshotQuestionRows({ backup: BACKUP, ids, apply: true });
  const updated = await prisma.$executeRawUnsafe(
    `UPDATE "QuestionBankItem"
     SET active = false, "updatedAt" = NOW()
     WHERE id IN (${idList})
       AND active = true
       AND "fieldId" = CASE id
         ${ids.map((id) => `WHEN '${id}' THEN '${EXPECTED_FIELD[id]}'`).join("\n         ")}
       END`
  );
  if (updated !== ids.length) {
    throw new Error(`updated ${updated} rows, expected ${ids.length}. Backup ${BACKUP} is in place.`);
  }
  const stillActive = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n FROM "QuestionBankItem" WHERE id IN (${idList}) AND active = true`
  )) as Array<{ n: number }>;
  if (stillActive[0]?.n !== 0) throw new Error("a hide id is still active");
  const keptStill = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n
     FROM "QuestionBankItem"
     WHERE id IN (${CHOICES.map((choice) => `'${choice.keep}'`).join(", ")})
       AND active = true`
  )) as Array<{ n: number }>;
  if (keptStill[0]?.n !== CHOICES.length) throw new Error("a kept id was changed");
  mkdirSync(dirname(UNDO), { recursive: true });
  writeFileSync(
    UNDO,
    JSON.stringify(
      ids.map((id) => ({ id, active: true })),
      null,
      2
    )
  );
  console.log(`Hid ${updated} rows. Undo file: ${UNDO}`);
  console.log("Undo: npx tsx scripts/undo-within-board-duplicates-20261111.ts --apply");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
