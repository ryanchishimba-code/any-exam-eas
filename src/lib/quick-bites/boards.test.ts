import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  QUICK_BITE_BOARDS,
  isQuickBitePath,
  quickBiteRouteForLegacyHash,
} from "./boards";

describe("Quick Bites board routes", () => {
  it("keeps one page and one legacy dashboard anchor per board", () => {
    expect(QUICK_BITE_BOARDS.nclex).toMatchObject({
      series: "nursing",
      route: "/nclex/quick-bites",
      legacyHash: "video-quick-bites",
    });
    expect(QUICK_BITE_BOARDS.naplex.route).toBe("/naplex/quick-bites");
    expect(QUICK_BITE_BOARDS["aanp-fnp"].route).toBe("/aanp-fnp/quick-bites");
    expect(QUICK_BITE_BOARDS.pance.route).toBe("/pance/quick-bites");
    expect(quickBiteRouteForLegacyHash("#video-quick-bites-pharmacy")).toBe("/naplex/quick-bites");
    expect(quickBiteRouteForLegacyHash("")).toBeNull();
    expect(isQuickBitePath("/nclex/quick-bites")).toBe(true);
    expect(isQuickBitePath("/nclex")).toBe(false);
    expect(isQuickBitePath("/nclex/study-guide")).toBe(false);
  });

  it("is listed in the auth matcher as its own route", () => {
    const middleware = readFileSync(new URL("../../middleware.ts", import.meta.url), "utf8");
    for (const board of Object.values(QUICK_BITE_BOARDS)) {
      expect(middleware).toContain(`"${board.route}"`);
    }
    expect(middleware).not.toContain("/dashboard#video-quick-bites");
  });
});
