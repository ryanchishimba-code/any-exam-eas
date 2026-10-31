import { describe, expect, it } from "vitest";
import { displayedExamSlug, headerExamSlug } from "@/lib/client/header-exam-slug";
import { fullExamHref } from "@/lib/routes";
import { studyFeedForExam } from "@/lib/study-feed/catalog";

const now = 1_700_000_000_000;

describe("header and feed follow the board just chosen", () => {
  it("keeps the account exam when a leftover chip is older than the preference cache", () => {
    const slug = headerExamSlug("nclex", "pance", { optimisticAt: now - 61_000, now });
    expect(slug).toBe("nclex");
    expect(fullExamHref(slug!)).toBe("/full-exam/nclex");
    expect(studyFeedForExam(slug)?.href).toBe("/study-tools/nclex/feed");
  });

  it("points the header and the feed at the board just chosen, not the cached exam", () => {
    const slug = displayedExamSlug({
      accountExam: "aanp-fnp",
      optimisticExam: "pance",
      optimisticAt: now,
      now,
    });
    expect(slug).toBe("pance");
    expect(fullExamHref(slug!)).toBe("/full-exam/pance");
    expect(studyFeedForExam(slug)?.href).toBe("/study-tools/pance/feed");
    expect(studyFeedForExam(slug)?.label).toBe("PANCE Feed");
  });

  it("uses a chip only before the account exam has loaded", () => {
    expect(headerExamSlug(null, "aanp-fnp")).toBe("aanp-fnp");
    expect(studyFeedForExam("aanp-fnp")?.href).toBe("/study-tools/aanp-fnp/feed");
  });

  it("uses the account exam when nothing else is stored", () => {
    expect(headerExamSlug("naplex", null)).toBe("naplex");
    expect(studyFeedForExam("naplex")?.href).toBe("/study-tools/naplex/feed");
  });
});
