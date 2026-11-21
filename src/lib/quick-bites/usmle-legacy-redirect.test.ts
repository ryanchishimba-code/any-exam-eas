import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("USMLE legacy cards URL", () => {
  it("308s /usmle/quick-bites to /usmle/rapid-review before the app renders", async () => {
    const rules = await nextConfig.redirects?.();
    const match = rules?.find((rule) => rule.source === "/usmle/quick-bites");
    expect(match).toMatchObject({
      source: "/usmle/quick-bites",
      destination: "/usmle/rapid-review",
      statusCode: 308,
    });
  });
});
