import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { errorCount, validatePilotDocument } from "@/lib/assessment/validators/ngn";
import type {
  NgnCase,
  NgnItem,
  NgnReference,
  PilotDocument,
  SourceRef,
  ValidationIssue,
} from "@/lib/assessment/types";
import { perfect, score } from "@/lib/assessment/scoring/registry";

export const BATCH_ID = "ngn300-gapfill-2026-10-25";
export const SCHEMA_VERSION = "aee-case-1.0";
export const BOARD_PROFILE = "nclex-rn-2026";
export const DATA_DIR = dirname(fileURLToPath(import.meta.url));
export const ITEMS_PATH = resolve(DATA_DIR, "items.json");
export const SOURCES_SUPPLEMENT_PATH = resolve(DATA_DIR, "sources-supplement.json");
export const UNDO_PATH = resolve(DATA_DIR, "undo.json");

type SnakeCase = Record<string, unknown>;

export type GapfillFile = {
  batch_id: string;
  generated?: string;
  status_note?: string;
  cases: SnakeCase[];
  items: SnakeCase[];
};

export type UndoManifest = {
  batch_id: string;
  created_at: string;
  neon_snapshot?: string;
  cases: { id: string; version: number }[];
  items: { id: string; version: number }[];
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function mapReferences(value: unknown): NgnReference[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const row = entry as Record<string, unknown>;
      const ref: NgnReference & Record<string, unknown> = {
        src: asString(row.src),
      };
      if (row.locator) ref.locator = asString(row.locator);
      for (const [key, val] of Object.entries(row)) {
        if (key === "src" || key === "locator") continue;
        ref[key] = val;
      }
      return ref;
    });
}

function mapItem(row: SnakeCase): NgnItem {
  const itemType = asString(row.item_type) as NgnItem["itemType"];
  const cjmm = row.cjmm_function;
  return {
    id: asString(row.id),
    version: Number(row.version),
    itemType,
    caseId: row.case_id == null ? null : asString(row.case_id),
    caseStep: row.case_step == null ? null : Number(row.case_step),
    caseVersion: row.case_version == null ? null : Number(row.case_version),
    cjmmFunction: (Array.isArray(cjmm) || typeof cjmm === "string" ? cjmm : []) as string | string[],
    timepoint: row.timepoint == null ? null : asString(row.timepoint),
    responseFormat: asString(row.response_format) as NgnItem["responseFormat"],
    scoringRule: asString(row.scoring_rule) as NgnItem["scoringRule"],
    maxPoints: Number(row.max_points),
    stem: asString(row.stem),
    payload: (row.payload ?? {}) as Record<string, unknown>,
    exhibit: (row.exhibit ?? null) as NgnItem["exhibit"],
    rationale: row.rationale as NgnItem["rationale"],
    clientNeeds: (row.client_needs ?? {}) as NgnItem["clientNeeds"],
    references: mapReferences(row.references),
    rnFlags: Array.isArray(row.rn_flags) ? row.rn_flags.filter((f): f is string => typeof f === "string") : [],
    status: "published",
  };
}

function mapCase(row: SnakeCase, caseItems: NgnItem[]): NgnCase {
  return {
    id: asString(row.id),
    version: Number(row.version),
    title: asString(row.title),
    boardProfile: asString(row.board_profile),
    status: "published",
    primaryClientNeed: asString(row.primary_client_need),
    setting: asString(row.setting),
    patient: row.patient as NgnCase["patient"],
    timepoints: row.timepoints as NgnCase["timepoints"],
    chart: row.chart as NgnCase["chart"],
    revealRule: asString(row.reveal_rule),
    references: mapReferences(row.references),
    items: caseItems,
  };
}

export function loadGapfillFile(path = ITEMS_PATH): GapfillFile {
  const raw = JSON.parse(readFileSync(path, "utf8")) as GapfillFile;
  if (raw.batch_id !== BATCH_ID) {
    throw new Error(`expected batch_id ${BATCH_ID}, got ${raw.batch_id}`);
  }
  return raw;
}

export function loadSourcesSupplement(): SourceRef[] {
  const parsed = JSON.parse(readFileSync(SOURCES_SUPPLEMENT_PATH, "utf8")) as SourceRef[];
  return parsed;
}

