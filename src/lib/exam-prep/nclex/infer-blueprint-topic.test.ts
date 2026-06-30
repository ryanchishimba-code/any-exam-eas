import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  inferNclexBlueprint,
  isBroadNclexBlueprintTopic,
  pickBestClinicalTag,
  topicFromVignettePhrase,
} from "./infer-blueprint-topic";

function nclexItem(partial: Partial<BankItem>): BankItem {
  return {
    subjectId: "management-of-care",
    question: "Which action should the nurse take first?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Clinical rationale with enough detail for board review.",
    ...partial,
  };
}

describe("pickBestClinicalTag", () => {
  it("prefers specific clinical tags over skill tags", () => {
    expect(
      pickBestClinicalTag([
        "delegation",
        "high-yield",
        "cjmm-polished",
        "postoperative care",
        "management-of-care",
      ])
    ).toBe("postoperative care");
  });

  it("prefers c diff over infection control skill tag", () => {
    expect(
      pickBestClinicalTag(["infection control", "Clostridioides difficile", "contact precautions"])
    ).toBe("clostridioides difficile");
  });
});

describe("inferNclexBlueprint", () => {
  it("keeps specific existing blueprintTopic", () => {
    const result = inferNclexBlueprint(
      nclexItem({ blueprintTopic: "postoperative-knee-replacement", tags: ["delegation"] })
    );
    expect(result.source).toBe("existing");
    expect(result.blueprintTopic).toBe("postoperative-knee-replacement");
  });

  it("infers from clinical tag when topic missing", () => {
    const result = inferNclexBlueprint(
      nclexItem({
        tags: ["delegation", "cjmm-polished", "suicide risk", "psychiatric nursing"],
        scenario: "Psych unit. Room 12. Client expresses suicidal ideation with plan.",
      })
    );
    expect(result.source).toBe("clinical-tag");
    expect(result.blueprintTopic).toContain("suicide");
  });

  it("infers c diff from vignette pattern", () => {
    const result = inferNclexBlueprint(
      nclexItem({
        tags: ["delegation", "high-yield"],
        scenario:
          "Skilled nursing facility, Room 427. 80-year-old woman admitted with Clostridioides difficile infection.",
      })
    );
    expect(result.blueprintTopic).toContain("c-difficile-infection");
    expect(result.blueprintDomain).toBe("management-of-care");
  });

  it("replaces broad existing topic with vignette-specific topic", () => {
    const result = inferNclexBlueprint(
      nclexItem({
        blueprintTopic: "prioritization",
        tags: ["prioritization", "cjmm-polished"],
        scenario:
          "Pediatric medical unit. Room 307. 9-year-old boy with asthma with improving exacerbation.",
      })
    );
    expect(result.source).not.toBe("existing");
    expect(result.blueprintTopic).toContain("asthma");
  });
});

describe("isBroadNclexBlueprintTopic", () => {
  it("flags skill slugs as broad", () => {
    expect(isBroadNclexBlueprintTopic("delegation")).toBe(true);
    expect(isBroadNclexBlueprintTopic("prioritization")).toBe(true);
  });

  it("accepts clinical slugs", () => {
    expect(isBroadNclexBlueprintTopic("c-difficile-infection")).toBe(false);
    expect(isBroadNclexBlueprintTopic("postoperative-knee-replacement")).toBe(false);
  });
});

describe("topicFromVignettePhrase", () => {
  it("extracts admission diagnosis phrase", () => {
    const topic = topicFromVignettePhrase(
      nclexItem({
        scenario:
          "Medical-surgical unit. Room 515. 58-year-old man admitted with pneumonia. Respiratory rate 30.",
      })
    );
    expect(topic).toContain("pneumonia");
  });
});
