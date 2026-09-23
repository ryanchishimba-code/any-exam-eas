import { describe, expect, it } from "vitest";
import { getManuscriptChapter, loadManuscriptGuide } from "./manuscript-fallback";

describe("USMLE manuscript fallback", () => {
  it("loads numbered chapters from disk so the hub can ship without ingest", () => {
    const guide = loadManuscriptGuide("usmle");
    expect(guide.toc.map((c) => c.slug)).toEqual([
      "front-matter",
      "exam-strategy",
      "cardiovascular",
      "pulmonary",
      "renal-electrolytes",
      "infectious-disease",
      "neuro-stroke",
      "step3-ccs-ethics",
      "quick-reference",
      "back-matter",
    ]);
    expect(guide.toc[0]?.title).toMatch(/USMLE/i);
  });

  it("renders real HTML for the strategy chapter", () => {
    const loaded = getManuscriptChapter("usmle", "exam-strategy");
    expect(loaded?.chapter.bodyHtml).toMatch(/Step 2 CK/);
    expect(loaded?.chapter.bodyHtml).toMatch(/next-best-step/i);
    expect(loaded?.chapter.prevSlug).toBe("front-matter");
    expect(loaded?.chapter.nextSlug).toBe("cardiovascular");
  });
});
