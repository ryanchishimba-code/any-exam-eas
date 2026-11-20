#!/usr/bin/env node
/**
 * Read-only cue and difficulty gate for QuestionBankItem.
 *
 * SELECT only. Writes a JSON worklist and a markdown summary under
 * tmp/quality-gate/. Does not UPDATE, INSERT, or DELETE.
 *
 *   npx tsx scripts/quality-gate-cue-difficulty.ts --help
 *   npx tsx scripts/quality-gate-cue-difficulty.ts --board nclex --served-only --limit 200
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  QUALITY_GATE_HELP,
  buildQualityGateReport,
  filterServedRows,
  parseKnownCueFlags,
  qualityGateServedSql,
  renderQualityGateMarkdown,
  resolveQualityGateBoard,
  scoreCueRecall,
  type QualityGateReport,
  type QualityGateRow,
} from "../src/lib/exam-prep/quality-gate/cue-difficulty";

const PAGE = 400;

type ParsedArgs = {
  help: boolean;
  servedOnly: boolean;
  refuseWrite: boolean;
  board?: string;
  limit: number | null;
  idsFile?: string;
  jsonOut?: string;
  mdOut?: string;
  validateFlags?: string;
  fixture?: string;
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = { help: false, servedOnly: false, refuseWrite: false, limit: null };
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--served-only") {
      parsed.servedOnly = true;
      continue;
    }
    if (arg === "--dry-run") continue;
    if (arg === "--apply" || arg === "--write") {
      parsed.refuseWrite = true;
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        throw new Error(`Missing value for --${key}.`);
      }
      i += 1;
      if (key === "board" || key === "field") parsed.board = next;
      else if (key === "limit") parsed.limit = Number(next);
      else if (key === "ids-file") parsed.idsFile = next;
      else if (key === "json-out") parsed.jsonOut = next;
      else if (key === "md-out") parsed.mdOut = next;
      else if (key === "validate-flags") parsed.validateFlags = next;
      else if (key === "fixture") parsed.fixture = next;
      else throw new Error(`Unknown option --${key}.`);
      continue;
    }
    positionals.push(arg);
  }
  if (!parsed.board && positionals.length) parsed.board = positionals[0];
  if (positionals.length > 1) throw new Error("Pass one board only.");
  return parsed;
}

function readIds(file: string): string[] {
  const ids = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/)[0]!)
    .filter(Boolean);
  return [...new Set(ids)];
}

function rowsFromFixture(value: unknown, fieldId: string | null): QualityGateRow[] {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as { items?: unknown })
    : null;
  const list = Array.isArray(value) ? value : record?.items;
  if (!Array.isArray(list)) {
    throw new Error("Fixture JSON must be an array of rows or { items: [] }.");
  }
  return list.map((entry) => {
    const row = entry as QualityGateRow;
    if (!row || typeof row.id !== "string" || typeof row.question !== "string") {
      throw new Error("Each fixture row needs an id and a question.");
    }
    return {
      ...row,
      fieldId: row.fieldId || fieldId || "fixture",
      options: typeof row.options === "string" ? row.options : JSON.stringify(row.options ?? []),
      correctAnswer: row.correctAnswer ?? "",
    };
  });
}

async function selectRows(input: {
  fieldId: string;
  servedOnly: boolean;
  limit: number | null;
  ids: string[] | null;
}): Promise<QualityGateRow[]> {
  const { loadEnvFiles, ensureDatabaseUrlEnv } = await import("./resolve-database-url.mjs");
  loadEnvFiles();
  const url = ensureDatabaseUrlEnv();
  if (!url) {
    console.error(
      "No DATABASE_URL. Set .env.local or pass --fixture to score a local JSON file. Nothing was written to a database."
    );
    process.exit(1);
  }
  const { PrismaClient, Prisma } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const servedSql = input.servedOnly ? qualityGateServedSql() : "";
  try {
    const rows: QualityGateRow[] = [];
    let cursor = "";
    while (true) {
      const remaining = input.limit == null ? PAGE : input.limit - rows.length;
      const take = Math.min(PAGE, remaining);
      if (take <= 0) break;
      const idFilter = input.ids?.length
        ? Prisma.sql`AND id IN (${Prisma.join(input.ids)})`
        : Prisma.empty;
      const served = servedSql ? Prisma.raw(`AND ${servedSql}`) : Prisma.empty;
      const after = cursor ? Prisma.sql`AND id > ${cursor}` : Prisma.empty;
      const page = await prisma.$queryRaw<QualityGateRow[]>`
        SELECT
          id,
          "fieldId",
          "subjectId",
          difficulty,
          "topicCategory",
          "blueprintTopic",
          "itemType",
          scenario,
          question,
          options,
          "correctAnswer",
          "references",
          "generationMeta",
          curation_meta AS "curationMeta",
          active,
          "qaPassed"
        FROM "QuestionBankItem"
        WHERE "fieldId" = ${input.fieldId}
        ${idFilter}
        ${served}
        ${after}
        ORDER BY id ASC
        LIMIT ${take}
      `;
      for (const row of page) {
        rows.push({
          ...row,
          difficulty: row.difficulty == null ? null : Number(row.difficulty),
          question: row.question ?? "",
          options: row.options ?? "[]",
          correctAnswer: row.correctAnswer ?? "",
        });
      }
      if (page.length < take) break;
      cursor = page[page.length - 1]!.id;
    }
    return rows;
  } finally {
    await prisma.$disconnect();
  }
}

function attachValidation(report: QualityGateReport, file: string | undefined): QualityGateReport {
  if (!file) return report;
  const known = parseKnownCueFlags(JSON.parse(readFileSync(file, "utf8")) as unknown);
  const validation = scoreCueRecall(report, known);
  const recall = validation.recall == null ? "n/a" : `${(validation.recall * 100).toFixed(1)}%`;
  console.log(`CUE flag recall: ${validation.recalledFlags}/${validation.knownFlags} (${recall}).`);
  return { ...report, validation };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.refuseWrite) {
    console.error("This gate is read-only. It cannot --apply or --write. No rows were changed.");
    process.exit(1);
  }
  if (args.help) {
    console.log(QUALITY_GATE_HELP);
    return;
  }
  if (args.limit != null && (!Number.isInteger(args.limit) || args.limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }

  const resolved = args.board ? resolveQualityGateBoard(args.board) : null;
  if (args.board && !resolved) {
    throw new Error(
      `Unknown board "${args.board}". Use pance, nclex, nclex-rn-2026, naplex, or aanp-fnp.`
    );
  }
  if (!resolved && !args.fixture) {
    console.log(QUALITY_GATE_HELP);
    process.exit(1);
  }

  const board = resolved?.board ?? "fixture";
  const fieldId = resolved?.fieldId ?? "fixture";
  const ids = args.idsFile ? readIds(args.idsFile) : null;
  if (ids && !ids.length) throw new Error(`No ids in ${args.idsFile}.`);

  let rows: QualityGateRow[];
  if (args.fixture) {
    rows = rowsFromFixture(JSON.parse(readFileSync(args.fixture, "utf8")) as unknown, resolved?.fieldId ?? null);
    if (resolved) rows = rows.filter((row) => row.fieldId === resolved.fieldId);
    if (ids) {
      const wanted = new Set(ids);
      rows = rows.filter((row) => wanted.has(row.id));
    }
    if (args.servedOnly) rows = filterServedRows(rows);
    if (args.limit != null) rows = rows.slice(0, args.limit);
  } else {
    rows = await selectRows({
      fieldId,
      servedOnly: args.servedOnly,
      limit: args.limit,
      ids,
    });
  }

  const report = attachValidation(
    buildQualityGateReport(rows, {
      board,
      fieldId: rows[0]?.fieldId && !resolved ? rows[0].fieldId : fieldId,
      servedOnly: args.servedOnly,
      limit: args.limit,
      generatedAt: new Date().toISOString(),
    }),
    args.validateFlags
  );

  const day = report.generatedAt.slice(0, 10);
  const jsonOut = path.resolve(args.jsonOut ?? path.join("tmp", "quality-gate", `${board}-${day}.json`));
  const mdOut = path.resolve(args.mdOut ?? jsonOut.replace(/\.json$/i, "") + ".md");
  mkdirSync(path.dirname(jsonOut), { recursive: true });
  mkdirSync(path.dirname(mdOut), { recursive: true });
  writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);
  const markdown = renderQualityGateMarkdown(report);
  writeFileSync(mdOut, markdown);
  console.log(markdown);
  console.log(`Wrote ${jsonOut}`);
  console.log(`Wrote ${mdOut}`);
  console.log("Read-only. No question-bank rows were changed.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
