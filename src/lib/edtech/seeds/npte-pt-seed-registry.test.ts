import { describe, expect, it } from "vitest";
import {
  NPTE_PT_SEED_BATCHES,
  collectNptePtSeedItems,
  nptePtStarterSeedCount,
} from "./npte-pt-seed-registry";

describe("NPTE-PT seed registry", () => {
  it("includes 2026 expansion batches 05–07", () => {
    const ids = NPTE_PT_SEED_BATCHES.map((b) => b.id);
    expect(ids).toContain("physician-educator-batch-05");
    expect(ids).toContain("physician-educator-batch-06");
    expect(ids).toContain("physician-educator-batch-07");
  });

  it("collects at least 140 curated seed items", () => {
    expect(nptePtStarterSeedCount()).toBeGreaterThanOrEqual(140);
    expect(collectNptePtSeedItems().length).toBe(nptePtStarterSeedCount());
  });

  it("batch 05 items use 2026 musculoskeletal topic slugs", () => {
    const batch05 = NPTE_PT_SEED_BATCHES.find((b) => b.id === "physician-educator-batch-05");
    const topics = batch05?.items.map((i) => i.ngnPayload?.blueprintTopic as string) ?? [];
    expect(topics).toContain("cervical-radiculopathy-stenosis");
    expect(topics).toContain("knee-oa-tka");
  });

  it("batch 06 items cover vestibular and autonomic dysreflexia topics", () => {
    const batch06 = NPTE_PT_SEED_BATCHES.find((b) => b.id === "physician-educator-batch-06");
    const topics = batch06?.items.map((i) => i.ngnPayload?.blueprintTopic as string) ?? [];
    expect(topics).toContain("balance-vestibular-disorders");
    expect(topics.some((t) => t.includes("sci"))).toBe(true);
  });
});
