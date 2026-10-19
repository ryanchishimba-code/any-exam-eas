import { describe, expect, it } from "vitest";
import { ngnFeatureLineFromFormatCards, nclexFeatureCards } from "./board-features";
import { boardQuestionUnits } from "@/lib/counts";
import { openBoardQuickBite } from "./model";

describe("board feature cards", () => {
  it("lists only live NGN type names in the feature line", () => {
    const line = ngnFeatureLineFromFormatCards([
      { id: "case", title: "Case studies", detail: "" },
      { id: "sata", title: "Select all that apply", detail: "" },
    ]);
    expect(line).toBe("Case studies and select all that apply in the live bank.");
  });

  it("builds NCLEX features from presets that exist in the product", () => {
    const quickBite = openBoardQuickBite("nursing");
    const features = nclexFeatureCards({
      units: boardQuestionUnits({
        slug: "nclex",
        bankItems: 100,
        formats: { mcq: 80, ngn: 20, case: 0 },
        clinical: { standaloneNgn: 0, caseStudies: 1, caseItems: 6 },
      }),
      bankTypes: { select_all: 12 },
      quickBite,
    });
    expect(features.some((card) => card.id === "ngn")).toBe(true);
    expect(features.some((card) => card.id === "quick-bites")).toBe(Boolean(quickBite));
    expect(features.find((card) => card.id === "adaptive")?.line).toMatch(/CAT/i);
  });
});
