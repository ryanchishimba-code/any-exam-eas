import { describe, expect, it } from "vitest";
import {
  hashPassword,
  isValidPasswordHash,
  passwordCredentialFields,
  verifyPassword,
} from "@/lib/password-hash";

describe("password-hash", () => {
  it("round-trips hash and verify", async () => {
    const hash = await hashPassword("TestLogin1!");
    expect(isValidPasswordHash(hash)).toBe(true);
    expect(await verifyPassword("TestLogin1!", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("sets credential metadata fields", async () => {
    const hash = await hashPassword("Secret1!");
    const fields = passwordCredentialFields(hash);
    expect(fields.passwordAlgo).toBe("bcrypt_12");
    expect(fields.passwordUpdatedAt).toBeInstanceOf(Date);
  });
});
