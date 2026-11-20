#!/usr/bin/env node
/**
 * PANCE content fixes approved on 2026-11-11.
 *
 * 1. Replace the joke distractor on 89a3ce02-18c0-498b-b3c4-3d4eb5d86ba2.
 * 2. Hide the weaker near-duplicate cmvxd2zua0000l308gmnj7fwd.
 *
 *   npx tsx scripts/fix-pance-content-20261111.ts
 *   npx tsx scripts/fix-pance-content-20261111.ts --apply
 *
 * --apply commits qbi_pance_content_20261111_backup, then updates those two
 * rows only. Undo:
 *   npx tsx scripts/undo-pance-content-20261111.ts --apply
 *
 * Guideline opened before the replacement was written:
 * KDIGO Clinical Practice Guideline for Acute Kidney Injury (2012),
 * recommendation 5.1.1, page text at
 * https://kdigo.org/wp-content/uploads/2019/01/KDIGO-2012-AKI-Guideline-English.pdf
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { prisma, snapshotQuestionRows } from "./qbi-snapshot-20261111";

const BACKUP = "qbi_pance_content_20261111_backup";
const UNDO = "scripts/data/20261111/pance-content-undo.json";
const JOKE_ID = "89a3ce02-18c0-498b-b3c4-3d4eb5d86ba2";
const HIDE_ID = "cmvxd2zua0000l308gmnj7fwd";
const KEEP_ID = "cmqgdhw0r00051yr8ap2l03oh";
const JOKE_OPTION = "Another dose of ibuprofen";
const REPLACEMENT = "Repeat insulin with dextrose and recheck the potassium in 4 hours";
const OLD_EXPLANATION_CLAUSE = "An NSAID, saline in an anuric patient";
const NEW_EXPLANATION_CLAUSE =
  "repeating insulin with dextrose, saline in an anuric patient";
const GUIDELINE_SENTENCE =
  " Insulin with dextrose only shifts potassium and does not remove it in an anuric patient. KDIGO AKI guideline recommendation 5.1.1: start kidney replacement emergently when life-threatening electrolyte and acid-base changes remain after temporizing treatment.";
const AKI_REFERENCE = {
  url: "https://kdigo.org/wp-content/uploads/2019/01/KDIGO-2012-AKI-Guideline-English.pdf",
  label: "KDIGO Clinical Practice Guideline for Acute Kidney Injury (2012), recommendation 5.1.1",
};

function withAkiReference(current: unknown): Array<{ url: string; label: string }> {
  const existing = Array.isArray(current)
    ? current.filter((entry): entry is { url: string; label: string } => {
        return Boolean(entry) && typeof entry === "object" && typeof (entry as { url?: unknown }).url === "string";
      })
    : [];
  if (existing.some((entry) => entry.url === AKI_REFERENCE.url)) return existing;
  return [...existing, AKI_REFERENCE];
}

function replaceOption(raw: string): string {
  if (!raw.includes(JOKE_OPTION)) throw new Error("joke distractor text is not on the row");
  if (raw.split(JOKE_OPTION).length !== 2) throw new Error("joke distractor text appears more than once");
  return raw.replace(JOKE_OPTION, REPLACEMENT);
}

function replaceExplanation(raw: string): string {
  if (!raw.includes(OLD_EXPLANATION_CLAUSE)) {
    throw new Error("explanation does not name the NSAID distractor in the expected sentence");
  }
  if (raw.includes(GUIDELINE_SENTENCE.trim())) throw new Error("guideline sentence is already present");
  return `${raw.replace(OLD_EXPLANATION_CLAUSE, NEW_EXPLANATION_CLAUSE)}${GUIDELINE_SENTENCE}`;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const rows = await prisma.questionBankItem.findMany({
    where: { id: { in: [JOKE_ID, HIDE_ID, KEEP_ID] } },
    select: {
      id: true,
      fieldId: true,
      active: true,
      options: true,
      explanation: true,
      correctAnswer: true,
      manualCorrection: true,
      references: true,
    },
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  for (const id of [JOKE_ID, HIDE_ID, KEEP_ID]) {
    const row = byId.get(id);
    if (!row) throw new Error(`missing ${id}`);
    if (row.fieldId !== "pance" || row.active !== true) throw new Error(`${id} is not an active pance row`);
  }
  const joke = byId.get(JOKE_ID)!;
  const nextOptions = replaceOption(joke.options);
  const nextExplanation = replaceExplanation(joke.explanation);
  const nextReferences = withAkiReference(joke.references);
  if (joke.correctAnswer !== "Urgent dialysis") throw new Error("joke item key is not Urgent dialysis");
  if (nextOptions.includes(JOKE_OPTION)) throw new Error("replacement left the joke distractor in place");
  const parsed = JSON.parse(nextOptions) as { options?: string[] };
  if (!parsed.options?.includes(REPLACEMENT) || parsed.options.includes(JOKE_OPTION)) {
    throw new Error("replacement is not a single option");
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup: ${BACKUP}`);
  console.log(`JOKE ${JOKE_ID}`);
  console.log(`  replace option: ${JOKE_OPTION}`);
  console.log(`  with: ${REPLACEMENT}`);
  console.log(`  cite: ${AKI_REFERENCE.url}`);
  console.log(`HIDE ${HIDE_ID}`);
  console.log(
    "WHY same acute HFrEF congestion vignette. The kept item keys intravenous furosemide and explains each distractor. The hidden item keys spironolactone, which does not relieve this acute overload, and its rationale is shorter."
  );
  console.log(`KEEP ${KEEP_ID}`);
  if (!apply) {
    console.log("No table created and no row updated.");
    return;
  }

  await snapshotQuestionRows({ backup: BACKUP, ids: [JOKE_ID, HIDE_ID], apply: true });
  const optionWrite = await prisma.questionBankItem.updateMany({
    where: {
      id: JOKE_ID,
      fieldId: "pance",
      active: true,
      options: { contains: JOKE_OPTION },
    },
    data: {
      options: nextOptions,
      explanation: nextExplanation,
      references: nextReferences,
      manualCorrection: true,
    },
  });
  if (optionWrite.count !== 1) {
    throw new Error(`joke update changed ${optionWrite.count} rows. Backup ${BACKUP} is in place.`);
  }
  const hideWrite = await prisma.questionBankItem.updateMany({
    where: { id: HIDE_ID, fieldId: "pance", active: true },
    data: { active: false },
  });
  if (hideWrite.count !== 1) {
    throw new Error(`near-duplicate hide changed ${hideWrite.count} rows. Backup ${BACKUP} is in place.`);
  }
  const kept = await prisma.questionBankItem.findUnique({
    where: { id: KEEP_ID },
    select: { active: true, fieldId: true, correctAnswer: true },
  });
  if (!kept || kept.active !== true || kept.fieldId !== "pance" || kept.correctAnswer !== "Intravenous furosemide now") {
    throw new Error("kept near-duplicate row changed");
  }
  mkdirSync(dirname(UNDO), { recursive: true });
  writeFileSync(
    UNDO,
    JSON.stringify(
      {
        joke: {
          id: JOKE_ID,
          options: joke.options,
          explanation: joke.explanation,
          references: joke.references,
          manualCorrection: joke.manualCorrection,
        },
        hidden: { id: HIDE_ID, active: true },
      },
      null,
      2
    )
  );
  console.log(`Updated 1 distractor and hid 1 row. Undo file: ${UNDO}`);
  console.log("Undo: npx tsx scripts/undo-pance-content-20261111.ts --apply");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
