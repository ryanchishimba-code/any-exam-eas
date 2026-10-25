import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appendTopicPracticeFiltersToQuery,
  mergeTopicPracticeFiltersIntoQuery,
  topicPracticeLaunchSearchParams,
} from "./topic-practice-query";

describe("topic practice query helpers", () => {
  it("copies blueprint and board topic filters onto an API query", () => {
    const source = new URLSearchParams({
      blueprintTopics: "cardiac-emergencies",
      nclexPreset: "trap-tier-drill",
      subjectId: "physiological-adaptation",
    });
    const target = new URLSearchParams({ field: "nursing", limit: "10" });
    appendTopicPracticeFiltersToQuery(target, source);
    expect(target.get("blueprintTopics")).toBe("cardiac-emergencies");
    expect(target.get("nclexPreset")).toBe("trap-tier-drill");
    expect(target.get("subjectId")).toBeNull();
  });

  it("merges filters when rewriting the question-bank URL", () => {
    const source = new URLSearchParams({
      blueprintTopics: "gi-disorders",
      usmleTopic: "gastrointestinal",
    });
    const target = new URLSearchParams({
      mode: "bank",
      field: "nursing",
      subjectId: "physiological-adaptation",
      count: "10",
      style: "standard",
    });
    mergeTopicPracticeFiltersIntoQuery(target, source);
    expect(target.get("blueprintTopics")).toBe("gi-disorders");
    expect(target.get("usmleTopic")).toBe("gastrointestinal");
  });

  it("merges blueprintTopics from the browser when the hook omits them", () => {
    vi.stubGlobal("window", {
      location: { search: "?blueprintTopics=cardiac-emergencies" },
    });
    const hook = new URLSearchParams("field=nursing&style=standard");
    expect(topicPracticeLaunchSearchParams(hook).get("blueprintTopics")).toBe(
      "cardiac-emergencies"
    );
    vi.unstubAllGlobals();
  });
});
