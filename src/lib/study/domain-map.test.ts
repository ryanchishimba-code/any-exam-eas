import { describe, expect, it } from "vitest";
import { domainTileSpan, shortenDomainLabel } from "@/components/dashboard/DomainMap";
import { pickHighlightedDomainId } from "@/lib/study/domain-map";

describe("domainTileSpan", () => {
  it("spans two columns for high-weight Client Needs", () => {
    expect(domainTileSpan(18)).toBe(2);
    expect(domainTileSpan(14)).toBe(2);
    expect(domainTileSpan(13)).toBe(1);
  });
});

describe("shortenDomainLabel", () => {
  it("truncates long labels for compact tiles", () => {
    expect(shortenDomainLabel("Pharmacological and Parenteral Therapies", 18).endsWith("…")).toBe(
      true
    );
    expect(shortenDomainLabel("Safety")).toBe("Safety");
  });
});

describe("pickHighlightedDomainId", () => {
  it("prefers needs-more-work over review, then higher weight", () => {
    const id = pickHighlightedDomainId([
      {
        id: "a",
        weightPct: 18,
        score: 40,
        status: "needs_review",
      },
      {
        id: "b",
        weightPct: 14,
        score: 50,
        status: "needs_more_work",
      },
      {
        id: "c",
        weightPct: 9,
        score: 90,
        status: "strong",
      },
    ]);
    expect(id).toBe("b");
  });

  it("returns null when every domain is strong", () => {
    expect(
      pickHighlightedDomainId([
        { id: "a", weightPct: 18, score: 88, status: "strong" },
      ])
    ).toBeNull();
  });
});
