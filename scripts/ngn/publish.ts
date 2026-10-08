#!/usr/bin/env node
/**
 * Publish or unpublish NGN items. Default is a dry run.
 *
 *   npx tsx scripts/ngn/publish.ts --batch ngn-pilot-2026-09-26 --owner-attest "Ryan Chishimba, PharmD" --accept-open-flags
 *   npx tsx scripts/ngn/publish.ts --batch ngn-pilot-2026-09-26 --owner-attest "Ryan Chishimba, PharmD" --license PharmD --accept-open-flags --apply
 *   npx tsx scripts/ngn/publish.ts --restore --batch ngn-pilot-2026-09-26 --apply
 *
 * --apply is allowed in production. It updates status only and, with
 * --owner-attest, appends ngn_item_review rows. --accept-open-flags records
 * each rn_flag as "accepted by owner" on that review's flag_resolutions.
 * It never edits stems, options, keys, rationales, or rn_flags, and it never
 * writes QuestionBankItem. Cases publish and unpublish as a whole.
 * One failing item keeps the case draft.
 */
import { sortNgnItemsByCaseStep } from "../../src/lib/assessment/case-order";
import type { ReviewGateInput } from "../../src/lib/assessment/publish-gate";
import {
  evaluatePublish,
  formatRestoreCommand,
  ownerReviewerUserId,
  type PublishCaseInput,
  type PublishItemInput,
} from "../../src/lib/assessment/publish-run";
import type { NgnCase, NgnItem, NgnReference, SourceRef } from "../../src/lib/assessment/types";
import { loadEnvFiles } from "../load-env";

type PrismaLike = {
  $transaction: <T>(fn: (tx: PrismaLike) => Promise<T>) => Promise<T>;
  ngnImportBatch: {
    findMany: (args: { where?: Record<string, unknown> }) => Promise<
      { batchId: string; sources: unknown }[]
    >;
  };
  ngnCase: {
    findMany: (args: { where?: Record<string, unknown> }) => Promise<CaseRow[]>;
    update: (args: { where: { id_version: { id: string; version: number } }; data: { status: string } }) => Promise<unknown>;
  };
  ngnItem: {
    findMany: (args: {
      where?: Record<string, unknown>;
      orderBy?: { caseStep?: "asc" | "desc"; id?: "asc" | "desc" }[];
    }) => Promise<ItemRow[]>;
    update: (args: { where: { id_version: { id: string; version: number } }; data: { status: string } }) => Promise<unknown>;
  };
  ngnItemReview: {
    findMany: (args: { where?: Record<string, unknown> }) => Promise<ReviewRow[]>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  $disconnect: () => Promise<void>;
};

type ItemRow = {
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
};

type CaseRow = {
  id: string;
  version: number;
  batchId: string;
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
};

type ReviewRow = {
  itemId: string;
  itemVersion: number;
  reviewerUserId: string;
  reviewerName: string;
  decision: string;
  licenseType: string;
  licenseNumber: string | null;
  licenseState: string | null;
  comments: string;
  flagResolutions: unknown;
};

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

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
    references: Array.isArray(row.references) ? (row.references as NgnReference[]) : [],
    rnFlags: Array.isArray(row.rnFlags) ? row.rnFlags.filter((flag): flag is string => typeof flag === "string") : [],
    status: row.status,
  };
}

function toCase(row: CaseRow, items: NgnItem[]): NgnCase {
  return {
    id: row.id,
    version: row.version,
    title: row.title,
    boardProfile: row.boardProfile,
    status: row.status,
    primaryClientNeed: row.primaryClientNeed,
    setting: row.setting,
    patient: row.patient as NgnCase["patient"],
    timepoints: (Array.isArray(row.timepoints) ? row.timepoints : []) as NgnCase["timepoints"],
    chart: (row.chart && typeof row.chart === "object" ? row.chart : { tabs: [] }) as NgnCase["chart"],
    revealRule: row.revealRule,
    references: Array.isArray(row.references) ? (row.references as NgnReference[]) : [],
    items,
  };
}

function toReview(row: ReviewRow): ReviewGateInput {
  return {
    reviewerUserId: row.reviewerUserId,
    reviewerName: row.reviewerName,
    decision: row.decision,
    licenseType: row.licenseType,
    licenseNumber: row.licenseNumber,
    licenseState: row.licenseState,
    comments: row.comments,
    flagResolutions: stringRecord(row.flagResolutions),
  };
}

function stringRecord(value: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") out[key] = entry;
  }
  return out;
}

