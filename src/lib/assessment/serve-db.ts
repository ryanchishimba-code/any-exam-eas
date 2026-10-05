import { boardProfilesForField } from "@/lib/assessment/board-field";
import { applyStoredGrade } from "@/lib/assessment/attempt-grade";
import {
  clinicalFormatAddition,
  mergeClinicalFormatCounts,
  parseNgnQuestionKey,
  scoredItemCount,
  selectPublishedCatalog,
  servedItemKeys,
  studentFacingUnit,
  takeSessionUnits,
  type PublishedCatalog,
  type PublishedUnit,
  type ServeCase,
  type ServeItem,
} from "@/lib/assessment/serve";
import type { FormatCounts } from "@/lib/inventory/question-format";
import type { SessionAttemptDraft } from "@/lib/learning/session-attempt-plan";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import {
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
  ACTIVE_INVENTORY_STAMP_CACHE_KEY,
  ACTIVE_INVENTORY_STAMP_TTL_SECONDS,
} from "@/lib/inventory/active-inventory-cache";
import { readActiveInventoryStampKey } from "@/lib/inventory/active-inventory-stamp";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
import type { NgnItem, NgnReference, SourceRef } from "@/lib/assessment/types";

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

function toServeItem(row: {
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
}): ServeItem {
  const cjmm = row.cjmmFunction;
  return {
    id: row.id,
    version: row.version,
    batchId: row.batchId,
    itemType: row.itemType as ServeItem["itemType"],
    caseId: row.caseId,
    caseStep: row.caseStep,
    caseVersion: row.caseVersion,
    cjmmFunction: Array.isArray(cjmm) || typeof cjmm === "string" ? (cjmm as string | string[]) : [],
    timepoint: row.timepoint,
    responseFormat: row.responseFormat as ServeItem["responseFormat"],
    scoringRule: row.scoringRule as ServeItem["scoringRule"],
    maxPoints: row.maxPoints,
    stem: row.stem,
    payload: asRecord(row.payload),
    exhibit: row.exhibit && typeof row.exhibit === "object" ? (row.exhibit as Record<string, unknown>) : null,
    rationale: row.rationale as ServeItem["rationale"],
    clientNeeds: asRecord(row.clientNeeds) as ServeItem["clientNeeds"],
    references: Array.isArray(row.references) ? (row.references as NgnReference[]) : [],
    rnFlags: Array.isArray(row.rnFlags) ? row.rnFlags.filter((flag): flag is string => typeof flag === "string") : [],
    status: row.status,
  };
}

export type LoadedClinicalBank = {
  catalog: PublishedCatalog;
  sourcesById: Record<string, { title: string; url: string }>;
  caseReferences: Record<string, NgnReference[]>;
};

const emptyBank = (): LoadedClinicalBank => ({
  catalog: { standalones: [], cases: [] },
  sourcesById: {},
  caseReferences: {},
});

/** Same window as the public inventory stamp. A purge clears this isolate's copy. */
const CLINICAL_BANK_TTL_MS = 5 * 60 * 1000;

const clinicalBankCache = new Map<string, { at: number; bank: LoadedClinicalBank }>();

export function clearPublishedClinicalBankCache(): void {
  clinicalBankCache.clear();
}

