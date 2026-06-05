import { describe, expect, it } from "vitest";
import {
  MPJE_JURISDICTIONS,
  resolveMpjeGenerationOptions,
  searchMpjeJurisdictions,
} from "./config";

describe("MPJE jurisdiction search", () => {
  it("includes 50 states, DC, and territories", () => {
    expect(MPJE_JURISDICTIONS.length).toBeGreaterThanOrEqual(56);
    expect(MPJE_JURISDICTIONS.some((j) => j.code === "TX")).toBe(true);
    expect(MPJE_JURISDICTIONS.some((j) => j.code === "PR" && j.isTerritory)).toBe(true);
  });

  it("searches by name and code", () => {
    expect(searchMpjeJurisdictions("texas")[0]?.code).toBe("TX");
    expect(searchMpjeJurisdictions("CA")[0]?.code).toBe("CA");
    expect(searchMpjeJurisdictions("puerto")[0]?.code).toBe("PR");
    expect(searchMpjeJurisdictions("zzz")).toHaveLength(0);
  });

  it("resolves generation options from URL params", () => {
    expect(resolveMpjeGenerationOptions({ variant: "uniform" })).toEqual({
      variant: "uniform",
      stateCode: undefined,
    });
    expect(resolveMpjeGenerationOptions({ variant: "state", stateCode: "ny" })).toEqual({
      variant: "state",
      stateCode: "NY",
    });
  });
});
