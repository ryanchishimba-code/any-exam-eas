import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePremiumPage = vi.fn();
const loadPublishedGuideChapter = vi.fn();
const loadPublishedGuideFirstSlug = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
  unstable_rethrow: (error: unknown) => {
    throw error;
  },
}));

vi.mock("@/lib/require-premium-page", () => ({
  requirePremiumPage: (...args: unknown[]) => requirePremiumPage(...args),
}));

vi.mock("@/lib/nclex-study-guide/load-published", () => ({
  loadPublishedGuideChapter: (...args: unknown[]) => loadPublishedGuideChapter(...args),
  loadPublishedGuideFirstSlug: (...args: unknown[]) => loadPublishedGuideFirstSlug(...args),
}));

import {
  StudyGuideChapterScreen,
  StudyGuideIndexScreen,
} from "@/components/nclex-study-guide/StudyGuideChapterScreen";

describe("study guide page gate", () => {
  beforeEach(() => {
    requirePremiumPage.mockReset();
    loadPublishedGuideChapter.mockReset();
    loadPublishedGuideFirstSlug.mockReset();
    requirePremiumPage.mockRejectedValue(new Error("NEXT_REDIRECT"));
  });

  it("does not load chapter HTML when access is denied", async () => {
    await expect(
      StudyGuideChapterScreen({ exam: "nclex", chapterSlug: "cardiac" })
    ).rejects.toThrow(/NEXT_REDIRECT/);
    expect(requirePremiumPage).toHaveBeenCalledWith("/nclex/study-guide/cardiac");
    expect(loadPublishedGuideChapter).not.toHaveBeenCalled();
  });

  it("does not resolve a chapter slug for a denied index visit", async () => {
    await expect(StudyGuideIndexScreen({ exam: "aanp-fnp" })).rejects.toThrow(/NEXT_REDIRECT/);
    expect(requirePremiumPage).toHaveBeenCalledWith("/aanp-fnp/study-guide");
    expect(loadPublishedGuideFirstSlug).not.toHaveBeenCalled();
  });
});