async function loadPublishedClinicalBankFromDb(fieldId: string): Promise<LoadedClinicalBank> {
  const profiles = boardProfilesForField(fieldId);
  if (profiles.length === 0) return emptyBank();
  try {
    const batches = await prisma.ngnImportBatch.findMany({
      where: { boardProfile: { in: profiles } },
    });
    if (batches.length === 0) return emptyBank();
    const batchIds = batches.map((batch) => batch.batchId);
    const [itemRows, caseRows] = await Promise.all([
      prisma.ngnItem.findMany({ where: { batchId: { in: batchIds } } }),
      prisma.ngnCase.findMany({ where: { batchId: { in: batchIds } } }),
    ]);
    let subjects: { id: string; label: string }[] = [];
    try {
      subjects = getSubjectsForFieldId(fieldId).map((subject) => ({
        id: subject.id,
        label: subject.label,
      }));
    } catch {
      subjects = [];
    }
    const items = itemRows.map(toServeItem);
    const cases: ServeCase[] = caseRows.map((row) => ({
      id: row.id,
      version: row.version,
      batchId: row.batchId,
      title: row.title,
      boardProfile: row.boardProfile,
      status: row.status,
      primaryClientNeed: row.primaryClientNeed,
      setting: row.setting,
      patient: row.patient as ServeCase["patient"],
      timepoints: (Array.isArray(row.timepoints) ? row.timepoints : []) as ServeCase["timepoints"],
      chart: (row.chart && typeof row.chart === "object" ? row.chart : { tabs: [] }) as ServeCase["chart"],
      revealRule: row.revealRule,
      references: Array.isArray(row.references) ? (row.references as NgnReference[]) : [],
    }));
    const catalog = selectPublishedCatalog({ items, cases, subjects });
    const sourcesById: LoadedClinicalBank["sourcesById"] = {};
    for (const batch of batches) {
      const sources = Array.isArray(batch.sources) ? (batch.sources as SourceRef[]) : [];
      for (const source of sources) {
        if (!source || typeof source.id !== "string" || typeof source.url !== "string") continue;
        sourcesById[source.id] = {
          title: typeof source.title === "string" ? source.title : source.id,
          url: source.url,
        };
      }
    }
    const caseReferences: Record<string, NgnReference[]> = {};
    for (const unit of catalog.cases) {
      caseReferences[`${unit.caseDoc.id}:${unit.caseDoc.version}`] = unit.caseDoc.references;
    }
    return { catalog, sourcesById, caseReferences };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/ngn_|does not exist|P2021|P2022/i.test(message)) return emptyBank();
    throw error;
  }
}

const STAMP_UNAVAILABLE = "STAMP_UNAVAILABLE";

/**
 * Same published stamp as the scored inventory cache, so a purge of
 * `question-bank-counts` drops this catalog too.
 */
async function publishedClinicalStampKey(): Promise<string | null> {
  try {
    return await unstable_cache(
      async () => {
        const key = await readActiveInventoryStampKey();
        if (!key) throw new Error(STAMP_UNAVAILABLE);
        return key;
      },
      [...ACTIVE_INVENTORY_STAMP_CACHE_KEY],
      {
        revalidate: ACTIVE_INVENTORY_STAMP_TTL_SECONDS,
        tags: [ACTIVE_INVENTORY_CACHE_TAG],
      }
    )();
  } catch (error) {
    if (!(error instanceof Error) || error.message !== STAMP_UNAVAILABLE) {
      console.error("[clinical-bank] stamp cache failed; reading the bank directly:", error);
    }
    return null;
  }
}

async function loadSharedClinicalBank(fieldId: string): Promise<LoadedClinicalBank> {
  const stampKey = await publishedClinicalStampKey();
  if (!stampKey) return loadPublishedClinicalBankFromDb(fieldId);
  return unstable_cache(
    () => loadPublishedClinicalBankFromDb(fieldId),
    ["published-clinical-bank-v1", fieldId, stampKey],
    {
      revalidate: ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
      tags: [ACTIVE_INVENTORY_CACHE_TAG],
    }
  )();
}

/**
 * User-agnostic published NGN catalog. Clinical sessions and review-incorrect
 * read it. A warm isolate keeps the object for five minutes. A cold isolate
 * reuses the tagged data-cache entry instead of rebuilding every chart.
 * A thrown read is not cached. A missing stamp skips the shared cache.
 */
export async function loadPublishedClinicalBank(fieldId: string): Promise<LoadedClinicalBank> {
  const hit = clinicalBankCache.get(fieldId);
  if (hit && Date.now() - hit.at < CLINICAL_BANK_TTL_MS) return hit.bank;
  const bank = await loadSharedClinicalBank(fieldId);
  clinicalBankCache.set(fieldId, { at: Date.now(), bank });
  return bank;
}

