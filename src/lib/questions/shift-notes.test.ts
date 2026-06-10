import { describe, expect, it } from "vitest";
import {
  hasShiftNoteArtifacts,
  resolveNclexStem,
  splitVagueCombinedQuestion,
  stripLeadingShiftNoteBlock,
  stripShiftNotes,
} from "./shift-notes";

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

  it("splits combined clinical text from vague instruction", () => {
    const raw =
      "1747 — Labor and delivery unit, Room 547. A 27-year-old woman with preeclampsia. BP 168/104 mmHg.\nChoose the single best answer based on clinical judgment.";
    const split = splitVagueCombinedQuestion(raw);
    expect(split.vignette).toMatch(/27-year-old woman with preeclampsia/);
    expect(split.stem).toBe("Which nursing action should the nurse take first?");
  });

  it("resolves vague stem from action options", () => {
    expect(
      resolveNclexStem("Choose the single best answer based on clinical judgment.", [
        "Notify the provider",
        "Document the finding",
        "Delegate to UAP",
        "Reassure the client",
      ])
    ).toBe("Which nursing action should the nurse take first?");
  });

  it("detects shift note artifacts", () => {
    expect(hasShiftNoteArtifacts("0845 — Medical-surgical unit.")).toBe(true);
    expect(hasShiftNoteArtifacts("A 68-year-old client with heart failure.")).toBe(false);
  });
});
