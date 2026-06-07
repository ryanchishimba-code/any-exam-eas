import { describe, expect, it } from "vitest";
import { highYieldTopicsHref } from "./practice-links";

describe("highYieldTopicsHref", () => {
  it("includes exam query param when slug is provided", () => {
    expect(highYieldTopicsHref("nclex")).toBe("/dashboard/topics?exam=nclex");
    expect(highYieldTopicsHref("usmle")).toBe("/dashboard/topics?exam=usmle");
  });

  it("returns base route when slug is omitted", () => {
    expect(highYieldTopicsHref()).toBe("/dashboard/topics");
  });
});
