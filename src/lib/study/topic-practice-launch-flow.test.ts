import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { structurePracticeHref } from "@/lib/anatomy/structure-practice";
import type { BankItem } from "@/lib/question-bank";
import { bankItemMatchesNclexBlueprintTopicTags } from "@/lib/exam-prep/nclex/topic-blueprint-match";
import { filterItemsForNclexTopicPractice } from "@/lib/exam-prep/nclex/topic-practice-filter";
import {
  parseTopicPracticeLaunchFilters,
  topicPracticeFiltersActive,
} from "./topic-practice-filters";
import {
  appendTopicPracticeFiltersToQuery,
  topicPracticeLaunchSearchParams,
} from "./topic-practice-query";

describe("anatomy heart topic-practice launch flow", () => {
  const heartHref = structurePracticeHref(
    "nclex",
    { id: "heart", name: "Heart", practiceTopicSlug: "cardiovascular" },
    10
  );

  it("keeps blueprint filters on the /api/questions query the client builds", () => {
    const launcher = new URL(heartHref, "http://localhost");
    const launchParams = topicPracticeLaunchSearchParams(launcher.searchParams);
    const filters = parseTopicPracticeLaunchFilters(launchParams);
    expect(topicPracticeFiltersActive(filters)).toBe(true);
    expect(filters.blueprintTopics).toContain("cardiac-emergencies");

    const apiQs = new URLSearchParams({
      field: "nursing",
      limit: "10",
      mode: "bank",
      subjectId: "physiological-adaptation",
    });
    appendTopicPracticeFiltersToQuery(apiQs, launchParams);
    expect(apiQs.get("blueprintTopics")).toContain("cardiac-emergencies");
  });

  it("recovers blueprintTopics from the browser bar when the Next hook is stale", () => {
    vi.stubGlobal("window", {
      location: {
        search:
          "?field=nursing&subjectId=physiological-adaptation&blueprintTopics=cardiac-emergencies&style=standard&count=10",
      },
    });
    try {
      const staleHook = new URLSearchParams(
        "field=nursing&subjectId=physiological-adaptation&style=standard&count=10"
      );
      const merged = topicPracticeLaunchSearchParams(staleHook);
      expect(merged.get("blueprintTopics")).toBe("cardiac-emergencies");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("serves only cardiac blueprint items for the heart launcher filters", () => {
    const launcher = new URL(heartHref, "http://localhost");
    const filters = parseTopicPracticeLaunchFilters(launcher.searchParams);
    const cardiacItem: BankItem = {
      subjectId: "physiological-adaptation",
      blueprintTopic: "cardiac-emergencies",
      vignette: "ED. STEMI with ST elevation.",
      question: "Priority intervention?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Reperfusion.",
    };
    const screeningItem: BankItem = {
      subjectId: "physiological-adaptation",
      blueprintTopic: "cancer-screening",
      vignette: "Clinic. Mammography screening discussion.",
      question: "Best teaching?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Screening guidelines.",
    };
    const filtered = filterItemsForNclexTopicPractice(
      [cardiacItem, screeningItem],
      { blueprintTopics: filters.blueprintTopics },
      { strict: true }
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.blueprintTopic).toBe("cardiac-emergencies");
    for (const item of filtered) {
      expect(bankItemMatchesNclexBlueprintTopicTags(item, filters.blueprintTopics ?? [])).toBe(
        true
      );
    }
  });
});

describe("topicPracticeLaunchSearchParams", () => {
  beforeEach(() => {
    vi.stubGlobal("window", undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns hook params on the server", () => {
    const hook = new URLSearchParams("blueprintTopics=gi-disorders&field=nursing");
    expect(topicPracticeLaunchSearchParams(hook).get("blueprintTopics")).toBe("gi-disorders");
  });
});
