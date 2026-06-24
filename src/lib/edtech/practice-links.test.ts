import { describe, expect, it } from "vitest";
import {
  highYieldTopicsHref,
  parseTopicPracticeReturn,
  practiceTopicHref,
} from "./practice-links";

describe("highYieldTopicsHref", () => {
  it("returns the topics route scoped to the user's active exam", () => {
    expect(highYieldTopicsHref("nclex")).toBe("/dashboard/topics");
    expect(highYieldTopicsHref("usmle")).toBe("/dashboard/topics");
    expect(highYieldTopicsHref()).toBe("/dashboard/topics");
  });
});

describe("practiceTopicHref return path", () => {
  it("embeds return params for review module round-trip", () => {
    const href = practiceTopicHref("nclex", "physiological-adaptation", 10, {
      topicSlug: "sepsis-shock",
      topicTitle: "Sepsis & Shock Prioritization",
    });
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("returnExam")).toBe("nclex");
    expect(url.searchParams.get("returnTopic")).toBe("sepsis-shock");
    expect(url.searchParams.get("returnTitle")).toBe("Sepsis & Shock Prioritization");
    expect(url.searchParams.get("returnMode")).toBeNull();
  });

  it("includes deep dive return mode when requested", () => {
    const href = practiceTopicHref("nclex", "physiological-adaptation", 10, {
      topicSlug: "sepsis-shock",
      topicTitle: "Sepsis module",
      deepDive: true,
    });
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("returnMode")).toBe("deep");
  });
});

describe("parseTopicPracticeReturn", () => {
  it("rebuilds high-yield topic href from bank params", () => {
    const params = new URLSearchParams({
      returnExam: "nclex",
      returnTopic: "sepsis-shock",
      returnTitle: "Sepsis & Shock Prioritization",
    });
    const parsed = parseTopicPracticeReturn(params);
    expect(parsed).toEqual({
      href: "/dashboard/topics?topic=sepsis-shock",
      label: "Sepsis & Shock Prioritization",
    });
  });

  it("returns null when return params are missing", () => {
    expect(parseTopicPracticeReturn(new URLSearchParams())).toBeNull();
  });
});
