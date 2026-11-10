import { describe, expect, it, vi } from "vitest";
import { weakAreaPracticeHref } from "@/lib/learning/weak-area-practice-href";

type Row = {
  id: string;
  fieldId: string;
  subjectId: string;
  blueprintTopic: string | null;
  active: boolean;
  qaPassed: boolean;
  stepLevel: string | null;
};

const { DATA, matchWhere } = vi.hoisted(() => {
  const DATA: Row[] = [
    {
      id: "lr-1",
      fieldId: "usmle-step-3",
      subjectId: "internal-medicine",
      blueprintTopic: "sensitivity-specificity-lr",
      active: true,
      qaPassed: true,
      stepLevel: "step3",
    },
    {
      id: "ccs-1",
      fieldId: "usmle-step-3",
      subjectId: "obgyn",
      blueprintTopic: "ob-labor-ccs",
      active: true,
      qaPassed: true,
      stepLevel: "step3",
    },
    {
      id: "wrong-subject",
      fieldId: "usmle-step-3",
      subjectId: "sensitivity-specificity-lr",
      blueprintTopic: "something-else",
      active: true,
      qaPassed: true,
      stepLevel: "step3",
    },
    {
      id: "inactive",
      fieldId: "usmle-step-3",
      subjectId: "internal-medicine",
      blueprintTopic: "sensitivity-specificity-lr",
      active: false,
      qaPassed: true,
      stepLevel: "step3",
    },
  ];

  function matchWhere(row: Record<string, unknown>, where: Record<string, unknown>): boolean {
    return Object.entries(where).every(([key, cond]) => {
      if (key === "AND") return (cond as Record<string, unknown>[]).every((part) => matchWhere(row, part));
      if (key === "OR") return (cond as Record<string, unknown>[]).some((part) => matchWhere(row, part));
      if (cond && typeof cond === "object" && "in" in cond) {
        return (cond as { in: unknown[] }).in.includes(row[key]);
      }
      if (cond && typeof cond === "object" && "notIn" in cond) {
        return !(cond as { notIn: unknown[] }).notIn.includes(row[key]);
      }
      return row[key] === cond;
    });
  }

  return { DATA, matchWhere };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      count: vi.fn(async ({ where }: { where: Record<string, unknown> }) =>
        DATA.filter((row) => matchWhere(row as unknown as Record<string, unknown>, where)).length
      ),
    },
  },
}));

vi.mock("@/lib/exam-prep/student-eligibility", () => ({
  ineligibleServedIds: async () => [],
  retainStudentEligibleBankItems: (items: unknown[]) => items,
  warmCompleteCaseGroups: async () => undefined,
}));

import { countActiveQuestionBankItemsByBlueprintTopics } from "@/lib/question-bank-db";

function linkParams(topic: string) {
  const href = weakAreaPracticeHref({
    examSlug: "usmle",
    topicKey: `subject:${topic}`,
    fieldId: "usmle-step-3",
    count: 5,
  });
  const url = new URL(href!, "https://anyexameasy.local");
  return {
    href,
    fieldId: url.searchParams.get("field")!,
    subjectId: url.searchParams.get("subjectId"),
    blueprintTopics: url.searchParams.get("blueprintTopics")!.split(","),
  };
}

describe("weak-area link serve path", () => {
  it("counts blueprint-tagged items and does not require subjectId to equal the topic", async () => {
    const lr = linkParams("sensitivity-specificity-lr");
    const ccs = linkParams("ob-labor-ccs");
    expect(lr.subjectId).toBe("sensitivity-specificity-lr");
    expect(lr.blueprintTopics).toEqual(["sensitivity-specificity-lr"]);

    const lrCount = await countActiveQuestionBankItemsByBlueprintTopics({
      fieldId: lr.fieldId,
      blueprintTopics: lr.blueprintTopics,
    });
    const ccsCount = await countActiveQuestionBankItemsByBlueprintTopics({
      fieldId: ccs.fieldId,
      blueprintTopics: ccs.blueprintTopics,
    });

    expect(lrCount).toBe(1);
    expect(ccsCount).toBe(1);
    expect(lrCount).toBeGreaterThanOrEqual(1);
    expect(ccsCount).toBeGreaterThanOrEqual(1);
  });
});
