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

  it("maps spaced legacy bank labels and garbage stem topics", () => {
    expect(canonicalizeNclexBlueprintTopic("standard precautions")).toBe(
      "standard-precautions-hand-hygiene"
    );
    expect(canonicalizeNclexBlueprintTopic("mass casualty")).toBe("disaster-triage");
    expect(
      canonicalizeNclexBlueprintTopic(
        "heart-failure-exacerbation-the-nurse-is-assigned-four-clients-on"
      )
    ).toBe("cardiac-emergencies");
  });

  it("does not treat musculoskeletal as burns-trauma", () => {
    const matchers = expandNclexBlueprintTopicMatchers(["burns-trauma"]);
    expect(matchers).toEqual(expect.arrayContaining(["burns-trauma", "burns", "trauma"]));
    expect(matchers).not.toContain("musculoskeletal");
  });
});
