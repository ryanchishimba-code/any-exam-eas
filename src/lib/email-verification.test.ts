import { afterEach, describe, expect, it, vi } from "vitest";
import { buildVerificationUrl } from "@/lib/email-verification";

describe("buildVerificationUrl", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllEnvs();
  });

  it("uses appBaseUrl origin and verification API path", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXTAUTH_URL", "https://www.anyexameasy.com");

    const url = buildVerificationUrl("raw-token-value", "pance");

    expect(url).toMatch(/^https:\/\/www\.anyexameasy\.com\//);
    expect(url).toContain("/api/auth/verify-email");
    expect(url).toContain("token=raw-token-value");
    expect(url).toContain("board=pance");
  });

  it("uses localhost in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000");

    const url = buildVerificationUrl("tok", null);

    expect(url.startsWith("http://localhost:3000/")).toBe(true);
  });
});
