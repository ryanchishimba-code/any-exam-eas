import { describe, expect, it } from "vitest";
import { NAPLEX_CALC_MCQ_ALL } from "./naplex-calc-mcq-all";
import { NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10 } from "./naplex-calc-mcq-board-vignettes-10";
import { NAPLEX_CALC_MCQ_COMPOUNDING } from "./naplex-calc-mcq-compounding";
import { NAPLEX_CALC_MCQ_ONCOLOGY } from "./naplex-calc-mcq-oncology";
import { NAPLEX_CALC_MCQ_OPEN_SOURCE_40 } from "./naplex-calc-mcq-open-source-40";
import { NAPLEX_CALC_MCQ_TPN } from "./naplex-calc-mcq-tpn";
import { isNaplexBestQuality } from "./naplex-quality-gate";
import { prepareNaplexBankItem } from "./naplex-serve-gate";

function assertBatch(name: string, items: typeof NAPLEX_CALC_MCQ_ALL) {
  it(`${name}: unique items with solution steps`, () => {
    expect(items.length).toBeGreaterThan(0);
    const keys = new Set(items.map((i) => `${i.vignette}|${i.question}|${i.correctAnswer}`));
    expect(keys.size).toBe(items.length);
    for (const item of items) {
      expect(item.solutionSteps?.length).toBeGreaterThan(0);
    }
  });

  it(`${name}: passes best-tier QA gate`, () => {
    const passing = items.filter((item) =>
      isNaplexBestQuality(prepareNaplexBankItem(item), { source: "seed" })
    );
    expect(passing.length).toBe(items.length);
  });
}

describe("naplex calc mcq batches", () => {
  assertBatch("open source 40", NAPLEX_CALC_MCQ_OPEN_SOURCE_40);
  assertBatch("TPN", NAPLEX_CALC_MCQ_TPN);
  assertBatch("oncology", NAPLEX_CALC_MCQ_ONCOLOGY);
  assertBatch("compounding", NAPLEX_CALC_MCQ_COMPOUNDING);
  assertBatch("board vignettes 10", NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10);

  it("combined batch has 95 items", () => {
    expect(NAPLEX_CALC_MCQ_ALL).toHaveLength(95);
  });

  it("uses corrected answers for known key fixes", () => {
    const amox = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.find((i) =>
      i.vignette?.includes("amoxicillin 500 mg")
    );
    expect(amox?.correctAnswer).toBe("300 mL");

    const lipids = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.find((i) =>
      i.vignette?.includes("TPN lipids 20%")
    );
    expect(lipids?.correctAnswer).toBe("1,200 kcal");

    const oneThousand = NAPLEX_CALC_MCQ_OPEN_SOURCE_40.find((i) =>
      i.vignette?.includes("1:1000")
    );
    expect(oneThousand?.correctAnswer).toBe("150 mL");
  });
});
