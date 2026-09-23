import { describe, expect, it } from "vitest";
import { readItemQaRecord } from "./flag";
import {
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

  it("retires a partner chain longer than the old cap of 12 and keeps the lowest id", () => {
    const length = 40;
    const rows: NearDuplicateBankRow[] = [];
    const keeperRows: NearDuplicateKeeperRow[] = [keeper("id-000")];
    for (let n = 1; n <= length; n += 1) {
      const id = `id-${String(n).padStart(3, "0")}`;
      const partnerId = `id-${String(n - 1).padStart(3, "0")}`;
      rows.push(flagged({ id, partnerId, qaPassed: true }));
      keeperRows.push(keeper(id));
    }

    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows,
      keepers: keepersOf(...keeperRows),
    });

    expect(plan.skipped).toEqual([]);
    expect(plan.retire).toHaveLength(length);
    expect(plan.publishedInventoryDrop).toBe(length);
    expect(new Set(plan.retire.map((item) => item.rootKeepId))).toEqual(new Set(["id-000"]));
    expect(plan.retire.some((item) => item.id === "id-000")).toBe(false);
    expect(plan.retire.map((item) => item.id)).not.toContain("id-000");
  });

  it("skips a whole long chain when the keeper is inactive, including rows near the keeper", () => {
    const rows: NearDuplicateBankRow[] = [];
    const keeperRows: NearDuplicateKeeperRow[] = [keeper("id-000", { active: false })];
    for (let n = 1; n <= 20; n += 1) {
      const id = `id-${String(n).padStart(3, "0")}`;
      const partnerId = `id-${String(n - 1).padStart(3, "0")}`;
      rows.push(flagged({ id, partnerId }));
      keeperRows.push(keeper(id));
    }

    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows,
      keepers: keepersOf(...keeperRows),
    });

    expect(plan.retire).toEqual([]);
    expect(plan.skipped.map((skip) => skip.reason)).toEqual(Array.from({ length: 20 }, () => "keeper_inactive"));
  });

  it("stops at an inactive middle row and still retires the chain below it", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [
        flagged({ id: "id-001", partnerId: "id-000" }),
        flagged({ id: "id-002", partnerId: "id-001" }),
        flagged({ id: "id-003", partnerId: "id-002", active: false }),
        flagged({ id: "id-004", partnerId: "id-003" }),
        flagged({ id: "id-005", partnerId: "id-004" }),
      ],
      keepers: keepersOf(
        keeper("id-000"),
        keeper("id-001"),
        keeper("id-002"),
        keeper("id-003", { active: false }),
        keeper("id-004")
      ),
    });

    expect(plan.retire.map((item) => item.id)).toEqual(["id-001", "id-002"]);
    expect(plan.retire.every((item) => item.rootKeepId === "id-000")).toBe(true);
    expect(Object.fromEntries(plan.skipped.map((skip) => [skip.id, skip.reason]))).toEqual({
      "id-003": "inactive",
      "id-004": "keeper_inactive",
      "id-005": "keeper_inactive",
    });
  });

  it("retires only the higher id when two rows point at each other", () => {
    const plan = planNearDuplicateRetirements({
      fieldId: "nursing",
      rows: [
        flagged({ id: "item-a", partnerId: "item-b" }),
        flagged({ id: "item-b", partnerId: "item-a" }),
      ],
      keepers: keepersOf(keeper("item-a"), keeper("item-b")),
    });

    expect(plan.retire.map((item) => item.id)).toEqual(["item-b"]);
    expect(plan.retire[0]?.rootKeepId).toBe("item-a");
    expect(plan.skipped).toEqual([
      expect.objectContaining({ id: "item-a", reason: "partner_not_lower_id", partnerId: "item-b" }),
    ]);
  });

  it("merges two long branches onto one keeper and does not retire that keeper", () => {
    const rows: NearDuplicateBankRow[] = [];
    const keeperRows: NearDuplicateKeeperRow[] = [keeper("k-000", { fieldId: "pharmacy" })];
    for (const branch of [1, 2]) {
      let partnerId = "k-000";
      for (let n = 1; n <= 15; n += 1) {
        const id = `k-${branch}-${String(n).padStart(2, "0")}`;
        rows.push(flagged({ id, partnerId, fieldId: "pharmacy" }));
        keeperRows.push(keeper(id, { fieldId: "pharmacy" }));
        partnerId = id;
      }
    }

    const plan = planNearDuplicateRetirements({
      fieldId: "pharmacy",
      rows,
      keepers: keepersOf(...keeperRows),
    });

    expect(plan.fieldId).toBe("pharmacy");
    expect(plan.retire).toHaveLength(30);
    expect(new Set(plan.retire.map((item) => item.rootKeepId))).toEqual(new Set(["k-000"]));
    expect(plan.retire.some((item) => item.id === "k-000")).toBe(false);
    expect(plan.skipped).toEqual([]);
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
