import { describe, expect, it } from "vitest";
import { buildOfflineSafetyPathCards } from "./offline-fallback";
import {
  drugSafetyPathHref,
  drugStudyHref,
  safetyPathComplete,
  safetyPathDrugIds,
  safetyPathLabel,
  SHARED_SAFETY_DRUG_IDS,
} from "./safety-path";

describe("drug safety path", () => {
  it("keeps NCLEX on a fixed high-alert five, including warfarin and insulin", () => {
    expect(safetyPathDrugIds("nclex")).toEqual([...SHARED_SAFETY_DRUG_IDS]);
    expect(safetyPathLabel("nclex")).toMatch(/Warfarin/);
    expect(safetyPathLabel("nclex")).toMatch(/Insulin/);
    expect(safetyPathLabel("nclex")).toMatch(/Heparin/);
    const cards = buildOfflineSafetyPathCards("nclex");
    expect(cards.map((card) => card.drugId)).toEqual([...SHARED_SAFETY_DRUG_IDS]);
  });

  it("gives NAPLEX its own list and other boards the shared high-alert path", () => {
    expect(safetyPathDrugIds("naplex")).toEqual([
      "warfarin",
      "insulin-glargine",
      "vancomycin",
      "digoxin",
      "enoxaparin",
    ]);
    expect(safetyPathDrugIds("pance")).toEqual([...SHARED_SAFETY_DRUG_IDS]);
    expect(safetyPathDrugIds("usmle")).toEqual([...SHARED_SAFETY_DRUG_IDS]);
    expect(safetyPathDrugIds("aanp-fnp")).toEqual([...SHARED_SAFETY_DRUG_IDS]);
    expect(safetyPathDrugIds("npte-pt")).toEqual([...SHARED_SAFETY_DRUG_IDS]);
  });

  it("opens a safety-path drug inside the path and leaves other drugs as single cards", () => {
    expect(drugStudyHref("nclex", "warfarin")).toBe(
      "/study/drugs300?path=safety&exam=nclex&drug=warfarin"
    );
    expect(drugStudyHref("nclex", "insulin-glargine")).toContain("drug=insulin-glargine");
    expect(drugStudyHref("nclex", "sertraline")).toBe("/study/drugs300?drug=sertraline");
    expect(drugSafetyPathHref("naplex")).toBe("/study/drugs300?path=safety&exam=naplex");
  });

  it("is complete only after every path drug was reviewed", () => {
    const ids = safetyPathDrugIds("nclex");
    expect(safetyPathComplete(ids.slice(0, 4), "nclex")).toBe(false);
    expect(safetyPathComplete(ids, "nclex")).toBe(true);
    expect(safetyPathComplete([], "nclex")).toBe(false);
  });
});
