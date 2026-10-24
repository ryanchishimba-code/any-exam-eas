import { describe, expect, it } from "vitest";
import {
  buildClinicalItemTypeBarRows,
  buildHubLiveBarRows,
  buildUsmleStepBarRows,
} from "./hub-live-bar-chart";

describe("buildUsmleStepBarRows", () => {
  it("omits zero steps", () => {
    expect(
      buildUsmleStepBarRows({ step1: 10, step2: 0, step3: 5 }).map((row) => row.id)
    ).toEqual(["step1", "step3"]);
  });
});

describe("buildClinicalItemTypeBarRows", () => {
  it("groups vignette and mcq counts", () => {
    const rows = buildClinicalItemTypeBarRows({ vignette: 3, mcq: 2, sata: 1 });
    expect(rows.find((row) => row.id === "vignette")?.count).toBe(5);
    expect(rows.find((row) => row.id === "sata")?.count).toBe(1);
  });
});

describe("buildHubLiveBarRows", () => {
  it("routes USMLE to step rows and PANCE to item types", () => {
    expect(
      buildHubLiveBarRows("usmle", { usmleStepCounts: { step2: 100 } })[0]?.label
    ).toBe("Step 2 CK");
    expect(
      buildHubLiveBarRows("pance", { bankTypes: { vignette: 4 } })[0]?.count
    ).toBe(4);
  });
});
