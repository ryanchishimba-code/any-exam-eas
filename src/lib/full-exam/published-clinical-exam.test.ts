import { describe, expect, it } from "vitest";
import type { NgnItem } from "@/lib/assessment/types";
import type { PublishedCatalog } from "@/lib/assessment/serve";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";
import {
  decodeClinicalResponse,
  encodeClinicalResponse,
  publishedCatalogToExamItems,
  reservePublishedClinicalItems,
} from "@/lib/full-exam/published-clinical-exam";

function sata(id: string, caseId: string | null, step: number | null): NgnItem {
  return {
    id,
    version: 1,
    itemType: caseId ? "case_item" : "bowtie",
    caseId,
    caseStep: step,
    cjmmFunction: [],
    timepoint: null,
    responseFormat: "mr_sata",
    scoringRule: "plus_minus",
    maxPoints: 2,
    stem: `Select the findings for ${id}.`,
    payload: { keys: ["a", "b"], options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }] },
    rationale: {
      short: "Both A and B are present, so both are required.",
      expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "Select every finding that is present." },
    },
    clientNeeds: { category: "Physiological Adaptation" },
    references: [],
    rnFlags: [],
  };
}

describe("published clinical exam items", () => {
  it("keeps a case together and then fills with standalones", () => {
    const catalog = {
      cases: [
        {
          kind: "case" as const,
          subjectId: "physiological-adaptation",
          items: [sata("c1", "C1", 1), sata("c2", "C1", 2)],
          caseDoc: {
            id: "C1",
            version: 1,
            batchId: "b",
            title: "Case",
            boardProfile: "nclex-rn-2026",
            status: "published",
            primaryClientNeed: "Physiological Adaptation",
            setting: "Ward",
            patient: { displayName: "Alex", age: 40, sex: "female", weightKg: 70, allergies: "None" },
            timepoints: [],
            chart: { tabs: [] },
            revealRule: "current",
            references: [],
            items: [],
          },
        },
      ],
      standalones: [
        { kind: "standalone" as const, subjectId: null, item: sata("s1", null, null) },
        { kind: "standalone" as const, subjectId: null, item: sata("s2", null, null) },
      ],
    } as PublishedCatalog;

    const items = publishedCatalogToExamItems(catalog);
    const reserved = reservePublishedClinicalItems({ items, target: 3, seed: 1 });
    expect(reserved.map((item) => item.id).slice(0, 2)).toEqual(["ngn:c1:v1", "ngn:c2:v1"]);
    expect(reserved).toHaveLength(3);
    expect(reserved[2]?.id).toMatch(/^ngn:s[12]:v1$/);
  });

  it("scores a published item only when every keyed choice is selected", () => {
    const item = sata("s1", null, null);
    const [bank] = publishedCatalogToExamItems({
      cases: [],
      standalones: [{ kind: "standalone", subjectId: null, item }],
    });
    const question = {
      id: "1",
      sourceIndex: 0,
      type: "unfolding_case",
      stem: item.stem,
      options: [],
      correctAnswers: [],
      explanation: bank?.explanation ?? "",
      ngnPayload: bank?.ngnPayload,
    } satisfies StudyQuestion;

    expect(isAnswerCorrect(question, [encodeClinicalResponse(["a"])])).toBe(false);
    expect(isAnswerCorrect(question, [encodeClinicalResponse(["a", "b"])])).toBe(true);
    expect(decodeClinicalResponse([encodeClinicalResponse(["a", "b"])])).toEqual(["a", "b"]);
  });
});
