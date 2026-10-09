import { describe, expect, it } from "vitest";
import type { PublishedCatalog, ServeItem } from "@/lib/assessment/serve";
import type { NgnItem } from "@/lib/assessment/types";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import { selectWithNgnFormatMix } from "@/lib/full-exam/ngn-format-mix";
import type { BankItem } from "@/lib/question-bank";
import { mergePrefetchedBankItems, publishedCatalogToBankItems } from "./catalog-exam-items";

function item(partial: Partial<NgnItem> & Pick<NgnItem, "id" | "responseFormat" | "stem" | "payload">): ServeItem {
  return {
    version: 1,
    itemType: partial.caseId ? "case_item" : partial.responseFormat === "bowtie" ? "bowtie" : "trend",
    caseId: null,
    caseStep: null,
    cjmmFunction: "take",
    timepoint: null,
    scoringRule: "zero_one",
    maxPoints: 1,
    rationale: {
      short: "The keyed choice matches the chart trend for this clinical judgment item.",
      expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "Use the chart, then the key." },
    },
    clientNeeds: { category: "Physiological Adaptation" },
    references: [],
    rnFlags: [],
    status: "published",
    batchId: "catalog",
    caseVersion: partial.caseId ? 1 : null,
    ...partial,
  };
}

const bowtie = item({
  id: "B01",
  responseFormat: "bowtie",
  stem: "Complete the bow-tie for this client.",
  payload: {
    condition: { keys: ["c1"], options: [{ id: "c1", text: "Hypovolemia" }, { id: "c2", text: "Infection" }] },
    actions: {
      keys: ["a1", "a2"],
      options: [
        { id: "a1", text: "Start normal saline" },
        { id: "a2", text: "Give a fluid bolus" },
        { id: "a3", text: "Restrict fluids" },
      ],
    },
    monitor: {
      keys: ["m1", "m2"],
      options: [
        { id: "m1", text: "Urine output" },
        { id: "m2", text: "Blood pressure" },
        { id: "m3", text: "Bowel sounds" },
      ],
    },
  },
});

