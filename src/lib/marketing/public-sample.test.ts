import { describe, expect, it } from "vitest";
import { pickPublicSamples, readStoredCitations, toPublicSampleQuestion } from "@/lib/marketing/public-sample";

describe("readStoredCitations", () => {
  it("reads label and citation objects without inventing a source", () => {
    expect(
      readStoredCitations([
        { label: "NCSBN NCLEX-RN Test Plan / CJMM" },
        { label: "Open RN", citation: "Fluid balance" },
        { label: "" },
      ])
    ).toEqual(["NCSBN NCLEX-RN Test Plan / CJMM", "Open RN — Fluid balance"]);
  });
});

describe("toPublicSampleQuestion", () => {
  const row = {
    id: "item-1",
    fieldId: "nursing",
    question: "A nurse sees a client with a fever and a low neutrophil count. Which action is the priority?",
    options: JSON.stringify([
      "Obtain cultures and call the provider",
      "Apply a warm compress",
      "Encourage rest",
      "Reassess in four hours",
    ]),
    correctAnswer: "Obtain cultures and call the provider",
    explanation: "Febrile neutropenia is an emergency. Cultures and empiric treatment cannot wait.",
    references: [{ label: "NCSBN NCLEX-RN Test Plan" }],
  };

  it("keeps a clean single-best-answer item", () => {
    const sample = toPublicSampleQuestion(row);
    expect(sample?.examLabel).toBe("NCLEX");
    expect(sample?.correct).toBe("Obtain cultures and call the provider");
    expect(sample?.sources).toEqual(["NCSBN NCLEX-RN Test Plan"]);
  });

  it("drops an item with no stored source", () => {
    expect(toPublicSampleQuestion({ ...row, references: [] })).toBeNull();
  });

  it("drops a multi-select key", () => {
    expect(toPublicSampleQuestion({ ...row, correctAnswer: "A|||B" })).toBeNull();
  });
});

describe("pickPublicSamples", () => {
  it("keeps at most one item per board, in board order", () => {
    const make = (fieldId: string, id: string) => ({
      id,
      fieldId,
      question: "A stable stem long enough to qualify as a real practice item for this board sample.",
      options: JSON.stringify(["Alpha", "Beta", "Gamma", "Delta"]),
      correctAnswer: "Alpha",
      explanation: "Alpha is the keyed answer because the vignette supports it over the other choices.",
      references: [{ label: "Official outline" }],
    });
    const picked = pickPublicSamples([
      make("pance", "p1"),
      make("nursing", "n1"),
      make("nursing", "n2"),
      make("pharmacy", "ph1"),
    ]);
    expect(picked.map((item) => item.id)).toEqual(["n1", "ph1", "p1"]);
  });
});

