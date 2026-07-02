import { describe, expect, it } from "vitest";
import {
  NCLEX_STUDY_PRESETS,
  getNclexStudyPreset,
  nclexPresetPracticeHref,
} from "./study-presets";
import { matchesNclexStudyPreset } from "./session-preset-filters";
import type { BankItem } from "@/lib/question-bank";
import { PRIORITIZATION_WORKSHOP_MODULE } from "@/lib/edtech/review-modules/content/nclex-strategy-modules";
import { REVIEW_MODULE_SECTION_ORDER } from "@/lib/edtech/review-modules/types";
import { NCLEX_STRATEGY_QUESTION_SEEDS } from "@/lib/edtech/seeds/nclex-strategy-questions";

describe("NCLEX study presets", () => {
  it("defines first-attempt preset blocks", () => {
    expect(NCLEX_STUDY_PRESETS.length).toBeGreaterThanOrEqual(10);
    expect(getNclexStudyPreset("prioritization-workshop")).toBeDefined();
  });

  it("builds practice href with nclexPreset param", () => {
    const preset = getNclexStudyPreset("sata-mastery")!;
    const href = nclexPresetPracticeHref("nclex", preset);
    expect(href).toContain("nclexPreset=sata-mastery");
    expect(href).toContain("count=15");
    expect(href).toContain("autostart=1");
    expect(href).toContain("subjectId=__mixed__");
  });

  it("silent weak-area uses adaptive spaced review", () => {
    const preset = getNclexStudyPreset("silent-weak-area")!;
    const href = nclexPresetPracticeHref("nclex", preset);
    expect(href).toContain("style=adaptive");
    expect(href).toContain("autostart=1");
  });
});

describe("NCLEX session preset filters", () => {
  it("matches prioritization workshop items", () => {
    const item: BankItem = {
      subjectId: "management-of-care",
      tags: ["prioritization", "assignment"],
      question: "Which client should the nurse see first?",
      vignette: "Room 518 post-op morphine RR 8. Room 523 heart failure.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Priority ABC",
    };
    const preset = getNclexStudyPreset("prioritization-workshop")!;
    expect(matchesNclexStudyPreset(item, preset)).toBe(true);
  });

  it("matches sata-style strategy seed in sata-mastery preset", () => {
    const seed = NCLEX_STRATEGY_QUESTION_SEEDS.find((s) => s.tags?.includes("sata-style"));
    expect(seed).toBeDefined();
    const preset = getNclexStudyPreset("sata-mastery")!;
    expect(matchesNclexStudyPreset(seed!, preset)).toBe(true);
  });
});

describe("NCLEX strategy modules", () => {
  it("prioritization module has eight sections", () => {
    expect(PRIORITIZATION_WORKSHOP_MODULE.sections.map((s) => s.id)).toEqual(
      REVIEW_MODULE_SECTION_ORDER
    );
  });
});

describe("NCLEX strategy question seeds", () => {
  it("seeds have answers in options", () => {
    for (const item of NCLEX_STRATEGY_QUESTION_SEEDS) {
      expect(item.correctAnswer?.trim()).toBeTruthy();
      if (item.itemType !== "select_all") {
        expect(item.options).toContain(item.correctAnswer);
      }
    }
  });
});
