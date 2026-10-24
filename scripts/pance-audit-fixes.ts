#!/usr/bin/env node
/**
 * Apply text fixes to existing live PANCE QuestionBankItem rows.
 *
 * Does not insert or delete. Dry-run is the default: updates run inside a
 * transaction that is rolled back. Pass --apply to commit the same updates.
 *
 * Each fix is matched by its source-file contentHash (the fingerprint) to the
 * batch file that was inserted, then to the live row by bankItemContentHash
 * of that source scenario and question. A fix that does not match exactly is
 * skipped. --apply refuses unless every fix matches and each resulting row
 * has 5 options, the key among those options, and an explanation of at most
 * 1000 characters.
 *
 * Usage:
 *   npx tsx scripts/pance-audit-fixes.ts scripts/data/pance-batch-insert/audit-fixes.json
 *   npx tsx scripts/pance-audit-fixes.ts scripts/data/pance-batch-insert/audit-fixes.json --apply --expect-live 3795
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank-guard";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import { assessStudentEligibility } from "../src/lib/exam-prep/student-eligibility";

const FIELD_ID = "pance";
const DATA_DIR = path.join(process.cwd(), "scripts/data/pance-batch-insert");
const EXPECTED_OPTIONS = 5;
const MAX_EXPLANATION = 1000;

const SOURCE_FILES: Array<[string, string]> = [
  ["pilot", "final-20.json"],
  ["1", "batch1-80.json"],
  ["2", "batch2-80.json"],
  ["3", "batch3-80.json"],
  ["4", "batch4-80.json"],
  ["5", "batch5-80.json"],
  ["6", "batch6-79.json"],
  ["7", "batch7-80.json"],
  ["8", "batch8-80.json"],
  ["9", "batch9-80.json"],
  ["10", "batch10-80.json"],
  ["11", "batch11-80.json"],
  ["12", "batch12-40.json"],
];

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

function displayPath(file: string): string {
  const relative = path.relative(process.cwd(), file);
  return relative.startsWith("..") ? file : relative;
}

type FixEntry = {
  batch: string | number;
  itemId: string;
  contentHash: string;
  subjectId: string;
  taskCategory: string;
  originalQuestion: string;
  fixTypes: string[];
  changedFields: Record<string, unknown>;
};

type SourceRow = {
  batchKey: string;
  index: number;
  subjectId: string;
  taskCategory: string | null;
  scenario: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  fingerprint: string;
};

type BankRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  taskCategory: string | null;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: Prisma.JsonValue;
  tags: string | null;
  difficulty: number | null;
  contentHash: string;
  manualCorrection: boolean;
  active: boolean;
  qaPassed: boolean;
  reviewStatus: string | null;
  source: string;
  patientAgeGroup: string | null;
  itemType: string;
};

type PlannedUpdate = {
  fix: FixEntry;
  source: SourceRow;
  bank: BankRow;
  data: Prisma.QuestionBankItemUpdateInput;
  next: {
    scenario: string | null;
    question: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    contentHash: string;
  };
};

function parseArgs(argv: string[]) {
  let file: string | undefined;
  let apply = false;
  let expectLive: number | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--apply") apply = true;
    else if (arg === "--dry-run") apply = false;
    else if (arg === "--expect-live") {
      const value = Number(argv[++i]);
      if (!Number.isInteger(value) || value < 0) throw new Error("--expect-live needs a non-negative integer.");
      expectLive = value;
    } else if (!arg.startsWith("--") && !file) file = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!file) throw new Error("Pass the fixes JSON file.");
  return { file, apply, expectLive };
}

function loadFixes(file: string): FixEntry[] {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
  if (!Array.isArray(parsed)) throw new Error("Fixes JSON must be an array.");
  return parsed as FixEntry[];
}

function loadSources(): Map<string, SourceRow> {
  const byFingerprint = new Map<string, SourceRow>();
  for (const [batchKey, name] of SOURCE_FILES) {
    const rows = JSON.parse(readFileSync(path.join(DATA_DIR, name), "utf8")) as Array<Record<string, unknown>>;
    rows.forEach((row, index) => {
      const fingerprint = row.contentHash;
      if (typeof fingerprint !== "string") return;
      const source: SourceRow = {
        batchKey,
        index,
        subjectId: String(row.subjectId ?? ""),
        taskCategory: typeof row.taskCategory === "string" ? row.taskCategory : null,
        scenario: typeof row.scenario === "string" ? row.scenario : "",
        question: typeof row.question === "string" ? row.question : "",
        options: typeof row.options === "string" ? row.options : "",
        correctAnswer: typeof row.correctAnswer === "string" ? row.correctAnswer : "",
        explanation: typeof row.explanation === "string" ? row.explanation : "",
        fingerprint,
      };
      const prior = byFingerprint.get(fingerprint);
      if (prior) {
        throw new Error(`Fingerprint ${fingerprint} is in both ${prior.batchKey} and ${batchKey}.`);
      }
      byFingerprint.set(fingerprint, source);
    });
  }
  return byFingerprint;
}

function optionList(raw: string): string[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const arr = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { options?: unknown }).options)
      ? (parsed as { options: unknown[] }).options
      : null;
  if (!arr || arr.some((option) => typeof option !== "string" || option.trim().length === 0)) return null;
  return arr as string[];
}

function asReferences(value: unknown): Prisma.InputJsonValue | null {
  if (!Array.isArray(value)) return null;
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const record = entry as { url?: unknown; label?: unknown };
    if (typeof record.url !== "string" || !/^https?:\/\//.test(record.url)) return null;
    if (typeof record.label !== "string" || record.label.trim().length === 0) return null;
  }
  return value as Prisma.InputJsonValue;
}

const prisma = new PrismaClient();

async function readCounts(): Promise<{ live: number; eligible: number; total: number }> {
  const eligibleSql = studentEligibleAndSql();
  const rows = await prisma.$queryRawUnsafe<Array<{ live: number; eligible: number; total: number }>>(`
    SELECT
      COUNT(*) FILTER (WHERE active AND "qaPassed")::int AS live,
      COUNT(*) FILTER (WHERE active AND "qaPassed" ${eligibleSql})::int AS eligible,
      COUNT(*)::int AS total
    FROM "QuestionBankItem"
    WHERE "fieldId" = '${FIELD_ID}'
  `);
  const row = rows[0];
  if (!row) throw new Error("PANCE count query returned no row.");
  return row;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = displayPath(path.resolve(args.file));
  const fixes = loadFixes(args.file);
  const sources = loadSources();
  const skips: Array<{ itemId: string; fingerprint: string; reason: string }> = [];
  const notes: string[] = [];
  const resolved: Array<{ fix: FixEntry; source: SourceRow; repoHash: string }> = [];
  const seenFingerprint = new Set<string>();

  for (const fix of fixes) {
    if (seenFingerprint.has(fix.contentHash)) {
      skips.push({ itemId: fix.itemId, fingerprint: fix.contentHash, reason: "duplicate fingerprint in the fixes file" });
      continue;
    }
    seenFingerprint.add(fix.contentHash);
    const source = sources.get(fix.contentHash);
    if (!source) {
      skips.push({ itemId: fix.itemId, fingerprint: fix.contentHash, reason: "fingerprint not in an inserted PANCE batch file" });
      continue;
    }
    if (source.question !== fix.originalQuestion) {
      skips.push({ itemId: fix.itemId, fingerprint: fix.contentHash, reason: "originalQuestion does not match the source item" });
      continue;
    }
    if (source.subjectId !== fix.subjectId) {
      skips.push({ itemId: fix.itemId, fingerprint: fix.contentHash, reason: "subjectId does not match the source item" });
      continue;
    }
    if (source.taskCategory !== fix.taskCategory) {
      skips.push({ itemId: fix.itemId, fingerprint: fix.contentHash, reason: "taskCategory does not match the source item" });
      continue;
    }
    const batchKey = String(fix.batch);
    if (batchKey !== source.batchKey) {
      skips.push({ itemId: fix.itemId, fingerprint: fix.contentHash, reason: `batch ${batchKey} does not match source batch ${source.batchKey}` });
      continue;
    }
    const idMatch = /^(?:pilot|b\d+)-q(\d+)$/.exec(fix.itemId);
    if (!idMatch || Number(idMatch[1]) !== source.index + 1) {
      notes.push(
        `${fix.itemId} index is ${idMatch?.[1] ?? "unparsed"}; inserted ${source.batchKey} file position is ${source.index + 1}. Fingerprint matched.`
      );
    }
    resolved.push({
      fix,
      source,
      repoHash: bankItemContentHash(FIELD_ID, source.subjectId, {
        question: source.question,
        scenario: source.scenario,
      }),
    });
  }

  const bankRows = await prisma.questionBankItem.findMany({
    where: { fieldId: FIELD_ID, contentHash: { in: resolved.map((row) => row.repoHash) } },
    select: {
      id: true,
      fieldId: true,
      subjectId: true,
      taskCategory: true,
      scenario: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      references: true,
      tags: true,
      difficulty: true,
      contentHash: true,
      manualCorrection: true,
      active: true,
      qaPassed: true,
      reviewStatus: true,
      source: true,
      patientAgeGroup: true,
      itemType: true,
    },
  });
  const bankByHash = new Map(bankRows.map((row) => [row.contentHash, row]));
  const planned: PlannedUpdate[] = [];
  const validationErrors: string[] = [];

  for (const row of resolved) {
    const bank = bankByHash.get(row.repoHash);
    if (!bank) {
      skips.push({ itemId: row.fix.itemId, fingerprint: row.fix.contentHash, reason: "no pance row with the repo contentHash" });
      continue;
    }
    if (bank.question !== row.fix.originalQuestion || bank.subjectId !== row.fix.subjectId) {
      skips.push({ itemId: row.fix.itemId, fingerprint: row.fix.contentHash, reason: "live row question or subjectId does not match the fingerprint" });
      continue;
    }
    if (!bank.active || !bank.qaPassed) {
      skips.push({ itemId: row.fix.itemId, fingerprint: row.fix.contentHash, reason: "matched row is not live (active and qaPassed)" });
      continue;
    }

    const changed = row.fix.changedFields;
    const nextQuestion = typeof changed.question === "string" ? changed.question : bank.question;
    const nextScenario = typeof changed.scenario === "string" ? changed.scenario : bank.scenario;
    const nextOptions = typeof changed.options === "string" ? changed.options : bank.options;
    const nextAnswer = typeof changed.correctAnswer === "string" ? changed.correctAnswer : bank.correctAnswer;
    const nextExplanation = typeof changed.explanation === "string" ? changed.explanation : bank.explanation;
    const options = optionList(nextOptions);
    if (!options || options.length !== EXPECTED_OPTIONS || new Set(options).size !== EXPECTED_OPTIONS) {
      validationErrors.push(`${row.fix.itemId}: options must be ${EXPECTED_OPTIONS} unique non-empty strings.`);
      continue;
    }
    if (!options.includes(nextAnswer)) {
      validationErrors.push(`${row.fix.itemId}: correct answer is not among the options.`);
      continue;
    }
    if (nextExplanation.length === 0 || nextExplanation.length > MAX_EXPLANATION) {
      validationErrors.push(`${row.fix.itemId}: explanation length is ${nextExplanation.length}, limit is ${MAX_EXPLANATION}.`);
      continue;
    }

    const data: Prisma.QuestionBankItemUpdateInput = {
      manualCorrection: true,
      updatedAt: new Date(),
    };
    if (typeof changed.question === "string") data.question = changed.question;
    if (typeof changed.scenario === "string") data.scenario = changed.scenario;
    if (typeof changed.options === "string") data.options = changed.options;
    if (typeof changed.correctAnswer === "string") data.correctAnswer = changed.correctAnswer;
    if (typeof changed.explanation === "string") data.explanation = changed.explanation;
    if ("difficulty" in changed) {
      if (typeof changed.difficulty !== "number" || !Number.isInteger(changed.difficulty) || changed.difficulty < 1 || changed.difficulty > 5) {
        validationErrors.push(`${row.fix.itemId}: difficulty must be an integer from 1 to 5.`);
        continue;
      }
      data.difficulty = changed.difficulty;
    }
    if ("tags" in changed) {
      if (typeof changed.tags !== "string") {
        validationErrors.push(`${row.fix.itemId}: tags must be a string.`);
        continue;
      }
      data.tags = changed.tags;
    }
    if ("references" in changed) {
      const references = asReferences(changed.references);
      if (!references) {
        validationErrors.push(`${row.fix.itemId}: references must be http(s) url and label objects.`);
        continue;
      }
      data.references = references;
    }

    const nextHash = bankItemContentHash(FIELD_ID, bank.subjectId, {
      question: nextQuestion,
      scenario: nextScenario,
    });
    if (nextHash !== bank.contentHash) data.contentHash = nextHash;

    const verdict = assessStudentEligibility({
      id: bank.id,
      fieldId: FIELD_ID,
      active: true,
      qaPassed: true,
      itemType: bank.itemType,
      question: nextQuestion,
      scenario: nextScenario,
      correctAnswer: nextAnswer,
      explanation: nextExplanation,
      optionsRaw: nextOptions,
      curationMeta: null,
    });
    if (!verdict.eligible) {
      validationErrors.push(`${row.fix.itemId}: update would not be student-eligible (${verdict.reasons.join(", ")}).`);
      continue;
    }

    planned.push({
      fix: row.fix,
      source: row.source,
      bank,
      data,
      next: {
        scenario: nextScenario,
        question: nextQuestion,
        options: nextOptions,
        correctAnswer: nextAnswer,
        explanation: nextExplanation,
        contentHash: nextHash,
      },
    });
  }

  const targetIds = new Set<string>();
  const nextHashes = new Map<string, string>();
  for (const update of planned) {
    if (targetIds.has(update.bank.id)) {
      validationErrors.push(`${update.fix.itemId}: two fixes resolve to live id ${update.bank.id}.`);
    }
    targetIds.add(update.bank.id);
    const prior = nextHashes.get(update.next.contentHash);
    if (prior && prior !== update.bank.id) {
      validationErrors.push(`${update.fix.itemId}: contentHash collides with another update.`);
    }
    nextHashes.set(update.next.contentHash, update.bank.id);
  }
  const movedHashes = planned
    .filter((update) => update.next.contentHash !== update.bank.contentHash)
    .map((update) => update.next.contentHash);
  if (movedHashes.length > 0) {
    const collisions = await prisma.questionBankItem.findMany({
      where: { contentHash: { in: movedHashes }, NOT: { id: { in: [...targetIds] } } },
      select: { id: true, contentHash: true },
    });
    for (const collision of collisions) {
      validationErrors.push(`contentHash ${collision.contentHash} already belongs to ${collision.id}.`);
    }
  }

  const before = await readCounts();
  if (args.expectLive != null && before.live !== args.expectLive) {
    throw new Error(`Live pance count is ${before.live}, expected ${args.expectLive}. No rows written.`);
  }
  if (args.expectLive != null && before.eligible !== args.expectLive) {
    throw new Error(`Student-eligible pance count is ${before.eligible}, expected ${args.expectLive}. No rows written.`);
  }

  const blocked = skips.length > 0 || validationErrors.length > 0 || planned.length !== fixes.length;
  const report: Record<string, unknown> = {
    mode: args.apply ? "apply" : "dry-run",
    inputFile: inputPath,
    fixes: fixes.length,
    matched: planned.length,
    skips,
    notes,
    validationErrors,
    hashChanges: planned
      .filter((update) => update.next.contentHash !== update.bank.contentHash)
      .map((update) => ({ itemId: update.fix.itemId, id: update.bank.id })),
    countsBefore: before,
    liveAfterInTransaction: null as number | null,
    eligibleAfterInTransaction: null as number | null,
    liveAfter: null as number | null,
    eligibleAfter: null as number | null,
  };

  console.log(args.apply ? "PANCE audit fixes — APPLY" : "PANCE audit fixes — DRY RUN");
  console.log(`fixes: ${fixes.length}`);
  console.log(`matched: ${planned.length}`);
  console.log(`skips: ${skips.length}`);
  console.log(`validation errors: ${validationErrors.length}`);
  console.log(`hash changes: ${(report.hashChanges as unknown[]).length}`);
  console.log(`live before: ${before.live} (student-eligible ${before.eligible}, total ${before.total})`);
  for (const skip of skips) console.log(`SKIP ${skip.itemId} ${skip.reason}`);
  for (const error of validationErrors) console.log(`ERROR ${error}`);
  for (const note of notes) console.log(`NOTE ${note}`);

  if (blocked) {
    report.liveAfter = before.live;
    report.eligibleAfter = before.eligible;
    const reportPath = path.join(DATA_DIR, args.apply ? "audit-fixes-apply-report.json" : "audit-fixes-dry-run-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log("Stopped. No rows written.");
    console.log(`report: ${displayPath(reportPath)}`);
    process.exitCode = 1;
    return;
  }

  const undo = {
    backedUpAt: new Date().toISOString(),
    fieldId: FIELD_ID,
    inputFile: inputPath,
    liveBefore: before.live,
    eligibleBefore: before.eligible,
    rows: planned.map((update) => ({
      itemId: update.fix.itemId,
      fingerprint: update.fix.contentHash,
      id: update.bank.id,
      fieldId: update.bank.fieldId,
      before: {
        contentHash: update.bank.contentHash,
        scenario: update.bank.scenario,
        question: update.bank.question,
        options: update.bank.options,
        correctAnswer: update.bank.correctAnswer,
        explanation: update.bank.explanation,
        references: update.bank.references,
        tags: update.bank.tags,
        difficulty: update.bank.difficulty,
        manualCorrection: update.bank.manualCorrection,
      },
      afterContentHash: update.next.contentHash,
    })),
  };
  const undoPath = path.join(DATA_DIR, "audit-fixes-undo.json");
  writeFileSync(undoPath, JSON.stringify(undo, null, 2));
  console.log(`backup: ${displayPath(undoPath)} (${undo.rows.length} rows)`);

  const eligibleSql = studentEligibleAndSql();
  try {
    await prisma.$transaction(
      async (tx) => {
        const now = new Date();
        for (const update of planned) {
          await tx.questionBankItem.update({
            where: { id: update.bank.id },
            data: { ...update.data, updatedAt: now },
          });
        }
        const checked = await tx.questionBankItem.findMany({
          where: { id: { in: planned.map((update) => update.bank.id) } },
          select: {
            id: true,
            contentHash: true,
            question: true,
            scenario: true,
            options: true,
            correctAnswer: true,
            explanation: true,
            active: true,
            qaPassed: true,
            fieldId: true,
          },
        });
        const byId = new Map(checked.map((row) => [row.id, row]));
        for (const update of planned) {
          const saved = byId.get(update.bank.id);
          if (!saved || saved.fieldId !== FIELD_ID || !saved.active || !saved.qaPassed) {
            throw new Error(`Updated row ${update.bank.id} failed the live re-read.`);
          }
          if (
            saved.question !== update.next.question ||
            (saved.scenario ?? "") !== (update.next.scenario ?? "") ||
            saved.options !== update.next.options ||
            saved.correctAnswer !== update.next.correctAnswer ||
            saved.explanation !== update.next.explanation ||
            saved.contentHash !== update.next.contentHash
          ) {
            throw new Error(`Updated row ${update.fix.itemId} does not match the planned text.`);
          }
          const savedOptions = optionList(saved.options);
          if (!savedOptions || savedOptions.length !== EXPECTED_OPTIONS || !savedOptions.includes(saved.correctAnswer)) {
            throw new Error(`Updated row ${update.fix.itemId} failed the option check.`);
          }
          if (saved.explanation.length > MAX_EXPLANATION) {
            throw new Error(`Updated row ${update.fix.itemId} explanation is ${saved.explanation.length} characters.`);
          }
        }
        const counts = await tx.$queryRawUnsafe<Array<{ live: number; eligible: number }>>(`
          SELECT
            COUNT(*) FILTER (WHERE active AND "qaPassed")::int AS live,
            COUNT(*) FILTER (WHERE active AND "qaPassed" ${eligibleSql})::int AS eligible
          FROM "QuestionBankItem"
          WHERE "fieldId" = '${FIELD_ID}'
        `);
        const live = counts[0]?.live;
        const eligible = counts[0]?.eligible;
        report.liveAfterInTransaction = live ?? null;
        report.eligibleAfterInTransaction = eligible ?? null;
        if (live !== before.live || eligible !== before.eligible) {
          throw new Error(`In-transaction counts moved to live ${live}, student-eligible ${eligible}.`);
        }
        if (!args.apply) throw new DryRunRollback();
      },
      { timeout: 120_000, maxWait: 30_000 }
    );
  } catch (error) {
    if (!isDryRunRollback(error)) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`SCHEMA ${message}`);
      const afterFailure = await readCounts();
      report.liveAfter = afterFailure.live;
      report.eligibleAfter = afterFailure.eligible;
      const reportPath = path.join(DATA_DIR, args.apply ? "audit-fixes-apply-report.json" : "audit-fixes-dry-run-report.json");
      writeFileSync(reportPath, JSON.stringify({ ...report, schemaError: message }, null, 2));
      console.log("Update failed and the transaction was rolled back. No rows kept.");
      console.log(`report: ${displayPath(reportPath)}`);
      process.exitCode = 1;
      return;
    }
  }

  const after = await readCounts();
  report.liveAfter = after.live;
  report.eligibleAfter = after.eligible;
  console.log(`live after in transaction: ${report.liveAfterInTransaction}`);
  console.log(`student-eligible after in transaction: ${report.eligibleAfterInTransaction}`);
  console.log(`live after: ${after.live} (student-eligible ${after.eligible})`);

  if (!args.apply) {
    if (after.live !== before.live || after.eligible !== before.eligible) {
      throw new Error(`Dry-run rollback failed. Live ${before.live} -> ${after.live}, eligible ${before.eligible} -> ${after.eligible}.`);
    }
    const reportPath = path.join(DATA_DIR, "audit-fixes-dry-run-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log("Dry run rolled back. No rows kept.");
    console.log(`report: ${displayPath(reportPath)}`);
    return;
  }

  if (after.live !== before.live || after.eligible !== before.eligible) {
    throw new Error(`Counts changed after commit. Live ${after.live}, student-eligible ${after.eligible}.`);
  }

  const sample = planned.filter((_, index) => index % Math.floor(planned.length / 10) === 0).slice(0, 10);
  const reread = await prisma.questionBankItem.findMany({
    where: { id: { in: sample.map((update) => update.bank.id) } },
    select: {
      id: true,
      question: true,
      scenario: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      contentHash: true,
      active: true,
      qaPassed: true,
    },
  });
  const rereadById = new Map(reread.map((row) => [row.id, row]));
  const sampleReport = sample.map((update) => {
    const saved = rereadById.get(update.bank.id);
    const ok = Boolean(
      saved &&
        saved.active &&
        saved.qaPassed &&
        saved.question === update.next.question &&
        (saved.scenario ?? "") === (update.next.scenario ?? "") &&
        saved.options === update.next.options &&
        saved.correctAnswer === update.next.correctAnswer &&
        saved.explanation === update.next.explanation &&
        saved.contentHash === update.next.contentHash
    );
    return { itemId: update.fix.itemId, id: update.bank.id, ok };
  });
  if (sampleReport.length !== 10 || sampleReport.some((row) => !row.ok)) {
    throw new Error(`Random re-read failed: ${JSON.stringify(sampleReport)}`);
  }
  report.sample = sampleReport;
  const reportPath = path.join(DATA_DIR, "audit-fixes-apply-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Re-read 10 updated rows: all matched.`);
  for (const row of sampleReport) console.log(`  ${row.itemId} ${row.id}`);
  console.log(`Updated ${planned.length} rows. Skips: ${skips.length}.`);
  console.log(`report: ${displayPath(reportPath)}`);
  console.log(`backup: ${displayPath(undoPath)}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
