import {
  canPublish,
  isOwnerAttestation,
  OWNER_ATTESTATION_COMMENT,
  OWNER_FLAG_ACCEPTANCE,
  type ReviewGateInput,
} from "@/lib/assessment/publish-gate";
import type { NgnCase, NgnItem, SourceRef } from "@/lib/assessment/types";

export type PublishItemInput = {
  item: NgnItem;
  batchId: string;
  caseVersion: number | null;
  reviews: ReviewGateInput[];
};

export type PublishCaseInput = {
  id: string;
  version: number;
  batchId: string;
  status: string;
  caseDoc: NgnCase | null;
};

export type StatusChange = {
  id: string;
  version: number;
  from: string;
  to: "published" | "draft";
};

export type BlockedCase = {
  id: string;
  version: number;
  reasons: string[];
};

export type PublishEvaluation = {
  mode: "publish" | "restore";
  itemChanges: StatusChange[];
  caseChanges: StatusChange[];
  blockedCases: BlockedCase[];
  skipped: { id: string; reason: string }[];
  attestations: {
    itemId: string;
    itemVersion: number;
    reviewerName: string;
    licenseType: string;
    flagResolutions: Record<string, string>;
  }[];
  restoreCommand: string;
};

export function ownerReviewerUserId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `owner:${slug || "owner"}`;
}

export function ownerFlagResolutions(flags: readonly string[]): Record<string, string> {
  const resolutions: Record<string, string> = {};
  for (const flag of flags) {
    if (typeof flag !== "string" || !flag.trim()) continue;
    resolutions[flag] = OWNER_FLAG_ACCEPTANCE;
  }
  return resolutions;
}

export function ownerAttestationReview(
  name: string,
  flags: readonly string[] = [],
  licenseType = "PharmD"
): ReviewGateInput {
  const license = licenseType.trim() || "PharmD";
  return {
    reviewerUserId: ownerReviewerUserId(name),
    reviewerName: name.trim(),
    decision: "approve",
    licenseType: license,
    licenseNumber: null,
    licenseState: null,
    comments: OWNER_ATTESTATION_COMMENT,
    flagResolutions: ownerFlagResolutions(flags),
  };
}

export function formatRestoreCommand(selectors: { batchId?: string | null; ids?: readonly string[] | null }): string {
  const parts = ["npx tsx scripts/ngn/publish.ts", "--restore"];
  if (selectors.batchId) parts.push("--batch", selectors.batchId);
  if (selectors.ids && selectors.ids.length > 0) parts.push("--ids", selectors.ids.join(","));
  parts.push("--apply");
  return parts.join(" ");
}

function latestItem(rows: readonly PublishItemInput[]): PublishItemInput | null {
  let best: PublishItemInput | null = null;
  for (const row of rows) {
    if (!best || row.item.version > best.item.version) best = row;
  }
  return best;
}

function selectedItems(items: readonly PublishItemInput[], ids: ReadonlySet<string> | null, batchId: string | null): PublishItemInput[] {
  return items.filter((row) => {
    if (batchId && row.batchId !== batchId) return false;
    if (!ids) return true;
    if (ids.has(row.item.id)) return true;
    if (row.item.caseId && ids.has(row.item.caseId)) return true;
    return false;
  });
}

/**
 * Dry-run plan. Publish updates status only. A case is all-or-nothing.
 * Restore sends the same selection back to draft and does not delete reviews.
 */
