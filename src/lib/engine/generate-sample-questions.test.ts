import { describe, expect, it } from "vitest";
import {
  generateSampleQuestions,
  type SampleQuestionResult,
} from "./generate-sample-questions";
import { hasOrphanDeicticStem, isVignetteRich } from "./prompts/vignette";

describe("generateSampleQuestions", () => {
  it("produces 3 board-specific samples that pass vignette validation", () => {
    const samples = generateSampleQuestions();

    expect(samples).toHaveLength(3);

    const boards = samples.map((s) => s.board);
    expect(boards).toContain("NCLEX");
    expect(boards).toContain("USMLE");
    expect(boards).toContain("NAPLEX");

    for (const sample of samples) {
      assertSampleQuality(sample);
    }
  });
});

function assertSampleQuality(sample: SampleQuestionResult) {
  expect(sample.passed).toBe(true);
  expect(sample.validationIssues).toHaveLength(0);
  expect(sample.question.vignette?.trim().length).toBeGreaterThan(60);
  expect(isVignetteRich(sample.question.vignette!)).toBe(true);
  expect(hasOrphanDeicticStem(sample.question)).toBe(false);
  expect(sample.question.question).not.toMatch(/these findings/i);
  expect(sample.question.options).toHaveLength(4);
  expect(sample.question.explanation.length).toBeGreaterThan(100);
  expect(sample.question.references?.length).toBeGreaterThan(0);
}
