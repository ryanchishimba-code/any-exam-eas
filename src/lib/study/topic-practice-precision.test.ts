import { describe, expect, it } from "vitest";
import { structurePracticeHref } from "@/lib/anatomy/structure-practice";
import type { BankItem } from "@/lib/question-bank";
import {
  bankItemMatchesNclexBlueprintTopicTags,
  filterItemsForNclexBlueprintTopics,
} from "@/lib/exam-prep/nclex/topic-blueprint-match";
import { filterItemsForNclexTopicPractice } from "@/lib/exam-prep/nclex/topic-practice-filter";
import { practiceFormatScopeCounts } from "@/lib/study/practice-format";

const cardiacTopics = ["cardiac-emergencies"];

const cardiacTagged = (id: string): BankItem => ({
  id,
  subjectId: "physiological-adaptation",
  blueprintTopic: "cardiac-emergencies",
  scenario: "ED. STEMI with ST elevation and diaphoresis.",
  question: "Priority intervention?",
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Reperfusion therapy.",
});

const psychMddSertraline: BankItem = {
  id: "psych-mdd-sertraline",
  subjectId: "physiological-adaptation",
  blueprintTopic: "cardiac-emergencies",
  tags: ["cardiac-emergencies", "mood-psychotic-disorders"],
  scenario:
    "Psychiatric unit. 28-year-old with MDD and suicidal ideation after starting sertraline.",
  question: "Which nursing intervention is the priority?",
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Safety for suicide risk.",
};

describe("cardiac topic practice tag precision", () => {
  it("rejects mis-tagged psych (MDD/sertraline/suicide) even when blueprintTopic is cardiac-emergencies", () => {
    expect(bankItemMatchesNclexBlueprintTopicTags(psychMddSertraline, cardiacTopics)).toBe(
      false
    );
    expect(
      filterItemsForNclexTopicPractice([psychMddSertraline, cardiacTagged("c1")], {
        blueprintTopics: cardiacTopics,
      }).map((row) => row.id)
    ).toEqual(["c1"]);
  });

  it("keeps only cardiac-tagged rows for a 10-question session slice", () => {
    const pool = [
      ...Array.from({ length: 10 }, (_, i) => cardiacTagged(`cardiac-${i}`)),
      psychMddSertraline,
    ];
    const served = filterItemsForNclexTopicPractice(pool, { blueprintTopics: cardiacTopics });
    expect(served).toHaveLength(10);
    for (const item of served) {
      expect(bankItemMatchesNclexBlueprintTopicTags(item, cardiacTopics)).toBe(true);
      expect(item.blueprintTopic).toBe("cardiac-emergencies");
    }
  });

  it("uses topic practice format counts on format tiles instead of subject totals", () => {
    const topicFormats = { mcq: 120, ngn: 14, case: 18 };
    const subjectFormats = { mcq: 619, ngn: 14, case: 19 };
    const scoped = practiceFormatScopeCounts({
      subjectId: "physiological-adaptation",
      formats: subjectFormats,
      topicFormats: { "physiological-adaptation": subjectFormats },
    });
    expect(scoped).toEqual(subjectFormats);
    expect(topicFormats).not.toEqual(scoped);
    expect(topicFormats.mcq + topicFormats.ngn + topicFormats.case).toBe(152);
    expect(scoped!.mcq + scoped!.ngn + scoped!.case).toBe(652);
  });
});

describe("heart launcher URL contract", () => {
  it("builds API query with blueprintTopics from structure practice href", () => {
    const href = structurePracticeHref(
      "nclex",
      { id: "heart", name: "Heart", practiceTopicSlug: "cardiovascular" },
      10
    );
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("blueprintTopics")).toContain("cardiac-emergencies");
    expect(url.searchParams.get("style")).toBe("standard");
  });
});
