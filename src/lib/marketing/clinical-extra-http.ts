/**
 * Published NGN totals for the marketing snapshot.
 *
 * The student catalog loader reads every chart through Prisma's pooled
 * connection. Count revalidation only needs the publish rules, so this path
 * loads the id/status columns over Neon HTTP (one short request, no pool
 * slot) and runs the same `selectPublishedCatalog` filter.
 */
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
import { BANK_COUNTS_QUERY_TIMEOUT_MS } from "@/lib/inventory/active-inventory-cache";

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
    responseFormat: "multiple-response",
    scoringRule: "plus-minus",
    maxPoints: 1,
    stem: "",
    payload: {},
    rationale: { correct: "" },
    clientNeeds: {},
    references: [],
    rnFlags: [],
    status: row.status,
  } as ServeItem;
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

/** Same inclusion rules as the published student catalog. */
export function clinicalExtraFromCatalogRows(input: {
  items: readonly ClinicalItemRow[];
  cases: readonly ClinicalCaseRow[];
}): ClinicalQuestionExtra {
  return clinicalExtraFromCatalog(
    selectPublishedCatalog({
      items: input.items.map(asItem),
      cases: input.cases.map(asCase),
      subjects: [],
      fieldId: "nursing",
    })
  );
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

async function queryClinicalExtrasOverHttp(): Promise<
  Partial<Record<CountBoardSlug, ClinicalQuestionExtra>>
> {
  const profiles = boardProfilesForField("nursing");
  if (profiles.length === 0) return {};
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
  if (batchIds.length === 0) return {};

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
  const extra = clinicalExtraFromCatalogRows({ items: items ?? [], cases: cases ?? [] });
  if (extra.standaloneNgn === 0 && extra.caseStudies === 0 && extra.caseItems === 0) return {};
  return { nclex: extra };
}