async function main() {
  const apply = hasFlag("--apply");
  const restore = hasFlag("--restore");
  const batchId = argValue("--batch") ?? null;
  const idsRaw = argValue("--ids");
  const ownerAttest = argValue("--owner-attest")?.trim() || null;
  const ownerLicense = argValue("--license")?.trim() || "PharmD";
  const ids = idsRaw
    ? idsRaw
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : null;
  if (!batchId && (!ids || ids.length === 0)) {
    fail("Pass --ids and/or --batch. Nothing was written.");
  }
  const acceptOpenFlags = hasFlag("--accept-open-flags");
  if (ownerAttest && restore) {
    fail("--owner-attest applies to publish, not --restore.");
  }
  if (acceptOpenFlags && restore) {
    fail("--accept-open-flags applies to publish, not --restore.");
  }
  if (acceptOpenFlags && !ownerAttest) {
    fail("--accept-open-flags requires --owner-attest.");
  }

  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set.");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient() as unknown as PrismaLike;

  try {
    const batches = await prisma.ngnImportBatch.findMany({
      where: batchId ? { batchId } : {},
    });
    const batchIds = batches.map((batch) => batch.batchId);
    const itemRows = batchIds.length
      ? await prisma.ngnItem.findMany({
          where: { batchId: { in: batchIds } },
          orderBy: [{ caseStep: "asc" }, { id: "asc" }],
        })
      : [];
    const caseRows = batchIds.length
      ? await prisma.ngnCase.findMany({ where: { batchId: { in: batchIds } } })
      : [];
    const reviewRows = itemRows.length
      ? await prisma.ngnItemReview.findMany({
          where: { itemId: { in: [...new Set(itemRows.map((row) => row.id))] } },
        })
      : [];

    const itemsByCase = new Map<string, NgnItem[]>();
    const publishItems: PublishItemInput[] = itemRows.map((row) => {
      const item = toItem(row);
      if (row.caseId && row.caseVersion != null) {
        const key = `${row.caseId}:${row.caseVersion}`;
        const list = itemsByCase.get(key) ?? [];
        list.push(item);
        itemsByCase.set(key, list);
      }
      return {
        item,
        batchId: row.batchId,
        caseVersion: row.caseVersion,
        reviews: reviewRows
          .filter((review) => review.itemId === row.id && review.itemVersion === row.version)
          .map(toReview),
      };
    });
    const publishCases: PublishCaseInput[] = caseRows.map((row) => ({
      id: row.id,
      version: row.version,
      batchId: row.batchId,
      status: row.status,
      caseDoc: toCase(row, sortNgnItemsByCaseStep(itemsByCase.get(`${row.id}:${row.version}`) ?? [])),
    }));
    const sourcesByBatch: Record<string, SourceRef[]> = {};
    for (const batch of batches) {
      sourcesByBatch[batch.batchId] = Array.isArray(batch.sources) ? (batch.sources as SourceRef[]) : [];
    }

    const plan = evaluatePublish({
      items: publishItems,
      cases: publishCases,
      sourcesByBatch,
      ids,
      batchId,
      ownerAttest,
      ownerLicense,
      acceptOpenFlags,
      restore,
    });

    console.log(`NGN publish — ${apply ? "APPLY" : "DRY RUN (no database writes)"}`);
    console.log(`mode: ${plan.mode}`);
    if (batchId) console.log(`batch: ${batchId}`);
    if (ids) console.log(`ids: ${ids.join(", ")}`);
    console.log(`items to update: ${plan.itemChanges.length}`);
    for (const change of plan.itemChanges) {
      console.log(`  item ${change.id} v${change.version}: ${change.from} -> ${change.to}`);
    }
    console.log(`cases to update: ${plan.caseChanges.length}`);
    for (const change of plan.caseChanges) {
      console.log(`  case ${change.id} v${change.version}: ${change.from} -> ${change.to}`);
    }
    if (plan.blockedCases.length > 0) {
      console.log("blocked cases (left draft):");
      for (const blocked of plan.blockedCases) {
        console.log(`  case ${blocked.id} v${blocked.version}`);
        for (const reason of blocked.reasons) console.log(`    ${reason}`);
      }
    }
    if (plan.skipped.length > 0) {
      console.log("skipped:");
      for (const skip of plan.skipped) console.log(`  ${skip.id}: ${skip.reason}`);
    }
    if (plan.attestations.length > 0) {
      const accepted = plan.attestations.reduce(
        (sum, attestation) => sum + Object.keys(attestation.flagResolutions).length,
        0
      );
      console.log(
        `${apply ? "recording" : "would record"} ${plan.attestations.length} owner attestation review${plan.attestations.length === 1 ? "" : "s"}`
      );
      if (acceptOpenFlags) {
        console.log(`open RN flags recorded as accepted by the owner: ${accepted} (rn_flags on the items are unchanged)`);
      }
    }
    console.log(`restore command: ${plan.restoreCommand}`);

    if (!apply) {
      console.log("Dry run complete. Re-run with --apply to write status changes.");
      return;
    }

    await prisma.$transaction(async (tx) => {
      for (const attestation of plan.attestations) {
        const name = ownerAttest ?? attestation.reviewerName;
        await tx.ngnItemReview.create({
          data: {
            itemId: attestation.itemId,
            itemVersion: attestation.itemVersion,
            reviewerUserId: ownerReviewerUserId(name),
            reviewerName: name,
            licenseType: attestation.licenseType,
            licenseNumber: null,
            licenseState: null,
            multistateNlc: null,
            nursysVerifiedOn: null,
            nursysResult: null,
            decision: "approve",
            rubric: {},
            flagResolutions: attestation.flagResolutions,
            comments: "owner attestation (not RN review)",
            minutesSpent: 0,
          },
        });
      }
      for (const change of plan.itemChanges) {
        await tx.ngnItem.update({
          where: { id_version: { id: change.id, version: change.version } },
          data: { status: change.to },
        });
      }
      for (const change of plan.caseChanges) {
        await tx.ngnCase.update({
          where: { id_version: { id: change.id, version: change.version } },
          data: { status: change.to },
        });
      }
    });
    console.log("apply complete. Status only. Stems, options, keys, and rationales were not edited.");
    console.log(`restore command: ${formatRestoreCommand({ batchId, ids })}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
