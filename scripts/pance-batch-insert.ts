#!/usr/bin/env node
/**
 * Insert a JSON batch of PANCE rows into QuestionBankItem.
 *
 * Dry-run is the default. The inserts run inside a transaction that is
 * rolled back, so a clean dry-run leaves the table unchanged. Pass --apply
 * to commit the same insert.
 *
 * Live policy for an approved batch:
 *   source = generated
 *   reviewStatus = approved
 *   qaPassed = true
 *   active = true
 *   patientAgeGroup = null
 *   updatedAt = now
 *
 * A row is skipped when its lead-in stem (QuestionBankItem.question, trimmed
 * and lowercased) already exists on a pance row, or when its content hash
 * already exists. contentHash is bankItemContentHash(fieldId, subjectId,
 * scenario, question) — the same digest the rest of the bank uses.
 *
 * Usage:
 *   npx tsx scripts/pance-batch-insert.ts <file.json>
 *   npx tsx scripts/pance-batch-insert.ts <file.json> --expect-live 2856
 *   npx tsx scripts/pance-batch-insert.ts <file.json> --apply --expect-live 2856
 *   npx tsx scripts/pance-batch-insert.ts <file.json> --label batch1-80 --expect-live 2876
 *
 * --label writes a separate backup, report, and undo manifest so a later
 * batch does not replace an earlier batch's files.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank-guard";
import { PANCE_TASK_AREAS } from "../src/lib/exam-prep/pance/content-outline";
import { PANCE_SUBJECTS } from "../src/lib/subjects/pance/subjects";

const FIELD_ID = "pance";
const SOURCE = "generated";
const REVIEW_STATUS = "approved";
const DATA_DIR = path.join(process.cwd(), "scripts/data/pance-batch-insert");

const VALID_SUBJECTS = new Set(PANCE_SUBJECTS.map((subject) => subject.id));
const VALID_TASKS = new Set<string>(PANCE_TASK_AREAS.map((task) => task.id));

const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

function isDryRunRollback(error: unknown): boolean {
  if (error instanceof DryRunRollback || (error instanceof Error && error.name === "DryRunRollback")) {
    return true;
  }
  if (error && typeof error === "object" && "cause" in error) {
    return isDryRunRollback((error as { cause?: unknown }).cause);
  }
  return false;
}

type InputRow = {
  fieldId?: unknown;
  subjectId?: unknown;
  itemType?: unknown;
  scenario?: unknown;
  question?: unknown;
  options?: unknown;
  correctAnswer?: unknown;
  explanation?: unknown;
  solutionSteps?: unknown;
  tags?: unknown;
  difficulty?: unknown;
  topicCategory?: unknown;
  blueprintDomain?: unknown;
  taskCategory?: unknown;
  blueprintTopic?: unknown;
  references?: unknown;
  generationVersion?: unknown;
  contentHash?: unknown;
};

type ValidationError = { index: number; message: string };

type PlannedRow = {
  index: number;
  blueprintTopic: string | null;
  question: string;
  stemKey: string;
  contentHash: string;
  inputContentHash: string;
  data: Prisma.QuestionBankItemCreateInput;
};

type Duplicate = {
  index: number;
  blueprintTopic: string | null;
  reason: "stem" | "contentHash";
  existingId: string;
};

type Counts = {
  total: number;
  live: number;
  activeNotQa: number;
  inactive: number;
};

type IdRow = {
  id: string;
  active: boolean;
  qaPassed: boolean;
  reviewStatus: string | null;
};

function displayPath(file: string): string {
  const relative = path.relative(process.cwd(), path.resolve(file));
  return relative.startsWith("..") || path.isAbsolute(relative) ? path.resolve(file) : relative;
}

function reportPathFor(apply: boolean, label?: string): string {
  const base = apply ? "apply-report" : "dry-run-report";
  return path.join(DATA_DIR, label ? `${base}-${label}.json` : `${base}.json`);
}

function parseArgs(argv: string[]) {
  let file: string | undefined;
  let apply = false;
  let dryRunFlag = false;
  let expectLive: number | undefined;
  let label: string | undefined;
  let backupPath = path.join(DATA_DIR, "pance-pre-insert-backup.json");
  let manifestPath = path.join(DATA_DIR, "inserted-ids.json");
  let backupSet = false;
  let manifestSet = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--apply") apply = true;
    else if (arg === "--dry-run") dryRunFlag = true;
    else if (arg === "--expect-live") {
      const raw = argv[++i];
      const value = Number(raw);
      if (!raw || !Number.isInteger(value) || value < 0) {
        throw new Error("--expect-live needs a non-negative integer.");
      }
      expectLive = value;
    } else if (arg === "--label") {
      const value = argv[++i];
      if (!value || !/^[a-z0-9][a-z0-9-]*$/.test(value)) {
        throw new Error("--label needs a lowercase slug.");
      }
      label = value;
    } else if (arg === "--backup") {
      const value = argv[++i];
      if (!value) throw new Error("--backup needs a file path.");
      backupPath = value;
      backupSet = true;
    } else if (arg === "--manifest") {
      const value = argv[++i];
      if (!value) throw new Error("--manifest needs a file path.");
      manifestPath = value;
      manifestSet = true;
    } else if (arg?.startsWith("-")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else if (!file) {
      file = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg ?? ""}`);
    }
  }

  if (!file) throw new Error("Input JSON path is required.");
  if (apply && dryRunFlag) throw new Error("Pass either --apply or --dry-run, not both.");
  if (label && !backupSet) backupPath = path.join(DATA_DIR, `pance-pre-insert-backup-${label}.json`);
  if (label && !manifestSet) manifestPath = path.join(DATA_DIR, `inserted-ids-${label}.json`);
  return { file, apply, expectLive, backupPath, manifestPath, label };
}

function stemKey(question: string): string {
  return question.trim().toLowerCase();
}

function asNullableString(value: unknown, label: string, errors: string[]): string | null {
  if (value == null) return null;
  if (typeof value !== "string") {
    errors.push(`${label} must be a string or null.`);
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? value : null;
}

function validateRow(raw: unknown, index: number): { errors: string[]; planned?: PlannedRow } {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { errors: ["Row is not an object."] };
  }
  const row = raw as InputRow;

  if (row.fieldId !== FIELD_ID) errors.push(`fieldId must be '${FIELD_ID}'.`);
  if (typeof row.subjectId !== "string" || !VALID_SUBJECTS.has(row.subjectId)) {
    errors.push("subjectId is not a PANCE content category.");
  }
  if (typeof row.itemType !== "string" || row.itemType.trim().length === 0) {
    errors.push("itemType is required.");
  }
  if (typeof row.scenario !== "string" || row.scenario.trim().length === 0) {
    errors.push("scenario (vignette) is required.");
  }
  if (typeof row.question !== "string" || row.question.trim().length === 0) {
    errors.push("question stem is required.");
  }
  if (typeof row.correctAnswer !== "string" || row.correctAnswer.trim().length === 0) {
    errors.push("correctAnswer is required.");
  }
  if (typeof row.explanation !== "string" || row.explanation.trim().length === 0) {
    errors.push("explanation is required.");
  }
  if (row.solutionSteps != null && typeof row.solutionSteps !== "string") {
    errors.push("solutionSteps must be a string or null.");
  }
  if (row.tags != null) {
    if (typeof row.tags !== "string") errors.push("tags must be a string or null.");
    else {
      try {
        const parsed = JSON.parse(row.tags) as unknown;
        if (!Array.isArray(parsed) || parsed.some((tag) => typeof tag !== "string")) {
          errors.push("tags must be a JSON array of strings.");
        }
      } catch {
        errors.push("tags must be a JSON array of strings.");
      }
    }
  }
  if (row.difficulty != null) {
    if (typeof row.difficulty !== "number" || !Number.isInteger(row.difficulty) || row.difficulty < 1 || row.difficulty > 5) {
      errors.push("difficulty must be an integer from 1 to 5, or null.");
    }
  }
  for (const key of ["topicCategory", "blueprintDomain"] as const) {
    const value = row[key];
    if (value != null && (typeof value !== "string" || !VALID_SUBJECTS.has(value))) {
      errors.push(`${key} is not a PANCE content category.`);
    }
  }
  if (row.taskCategory != null && (typeof row.taskCategory !== "string" || !VALID_TASKS.has(row.taskCategory))) {
    errors.push("taskCategory is not a PANCE task area.");
  }
  if (row.blueprintTopic != null && typeof row.blueprintTopic !== "string") {
    errors.push("blueprintTopic must be a string or null.");
  }
  if (row.generationVersion != null && typeof row.generationVersion !== "string") {
    errors.push("generationVersion must be a string or null.");
  }
  if (typeof row.contentHash !== "string" || !/^[a-f0-9]{64}$/.test(row.contentHash)) {
    errors.push("contentHash must be a 64-character hex string.");
  }
  if (typeof row.options !== "string") {
    errors.push("options must be the stored JSON string.");
  } else {
    try {
      const parsed = JSON.parse(row.options) as unknown;
      const options =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? (parsed as { options?: unknown }).options
          : undefined;
      if (!Array.isArray(options) || options.length < 2 || options.some((option) => typeof option !== "string" || option.trim().length === 0)) {
        errors.push("options JSON must include at least two non-empty option strings.");
      } else if (new Set(options).size !== options.length) {
        errors.push("options must be unique.");
      } else if (typeof row.correctAnswer === "string" && !options.includes(row.correctAnswer)) {
        errors.push("correctAnswer is not one of the options.");
      }
    } catch {
      errors.push("options is not valid JSON.");
    }
  }

  let references: Prisma.InputJsonValue | undefined;
  if (row.references != null) {
    if (!Array.isArray(row.references)) errors.push("references must be an array or null.");
    else {
      for (const reference of row.references) {
        if (!reference || typeof reference !== "object" || Array.isArray(reference)) {
          errors.push("each reference must be an object with url and label.");
          break;
        }
        const record = reference as { url?: unknown; label?: unknown };
        if (typeof record.url !== "string" || !/^https?:\/\//.test(record.url)) {
          errors.push("each reference url must be an http(s) URL.");
          break;
        }
        if (typeof record.label !== "string" || record.label.trim().length === 0) {
          errors.push("each reference label must be a non-empty string.");
          break;
        }
      }
      references = row.references as Prisma.InputJsonValue;
    }
  }

  if (errors.length > 0 || typeof row.subjectId !== "string" || typeof row.question !== "string" || typeof row.scenario !== "string") {
    return { errors };
  }

  const contentHash = bankItemContentHash(FIELD_ID, row.subjectId, {
    question: row.question,
    scenario: row.scenario,
  });
  const now = new Date();
  const blueprintTopic = asNullableString(row.blueprintTopic, "blueprintTopic", errors);

  return {
    errors,
    planned: {
      index,
      blueprintTopic,
      question: row.question,
      stemKey: stemKey(row.question),
      contentHash,
      inputContentHash: typeof row.contentHash === "string" ? row.contentHash : "",
      data: {
        fieldId: FIELD_ID,
        subjectId: row.subjectId,
        stateCode: null,
        difficulty: typeof row.difficulty === "number" ? row.difficulty : null,
        topicCategory: typeof row.topicCategory === "string" ? row.topicCategory : null,
        blueprintDomain: typeof row.blueprintDomain === "string" ? row.blueprintDomain : null,
        taskCategory: typeof row.taskCategory === "string" ? row.taskCategory : null,
        blueprintTopic,
        clientNeeds: null,
        cjmmFunction: null,
        patientAgeGroup: null,
        generationVersion: typeof row.generationVersion === "string" ? row.generationVersion : null,
        reviewStatus: REVIEW_STATUS,
        lastReviewedAt: now,
        itemType: typeof row.itemType === "string" ? row.itemType : "vignette",
        stepLevel: null,
        scenario: row.scenario,
        question: row.question,
        options: row.options as string,
        correctAnswer: row.correctAnswer as string,
        explanation: row.explanation as string,
        solutionSteps: typeof row.solutionSteps === "string" ? row.solutionSteps : null,
        tags: typeof row.tags === "string" ? row.tags : null,
        references,
        source: SOURCE,
        contentHash,
        active: true,
        manualCorrection: false,
        qaPassed: true,
        qaAuditedAt: now,
        updatedAt: now,
      },
    },
  };
}

function loadRows(file: string): { rows: unknown[]; errors: ValidationError[] } {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
  if (!Array.isArray(parsed)) throw new Error("Input JSON must be an array.");
  return { rows: parsed, errors: [] };
}

async function readCounts(): Promise<Counts> {
  const rows = await prisma.$queryRaw<Counts[]>`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE active AND "qaPassed")::int AS live,
      COUNT(*) FILTER (WHERE active AND NOT "qaPassed")::int AS "activeNotQa",
      COUNT(*) FILTER (WHERE NOT active)::int AS inactive
    FROM "QuestionBankItem"
    WHERE "fieldId" = ${FIELD_ID}
  `;
  const counts = rows[0];
  if (!counts) throw new Error("PANCE count query returned no row.");
  return counts;
}

async function writeBackup(backupPath: string, counts: Counts): Promise<number> {
  const ids = await prisma.$queryRaw<IdRow[]>`
    SELECT id, active, "qaPassed", "reviewStatus"
    FROM "QuestionBankItem"
    WHERE "fieldId" = ${FIELD_ID}
    ORDER BY id
  `;
  const liveIds = ids.filter((row) => row.active && row.qaPassed).map((row) => row.id);
  mkdirSync(path.dirname(backupPath), { recursive: true });
  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        fieldId: FIELD_ID,
        liveDefinition: "active AND qaPassed",
        counts,
        liveCount: liveIds.length,
        liveIds,
        rows: ids,
      },
      null,
      2
    )
  );
  return liveIds.length;
}

async function findConflicts(planned: PlannedRow[]): Promise<Duplicate[]> {
  const stems = [...new Set(planned.map((row) => row.stemKey))];
  const hashes = [...new Set(planned.map((row) => row.contentHash))];
  const hits = await prisma.$queryRaw<Array<{ id: string; stem: string; hash: string }>>`
    SELECT id,
           lower(btrim(question)) AS stem,
           "contentHash" AS hash
    FROM "QuestionBankItem"
    WHERE "contentHash" IN (${Prisma.join(hashes)})
       OR ("fieldId" = ${FIELD_ID} AND lower(btrim(question)) IN (${Prisma.join(stems)}))
  `;
  const stemIds = new Map<string, string[]>();
  const hashIds = new Map<string, string>();
  for (const hit of hits) {
    const list = stemIds.get(hit.stem) ?? [];
    list.push(hit.id);
    stemIds.set(hit.stem, list);
    hashIds.set(hit.hash, hit.id);
  }

  const duplicates: Duplicate[] = [];
  for (const row of planned) {
    const existingStem = stemIds.get(row.stemKey)?.[0];
    if (existingStem) {
      duplicates.push({
        index: row.index,
        blueprintTopic: row.blueprintTopic,
        reason: "stem",
        existingId: existingStem,
      });
    }
    const existingHash = hashIds.get(row.contentHash);
    if (existingHash) {
      duplicates.push({
        index: row.index,
        blueprintTopic: row.blueprintTopic,
        reason: "contentHash",
        existingId: existingHash,
      });
    }
  }
  return duplicates;
}

function sharedLeadIns(planned: PlannedRow[]): Array<{ stem: string; topics: Array<string | null> }> {
  const groups = new Map<string, PlannedRow[]>();
  for (const row of planned) {
    const list = groups.get(row.stemKey) ?? [];
    list.push(row);
    groups.set(row.stemKey, list);
  }
  return [...groups.values()]
    .filter((group) => group.length > 1)
    .map((group) => ({
      stem: group[0]!.question.trim(),
      topics: group.map((row) => row.blueprintTopic),
    }));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = displayPath(args.file);
  const backupPath = displayPath(args.backupPath);
  const manifestPath = displayPath(args.manifestPath);
  const { rows } = loadRows(inputPath);
  const validationErrors: ValidationError[] = [];
  const planned: PlannedRow[] = [];
  const seenHash = new Map<string, number>();
  const seenFull = new Map<string, number>();

  rows.forEach((raw, index) => {
    const result = validateRow(raw, index);
    for (const message of result.errors) validationErrors.push({ index, message });
    if (!result.planned || result.errors.length > 0) return;
    const priorHash = seenHash.get(result.planned.contentHash);
    if (priorHash != null) {
      validationErrors.push({
        index,
        message: `content hash duplicates row ${priorHash} in this file.`,
      });
      return;
    }
    const fullKey = `${result.planned.data.scenario ?? ""}\n${result.planned.stemKey}`;
    const priorFull = seenFull.get(fullKey);
    if (priorFull != null) {
      validationErrors.push({
        index,
        message: `scenario and stem duplicate row ${priorFull} in this file.`,
      });
      return;
    }
    seenHash.set(result.planned.contentHash, index);
    seenFull.set(fullKey, index);
    planned.push(result.planned);
  });

  const before = await readCounts();
  const liveIds = await writeBackup(backupPath, before);
  if (liveIds !== before.live) {
    throw new Error(`Backup live ids ${liveIds} do not match live count ${before.live}.`);
  }

  const duplicates =
    validationErrors.length === 0 && planned.length > 0 ? await findConflicts(planned) : [];
  const duplicateIndexes = new Set(duplicates.map((duplicate) => duplicate.index));
  const wouldInsert = planned.filter((row) => !duplicateIndexes.has(row.index));
  const hashMismatches = planned.filter((row) => row.inputContentHash !== row.contentHash).length;
  const notes = sharedLeadIns(planned);
  const blocked = validationErrors.length > 0 || duplicates.length > 0;
  if (args.expectLive != null && before.live !== args.expectLive) {
    throw new Error(`Live pance count is ${before.live}, expected ${args.expectLive}. No rows written.`);
  }

  const report: Record<string, unknown> = {
    mode: args.apply ? "apply" : "dry-run",
    inputFile: inputPath,
    rowsInFile: rows.length,
    validationErrors,
    duplicates,
    wouldInsert: wouldInsert.map((row) => ({
      index: row.index,
      blueprintTopic: row.blueprintTopic,
      contentHash: row.contentHash,
      stem: row.question.trim(),
    })),
    sharedLeadInsInBatch: notes,
    inputContentHashRecomputed: hashMismatches,
    schemaErrors: [] as string[],
    countsBefore: before,
    liveAfterInTransaction: null as number | null,
    liveAfter: null as number | null,
    insertedIds: [] as string[],
    backup: backupPath,
  };

  const printReport = () => {
    console.log(args.apply ? "PANCE batch insert — APPLY" : "PANCE batch insert — DRY RUN");
    console.log(`input: ${inputPath}`);
    console.log(`rows in file: ${rows.length}`);
    console.log(`validation errors: ${validationErrors.length}`);
    console.log(`duplicates: ${duplicates.length}`);
    console.log(`would insert: ${wouldInsert.length}`);
    console.log(`schema errors: ${(report.schemaErrors as string[]).length}`);
    console.log(`live before: ${before.live} (total pance ${before.total})`);
    console.log(`live after in transaction: ${report.liveAfterInTransaction ?? "(not run)"}`);
    console.log(`live after: ${report.liveAfter ?? "(not run)"}`);
    console.log(`input content hashes recomputed with bankItemContentHash: ${hashMismatches}`);
    if (notes.length > 0) {
      console.log("shared lead-ins inside this file (different vignettes, not existing-bank duplicates):");
      for (const note of notes) console.log(`  ${JSON.stringify(note.stem)} -> ${note.topics.join(", ")}`);
    }
    for (const error of validationErrors) console.log(`ERROR row ${error.index}: ${error.message}`);
    for (const duplicate of duplicates) {
      console.log(`DUPLICATE row ${duplicate.index} ${duplicate.reason} existing ${duplicate.existingId} ${duplicate.blueprintTopic ?? ""}`);
    }
    for (const row of wouldInsert) console.log(`INSERT ${row.index} ${row.blueprintTopic ?? "(no topic)"} ${row.contentHash}`);
    for (const schemaError of report.schemaErrors as string[]) console.log(`SCHEMA ${schemaError}`);
  };

  if (blocked) {
    report.liveAfter = before.live;
    printReport();
    console.log("Stopped. No rows written.");
    const reportPath = reportPathFor(args.apply, args.label);
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`report: ${reportPath}`);
    console.log(`backup: ${backupPath}`);
    process.exitCode = 1;
    return;
  }

  const inserted: Array<{ id: string; contentHash: string; question: string; blueprintTopic: string | null }> = [];
  try {
    await prisma.$transaction(
      async (tx) => {
        const now = new Date();
        for (const row of wouldInsert) {
          const created = await tx.questionBankItem.create({
            data: {
              ...row.data,
              updatedAt: now,
              lastReviewedAt: now,
              qaAuditedAt: now,
            },
            select: { id: true },
          });
          inserted.push({
            id: created.id,
            contentHash: row.contentHash,
            question: row.question,
            blueprintTopic: row.blueprintTopic,
          });
        }
        const afterRows = await tx.$queryRaw<Array<{ live: number }>>`
          SELECT COUNT(*) FILTER (WHERE active AND "qaPassed")::int AS live
          FROM "QuestionBankItem"
          WHERE "fieldId" = ${FIELD_ID}
        `;
        const live = afterRows[0]?.live;
        if (live == null) throw new Error("In-transaction live count query returned no row.");
        report.liveAfterInTransaction = live;
        if (live !== before.live + wouldInsert.length) {
          throw new Error(`In-transaction live count is ${live}, expected ${before.live + wouldInsert.length}.`);
        }
        if (!args.apply) throw new DryRunRollback();
      },
      { timeout: 120_000, maxWait: 30_000 }
    );
  } catch (error) {
    if (!isDryRunRollback(error)) {
      const message = error instanceof Error ? error.message : String(error);
      (report.schemaErrors as string[]).push(message);
      const afterFailure = await readCounts();
      report.liveAfter = afterFailure.live;
      printReport();
      console.log("Insert failed and the transaction was rolled back. No rows kept.");
      const reportPath = reportPathFor(args.apply, args.label);
      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`report: ${reportPath}`);
      process.exitCode = 1;
      return;
    }
  }

  const after = await readCounts();
  report.liveAfter = after.live;
  report.insertedIds = inserted.map((row) => row.id);

  if (!args.apply) {
    const leftover = await prisma.questionBankItem.count({
      where: { id: { in: inserted.map((row) => row.id) } },
    });
    if (after.live !== before.live || leftover !== 0) {
      throw new Error(
        `Dry-run rollback failed. Live ${before.live} -> ${after.live}, leftover ids ${leftover}.`
      );
    }
    printReport();
    console.log("Dry run rolled back. No rows kept.");
    const reportPath = reportPathFor(false, args.label);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`report: ${reportPath}`);
    console.log(`backup: ${backupPath}`);
    return;
  }

  if (after.live !== before.live + inserted.length) {
    throw new Error(`Live count is ${after.live} after commit, expected ${before.live + inserted.length}.`);
  }
  const verified = await prisma.questionBankItem.findMany({
    where: { id: { in: inserted.map((row) => row.id) } },
    select: {
      id: true,
      fieldId: true,
      source: true,
      reviewStatus: true,
      qaPassed: true,
      active: true,
      patientAgeGroup: true,
      contentHash: true,
    },
  });
  if (verified.length !== inserted.length) {
    throw new Error(`Verify found ${verified.length} inserted rows, expected ${inserted.length}.`);
  }
  const bad = verified.filter(
    (row) =>
      row.fieldId !== FIELD_ID ||
      row.source !== SOURCE ||
      row.reviewStatus !== REVIEW_STATUS ||
      row.qaPassed !== true ||
      row.active !== true ||
      row.patientAgeGroup !== null
  );
  if (bad.length > 0) {
    throw new Error(`${bad.length} inserted rows do not match the live policy.`);
  }

  const manifest = {
    appliedAt: new Date().toISOString(),
    inputFile: inputPath,
    fieldId: FIELD_ID,
    source: SOURCE,
    reviewStatus: REVIEW_STATUS,
    liveBefore: before.live,
    liveAfter: after.live,
    rows: inserted.map((row) => ({
      id: row.id,
      fieldId: FIELD_ID,
      contentHash: row.contentHash,
      question: row.question,
      blueprintTopic: row.blueprintTopic,
      source: SOURCE,
    })),
  };
  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  printReport();
  console.log(`Inserted ${inserted.length} rows.`);
  console.log(`manifest: ${manifestPath}`);
  const reportPath = reportPathFor(true, args.label);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`report: ${reportPath}`);
  console.log(`backup: ${backupPath}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
