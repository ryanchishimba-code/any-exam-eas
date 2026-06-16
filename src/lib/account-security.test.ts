import { describe, expect, it } from "vitest";
import {
  canBypassAccountIpLimit,
  credentialsLoginBlocked,
  isAccountDisabled,
  isReservedInternalEmail,
} from "@/lib/account-security";

describe("account-security", () => {
  it("reserves internal test inboxes from public signup", () => {
    expect(isReservedInternalEmail("test-premium@anyexameasy.test")).toBe(true);
    expect(isReservedInternalEmail("user@gmail.com")).toBe(false);
  });

  it("lets staff and test accounts bypass IP limits", () => {
    expect(canBypassAccountIpLimit("test-premium@anyexameasy.test", "user")).toBe(true);
    expect(canBypassAccountIpLimit("user@gmail.com", "admin")).toBe(true);
    expect(canBypassAccountIpLimit("user@gmail.com", "user")).toBe(false);
  });

  it("blocks credentials login for deleted, suspended, or corrupt accounts", () => {
    expect(
      credentialsLoginBlocked({
        accountStatus: "deleted",
        passwordHash: "$2a$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012",
      })
    ).toBe("deleted");
    expect(
      credentialsLoginBlocked({ accountStatus: "suspended", passwordHash: "x" })
    ).toBe("suspended");
    expect(credentialsLoginBlocked({ accountStatus: "active", passwordHash: null })).toBe(
      "no_password"
    );
    expect(
      credentialsLoginBlocked({ accountStatus: "active", passwordHash: "not-valid" })
    ).toBe("invalid_hash");
  });

  it("treats suspended and deleted as disabled", () => {
    expect(isAccountDisabled("deleted")).toBe(true);
    expect(isAccountDisabled("active")).toBe(false);
  });
});
