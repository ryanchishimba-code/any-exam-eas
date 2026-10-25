import { describe, expect, it } from "vitest";
import { structurePracticeHref } from "@/lib/anatomy/structure-practice";
import { filterItemsForNclexTopicPractice } from "@/lib/exam-prep/nclex/topic-practice-filter";
import type { BankItem } from "@/lib/question-bank";
import {
  parseTopicPracticeLaunchFilters,
  topicPracticeBlueprintLabel,
  topicPracticeFiltersActive,
  topicPracticePreviewTitle,
} from "./topic-practice-filters";
import {
  deliberateFormatForLaunch,
  resolveQuestionBankStyleAndFormat,
} from "./question-bank-setup";

describe("parseTopicPracticeLaunchFilters", () => {
  it("reads blueprintTopics from anatomy heart launcher URL", () => {
    const href = structurePracticeHref(
      "nclex",
      { id: "heart", name: "Heart", practiceTopicSlug: "cardiovascular" },
      10
    );
    const url = new URL(href, "http://localhost");
    const filters = parseTopicPracticeLaunchFilters(url.searchParams);
    expect(filters.blueprintTopics).toContain("cardiac-emergencies");
    expect(topicPracticeFiltersActive(filters)).toBe(true);
  });
});

describe("topic practice setup UI helpers", () => {
  it("shows cardiac label in preview title", () => {
    const title = topicPracticePreviewTitle({
      fieldId: "nursing",
      subjectLabel: "Physiological Adaptation",
      filters: { blueprintTopics: ["cardiac-emergencies"] },
    });
    expect(title).toContain("Cardiac");
    expect(title).toContain("Physiological Adaptation");
    expect(topicPracticeBlueprintLabel("nursing", ["cardiac-emergencies"])).toContain("Cardiac");
  });
});

describe("style=standard topic practice launch", () => {
  it("does not inherit remembered NGN format", () => {
    const resolved = resolveQuestionBankStyleAndFormat({
      styleParam: "standard",
      formatParam: null,
      persistedStyle: "adaptive",
      persistedFormat: "ngn",
      topicPracticeLaunch: true,
    });
    expect(resolved.style).toBe("standard");
    expect(resolved.format).toBe("all");
  });

  it("blocks deliberate NGN launch when topic practice is active", () => {
    expect(
      deliberateFormatForLaunch("standard", "ngn", { topicPracticeLaunch: true })
    ).toBeNull();
  });
});

describe("NCLEX topic practice serve filter", () => {
  const cardiacItem: BankItem = {
    subjectId: "physiological-adaptation",
    blueprintTopic: "cardiac-emergencies",
    vignette: "ED. Chest pain radiating to the jaw, diaphoresis.",
    question: "Which action is the priority?",
    options: ["Obtain 12-lead ECG", "A", "B", "C"],
    correctAnswer: "Obtain 12-lead ECG",
    explanation: "ECG within 10 minutes for ACS.",
  };

  const adrenalItem: BankItem = {
    subjectId: "physiological-adaptation",
    blueprintTopic: "endocrine-emergencies",
    itemType: "bow_tie",
    vignette: "Client in adrenal crisis with hypotension.",
    question: "Complete the bow-tie.",
    options: ["Hydrocortisone", "A", "B", "C"],
    correctAnswer: "Hydrocortisone",
    explanation: "Stress-dose steroids for adrenal crisis.",
  };

  it("serves only tag-matched items for the requested blueprint topic", () => {
    const filtered = filterItemsForNclexTopicPractice(
      [cardiacItem, adrenalItem],
      { blueprintTopics: ["cardiac-emergencies"] },
      { strict: true }
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.blueprintTopic).toBe("cardiac-emergencies");
  });
});
