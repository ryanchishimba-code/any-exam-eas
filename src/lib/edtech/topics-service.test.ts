import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("high-yield topic request path", () => {
  it("reads topics and does not upsert them while serving a page", () => {
    const source = readFileSync(new URL("./topics-service.ts", import.meta.url), "utf8");
    expect(source).toContain("highYieldTopic.findMany");
    expect(source).not.toContain("highYieldTopic.upsert");
    expect(source).not.toContain("$transaction");
  });
});
