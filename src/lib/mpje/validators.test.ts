import { describe, expect, it } from "vitest";
import { parseMpjeStateParam } from "./validators";

describe("parseMpjeStateParam", () => {
  it("defaults to Oklahoma", () => {
    expect(parseMpjeStateParam(null, null)).toBe("OK");
  });

  it("prefers state query param over mpjeState", () => {
    expect(parseMpjeStateParam("TX", "CA")).toBe("TX");
  });

  it("falls back to mpjeState", () => {
    expect(parseMpjeStateParam(null, "NY")).toBe("NY");
  });
});
