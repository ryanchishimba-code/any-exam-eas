/**
 * Decide which Item QA near-duplicates may be retired.
 *
 * The audit queues the higher id and keeps the lower id. This planner walks
 * each queued higher id along partner links and retires every queued id on
 * that walk. It never selects the keeper. The write helper only sets
 * active=false plus the QA flag update.
 *
 * Partner-chain algorithm
 * -----------------------
 * Each queued near-duplicate stores one partner id. A row is a candidate only
 * when that partner id is strictly lower than its own id. Following those
 * edges is a strictly decreasing sequence. A decreasing sequence cannot repeat
 * an id, so a long chain is not a cycle and does not need a hop cap.
 *
 * An earlier cap of 12 skipped the tail of real clusters as `chain_too_long`
 * (the nursing rows still queued after the first apply). Those higher ids are
 * eligible now. The walk still records seen ids and returns `cycle` if an id
 * repeats, so a corrupt partner map cannot loop or retire around a cycle.
 *
 * The walk stops at the first id that is not itself a queued near-duplicate.
 * That id must be an active keeper in the same field and lower than the start
 * id. Resolved ends are memoized, so a chain of length n is linear. After the
 * plan is built, a retire id that is also someone's keeper is dropped
 * (`keeper_in_retire_set`).
 */
import {
  ITEM_QA_PIPELINE,
  NEAR_DUPLICATE_CODE,
  readItemQaRecord,
  withItemQaRecord,
  type ItemQaRecord,
} from "./flag";

export type NearDuplicateBankRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  active: boolean;
  qaPassed: boolean;
  reviewFlag: boolean | null;
  curationMeta: unknown;
};

export type NearDuplicateKeeperRow = {
  id: string;
  fieldId: string;
  active: boolean;
};

export type NearDuplicateSkipReason =
  | "inactive"
  | "not_flagged"
  | "other_field"
  | "partner_missing"
  | "partner_not_lower_id"
  | "keeper_missing"
  | "keeper_inactive"
  | "keeper_other_field"
  | "keeper_not_lower_id"
  | "cycle"
  | "keeper_in_retire_set";

export type NearDuplicateRetireItem = {
  id: string;
  fieldId: string;
  subjectId: string;
  partnerId: string;
  rootKeepId: string;
  qaPassed: boolean;
  remainingCodes: string[];
  reviewFlagAfter: boolean;
};

export type NearDuplicateSkip = {
  id: string;
  reason: NearDuplicateSkipReason;
  partnerId?: string;
};

export type NearDuplicateRetirePlan = {
  fieldId: string;
  retire: NearDuplicateRetireItem[];
  skipped: NearDuplicateSkip[];
  /** Flagged rows that are not near-duplicates. They stay in the queue. */
  leftInQueue: number;
  /** Retired rows that currently count in the public inventory (qaPassed). */
  publishedInventoryDrop: number;
};

type Candidate = {
  row: NearDuplicateBankRow;
  partnerId: string;
  remainingCodes: string[];
};

type ChainEnd = { rootKeepId: string } | { reason: NearDuplicateSkipReason };

/** Keeper-lower-than-start is per row. Shared chain failures are not. */
function forStart(startId: string, resolved: ChainEnd): ChainEnd {
  if ("reason" in resolved) return resolved;
  if (!(resolved.rootKeepId < startId)) return { reason: "keeper_not_lower_id" };
  return resolved;
}

function partnerIdOf(record: ItemQaRecord): string | null {
  const partnerId = record.partnerId?.trim();
  return partnerId ? partnerId : null;
}

/**
 * Columns the apply path is allowed to write. qaPassed is intentionally absent.
 */
export function nearDuplicateRetireWrite(input: {
  curationMeta: unknown;
  retiredAt: string;
  rootKeepId: string;
}): { active: false; reviewFlag: boolean; curationMeta: Record<string, unknown> } | null {
  const record = readItemQaRecord(input.curationMeta);
  if (!record?.codes.includes(NEAR_DUPLICATE_CODE)) return null;
  const remainingCodes = record.codes.filter((code) => code !== NEAR_DUPLICATE_CODE);
  const summary = remainingCodes.length
    ? `Retired as near-duplicate of ${input.rootKeepId}. Remaining item QA: ${remainingCodes.join(", ")}.`
    : `Retired as near-duplicate of ${input.rootKeepId}.`;
  const next: ItemQaRecord = {
    pipeline: ITEM_QA_PIPELINE,
    checkedAt: record.checkedAt,
    codes: remainingCodes,
    summary,
    partnerId: input.rootKeepId,
    retiredAt: input.retiredAt,
    retiredReason: "near_duplicate",
  };
  return {
    active: false,
    reviewFlag: remainingCodes.length > 0,
    curationMeta: withItemQaRecord(input.curationMeta, next),
  };
}

