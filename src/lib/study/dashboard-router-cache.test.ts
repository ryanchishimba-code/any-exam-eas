import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("dashboard navigation cache", () => {
  it("keeps a short client cache for the dashboard shell", async () => {
    expect(nextConfig.experimental?.staleTimes?.dynamic).toBe(45);

    const rules = await nextConfig.headers?.();
    const dashboard = rules?.find((rule) => rule.source === "/dashboard");
    const cacheControl = dashboard?.headers?.find((header) => header.key === "Cache-Control");
    expect(cacheControl?.value ?? "").not.toContain("no-store");
  });
});
