import { afterEach, describe, expect, it, vi } from "vitest";
import {
  marketingUnsubscribePageUrl,
  readMarketingUnsubscribeToken,
  signMarketingUnsubscribeToken,
} from "@/lib/email/marketing-preference";

describe("marketing unsubscribe token", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("round-trips a user id and rejects a tampered token", () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-that-is-long-enough");
    const token = signMarketingUnsubscribeToken("user_123");
    expect(readMarketingUnsubscribeToken(token)).toBe("user_123");
    expect(readMarketingUnsubscribeToken(`${token}x`)).toBeNull();
    expect(marketingUnsubscribePageUrl("user_123")).toContain("/email/unsubscribe?token=");
  });
});
