import { describe, expect, it } from "vitest";
import { hasShiftNoteArtifacts, stripLeadingShiftNoteBlock, stripShiftNotes } from "./shift-notes";

describe("shift-notes", () => {
  it("strips timestamp prefixes", () => {
    expect(stripShiftNotes("0900 — 54F DM2 admitted BG 418.")).toBe(
      "54F DM2 admitted BG 418."
    );
    expect(stripShiftNotes("166 — Inpatient psychiatric unit, Room 206.")).toBe(
      "Inpatient psychiatric unit, Room 206."
    );
  });

  it("removes chart headers and handoff refs", () => {
    const raw = `At 1400, the nurse performs an assessment and documents:
• GCS 12
Handoff ref 8123 (Management of Care).`;
    expect(stripShiftNotes(raw)).toBe("• GCS 12");
  });

  it("strips leading bank id and unit line from combined stems", () => {
    const raw =
      "166 — Inpatient psychiatric unit, Room 206. A 19-year-old man with suicidal ideation.";
    expect(stripLeadingShiftNoteBlock(raw)).toBe(
      "A 19-year-old man with suicidal ideation."
    );
  });

  it("detects shift note artifacts", () => {
    expect(hasShiftNoteArtifacts("0845 — Medical-surgical unit.")).toBe(true);
    expect(hasShiftNoteArtifacts("A 68-year-old client with heart failure.")).toBe(false);
  });
});
