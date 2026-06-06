import { describe, expect, it } from "vitest";
import { parseMpjeStateParam, parseOptionalMpjeStateParam } from "./validators";

describe("parseOptionalMpjeStateParam", () => {
  it("returns undefined when no state is provided", () => {
    expect(parseOptionalMpjeStateParam(null, null)).toBeUndefined();
    expect(parseOptionalMpjeStateParam("", "")).toBeUndefined();
  });

  it("prefers state over mpjeState", () => {
    expect(parseOptionalMpjeStateParam("TX", "CA")).toBe("TX");
  });

  it("falls back to mpjeState", () => {
    expect(parseOptionalMpjeStateParam(null, "NY")).toBe("NY");
  });

  it("normalizes valid codes to uppercase", () => {
    expect(parseOptionalMpjeStateParam("ok", null)).toBe("OK");
  });
});

describe("parseMpjeStateParam", () => {
  it("aliases parseOptionalMpjeStateParam without defaulting to OK", () => {
    expect(parseMpjeStateParam(null, null)).toBeUndefined();
    expect(parseMpjeStateParam("TX", null)).toBe("TX");
  });
});
