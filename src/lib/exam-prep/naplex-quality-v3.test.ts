import { describe, expect, it } from "vitest";
import { NAPLEX_AREA3_V3 } from "./naplex-area3-v3";
import { NAPLEX_CALC_CASES_V3 } from "./naplex-calc-cases-v3";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { bankItemToNaplexExam } from "./naplex-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";

const A3 = "naplex-area3-treatment-planning";

describe("NAPLEX v3 expansions", () => {
  it("adds 20 calculation-heavy case vignettes", () => {
    expect(NAPLEX_CALC_CASES_V3).toHaveLength(20);
    expect(NAPLEX_CALC_CASES_V3.every((q) => q.vignette && q.vignette.length > 20)).toBe(
      true
    );
    expect(
      NAPLEX_CALC_CASES_V3.every((q) => q.itemType === "constructed_response")
    ).toBe(true);
    expect(NAPLEX_CALC_CASES_V3.every((q) => q.tags?.includes("case-calculation"))).toBe(
      true
    );
  });

  it("adds 15 Area 3 treatment-planning items", () => {
    expect(NAPLEX_AREA3_V3).toHaveLength(15);
    expect(NAPLEX_AREA3_V3.every((q) => q.blueprintDomain === A3)).toBe(true);
  });

  it("full pharmacy v2+v3 bank reaches 85 items", () => {
    const total =
      NAPLEX_QUALITY_V2.length + NAPLEX_CALC_CASES_V3.length + NAPLEX_AREA3_V3.length;
    expect(total).toBe(85); // 50 v2 + 20 calc + 15 area3
    const a3 =
      NAPLEX_QUALITY_V2.filter((q) => q.blueprintDomain === A3).length +
      NAPLEX_CALC_CASES_V3.filter((q) => q.blueprintDomain === A3).length +
      NAPLEX_AREA3_V3.length;
    expect(a3).toBeGreaterThanOrEqual(35);
  });

  it("grades calc cases numerically through study pipeline", () => {
    const item = NAPLEX_CALC_CASES_V3[3];
    const study = examQuestionToStudy(
      { ...bankItemToNaplexExam(item, 0), field: "pharmacy" },
      0
    );
    expect(study.type).toBe("short_answer");
    expect(isAnswerCorrect(study, ["8.0 units"])).toBe(true);
  });
});
