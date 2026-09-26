import { prisma } from "@/lib/prisma";
import { canPublish, type ReviewGateInput } from "@/lib/assessment/publish-gate";
import type { NgnCase, NgnChart, NgnItem, NgnPatient, NgnTimepoint, SourceRef } from "@/lib/assessment/types";

export type StoredReview = ReviewGateInput & {
  id: string;
  reviewerName: string;
  multistateNlc: boolean;
  nursysVerifiedOn: string;
  nursysResult: string;
  rubric: Record<string, number>;
  flagResolutions: Record<string, string>;
  comments: string;
  minutesSpent: number;
  createdAt: string;
};

export type ReviewListRow = {
  id: string;
  version: number;
  itemType: string;
  responseFormat: string;
  status: string;
  caseId: string | null;
  caseStep: number | null;
  label: string;
  approvalCount: number;
  reviewCount: number;
  canPublish: boolean;
  validatorErrors: number;
};

export type ReviewIndex =
  | {
      ok: true;
      batches: { batchId: string; importedAt: string; itemCount: number }[];
      rows: ReviewListRow[];
    }
  | { ok: false; reason: "missing_schema" | "unavailable"; message: string };

export type ItemReviewDetail =
  | {
      ok: true;
      item: NgnItem;
      caseDoc: NgnCase | null;
      siblings: NgnItem[];
      reviews: StoredReview[];
      sources: SourceRef[];
      gate: ReturnType<typeof canPublish>;
    }
  | { ok: false; reason: "missing" | "missing_schema" | "unavailable"; message: string };

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

function storeFailure(error: unknown): { reason: "missing_schema" | "unavailable"; message: string } {
  const message = error instanceof Error ? error.message : "NGN tables could not be read.";
  const code = error && typeof error === "object" && "code" in error ? String((error as { code?: string }).code) : "";
  if (code === "P2021" || code === "P2022" || /ngn_|does not exist/i.test(message)) {
    return {
      reason: "missing_schema",
      message: "The NGN tables are not in this database. Apply the additive migration on a non-production database before review.",
    };
  }
  return { reason: "unavailable", message };
}

type ItemRow = {
  id: string;
  version: number;
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
};

function toItem(row: ItemRow): NgnItem {
  const cjmm = row.cjmmFunction;
  return {
    id: row.id,
    version: row.version,
    itemType: row.itemType as NgnItem["itemType"],
    caseId: row.caseId,
    caseStep: row.caseStep,
    caseVersion: row.caseVersion,
    cjmmFunction: Array.isArray(cjmm) || typeof cjmm === "string" ? (cjmm as string | string[]) : [],
    timepoint: row.timepoint,
    responseFormat: row.responseFormat as NgnItem["responseFormat"],
    scoringRule: row.scoringRule as NgnItem["scoringRule"],
    maxPoints: row.maxPoints,
    stem: row.stem,
    payload: asRecord(row.payload),
    exhibit: row.exhibit && typeof row.exhibit === "object" ? (row.exhibit as Record<string, unknown>) : null,
    rationale: row.rationale as NgnItem["rationale"],
    clientNeeds: asRecord(row.clientNeeds) as NgnItem["clientNeeds"],
    references: Array.isArray(row.references) ? (row.references as NgnItem["references"]) : [],
    rnFlags: Array.isArray(row.rnFlags) ? row.rnFlags.filter((flag): flag is string => typeof flag === "string") : [],
    status: row.status,
  };
}

function toCase(row: {
  id: string;
  version: number;
  title: string;
  boardProfile: string;
  status: string;
  primaryClientNeed: string;
  setting: string;
  patient: unknown;
  timepoints: unknown;
  chart: unknown;
  revealRule: string;
  references: unknown;
}, items: NgnItem[]): NgnCase {
  return {
    id: row.id,
    version: row.version,
    title: row.title,
    boardProfile: row.boardProfile,
    status: row.status,
    primaryClientNeed: row.primaryClientNeed,
    setting: row.setting,
    patient: row.patient as NgnPatient,
    timepoints: (Array.isArray(row.timepoints) ? row.timepoints : []) as NgnTimepoint[],
    chart: (row.chart && typeof row.chart === "object" ? row.chart : { tabs: [] }) as NgnChart,
    revealRule: row.revealRule,
    references: Array.isArray(row.references) ? (row.references as NgnCase["references"]) : [],
    items,
  };
}

