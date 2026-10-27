import { describe, expect, it } from "vitest";
import {
  MARKETING_PHASE_1,
  filterMarketingPasses,
  freePassInsertData,
  marketingPassesToCsv,
  passStatus,
  summarizeCampaign,
  type MarketingPass,
} from "@/lib/promo/marketing-phase";

const redeemedAt = new Date("2026-10-27T15:00:00.000Z");

const rows: MarketingPass[] = [
  {
    code: "RN-TEST-AA",
    audience: "nursing",
    campaign: MARKETING_PHASE_1,
    currentUses: 0,
    redeemedAt: null,
    redeemerEmail: null,
  },
  {
    code: "RN-TEST-BB",
    audience: "nursing",
    campaign: MARKETING_PHASE_1,
    currentUses: 1,
    redeemedAt,
    redeemerEmail: "nurse@example.com",
  },
  {
    code: "RX-TEST-CC",
    audience: "pharmacy",
    campaign: MARKETING_PHASE_1,
    currentUses: 0,
    redeemedAt: null,
    redeemerEmail: null,
  },
  {
    code: "RN-OTHER-DD",
    audience: "nursing",
    campaign: "Other",
    currentUses: 1,
    redeemedAt,
    redeemerEmail: "other@example.com",
  },
];

describe("marketing phase 1 totals", () => {
  it("counts only Marketing Phase 1 and splits nursing from pharmacy", () => {
    const totals = summarizeCampaign(rows);
    expect(totals.campaign).toBe("Marketing Phase 1");
    expect(totals.issued).toBe(3);
    expect(totals.redeemed).toBe(1);
    expect(totals.redeemedPercent).toBe(33.3);
    expect(totals.nursingIssued).toBe(2);
    expect(totals.nursingRedeemed).toBe(1);
    expect(totals.pharmacyIssued).toBe(1);
    expect(totals.pharmacyRedeemed).toBe(0);
  });

  it("treats a use without a timestamp as redeemed", () => {
    expect(passStatus({ currentUses: 1, redeemedAt: null })).toBe("redeemed");
    expect(passStatus({ currentUses: 0, redeemedAt: null })).toBe("unused");
  });

  it("filters by audience and status", () => {
    const filtered = filterMarketingPasses(rows, { audience: "nursing", status: "unused" });
    expect(filtered.map((row) => row.code)).toEqual(["RN-TEST-AA"]);
  });

  it("tags each inserted pass with Marketing Phase 1", () => {
    expect(
      freePassInsertData({
        code: "RN-TEST-AA",
        audience: "nursing",
        compDays: 30,
        maxUses: 1,
      }).campaign
    ).toBe(MARKETING_PHASE_1);
  });

  it("exports status, date, and email without dropping unused rows", () => {
    const csv = marketingPassesToCsv(filterMarketingPasses(rows, { audience: "pharmacy" }));
    expect(csv.split("\n")[0]).toBe("code,audience,campaign,status,redeemed_at,redeemer_email");
    expect(csv).toContain("RX-TEST-CC,pharmacy,Marketing Phase 1,unused,,");
    expect(csv).not.toContain("nurse@example.com");
  });
});
