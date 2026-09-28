#!/usr/bin/env node
/**
 * Apply the 2026-09-27 batch-2 NCLEX key corrections (60 rows).
 *
 * Does not hide, delete, or edit the 45 broken items or the 82 needs-RN items.
 * Does not touch qbi_keyfix_backup_20260927 (batch 1).
 *
 * Dry run (default):
 *   npx tsx scripts/apply-nclex-keyfix-20260927-b2.ts
 *
 * Apply, in one transaction, only when every row still matches the backup:
 *   npx tsx scripts/apply-nclex-keyfix-20260927-b2.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const DATA_DIR = path.join(process.cwd(), "scripts/data/nclex-keyfix-20260927-b2");
const prisma = new PrismaClient();

type Fingerprint = {
  expertRationale_jsonb_md5: string;
  rationaleEnrichedAt: string;
  expertRationale_text_length: number;
};

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
  generationMeta_column_fingerprint?: Fingerprint | null;
  generationMeta_column_governingPrinciple?: string | null;
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

type LiveRow = {
  id: string;
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  qaPassed: boolean;
  updatedAtText: string;
  generationMeta: unknown;
};

type Planned = {
  id: string;
  oldKey: string;
  newKey: string;
  plan: string;
  labTables: number;
  explanation: string;
  options: string;
  generationMeta?: unknown;
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
    SELECT id, question, scenario, options, "correctAnswer", explanation, "qaPassed",
           "updatedAt"::text AS "updatedAtText", "generationMeta"
    FROM "QuestionBankItem"
    WHERE id IN (${list})
  `)) as LiveRow[];
  return new Map(rows.map((row) => [row.id, row]));
}

async function loadFingerprints(ids: string[]): Promise<Map<string, Fingerprint>> {
  if (ids.length === 0) return new Map();
  const list = ids.map(quoteId).join(",");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id,
           md5(("generationMeta"->'expertRationale')::text) AS "expertRationale_jsonb_md5",
           length(("generationMeta"->'expertRationale')::text)::int AS "expertRationale_text_length",
           "generationMeta"->>'rationaleEnrichedAt' AS "rationaleEnrichedAt"
    FROM "QuestionBankItem"
    WHERE id IN (${list})
  `)) as Fingerprint & { id: string }[];
  return new Map(
    rows.map((row) => [
      row.id,
      {
        expertRationale_jsonb_md5: row.expertRationale_jsonb_md5,
        expertRationale_text_length: Number(row.expertRationale_text_length),
        rationaleEnrichedAt: row.rationaleEnrichedAt,
      },
    ])
  );
}

function fingerprintDrift(expected: Fingerprint, live: Fingerprint | undefined): string[] {
  if (!live) return ["fingerprint_missing"];
  const drifted: string[] = [];
  if (live.expertRationale_jsonb_md5 !== expected.expertRationale_jsonb_md5) drifted.push("expertRationale_jsonb_md5");
  if (live.expertRationale_text_length !== expected.expertRationale_text_length) {
    drifted.push("expertRationale_text_length");
  }
  if (live.rationaleEnrichedAt !== expected.rationaleEnrichedAt) drifted.push("rationaleEnrichedAt");
  return drifted;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const proposed = readJson<Record<string, Proposed>>("proposed-changes.json");
  const hideIds = readJson<string[]>("hide-ids.json");
  const backupFile = readJson<{ rows: Record<string, BackupRow> }>("backup-original.json");
  const backup = backupFile.rows;

  const fixIds = Object.keys(proposed);
  if (fixIds.length !== 60 || hideIds.length !== 45) {
    throw new Error(`Unexpected batch sizes: ${fixIds.length} fixes, ${hideIds.length} hides`);
  }
  if (new Set(fixIds).size !== fixIds.length || fixIds.some((id) => hideIds.includes(id))) {
    throw new Error("Fix and hide ids overlap");
  }
  const backupIds = new Set(Object.keys(backup));
  if (backupIds.size !== 105 || [...fixIds, ...hideIds].some((id) => !backupIds.has(id))) {
    throw new Error("Backup JSON does not cover the 105 fix and hide ids");
  }

  const fingerprintIds = fixIds.filter((id) => backup[id]?.generationMeta_column_fingerprint);
  if (fingerprintIds.length !== 19) {
    throw new Error(`Expected 19 checksum rows, found ${fingerprintIds.length}`);
  }

  const live = await loadLive([...fixIds, ...hideIds]);
  const fingerprints = await loadFingerprints(fingerprintIds);
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
    if (prior.generationMeta_column_fingerprint) {
      drifted.push(...fingerprintDrift(prior.generationMeta_column_fingerprint, fingerprints.get(id)));
    }
    if (typeof prior.generationMeta_column_governingPrinciple === "string") {
      const current = asObject(row.generationMeta)?.governingPrinciple;
      if (current !== prior.generationMeta_column_governingPrinciple) drifted.push("governingPrinciple");
    }
    if (fix.set_generationMeta_column) {
      const optionsMeta = asObject(JSON.parse(row.options))?.generationMeta;
      if (!jsonEqual(row.generationMeta, optionsMeta)) drifted.push("column_vs_options_generationMeta");
    }
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

  const hideDrift = hideIds.flatMap((id) => {
    const row = live.get(id);
    const prior = backup[id];
    if (!row || !prior || prior.action !== "hide-pending-rewrite") return [`${id} missing`];
    const drifted = driftFields(row, prior);
    return drifted.length > 0 ? [`${id} drifted: ${drifted.join(", ")}`] : [];
  });

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`planned ${planned.length}`);
  console.log(`skipped ${skipped.length}`);
  console.log(`hide rows left unchanged: ${hideIds.length}; hide drift ${hideDrift.length}`);
  console.log(`checksum rows checked: ${fingerprintIds.length}`);
  console.log(`column expert rationales that keep a lab table: ${labTableRows}`);
  for (const row of planned) {
    console.log(`${row.id} | ${JSON.stringify(row.oldKey)} -> ${JSON.stringify(row.newKey)} | ${row.plan}`);
  }
  for (const line of skipped) console.log(`SKIP ${line}`);
  for (const line of hideDrift) console.log(`HIDE-DRIFT ${line}`);

  if (skipped.length > 0 || hideDrift.length > 0 || planned.length !== 60) {
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
        if (row.generationMeta !== undefined) {
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

  const after = await loadLive([...fixIds, ...hideIds]);
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
  console.log("VERIFY OK 60 rows match the approved new values. 45 hide rows are unchanged.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
