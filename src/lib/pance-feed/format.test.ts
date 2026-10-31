import { describe, expect, it } from "vitest";
import { feedOrder, REVIEW_GAP, sanitizeProgress, sourceLine } from "./format";

const ids = ["pance-021", "pance-022", "pance-023", "pance-024", "pance-025", "pance-026"];

describe("feedOrder", () => {
  it("puts review cards after a gap and mastered cards at the end", () => {
    const order = feedOrder(ids, ["pance-026"], ["pance-021"]);
    expect(order.slice(0, REVIEW_GAP)).toEqual(["pance-022", "pance-023", "pance-024"]);
    expect(order[REVIEW_GAP]).toBe("pance-021");
    expect(order.at(-1)).toBe("pance-026");
  });

  it("drops unknown ids and keeps a card in the queue only once", () => {
    const order = feedOrder(ids, [], ["pance-025", "missing", "pance-025"]);
    expect(order.filter((id) => id === "pance-025")).toHaveLength(1);
    expect(order).not.toContain("missing");
  });
});

describe("sanitizeProgress", () => {
  const known = new Set(ids);

  it("removes mastered cards from the review queue", () => {
    expect(
      sanitizeProgress(
        {
          mastered: ["pance-021", "nope"],
          reviewQueue: ["pance-021", "pance-022"],
          lastSeenCardId: "pance-099",
        },
        known
      )
    ).toEqual({
      mastered: ["pance-021"],
      reviewQueue: ["pance-022"],
      lastSeenCardId: null,
    });
  });
});

describe("sourceLine", () => {
  it("does not repeat a year that is already in the guideline name", () => {
    expect(sourceLine({ guideline: "GOLD 2026 Report", year: "2026" })).toBe("GOLD 2026 Report");
    expect(sourceLine({ guideline: "ACG guideline", year: "2024" })).toBe("ACG guideline (2024)");
  });
});
