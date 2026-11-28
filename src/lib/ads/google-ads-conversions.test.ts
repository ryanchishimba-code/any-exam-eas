import { describe, expect, it } from "vitest";
import {
  buildClickConversion,
  failedIndexes,
  formatAdsDateTime,
  invoiceRevenueMinor,
  readAdsUploadConfig,
} from "@/lib/ads/google-ads-conversions";

const cfg = { customerId: "9177079098", paidActionId: "111", trialActionId: "222" };

describe("google ads offline conversions", () => {
  it("formats the conversion time in Google's format", () => {
    expect(formatAdsDateTime(new Date("2026-11-28T03:04:05.678Z"))).toBe("2026-11-28 03:04:05+00:00");
  });

  it("sends real revenue and currency for paid, none for trial", () => {
    const base = { orderId: "in_1", gclid: "g1234567890", gbraid: null, wbraid: null, currency: "USD", occurredAt: new Date("2026-11-28T00:00:00Z") };
    const paid = buildClickConversion({ ...base, kind: "paid", valueMinor: 23512 }, cfg);
    expect(paid).toMatchObject({
      conversionAction: "customers/9177079098/conversionActions/111",
      conversionValue: 235.12,
      currencyCode: "USD",
      orderId: "in_1",
      gclid: "g1234567890",
    });
    const trial = buildClickConversion({ ...base, kind: "trial", valueMinor: null, orderId: "trial_u1" }, cfg);
    expect(trial.conversionValue).toBeUndefined();
    expect(trial.conversionAction).toBe("customers/9177079098/conversionActions/222");
  });

  it("uses one click id only", () => {
    const row = { kind: "trial", orderId: "t", gclid: null, gbraid: "gb12345678901", wbraid: "wb12345678901", valueMinor: null, currency: "USD", occurredAt: new Date() };
    const out = buildClickConversion(row, cfg);
    expect(out.gbraid).toBe("gb12345678901");
    expect(out.wbraid).toBeUndefined();
  });

  it("subtracts tax from invoice revenue", () => {
    expect(invoiceRevenueMinor({ amount_paid: 2799, total_tax_amounts: [{ amount: 199 }] } as never)).toBe(2600);
    expect(invoiceRevenueMinor({ amount_paid: 0 } as never)).toBe(0);
  });

  it("maps partial failures back to row indexes", () => {
    const resp = {
      partialFailureError: {
        details: [{ errors: [{ message: "expired click", location: { fieldPathElements: [{ fieldName: "conversions", index: 2 }] } }] }],
      },
    };
    expect(failedIndexes(resp).get(2)).toBe("expired click");
    expect(failedIndexes({}).size).toBe(0);
  });

  it("is not configured without credentials", () => {
    expect(readAdsUploadConfig({} as NodeJS.ProcessEnv)).toBeNull();
  });
});
