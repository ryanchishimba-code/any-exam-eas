import { describe, expect, it } from "vitest";
import { normalizeUsmleExhibitPayload, resolveExhibitTable } from "./normalize-exhibit";
import type { BankItem } from "@/lib/question-bank";

describe("resolveExhibitTable", () => {
  it("maps exhibit.findings objects to a lab-style table", () => {
    const table = resolveExhibitTable({
      exhibit: {
        title: "Serum studies",
        findings: [
          { label: "Troponin I", value: "2.4 ng/mL", reference: "<0.04", abnormal: true },
          { label: "CK-MB", value: "18 ng/mL", reference: "0–5" },
        ],
      },
    });
    expect(table?.title).toBe("Serum studies");
    expect(table?.headers).toEqual(["Test", "Result", "Reference"]);
    expect(table?.rows).toHaveLength(2);
    expect(table?.abnormalRows?.[0]).toBe(true);
  });

  it("maps string findings to a single-column table", () => {
    const table = resolveExhibitTable({
      chartData: {
        exhibit: {
          title: "ECG findings",
          findings: ["ST elevation in V2–V4", "Reciprocal depression in II, III, aVF"],
        },
      },
    });
    expect(table?.headers).toEqual(["Finding"]);
    expect(table?.rows[0]).toEqual(["ST elevation in V2–V4"]);
  });

  it("preserves an existing canonical table", () => {
    const table = resolveExhibitTable({
      table: {
        title: "CBC",
        headers: ["Test", "Result"],
        rows: [["WBC", "14.2"]],
        abnormalRows: [true],
      },
    });
    expect(table?.rows[0]).toEqual(["WBC", "14.2"]);
    expect(table?.abnormalRows?.[0]).toBe(true);
  });
});

describe("normalizeUsmleExhibitPayload", () => {
  it("writes renderable table onto ngnPayload and promotes itemType", () => {
    const item = {
      subjectId: "internal-medicine",
      question: "What is the next step?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "test",
      itemType: "vignette",
      ngnPayload: {
        exhibit: {
          title: "Labs",
          findings: [{ label: "K+", value: "2.9", reference: "3.5–5.0", abnormal: true }],
        },
      },
    } as BankItem;

    const next = normalizeUsmleExhibitPayload(item);
    expect(next.itemType).toBe("exhibit");
    expect(next.ngnPayload?.kind).toBe("exhibit");
    expect((next.ngnPayload?.table as { rows: string[][] }).rows[0][0]).toBe("K+");
  });
});
