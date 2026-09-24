import { describe, expect, it } from "vitest";
import { visibleBookSection } from "./display-label";

describe("visibleBookSection", () => {
  it("hides intro headings and placeholders", () => {
    expect(visibleBookSection("Why it matters on NCLEX")).toBeNull();
    expect(visibleBookSection("Why this chapter matters")).toBeNull();
    expect(visibleBookSection("Study-aid disclaimer (read this)")).toBeNull();
    expect(visibleBookSection("FAQ")).toBeNull();
    expect(visibleBookSection("Chapter title pending")).toBeNull();
    expect(visibleBookSection("sg_guide_nclex_rn_placeholder")).toBeNull();
    expect(visibleBookSection("")).toBeNull();
    expect(visibleBookSection(null)).toBeNull();
  });

  it("keeps a real short part label", () => {
    expect(visibleBookSection("Med-Surg")).toBe("Med-Surg");
  });
});