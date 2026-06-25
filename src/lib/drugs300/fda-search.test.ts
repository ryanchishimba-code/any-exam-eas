import { describe, expect, it } from "vitest";
import { buildFdaDrugSearchIndex } from "./fda-reference";
import { searchDrugs } from "./search";
import type { FdaDrugReference } from "./schema";

const mockFdaDrug = (overrides: Partial<FdaDrugReference>): FdaDrugReference => ({
  id: "example-drug",
  generic: "Example Drug",
  brands: ["ExampleBrand"],
  routes: ["Oral"],
  dosageForms: ["Tablet"],
  marketingStatuses: ["Prescription"],
  applicationNumbers: ["NDA123456"],
  sponsors: ["Example Pharma"],
  activelyMarketed: true,
  fdaUrl: "https://www.accessdata.fda.gov/scripts/cder/daf/",
  ...overrides,
});

describe("FDA drug reference search", () => {
  it("prefers curated hits over FDA reference duplicates", () => {
    const fdaIndex = buildFdaDrugSearchIndex([
      mockFdaDrug({ id: "metformin", generic: "Metformin", brands: ["Glucophage"] }),
      mockFdaDrug({ id: "obscure-agent", generic: "Obscure Agent", brands: ["RareMed"] }),
    ]);

    const hits = searchDrugs("metformin", fdaIndex, 8);
    expect(hits.some((hit) => hit.id === "metformin" && hit.tier === "curated")).toBe(true);
    expect(hits.some((hit) => hit.id === "metformin" && hit.tier === "fda-reference")).toBe(false);
  });

  it("returns FDA reference hits when not in curated deck", () => {
    const fdaIndex = buildFdaDrugSearchIndex([
      mockFdaDrug({ id: "obscure-agent", generic: "Obscure Agent", brands: ["RareMed"] }),
    ]);

    const hits = searchDrugs("obscure", fdaIndex, 8);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.tier).toBe("fda-reference");
    expect(hits[0]?.fdaReference?.brands).toContain("RareMed");
  });
});
