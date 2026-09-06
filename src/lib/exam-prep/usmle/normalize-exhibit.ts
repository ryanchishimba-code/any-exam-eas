/**
 * Normalize AI exhibit / lab payloads into renderable stem tables + media refs.
 * Fixes the gap where chartData.exhibit.findings never reached ExhibitTable.
 */
import type { BankItem } from "@/lib/question-bank";
import type { UsmleFigureRef } from "./figure-assets";

export type ExhibitTablePayload = {
  title?: string;
  headers: string[];
  rows: string[][];
  /** Parallel to rows — highlight clinically abnormal values. */
  abnormalRows?: boolean[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function findingsToTable(
  findings: unknown,
  title?: string
): ExhibitTablePayload | null {
  if (!Array.isArray(findings) || findings.length === 0) return null;

  if (typeof findings[0] === "string") {
    return {
      title,
      headers: ["Finding"],
      rows: findings.map((f) => [String(f)]),
    };
  }

  const rows: string[][] = [];
  const abnormalRows: boolean[] = [];
  for (const raw of findings) {
    const f = asRecord(raw);
    if (!f) continue;
    const label = String(f.label ?? f.name ?? f.finding ?? f.test ?? "").trim();
    const value = String(f.value ?? f.result ?? "").trim();
    const reference = String(f.reference ?? f.ref ?? f.range ?? "").trim();
    const note = String(f.note ?? f.description ?? "").trim();
    if (!label && !value && !note) continue;
    if (reference) {
      rows.push([label || "—", value || "—", reference]);
    } else if (note && value) {
      rows.push([label || "—", value, note]);
    } else if (value) {
      rows.push([label || "—", value]);
    } else {
      rows.push([label || note]);
    }
    abnormalRows.push(Boolean(f.abnormal ?? f.flagged ?? f.high ?? f.low));
  }
  if (!rows.length) return null;

  const colCount = Math.max(...rows.map((r) => r.length));
  const headers =
    colCount >= 3
      ? ["Test", "Result", "Reference"]
      : colCount === 2
        ? ["Test", "Result"]
        : ["Finding"];

  return {
    title,
    headers,
    rows: rows.map((r) => {
      while (r.length < colCount) r.push("—");
      return r;
    }),
    abnormalRows,
  };
}

function labTableObjectToTable(lab: unknown, title?: string): ExhibitTablePayload | null {
  const obj = asRecord(lab);
  if (!obj) return null;

  if (Array.isArray(obj.headers) && Array.isArray(obj.rows)) {
    return {
      title: typeof obj.title === "string" ? obj.title : title,
      headers: obj.headers.map(String),
      rows: (obj.rows as unknown[]).map((row) =>
        Array.isArray(row) ? row.map(String) : [String(row)]
      ),
      abnormalRows: Array.isArray(obj.abnormalRows)
        ? obj.abnormalRows.map(Boolean)
        : undefined,
    };
  }

  if (Array.isArray(obj.rows)) {
    return findingsToTable(obj.rows, typeof obj.title === "string" ? obj.title : title);
  }

  // Flat key/value lab map: { Na: "140", K: "3.1", ... }
  const entries = Object.entries(obj).filter(
    ([k]) => !["kind", "title", "description", "exhibit"].includes(k)
  );
  if (entries.length >= 2 && entries.every(([, v]) => typeof v === "string" || typeof v === "number")) {
    return {
      title: title ?? "Laboratory studies",
      headers: ["Test", "Result"],
      rows: entries.map(([k, v]) => [k, String(v)]),
    };
  }

  return findingsToTable(obj.findings, title);
}

/**
 * Build a canonical exhibit table from ngnPayload / chartData shapes produced by gen.
 */
export function resolveExhibitTable(
  ngn: Record<string, unknown> | null | undefined
): ExhibitTablePayload | null {
  if (!ngn) return null;

  const existing = asRecord(ngn.table);
  if (existing && Array.isArray(existing.headers) && Array.isArray(existing.rows)) {
    return {
      title: typeof existing.title === "string" ? existing.title : undefined,
      headers: existing.headers.map(String),
      rows: (existing.rows as unknown[]).map((row) =>
        Array.isArray(row) ? row.map(String) : [String(row)]
      ),
      abnormalRows: Array.isArray(existing.abnormalRows)
        ? existing.abnormalRows.map(Boolean)
        : undefined,
    };
  }

  const exhibit = asRecord(ngn.exhibit) ?? asRecord(asRecord(ngn.chartData)?.exhibit);
  if (exhibit) {
    const title =
      typeof exhibit.title === "string"
        ? exhibit.title
        : typeof exhibit.description === "string"
          ? exhibit.description
          : "Clinical exhibit";
    const fromFindings = findingsToTable(exhibit.findings, title);
    if (fromFindings) return fromFindings;
    if (typeof exhibit.description === "string" && exhibit.description.trim()) {
      return {
        title,
        headers: ["Finding"],
        rows: [[exhibit.description.trim()]],
      };
    }
  }

  const lab =
    ngn.labTable ??
    asRecord(ngn.chartData)?.labTable ??
    (asRecord(ngn.chartData)?.kind === "lab" ? ngn.chartData : null);
  const fromLab = labTableObjectToTable(lab, "Laboratory studies");
  if (fromLab) return fromLab;

  return null;
}

/**
 * Ensure BankItem ngnPayload has a renderable `table` (+ kind exhibit when media/table present).
 */
export function normalizeUsmleExhibitPayload(item: BankItem): BankItem {
  const ngn = { ...(item.ngnPayload ?? {}) } as Record<string, unknown>;
  const table = resolveExhibitTable(ngn);
  if (!table) return item;

  ngn.table = {
    title: table.title,
    headers: table.headers,
    rows: table.rows,
    ...(table.abnormalRows ? { abnormalRows: table.abnormalRows } : {}),
  };
  if (!ngn.kind || ngn.kind === "vignette" || ngn.kind === "mcq") {
    ngn.kind = item.itemType === "biostats" ? "biostats" : "exhibit";
  }

  const media = Array.isArray(ngn.media) ? (ngn.media as UsmleFigureRef[]) : [];
  return {
    ...item,
    itemType:
      item.itemType === "biostats" || item.itemType === "exhibit"
        ? item.itemType
        : table
          ? "exhibit"
          : item.itemType,
    ngnPayload: media.length ? { ...ngn, media } : ngn,
  };
}
