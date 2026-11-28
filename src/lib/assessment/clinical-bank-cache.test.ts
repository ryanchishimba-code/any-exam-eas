import { describe, expect, it } from "vitest";
import { packClinicalBank, unpackClinicalBank, type LoadedClinicalBank } from "@/lib/assessment/serve-db";

function bankOf(bytes: number): LoadedClinicalBank {
  return {
    catalog: {
      standalones: [
        {
          kind: "standalone",
          subjectId: "pharmacology-nursing",
          item: {
            id: "bow-1",
            version: 1,
            batchId: "batch",
            itemType: "bowtie",
            caseId: null,
            caseStep: null,
            caseVersion: null,
            cjmmFunction: [],
            timepoint: null,
            responseFormat: "mr_sata",
            scoringRule: "plus_minus",
            maxPoints: 1,
            stem: "s".repeat(bytes),
            payload: {},
            exhibit: null,
            rationale: {
              short: "",
              expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "" },
            },
            clientNeeds: { subcategory: "Pharmacological and Parenteral Therapies" },
            references: [],
            rnFlags: [],
            status: "published",
          },
        },
      ],
      cases: [],
    },
    sourcesById: {},
    caseReferences: {},
  };
}

describe("packClinicalBank", () => {
  it("round-trips a catalog and compresses a payload that would miss the 2MB cache", () => {
    const bank = bankOf(2_300_000);
    const raw = JSON.stringify(bank);
    expect(raw.length).toBeGreaterThan(2_000_000);
    const packed = packClinicalBank(bank);
    expect(packed.length).toBeLessThan(1_800_000);
    const unpacked = unpackClinicalBank(packed);
    expect(unpacked.catalog.standalones[0]?.item.stem).toBe(bank.catalog.standalones[0]?.item.stem);
    expect(unpacked.catalog.standalones[0]?.subjectId).toBe("pharmacology-nursing");
  });
});
