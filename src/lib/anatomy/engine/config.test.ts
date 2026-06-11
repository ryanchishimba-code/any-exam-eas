import { describe, expect, it } from "vitest";
import { getAnatomyEngineSurface } from "./config";

describe("anatomy engine config", () => {
  it("defaults to reference capture when no model URL is set", () => {
    expect(getAnatomyEngineSurface()).toBe("reference");
  });
});
