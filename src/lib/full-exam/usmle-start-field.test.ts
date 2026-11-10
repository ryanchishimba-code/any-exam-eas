import { describe, expect, it } from "vitest";
import { resolveUsmleExamStartField } from "./usmle-start-field";

describe("resolveUsmleExamStartField", () => {
  it("starts Step 1, Step 2 CK, and Step 3 when that step is requested", () => {
    expect(
      resolveUsmleExamStartField({
        requestedField: "usmle-step-1",
        savedField: "usmle-step-2",
      })
    ).toEqual({ ok: true, fieldId: "usmle-step-1" });
    expect(
      resolveUsmleExamStartField({
        requestedField: "usmle-step-2",
        savedField: "usmle-step-1",
      })
    ).toEqual({ ok: true, fieldId: "usmle-step-2" });
    expect(
      resolveUsmleExamStartField({
        requestedField: "usmle-step-3",
        savedField: "usmle-step-2",
      })
    ).toEqual({ ok: true, fieldId: "usmle-step-3" });
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
