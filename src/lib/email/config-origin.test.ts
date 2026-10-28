import { afterEach, describe, expect, it, vi } from "vitest";
import { appBaseUrl } from "@/lib/email/config";

describe("appBaseUrl production origin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes bare anyexameasy.com to www for email and auth redirects", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXTAUTH_URL", "https://anyexameasy.com");

    expect(appBaseUrl()).toBe("https://www.anyexameasy.com");
  });
});
