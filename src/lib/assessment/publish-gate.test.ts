import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { canPublish, OWNER_FLAG_ACCEPTANCE, reviewGateOpen } from "@/lib/assessment/publish-gate";
import { ownerAttestationReview } from "@/lib/assessment/publish-run";
import type { PilotDocument } from "@/lib/assessment/types";

const pilot = JSON.parse(
  readFileSync("content/ngn-pilot/pilot-items.json", "utf8")
) as PilotDocument;

const licensed = {
  licenseType: "RN",
  licenseNumber: "RN123",
  licenseState: "TX",
};

describe("canPublish", () => {
  const item = pilot.cases[0]?.items[0];
  const caseDoc = pilot.cases[0];

  it("stays closed until two distinct licensed approvals and green validators", () => {
    expect(item && caseDoc).toBeTruthy();
    if (!item || !caseDoc) return;
    const context = { sources: pilot.sources, caseDoc, reviews: [] as const };
    expect(canPublish(item, { ...context, reviews: [] }).ok).toBe(false);
    expect(
      canPublish(item, {
        ...context,
        reviews: [{ ...licensed, reviewerUserId: "rn-1", decision: "approve" }],
      }).ok
    ).toBe(false);
    expect(
      canPublish(item, {
        ...context,
        reviews: [
          { ...licensed, reviewerUserId: "rn-1", decision: "approve" },
          { ...licensed, reviewerUserId: "rn-1", decision: "approve" },
        ],
      }).ok
    ).toBe(false);
    expect(
      canPublish(item, {
        ...context,
        reviews: [
          { ...licensed, reviewerUserId: "rn-1", decision: "approve", licenseNumber: "  " },
          { ...licensed, reviewerUserId: "rn-2", decision: "approve" },
        ],
      }).ok
    ).toBe(false);
    const open = canPublish(item, {
      ...context,
      reviews: [
        { ...licensed, reviewerUserId: "rn-1", decision: "approve" },
        { ...licensed, reviewerUserId: "rn-2", decision: "revise" },
        { ...licensed, reviewerUserId: "rn-3", decision: "approve" },
      ],
    });
    expect(open.ok).toBe(true);
    expect(open.approvalCount).toBe(2);
    expect(open.validatorsGreen).toBe(true);
  });

  it("stays closed when validators fail, even with two approvals", () => {
    const bowtie = structuredClone(pilot.standalone.find((entry) => entry.id === "B01"));
    expect(bowtie).toBeTruthy();
    if (!bowtie) return;
    const actions = bowtie.payload.actions as { keys: string[] };
    actions.keys = ["a1", "a2", "a3"];
    const result = canPublish(bowtie, {
      sources: pilot.sources,
      reviews: [
        { ...licensed, reviewerUserId: "rn-1", decision: "approve" },
        { ...licensed, reviewerUserId: "rn-2", decision: "approve" },
      ],
    });
    expect(result.validatorsGreen).toBe(false);
    expect(result.ok).toBe(false);
    expect(
      canPublish(bowtie, {
        sources: pilot.sources,
        reviews: [ownerAttestationReview("Ada RN")],
      }).ok
    ).toBe(false);
    expect(reviewGateOpen(result.ok ? [] : [
      { ...licensed, reviewerUserId: "rn-1", decision: "approve" },
      { ...licensed, reviewerUserId: "rn-2", decision: "approve" },
    ])).toBe(true);
  });

  it("stays closed on an open RN flag until the owner accepts it", () => {
    const bowtie = structuredClone(pilot.standalone.find((entry) => entry.id === "B01"));
    expect(bowtie && bowtie.rnFlags.length > 0).toBeTruthy();
    if (!bowtie) return;
    const flags = [...bowtie.rnFlags];
    const closed = canPublish(bowtie, {
      sources: pilot.sources,
      reviews: [ownerAttestationReview("Ryan Chishimba, RN")],
    });
    expect(closed.validatorsGreen).toBe(true);
    expect(closed.ok).toBe(false);
    expect(closed.errors.join(" ")).toContain(`open RN flag is not accepted: ${flags[0]}`);
    const accepted = canPublish(bowtie, {
      sources: pilot.sources,
      reviews: [ownerAttestationReview("Ryan Chishimba, RN", flags)],
    });
    expect(accepted.ok).toBe(true);
    expect(bowtie.rnFlags).toEqual(flags);
    expect(ownerAttestationReview("Ryan Chishimba, RN", flags).flagResolutions?.[flags[0]!]).toBe(
      OWNER_FLAG_ACCEPTANCE
    );
  });

  it("opens for one RN owner attestation when validators are green", () => {
    expect(item && caseDoc).toBeTruthy();
    if (!item || !caseDoc) return;
    const owner = canPublish(item, {
      sources: pilot.sources,
      caseDoc,
      reviews: [ownerAttestationReview("Ada RN")],
    });
    expect(owner.ok).toBe(true);
    expect(owner.approvalCount).toBe(1);
    expect(
      canPublish(item, {
        sources: pilot.sources,
        caseDoc,
        reviews: [{ ...ownerAttestationReview("Ada RN"), licenseNumber: null, licenseState: null }],
      }).ok
    ).toBe(true);
  });
});
