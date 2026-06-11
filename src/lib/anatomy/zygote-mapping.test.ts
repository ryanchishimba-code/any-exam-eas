import { describe, expect, it } from "vitest";
import { getAllAnatomyStructures } from "./index";
import { getZygoteEntityForStructure, STRUCTURE_TO_ZYGOTE_ENTITY } from "./zygote-mapping";

describe("zygote mapping", () => {
  it("maps every catalog structure to a Zygote entity", () => {
    const missing = getAllAnatomyStructures()
      .filter((s) => !STRUCTURE_TO_ZYGOTE_ENTITY[s.id])
      .map((s) => s.id);
    expect(missing).toEqual([]);
  });

  it("resolves entities for high-yield structures", () => {
    expect(getZygoteEntityForStructure("heart")).toBe("heart");
    expect(getZygoteEntityForStructure("liver")).toBe("liver");
    expect(getZygoteEntityForStructure("kidneys")).toBe("l_kidney");
  });
});