export async function publishedClinicalAddition(fieldId: string) {
  const bank = await loadPublishedClinicalBank(fieldId);
  return clinicalFormatAddition(bank.catalog);
}

export function applyClinicalCounts<T extends { formats: FormatCounts | null; topicFormats: Record<string, FormatCounts> | null }>(
  payload: T,
  addition: { ngn: number; case: number; topics: Record<string, { ngn: number; case: number }> }
): T {
  if (!payload.formats) return payload;
  if (addition.ngn === 0 && addition.case === 0) return payload;
  const merged = mergeClinicalFormatCounts(payload.formats, payload.topicFormats, addition);
  return { ...payload, formats: merged.formats, topicFormats: merged.topicFormats };
}

export function buildStudentUnits(params: {
  catalog: PublishedCatalog;
  format: "ngn" | "case";
  subjectId?: string | null;
  limit: number;
  seed: string;
}): PublishedUnit[] {
  return takeSessionUnits(params).map((unit) => studentFacingUnit(unit));
}

export function clinicalPoolCount(
  catalog: PublishedCatalog,
  format: "ngn" | "case",
  subjectId?: string | null
): number {
  return takeSessionUnits({ catalog, format, subjectId, limit: Number.MAX_SAFE_INTEGER, seed: "count" }).length;
}

export async function rescoreNgnDrafts(drafts: SessionAttemptDraft[]): Promise<SessionAttemptDraft[]> {
  const keys = drafts
    .map((draft) => parseNgnQuestionKey(draft.questionKey))
    .filter((key): key is { id: string; version: number } => Boolean(key));
  if (keys.length === 0) return drafts;
  const rows = await prisma.ngnItem.findMany({
    where: {
      OR: keys.map((key) => ({ id: key.id, version: key.version })),
    },
  });
  const byKey = new Map(rows.map((row) => [`ngn:${row.id}:v${row.version}`, toServeItem(row)]));
  const casePairs = rows
    .filter((row) => row.caseId && row.caseVersion != null)
    .map((row) => ({ id: row.caseId!, version: row.caseVersion! }));
  const caseRows = casePairs.length
    ? await prisma.ngnCase.findMany({
        where: { OR: casePairs.map((pair) => ({ id: pair.id, version: pair.version })) },
      })
    : [];
  const publishedCases = new Set(
    caseRows.filter((row) => row.status === "published").map((row) => `${row.id}:${row.version}`)
  );
  return drafts.map((draft) => {
    const parsed = parseNgnQuestionKey(draft.questionKey);
    if (!parsed) return draft;
    const item = byKey.get(draft.questionKey) ?? null;
    if (!item || item.status !== "published") return applyStoredGrade(draft, null);
    if (item.caseId) {
      if (!publishedCases.has(`${item.caseId}:${item.caseVersion}`)) return applyStoredGrade(draft, null);
    }
    return applyStoredGrade(draft, item);
  });
}

export function keysForCatalog(catalog: PublishedCatalog): Set<string> {
  return new Set(servedItemKeys(catalog));
}

export async function findServedItem(itemId: string, version: number): Promise<NgnItem | null> {
  const row = await prisma.ngnItem.findUnique({
    where: { id_version: { id: itemId, version } },
  });
  if (!row || row.status !== "published") return null;
  if (row.caseId && row.caseVersion != null) {
    const caseRow = await prisma.ngnCase.findUnique({
      where: { id_version: { id: row.caseId, version: row.caseVersion } },
    });
    if (!caseRow || caseRow.status !== "published") return null;
    const siblings = await prisma.ngnItem.findMany({
      where: { caseId: row.caseId, caseVersion: row.caseVersion },
    });
    const latest = new Map<string, { status: string; version: number }>();
    for (const sibling of siblings) {
      const current = latest.get(sibling.id);
      if (!current || sibling.version > current.version) {
        latest.set(sibling.id, { status: sibling.status, version: sibling.version });
      }
    }
    for (const member of latest.values()) {
      if (member.status !== "published") return null;
    }
  }
  return toServeItem(row);
}

export { scoredItemCount };
