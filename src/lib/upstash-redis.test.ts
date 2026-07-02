import { describe, expect, it } from "vitest";
import { isUpstashRedisEnabled } from "@/lib/upstash-redis";

describe("upstash-redis", () => {
  it("reports disabled when env vars are unset", () => {
    expect(isUpstashRedisEnabled()).toBe(false);
  });
});
