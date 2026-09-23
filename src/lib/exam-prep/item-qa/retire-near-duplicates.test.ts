import { describe, expect, it } from "vitest";
import { readItemQaRecord } from "./flag";
import {
  MAX_NEAR_DUPLICATE_CHAIN,
  nearDuplicateRetireWrite,
  planNearDuplicateRetirements,
  type NearDuplicateBankRow,
  type NearDuplicateKeeperRow,
} from "./retire-near-duplicates";

const RETIRED_AT = "2026-09-23T00:00:00.000Z";

function flagged(input: {
  id: string;
  partnerId?: string;
  codes?: string[];
  active?: boolean;
  qaPassed?: boolean;
  reviewFlag?: boolean | null;
  fieldId?: string;
  subjectId?: string;
  extraMeta?: Record<string, unknown>;
}): NearDuplicateBankRow {
  return {
    id: input.id,
    fieldId: input.fieldId ?? "nursing",
    subjectId: input.subjectId ?? "management-of-care",
    active: input.active ?? true,
    qaPassed: input.qaPassed ?? true,
    reviewFlag: input.reviewFlag === undefined ? true : input.reviewFlag,
    curationMeta: {
      cluster: "keep-me",
      ...(input.extraMeta ?? {}),
      itemQa: {
        pipeline: "item-qa-v1",
        checkedAt: RETIRED_AT,
        codes: input.codes ?? ["near_duplicate"],
        summary: input.partnerId ? `Near-duplicate of ${input.partnerId}.` : "Flagged by item QA.",
        ...(input.partnerId ? { partnerId: input.partnerId } : {}),
      },
    },
  };
}

function keeper(id: string, overrides: Partial<NearDuplicateKeeperRow> = {}): NearDuplicateKeeperRow {
  return { id, fieldId: "nursing", active: true, ...overrides };
}

function keepersOf(...rows: NearDuplicateKeeperRow[]): Map<string, NearDuplicateKeeperRow> {
  return new Map(rows.map((row) => [row.id, row]));
}

