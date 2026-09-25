import { describe, expect, it } from "vitest";
import { isAuthorityCitationHref, presentChapterCitations } from "./chapter-citations";

describe("presentChapterCitations", () => {
  it("marks an official source line and its authority link", () => {
    const html = presentChapterCitations(
      '<p><strong>Official source of truth:</strong> <a href="https://www.ncsbn.org">NCSBN / NCLEX test plans</a> and the Candidate Bulletin.</p>'
    );
    expect(html).toContain('class="sg-citation"');
    expect(html).toContain('class="sg-source-link"');
    expect(html).toContain("https://www.ncsbn.org");
    expect(html).not.toContain("Open RN");
  });

  it("marks a short paragraph that is only an authority link", () => {
    const html = presentChapterCitations(
      '<p><a href="https://nabp.pharmacy/programs/examinations/naplex/">NAPLEX outline</a></p>'
    );
    expect(html).toContain("sg-citation");
    expect(html).toContain("sg-source-link");
  });

  it("leaves long clinical paragraphs and product links unmarked", () => {
    const html = presentChapterCitations(
      [
        "<p>Afterload is resistance the ventricle pumps against during systole. Confirm facility protocol before you change a drip.</p>",
        '<p><a href="https://anyexameasy.com/pricing">Pricing</a></p>',
        '<p class="sg-offer">Start a 5-day free trial.</p>',
      ].join("")
    );
    expect(html).not.toContain("sg-citation");
    expect(html).not.toContain("sg-source-link");
    expect(html).toContain('class="sg-offer"');
  });

  it("does not double-wrap on a second pass", () => {
    const once = presentChapterCitations(
      '<p>Official source: <a href="https://www.cdc.gov/vaccines/">CDC schedule</a>.</p>'
    );
    const twice = presentChapterCitations(once);
    expect(twice.match(/sg-citation/g)).toHaveLength(1);
    expect(twice.match(/sg-source-link/g)).toHaveLength(1);
  });

  it("recognizes board and public-health hosts only", () => {
    expect(isAuthorityCitationHref("https://www.ncsbn.org/exams")).toBe(true);
    expect(isAuthorityCitationHref("https://www.heart.org/aha")).toBe(true);
    expect(isAuthorityCitationHref("https://anyexameasy.com/nclex")).toBe(false);
    expect(isAuthorityCitationHref("not a url")).toBe(false);
  });
});
