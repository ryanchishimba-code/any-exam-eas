#!/usr/bin/env node
/**
 * Rewrite six NCLEX DKA/HHS items to the approved fluids-and-potassium-first
 * content. Dry run is the default and writes nothing.
 *
 *   npx tsx scripts/apply-nclex-dka-hhs-20261001.ts
 *   npx tsx scripts/apply-nclex-dka-hhs-20261001.ts --apply
 *
 * --apply requires scripts/data/nclex-dka-hhs-20261001/backup.json.
 * It updates scenario, question, options, correctAnswer, explanation, the
 * structured rationale fields already stored on the row, contentHash, and
 * manual_correction. The nightly seed sync skips a row with that flag when
 * it finds the row by contentHash.
 *
 * Undo with: npx tsx scripts/restore-nclex-dka-hhs-20261001.ts --apply
 */
import { existsSync, readFileSync } from "node:fs";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { KEY_WRONG_ITEM_IDS } from "../src/lib/exam-prep/reviewed-key-queue";
import { collectSeedQuestionRows } from "../src/lib/question-bank-seed";
import { decideSeedUpsert } from "../src/lib/sync-question-bank-guard";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import {
  BACKUP_PATH,
  EXPECTED,
  loadCorrections,
  nextContent,
  type Correction,
} from "./nclex-dka-hhs-plan";

const prisma = new PrismaClient();

type LiveRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  source: string;
  itemType: string;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  generationMeta: unknown;
  contentHash: string;
  manual_correction: boolean;
  active: boolean;
  qaPassed: boolean;
};

function optionTexts(raw: string): string[] {
  const parsed = JSON.parse(raw) as { options?: unknown };
  if (!Array.isArray(parsed.options)) return [];
  return parsed.options.map(String);
}

function envelopeRemainder(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const copy = { ...parsed };
  delete copy.options;
  delete copy.distractorRationale;
  delete copy.clinicalReasoning;
  delete copy.keyTakeaways;
  return copy;
}

function metaRemainder(meta: unknown): Record<string, unknown> | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const copy = { ...(meta as Record<string, unknown>) };
  delete copy.expertRationale;
  return copy;
}

