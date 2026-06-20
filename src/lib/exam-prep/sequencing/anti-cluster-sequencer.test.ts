import { describe, expect, it } from "vitest";
import { sequenceItems } from "./anti-cluster-sequencer";
import { DEFAULT_SEQUENCING_CONFIG, type SequenceItem } from "./types";

type Raw = SequenceItem;

const identity = (x: Raw): SequenceItem => x;

function makePool(opts: {
  total: number;
  domains: string[];
  answers: string[];
  formats?: string[];
  conceptsPerItem?: (i: number) => string[];
  difficulty?: (i: number) => number;
}): Raw[] {
  const formats = opts.formats ?? ["mcq"];
  return Array.from({ length: opts.total }, (_, i) => ({
    id: `q${i}`,
    domain: opts.domains[i % opts.domains.length],
    concepts: opts.conceptsPerItem ? opts.conceptsPerItem(i) : [`c${i % 7}`],
    difficulty: opts.difficulty ? opts.difficulty(i) : (i % 5) + 1,
    format: formats[i % formats.length],
    answer: opts.answers[i % opts.answers.length],
  }));
}

describe("sequenceItems", () => {
  it("returns every item exactly once", () => {
    const pool = makePool({
      total: 100,
      domains: ["d1", "d2", "d3", "d4", "d5"],
      answers: ["A", "B", "C", "D"],
    });
    const { ordered } = sequenceItems(pool, identity);
    expect(ordered).toHaveLength(100);
    expect(new Set(ordered.map((o) => o.id)).size).toBe(100);
  });

  it("never produces a run of 3+ identical answers when answers are diverse", () => {
    const pool = makePool({
      total: 100,
      domains: ["d1", "d2", "d3", "d4", "d5"],
      answers: ["A", "B", "C", "D"],
    });
    const { report } = sequenceItems(pool, identity);
    expect(report.longestAnswerStreak).toBeLessThanOrEqual(DEFAULT_SEQUENCING_CONFIG.maxAnswerStreak);
  });

  it("spreads domains so no domain-gap violations occur when feasible", () => {
    // 5 equal domains (20% each) across 100 items IS separable by >=4.
    const pool = makePool({
      total: 100,
      domains: ["d1", "d2", "d3", "d4", "d5"],
      answers: ["A", "B", "C", "D"],
    });
    const { report } = sequenceItems(pool, identity);
    expect(report.domainGapViolations).toBe(0);
    expect(report.domainMinSeparation).toBeGreaterThanOrEqual(DEFAULT_SEQUENCING_CONFIG.domainMinGap);
  });

  it("minimizes (does not crash on) an infeasible domain distribution", () => {
    // 40% from one domain cannot be separated by >=4 across 100 slots
    // (40*4 > 100); the sequencer should still return all items.
    const pool = makePool({
      total: 100,
      domains: ["big", "big", "d2", "d3", "d5"],
      answers: ["A", "B", "C", "D"],
    });
    const { ordered, report } = sequenceItems(pool, identity);
    expect(ordered).toHaveLength(100);
    expect(report.total).toBe(100);
  });

  it("avoids placing two hard items adjacently when the mix allows it", () => {
    const pool = makePool({
      total: 100,
      domains: ["d1", "d2", "d3", "d4", "d5"],
      answers: ["A", "B", "C", "D"],
      // ~30% hard (difficulty 4/5) — separable across 100 slots.
      difficulty: (i) => (i % 10 < 3 ? 4 : 2),
    });
    const { report } = sequenceItems(pool, identity);
    expect(report.adjacentHardPairs).toBe(0);
  });

  it("is deterministic for a fixed seed", () => {
    const pool = makePool({
      total: 60,
      domains: ["d1", "d2", "d3"],
      answers: ["A", "B", "C", "D"],
    });
    const a = sequenceItems(pool, identity, {}, 123).ordered.map((o) => o.id);
    const b = sequenceItems(pool, identity, {}, 123).ordered.map((o) => o.id);
    expect(a).toEqual(b);
  });

  it("handles trivial pools", () => {
    expect(sequenceItems([], identity).ordered).toEqual([]);
    const one = makePool({ total: 1, domains: ["d1"], answers: ["A"] });
    expect(sequenceItems(one, identity).ordered).toHaveLength(1);
  });
});
