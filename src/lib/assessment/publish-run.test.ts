import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluatePublish, formatRestoreCommand } from "@/lib/assessment/publish-run";
import type { NgnCase, NgnItem, PilotDocument } from "@/lib/assessment/types";
import type { PublishCaseInput, PublishItemInput } from "@/lib/assessment/publish-run";

const pilot = JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;

function asItems(items: NgnItem[], status = "draft"): PublishItemInput[] {
  return items.map((item) => ({
    item: { ...item, status },
    batchId: pilot.batchId,
    caseVersion: item.caseVersion ?? item.caseId ? 1 : null,
    reviews: [],
  }));
}

function asCase(caseDoc: NgnCase, status = "draft"): PublishCaseInput {
  return {
    id: caseDoc.id,
    version: caseDoc.version,
    batchId: pilot.batchId,
    status,
    caseDoc,
  };
}

describe("NGN publish plan", () => {
  it("prints a restore command and keeps a case draft when any step fails the gate", () => {
    const caseDoc = structuredClone(pilot.cases[0]!);
    const broken = structuredClone(caseDoc);
    broken.items[2]!.stem = "";
    const standalone = pilot.standalone.find((item) => item.id === "B01");
    expect(standalone).toBeTruthy();
    const plan = evaluatePublish({
      items: [...asItems(broken.items), ...asItems(standalone ? [standalone] : [])],
      cases: [asCase(broken)],
      sourcesByBatch: { [pilot.batchId]: pilot.sources },
      ids: ["C01-S1", "B01"],
      batchId: pilot.batchId,
      ownerAttest: "Ada RN",
      restore: false,
    });
    expect(plan.restoreCommand).toBe(
      formatRestoreCommand({ batchId: pilot.batchId, ids: ["C01-S1", "B01"] })
    );
    expect(plan.restoreCommand).toContain("--restore");
    expect(plan.restoreCommand).toContain("--apply");
    expect(plan.blockedCases.map((entry) => entry.id)).toEqual(["C01"]);
    expect(plan.blockedCases[0]?.reasons.join(" ")).toMatch(/C01-S3/);
    expect(plan.itemChanges.map((change) => change.id)).toEqual(["B01"]);
    expect(plan.itemChanges.every((change) => change.to === "published")).toBe(true);
    expect(plan.caseChanges).toEqual([]);
    expect(JSON.stringify(plan)).not.toMatch(/"stem":/);
  });

  it("publishes a whole case when every step passes and restores it back to draft", () => {
    const caseDoc = structuredClone(pilot.cases[0]!);
    const published = evaluatePublish({
      items: asItems(caseDoc.items),
      cases: [asCase(caseDoc)],
      sourcesByBatch: { [pilot.batchId]: pilot.sources },
      ids: ["C01"],
      batchId: pilot.batchId,
      ownerAttest: "Ada RN",
      restore: false,
    });
    expect(published.blockedCases).toEqual([]);
    expect(published.itemChanges.map((change) => change.id).sort()).toEqual(
      caseDoc.items.map((item) => item.id).sort()
    );
    expect(published.caseChanges).toEqual([
      { id: "C01", version: caseDoc.version, from: "draft", to: "published" },
    ]);
    expect(published.attestations).toHaveLength(caseDoc.items.length);

    const restore = evaluatePublish({
      items: asItems(
        caseDoc.items.map((item) => ({ ...item, status: "published" })),
        "published"
      ),
      cases: [asCase({ ...caseDoc, status: "published" }, "published")],
      sourcesByBatch: { [pilot.batchId]: pilot.sources },
      ids: ["C01-S6"],
      batchId: pilot.batchId,
      ownerAttest: null,
      restore: true,
    });
    expect(restore.itemChanges).toHaveLength(caseDoc.items.length);
    expect(restore.itemChanges.every((change) => change.to === "draft")).toBe(true);
    expect(restore.caseChanges).toEqual([
      { id: "C01", version: caseDoc.version, from: "published", to: "draft" },
    ]);
    expect(restore.attestations).toEqual([]);
    expect(restore.restoreCommand).toBe(
      "npx tsx scripts/ngn/publish.ts --restore --batch ngn-pilot-2026-09-26 --ids C01-S6 --apply"
    );
  });

  it("lets publish run in production and keeps the seed script non-production", () => {
    const publish = readFileSync("scripts/ngn/publish.ts", "utf8");
    const seed = readFileSync("scripts/ngn/seed-pilot.ts", "utf8");
    expect(publish).not.toContain("VERCEL_ENV");
    expect(publish).toContain("allowed in production");
    expect(publish).not.toMatch(/data:\s*\{[^}]*stem/);
    expect(seed).toContain("Refusing --apply when VERCEL_ENV=production.");
    expect(seed).toContain("scripts/ngn/publish.ts");
  });
});
