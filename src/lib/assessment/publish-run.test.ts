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
    const standalone = structuredClone(pilot.standalone.find((item) => item.id === "B01"));
    expect(standalone).toBeTruthy();
    if (standalone) standalone.rnFlags = [];
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
      acceptOpenFlags: true,
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
    for (const item of caseDoc.items) {
      const attestation = published.attestations.find((entry) => entry.itemId === item.id);
      expect(attestation?.flagResolutions).toEqual(
        Object.fromEntries(item.rnFlags.map((flag) => [flag, "accepted by owner"]))
      );
    }
    expect(caseDoc.items.map((item) => item.rnFlags)).toEqual(
      pilot.cases[0]!.items.map((item) => item.rnFlags)
    );

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

  it("publishes all 70 pilot items and 10 cases when the owner accepts open flags", () => {
    const items = [
      ...pilot.cases.flatMap((caseDoc) => asItems(caseDoc.items)),
      ...asItems(pilot.standalone),
    ];
    const cases = pilot.cases.map((caseDoc) => asCase(caseDoc));
    const flagsBefore = items.map((row) => [...row.item.rnFlags]);
    const held = evaluatePublish({
      items,
      cases,
      sourcesByBatch: { [pilot.batchId]: pilot.sources },
      ids: null,
      batchId: pilot.batchId,
      ownerAttest: "Ryan Chishimba, PharmD",
      restore: false,
    });
    expect(held.caseChanges).toEqual([]);
    expect(held.blockedCases).toHaveLength(pilot.cases.length);
    expect(held.itemChanges.map((change) => change.id)).not.toContain("B01");
    expect(held.blockedCases[0]?.reasons.join(" ")).toMatch(/open RN flag is not accepted/);

    const plan = evaluatePublish({
      items,
      cases,
      sourcesByBatch: { [pilot.batchId]: pilot.sources },
      ids: null,
      batchId: pilot.batchId,
      ownerAttest: "Ryan Chishimba, PharmD",
      acceptOpenFlags: true,
      restore: false,
    });
    expect(plan.blockedCases).toEqual([]);
    expect(plan.itemChanges).toHaveLength(70);
    expect(plan.itemChanges.every((change) => change.to === "published")).toBe(true);
    expect(plan.caseChanges.map((change) => change.id).sort()).toEqual(
      pilot.cases.map((caseDoc) => caseDoc.id).sort()
    );
    expect(plan.caseChanges.every((change) => change.to === "published")).toBe(true);
    expect(plan.attestations).toHaveLength(70);
    expect(plan.attestations.every((row) => row.licenseType === "PharmD")).toBe(true);
    const flagged = items.filter((row) => row.item.rnFlags.length > 0);
    expect(flagged.length).toBeGreaterThan(0);
    for (const row of flagged) {
      const attestation = plan.attestations.find((entry) => entry.itemId === row.item.id);
      expect(attestation?.flagResolutions).toEqual(
        Object.fromEntries(row.item.rnFlags.map((flag) => [flag, "accepted by owner"]))
      );
    }
    expect(items.map((row) => row.item.rnFlags)).toEqual(flagsBefore);
    expect(plan.restoreCommand).toBe(
      "npx tsx scripts/ngn/publish.ts --restore --batch ngn-pilot-2026-09-26 --apply"
    );
  });

  it("lets publish run in production and keeps the seed script non-production", () => {
    const publish = readFileSync("scripts/ngn/publish.ts", "utf8");
    const seed = readFileSync("scripts/ngn/seed-pilot.ts", "utf8");
    expect(publish).not.toContain("VERCEL_ENV");
    expect(publish).toContain("allowed in production");
    expect(publish).toContain('--owner-attest "Ryan Chishimba, PharmD" --accept-open-flags');
    expect(publish).toContain("owner attestation (not RN review)");
    expect(publish).not.toContain('licenseType: "RN"');
    expect(publish).toContain("flagResolutions: attestation.flagResolutions");
    expect(publish).not.toMatch(/data:\s*\{[^}]*stem/);
    expect(publish).not.toMatch(/\.update\(\{[\s\S]{0,180}rnFlags/);
    expect(seed).toContain("Refusing --apply when VERCEL_ENV=production.");
    expect(seed).toContain("scripts/ngn/publish.ts");
  });
});
