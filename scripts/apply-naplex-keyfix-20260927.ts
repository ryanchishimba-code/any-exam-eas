#!/usr/bin/env node
/**
 * Apply the 2026-09-27 NAPLEX key corrections.
 *
 * Writes the 68 key fixes and 2 rationale-only rows. The leftover option
 * "1." on cmqgswkfc000p1ytwqjffwq6s is replaced in that same update. Does not
 * hide, delete, or edit the 208 broken items or the 90 needs-pharmacist items.
 *
 * Dry run (default):
 *   npx tsx scripts/apply-naplex-keyfix-20260927.ts
 *
 * Apply, in one transaction, only when every row still matches the backup:
 *   npx tsx scripts/apply-naplex-keyfix-20260927.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const DATA_DIR = path.join(process.cwd(), "scripts/data/naplex-keyfix-20260927");
const TYPO_ID = "cmqgswkfc000p1ytwqjffwq6s";
const ARTIFACT = "1.";
const REPLACEMENT = "GLP-1 receptor agonists should be taken with a high-fat meal.";
const WHY_FAILS =
  "Oral semaglutide must be taken fasting with <=4 oz water 30 min before food; injectable GLP-1 RAs are taken without regard to meals.";
const TRAP = "Some drugs are best absorbed with food.";
const REMEMBER = "Food timing is not the key GLP-1 RA counseling point.";
const OLD_BLOCK = [
  "**1.**",
  "• Trap: This option is a formatting remnant, not a real answer.",
  "• Why it fails here: It contains no clinical content.",
  "• Remember: Choose the option that answers the question.",
].join("\n");
const NEW_BLOCK = [
  `**${REPLACEMENT}**`,
  `• Trap: ${TRAP}`,
  `• Why it fails here: ${WHY_FAILS}`,
  `• Remember: ${REMEMBER}`,
].join("\n");

const prisma = new PrismaClient();

type BackupRow = {
  id: string;
  updatedAt: string;
  correctAnswer: string;
  explanation: string;
  options_raw: string;
  generationMeta_column: unknown;
};

type Proposed = {
  id: string;
  action: string;
  set_correctAnswer: string;
  set_explanation: string;
  set_options_json: string;
  set_generationMeta_column: unknown;
  expected_current_updatedAt: string;
  expected_current_correctAnswer: string;
};

type LiveRow = {
  id: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  updatedAtText: string;
  generationMeta: unknown;
};

type Planned = {
  id: string;
  action: string;
  oldKey: string;
  newKey: string;
  explanation: string;
  options: string;
  generationMeta: unknown;
  updatedAtText: string;
  typo: boolean;
};

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(path.join(DATA_DIR, name), "utf8")) as T;
}

function normTs(value: string): string {
  const trimmed = value.trim().replace(" ", "T");
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d+))?/);
  if (!match) return trimmed;
  const ms = (match[2] ?? "0").slice(0, 3).padEnd(3, "0");
  return `${match[1]}.${ms}`;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  const obj = asObject(value);
  if (!obj) return value;
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = canonicalize(obj[key]);
      return acc;
    }, {});
}

function jsonEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(canonicalize(a)) === JSON.stringify(canonicalize(b));
}

function sameJsonText(a: string, b: string): boolean {
  if (a === b) return true;
  try {
    return jsonEqual(JSON.parse(a), JSON.parse(b));
  } catch {
    return false;
  }
}

function optionTexts(optionsJson: string): string[] {
  const parsed = JSON.parse(optionsJson) as unknown;
  const list = Array.isArray(parsed) ? parsed : asObject(parsed)?.options;
  if (!Array.isArray(list) || list.some((item) => typeof item !== "string")) {
    throw new Error("options JSON has no string option list");
  }
  return list as string[];
}

function quoteId(id: string): string {
  if (!/^[a-z0-9]+$/.test(id)) throw new Error(`Unexpected id: ${id}`);
  return `'${id}'`;
}

function driftFields(live: LiveRow, backup: BackupRow): string[] {
  const drifted: string[] = [];
  if (live.correctAnswer !== backup.correctAnswer) drifted.push("correctAnswer");
  if (live.explanation !== backup.explanation) drifted.push("explanation");
  if (!sameJsonText(live.options, backup.options_raw)) drifted.push("options");
  if (!jsonEqual(live.generationMeta ?? null, backup.generationMeta_column ?? null)) {
    drifted.push("generationMeta");
  }
  if (normTs(live.updatedAtText) !== normTs(backup.updatedAt)) drifted.push("updatedAt");
  return drifted;
}

function rewriteIncorrect(value: unknown, label: string): string | null {
  if (!Array.isArray(value)) return `${label} whyIncorrect is missing`;
  const hits = value.filter((item) => asObject(item)?.option === ARTIFACT);
  if (hits.length !== 1) return `${label} has ${hits.length} artifact options`;
  const item = asObject(hits[0]);
  if (!item) return `${label} artifact option is not an object`;
  item.option = REPLACEMENT;
  item.misconception = TRAP;
  item.correction = WHY_FAILS;
  item.conceptLink = REMEMBER;
  return null;
}

function applyArtifactTypo(
  explanation: string,
  optionsJson: string,
  generationMeta: unknown
): { explanation: string; options: string; generationMeta: unknown } | string {
  if (!explanation.includes(OLD_BLOCK) || explanation.split(OLD_BLOCK).length !== 2) {
    return "explanation artifact block is missing";
  }
  const options = asObject(JSON.parse(optionsJson));
  if (!options || !Array.isArray(options.options)) return "options list is missing";
  const texts = options.options;
  if (texts.filter((item) => item === ARTIFACT).length !== 1) return "option text 1. is not unique";
  const index = texts.indexOf(ARTIFACT);
  texts[index] = REPLACEMENT;
  const distractors = asObject(options.distractorRationale);
  if (!distractors || !(ARTIFACT in distractors)) return "distractor key 1. is missing";
  const previous = distractors[ARTIFACT];
  delete distractors[ARTIFACT];
  distractors[REPLACEMENT] = WHY_FAILS || previous;
  const optionsMeta = asObject(options.generationMeta);
  const optionsStructured = asObject(optionsMeta?.structuredRationale);
  const column = asObject(generationMeta);
  if (!column) return "generationMeta column is missing";
  const problems = [
    rewriteIncorrect(optionsStructured?.whyIncorrect, "options.structuredRationale"),
    rewriteIncorrect(asObject(column.structuredRationale)?.whyIncorrect, "column.structuredRationale"),
    rewriteIncorrect(asObject(column.expertRationale)?.whyIncorrect, "column.expertRationale"),
  ].filter((problem): problem is string => Boolean(problem));
  if (problems.length > 0) return problems.join("; ");
  return {
    explanation: explanation.replace(OLD_BLOCK, NEW_BLOCK),
    options: JSON.stringify(options),
    generationMeta: column,
  };
}

async function loadLive(ids: string[]): Promise<Map<string, LiveRow>> {
  const list = ids.map(quoteId).join(",");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, options, "correctAnswer", explanation,
           "updatedAt"::text AS "updatedAtText", "generationMeta"
    FROM "QuestionBankItem"
    WHERE id IN (${list})
  `)) as LiveRow[];
  return new Map(rows.map((row) => [row.id, row]));
}

async function main() {
  const apply = process.argv.includes("--apply");
  const proposed = readJson<Record<string, Proposed>>("proposed-changes.json");
  const typos = readJson<Record<string, { id: string }>>("typo-fixes.json");
  const hideIds = readJson<string[]>("hide-ids.json");
  const backupFile = readJson<{ rows: Record<string, BackupRow> }>("backup-original.json");
  const backup = backupFile.rows;

  const changeIds = Object.keys(proposed);
  const fixCount = changeIds.filter((id) => proposed[id]?.action === "fix").length;
  const rationaleCount = changeIds.filter((id) => proposed[id]?.action === "rationale-only").length;
  if (changeIds.length !== 70 || fixCount !== 68 || rationaleCount !== 2 || hideIds.length !== 208) {
    throw new Error(
      `Unexpected batch sizes: ${fixCount} fixes, ${rationaleCount} rationale-only, ${hideIds.length} hides`
    );
  }
  if (!typos[TYPO_ID] || !proposed[TYPO_ID]) throw new Error("typo id is not the GLP-1 fix row");
  if (changeIds.some((id) => hideIds.includes(id)) || new Set(changeIds).size !== changeIds.length) {
    throw new Error("Fix and hide ids overlap");
  }
  const needed = new Set([...changeIds, ...hideIds]);
  if ([...needed].some((id) => !backup[id])) throw new Error("Backup JSON is missing an apply id");

  const live = await loadLive([...needed]);
  const skipped: string[] = [];
  const planned: Planned[] = [];

  for (const id of changeIds) {
    const row = live.get(id);
    const prior = backup[id];
    const fix = proposed[id]!;
    if (!row || !prior) {
      skipped.push(`${id} missing live row or backup`);
      continue;
    }
    if (fix.action !== "fix" && fix.action !== "rationale-only") {
      skipped.push(`${id} action ${fix.action} does not map`);
      continue;
    }
    const drifted = driftFields(row, prior);
    if (row.correctAnswer !== fix.expected_current_correctAnswer) drifted.push("expected_current_correctAnswer");
    if (normTs(row.updatedAtText) !== normTs(fix.expected_current_updatedAt)) drifted.push("expected_current_updatedAt");
    if (fix.action === "rationale-only" && fix.set_correctAnswer !== fix.expected_current_correctAnswer) {
      drifted.push("rationale_only_key_changed");
    }
    if (drifted.length > 0) {
      skipped.push(`${id} drifted: ${[...new Set(drifted)].join(", ")}`);
      continue;
    }
    let explanation = fix.set_explanation;
    let options = fix.set_options_json;
    let generationMeta = fix.set_generationMeta_column;
    let typo = false;
    if (id === TYPO_ID) {
      const rewritten = applyArtifactTypo(explanation, options, generationMeta);
      if (typeof rewritten === "string") {
        skipped.push(`${id} typo does not map cleanly: ${rewritten}`);
        continue;
      }
      explanation = rewritten.explanation;
      options = rewritten.options;
      generationMeta = rewritten.generationMeta;
      typo = true;
    }
    const texts = optionTexts(options);
    if (!texts.includes(fix.set_correctAnswer)) {
      skipped.push(`${id} new correctAnswer is not an option`);
      continue;
    }
    if (typo && texts.includes(ARTIFACT)) {
      skipped.push(`${id} artifact option remains`);
      continue;
    }
    planned.push({
      id,
      action: fix.action,
      oldKey: row.correctAnswer,
      newKey: fix.set_correctAnswer,
      explanation,
      options,
      generationMeta,
      updatedAtText: row.updatedAtText,
      typo,
    });
  }

  const hideDrift = hideIds.flatMap((id) => {
    const row = live.get(id);
    const prior = backup[id];
    if (!row || !prior) return [`${id} missing`];
    const drifted = driftFields(row, prior);
    return drifted.length > 0 ? [`${id} drifted: ${drifted.join(", ")}`] : [];
  });

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(
    `planned ${planned.length} (fix ${planned.filter((row) => row.action === "fix").length}, rationale-only ${planned.filter((row) => row.action === "rationale-only").length}, typo ${planned.filter((row) => row.typo).length})`
  );
  console.log(`skipped ${skipped.length}`);
  console.log(`hide rows left unchanged: ${hideIds.length}; hide drift ${hideDrift.length}`);
  for (const row of planned) {
    console.log(
      `${row.action}${row.typo ? " typo" : ""} ${row.id} | ${JSON.stringify(row.oldKey)} -> ${JSON.stringify(row.newKey)}`
    );
  }
  for (const line of skipped) console.log(`SKIP ${line}`);
  for (const line of hideDrift) console.log(`HIDE-DRIFT ${line}`);

  if (skipped.length > 0 || hideDrift.length > 0 || planned.length !== 70) {
    console.log("Stopped. No rows written.");
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No rows written.");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const row of planned) {
        const updated = await tx.$executeRaw`
          UPDATE "QuestionBankItem"
          SET "correctAnswer" = ${row.newKey},
              explanation = ${row.explanation},
              options = ${row.options},
              "generationMeta" = ${JSON.stringify(row.generationMeta)}::jsonb,
              "updatedAt" = NOW()
          WHERE id = ${row.id}
            AND "correctAnswer" = ${row.oldKey}
            AND "updatedAt" = ${row.updatedAtText}::timestamp
        `;
        if (updated !== 1) {
          throw new Error(`Expected to update 1 row for ${row.id}, updated ${updated}`);
        }
      }
    },
    { timeout: 180_000, maxWait: 20_000 }
  );

  const after = await loadLive([...changeIds, ...hideIds]);
  const mismatches: string[] = [];
  for (const row of planned) {
    const liveRow = after.get(row.id);
    if (!liveRow) {
      mismatches.push(`${row.id} missing after update`);
      continue;
    }
    if (liveRow.correctAnswer !== row.newKey) mismatches.push(`${row.id} correctAnswer`);
    if (liveRow.explanation !== row.explanation) mismatches.push(`${row.id} explanation`);
    if (!sameJsonText(liveRow.options, row.options)) mismatches.push(`${row.id} options`);
    if (!jsonEqual(liveRow.generationMeta, row.generationMeta)) mismatches.push(`${row.id} generationMeta`);
  }
  for (const id of hideIds) {
    const liveRow = after.get(id);
    const prior = backup[id];
    if (!liveRow || !prior || liveRow.correctAnswer !== prior.correctAnswer) {
      mismatches.push(`${id} hide row changed`);
    }
  }
  if (mismatches.length > 0) {
    console.log(`VERIFY FAIL ${mismatches.length}`);
    for (const line of mismatches) console.log(`MISMATCH ${line}`);
    process.exitCode = 1;
    return;
  }
  console.log("VERIFY OK 70 rows match the approved new values. 208 hide rows are unchanged.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
