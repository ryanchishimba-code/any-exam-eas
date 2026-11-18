import { afterEach, describe, expect, it, vi } from "vitest";
import { isStudyFeedPath, studyFeedApiBoard, studyFeedForExam, STUDY_FEEDS } from "./catalog";
import { USMLE_STEP_FEEDS } from "./usmle-feed";

describe("study feed catalog", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("gives NCLEX, NAPLEX, and FNP their own feed paths", () => {
    expect(studyFeedForExam("nclex")?.label).toBe("NCLEX Feed");
    expect(studyFeedForExam("naplex")?.href).toBe("/study-tools/naplex/feed");
    expect(studyFeedForExam("aanp-fnp")?.label).toBe("FNP Feed");
    expect(studyFeedForExam("aanp-fnp")?.idPrefix).toBe("fnp");
    expect(studyFeedForExam("usmle")).toBeNull();
    expect(studyFeedForExam("npte-pt")).toBeNull();
  });

  it("keeps the USMLE feed out of student links until the public flag is on", () => {
    expect(isStudyFeedPath("/study-tools/usmle/feed")).toBe(false);
    expect(studyFeedApiBoard("usmle-step-1")?.apiBase).toBe("/api/study-feed/usmle-step-1");
    expect(studyFeedApiBoard("usmle-step-2")?.idPrefix).toBe("usmle2");
    expect(USMLE_STEP_FEEDS["usmle-step-3"].href).toBe("/study-tools/usmle/feed?step=3");
    vi.stubEnv("NEXT_PUBLIC_USMLE_STUDY_FEED_PUBLIC", "1");
    expect(studyFeedForExam("usmle")?.href).toBe("/study-tools/usmle/feed");
    expect(studyFeedForExam("usmle")?.label).toBe("USMLE Feed");
    expect(isStudyFeedPath("/study-tools/usmle/feed?step=2ck")).toBe(true);
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