describe("publishedCatalogToBankItems", () => {
  it("keeps a matrix row-header label for the exam player", () => {
    const matrix = item({
      id: "M1",
      responseFormat: "matrix_mc",
      stem: "For each task, choose the column.",
      payload: {
        rowHeader: "Task",
        columns: [
          { id: "now", text: "Do now" },
          { id: "later", text: "Do later" },
        ],
        rows: [
          { id: "r1", text: "Give the medication", key: "now" },
          { id: "r2", text: "Call the provider", key: "later" },
        ],
      },
    });
    const plain = item({
      id: "M2",
      responseFormat: "matrix_mc",
      stem: "For each finding, choose the column.",
      payload: {
        columns: [
          { id: "now", text: "Do now" },
          { id: "later", text: "Do later" },
        ],
        rows: [{ id: "r1", text: "Lactate 3.1", key: "now" }],
      },
    });
    const rows = publishedCatalogToBankItems({
      standalones: [
        { kind: "standalone", item: matrix, subjectId: "phys" },
        { kind: "standalone", item: plain, subjectId: "phys" },
      ],
      cases: [],
    });
    expect(rows.map((row) => row.ngnPayload?.rowHeader)).toEqual(["Task", "Finding"]);
  });

  it("keeps a 2-action bow-tie and grades both actions", () => {
    const catalog: PublishedCatalog = { standalones: [{ kind: "standalone", item: bowtie, subjectId: "phys" }], cases: [] };
    const [row] = publishedCatalogToBankItems(catalog);
    expect(row?.id).toBe("ngn:B01:v1");
    expect(row?.itemType).toBe("ngn_bowtie");
    expect(row?.ngnPayload?.actionPickCount).toBe(2);
    expect(row?.ngnPayload?.monitorPickCount).toBe(2);
    const study = examQuestionToStudy(
      {
        id: 1,
        type: "bow_tie",
        ngnFormat: "bow_tie",
        question: row!.question,
        options: row!.options,
        correctAnswer: row!.correctAnswer,
        explanation: row!.explanation,
        ngnPayload: row!.ngnPayload,
        chartData: row!.ngnPayload,
      },
      0
    );
    expect(study.type).toBe("bow_tie");
    expect(
      isAnswerCorrect(study, [
        "Start normal saline",
        "Give a fluid bolus",
        "Urine output",
        "Blood pressure",
        "Hypovolemia",
      ])
    ).toBe(true);
    expect(
      isAnswerCorrect(study, ["Start normal saline", "Give a fluid bolus", "Urine output", "Blood pressure"])
    ).toBe(false);
    expect(isAnswerCorrect(study, ["Start normal saline", "Urine output", "Blood pressure"])).toBe(false);
  });

  it("drops a case when one step cannot be played and keeps a complete case together", () => {
    const step = (id: string, stepIndex: number, format: NgnItem["responseFormat"]): ServeItem =>
      item({
        id,
        caseId: "C07",
        caseStep: stepIndex,
        responseFormat: format,
        stem: `Step ${stepIndex} for this unfolding case. Which finding matters?`,
        payload:
          format === "mc_single"
            ? {
                key: "o1",
                options: [
                  { id: "o1", text: "Notify the provider" },
                  { id: "o2", text: "Document and wait" },
                  { id: "o3", text: "Discharge home" },
                  { id: "o4", text: "Ignore the change" },
                ],
              }
            : { nope: true },
      });
    const playable = [1, 2].map((n) => step(`S${n}`, n, "mc_single"));
    const broken = [step("S1", 1, "mc_single"), step("S2", 2, "highlight_text")];
    const catalog: PublishedCatalog = {
      standalones: [],
      cases: [
        {
          kind: "case",
          subjectId: "phys",
          caseDoc: {
            id: "C07",
            version: 1,
            title: "Fluid volume",
            boardProfile: "nclex",
            status: "published",
            batchId: "catalog",
            primaryClientNeed: "Physiological",
            setting: "Med-surg",
            patient: { displayName: "Alex", age: 44, sex: "female", weightKg: 70, allergies: "NKDA", history: "Vomiting" },
            timepoints: [],
            chart: { tabs: [] },
            revealRule: "sequential",
            references: [],
            items: playable,
          },
          items: playable,
        },
        {
          kind: "case",
          subjectId: "phys",
          caseDoc: {
            id: "BROKEN",
            version: 1,
            title: "Broken",
            boardProfile: "nclex",
            status: "published",
            batchId: "catalog",
            primaryClientNeed: "Physiological",
            setting: "ICU",
            patient: { displayName: "Pat", age: 60, sex: "male", weightKg: 80, allergies: "NKDA" },
            timepoints: [],
            chart: { tabs: [] },
            revealRule: "sequential",
            references: [],
            items: broken,
          },
          items: broken,
        },
      ],
    };
    const rows = publishedCatalogToBankItems(catalog);
    expect(rows.map((row) => row.id)).toEqual(["ngn:S1:v1", "ngn:S2:v1"]);
    expect(rows.every((row) => row.ngnPayload?.setId === "C07")).toBe(true);
    const vignettes = Array.from({ length: 40 }, (_, i) => ({
      id: `v${i}`,
      question: `Classic question ${i} about a unique wound number ${i}`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Because this classic item is long enough to serve.",
      itemType: "vignette",
    })) as BankItem[];
    const picked = selectWithNgnFormatMix([...vignettes, ...rows], 20, "nursing", 3);
    expect(picked.filter((row) => String(row.id).startsWith("ngn:")).map((row) => row.ngnPayload?.stepIndex)).toEqual([
      1, 2,
    ]);
  });

  it("resumes catalog ids that are not QuestionBankItem rows", () => {
    const catalog: PublishedCatalog = { standalones: [{ kind: "standalone", item: bowtie, subjectId: null }], cases: [] };
    const rows = publishedCatalogToBankItems(catalog);
    const merged = mergePrefetchedBankItems(
      ["bank-1", "ngn:B01:v1"],
      new Map([
        [
          "bank-1",
          {
            id: "bank-1",
            question: "Bank",
            options: ["A"],
            correctAnswer: "A",
            explanation: "Because",
          },
        ],
      ]),
      rows
    );
    expect(merged.map((row) => row.id)).toEqual(["bank-1", "ngn:B01:v1"]);
  });
});
