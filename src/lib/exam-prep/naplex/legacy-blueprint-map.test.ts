import { describe, expect, it } from "vitest";
import {
  aggregateNaplex2026BlueprintCounts,
  naplexBlueprintDomainNeedsMigration,
  resolveNaplex2026BlueprintDomain,
} from "./legacy-blueprint-map";

describe("legacy-blueprint-map", () => {
  it("maps area3 to pharmacotherapy", () => {
    expect(
      resolveNaplex2026BlueprintDomain({
        blueprintDomain: "naplex-area3-treatment-planning",
        subjectId: "cardiovascular-rx",
      })
    ).toBe("naplex-2026-pharmacotherapy");
  });

  it("maps area1 calculations to dispensing", () => {
    expect(
      resolveNaplex2026BlueprintDomain({
        blueprintDomain: "naplex-area1-foundations",
        subjectId: "compounding-calculations",
      })
    ).toBe("naplex-2026-medication-dispensing");
  });

  it("passes through 2026 domains", () => {
    expect(
      resolveNaplex2026BlueprintDomain({
        blueprintDomain: "naplex-2026-drug-information",
        subjectId: "pharmacology",
      })
    ).toBe("naplex-2026-drug-information");
  });

  it("aggregates legacy and 2026 counts", () => {
    const totals = aggregateNaplex2026BlueprintCounts([
      {
        blueprintDomain: "naplex-area3-treatment-planning",
        subjectId: "cardiovascular-rx",
        count: 100,
      },
      {
        blueprintDomain: "naplex-2026-pharmacotherapy",
        subjectId: "endocrine-rx",
        count: 50,
      },
    ]);
    expect(totals["naplex-2026-pharmacotherapy"]).toBe(150);
  });

  it("flags legacy domains for migration", () => {
    expect(
      naplexBlueprintDomainNeedsMigration({
        blueprintDomain: "naplex-area3-treatment-planning",
        subjectId: "cardiovascular-rx",
      })
    ).toBe(true);
    expect(
      naplexBlueprintDomainNeedsMigration({
        blueprintDomain: "naplex-2026-pharmacotherapy",
        subjectId: "cardiovascular-rx",
      })
    ).toBe(false);
  });
});
