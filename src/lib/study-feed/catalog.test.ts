import { describe, expect, it } from "vitest";
import { isStudyFeedPath, studyFeedApiBoard, studyFeedForExam, STUDY_FEEDS } from "./catalog";

describe("study feed catalog", () => {
  it("gives NCLEX, NAPLEX, and FNP their own feed paths", () => {
    expect(studyFeedForExam("nclex")?.label).toBe("NCLEX Feed");
    expect(studyFeedForExam("naplex")?.href).toBe("/study-tools/naplex/feed");
    expect(studyFeedForExam("aanp-fnp")?.label).toBe("FNP Feed");
    expect(studyFeedForExam("aanp-fnp")?.idPrefix).toBe("fnp");
    expect(studyFeedForExam("usmle")).toBeNull();
    expect(studyFeedForExam("npte-pt")).toBeNull();
  });

  it("keeps PANCE on its existing route and API", () => {
    expect(STUDY_FEEDS.pance.href).toBe("/study-tools/pance/feed");
    expect(STUDY_FEEDS.pance.apiBase).toBe("/api/pance-feed");
    expect(studyFeedApiBoard("pance")).toBeNull();
    expect(studyFeedApiBoard("nclex")?.apiBase).toBe("/api/study-feed/nclex");
  });

  it("recognizes a feed return URL", () => {
    expect(isStudyFeedPath("/study-tools/aanp-fnp/feed")).toBe(true);
    expect(isStudyFeedPath("/study-tools/nclex/feed?x=1")).toBe(true);
    expect(isStudyFeedPath("/dashboard")).toBe(false);
  });
});
