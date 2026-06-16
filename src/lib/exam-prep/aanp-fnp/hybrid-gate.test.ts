import { describe, expect, it } from "vitest";
import { collectAanpFnpSeedItems } from "@/lib/edtech/seeds/aanp-fnp-seed-registry";
import { assessAanpFnpBankItem } from "./quality-gate";
import {
  aanpFnpPassesHybridIngestGate,
  runAanpFnpHybridGateSync,
} from "./hybrid-gate";
import { bankItemPassesIngestGate } from "../bank-ingest-gate";

describe("aanp-fnp hybrid gate", () => {
  it("aligns hybrid ingest with bankItemPassesIngestGate", () => {
    const seed = collectAanpFnpSeedItems()[0]!;
    expect(aanpFnpPassesHybridIngestGate(seed, "seed")).toBe(
      bankItemPassesIngestGate("aanp-fnp", seed, "seed")
    );
  });

  it("accepts curated seeds via hybrid sync gate", () => {
    for (const seed of collectAanpFnpSeedItems()) {
      const result = runAanpFnpHybridGateSync(seed, { source: "seed" });
      expect(result.ingestReady).toBe(true);
      expect(result.tier).toBe("ready");
    }
  });

  it("does not block on advisory qcScore when ingest passes", () => {
    const seed = collectAanpFnpSeedItems()[0]!;
    const advisory = assessAanpFnpBankItem(seed, { source: "seed" });
    const hybrid = runAanpFnpHybridGateSync(seed, { source: "seed" });
    expect(hybrid.ingestReady).toBe(true);
    // Advisory score may vary; ingest bar is authoritative.
    expect(advisory.qcScore).toBeGreaterThan(0);
  });
});
