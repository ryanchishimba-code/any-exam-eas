import { describe, expect, it } from "vitest";
import { EXAM_MODES, getExamMode } from "./modes";

describe("exam modes", () => {
  it("includes timed and cat mock modes", () => {
    const ids = EXAM_MODES.map((m) => m.id);
    expect(ids).toContain("timed");
    expect(ids).toContain("cat_mock");
    expect(ids).toContain("weak_area");
  });

  it("maps cat mock to cat study mode", () => {
    const cat = getExamMode("cat_mock");
    expect(cat?.studyMode).toBe("cat");
    expect(cat?.premium).toBe(true);
  });

  it("returns undefined for unknown mode", () => {
    expect(getExamMode("invalid" as "timed")).toBeUndefined();
  });
});
