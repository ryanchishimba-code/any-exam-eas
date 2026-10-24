import { describe, expect, it } from "vitest";
import { homeFeatureShortTitle } from "@/lib/marketing/home-feature-title";

describe("homeFeatureShortTitle", () => {
  it("keeps titles with four or fewer words", () => {
    expect(homeFeatureShortTitle("Readiness score")).toBe("Readiness score");
    expect(homeFeatureShortTitle("Every answer explained")).toBe("Every answer explained");
  });

  it("truncates longer titles to three words", () => {
    expect(homeFeatureShortTitle("Quick Bites video lecture series")).toBe("Quick Bites video");
  });
});
