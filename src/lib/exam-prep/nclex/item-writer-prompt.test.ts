import { describe, expect, it } from "vitest";
import {
  buildNclexBoardQualityBlock,
  buildNclexCurationSystemPrompt,
  NCLEX_CALIBRATION_EXAMPLES,
} from "./item-writer-prompt";
import { buildNclexTopicMixBlock, NCLEX_BOARD_QUALITY_PRINCIPLES } from "./quality-spec";

describe("NCLEX item-writer prompt", () => {
  it("documents board-quality principles", () => {
    expect(NCLEX_BOARD_QUALITY_PRINCIPLES.clinicalJudgment).toMatch(/prioritization/i);
    expect(NCLEX_BOARD_QUALITY_PRINCIPLES.distractors).toMatch(/wrong priority/i);
  });

  it("includes ten calibration examples", () => {
    expect(NCLEX_CALIBRATION_EXAMPLES).toMatch(/EXAMPLE Q1/);
    expect(NCLEX_CALIBRATION_EXAMPLES).toMatch(/EXAMPLE Q10/);
  });

  it("builds generation block with topic mix", () => {
    const block = buildNclexBoardQualityBlock();
    expect(block).toMatch(/Prioritization/);
    expect(block).toMatch(/CALIBRATION EXAMPLES/);
    expect(buildNclexTopicMixBlock()).toMatch(/80-question/);
  });

  it("builds curation system prompt with JSON schema", () => {
    const prompt = buildNclexCurationSystemPrompt();
    expect(prompt).toMatch(/distractorRationale/);
    expect(prompt).toMatch(/UWorld/);
  });
});
