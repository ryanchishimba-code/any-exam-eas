import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  filterItemsForNclexBlueprintTopics,
  matchesNclexBlueprintTopic,
} from "./topic-blueprint-match";

function item(partial: Partial<BankItem>): BankItem {
  return {
    subjectId: "physiological-adaptation",
    question: "Which action is the priority?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    ...partial,
  };
}

describe("NCLEX blueprint content match — chemo / heme", () => {
  it("matches neutropenic fever vignettes to chemotherapy-side-effects", () => {
    const q = item({
      subjectId: "reduction-risk",
      vignette:
        "Oncology clinic. ANC 400/mm³ after chemotherapy. Temperature 101.6°F with chills and mucositis.",
    });
    expect(matchesNclexBlueprintTopic(q, "chemotherapy-side-effects")).toBe(true);
  });

  it("rejects prenatal / A1c false positives for hematology-oncology", () => {
    const prenatal = item({
      vignette:
        "A 28-year-old pregnant woman is attending her first prenatal visit at 10 weeks gestation for hemoglobin screening.",
    });
    expect(matchesNclexBlueprintTopic(prenatal, "hematology-oncology")).toBe(false);

    const a1c = item({
      vignette: "Type 2 diabetes follow-up. Hemoglobin A1c is 8.2% on metformin.",
    });
    expect(matchesNclexBlueprintTopic(a1c, "hematology-oncology")).toBe(false);
  });

  it("matches sickle cell crisis and thrombocytopenia to hematology-oncology", () => {
    const sickle = item({
      vignette:
        "Client with sickle cell disease presents with severe vaso-occlusive pain in both legs.",
    });
    const platelets = item({
      vignette: "Platelet count 18,000/µL with gum bleeding; thrombocytopenia precautions needed.",
    });
    expect(matchesNclexBlueprintTopic(sickle, "hematology-oncology")).toBe(true);
    expect(matchesNclexBlueprintTopic(platelets, "hematology-oncology")).toBe(true);
  });

  it("filters a mixed pool to chemo blueprint tags", () => {
    const pool = [
      item({
        blueprintTopic: "chemotherapy-side-effects",
        vignette: "Neutropenic fever after chemotherapy nadir.",
      }),
      item({
        blueprintTopic: "ng-feeding-tube",
        vignette: "Nasogastric tube placement confirmed before enteral feeding.",
      }),
      item({
        blueprintTopic: "pre-post-procedure",
        vignette: "Colonoscopy prep and NPO status.",
      }),
    ];
    const filtered = filterItemsForNclexBlueprintTopics(pool, ["chemotherapy-side-effects"], {
      contentMatch: true,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]!.blueprintTopic).toBe("chemotherapy-side-effects");
  });
});
