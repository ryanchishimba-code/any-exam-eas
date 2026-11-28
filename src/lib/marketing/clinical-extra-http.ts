/**
 * Published NGN totals for the marketing snapshot.
 *
 * The student catalog loader reads every chart through Prisma's pooled
 * connection. Count revalidation only needs the publish rules, so this path
 * loads the id/status columns over Neon HTTP (one short request, no pool
 * slot) and runs the same `selectPublishedCatalog` filter.
 */
import { unstable_cache } from "next/cache";
import { boardProfilesForField } from "@/lib/assessment/board-field";
import {
  selectPublishedCatalog,
  servedItemKeys,
  type PublishedCatalog,
  type ServeCase,
  type ServeItem,
} from "@/lib/assessment/serve";
import {
  clinicalExtraFromCatalog,
  type ClinicalQuestionExtra,
  type CountBoardSlug,
} from "@/lib/counts";
import { sqlQuery } from "@/lib/db";
import {
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
  BANK_COUNTS_QUERY_TIMEOUT_MS,
} from "@/lib/inventory/active-inventory-cache";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";

export type ClinicalItemRow = {
  id: string;
  version: number;
  status: string;
  caseId: string | null;
  caseVersion: number | null;
  caseStep: number | null;
  itemType: string;
};

export type ClinicalCaseRow = {
  id: string;
  version: number;
  status: string;
};

function asItem(row: ClinicalItemRow): ServeItem {
  return {
    id: row.id,
    version: Number(row.version),
    batchId: "",
    itemType: row.itemType as ServeItem["itemType"],
    caseId: row.caseId,
    caseStep: row.caseStep == null ? null : Number(row.caseStep),
    caseVersion: row.caseVersion == null ? null : Number(row.caseVersion),
    cjmmFunction: [],
    timepoint: null,
    responseFormat: "mr_sata",
    scoringRule: "plus_minus",
    maxPoints: 1,
    stem: "",
    payload: {},
    rationale: {
      short: "",
      expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "" },
    },
    clientNeeds: {},
    references: [],
    rnFlags: [],
    status: row.status,
  };
}

function asCase(row: ClinicalCaseRow): ServeCase {
  return {
    id: row.id,
    version: Number(row.version),
    batchId: "",
    status: row.status,
    title: "",
    boardProfile: "",
    primaryClientNeed: "",
    setting: "",
    patient: {} as ServeCase["patient"],
    timepoints: [],
    chart: { tabs: [] } as ServeCase["chart"],
    revealRule: "",
    references: [],
  } as ServeCase;
}

function publishedCatalogFromRows(input: {
  items: readonly ClinicalItemRow[];
  cases: readonly ClinicalCaseRow[];
}) {
  return selectPublishedCatalog({
    items: input.items.map(asItem),
    cases: input.cases.map(asCase),
    subjects: [],
    fieldId: "nursing",
  });
}

/** Same inclusion rules as the published student catalog. */
export function clinicalExtraFromCatalogRows(input: {
  items: readonly ClinicalItemRow[];
  cases: readonly ClinicalCaseRow[];
}): ClinicalQuestionExtra {
  return clinicalExtraFromCatalog(publishedCatalogFromRows(input));
}