export function evaluatePublish(input: {
  items: readonly PublishItemInput[];
  cases: readonly PublishCaseInput[];
  sourcesByBatch: Readonly<Record<string, readonly SourceRef[]>>;
  ids: readonly string[] | null;
  batchId: string | null;
  ownerAttest: string | null;
  /** Credential on the owner sign-off. Defaults to PharmD. This is not RN review. */
  ownerLicense?: string | null;
  /** Record each rn_flag as accepted by the owner. Does not edit the flags on the item. */
  acceptOpenFlags?: boolean;
  restore: boolean;
}): PublishEvaluation {
  const idSet = input.ids && input.ids.length > 0 ? new Set(input.ids) : null;
  const restoreCommand = formatRestoreCommand({ batchId: input.batchId, ids: input.ids });
  const picked = selectedItems(input.items, idSet, input.batchId);
  const caseKeys = new Set(
    picked
      .filter((row) => row.item.caseId && row.caseVersion != null)
      .map((row) => `${row.item.caseId}:${row.caseVersion}`)
  );
  for (const id of idSet ?? []) {
    for (const caseRow of input.cases) {
      if (caseRow.id !== id) continue;
      if (input.batchId && caseRow.batchId !== input.batchId) continue;
      caseKeys.add(`${caseRow.id}:${caseRow.version}`);
    }
  }
  const inScope =
    caseKeys.size === 0
      ? picked
      : input.items.filter((row) => {
          if (input.batchId && row.batchId !== input.batchId) return false;
          if (picked.includes(row)) return true;
          return Boolean(row.item.caseId && row.caseVersion != null && caseKeys.has(`${row.item.caseId}:${row.caseVersion}`));
        });
  const knownIds = new Set(inScope.flatMap((row) => [row.item.id, row.item.caseId ?? ""]));
  const skipped: { id: string; reason: string }[] = [];
  if (idSet) {
    for (const id of idSet) {
      const caseHit = input.cases.some((row) => row.id === id && (!input.batchId || row.batchId === input.batchId));
      if (!knownIds.has(id) && !caseHit) skipped.push({ id, reason: "not found in the selected batch" });
    }
  }

  if (input.restore) {
    const itemChanges: StatusChange[] = [];
    const caseIds = new Set<string>();
    for (const row of inScope) {
      if (row.item.status !== "published") {
        skipped.push({ id: row.item.id, reason: "already draft" });
        continue;
      }
      itemChanges.push({
        id: row.item.id,
        version: row.item.version,
        from: row.item.status,
        to: "draft",
      });
      if (row.item.caseId) caseIds.add(`${row.item.caseId}:${row.caseVersion ?? ""}`);
    }
    for (const id of idSet ?? []) {
      const matches = input.cases.filter(
        (row) => row.id === id && (!input.batchId || row.batchId === input.batchId)
      );
      for (const row of matches) caseIds.add(`${row.id}:${row.version}`);
    }
    const caseChanges: StatusChange[] = [];
    for (const key of caseIds) {
      const [id, versionRaw] = key.split(":");
      const version = Number(versionRaw);
      const row = input.cases.find((entry) => entry.id === id && entry.version === version);
      if (!row) continue;
      if (row.status !== "published") continue;
      caseChanges.push({ id: row.id, version: row.version, from: row.status, to: "draft" });
    }
    return {
      mode: "restore",
      itemChanges,
      caseChanges,
      blockedCases: [],
      skipped,
      attestations: [],
      restoreCommand,
    };
  }

  const groups = new Map<string, PublishItemInput[]>();
  const standalones: PublishItemInput[] = [];
  for (const row of inScope) {
    if (row.item.caseId && row.caseVersion != null) {
      const key = `${row.item.caseId}:${row.caseVersion}`;
      const list = groups.get(key) ?? [];
      list.push(row);
      groups.set(key, list);
    } else {
      standalones.push(row);
    }
  }

  const attestations: PublishEvaluation["attestations"] = [];
  const itemChanges: StatusChange[] = [];
  const caseChanges: StatusChange[] = [];
  const blockedCases: BlockedCase[] = [];

  const reviewsFor = (row: PublishItemInput): ReviewGateInput[] => {
    const reviews = [...row.reviews];
    if (!input.ownerAttest) return reviews;
    const flags = input.acceptOpenFlags ? row.item.rnFlags : [];
    const attestation = ownerAttestationReview(
      input.ownerAttest,
      flags,
      input.ownerLicense ?? "PharmD"
    );
    const already = reviews.some((review) => {
      if (!isOwnerAttestation(review)) return false;
      const sameOwner =
        review.reviewerName?.trim() === attestation.reviewerName ||
        review.reviewerUserId === attestation.reviewerUserId;
      if (!sameOwner) return false;
      if (!input.acceptOpenFlags) return true;
      return row.item.rnFlags.every((flag) => review.flagResolutions?.[flag]?.trim());
    });
    if (!already) {
      reviews.push(attestation);
      attestations.push({
        itemId: row.item.id,
        itemVersion: row.item.version,
        reviewerName: attestation.reviewerName ?? input.ownerAttest,
        licenseType: attestation.licenseType?.trim() || "PharmD",
        flagResolutions: { ...(attestation.flagResolutions ?? {}) },
      });
    }
    return reviews;
  };

  const consider = (row: PublishItemInput) => {
    const latestRow = latestItem(inScope.filter((entry) => entry.item.id === row.item.id)) ?? row;
    if (latestRow.item.version !== row.item.version) return null;
    const caseDoc =
      input.cases.find((entry) => entry.id === row.item.caseId && entry.version === row.caseVersion)?.caseDoc ??
      null;
    return canPublish(latestRow.item, {
      sources: input.sourcesByBatch[latestRow.batchId] ?? [],
      caseDoc,
      reviews: reviewsFor(latestRow),
    });
  };

  for (const row of standalones) {
    const gate = consider(row);
    if (!gate) continue;
    if (!gate.ok) {
      skipped.push({
        id: row.item.id,
        reason: gate.errors[0] ?? "publish gate is closed",
      });
      continue;
    }
    if (row.item.status === "published") {
      skipped.push({ id: row.item.id, reason: "already published" });
      continue;
    }
    itemChanges.push({
      id: row.item.id,
      version: row.item.version,
      from: row.item.status ?? "draft",
      to: "published",
    });
  }

  for (const [key, members] of groups) {
    const [caseId, versionRaw] = key.split(":");
    const version = Number(versionRaw);
    const caseRow = input.cases.find((entry) => entry.id === caseId && entry.version === version);
    const reasons: string[] = [];
    const ready: PublishItemInput[] = [];
    for (const row of members) {
      const gate = consider(row);
      if (!gate) continue;
      if (!gate.ok) {
        const detail = gate.errors.length > 0 ? gate.errors.join("; ") : "publish gate is closed";
        reasons.push(`${row.item.id}: ${detail}`);
        continue;
      }
      ready.push(row);
    }
    if (reasons.length > 0 || ready.length === 0) {
      blockedCases.push({
        id: caseId!,
        version,
        reasons: reasons.length > 0 ? reasons : ["no item in this case passed the publish gate"],
      });
      continue;
    }
    if (!caseRow) {
      blockedCases.push({ id: caseId!, version, reasons: ["case row is missing"] });
      continue;
    }
    for (const row of ready) {
      if (row.item.status === "published") continue;
      itemChanges.push({
        id: row.item.id,
        version: row.item.version,
        from: row.item.status ?? "draft",
        to: "published",
      });
    }
    if (caseRow.status !== "published") {
      caseChanges.push({
        id: caseRow.id,
        version: caseRow.version,
        from: caseRow.status,
        to: "published",
      });
    }
  }

  return {
    mode: "publish",
    itemChanges,
    caseChanges,
    blockedCases,
    skipped,
    attestations,
    restoreCommand,
  };
}
