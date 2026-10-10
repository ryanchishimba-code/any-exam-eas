import { describe, expect, it } from "vitest";
import { resolveUsmleExamStartField } from "./usmle-start-field";

describe("resolveUsmleExamStartField", () => {
  it("refuses a start for a step other than the saved one", () => {
    expect(
      resolveUsmleExamStartField({
        requestedField: "usmle-step-1",
        savedField: "usmle-step-2",
      })
    ).toEqual({ ok: false, expectedFieldId: "usmle-step-2" });
  });

  it("starts the saved step when the request matches or omits a step", () => {
    expect(
      resolveUsmleExamStartField({
        requestedField: "usmle-step-2",
        savedField: "usmle-step-2",
      })
    ).toEqual({ ok: true, fieldId: "usmle-step-2" });
    expect(
      resolveUsmleExamStartField({
        requestedField: null,
        savedField: "usmle-step-3",
      })
    ).toEqual({ ok: true, fieldId: "usmle-step-3" });
  });
});