export function mergeSources(existing: readonly SourceRef[], supplement: readonly SourceRef[]): SourceRef[] {
  const byId = new Map<string, SourceRef>();
  for (const source of [...existing, ...supplement]) {
    if (!source?.id) continue;
    if (!byId.has(source.id)) byId.set(source.id, source);
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function toPilotDocument(file: GapfillFile, sources: SourceRef[]): PilotDocument {
  const allItems = file.items.map(mapItem);
  const byCase = new Map<string, NgnItem[]>();
  for (const item of allItems) {
    if (!item.caseId) continue;
    const list = byCase.get(item.caseId) ?? [];
    list.push(item);
    byCase.set(item.caseId, list);
  }
  const cases = file.cases.map((row) => mapCase(row, byCase.get(asString(row.id)) ?? []));
  const standalone = allItems.filter((item) => item.itemType === "bowtie" || item.itemType === "trend");
  return {
    schemaVersion: SCHEMA_VERSION,
    batchId: BATCH_ID,
    boardProfile: BOARD_PROFILE,
    sources,
    cases,
    standalone,
  };
}

/** Strict pilot validation (import pipeline). Not used for owner-approved gap-fill publish. */
export function validateGapfillStrict(doc: PilotDocument): ValidationIssue[] {
  return validatePilotDocument(doc);
}

function collectReferenceSrc(file: GapfillFile): Set<string> {
  const src = new Set<string>();
  const walk = (refs: unknown) => {
    if (!Array.isArray(refs)) return;
    for (const ref of refs) {
      if (ref && typeof ref === "object" && typeof (ref as { src?: string }).src === "string") {
        src.add((ref as { src: string }).src);
      }
    }
  };
  for (const row of file.cases) walk(row.references);
  for (const row of file.items) walk(row.references);
  return src;
}

/** Publish gate: schema shape, registry ids for this batch, and case wiring. */
export function validateGapfillForPublish(file: GapfillFile, sources: SourceRef[]): string[] {
  const errors: string[] = [];
  const registry = new Set(sources.map((source) => source.id));
  const needed = collectReferenceSrc(file);
  for (const id of needed) {
    if (!registry.has(id)) errors.push(`reference src ${id} is missing from batch sources`);
  }
  if (file.cases.length !== 2) errors.push(`expected 2 cases, got ${file.cases.length}`);
  if (file.items.length !== 21) errors.push(`expected 21 items, got ${file.items.length}`);
  const byCase = new Map<string, number>();
  for (const row of file.items) {
    const type = asString(row.item_type);
    if (type === "case_item") {
      const caseId = asString(row.case_id);
      byCase.set(caseId, (byCase.get(caseId) ?? 0) + 1);
    }
  }
  for (const row of file.cases) {
    const id = asString(row.id);
    if ((byCase.get(id) ?? 0) !== 6) {
      errors.push(`case ${id} must have 6 published steps, got ${byCase.get(id) ?? 0}`);
    }
  }
  const ids = new Set<string>();
  for (const row of file.items) {
    const id = asString(row.id);
    if (ids.has(id)) errors.push(`duplicate item id ${id}`);
    ids.add(id);
  }
  for (const row of file.cases) {
    for (const key of [
      "id",
      "version",
      "title",
      "board_profile",
      "primary_client_need",
      "setting",
      "patient",
      "timepoints",
      "chart",
      "reveal_rule",
    ]) {
      if (row[key] == null || row[key] === "") errors.push(`case ${row.id}: missing ${key}`);
    }
  }
  for (const row of file.items) {
    for (const key of ["id", "version", "item_type", "response_format", "scoring_rule", "stem", "payload", "rationale"]) {
      if (row[key] == null) errors.push(`item ${row.id}: missing ${key}`);
    }
  }
  return errors;
}

export function fileSha256(path = ITEMS_PATH): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function buildUndoManifest(file: GapfillFile, snapshotId?: string): UndoManifest {
  return {
    batch_id: BATCH_ID,
    created_at: new Date().toISOString(),
    neon_snapshot: snapshotId,
    cases: file.cases.map((row) => ({ id: asString(row.id), version: Number(row.version) })),
    items: file.items.map((row) => ({ id: asString(row.id), version: Number(row.version) })),
  };
}

export function assertScoringKeys(doc: PilotDocument): string[] {
  const errors: string[] = [];
  const items = [...doc.cases.flatMap((c) => c.items), ...doc.standalone];
  for (const item of items) {
    try {
      const earned = score(item, perfect(item));
      if (earned !== item.maxPoints) {
        errors.push(`${item.id}: perfect score ${earned} !== maxPoints ${item.maxPoints}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${item.id}: scoring failed — ${message}`);
    }
  }
  return errors;
}

export type PrismaCaseCreate = {
  id: string;
  version: number;
  batchId: string;
  boardProfile: string;
  status: string;
  title: string;
  primaryClientNeed: string;
  setting: string;
  patient: unknown;
  timepoints: unknown;
  chart: unknown;
  revealRule: string;
  references: unknown;
  manualCorrection: boolean;
  supersedesId: string | null;
};

export type PrismaItemCreate = {
  id: string;
  version: number;
  batchId: string;
  caseId: string | null;
  caseVersion: number | null;
  caseStep: number | null;
  itemType: string;
  cjmmFunction: unknown;
  timepoint: string | null;
  responseFormat: string;
  scoringRule: string;
  maxPoints: number;
  stem: string;
  payload: unknown;
  exhibit: unknown;
  rationale: unknown;
  clientNeeds: unknown;
  references: unknown;
  rnFlags: unknown;
  status: string;
  manualCorrection: boolean;
  supersedesId: string | null;
};

export function prismaRowsFromFile(file: GapfillFile): { cases: PrismaCaseCreate[]; items: PrismaItemCreate[] } {
  const cases: PrismaCaseCreate[] = file.cases.map((row) => ({
    id: asString(row.id),
    version: Number(row.version),
    batchId: BATCH_ID,
    boardProfile: asString(row.board_profile),
    status: "published",
    title: asString(row.title),
    primaryClientNeed: asString(row.primary_client_need),
    setting: asString(row.setting),
    patient: row.patient,
    timepoints: row.timepoints,
    chart: row.chart,
    revealRule: asString(row.reveal_rule),
    references: row.references,
    manualCorrection: Boolean(row.manual_correction),
    supersedesId: row.supersedes_id == null ? null : asString(row.supersedes_id),
  }));
  const items: PrismaItemCreate[] = file.items.map((row) => ({
    id: asString(row.id),
    version: Number(row.version),
    batchId: BATCH_ID,
    caseId: row.case_id == null ? null : asString(row.case_id),
    caseVersion: row.case_version == null ? null : Number(row.case_version),
    caseStep: row.case_step == null ? null : Number(row.case_step),
    itemType: asString(row.item_type),
    cjmmFunction: row.cjmm_function,
    timepoint: row.timepoint == null ? null : asString(row.timepoint),
    responseFormat: asString(row.response_format),
    scoringRule: asString(row.scoring_rule),
    maxPoints: Number(row.max_points),
    stem: asString(row.stem),
    payload: row.payload,
    exhibit: row.exhibit ?? null,
    rationale: row.rationale,
    clientNeeds: row.client_needs,
    references: row.references,
    rnFlags: row.rn_flags ?? [],
    status: "published",
    manualCorrection: Boolean(row.manual_correction),
    supersedesId: row.supersedes_id == null ? null : asString(row.supersedes_id),
  }));
  return { cases, items };
}

export function batchMeta(file: GapfillFile, sha256: string, sources: SourceRef[]) {
  const caseItems = file.items.filter((row) => asString(row.item_type) === "case_item").length;
  const bowties = file.items.filter((row) => asString(row.item_type) === "bowtie").length;
  const trends = file.items.filter((row) => asString(row.item_type) === "trend").length;
  return {
    batchId: BATCH_ID,
    schemaVersion: SCHEMA_VERSION,
    boardProfile: BOARD_PROFILE,
    sourceSha256: sha256,
    sources,
    rowCounts: {
      cases: file.cases.length,
      items: file.items.length,
      caseItems,
      bowties,
      trends,
    },
    notes: file.status_note ?? null,
  };
}