export function planNearDuplicateRetirements(input: {
  fieldId: string;
  rows: readonly NearDuplicateBankRow[];
  keepers: ReadonlyMap<string, NearDuplicateKeeperRow>;
}): NearDuplicateRetirePlan {
  const skipped: NearDuplicateSkip[] = [];
  const candidates = new Map<string, Candidate>();
  let leftInQueue = 0;

  for (const row of input.rows) {
    if (row.fieldId !== input.fieldId) {
      skipped.push({ id: row.id, reason: "other_field" });
      continue;
    }
    if (!row.active) {
      skipped.push({ id: row.id, reason: "inactive" });
      continue;
    }
    if (row.reviewFlag !== true) {
      skipped.push({ id: row.id, reason: "not_flagged" });
      continue;
    }

    const record = readItemQaRecord(row.curationMeta);
    if (!record?.codes.includes(NEAR_DUPLICATE_CODE)) {
      leftInQueue += 1;
      continue;
    }

    const partnerId = partnerIdOf(record);
    if (!partnerId) {
      skipped.push({ id: row.id, reason: "partner_missing" });
      continue;
    }
    if (!(partnerId < row.id)) {
      skipped.push({ id: row.id, reason: "partner_not_lower_id", partnerId });
      continue;
    }

    candidates.set(row.id, {
      row,
      partnerId,
      remainingCodes: record.codes.filter((code) => code !== NEAR_DUPLICATE_CODE),
    });
  }

  const retire: NearDuplicateRetireItem[] = [];
  const memo = new Map<string, ChainEnd>();

  const resolveRoot = (startId: string): ChainEnd => {
    const seen = new Set<string>();
    const trail: string[] = [];
    let current = startId;

    while (candidates.has(current)) {
      const cached = memo.get(current);
      if (cached) {
        for (const id of trail) memo.set(id, cached);
        return forStart(startId, cached);
      }
      if (seen.has(current)) {
        const failure: ChainEnd = { reason: "cycle" };
        for (const id of trail) memo.set(id, failure);
        return failure;
      }
      seen.add(current);
      trail.push(current);
      const partnerId = candidates.get(current)!.partnerId;
      if (!(partnerId < current)) {
        const failure: ChainEnd = { reason: "partner_not_lower_id" };
        for (const id of trail) memo.set(id, failure);
        return failure;
      }
      current = partnerId;
    }

    const keeper = input.keepers.get(current);
    const resolved: ChainEnd = !keeper
      ? { reason: "keeper_missing" }
      : keeper.fieldId !== input.fieldId
        ? { reason: "keeper_other_field" }
        : !keeper.active
          ? { reason: "keeper_inactive" }
          : { rootKeepId: keeper.id };
    for (const id of trail) memo.set(id, resolved);
    return forStart(startId, resolved);
  };

  for (const candidate of candidates.values()) {
    const root = resolveRoot(candidate.row.id);
    if ("reason" in root) {
      skipped.push({
        id: candidate.row.id,
        reason: root.reason,
        partnerId: candidate.partnerId,
      });
      continue;
    }
    retire.push({
      id: candidate.row.id,
      fieldId: candidate.row.fieldId,
      subjectId: candidate.row.subjectId,
      partnerId: candidate.partnerId,
      rootKeepId: root.rootKeepId,
      qaPassed: candidate.row.qaPassed,
      remainingCodes: candidate.remainingCodes,
      reviewFlagAfter: candidate.remainingCodes.length > 0,
    });
  }

  const keeperIds = new Set(retire.map((item) => item.rootKeepId));
  const safe: NearDuplicateRetireItem[] = [];
  for (const item of retire) {
    if (keeperIds.has(item.id)) {
      skipped.push({ id: item.id, reason: "keeper_in_retire_set", partnerId: item.partnerId });
      continue;
    }
    safe.push(item);
  }

  safe.sort((a, b) => a.id.localeCompare(b.id));
  skipped.sort((a, b) => a.id.localeCompare(b.id) || a.reason.localeCompare(b.reason));

  return {
    fieldId: input.fieldId,
    retire: safe,
    skipped,
    leftInQueue,
    publishedInventoryDrop: safe.filter((item) => item.qaPassed).length,
  };
}
