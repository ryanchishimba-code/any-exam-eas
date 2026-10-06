import { describe, expect, it } from "vitest";
import { selectExamDestination } from "./select-exam-destination";

describe("selectExamDestination", () => {
  it("shows the chooser for a bare visit and for switch mode", () => {
    expect(
      selectExamDestination({
        signedIn: true,
        emailUnverified: false,
        hasPreference: true,
        switchMode: false,
        hasAppAccess: true,
      })
    ).toBe("chooser");
    expect(
      selectExamDestination({
        signedIn: true,
        emailUnverified: false,
        hasPreference: true,
        switchMode: true,
        hasAppAccess: true,
      })
    ).toBe("chooser");
  });

  it("keeps the unverified notice and the reactivate redirect", () => {
    expect(
      selectExamDestination({
        signedIn: true,
        emailUnverified: true,
        hasPreference: true,
        switchMode: false,
        hasAppAccess: true,
      })
    ).toBe("unverified");
    expect(
      selectExamDestination({
        signedIn: true,
        emailUnverified: false,
        hasPreference: true,
        switchMode: false,
        hasAppAccess: false,
      })
    ).toBe("reactivate");
    expect(
      selectExamDestination({
        signedIn: false,
        emailUnverified: false,
        hasPreference: false,
        switchMode: false,
        hasAppAccess: false,
      })
    ).toBe("login");
  });
});
