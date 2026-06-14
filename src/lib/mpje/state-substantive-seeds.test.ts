import { describe, expect, it } from "vitest";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  MPJE_ALL_STATE_SUBSTANTIVE_SEEDS,
} from "./state-substantive-seeds";
import { MPJE_STATE_SUBSTANTIVE_SEEDS_BATCH_02 } from "./state-substantive-seeds-batch-02";
import { MPJE_QUESTION_BANK } from "./seed-questions";

const CORE_STATES = ["TX", "FL", "OH"] as const;
const NEW_STATES = ["IL", "GA", "OK"] as const;

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

  it("ships cited best-tier items per core state in the active bank", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    for (const code of CORE_STATES) {
      expect(all.filter((i) => i.stateCode === code).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("merges best-tier seeds into MPJE_QUESTION_BANK", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    for (const code of [...CORE_STATES, ...NEW_STATES]) {
      expect(all.filter((i) => i.stateCode === code).length).toBeGreaterThanOrEqual(1);
    }
  });
});
