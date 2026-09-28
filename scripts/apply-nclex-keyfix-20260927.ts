#!/usr/bin/env node
/**
 * Apply the 2026-09-27 NCLEX key corrections and two typo fixes.
 *
 * Touches only the 99 key rows and 2 typo rows. Does not hide, delete, or
 * edit the 24 broken items or the 90 needs-RN items.
 *
 * Dry run (default):
 *   npx tsx scripts/apply-nclex-keyfix-20260927.ts
 *
 * Apply, in one transaction, only when every row still matches the backup:
 *   npx tsx scripts/apply-nclex-keyfix-20260927.ts --apply
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const DATA_DIR = path.join(process.cwd(), "scripts/data/nclex-keyfix-20260927");
const prisma = new PrismaClient();

type BackupRow = {
  id: string;
  action: string;
  updatedAt: string;
  correctAnswer: string;
  explanation: string;
  options: string;
  scenario: string | null;
  question: string;
  qaPassed: boolean | string;
};

type Proposed = {
  id: string;
  set_correctAnswer: string;
  set_explanation: string;
  set_options_json: string;
  set_generationMeta_column?: string | null;
  set_column_expertRationale?: Record<string, unknown> | null;
  set_column_governingPrinciple?: string | null;
  expected_current_updatedAt: string;
  expected_current_correctAnswer: string;
};

type Typo = {
  id: string;
  set_scenario: string;
  set_question: string;
  set_explanation: string;
  set_options_json: string;
  set_contentHash: string;
  old_contentHash: string;
  correctAnswer_unchanged: string;
  expected_current_updatedAt: string;
};

type LiveRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  contentHash: string;
  qaPassed: boolean;
  updatedAt: Date;
  updatedAtText: string;
  generationMeta: unknown;
};

type Planned =
  | {
      kind: "fix";
      id: string;
      oldKey: string;
      newKey: string;
      plan: string;
      labTables: number;
      explanation: string;
      options: string;
      generationMeta?: unknown;
      updatedAtText: string;
    }
  | {
      kind: "typo";
      id: string;
      oldKey: string;
      newKey: string;
      plan: string;
      scenario: string;
      question: string;
      explanation: string;
      options: string;
      contentHash: string;
      generationMeta: unknown;
      updatedAtText: string;
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

function contentHash(fieldId: string, subjectId: string, scenario: string, question: string): string {
  return createHash("sha256")
    .update(`${fieldId}|${subjectId}|${scenario.trim().toLowerCase()}|${question.trim().toLowerCase()}`)
    .digest("hex");
}

function quoteId(id: string): string {
  if (!/^[a-z0-9]+$/.test(id)) throw new Error(`Unexpected id: ${id}`);
  return `'${id}'`;
}

function nextFixMeta(current: unknown, fix: Proposed): { meta?: unknown; plan: string; labTables: number } {
  const copy = Boolean(fix.set_generationMeta_column);
  const expert = asObject(fix.set_column_expertRationale);
  const principle = typeof fix.set_column_governingPrinciple === "string";
  const modes = [copy, Boolean(expert), principle].filter(Boolean).length;
  if (modes > 1) throw new Error(`${fix.id} has more than one generationMeta change`);
  if (copy) {
    const parsed = asObject(JSON.parse(fix.set_options_json));
    if (!parsed?.generationMeta) throw new Error(`${fix.id} options have no generationMeta`);
    return { meta: parsed.generationMeta, plan: "column=options.generationMeta", labTables: 0 };
  }
  const meta = asObject(current) ?? {};
  if (expert) {
    const currentExpert = asObject(meta.expertRationale);
    const blocks = Array.isArray(currentExpert?.visualBlocks) ? currentExpert.visualBlocks : [];
    const lab = blocks.filter((block) => asObject(block)?.kind === "lab_table");
    const nextExpert = { ...expert };
    if (lab.length > 0) nextExpert.visualBlocks = lab;
    return {
      meta: { ...meta, expertRationale: nextExpert },
      plan: "column.expertRationale",
      labTables: lab.length,
    };
  }
  if (principle) {
    return {
      meta: { ...meta, governingPrinciple: fix.set_column_governingPrinciple },
      plan: "column.governingPrinciple",
      labTables: 0,
    };
  }
  return { plan: "column unchanged", labTables: 0 };
}

function driftFields(live: LiveRow, backup: BackupRow): string[] {
  const drifted: string[] = [];
  if (live.correctAnswer !== backup.correctAnswer) drifted.push("correctAnswer");
  if (live.explanation !== backup.explanation) drifted.push("explanation");
  if (!sameJsonText(live.options, backup.options)) drifted.push("options");
  if ((live.scenario ?? "") !== (backup.scenario ?? "")) drifted.push("scenario");
  if (live.question !== backup.question) drifted.push("question");
  if (normTs(live.updatedAtText) !== normTs(backup.updatedAt)) drifted.push("updatedAt");
  const backupPassed = backup.qaPassed === true || backup.qaPassed === "True" || backup.qaPassed === "true";
  if (live.qaPassed !== backupPassed) drifted.push("qaPassed");
  return drifted;
}

async function loadLive(ids: string[]): Promise<Map<string, LiveRow>> {
  const list = ids.map(quoteId).join(",");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, "fieldId", "subjectId", question, scenario, options, "correctAnswer",
           explanation, "contentHash", "qaPassed", "updatedAt",
           "updatedAt"::text AS "updatedAtText", "generationMeta"
    FROM "QuestionBankItem"
    WHERE id IN (${list})
  `)) as LiveRow[];
  return new Map(rows.map((row) => [row.id, row]));
}

async function main() {
  const apply = process.argv.includes("--apply");
  const proposed = readJson<Record<string, Proposed>>("proposed-changes.json");
  const typos = readJson<Record<string, Typo>>("typo-fixes.json");
  const hideIds = readJson<string[]>("hide-ids.json");
  const backupFile = readJson<{ rows: Record<string, BackupRow> }>("backup-original.json");
  const backup = backupFile.rows;

  const fixIds = Object.keys(proposed);
  const typoIds = Object.keys(typos);
  const changeIds = [...fixIds, ...typoIds];
  if (fixIds.length !== 99 || typoIds.length !== 2 || hideIds.length !== 24) {
    throw new Error(`Unexpected batch sizes: ${fixIds.length} fixes, ${typoIds.length} typos, ${hideIds.length} hides`);
  }
  const overlap = changeIds.filter((id) => hideIds.includes(id));
  if (new Set(changeIds).size !== changeIds.length || overlap.length > 0) {
    throw new Error("Fix, typo, and hide ids overlap");
  }

  const live = await loadLive([...changeIds, ...hideIds]);
  const skipped: string[] = [];
  const planned: Planned[] = [];
  let labTableRows = 0;

  for (const id of fixIds) {
    const row = live.get(id);
    const prior = backup[id];
    const fix = proposed[id]!;
    if (!row || !prior || prior.action !== "fix") {
      skipped.push(`${id} missing live row or backup action`);
      continue;
    }
    const drifted = driftFields(row, prior);
    if (row.correctAnswer !== fix.expected_current_correctAnswer) drifted.push("expected_current_correctAnswer");
    if (normTs(row.updatedAtText) !== normTs(fix.expected_current_updatedAt)) drifted.push("expected_current_updatedAt");
    if (drifted.length > 0) {
      skipped.push(`${id} drifted: ${[...new Set(drifted)].join(", ")}`);
      continue;
    }
    const options = optionTexts(fix.set_options_json);
    if (!options.includes(fix.set_correctAnswer)) {
      skipped.push(`${id} new correctAnswer is not an option`);
      continue;
    }
    const meta = nextFixMeta(row.generationMeta, fix);
    if (meta.labTables > 0) labTableRows += 1;
    planned.push({
      kind: "fix",
      id,
      oldKey: row.correctAnswer,
      newKey: fix.set_correctAnswer,
      plan: meta.plan,
      labTables: meta.labTables,
      explanation: fix.set_explanation,
      options: fix.set_options_json,
      generationMeta: meta.meta,
      updatedAtText: row.updatedAtText,
    });
  }

  for (const id of typoIds) {
    const row = live.get(id);
    const prior = backup[id];
    const typo = typos[id]!;
    if (!row || !prior || prior.action !== "typo-fix") {
      skipped.push(`${id} missing live row or backup action`);
      continue;
    }
    const drifted = driftFields(row, prior);
    if (row.correctAnswer !== typo.correctAnswer_unchanged) drifted.push("correctAnswer_unchanged");
    if (row.contentHash !== typo.old_contentHash) drifted.push("old_contentHash");
    if (normTs(row.updatedAtText) !== normTs(typo.expected_current_updatedAt)) drifted.push("expected_current_updatedAt");
    if (row.fieldId !== "nursing") drifted.push("fieldId");
    const hash = contentHash(row.fieldId, row.subjectId, typo.set_scenario, typo.set_question);
    if (hash !== typo.set_contentHash) drifted.push("computed_contentHash");
    const clash = await prisma.questionBankItem.findFirst({
      where: { contentHash: typo.set_contentHash, NOT: { id } },
      select: { id: true },
    });
    if (clash) drifted.push(`contentHash_clash:${clash.id}`);
    if (drifted.length > 0) {
      skipped.push(`${id} drifted: ${[...new Set(drifted)].join(", ")}`);
      continue;
    }
    const options = optionTexts(typo.set_options_json);
    if (!options.includes(typo.correctAnswer_unchanged)) {
      skipped.push(`${id} unchanged correctAnswer is not an option`);
      continue;
    }
    const parsed = asObject(JSON.parse(typo.set_options_json));
    if (!parsed?.generationMeta) {
      skipped.push(`${id} options have no generationMeta`);
      continue;
    }
    planned.push({
      kind: "typo",
      id,
      oldKey: row.correctAnswer,
      newKey: typo.correctAnswer_unchanged,
      plan: "scenario, question, explanation, options, generationMeta, contentHash",
      scenario: typo.set_scenario,
      question: typo.set_question,
      explanation: typo.set_explanation,
      options: typo.set_options_json,
      contentHash: typo.set_contentHash,
      generationMeta: parsed.generationMeta,
      updatedAtText: row.updatedAtText,
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
  console.log(`planned ${planned.length} (fix ${planned.filter((row) => row.kind === "fix").length}, typo ${planned.filter((row) => row.kind === "typo").length})`);
  console.log(`skipped ${skipped.length}`);
  console.log(`hide rows left unchanged: ${hideIds.length}; hide drift ${hideDrift.length}`);
  console.log(`column expert rationales that keep a lab table: ${labTableRows}`);
  for (const row of planned) {
    console.log(`${row.kind} ${row.id} | ${JSON.stringify(row.oldKey)} -> ${JSON.stringify(row.newKey)} | ${row.plan}`);
  }
  for (const line of skipped) console.log(`SKIP ${line}`);
  for (const line of hideDrift) console.log(`HIDE-DRIFT ${line}`);

  if (skipped.length > 0 || planned.length !== 101) {
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
        const sets = [
          Prisma.sql`"correctAnswer" = ${row.newKey}`,
          Prisma.sql`explanation = ${row.explanation}`,
          Prisma.sql`options = ${row.options}`,
          Prisma.sql`"updatedAt" = NOW()`,
        ];
        if (row.kind === "typo") {
          sets.push(
            Prisma.sql`scenario = ${row.scenario}`,
            Prisma.sql`question = ${row.question}`,
            Prisma.sql`"contentHash" = ${row.contentHash}`,
            Prisma.sql`"generationMeta" = ${JSON.stringify(row.generationMeta)}::jsonb`
          );
        } else if (row.generationMeta !== undefined) {
          sets.push(Prisma.sql`"generationMeta" = ${JSON.stringify(row.generationMeta)}::jsonb`);
        }
        const updated = await tx.$executeRaw`
          UPDATE "QuestionBankItem"
          SET ${Prisma.join(sets, ", ")}
          WHERE id = ${row.id}
            AND "correctAnswer" = ${row.oldKey}
            AND "updatedAt" = ${row.updatedAtText}::timestamp
        `;
        if (updated !== 1) {
          throw new Error(`Expected to update 1 row for ${row.id}, updated ${updated}`);
        }
      }
    },
    { timeout: 120_000, maxWait: 20_000 }
  );

  const after = await loadLive(changeIds);
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
    if (row.generationMeta !== undefined && !jsonEqual(liveRow.generationMeta, row.generationMeta)) {
      mismatches.push(`${row.id} generationMeta`);
    }
    if (row.kind === "typo") {
      if ((liveRow.scenario ?? "") !== row.scenario) mismatches.push(`${row.id} scenario`);
      if (liveRow.question !== row.question) mismatches.push(`${row.id} question`);
      if (liveRow.contentHash !== row.contentHash) mismatches.push(`${row.id} contentHash`);
    }
  }
  if (mismatches.length > 0) {
    console.log(`VERIFY FAIL ${mismatches.length}`);
    for (const line of mismatches) console.log(`MISMATCH ${line}`);
    process.exitCode = 1;
    return;
  }
  console.log("VERIFY OK 101 rows match the approved new values.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