/** Published standalone NGN items by catalog item type (bow-tie, trend, …). */
export function publishedStandaloneNgnTypeCountsFromRows(input: {
  items: readonly ClinicalItemRow[];
  cases: readonly ClinicalCaseRow[];
}): Record<string, number> {
  const catalog = publishedCatalogFromRows(input);
  const counts: Record<string, number> = {};
  for (const unit of catalog.standalones) {
    const key = unit.item.itemType.trim().toLowerCase();
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export async function loadClinicalExtrasOverHttp(): Promise<
  Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>
> {
  try {
    return await queryClinicalExtrasOverHttp();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/ngn_|does not exist|P2021|P2022/i.test(message)) return {};
    throw error;
  }
}

async function readNursingNgnCatalogRows(): Promise<{
  items: ClinicalItemRow[];
  cases: ClinicalCaseRow[];
} | null> {
  const profiles = boardProfilesForField("nursing");
  if (profiles.length === 0) return null;
  const timeout = { timeoutMs: BANK_COUNTS_QUERY_TIMEOUT_MS };
  const batches = await sqlQuery<Array<{ batchId: string }>>(
    `
    SELECT batch_id AS "batchId"
    FROM ngn_import_batch
    WHERE board_profile = ANY($1::text[])
    `,
    [profiles],
    timeout
  );
  const batchIds = batches
    .map((row) => row.batchId)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  if (batchIds.length === 0) return null;

  const [items, cases] = await Promise.all([
    sqlQuery<ClinicalItemRow[]>(
      `
      SELECT id, version, status,
             case_id AS "caseId",
             case_version AS "caseVersion",
             case_step AS "caseStep",
             item_type AS "itemType"
      FROM ngn_item
      WHERE batch_id = ANY($1::text[])
      `,
      [batchIds],
      timeout
    ),
    sqlQuery<ClinicalCaseRow[]>(
      `
      SELECT id, version, status
      FROM ngn_case
      WHERE batch_id = ANY($1::text[])
      `,
      [batchIds],
      timeout
    ),
  ]);
  return { items: items ?? [], cases: cases ?? [] };
}

async function queryClinicalExtrasOverHttp(): Promise<
  Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>
> {
  const rows = await readNursingNgnCatalogRows();
  if (!rows) return {};
  const extra = clinicalExtraFromCatalogRows(rows);
  if (extra.standaloneNgn === 0 && extra.caseStudies === 0 && extra.caseItems === 0) return {};
  return { nclex: extra };
}

const loadCachedNursingStandaloneNgnTypes = unstable_cache(
  async () => {
    const rows = await readNursingNgnCatalogRows();
    if (!rows) return {};
    return publishedStandaloneNgnTypeCountsFromRows(rows);
  },
  ["nclex-landing-standalone-ngn-types-v1"],
  { revalidate: 300, tags: [ACTIVE_INVENTORY_CACHE_TAG] }
);

/** Live published standalone NGN types for the NCLEX hub chart (bow-tie, trend). */
export async function loadNursingPublishedStandaloneNgnTypes(): Promise<Record<string, number>> {
  try {
    return await loadCachedNursingStandaloneNgnTypes();
  } catch {
    return {};
  }
}

export type SlimClinicalItemRow = ClinicalItemRow & {
  clientNeedsSubcategory: string;
};

export type SlimClinicalCaseRow = ClinicalCaseRow & {
  primaryClientNeed: string;
};

function subjectList(fieldId: string): { id: string; label: string }[] {
  try {
    return getSubjectsForFieldId(fieldId).map((subject) => ({
      id: subject.id,
      label: subject.label,
    }));
  } catch {
    return [];
  }
}

function asSlimItem(row: SlimClinicalItemRow): ServeItem {
  const item = asItem(row);
  return {
    ...item,
    clientNeeds: {
      subcategory: row.clientNeedsSubcategory,
    } as ServeItem["clientNeeds"],
  };
}

function asSlimCase(row: SlimClinicalCaseRow): ServeCase {
  return {
    ...asCase(row),
    primaryClientNeed: row.primaryClientNeed,
  };
}

/**
 * Same publish rules as the full chart catalog, without stems or charts.
 * Topic attribution uses the client-need label the full loader uses.
 */
export function catalogFromSlimRows(input: {
  fieldId: string;
  items: readonly SlimClinicalItemRow[];
  cases: readonly SlimClinicalCaseRow[];
  subjects?: readonly { id: string; label: string }[];
}): PublishedCatalog {
  return selectPublishedCatalog({
    items: input.items.map(asSlimItem),
    cases: input.cases.map(asSlimCase),
    subjects: input.subjects ?? subjectList(input.fieldId),
    fieldId: input.fieldId,
  });
}

async function readSlimClinicalRows(fieldId: string): Promise<{
  items: SlimClinicalItemRow[];
  cases: SlimClinicalCaseRow[];
} | null> {
  const profiles = boardProfilesForField(fieldId);
  if (profiles.length === 0) return null;
  const timeout = { timeoutMs: BANK_COUNTS_QUERY_TIMEOUT_MS };
  const batches = await sqlQuery<Array<{ batchId: string }>>(
    `
    SELECT batch_id AS "batchId"
    FROM ngn_import_batch
    WHERE board_profile = ANY($1::text[])
    `,
    [profiles],
    timeout
  );
  const batchIds = batches
    .map((row) => row.batchId)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  if (batchIds.length === 0) return null;

  const [items, cases] = await Promise.all([
    sqlQuery<SlimClinicalItemRow[]>(
      `
      SELECT id, version, status,
             case_id AS "caseId",
             case_version AS "caseVersion",
             case_step AS "caseStep",
             item_type AS "itemType",
             COALESCE(client_needs->>'subcategory', '') AS "clientNeedsSubcategory"
      FROM ngn_item
      WHERE batch_id = ANY($1::text[])
      `,
      [batchIds],
      timeout
    ),
    sqlQuery<SlimClinicalCaseRow[]>(
      `
      SELECT id, version, status,
             COALESCE(primary_client_need, '') AS "primaryClientNeed"
      FROM ngn_case
      WHERE batch_id = ANY($1::text[])
      `,
      [batchIds],
      timeout
    ),
  ]);
  return { items: items ?? [], cases: cases ?? [] };
}

async function loadSlimPublishedCatalogUncached(fieldId: string): Promise<PublishedCatalog> {
  const subjects = subjectList(fieldId);
  const rows = await readSlimClinicalRows(fieldId);
  if (!rows) {
    return selectPublishedCatalog({ items: [], cases: [], subjects, fieldId });
  }
  return catalogFromSlimRows({ fieldId, ...rows, subjects });
}

/**
 * Published NGN catalog for counts and review keys.
 * The full chart object is about 2.2MB and Next.js will not store it, so
 * dashboard and question-bank reads use this id/status/label query instead.
 */
export async function loadSlimPublishedCatalog(fieldId: string): Promise<PublishedCatalog> {
  const { readActiveInventoryStampKey } = await import("@/lib/inventory/active-inventory-stamp");
  const stamp = await readActiveInventoryStampKey();
  if (!stamp) return loadSlimPublishedCatalogUncached(fieldId);
  return unstable_cache(
    () => loadSlimPublishedCatalogUncached(fieldId),
    ["published-clinical-slim-v1", fieldId, stamp],
    {
      revalidate: ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
      tags: [ACTIVE_INVENTORY_CACHE_TAG],
    }
  )();
}

/** Question keys a published catalog would serve. Does not load charts. */
export async function loadPublishedClinicalKeys(fieldId: string): Promise<Set<string>> {
  return new Set(servedItemKeys(await loadSlimPublishedCatalog(fieldId)));
}
