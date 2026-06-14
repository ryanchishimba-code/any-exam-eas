import { describe, expect, it } from "vitest";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  MPJE_ALL_STATE_SUBSTANTIVE_SEEDS,
  substantiveStateSeedCounts,
} from "./state-substantive-seeds";
import { MPJE_STATE_SUBSTANTIVE_SEEDS_BATCH_02 } from "./state-substantive-seeds-batch-02";
import { MPJE_QUESTION_BANK } from "./seed-questions";

const CORE_STATES = ["TX", "FL", "NY", "PA", "OH"] as const;
const NEW_STATES = ["IL", "NJ", "GA"] as const;

describe("MPJE state substantive seeds QA gate", () => {
  it("passes bank audit for every seed in all batches", () => {
    const failures: string[] = [];
    MPJE_ALL_STATE_SUBSTANTIVE_SEEDS.forEach((item, i) => {
      const report = auditBankItem(item, "mpje");
      if (!report.ok) {
        failures.push(
          `#${i} ${item.stateCode ?? "?"}: ${report.issues.map((x) => x.code).join(", ")}`
        );
      }
    });
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("passes bank audit for batch 02 alone", () => {
    for (const item of MPJE_STATE_SUBSTANTIVE_SEEDS_BATCH_02) {
      expect(auditBankItem(item, "mpje").ok).toBe(true);
    }
  });

  it("ships at least 15 cited items per core state after depth boost", () => {
    const counts = substantiveStateSeedCounts();
    for (const code of CORE_STATES) {
      expect(counts[code] ?? 0).toBeGreaterThanOrEqual(15);
    }
  });

  it("ships at least 10 cited items per new state", () => {
    const counts = substantiveStateSeedCounts();
    for (const code of NEW_STATES) {
      expect(counts[code] ?? 0).toBeGreaterThanOrEqual(10);
    }
    expect(counts.OK ?? 0).toBeGreaterThanOrEqual(4);
  });

  it("tags all seeds for curated qaPassed sync", () => {
    for (const item of MPJE_ALL_STATE_SUBSTANTIVE_SEEDS) {
      expect(item.tags).toContain("physician-educator");
      expect(item.tags).toContain("curated");
      expect(item.references?.length).toBeGreaterThan(0);
      expect(item.explanation?.length).toBeGreaterThanOrEqual(20);
      expect(item.stateCode).toBeTruthy();
    }
  });

  it("merges into MPJE_QUESTION_BANK", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    for (const code of [...CORE_STATES, ...NEW_STATES]) {
      expect(all.filter((i) => i.stateCode === code).length).toBeGreaterThanOrEqual(10);
    }
  });
});