async function main() {
  const apply = process.argv.includes("--apply");
  if (apply && !existsSync(BACKUP_PATH)) {
    throw new Error(`missing backup file ${BACKUP_PATH}`);
  }
  const corrections = loadCorrections();
  const backupIds = existsSync(BACKUP_PATH)
    ? (JSON.parse(readFileSync(BACKUP_PATH, "utf8")) as { ids: string[] }).ids
    : [];
  if (apply && backupIds.join(",") !== corrections.map((item) => item.id).join(",")) {
    throw new Error("backup file ids do not match the correction file");
  }
  const idList = corrections.map((item) => `'${item.id}'`).join(", ");
  const live = (await prisma.$queryRawUnsafe(`
    SELECT
      id, "fieldId", "subjectId", source, "itemType", scenario, question, options,
      "correctAnswer", explanation, "generationMeta", "contentHash",
      manual_correction, active, "qaPassed"
    FROM "QuestionBankItem"
    WHERE id IN (${idList})
  `)) as LiveRow[];
  if (live.length !== EXPECTED) throw new Error(`found ${live.length} rows, expected ${EXPECTED}`);
  const byId = new Map(live.map((row) => [row.id, row]));

  const seeds = collectSeedQuestionRows();
  const seedHashes = new Set(seeds.map((row) => bankItemContentHash(row.fieldId, row.subjectId, row.item)));
  const hideIds = new Set(KEY_WRONG_ITEM_IDS);

  const planned: Array<{ item: Correction; row: LiveRow; next: ReturnType<typeof nextContent> }> = [];
  for (const item of corrections) {
    const row = byId.get(item.id);
    if (!row) throw new Error(`missing row ${item.id}`);
    if (row.fieldId !== "nursing") throw new Error(`${item.id} is not a nursing item`);
    if (hideIds.has(item.id)) throw new Error(`${item.id} is on the hide list`);
    const next = nextContent({
      fieldId: row.fieldId,
      subjectId: row.subjectId,
      optionsJson: row.options,
      generationMeta: row.generationMeta,
      item,
    });
    if (next.options.options && (next.options.options as string[]).length !== 4) {
      throw new Error(`${item.id} planned options are not 4`);
    }
    if ((next.options.options as string[])[item.key] !== next.correctAnswer) {
      throw new Error(`${item.id} key index does not match the correct option`);
    }
    if (JSON.stringify(envelopeRemainder(row.options)) !== JSON.stringify(envelopeRemainder(JSON.stringify(next.options)))) {
      throw new Error(`${item.id} would change an options field other than the rationale`);
    }
    if (JSON.stringify(metaRemainder(row.generationMeta)) !== JSON.stringify(metaRemainder(next.generationMeta))) {
      throw new Error(`${item.id} would change generationMeta outside expertRationale`);
    }
    const collision = (await prisma.$queryRawUnsafe(
      `SELECT id FROM "QuestionBankItem" WHERE "contentHash" = '${next.contentHash}' AND id <> '${item.id}'`
    )) as Array<{ id: string }>;
    if (collision.length > 0) throw new Error(`${item.id} new content hash collides with ${collision[0]?.id}`);
    planned.push({ item, row, next });
  }

  const sessionHits = (await prisma.$queryRawUnsafe(`
    SELECT id, status
    FROM exam_sessions
    WHERE analysis::text LIKE ANY (ARRAY[${corrections.map((item) => `'%${item.id}%'`).join(", ")}])
  `)) as Array<{ id: string; status: string }>;

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`items: ${planned.length}`);
  for (const { item, row, next } of planned) {
    const beforeOptions = optionTexts(row.options);
    const afterOptions = next.options.options as string[];
    const oldSeed = seedHashes.has(row.contentHash);
    const newSeed = seedHashes.has(next.contentHash);
    const decision = decideSeedUpsert({
      existing: {
        id: row.id,
        question: next.question,
        correctAnswer: next.correctAnswer,
        options: JSON.stringify(next.options),
        active: row.active,
        manualCorrection: true,
        generationMeta: next.generationMeta,
      },
      incoming: {
        question: next.question,
        correctAnswer: next.correctAnswer,
        options: JSON.stringify(next.options),
        contentHash: next.contentHash,
      },
      protectedIds: new Set<string>(),
      backupHashes: new Set<string>(),
      hideIds,
    });
    console.log(`\n== ${item.id}`);
    console.log(`source: ${row.source}; itemType: ${row.itemType}; active: ${row.active}; qaPassed: ${row.qaPassed}`);
    console.log(`question before: ${row.question}`);
    console.log(`question after:  ${next.question}`);
    console.log("options before:");
    beforeOptions.forEach((option, index) => console.log(`  [${index}] ${option}${option === row.correctAnswer ? "  KEY" : ""}`));
    console.log("options after:");
    afterOptions.forEach((option, index) => console.log(`  [${index}] ${option}${index === item.key ? "  KEY" : ""}`));
    console.log(`key before: ${row.correctAnswer}`);
    console.log(`key after:  [${item.key}] ${next.correctAnswer}`);
    console.log(`key maps to intended option: ${afterOptions[item.key] === next.correctAnswer}`);
    console.log(`option count: ${afterOptions.length}`);
    console.log(`scenario before:\n${row.scenario}`);
    console.log(`scenario after:\n${next.scenario}`);
    console.log(`explanation before:\n${row.explanation}`);
    console.log(`explanation after:\n${next.explanation}`);
    console.log(`distractor keys: ${(Object.keys(next.options.distractorRationale as object)).join(" | ")}`);
    console.log(`clinicalReasoning replaced: true`);
    console.log(`keyTakeaways: ${Array.isArray(next.options.keyTakeaways) ? "replaced" : "not stored on this row"}`);
    console.log(`expertRationale: ${next.generationMeta && typeof next.generationMeta === "object" && (next.generationMeta as Record<string, unknown>).expertRationale ? "rewritten" : "not stored on this row"}`);
    console.log(`manual_correction: ${row.manual_correction} -> true`);
    console.log(`contentHash changed: ${row.contentHash !== next.contentHash}`);
    console.log(`seed contains old hash: ${oldSeed}`);
    console.log(`seed contains new hash: ${newSeed}`);
    console.log(`sync if a seed later matches the new hash: ${decision.action}${decision.action === "skip" ? ` (${decision.reason})` : ""}`);
  }
  console.log(`\nin-progress or other exam sessions containing these ids: ${sessionHits.length}`);
  for (const hit of sessionHits) console.log(`session ${hit.id} status ${hit.status}`);
  console.log("Unchanged: field, subject, item type, active, qaPassed, source, tags, references, curation, and the non-rationale options envelope.");
  console.log("Would set manual_correction = true and refresh contentHash to the new scenario and question.");
  if (!apply) {
    console.log("No row written.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const { item, row, next } of planned) {
      const updated = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET scenario = ${next.scenario},
            question = ${next.question},
            options = ${JSON.stringify(next.options)}::jsonb,
            "correctAnswer" = ${next.correctAnswer},
            explanation = ${next.explanation},
            "generationMeta" = ${JSON.stringify(next.generationMeta)}::jsonb,
            "contentHash" = ${next.contentHash},
            manual_correction = true,
            "updatedAt" = NOW()
        WHERE id = ${item.id}
          AND "contentHash" = ${row.contentHash}
          AND "correctAnswer" = ${row.correctAnswer}
      `;
      if (updated !== 1) throw new Error(`update touched ${updated} rows for ${item.id}`);
    }
  });
  console.log("Committed the six rewrites and set manual_correction.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