describe("planNearDuplicateRetirements", () => {
  it("retires the higher flagged id and leaves the lower keeper out of the plan", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [flagged({ id: "item-b", partnerId: "item-a" })],
      keepers: keepersOf(keeper("item-a")),
    });

    expect(plan.retire.map((item) => item.id)).toEqual(["item-b"]);
    expect(plan.retire[0]).toMatchObject({
      partnerId: "item-a",
      rootKeepId: "item-a",
      qaPassed: true,
      reviewFlagAfter: false,
      remainingCodes: [],
    });
    expect(plan.retire.some((item) => item.id === "item-a")).toBe(false);
    expect(plan.publishedInventoryDrop).toBe(1);
    expect(plan.skipped).toEqual([]);
  });

  it("leaves text-only flags queued and does not count an unpublished duplicate in the inventory drop", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [
        flagged({ id: "trunc", codes: ["truncated_option"], partnerId: "item-a" }),
        flagged({ id: "empty", codes: ["empty_stem"] }),
        flagged({ id: "item-z-draft", partnerId: "item-a", qaPassed: false }),
      ],
      keepers: keepersOf(keeper("item-a")),
    });

    expect(plan.retire.map((item) => item.id)).toEqual(["item-z-draft"]);
    expect(plan.retire[0]?.qaPassed).toBe(false);
    expect(plan.publishedInventoryDrop).toBe(0);
    expect(plan.leftInQueue).toBe(2);
  });

  it("follows a chain to the active lower keeper", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [
        flagged({ id: "item-b", partnerId: "item-a", qaPassed: true }),
        flagged({ id: "item-c", partnerId: "item-b", qaPassed: false }),
      ],
      keepers: keepersOf(keeper("item-a"), keeper("item-b"), keeper("item-c")),
    });

    expect(plan.retire).toEqual([
      expect.objectContaining({ id: "item-b", rootKeepId: "item-a", qaPassed: true }),
      expect.objectContaining({ id: "item-c", rootKeepId: "item-a", qaPassed: false }),
    ]);
    expect(plan.publishedInventoryDrop).toBe(1);
    expect(plan.retire.map((item) => item.rootKeepId)).not.toContain("item-b");
  });

  it("skips a queued copy when the keeper is missing, inactive, or not the lower id", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [
        flagged({ id: "missing-keeper", partnerId: "gone" }),
        flagged({ id: "inactive-keeper", partnerId: "asleep" }),
        flagged({ id: "reversed", partnerId: "zzz-higher" }),
        flagged({ id: "no-partner", codes: ["near_duplicate"] }),
        flagged({ id: "other-board", partnerId: "aaa-pharm" }),
        flagged({ id: "cleared", partnerId: "item-a", reviewFlag: false }),
        flagged({ id: "already-off", partnerId: "item-a", active: false }),
      ],
      keepers: keepersOf(
        keeper("asleep", { active: false }),
        keeper("aaa-pharm", { fieldId: "pharmacy" }),
        keeper("item-a")
      ),
    });

    expect(plan.retire).toEqual([]);
    expect(plan.publishedInventoryDrop).toBe(0);
    expect(Object.fromEntries(plan.skipped.map((skip) => [skip.id, skip.reason]))).toEqual({
      "already-off": "inactive",
      cleared: "not_flagged",
      "inactive-keeper": "keeper_inactive",
      "missing-keeper": "keeper_missing",
      "no-partner": "partner_missing",
      "other-board": "keeper_other_field",
      reversed: "partner_not_lower_id",
    });
  });

  it("refuses a chain longer than the safety cap and still retires the short pair", () => {
    const rows: NearDuplicateBankRow[] = [];
    const keeperRows: NearDuplicateKeeperRow[] = [keeper("id-00")];
    for (let n = 1; n <= MAX_NEAR_DUPLICATE_CHAIN + 1; n += 1) {
      const id = `id-${String(n).padStart(2, "0")}`;
      const partnerId = `id-${String(n - 1).padStart(2, "0")}`;
      rows.push(flagged({ id, partnerId, qaPassed: true }));
      keeperRows.push(keeper(id));
    }

    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows,
      keepers: keepersOf(...keeperRows),
    });
    const tooLong = `id-${String(MAX_NEAR_DUPLICATE_CHAIN + 1).padStart(2, "0")}`;
    expect(plan.skipped).toEqual([expect.objectContaining({ id: tooLong, reason: "chain_too_long" })]);
    expect(plan.retire).toHaveLength(MAX_NEAR_DUPLICATE_CHAIN);
    expect(plan.retire.every((item) => item.rootKeepId === "id-00")).toBe(true);
    expect(plan.retire.some((item) => item.id === "id-00" || item.id === tooLong)).toBe(false);
  });

  it("ignores a row from another field", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [flagged({ id: "rx-b", fieldId: "pharmacy", partnerId: "rx-a" })],
      keepers: keepersOf(keeper("rx-a", { fieldId: "pharmacy" })),
    });
    expect(plan.retire).toEqual([]);
    expect(plan.skipped).toEqual([expect.objectContaining({ id: "rx-b", reason: "other_field" })]);
  });
});

describe("nearDuplicateRetireWrite", () => {
  it("deactivates and clears a duplicate-only flag without touching qaPassed or other meta", () => {
    const row = flagged({ id: "item-b", partnerId: "item-a" });
    const write = nearDuplicateRetireWrite({
      curationMeta: row.curationMeta,
      retiredAt: RETIRED_AT,
      rootKeepId: "item-a",
    });

    expect(write).toMatchObject({ active: false, reviewFlag: false });
    expect(write && "qaPassed" in write).toBe(false);
    expect(Object.keys(write ?? {}).sort()).toEqual(["active", "curationMeta", "reviewFlag"]);
    expect(write?.curationMeta.cluster).toBe("keep-me");
    expect(readItemQaRecord(write?.curationMeta)).toMatchObject({
      codes: [],
      partnerId: "item-a",
      retiredAt: RETIRED_AT,
      retiredReason: "near_duplicate",
      summary: "Retired as near-duplicate of item-a.",
    });
  });

  it("keeps a non-duplicate QA code flagged after the near-duplicate is retired", () => {
    const row = flagged({
      id: "item-b",
      partnerId: "item-a",
      codes: ["near_duplicate", "truncated_option"],
    });
    const write = nearDuplicateRetireWrite({
      curationMeta: row.curationMeta,
      retiredAt: RETIRED_AT,
      rootKeepId: "item-a",
    });

    expect(write?.reviewFlag).toBe(true);
    expect(write?.active).toBe(false);
    expect(readItemQaRecord(write?.curationMeta)?.codes).toEqual(["truncated_option"]);
  });

  it("returns null unless the row is a near-duplicate flag", () => {
    const row = flagged({ id: "trunc", codes: ["truncated_option"] });
    expect(
      nearDuplicateRetireWrite({
        curationMeta: row.curationMeta,
        retiredAt: RETIRED_AT,
        rootKeepId: "item-a",
      })
    ).toBeNull();
  });
});
