import { describe, expect, it } from "vitest";
import { studyUi } from "./study-ui";

describe("question session clearance", () => {
  it("pads the session by the mobile nav plus the safe-area inset", () => {
    expect(studyUi.sessionShell).toContain("4.75rem");
    expect(studyUi.sessionShell).toContain("env(safe-area-inset-bottom,0px)");
    expect(studyUi.sessionShell).toContain("max-lg:");
  });
});
