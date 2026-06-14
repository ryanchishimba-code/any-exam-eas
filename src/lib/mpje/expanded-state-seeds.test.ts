import { describe, expect, it } from "vitest";
import {
  expandedStateSeedCounts,
  MPJE_EXPANDED_STATE_SEEDS,
} from "./expanded-state-seeds";
import { MPJE_QUESTION_BANK } from "./seed-questions";

const EXPANDED_STATES = ["TX", "FL", "NY", "PA", "OH"] as const;

describe("MPJE_EXPANDED_STATE_SEEDS", () => {
  it("ships at least 8 cited items per expanded state", () => {
    const counts = expandedStateSeedCounts();
    for (const code of EXPANDED_STATES) {
      expect(counts[code] ?? 0).toBeGreaterThanOrEqual(8);
    }
  });

  it("tags items for curated qaPassed sync", () => {
    for (const item of MPJE_EXPANDED_STATE_SEEDS) {
      expect(item.tags).toContain("physician-educator");
      expect(item.tags).toContain("curated");
      expect(item.references?.length).toBeGreaterThan(0);
      expect(item.stateCode).toBeTruthy();
    }
  });

  it("merges best-tier expanded seeds into MPJE_QUESTION_BANK by state", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    for (const code of EXPANDED_STATES) {
      const stateItems = all.filter((i) => i.stateCode === code);
      expect(stateItems.length).toBeGreaterThanOrEqual(1);
    }
  });
});
