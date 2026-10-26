/**
 * Shared helpers for the 2026-10-25 PANCE retire and its undo script.
 * Question text is not logged. Database URLs are redacted from errors.
 */
import { createHash } from "node:crypto";

export const PANCE_RETIRE_BACKUP = "qbi_pance_retire_20261025_backup";
export const PANCE_RETIRE_CSV = "scripts/data/pance-retire-20261025/backup.csv";
export const PANCE_RETIRE_IDS = "scripts/data/pance-retire-20261025/retire-ids.json";

/** Direct host of the production branch. The pooled hostname is the same endpoint. */
export const PANCE_RETIRE_HOST = "ep-small-resonance-apmf4kiq.c-7.us-east-1.aws.neon.tech";

/** Seed #4 and seed #41. Rewrite rows. This retire must not touch them. */
export const PANCE_REWRITE_IDS = [
  "cmqgdhw0r00051yr8ap2l03oh",
  "cmqgdi0qp001h1yr8tipvhp6v",
] as const;

export function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

export function assertRetireId(id: string): void {
  if (!/^[a-z0-9]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
}

export function assertProductionHost(): string {
  const raw = process.env.DATABASE_URL ?? "";
  let host = "";
  try {
    host = new URL(raw).hostname;
  } catch {
    throw new Error("DATABASE_URL is missing or invalid");
  }
  const bare = host.replace("-pooler", "");
  if (bare !== PANCE_RETIRE_HOST) {
    throw new Error(`refusing unexpected database host ${host}`);
  }
  return host;
}

export function redact(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://[redacted]");
}

export function csvEscape(value: string | null): string {
  if (value === null) return "";
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/**
 * RFC 4180 parser. An unquoted empty field is null. A quoted empty field is "".
 */
export function parseCsv(text: string): Array<Array<string | null>> {
  const rows: Array<Array<string | null>> = [];
  let row: Array<string | null> = [];
  let field = "";
  let quoted = false;
  let inQuotes = false;
  let i = 0;
  const pushField = () => {
    row.push(quoted ? field : field === "" ? null : field);
    field = "";
    quoted = false;
  };
  while (i < text.length) {
    const char = text[i]!;
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      quoted = true;
      i += 1;
      continue;
    }
    if (char === ",") {
      pushField();
      i += 1;
      continue;
    }
    if (char === "\n") {
      pushField();
      rows.push(row);
      row = [];
      i += 1;
      continue;
    }
    if (char === "\r") {
      i += 1;
      continue;
    }
    field += char;
    i += 1;
  }
  if (inQuotes) throw new Error("backup csv has an unclosed quote");
  if (field.length > 0 || quoted || row.length > 0) {
    pushField();
    rows.push(row);
  }
  return rows;
}

export function rowTextMd5(values: Array<string | null>): string {
  const packed = values.map((value) => (value === null ? "\\N" : value)).join("\x1f");
  return createHash("md5").update(packed).digest("hex");
}
