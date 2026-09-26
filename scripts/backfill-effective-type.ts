#!/usr/bin/env node
/**
 * Record an effective MCQ type for NGN/case labels that are plain single-answer items.
 *
 * Does not delete rows and does not edit stems, options, keys, rationales, or itemType.
 * The only write is curationMeta.effectiveType.
 *
 * Dry-run (no writes) — counts by board and original type:
 *   npm run db:effective-type
 *
 * Persist the reclassification record:
 *   npm run db:effective-type -- --apply
 *
 * Serve one item as its stored label again:
 *   npm run db:effective-type -- --apply --restore <itemId>
 *
 * Drop restore overrides and re-assess:
 *   npm run db:effective-type -- --apply --clear-restores
 *
 * Items that are not valid single-answer MCQs are listed and left unchanged.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { sqlQuery } from "../src/lib/db";
import {
  EFFECTIVE_TYPE_PIPELINE,
  PLAIN_SINGLE_ANSWER_MCQ,
  assessEffectiveType,
  readEffectiveTypeRecord,
  type EffectiveTypeAction,
  type EffectiveTypeInput,
  type EffectiveTypeRecord,
} from "../src/lib/exam-prep/effective-type";
import { EFFECTIVE_MCQ_SQL } from "../src/lib/exam-prep/effective-type-sql";
import {
  assessStudentEligibility,
  completeCaseGroupKeys,
  type StudentEligibilityInput,
} from "../src/lib/exam-prep/student-eligibility";

const prisma = new PrismaClient();

type Args = { apply: boolean; clearRestores: boolean; restoreIds: string[] };

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { apply: false, clearRestores: false, restoreIds: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply") parsed.apply = true;
    else if (arg === "--clear-restores") parsed.clearRestores = true;
    else if (arg === "--restore" && args[i + 1]) parsed.restoreIds.push(args[++i]!);
  }
  return parsed;
}

type ItemRow = {
  id: string;
  fieldId: string;
  active: boolean;
  qaPassed: boolean;
  itemType: string;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  curationMeta: Prisma.JsonValue | null;
};

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

function toInput(row: ItemRow, meta: unknown): EffectiveTypeInput & StudentEligibilityInput {
  return {
    id: row.id,
    fieldId: row.fieldId,
    active: row.active,
    qaPassed: row.qaPassed,
    itemType: row.itemType,
    question: row.question,
    scenario: row.scenario,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    optionsRaw: row.options,
    curationMeta: meta,
  };
}

function metaForAssess(meta: Prisma.JsonValue | null, clearRestores: boolean): unknown {
  if (!clearRestores) return meta;
  const record = readEffectiveTypeRecord(meta);
  if (!record || record.status !== "restored") return meta;
  const next = asObject(meta);
  const effectiveType = { ...record, status: "reclassified" };
  return { ...next, effectiveType };
}

type Bucket = {
  relabel: number;
  leave: number;
  keep: number;
  visibleRelabel: number;
  visibleLeave: number;
  visibleKeep: number;
};

function emptyBucket(): Bucket {
  return { relabel: 0, leave: 0, keep: 0, visibleRelabel: 0, visibleLeave: 0, visibleKeep: 0 };
}

function desiredRecord(
  row: ItemRow,
  action: EffectiveTypeAction,
  restored: boolean,
  now: string
): { record: EffectiveTypeRecord | null; changed: boolean; remove: boolean } {
  const prior = readEffectiveTypeRecord(row.curationMeta);
  if (restored) {
    const next: EffectiveTypeRecord = {
      pipeline: EFFECTIVE_TYPE_PIPELINE,
      status: "restored",
      effectiveType: "mcq",
      originalType: row.itemType,
      reason: PLAIN_SINGLE_ANSWER_MCQ,
      assessedAt: prior?.assessedAt || now,
      restoredAt: prior?.restoredAt || now,
    };
    const changed = !prior || prior.status !== "restored" || prior.originalType !== row.itemType;
    return { record: next, changed, remove: false };
  }
  if (action !== "relabel") {
    return { record: null, changed: Boolean(prior), remove: Boolean(prior) };
  }
  const next: EffectiveTypeRecord = {
    pipeline: EFFECTIVE_TYPE_PIPELINE,
    status: "reclassified",
    effectiveType: "mcq",
    originalType: row.itemType,
    reason: PLAIN_SINGLE_ANSWER_MCQ,
    assessedAt: now,
  };
  const changed = !prior || prior.status !== "reclassified" || prior.originalType !== row.itemType || prior.reason !== next.reason;
  return { record: next, changed, remove: false };
}

async function main() {
  const args = parseArgs();
  const now = new Date().toISOString();
  const restoreIds = new Set(args.restoreIds);
  console.log(`effective-type ${args.apply ? "APPLY" : "DRY-RUN"}`);
  if (args.clearRestores) console.log("clear-restores: restore overrides will be dropped");
  if (restoreIds.size > 0) console.log(`restore ids: ${[...restoreIds].join(", ")}`);

  const labelled = [
    "select_all",
    "sata",
    "ngn_bowtie",
    "bow_tie",
    "ngn_matrix",
    "matrix",
    "ordered_response",
    "ngn_highlight",
    "highlight",
    "drag_drop",
    "constructed_response",
    "case_study",
    "case_based",
    "unfolding_case",
    "ccs_prompt",
  ];

  const rows = await prisma.questionBankItem.findMany({
    where: { active: true, itemType: { in: labelled } },
    select: {
      id: true,
      fieldId: true,
      active: true,
      qaPassed: true,
      itemType: true,
      scenario: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      curationMeta: true,
    },
  });

  const completeCaseGroups = completeCaseGroupKeys(
    rows.map((row) => ({
      fieldId: row.fieldId,
      itemType: row.itemType,
      active: row.active,
      optionsRaw: row.options,
    }))
  );

  const byKey = new Map<string, Bucket>();
  const tsRelabel = new Set<string>();
  const visibleLeave: string[] = [];
  let writes = 0;

  for (const row of rows) {
    const assessedMeta = metaForAssess(row.curationMeta, args.clearRestores);
    const input = toInput(row, assessedMeta);
    const verdict = assessEffectiveType(input);
    const forceRestore = restoreIds.has(row.id);
    const restored = forceRestore || (!args.clearRestores && verdict.reason === "restored_original_type");
    const action: EffectiveTypeAction = restored ? "keep" : verdict.action;
    const key = `${row.fieldId}\t${row.itemType}`;
    const bucket = byKey.get(key) ?? emptyBucket();
    bucket[action] += 1;
    const eligible =
      row.qaPassed &&
      assessStudentEligibility(input, { completeCaseGroups }).eligible;
    if (eligible && action === "relabel") bucket.visibleRelabel += 1;
    if (eligible && action === "keep") bucket.visibleKeep += 1;
    if (eligible && action === "leave") {
      bucket.visibleLeave += 1;
      if (visibleLeave.length < 30) visibleLeave.push(`${row.fieldId} ${row.itemType} ${row.id}`);
    }
    byKey.set(key, bucket);
    if (row.qaPassed && action === "relabel") tsRelabel.add(row.id);

    const desired = desiredRecord(row, action === "relabel" ? "relabel" : verdict.action, restored, now);
    if (!desired.changed) continue;
    writes += 1;
    if (!args.apply) continue;
    const base = asObject(row.curationMeta);
    if (desired.remove) delete base.effectiveType;
    const curationMeta = (
      desired.record ? { ...base, effectiveType: desired.record } : base
    ) as Prisma.InputJsonValue;
    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: { curationMeta },
    });
  }

  console.log("\n## By board and original type (active rows)\n");
  console.log("| board | original type | relabel as MCQ | left for decision | keep label | visible relabel | visible left | visible keep |");
  console.log("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  const keys = [...byKey.keys()].sort();
  const totals = emptyBucket();
  for (const key of keys) {
    const bucket = byKey.get(key)!;
    if (bucket.relabel === 0 && bucket.leave === 0 && bucket.visibleKeep === 0) continue;
    const [fieldId, itemType] = key.split("\t");
    console.log(
      `| ${fieldId} | ${itemType} | ${bucket.relabel} | ${bucket.leave} | ${bucket.keep} | ${bucket.visibleRelabel} | ${bucket.visibleLeave} | ${bucket.visibleKeep} |`
    );
    totals.relabel += bucket.relabel;
    totals.leave += bucket.leave;
    totals.keep += bucket.keep;
    totals.visibleRelabel += bucket.visibleRelabel;
    totals.visibleLeave += bucket.visibleLeave;
    totals.visibleKeep += bucket.visibleKeep;
  }
  console.log(
    `| TOTAL shown |  | ${totals.relabel} | ${totals.leave} | ${totals.keep} | ${totals.visibleRelabel} | ${totals.visibleLeave} | ${totals.visibleKeep} |`
  );
  console.log(`\nmeta writes ${args.apply ? "applied" : "planned"}: ${writes}`);
  console.log("Practice exams are not read or written by this script.");

  console.log("\n## Visible items left for decision\n");
  if (visibleLeave.length === 0) console.log("(none)");
  else visibleLeave.forEach((line) => console.log(`- ${line}`));

  console.log("\n## SQL vs TypeScript relabel ids (active, qaPassed)\n");
  const sqlRows = (await sqlQuery(
    `
    SELECT id
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND ${EFFECTIVE_MCQ_SQL}
    `,
    []
  )) as Array<{ id: string }>;
  const sqlIds = new Set(sqlRows.map((row) => row.id));
  let onlyTs = 0;
  let onlySql = 0;
  const tsSample: string[] = [];
  const sqlSample: string[] = [];
  for (const id of tsRelabel) {
    if (!sqlIds.has(id)) {
      onlyTs += 1;
      if (tsSample.length < 8) tsSample.push(id);
    }
  }
  for (const id of sqlIds) {
    if (!tsRelabel.has(id)) {
      onlySql += 1;
      if (sqlSample.length < 8) sqlSample.push(id);
    }
  }
  console.log(`| ts relabel | sql relabel | only ts | only sql |`);
  console.log(`| ---: | ---: | ---: | ---: |`);
  console.log(`| ${tsRelabel.size} | ${sqlIds.size} | ${onlyTs} | ${onlySql} |`);
  if (tsSample.length) console.log(`only ts: ${tsSample.join(", ")}`);
  if (sqlSample.length) console.log(`only sql: ${sqlSample.join(", ")}`);

  if (!args.apply) console.log("\nNo rows written.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
