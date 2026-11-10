import { describe, expect, it } from "vitest";
import { applyAttemptProgressToTiles, domainPracticeScore } from "./attempt-progress";
import type { DomainMapTile } from "@/components/dashboard/DomainMap";

const tile = (id: string, score: number): DomainMapTile => ({
  id,
  label: id,
  weightPct: 10,
  score,
  status: "needs_more_work",
  practiceHref: "/question-bank",
});

describe("domain practice progress", () => {
  it("scores a practiced domain from accuracy and leaves an unseen placeholder at 0", () => {
    expect(domainPracticeScore({ answered: 0, correct: 0 })).toBe(0);
    const next = applyAttemptProgressToTiles(
      [tile("safety-infection", 10), tile("pharmacology", 10)],
      [{ domainId: "pharmacology", answered: 40, correct: 28 }]
    );
    expect(next[0]?.score).toBe(0);
    expect(next[1]?.score).toBeGreaterThan(0);
    expect(next[0]?.score).not.toBe(next[1]?.score);
  });
});
