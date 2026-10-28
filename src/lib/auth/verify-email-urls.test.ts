import { describe, expect, it } from "vitest";
import {
  AUTH_LOGIN_PATH,
  dashboardVerifiedUrl,
  loginWithVerifyQuery,
} from "@/lib/auth/verify-email-urls";

describe("verify-email-urls", () => {
  it("builds canonical login URLs without an extra redirect hop", () => {
    expect(AUTH_LOGIN_PATH).toBe("/auth/login");
    expect(loginWithVerifyQuery("invalid")).toBe("/auth/login?verify=invalid");
    expect(loginWithVerifyQuery("missing")).toBe("/auth/login?verify=missing");
  });

  it("builds dashboard success query", () => {
    expect(dashboardVerifiedUrl()).toBe("/dashboard?verified=1");
  });
});
