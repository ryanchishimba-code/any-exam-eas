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
  BANK_COUNTS_QUERY_TIMEOUT_MS,
} from "@/lib/inventory/active-inventory-cache";

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
