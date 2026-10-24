import { describe, expect, it } from "vitest";
import { buildHeroCaseScene } from "./hero-case";

const chart = {
  tabs: [
    {
      id: "notes",
      label: "Nurses' Notes",
      entries: [{ time: "0700", text: "Abdomen firm and distended. Pain 8/10." }],
    },
    {
      id: "vitals",
      label: "Vital Signs",
      columns: ["Time", "HR", "BP"],
      rows: [["0700", "118/min", "86/52 mm Hg"]],
    },
  ],
};

const item = {
  stem: "Which actions should the nurse anticipate? Select all that apply.",
  payload: {
    options: [
      { id: "a", text: "Start the prescribed fluid bolus" },
      { id: "b", text: "Wait for the next set of vitals" },
    ],
    keys: ["a"],
  },
  rationale: {
    short: "Start the prescribed fluid bolus for hypoperfusion.",
    expanded: {
      perOption: {
        a: { verdict: "key", text: "Key. Fluids treat the low pressure." },
        b: { verdict: "distractor", text: "Waiting leaves the hypotension untreated." },
      },
    },
  },
};

describe("buildHeroCaseScene", () => {
  it("keeps the live notes, vitals, keyed answer, and a stored wrong-option reason", () => {
    const scene = buildHeroCaseScene({ setting: "Surgical unit", chart, items: [item] });
    expect(scene).toMatchObject({
      setting: "Surgical unit",
      notesLabel: "Nurses' Notes",
      notes: ["Abdomen firm and distended. Pain 8/10."],
      vitalsLabel: "Vital Signs",
      columns: ["Time", "HR", "BP"],
      rows: [["0700", "118/min", "86/52 mm Hg"]],
      options: ["Start the prescribed fluid bolus", "Wait for the next set of vitals"],
      keyedOptionText: "Start the prescribed fluid bolus",
      keyedAnswer: "Start the prescribed fluid bolus for hypoperfusion.",
      whyNot: "Waiting leaves the hypotension untreated.",
    });
  });

  it("returns null when the case has no vital table or no keyed item", () => {
    expect(buildHeroCaseScene({ setting: "Unit", chart: { tabs: [] }, items: [item] })).toBeNull();
    expect(
      buildHeroCaseScene({
        setting: "Unit",
        chart,
        items: [{ stem: "No choices.", payload: {}, rationale: {} }],
      })
    ).toBeNull();
  });
});
