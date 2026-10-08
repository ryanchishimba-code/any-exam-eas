import { describe, expect, it } from "vitest";
import type { PublishedCatalog, ServeItem } from "@/lib/assessment/serve";
import { score, scoringRegistry } from "@/lib/assessment/scoring/registry";
import type { NgnItem, ScorableItem } from "@/lib/assessment/types";
import { bankItemToExamQuestion, ngnPayloadToChartData } from "@/lib/exam-prep/ngn-bank-bridge";
import { publishedCatalogToBankItems } from "@/lib/full-exam/catalog-exam-items";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import {
  NGN_MATRIX_MULTI_INSTRUCTION,
  NGN_MATRIX_SINGLE_INSTRUCTION,
  NGN_SELECT_ALL_INSTRUCTION,
  ngnCheckEnabled,
  resolveNgnMultiResponseRule,
  toggleCappedSelection,
  type NgnMultiResponseRule,
} from "@/lib/questions/ngn-response-rules";

function assertNoKeyedCount(rule: NgnMultiResponseRule, keyedCount: number) {
  const copy = `${rule.instruction} ${rule.checkLabel}`;
  expect(copy).not.toMatch(/\d/);
  expect(copy).not.toContain(String(keyedCount));
  expect(copy.toLowerCase()).not.toContain("cells");
  expect(rule.checkLabel).toBe("Check");
}

