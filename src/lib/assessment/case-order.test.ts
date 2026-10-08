import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluatePublish } from "@/lib/assessment/publish-run";
import type { PublishCaseInput, PublishItemInput } from "@/lib/assessment/publish-run";
import { selectPublishedCatalog, studentFacingUnit, type ServeCase, type ServeItem } from "@/lib/assessment/serve";
import type { NgnCase, NgnItem, PilotDocument } from "@/lib/assessment/types";

const pilot = JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;

/** Production returned NC010 as S3, S1, S2, S4, S5, S6. Same positions on a stored 1–6 case. */
const PRISMA_ORDER = [2, 0, 1, 3, 4, 5];

function asItems(items: NgnItem[]): PublishItemInput[] {
  return items.map((item) => ({
    item,
    batchId: pilot.batchId,
    caseVersion: item.caseId ? 1 : null,
    reviews: [],
  }));
}

function asCase(caseDoc: NgnCase): PublishCaseInput {
  return {
    id: caseDoc.id,
    version: caseDoc.version,
    batchId: pilot.batchId,
    status: "draft",
    caseDoc,
  };
}

function toServe(item: NgnItem): ServeItem {
  return {
    ...item,
    status: "published",
    batchId: pilot.batchId,
    caseVersion: 1,
  };
}

describe("NGN case step order", () => {
  it("passes the publish gate and serves steps 1–6 when rows arrive shuffled", () => {
    const caseDoc = structuredClone(pilot.cases[0]!);
    expect(caseDoc.items.map((item) => item.caseStep)).toEqual([1, 2, 3, 4, 5, 6]);
    caseDoc.items = PRISMA_ORDER.map((index) => caseDoc.items[index]!);
    expect(caseDoc.items.map((item) => item.caseStep)).toEqual([3, 1, 2, 4, 5, 6]);

    const plan = evaluatePublish({
      items: asItems(caseDoc.items),
      cases: [asCase(caseDoc)],
      sourcesByBatch: { [pilot.batchId]: pilot.sources },
      ids: null,
      batchId: pilot.batchId,
      ownerAttest: "Ada RN",
      acceptOpenFlags: true,
      restore: false,
    });
    expect(plan.blockedCases).toEqual([]);
    expect(JSON.stringify(plan)).not.toMatch(/not in NCJMM order/);
    expect(plan.caseChanges).toEqual([
      { id: caseDoc.id, version: caseDoc.version, from: "draft", to: "published" },
    ]);

    const serveCase: ServeCase = {
      id: caseDoc.id,
      version: caseDoc.version,
      batchId: pilot.batchId,
      title: caseDoc.title,
      boardProfile: caseDoc.boardProfile,
      status: "published",
      primaryClientNeed: caseDoc.primaryClientNeed,
      setting: caseDoc.setting,
      patient: caseDoc.patient,
      timepoints: caseDoc.timepoints,
      chart: caseDoc.chart,
      revealRule: caseDoc.revealRule,
      references: caseDoc.references,
    };
    const catalog = selectPublishedCatalog({
      items: caseDoc.items.map(toServe),
      cases: [serveCase],
      subjects: [{ id: "management-of-care", label: "Management of Care" }],
    });
    const unit = catalog.cases[0];
    expect(unit?.items.map((item) => item.caseStep)).toEqual([1, 2, 3, 4, 5, 6]);
    const facing = unit ? studentFacingUnit(unit) : null;
    expect(facing?.kind === "case" && facing.items.map((item) => item.caseStep)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
