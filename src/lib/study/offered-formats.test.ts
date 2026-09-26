import { describe, expect, it } from "vitest";
import {
  coercePracticeFormat,
  filterPresetsByOfferedFormats,
  isFormatOffered,
  isPracticePresetOffered,
  practiceFormatChooser,
  visibleStudyPlanDays,
} from "./offered-formats";

const nclex = { mcq: 5596, ngn: 0, case: 0 };
const naplex = { mcq: 9931, ngn: 144, case: 0 };
const step3 = { mcq: 100, ngn: 0, case: 175 };

describe("offered practice formats", () => {
  it("hides a format only when that board has zero eligible items", () => {
    expect(isFormatOffered("ngn", nclex)).toBe(false);
    expect(isFormatOffered("case", nclex)).toBe(false);
    expect(isFormatOffered("ngn", naplex)).toBe(true);
    expect(isFormatOffered("case", naplex)).toBe(false);
    expect(isFormatOffered("case", step3)).toBe(true);
    expect(isFormatOffered("ngn", null)).toBe(false);
  });

  it("sends a hidden deep link to standard practice and keeps a served one", () => {
    expect(coercePracticeFormat("ngn", nclex)).toBe("all");
    expect(coercePracticeFormat("case", nclex)).toBe("all");
    expect(coercePracticeFormat("ngn", naplex)).toBe("ngn");
    expect(coercePracticeFormat("case", step3)).toBe("case");
    expect(coercePracticeFormat("all", nclex)).toBe("all");
    expect(coercePracticeFormat("ngn", null)).toBe("ngn");
  });

  it("omits the format section when nothing but standard practice is served", () => {
    expect(practiceFormatChooser({ formats: nclex, ngnLabel: "NGN" })).toBeNull();
    expect(practiceFormatChooser({ formats: naplex, lockToAll: true })).toBeNull();
    expect(practiceFormatChooser({ formats: null })).toBeNull();
  });

  it("keeps a two- or three-column chooser for the formats that exist", () => {
    const ngnOnly = practiceFormatChooser({
      formats: naplex,
      ngnLabel: "NGN-style",
      subjectId: "__mixed__",
    });
    expect(ngnOnly).toMatchObject({
      choices: ["all", "ngn"],
      columns: 2,
    });
    expect(ngnOnly?.intro).toBe(
      "NGN-style sets draw eligible items from every topic. The numbers are the questions this session can use."
    );
    expect(ngnOnly?.intro).not.toMatch(/case|coming soon/i);

    const both = practiceFormatChooser({
      formats: { mcq: 10, ngn: 2, case: 4 },
      ngnLabel: "NGN",
      subjectId: "cardiology",
    });
    expect(both).toMatchObject({
      choices: ["all", "ngn", "case"],
      columns: 3,
    });
    expect(both?.intro).toMatch(/this topic/);
  });

  it("hides SATA when NGN is empty and keeps it when select-all items exist", () => {
    const presets = [{ id: "prioritization-workshop" }, { id: "sata-mastery" }, { id: "step3-ccs-drill" }];
    expect(filterPresetsByOfferedFormats(presets, nclex).map((preset) => preset.id)).toEqual([
      "prioritization-workshop",
    ]);
    expect(filterPresetsByOfferedFormats(presets, naplex).map((preset) => preset.id)).toEqual([
      "prioritization-workshop",
      "sata-mastery",
    ]);
    expect(isPracticePresetOffered("step3-ccs-drill", step3)).toBe(true);
    expect(isPracticePresetOffered("dosage-calc-sprint", nclex)).toBe(true);
  });

  it("drops plan days that only offer a hidden format", () => {
    const days = visibleStudyPlanDays(
      [
        { label: "SATA mastery", presetIds: ["sata-mastery"] },
        { label: "SATA + calc mix", presetIds: ["sata-mastery", "dosage-calc-sprint"] },
        { label: "Dosage calc sprint", presetIds: ["dosage-calc-sprint"] },
      ],
      nclex,
      (label) => (label.startsWith("SATA +") ? "Dosage calc sprint" : label.startsWith("SATA") ? null : label)
    );
    expect(days.map((day) => day.label)).toEqual(["Dosage calc sprint", "Dosage calc sprint"]);
    expect(days[0]?.presetIds).toEqual(["dosage-calc-sprint"]);
  });
});
