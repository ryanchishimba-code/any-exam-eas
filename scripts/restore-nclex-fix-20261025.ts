#!/usr/bin/env node
/**
 * Restore the 201 NCLEX rows snapshotted on 2026-10-25.
 *
 * Source of truth: scripts/data/nclex-fix-20261025/backup.csv
 * (sha256 in backup-manifest.json). The same rows also live in
 * qbi_nclex_fix_20261025_backup. This script writes the CSV values
 * back onto QuestionBankItem. It does not delete rows and it does not
 * run any other rollback file.
 *
 * Dry run is the default and writes nothing.
 *
 *   npx tsx scripts/restore-nclex-fix-20261025.ts
 *   npx tsx scripts/restore-nclex-fix-20261025.ts --apply
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const DATA_DIR = path.join(process.cwd(), "scripts/data/nclex-fix-20261025");
const CSV_PATH = path.join(DATA_DIR, "backup.csv");
const MANIFEST_PATH = path.join(DATA_DIR, "backup-manifest.json");
const EXPECTED = 201;
const NULL_SENTINEL = "\\N";

type Manifest = {
  table: string;
  rowCount: number;
  sha256: string;
  columnTypes: Record<string, string>;
  ids: string[];
};

const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

/** RFC 4180 reader. Fields may contain commas, quotes, and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let quoted = false;
  if (text.charCodeAt(0) === 0xfeff) i = 1;
  while (i < text.length) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      quoted = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    if (c === "\r") {
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function loadBackup(): { manifest: Manifest; columns: string[]; rows: Array<Record<string, string>> } {
  const raw = readFileSync(CSV_PATH);
  const digest = createHash("sha256").update(raw).digest("hex");
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
  if (manifest.table !== "qbi_nclex_fix_20261025_backup") {
    throw new Error("manifest table name is not the 2026-10-25 backup");
  }
  if (manifest.rowCount !== EXPECTED || manifest.ids.length !== EXPECTED) {
    throw new Error(`manifest does not describe ${EXPECTED} rows`);
  }
  if (digest !== manifest.sha256) {
    throw new Error(`backup.csv sha256 ${digest} does not match the manifest`);
  }
  const parsed = parseCsv(raw.toString("utf8"));
  const header = parsed[0];
  const body = parsed.slice(1).filter((line) => line.length > 1 || line[0] !== "");
  if (!header || header.length !== Object.keys(manifest.columnTypes).length) {
    throw new Error("backup.csv header does not match the manifest columns");
  }
  for (const name of header) {
    if (!manifest.columnTypes[name]) throw new Error(`unexpected column ${name}`);
  }
  if (body.length !== EXPECTED) throw new Error(`backup.csv has ${body.length} rows, expected ${EXPECTED}`);
  const rows = body.map((cells) => {
    if (cells.length !== header.length) {
      throw new Error(`row ${cells[0]} has ${cells.length} columns, expected ${header.length}`);
    }
    return Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""]));
  });
  const ids = new Set(rows.map((row) => row.id));
  if (ids.size !== EXPECTED) throw new Error("backup.csv ids are not unique");
  for (const id of manifest.ids) {
    if (!ids.has(id)) throw new Error(`manifest id missing from csv: ${id}`);
  }
  return { manifest, columns: header, rows };
}

function assignment(column: string, udt: string, raw: string): Prisma.Sql {
  const ident = Prisma.raw(quoteIdent(column));
  if (raw === NULL_SENTINEL) return Prisma.sql`${ident} = NULL`;
  if (udt === "jsonb") return Prisma.sql`${ident} = ${raw}::jsonb`;
  if (udt === "vector") return Prisma.sql`${ident} = ${raw}::vector`;
  if (udt === "bool") {
    if (raw !== "true" && raw !== "false") throw new Error(`bad bool ${raw}`);
    return Prisma.sql`${ident} = ${raw === "true"}`;
  }
  if (udt === "int2") return Prisma.sql`${ident} = ${Number(raw)}::smallint`;
  if (udt === "float8") return Prisma.sql`${ident} = ${raw}::double precision`;
  if (udt === "timestamp") return Prisma.sql`${ident} = ${raw}::timestamp`;
  if (udt === "bpchar") return Prisma.sql`${ident} = ${raw}::character(2)`;
  return Prisma.sql`${ident} = ${raw}`;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const { manifest, columns, rows } = loadBackup();
  const selectList = columns
    .map((column) => `${quoteIdent(column)}::text AS ${quoteIdent(column)}`)
    .join(", ");
  const idList = rows.map((row) => `'${row.id}'`).join(", ");
  for (const row of rows) {
    if (!/^[a-z0-9]+$/.test(row.id)) throw new Error(`unexpected id: ${row.id}`);
  }
  const live = (await prisma.$queryRawUnsafe(
    `SELECT ${selectList} FROM "QuestionBankItem" WHERE id IN (${idList})`
  )) as Array<Record<string, string | null>>;
  const liveById = new Map(live.map((row) => [String(row.id), row]));
  let changedRows = 0;
  const samples: string[] = [];
  for (const row of rows) {
    const current = liveById.get(row.id);
    if (!current) throw new Error(`live row missing: ${row.id}`);
    const diffs = columns.filter((column) => {
      const liveValue = current[column] == null ? NULL_SENTINEL : String(current[column]);
      return liveValue !== row[column];
    });
    if (diffs.length > 0) {
      changedRows += 1;
      if (samples.length < 15) samples.push(`${row.id}: ${diffs.join(", ")}`);
    }
  }
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup table: ${manifest.table}`);
  console.log(`csv: ${CSV_PATH}`);
  console.log(`sha256: ${manifest.sha256}`);
  console.log(`backup rows: ${rows.length}`);
  console.log(`live rows: ${live.length}`);
  console.log(`rows that differ from the backup: ${changedRows}`);
  for (const line of samples) console.log(line);
  if (changedRows > samples.length) console.log(`... ${changedRows - samples.length} more`);
  if (!apply) {
    console.log("No row written.");
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const row of rows) {
      const assignments = columns.map((column) => {
        const udt = manifest.columnTypes[column];
        if (!udt) throw new Error(`missing type for ${column}`);
        return assignment(column, udt, row[column]);
      });
      const updated = await tx.$executeRaw`
        UPDATE "QuestionBankItem"
        SET ${Prisma.join(assignments, ", ")}
        WHERE id = ${row.id}
      `;
      if (updated !== 1) throw new Error(`restore updated ${updated} rows for ${row.id}`);
    }
  });
  console.log(`Restored ${EXPECTED} rows from ${CSV_PATH}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
