import { describe, expect, it } from "vitest";
import {
  assignClusterIds,
  buildClustersFromPairs,
  dedupePairs,
} from "./similarity-clusters";
import { pickClusterKeepers, resolveClientNeedsCategory, type ScoredItem } from "./cluster-selection";
import { buildEmbeddingText } from "./embedding-text";
import { KEEP_MIN_SCORE, REVIEW_MIN_SCORE } from "./types";

describe("buildEmbeddingText", () => {
  it("combines vignette, stem, and correct answer", () => {
    const text = buildEmbeddingText({
      question: "Which action first?",
      scenario: "A nurse cares for a client with fever.",
      correctAnswer: "Obtain blood cultures",
    });
    expect(text).toContain("fever");
    expect(text).toContain("Obtain blood cultures");
  });
});

describe("similarity clusters", () => {
  it("groups transitive pairs", () => {
    const pairs = dedupePairs([
      { a: "1", b: "2", similarity: 0.9 },
      { a: "2", b: "3", similarity: 0.88 },
      { a: "4", b: "5", similarity: 0.91 },
    ]);
    const groups = buildClustersFromPairs(["1", "2", "3", "4", "5"], pairs);
    expect(groups.size).toBe(2);
    const idMap = assignClusterIds(groups);
    expect(idMap.get("1")).toBe(idMap.get("3"));
    expect(idMap.get("4")).not.toBe(idMap.get("1"));
  });
});

describe("pickClusterKeepers", () => {
  const scored = (id: string, composite: number): ScoredItem => ({
    id,
    subjectId: "management-of-care",
    blueprintTopic: "delegation",
    clusterId: "c1",
    quality: {
      composite,
      ruleScore: composite,
      llmScore: null,
      dimensions: {},
      tier: composite >= KEEP_MIN_SCORE ? "keep" : composite >= REVIEW_MIN_SCORE ? "review" : "drop",
      issues: [],
      scoredBy: "rule",
    },
  });

  it("keeps only the top scorer in a duplicate cluster", () => {
    const keep = pickClusterKeepers([
      scored("a", 8.5),
      scored("b", 7.2),
      scored("c", 6.1),
    ]);
    expect(keep).toEqual(["a"]);
  });

  it("may keep two when scores are close in large clusters", () => {
    const keep = pickClusterKeepers(
      [scored("a", 8.4), scored("b", 8.1), scored("c", 7.0)],
      { maxKeep: 2, minGapForSecond: 0.5 }
    );
    expect(keep).toContain("a");
    expect(keep).toContain("b");
  });
});

describe("resolveClientNeedsCategory", () => {
  it("maps practice subjects to client needs", () => {
    expect(resolveClientNeedsCategory("fundamentals")).toBe("basic-care");
    expect(resolveClientNeedsCategory("med-surg")).toBe("physiological-adaptation");
  });
});