function toReview(row: {
  id: string;
  reviewerUserId: string;
  reviewerName: string;
  licenseType: string;
  licenseNumber: string;
  licenseState: string;
  multistateNlc: boolean;
  nursysVerifiedOn: Date;
  nursysResult: string;
  decision: string;
  rubric: unknown;
  flagResolutions: unknown;
  comments: string;
  minutesSpent: number;
  createdAt: Date;
}): StoredReview {
  const rubric: Record<string, number> = {};
  for (const [key, value] of Object.entries(asRecord(row.rubric))) {
    if (typeof value === "number") rubric[key] = value;
  }
  const flagResolutions: Record<string, string> = {};
  for (const [key, value] of Object.entries(asRecord(row.flagResolutions))) {
    if (typeof value === "string") flagResolutions[key] = value;
  }
  return {
    id: row.id,
    reviewerUserId: row.reviewerUserId,
    reviewerName: row.reviewerName,
    licenseType: row.licenseType,
    licenseNumber: row.licenseNumber,
    licenseState: row.licenseState,
    multistateNlc: row.multistateNlc,
    nursysVerifiedOn: row.nursysVerifiedOn.toISOString().slice(0, 10),
    nursysResult: row.nursysResult,
    decision: row.decision,
    rubric,
    flagResolutions,
    comments: row.comments,
    minutesSpent: row.minutesSpent,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function loadReviewIndex(filters: {
  batchId?: string;
  status?: string;
  progress?: string;
}): Promise<ReviewIndex> {
  try {
    const batches = await prisma.ngnImportBatch.findMany({
      orderBy: { importedAt: "desc" },
      include: { _count: { select: { items: true } } },
    });
    const items = await prisma.ngnItem.findMany({
      where: {
        ...(filters.batchId ? { batchId: filters.batchId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      },
      orderBy: [{ id: "asc" }, { version: "asc" }],
    });
    const cases = await prisma.ngnCase.findMany({
      where: filters.batchId ? { batchId: filters.batchId } : undefined,
    });
    const reviews = items.length
      ? await prisma.ngnItemReview.findMany({
          where: { itemId: { in: items.map((item) => item.id) } },
        })
      : [];
    const caseByKey = new Map(cases.map((row) => [`${row.id}:${row.version}`, row]));
    const sourcesByBatch = new Map(
      batches.map((batch) => [batch.batchId, (Array.isArray(batch.sources) ? batch.sources : []) as SourceRef[]])
    );

    const rows: ReviewListRow[] = items.map((row) => {
      const item = toItem(row);
      const caseRow = row.caseId ? caseByKey.get(`${row.caseId}:${row.caseVersion}`) : undefined;
      const caseDoc = caseRow
        ? toCase(
            caseRow,
            items.filter((sibling) => sibling.caseId === row.caseId).map((sibling) => toItem(sibling))
          )
        : null;
      const itemReviews = reviews
        .filter((review) => review.itemId === row.id && review.itemVersion === row.version)
        .map(toReview);
      const gate = canPublish(item, {
        sources: sourcesByBatch.get(row.batchId) ?? [],
        caseDoc,
        reviews: itemReviews,
      });
      return {
        id: row.id,
        version: row.version,
        itemType: row.itemType,
        responseFormat: row.responseFormat,
        status: row.status,
        caseId: row.caseId,
        caseStep: row.caseStep,
        label: caseRow ? `${caseRow.title} · step ${row.caseStep}` : item.stem.slice(0, 96),
        approvalCount: gate.approvalCount,
        reviewCount: itemReviews.length,
        canPublish: gate.ok,
        validatorErrors: gate.errors.length,
      };
    });

    const progress = filters.progress;
    const filtered = rows.filter((row) => {
      if (progress === "unreviewed") return row.reviewCount === 0;
      if (progress === "in_review") return row.reviewCount > 0 && !row.canPublish;
      if (progress === "ready") return row.canPublish;
      return true;
    });

    return {
      ok: true,
      batches: batches.map((batch) => ({
        batchId: batch.batchId,
        importedAt: batch.importedAt.toISOString(),
        itemCount: batch._count.items,
      })),
      rows: filtered,
    };
  } catch (error) {
    const failure = storeFailure(error);
    return { ok: false, ...failure };
  }
}

export async function loadItemReview(itemId: string, version: number): Promise<ItemReviewDetail> {
  try {
    const row = await prisma.ngnItem.findUnique({
      where: { id_version: { id: itemId, version } },
    });
    if (!row) return { ok: false, reason: "missing", message: "Item not found." };
    const batch = await prisma.ngnImportBatch.findUnique({ where: { batchId: row.batchId } });
    const sources = (Array.isArray(batch?.sources) ? batch?.sources : []) as SourceRef[];
    const siblingRows = row.caseId
      ? await prisma.ngnItem.findMany({
          where: { caseId: row.caseId, caseVersion: row.caseVersion },
          orderBy: { caseStep: "asc" },
        })
      : [row];
    const siblings = siblingRows.map(toItem);
    const item = toItem(row);
    const caseRow = row.caseId
      ? await prisma.ngnCase.findUnique({
          where: { id_version: { id: row.caseId, version: row.caseVersion ?? 1 } },
        })
      : null;
    const caseDoc = caseRow ? toCase(caseRow, siblings) : null;
    const reviews = (
      await prisma.ngnItemReview.findMany({
        where: { itemId: row.id, itemVersion: row.version },
        orderBy: { createdAt: "asc" },
      })
    ).map(toReview);
    return {
      ok: true,
      item,
      caseDoc,
      siblings,
      reviews,
      sources,
      gate: canPublish(item, { sources, caseDoc, reviews }),
    };
  } catch (error) {
    const failure = storeFailure(error);
    return { ok: false, ...failure };
  }
}
