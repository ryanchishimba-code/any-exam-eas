import { describe, expect, it } from "vitest";
import { isClientAnalyticsSessionId, isDbUserSessionId } from "./session-id";

describe("analytics session id helpers", () => {
  it("detects browser UUID session ids", () => {
    expect(isClientAnalyticsSessionId("a1b2c3d4-e5f6-4789-a012-3456789abcde")).toBe(
      true
    );
    expect(isDbUserSessionId("a1b2c3d4-e5f6-4789-a012-3456789abcde")).toBe(false);
  });

  it("detects Prisma cuid UserSession ids", () => {
    expect(isDbUserSessionId("cmrmfq5ier9usprbd0abc")).toBe(true);
    expect(isClientAnalyticsSessionId("cmrmfq5ier9usprbd0abc")).toBe(false);
  });

  it("rejects empty / garbage", () => {
    expect(isDbUserSessionId("")).toBe(false);
    expect(isDbUserSessionId("not-a-session")).toBe(false);
  });
});
