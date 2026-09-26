import { describe, expect, it } from "vitest";
import {
  ACTIVE_QUESTION_DEFINITION,
  aggregateActiveInventory,
  classifyQuestionFormat,
  fieldInventoryPayload,
  formatInventoryFormatLine,
  presentBoardInventory,
  type ActiveInventoryRow,
} from "./active-questions";
import { snapshotFromActiveInventory } from "@/lib/marketing/question-bank-counts";

function row(partial: Partial<ActiveInventoryRow> & Pick<ActiveInventoryRow, "fieldId" | "count">): ActiveInventoryRow {
  return {
    subjectId: "management-of-care",
    clientNeeds: null,
    itemType: "mcq",
    hasCaseGroup: false,
    ...partial,
  };
}

describe("active question inventory", () => {
  it("partitions each question into one format", () => {
    expect(classifyQuestionFormat("vignette")).toBe("mcq");
    expect(classifyQuestionFormat("select_all")).toBe("ngn");
    expect(classifyQuestionFormat("ngn_bowtie")).toBe("ngn");
    expect(classifyQuestionFormat("case_study")).toBe("case");
    expect(classifyQuestionFormat("ccs_prompt")).toBe("case");
    expect(classifyQuestionFormat("select_all", true)).toBe("case");
  });

  it("sums topics and formats to the same active total", () => {
    const inventory = aggregateActiveInventory([
      row({ fieldId: "nursing", subjectId: "management-of-care", itemType: "mcq", count: 100 }),
      row({ fieldId: "nursing", subjectId: "safety-infection", itemType: "select_all", count: 40 }),
      row({
        fieldId: "nursing",
        subjectId: "med-surg",
        clientNeeds: "physiological-adaptation",
        itemType: "vignette",
        hasCaseGroup: true,
        count: 12,
      }),
      row({ fieldId: "nursing", subjectId: "fundamentals", itemType: "mcq", count: 8 }),
      row({ fieldId: "dentistry", subjectId: "other", count: 99 }),
    ]);

    const nursing = inventory.fields.nursing!;
    expect(nursing.active).toBe(160);
    expect(nursing.formats).toEqual({ mcq: 108, ngn: 40, case: 12 });
    expect(nursing.topics.reduce((sum, topic) => sum + topic.count, 0)).toBe(160);
    expect(nursing.categoryLabel).toBe("Client Needs");
    expect(nursing.categories.map((category) => category.id)).toEqual([
      "management-of-care",
      "safety-infection",
      "physiological-adaptation",
    ]);
    expect(nursing.categories.find((category) => category.id === "physiological-adaptation")?.count).toBe(12);
    expect(inventory.boards.nclex.active).toBe(160);
    expect(inventory.boards.nclex.topicCount).toBe(4);
    expect(inventory.boards.nclex.scopeNote).toBeNull();
    expect(inventory.definition).toBe(ACTIVE_QUESTION_DEFINITION);
    expect(inventory.fields.pharmacy?.active).toBe(0);
  });

  it("rolls USMLE steps into the board total and keeps each step separate", () => {
    const inventory = aggregateActiveInventory([
      row({ fieldId: "usmle-step-1", subjectId: "biochem", itemType: "mcq", count: 10 }),
      row({ fieldId: "usmle-step-2", subjectId: "cardiology", itemType: "vignette", count: 20 }),
      row({ fieldId: "usmle-step-3", subjectId: "ccs", itemType: "ccs_prompt", count: 5 }),
    ]);

    expect(inventory.fields["usmle-step-2"]?.active).toBe(20);
    expect(inventory.boards.usmle.active).toBe(35);
    expect(inventory.boards.usmle.formats.case).toBe(5);
    expect(inventory.boards.usmle.scopeNote).toMatch(/Step 2 CK/);

    const snapshot = snapshotFromActiveInventory(inventory);
    expect(snapshot.fields.nursing?.served).toBe(0);
    expect(snapshot.fields["usmle-step-2"]?.served).toBe(35);
    expect(snapshot.degraded).toBe(false);
  });

  it("feeds the Qbank topic map from the same field total", () => {
    const inventory = aggregateActiveInventory([
      row({ fieldId: "nursing", subjectId: "management-of-care", count: 70 }),
      row({ fieldId: "nursing", subjectId: "safety-infection", itemType: "select_all", count: 30 }),
    ]);
    const payload = fieldInventoryPayload("nursing", inventory);
    expect(payload?.total).toBe(inventory.boards.nclex.active);
    expect(payload?.counts).toEqual({
      "management-of-care": 70,
      "safety-infection": 30,
    });
    expect(payload?.formats).toEqual({ mcq: 70, ngn: 30, case: 0 });
    expect(payload?.topicFormats).toEqual({
      "management-of-care": { mcq: 70, ngn: 0, case: 0 },
      "safety-infection": { mcq: 0, ngn: 30, case: 0 },
    });
  });

  it("hides the format line until NGN or case items exist", () => {
    expect(formatInventoryFormatLine({ mcq: 10, ngn: 0, case: 0 })).toBeNull();
    expect(formatInventoryFormatLine({ mcq: 10, ngn: 2, case: 1 }, "NGN")).toBe(
      "10 MCQ · 2 NGN · 1 case"
    );
  });

  it("does not describe a published floor as the live active bank", () => {
    const live = presentBoardInventory({
      slug: "nclex",
      usingLiveCount: true,
      board: aggregateActiveInventory([
        row({ fieldId: "nursing", count: 7581, itemType: "mcq" }),
      ]).boards.nclex,
    });
    expect(live.countSource).toBe("active-inventory");
    expect(live.activeCount).toBe(7581);
    expect(live.definition).toMatch(/published and not retired/i);

    const floor = presentBoardInventory({
      slug: "nclex",
      usingLiveCount: false,
      board: null,
    });
    expect(floor.countSource).toBe("published-floor");
    expect(floor.activeCount).toBeNull();
    expect(floor.definition).toMatch(/published floor/i);
    expect(floor.formatLine).toBeNull();
  });
});
