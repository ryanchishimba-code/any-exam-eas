import { describe, expect, it } from "vitest";
import {
  canonicalizeNclexBlueprintTopic,
  expandNclexBlueprintTopicMatchers,
  nclexBlueprintTopicMatchesAllowed,
} from "./blueprint-topic-aliases";

describe("expandNclexBlueprintTopicMatchers", () => {
  it("includes reverse aliases for a canonical Study Hub slug", () => {
    const matchers = expandNclexBlueprintTopicMatchers(["fluid-balance-io"]);
    expect(matchers).toEqual(
      expect.arrayContaining(["fluid-balance-io", "electrolytes", "fluids-electrolytes"])
    );
  });

  it("canonicalizes a legacy label into the Study Hub slug set", () => {
    expect(canonicalizeNclexBlueprintTopic("high-alert medications")).toBe(
      "medication-error-prevention"
    );
    expect(
      nclexBlueprintTopicMatchesAllowed("high-alert medications", [
        "medication-error-prevention",
      ])
    ).toBe(true);
  });
});
