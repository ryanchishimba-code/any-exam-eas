import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const resolveStudyGuideAccess = vi.fn();
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
  resolveStudyGuideAccess: (...args: unknown[]) => resolveStudyGuideAccess(...args),
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
    resolveStudyGuideAccess.mockReset();
    loadPublishedGuideChapter.mockReset();
    loadPublishedGuideFirstSlug.mockReset();
    resolveStudyGuideAccess.mockResolvedValue({ status: "upsell", signedIn: false });
  });

  it("does not load chapter HTML when access is denied", async () => {
    const view = await StudyGuideChapterScreen({ exam: "nclex", chapterSlug: "cardiac" });
    render(view);
    expect(resolveStudyGuideAccess).toHaveBeenCalledWith("/nclex/study-guide/cardiac");
    expect(loadPublishedGuideChapter).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: /study guide/i })).toBeInTheDocument();
  });

  it("does not resolve a chapter slug for a denied index visit", async () => {
    const view = await StudyGuideIndexScreen({ exam: "aanp-fnp" });
    render(view);
    expect(resolveStudyGuideAccess).toHaveBeenCalledWith("/aanp-fnp/study-guide");
    expect(loadPublishedGuideFirstSlug).not.toHaveBeenCalled();
    expect(screen.getByText(/reference book/i)).toBeInTheDocument();
  });
});
