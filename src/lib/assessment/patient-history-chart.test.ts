import { describe, expect, it } from "vitest";
import { chartWithPatientHistory } from "./patient-history-chart";
import type { NgnChart } from "./types";

const notes: NgnChart = {
  tabs: [
    {
      id: "notes",
      label: "Nurses' Notes",
      entries: [{ time: "T0", text: "0700: Abdominal pain 7/10." }],
    },
  ],
};

describe("patient history on the chart", () => {
  it("adds a History tab when the player would otherwise drop it", () => {
    const history = "Hypertension; type 2 diabetes. Open colectomy 2 days ago.";
    const chart = chartWithPatientHistory(notes, history);
    expect(chart.tabs.map((tab) => tab.label)).toEqual(["Nurses' Notes", "History"]);
    expect(chart.tabs[1]?.entries).toEqual([{ time: "baseline", text: history }]);
    expect(chart.tabs[0]).toBe(notes.tabs[0]);
  });

  it("leaves the chart alone when history is blank or already written in a tab", () => {
    expect(chartWithPatientHistory(notes, "  ")).toBe(notes);
    expect(chartWithPatientHistory(notes, null)).toBe(notes);
    const present = chartWithPatientHistory(notes, "Hypertension.");
    expect(chartWithPatientHistory(present, "Hypertension.")).toBe(present);
  });

  it("adds the history to an existing History tab instead of a second tab", () => {
    const chart = chartWithPatientHistory(
      {
        tabs: [
          {
            id: "history",
            label: "History",
            entries: [{ time: "baseline", text: "Clinic visit 2 weeks ago." }],
          },
        ],
      },
      "Symptomatic gallstones."
    );
    expect(chart.tabs).toHaveLength(1);
    expect(chart.tabs[0]?.entries?.map((entry) => entry.text)).toEqual([
      "Symptomatic gallstones.",
      "Clinic visit 2 weeks ago.",
    ]);
  });
});
