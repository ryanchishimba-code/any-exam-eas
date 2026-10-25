import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FINISH_LINE_FINE_PRINT_BEFORE_TERMS,
  FINISH_LINE_HERO_LINE,
  FINISH_LINE_TERMS_PATH,
  assertFinishLineCopySafe,
  isFinishLineEligibleInterval,
  isFinishLineOfferEnabled,
} from "@/lib/marketing/finish-line-offer";
import { paymentsNonRefundableSentence } from "@/lib/marketing/payments-refundable-copy";
import {
  buildFinishLineTermsHtml,
  resolveFinishLineTermsPlaceholders,
} from "@/lib/marketing/finish-line-terms";

describe("finish line offer flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to disabled when unset", () => {
    vi.stubEnv("OFFER_FINISH_LINE_ENABLED", "");
    expect(isFinishLineOfferEnabled()).toBe(false);
  });

  it("enables on true/1", () => {
    vi.stubEnv("OFFER_FINISH_LINE_ENABLED", "true");
    expect(isFinishLineOfferEnabled()).toBe(true);
    vi.stubEnv("OFFER_FINISH_LINE_ENABLED", "1");
    expect(isFinishLineOfferEnabled()).toBe(true);
  });

  it("treats semiannual and yearly as 4-month+ plans", () => {
    expect(isFinishLineEligibleInterval("monthly")).toBe(false);
    expect(isFinishLineEligibleInterval("quarterly")).toBe(false);
    expect(isFinishLineEligibleInterval("semiannual")).toBe(true);
    expect(isFinishLineEligibleInterval("yearly")).toBe(true);
  });

  it("keeps hero copy free of forbidden guarantee language", () => {
    assertFinishLineCopySafe(FINISH_LINE_HERO_LINE);
    assertFinishLineCopySafe(FINISH_LINE_FINE_PRINT_BEFORE_TERMS);
    expect(FINISH_LINE_TERMS_PATH).toBe("/finish-line-refund-terms");
  });

  it("uses finish-line-aware non-refundable copy when the flag is on", () => {
    vi.stubEnv("OFFER_FINISH_LINE_ENABLED", "true");
    expect(paymentsNonRefundableSentence()).toContain("Finish Line Refund terms");
    expect(paymentsNonRefundableSentence()).toContain(FINISH_LINE_TERMS_PATH);
  });
});

describe("finish line terms content", () => {
  it("replaces bracket placeholders", () => {
    expect(resolveFinishLineTermsPlaceholders("Within [30] days.")).toBe(
      "Within To be confirmed days."
    );
  });

  it("omits draft banners and bracket placeholders from rendered html", () => {
    const html = buildFinishLineTermsHtml();
    expect(html).not.toMatch(/ATTORNEY REVIEW REQUIRED/i);
    expect(html).not.toMatch(/\[[^\]]+\]/);
    expect(html).toContain("To be confirmed");
    expect(html).toContain(FINISH_LINE_HERO_LINE);
  });
});
