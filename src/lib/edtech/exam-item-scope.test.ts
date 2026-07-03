import { describe, expect, it } from "vitest";
import {
  bankRowMatchesPracticeField,
  filterBankItemsForPracticeField,
  filterBankRowsForPracticeField,
} from "./exam-item-scope";
import type { BankItem } from "@/lib/question-bank";

describe("exam-item-scope", () => {
  it("blocks cross-exam field rows", () => {
    expect(
      bankRowMatchesPracticeField({ fieldId: "nursing", stepLevel: null }, "pharmacy")
    ).toBe(false);
    expect(
      bankRowMatchesPracticeField({ fieldId: "pance", stepLevel: null }, "aanp-fnp")
    ).toBe(false);
  });

  it("allows matching non-USMLE fields", () => {
    expect(
      bankRowMatchesPracticeField({ fieldId: "nursing", stepLevel: null }, "nursing")
    ).toBe(true);
  });

  it("excludes legacy Step 3 rows from Step 2 CK", () => {
    expect(
      bankRowMatchesPracticeField({ fieldId: "usmle-step-2", stepLevel: "step3" }, "usmle-step-2")
    ).toBe(false);
    expect(
      bankRowMatchesPracticeField({ fieldId: "usmle-step-2", stepLevel: null }, "usmle-step-2")
    ).toBe(true);
  });

  it("includes legacy Step 3 rows only for Step 3 practice", () => {
    expect(
      bankRowMatchesPracticeField({ fieldId: "usmle-step-2", stepLevel: "step3" }, "usmle-step-3")
    ).toBe(true);
    expect(
      bankRowMatchesPracticeField({ fieldId: "usmle-step-3", stepLevel: null }, "usmle-step-3")
    ).toBe(true);
  });

  it("filters prisma rows before serve", () => {
    const rows = [
      { id: "a", fieldId: "nursing", stepLevel: null },
      { id: "b", fieldId: "pharmacy", stepLevel: null },
    ];
    expect(filterBankRowsForPracticeField(rows, "nursing")).toEqual([rows[0]]);
  });

  it("filters bank items by step metadata when present", () => {
    const step3Item = {
      id: "x",
      ngnPayload: { stepLevel: "step3" },
    } as BankItem;
    const step2Item = { id: "y", ngnPayload: {} } as BankItem;
    expect(filterBankItemsForPracticeField([step3Item, step2Item], "usmle-step-2")).toEqual([
      step2Item,
    ]);
  });
});
