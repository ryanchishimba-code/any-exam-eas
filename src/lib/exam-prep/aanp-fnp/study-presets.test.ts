import { describe, expect, it } from "vitest";
import {
  AANP_FNP_STUDY_PRESETS,
  aanpFnpPresetPracticeHref,
  getAanpFnpStudyPreset,
} from "./study-presets";
import {
  filterItemsForAanpFnpPreset,
  itemMatchesAanpFnpPreset,
} from "./session-preset-filters";
import type { BankItem } from "@/lib/question-bank";

describe("AANP FNP study presets", () => {
  it("exposes domain, lifespan, pharm, preventive, SATA, and mock presets", () => {
    expect(AANP_FNP_STUDY_PRESETS.length).toBeGreaterThanOrEqual(10);
    expect(getAanpFnpStudyPreset("assess-domain-block")).toBeDefined();
    expect(getAanpFnpStudyPreset("sata-mastery")?.itemTypes).toContain("select_all");
    expect(getAanpFnpStudyPreset("timed-full-mock")?.count).toBe(150);
  });

  it("builds practice href with aanpFnpPreset param", () => {
    const preset = getAanpFnpStudyPreset("plan-domain-block")!;
    const href = aanpFnpPresetPracticeHref("aanp-fnp", preset);
    expect(href).toContain("aanpFnpPreset=plan-domain-block");
    expect(href).toContain("count=25");
    expect(href).toContain("field=aanp-fnp");
  });

  it("routes timed full mock to full exam launcher", () => {
    const preset = getAanpFnpStudyPreset("timed-full-mock")!;
    const href = aanpFnpPresetPracticeHref("aanp-fnp", preset);
    expect(href).toMatch(/full-exam|exam-session|timed/i);
  });
});

describe("filterItemsForAanpFnpPreset", () => {
  const assessItem = {
    subjectId: "cardiovascular",
    vignette: "A 55-year-old presents for annual exam.",
    question: "Which assessment finding is most important?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "x",
    blueprintDomain: "assess",
    patientAgeGroup: "middle-adult",
    itemType: "vignette",
  } as BankItem;

  const sataItem = {
    ...assessItem,
    blueprintDomain: "plan",
    itemType: "select_all",
    options: ["A", "B", "C", "D", "E"],
    correctAnswer: "A|||C",
    question: "Select all that apply. Which counseling points are appropriate?",
  } as BankItem;

  const pedsItem = {
    ...assessItem,
    subjectId: "pediatrics",
    patientAgeGroup: "toddler",
    blueprintDomain: "assess",
    vignette: "A 2-year-old toddler presents for a well-child visit.",
    question: "Which immunization is indicated?",
  } as BankItem;

  it("filters by blueprint domain", () => {
    const preset = getAanpFnpStudyPreset("assess-domain-block")!;
    expect(itemMatchesAanpFnpPreset(assessItem, preset)).toBe(true);
    expect(itemMatchesAanpFnpPreset(sataItem, preset)).toBe(false);
  });

  it("filters select_all mastery", () => {
    const preset = getAanpFnpStudyPreset("sata-mastery")!;
    const filtered = filterItemsForAanpFnpPreset([assessItem, sataItem], preset, {
      strict: true,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.itemType).toBe("select_all");
  });

  it("filters pediatrics lifespan", () => {
    const preset = getAanpFnpStudyPreset("pediatrics-lifespan")!;
    expect(itemMatchesAanpFnpPreset(pedsItem, preset)).toBe(true);
    expect(itemMatchesAanpFnpPreset(assessItem, preset)).toBe(false);
  });
});
