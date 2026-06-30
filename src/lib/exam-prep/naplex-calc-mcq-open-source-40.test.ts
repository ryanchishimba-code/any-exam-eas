import { describe, expect, it } from "vitest";
import { NAPLEX_CALC_MCQ_OPEN_SOURCE_40 } from "./naplex-calc-mcq-open-source-40";
import { isNaplexBestQuality } from "./naplex-quality-gate";
import { prepareNaplexBankItem } from "./naplex-serve-gate";

describe("naplex calc mcq open source 40", () => {
  it("exports 40 unique verified items with solution steps", () => {
    expect(NAPLEX_CALC_MCQ_OPEN_SOURCE_40).toHaveLength(40);
    const keys = new Set(
      NAPLEX_CALC_MCQ_OPEN_SOURCE_40.map((i) => `${i.vignette}|${i.question}|${i.correctAnswer}`)
    );
    expect(keys.size).toBe(40);
    for (const item of NAPLEX_CALC_MCQ_OPEN_SOURCE_40) {
      expect(item.solutionSteps?.length).toBeGreaterThan(0);
    }
  });

  it("passes best-tier QA gate for all items", () => {
    const passing = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.filter((item) =>
      isNaplexBestQuality(prepareNaplexBankItem(item), { source: "seed" })
    );
    expect(passing.length).toBe(40);
  });

  it("uses corrected answers for known key fixes", () => {
    const amox = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.find((i) =>
      i.question.includes("amoxicillin") || i.vignette?.includes("amoxicillin 500 mg")
    );
    expect(amox?.correctAnswer).toBe("300 mL");

    const lipids = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.find((i) => i.vignette?.includes("TPN lipids"));
    expect(lipids?.correctAnswer).toBe("1,200 kcal");

    const oneThousand = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.find((i) =>
      i.vignette?.includes("1:1000")
    );
    expect(oneThousand?.correctAnswer).toBe("150 mL");
  });
});
