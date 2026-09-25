import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("dashboard mix cache", () => {
  it("does not reuse a previous dynamic payload for the Today mix", async () => {
    expect(nextConfig.experimental?.staleTimes?.dynamic).toBe(0);

    const rules = await nextConfig.headers?.();
    const dashboard = rules?.find((rule) => rule.source === "/dashboard");
    expect(dashboard?.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "Cache-Control",
          value: expect.stringContaining("no-store"),
        }),
      ])
    );
  });
});
