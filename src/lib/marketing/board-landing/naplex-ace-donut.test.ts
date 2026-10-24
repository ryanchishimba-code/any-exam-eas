import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";
import {
  buildNaplexAceDonutSegments,
  naplexAceDonutSlicePath,
} from "./naplex-ace-donut";

describe("buildNaplexAceDonutSegments", () => {
  it("uses equal segment count and only verified labels", () => {
    const units = boardQuestionUnits({
      slug: "naplex",
      bankItems: 120,
      formats: { mcq: 120, ngn: 0, case: 0 },
    });
    const segments = buildNaplexAceDonutSegments({
      units,
      includeQuickBite: true,
      includeItemTypes: true,
    });
    const ids = segments.map((s) => s.id);
    expect(ids).toContain("question-bank");
    expect(ids).toContain("top-500");
    expect(ids).toContain("quick-bites");
    expect(ids).toContain("study-guide");
    expect(segments.every((s) => s.label && s.detail && s.color)).toBe(true);
    expect(segments.find((s) => s.id === "question-bank")?.detail).toContain("120");
    expect(segments.find((s) => s.id === "top-500")?.detail).toContain(String(TOP_500_DRUGS_COUNT));
    expect(JSON.stringify(segments)).not.toMatch(/%|percent/i);
  });

  it("omits optional slices when flags are false", () => {
    const segments = buildNaplexAceDonutSegments({
      units: null,
      includeQuickBite: false,
      includeItemTypes: false,
    });
    expect(segments.map((s) => s.id)).not.toContain("quick-bites");
    expect(segments.map((s) => s.id)).not.toContain("item-types");
  });
});

describe("naplexAceDonutSlicePath", () => {
  it("returns a closed path for a quarter slice", () => {
    const d = naplexAceDonutSlicePath(100, 100, 80, 50, 0, 90);
    expect(d.startsWith("M ")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
  });
});
