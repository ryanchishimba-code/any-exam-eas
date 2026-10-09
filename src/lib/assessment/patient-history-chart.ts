import type { ChartTab, NgnChart } from "@/lib/assessment/types";

function tabBody(tab: ChartTab): string {
  return [
    ...(tab.entries ?? []).map((entry) => entry.text),
    ...(tab.columns ?? []),
    ...(tab.rows ?? []).flatMap((row) => row),
  ].join("\n");
}

function isHistoryTab(tab: ChartTab): boolean {
  return tab.id === "history" || /^history$/i.test(tab.label.trim());
}

function uniqueTabId(tabs: readonly ChartTab[], base: string): string {
  const ids = new Set(tabs.map((tab) => tab.id));
  if (!ids.has(base)) return base;
  let n = 2;
  while (ids.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/**
 * The case player shows the chart, not `patient.history`.
 * Add that history where a student can open it, without a second copy.
 */
export function chartWithPatientHistory(chart: NgnChart, history: string | null | undefined): NgnChart {
  const text = history?.trim() ?? "";
  if (!text) return chart;
  const tabs = chart.tabs ?? [];
  if (tabs.some((tab) => tabBody(tab).includes(text))) return chart;
  const historyTab = tabs.find(isHistoryTab);
  if (historyTab) {
    return {
      ...chart,
      tabs: tabs.map((tab) =>
        tab === historyTab
          ? { ...tab, entries: [{ time: "baseline", text }, ...(tab.entries ?? [])] }
          : tab
      ),
    };
  }
  return {
    ...chart,
    tabs: [
      ...tabs,
      {
        id: uniqueTabId(tabs, "patient-history"),
        label: "History",
        entries: [{ time: "baseline", text }],
      },
    ],
  };
}
