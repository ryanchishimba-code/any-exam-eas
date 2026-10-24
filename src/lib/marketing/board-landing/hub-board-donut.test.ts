import { describe, expect, it } from "vitest";
import { buildHubBoardDonutSegments, hubBoardDonutSlicePath } from "./hub-board-donut";

describe("buildHubBoardDonutSegments", () => {
  it("includes live count and USMLE steps when all three are populated", () => {
    const segments = buildHubBoardDonutSegments({
      examKey: "usmle",
      liveQuestionCount: 1200,
      includeStudyGuide: false,
      includeAllUsmleSteps: true,
    });
    expect(segments[0]?.detail).toMatch(/1,200/);
    expect(segments.map((s) => s.id)).toContain("steps");
  });

  it("adds FNP study guide slice when configured", () => {
    const segments = buildHubBoardDonutSegments({
      examKey: "aanp-fnp",
      liveQuestionCount: 400,
      includeStudyGuide: true,
      includeAllUsmleSteps: false,
    });
    expect(segments.map((s) => s.id)).toContain("study-guide");
  });
});

describe("hubBoardDonutSlicePath", () => {
  it("returns a closed path for a quarter slice", () => {
    const d = hubBoardDonutSlicePath(100, 100, 80, 50, 0, 90);
    expect(d).toMatch(/^M /);
    expect(d).toMatch(/Z$/);
  });
});
