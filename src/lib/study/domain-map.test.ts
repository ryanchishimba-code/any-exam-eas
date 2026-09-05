import { describe, expect, it } from "vitest";
import {
  displayDomainLabel,
  domainTileSpan,
  rankDomainTiles,
  shortenDomainLabel,
  type DomainMapTile,
} from "@/components/dashboard/DomainMap";
import { pickHighlightedDomainId } from "@/lib/study/domain-map";

describe("domainTileSpan", () => {
  it("marks high-weight domains", () => {
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

describe("displayDomainLabel", () => {
  it("uses NCLEX short labels when available", () => {
    expect(displayDomainLabel("pharmacology-nursing", "Pharmacological Therapies")).toBe(
      "Pharmacology"
    );
    expect(displayDomainLabel("management-of-care", "Management of Care")).toBe("Management");
  });

  it("falls back to the provided label", () => {
    expect(displayDomainLabel("unknown-domain", "Custom Domain")).toBe("Custom Domain");
  });
});

describe("rankDomainTiles", () => {
  it("ranks Focus before Review before Strong, then by lower score", () => {
    const tiles: DomainMapTile[] = [
      {
        id: "strong",
        label: "Strong",
        weightPct: 18,
        score: 90,
        status: "strong",
        practiceHref: "/a",
      },
      {
        id: "review",
        label: "Review",
        weightPct: 12,
        score: 55,
        status: "needs_review",
        practiceHref: "/b",
      },
      {
        id: "focus",
        label: "Focus",
        weightPct: 14,
        score: 40,
        status: "needs_more_work",
        practiceHref: "/c",
      },
    ];
    expect(rankDomainTiles(tiles).map((t) => t.id)).toEqual(["focus", "review", "strong"]);
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
