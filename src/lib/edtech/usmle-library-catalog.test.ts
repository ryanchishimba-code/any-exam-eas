import { describe, expect, it } from "vitest";
import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { getMemoryCardsForExam } from "@/lib/library/seeds";
import {
  filterHighYieldTopicsForUsmleStep,
  filterMemoryCardsForUsmleStep,
  getUsmleBoardCoverage,
  resolveUsmleLibraryStep,
  usmleStepsForTopicSlug,
} from "./usmle-library-catalog";

describe("usmle-library-catalog", () => {
  it("maps topic slugs to the correct USMLE steps", () => {
    expect(usmleStepsForTopicSlug("pathology-neoplasia")).toEqual(["step1"]);
    expect(usmleStepsForTopicSlug("biostatistics-epidemiology")).toEqual(["step3"]);
    expect(usmleStepsForTopicSlug("cardiovascular")).toEqual(["step2", "step3"]);
  });

  it("resolves library step from field id", () => {
    expect(resolveUsmleLibraryStep("usmle-step-1")).toBe("step1");
    expect(resolveUsmleLibraryStep("usmle-step-2")).toBe("step2");
    expect(resolveUsmleLibraryStep("usmle-step-3")).toBe("step3");
    expect(resolveUsmleLibraryStep(undefined)).toBe("step2");
  });

  it("filters topics and cards by step", () => {
    const topics = getHighYieldTopics("usmle");
    const cards = getMemoryCardsForExam("usmle");

    const step1Topics = filterHighYieldTopicsForUsmleStep(topics, "step1");
    const step3Topics = filterHighYieldTopicsForUsmleStep(topics, "step3");
    const step1Cards = filterMemoryCardsForUsmleStep(cards, "step1");

    expect(step1Topics.some((t) => t.slug === "pathology-neoplasia")).toBe(true);
    expect(step1Topics.some((t) => t.slug === "cardiovascular")).toBe(false);
    expect(step3Topics.some((t) => t.slug === "biostatistics-epidemiology")).toBe(true);
    expect(step3Topics.some((t) => t.slug === "pathology-neoplasia")).toBe(false);

    expect(step1Cards.every((c) => c.usmleSteps?.includes("step1"))).toBe(true);
    expect(step1Cards.some((c) => c.id === "usmle-s1-granuloma-types")).toBe(true);
  });

  it("reports board coverage for each step blueprint category", () => {
    const topics = getHighYieldTopics("usmle");
    const cards = getMemoryCardsForExam("usmle");

    for (const fieldId of ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const) {
      const step = resolveUsmleLibraryStep(fieldId);
      const filteredTopics = filterHighYieldTopicsForUsmleStep(topics, step);
      const filteredCards = filterMemoryCardsForUsmleStep(cards, step);
      const coverage = getUsmleBoardCoverage(fieldId, filteredTopics, filteredCards);

      expect(coverage.length).toBeGreaterThan(0);
      expect(coverage.every((row) => row.libraryTopicSlugs.length > 0)).toBe(true);
      expect(
        coverage.filter((row) => row.hasDeepDive || row.hasMemoryCards).length
      ).toBeGreaterThanOrEqual(Math.ceil(coverage.length * 0.75));
    }
  });

  it("includes step-specific card counts for all three steps", () => {
    const cards = getMemoryCardsForExam("usmle");
    const step1 = filterMemoryCardsForUsmleStep(cards, "step1");
    const step2 = filterMemoryCardsForUsmleStep(cards, "step2");
    const step3 = filterMemoryCardsForUsmleStep(cards, "step3");

    expect(step1.length).toBeGreaterThanOrEqual(12);
    expect(step2.length).toBeGreaterThanOrEqual(40);
    expect(step3.length).toBeGreaterThanOrEqual(45);
  });
});
