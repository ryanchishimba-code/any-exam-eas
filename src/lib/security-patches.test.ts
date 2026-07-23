import { describe, expect, it } from "vitest";
import { isHealthDetailAuthorized } from "@/lib/health-check";
import { sanitizeDiscountForPublic } from "@/lib/discount/public-response";

describe("isHealthDetailAuthorized", () => {
  it("requires Bearer CRON_SECRET", () => {
    const prev = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    try {
      expect(
        isHealthDetailAuthorized(
          new Request("http://localhost/api/health", {
            headers: { authorization: "Bearer test-secret" },
          })
        )
      ).toBe(true);
      expect(
        isHealthDetailAuthorized(new Request("http://localhost/api/health"))
      ).toBe(false);
      expect(
        isHealthDetailAuthorized(
          new Request("http://localhost/api/health", {
            headers: { authorization: "Bearer wrong" },
          })
        )
      ).toBe(false);
    } finally {
      process.env.CRON_SECRET = prev;
    }
  });
});

describe("sanitizeDiscountForPublic", () => {
  it("collapses enumerable failure codes", () => {
    const out = sanitizeDiscountForPublic({
      valid: false,
      code: "FAKE",
      errorCode: "not_found",
      message: "specific",
      fullAccessIncluded: true,
    });
    expect(out.errorCode).toBe("invalid_code");
    expect(out.message).toMatch(/isn't valid or can't be applied/i);
  });

  it("preserves already_redeemed for signed-in users", () => {
    const out = sanitizeDiscountForPublic({
      valid: false,
      code: "USED",
      errorCode: "already_redeemed",
      message: "You've already used this code.",
      fullAccessIncluded: true,
    });
    expect(out.errorCode).toBe("already_redeemed");
  });

  it("strips stripeCouponId from public payloads", () => {
    const out = sanitizeDiscountForPublic({
      valid: true,
      code: "AEE50",
      message: "ok",
      stripeCouponId: "coup_secret",
      fullAccessIncluded: true,
    });
    expect(out.valid).toBe(true);
    expect(out.stripeCouponId).toBeUndefined();
  });
});
