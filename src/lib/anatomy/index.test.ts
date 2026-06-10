import { describe, expect, it } from "vitest";
import {
  getAllAnatomyStructures,
  getAnatomyStructure,
  getHighYieldStructures,
  searchAnatomyStructures,
} from "./index";

describe("anatomy helpers", () => {
  it("loads curated structure catalog", () => {
    const all = getAllAnatomyStructures();
    expect(all.length).toBeGreaterThanOrEqual(10);
    expect(getAnatomyStructure("heart")?.name).toBe("Heart");
  });

  it("filters high-yield structures", () => {
    const hy = getHighYieldStructures();
    expect(hy.every((s) => s.highYield)).toBe(true);
    expect(hy.some((s) => s.id === "heart")).toBe(true);
  });

  it("searches by keyword and system", () => {
    const cardiac = searchAnatomyStructures("cardiac");
    expect(cardiac.some((s) => s.id === "heart")).toBe(true);

    const nervous = searchAnatomyStructures("", { system: "nervous" });
    expect(nervous.every((s) => s.system === "nervous")).toBe(true);
  });
});