describe("NGN response rules", () => {
  it("does not reveal a keyed count for matrix multiple response, select-all, or highlight", () => {
    const matrix = resolveNgnMultiResponseRule({
      type: "matrix",
      ngnPayload: {
        kind: "matrix",
        matrixMulti: true,
        rows: ["Lisinopril", "Ceftriaxone", "Spironolactone"],
        columns: ["Contributes", "Hold"],
      },
    });
    const sata = resolveNgnMultiResponseRule({
      type: "select_all",
      responseFormat: "mr_sata",
      ngnPayload: { kind: "select_all" },
    });
    const highlight = resolveNgnMultiResponseRule({
      type: "highlight",
      responseFormat: "highlight_text",
      ngnPayload: { kind: "highlight", highlights: ["a", "b", "c", "d"] },
    });

    expect(matrix?.format).toBe("matrix_mr");
    expect(matrix?.instruction).toBe(NGN_MATRIX_MULTI_INSTRUCTION);
    expect(sata?.format).toBe("mr_sata");
    expect(sata?.instruction).toBe(NGN_SELECT_ALL_INSTRUCTION);
    expect(highlight?.format).toBe("highlight");
    expect(highlight?.instruction).toBe(NGN_SELECT_ALL_INSTRUCTION);
    for (const rule of [matrix, sata, highlight]) {
      expect(rule).not.toBeNull();
      assertNoKeyedCount(rule!, 4);
    }
  });

  it("enables Check for matrix multiple choice only when every row has one selection", () => {
    const rule = resolveNgnMultiResponseRule({
      type: "matrix",
      ngnPayload: {
        kind: "matrix",
        matrixMulti: false,
        rows: ["Hypoxia", "Drainage", "Chest pain"],
      },
    });
    expect(rule?.format).toBe("matrix_mc");
    expect(rule?.instruction).toBe(NGN_MATRIX_SINGLE_INSTRUCTION);
    expect(rule?.instruction).not.toMatch(/\d/);
    expect(ngnCheckEnabled(rule!, [])).toBe(false);
    expect(ngnCheckEnabled(rule!, ["Hypoxia|||Intervene"])).toBe(false);
    expect(
      ngnCheckEnabled(rule!, [
        "Hypoxia|||Intervene",
        "Drainage|||Expected",
        "Chest pain|||Intervene",
      ])
    ).toBe(true);
    expect(
      ngnCheckEnabled(rule!, [
        "Hypoxia|||Intervene",
        "Hypoxia|||Expected",
        "Drainage|||Expected",
        "Chest pain|||Intervene",
      ])
    ).toBe(false);
  });

  it("enables matrix multiple response after one selection and never requires an exact total", () => {
    const rule = resolveNgnMultiResponseRule({
      responseFormat: "matrix_mr",
      payload: {
        rows: [
          { id: "r1", text: "Lisinopril" },
          { id: "r2", text: "Ceftriaxone" },
          { id: "r3", text: "Spironolactone" },
        ],
        columns: [
          { id: "contrib", label: "Contributes" },
          { id: "hold", label: "Hold" },
        ],
      },
    });
    expect(rule?.maxSelections).toBeNull();
    expect(ngnCheckEnabled(rule!, [])).toBe(false);
    expect(ngnCheckEnabled(rule!, ["r1|||contrib"])).toBe(true);
    expect(
      ngnCheckEnabled(rule!, ["r1|||contrib", "r1|||hold", "r2|||contrib", "r3|||hold", "r3|||contrib"])
    ).toBe(true);

    const perRow = resolveNgnMultiResponseRule({
      type: "matrix",
      ngnPayload: {
        kind: "matrix",
        matrixMulti: true,
        requireSelectionPerRow: true,
        rows: ["r1", "r2"],
      },
    });
    expect(ngnCheckEnabled(perRow!, ["r1|||contrib"])).toBe(false);
    expect(ngnCheckEnabled(perRow!, ["r1|||contrib", "r1|||hold", "r2|||hold"])).toBe(true);
  });

  it("enables select-all and highlight after at least one selection", () => {
    const sata = resolveNgnMultiResponseRule({ type: "select_all" })!;
    const highlight = resolveNgnMultiResponseRule({ responseFormat: "highlight_text" })!;
    expect(ngnCheckEnabled(sata, [])).toBe(false);
    expect(ngnCheckEnabled(sata, ["Give oxygen"])).toBe(true);
    expect(ngnCheckEnabled(highlight, [])).toBe(false);
    expect(ngnCheckEnabled(highlight, ["SpO2 88%"])).toBe(true);
  });

  it("caps Select N and keeps N through catalog conversion and the bank bridge", () => {
    const rule = resolveNgnMultiResponseRule({
      type: "select_all",
      ngnPayload: { kind: "select_n", responseFormat: "mr_select_n", n: 2 },
    })!;
    expect(rule.instruction).toBe("Select 2");
    expect(rule.maxSelections).toBe(2);
    let selected = toggleCappedSelection(rule, [], "a");
    selected = toggleCappedSelection(rule, selected, "b");
    selected = toggleCappedSelection(rule, selected, "c");
    expect(selected).toEqual(["a", "b"]);
    expect(ngnCheckEnabled(rule, [])).toBe(false);
    expect(ngnCheckEnabled(rule, selected)).toBe(true);
    expect(ngnCheckEnabled(rule, ["a"])).toBe(true);
    selected = toggleCappedSelection(rule, selected, "a");
    expect(selected).toEqual(["b"]);

    const item: ServeItem = {
      id: "SN1",
      version: 1,
      itemType: "trend",
      caseId: null,
      caseStep: null,
      cjmmFunction: "take",
      timepoint: null,
      responseFormat: "mr_select_n",
      scoringRule: "zero_one",
      maxPoints: 2,
      stem: "Select the two findings that require intervention.",
      payload: {
        n: 2,
        keys: ["a", "c"],
        options: [
          { id: "a", text: "SpO2 88%" },
          { id: "b", text: "Warm dry skin" },
          { id: "c", text: "New chest pain" },
          { id: "d", text: "Bowel sounds present" },
        ],
      },
      rationale: {
        short: "Hypoxia and chest pain need intervention now.",
        expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "Act on the acute findings." },
      },
      clientNeeds: { category: "Physiological Adaptation" },
      references: [],
      rnFlags: [],
      status: "published",
      batchId: "catalog",
      caseVersion: null,
    };
    const catalog: PublishedCatalog = {
      standalones: [{ kind: "standalone", item: item as NgnItem, subjectId: "phys" }],
      cases: [],
    };
    const [row] = publishedCatalogToBankItems(catalog);
    expect(row?.ngnPayload?.kind).toBe("select_n");
    expect(row?.ngnPayload?.responseFormat).toBe("mr_select_n");
    expect(row?.ngnPayload?.n).toBe(2);

    const chart = ngnPayloadToChartData(row?.ngnPayload);
    expect(chart?.kind).toBe("select_n");
    expect(chart?.responseFormat).toBe("mr_select_n");
    expect(chart?.n).toBe(2);

    const exam = bankItemToExamQuestion(row!, 0);
    expect(exam.ngnPayload?.n).toBe(2);
    expect(exam.ngnPayload?.responseFormat).toBe("mr_select_n");
    expect(exam.options).toEqual(["SpO2 88%", "Warm dry skin", "New chest pain", "Bowel sounds present"]);

    const study = examQuestionToStudy({ ...exam, id: 1 }, 0, { shuffleOptions: false });
    const carried = resolveNgnMultiResponseRule(study);
    expect(carried?.format).toBe("mr_select_n");
    expect(carried?.selectN).toBe(2);
    expect(carried?.instruction).toBe("Select 2");
    expect(carried?.maxSelections).toBe(2);
  });

  it("leaves NCSBN 0/1 and +/- registry scoring unchanged", () => {
    const sata: ScorableItem = {
      responseFormat: "mr_sata",
      scoringRule: "plus_minus",
      payload: { keys: ["a", "b"], options: [] },
    };
    expect(score(sata, ["c", "d"])).toBe(0);
    expect(score(sata, ["a", "b"])).toBe(2);
    expect(scoringRegistry.plus_minus(sata, ["a", "c"])).toBe(0);

    const highlight: ScorableItem = {
      responseFormat: "highlight_text",
      scoringRule: "plus_minus",
      payload: { keys: ["h1", "h2"] },
    };
    expect(score(highlight, ["h1"])).toBe(1);
    expect(score(highlight, ["h9"])).toBe(0);

    const selectN: ScorableItem = {
      responseFormat: "mr_select_n",
      scoringRule: "zero_one",
      payload: { n: 2, keys: ["a", "b"] },
    };
    expect(score(selectN, ["a", "c", "b"])).toBe(1);
    expect(score(selectN, ["b", "a"])).toBe(2);
    expect(scoringRegistry.zero_one(selectN, ["c", "d"])).toBe(0);

    const matrixMc: ScorableItem = {
      responseFormat: "matrix_mc",
      scoringRule: "zero_one",
      payload: {
        rows: [
          { id: "r1", key: "c1" },
          { id: "r2", key: "c2" },
        ],
      },
    };
    expect(score(matrixMc, { r1: "c1", r2: "c2" })).toBe(2);
    expect(score(matrixMc, { r1: "c1", r2: "no" })).toBe(1);

    const matrixMr: ScorableItem = {
      responseFormat: "matrix_mr",
      scoringRule: "plus_minus",
      payload: {
        columns: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" },
        ],
        rows: [
          { id: "r1", keys: ["c1"] },
          { id: "r2", keys: ["c1", "c2"] },
        ],
      },
    };
    expect(score(matrixMr, { r1: ["c1", "c2"], r2: ["c1"] })).toBe(2);
    expect(scoringRegistry.plus_minus(matrixMr, { r1: ["c1"], r2: ["c1", "c2"] })).toBe(3);
  });
});
