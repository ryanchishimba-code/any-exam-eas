import { describe, expect, it } from "vitest";
import {
  PANCE_FEATURED_DRILLS,
  isPanceTaskAreaId,
  panceDiagnosisDrillHref,
  panceTaskPracticeHref,
  parsePanceTaskCategoryParam,
} from "./practice-focus";

describe("PANCE practice focus", () => {
  it("parses valid task category params", () => {
    expect(parsePanceTaskCategoryParam("diagnosis")).toBe("diagnosis");
    expect(parsePanceTaskCategoryParam("invalid")).toBeNull();
  });

  it("validates task area ids", () => {
    expect(isPanceTaskAreaId("pharmacotherapy")).toBe(true);
    expect(isPanceTaskAreaId("renal")).toBe(false);
  });

  it("builds diagnosis drill deep links", () => {
    const href = panceDiagnosisDrillHref(25);
    expect(href).toContain("field=pance");
    expect(href).toContain("taskCategory=diagnosis");
    expect(href).toContain("style=standard");
    expect(href).toContain("autostart=1");
  });

  it("builds task practice href with subject", () => {
    const href = panceTaskPracticeHref("intervention", {
      subjectId: "cardiovascular",
      count: 15,
    });
    expect(href).toContain("subjectId=cardiovascular");
    expect(href).toContain("taskCategory=intervention");
  });

  it("lists diagnosis as the first featured drill", () => {
    expect(PANCE_FEATURED_DRILLS[0]?.taskCategory).toBe("diagnosis");
  });
});
