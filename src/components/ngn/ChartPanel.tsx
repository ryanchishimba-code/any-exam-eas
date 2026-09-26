"use client";

import { useState } from "react";
import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import { isNewestTime, isTimeVisible } from "@/lib/assessment/reveal";
import type { ChartTab, NgnChart, NgnTimepoint } from "@/lib/assessment/types";

type ChartPanelProps = {
  chart: NgnChart;
  timepoints: NgnTimepoint[];
  currentTimepoint: string;
};

function visibleColumns(tab: ChartTab, current: string, ordered: string[]) {
  const columns = tab.columns ?? [];
  const tags = tab.columnTimepoints;
  return columns
    .map((label, index) => ({ label, index }))
    .filter((column) => !tags || isTimeVisible(tags[column.index] ?? "baseline", current, ordered));
}

function visibleRows(tab: ChartTab, current: string, ordered: string[]) {
  const rows = tab.rows ?? [];
  const tags = tab.rowTimepoints;
  return rows
    .map((cells, index) => ({ cells, index, tag: tags?.[index] ?? "baseline" }))
    .filter((row) => !tags || isTimeVisible(row.tag, current, ordered));
}

function ChartBody({ chart, timepoints, currentTimepoint }: ChartPanelProps) {
  const tabs = chart.tabs ?? [];
  const [tabId, setTabId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((tab) => tab.id === tabId) ?? tabs[0];
  const ordered = timepoints.map((timepoint) => timepoint.id);
  const currentLabel = timepoints.find((timepoint) => timepoint.id === currentTimepoint)?.label;

  if (!active) return null;

  const entries = (active.entries ?? []).filter((entry) =>
    isTimeVisible(entry.time, currentTimepoint, ordered)
  );
  const columns = visibleColumns(active, currentTimepoint, ordered);
  const rows = visibleRows(active, currentTimepoint, ordered);
  const referenceIndexes = new Set(
    columns.filter((column) => /reference/i.test(column.label)).map((column) => column.index)
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-sm font-semibold tracking-tight text-[#0A2540]">Chart</h2>
        {currentLabel ? <p className={`text-xs ${ngnMuted}`}>Showing through {currentLabel}</p> : null}
      </div>
      <div className="mt-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="Chart sections">
        {tabs.map((tab) => {
          const selected = tab.id === active.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`chart-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`chart-panel-${tab.id}`}
              className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-medium motion-reduce:transition-none ${ngnFocus} ${
                selected ? "bg-[#0A2540] text-white" : "text-[#0A2540] hover:bg-[#E5FBF9]"
              }`}
              onClick={() => setTabId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`chart-panel-${active.id}`}
        aria-labelledby={`chart-tab-${active.id}`}
        className="mt-4 min-h-0 flex-1 overflow-auto"
      >
        {entries.length > 0 ? (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li
                key={`${entry.time}-${entry.text.slice(0, 24)}`}
                className={`rounded-2xl px-4 py-3 text-[15px] leading-6 text-[#0A2540] ${
                  isNewestTime(entry.time, currentTimepoint) ? "bg-[#E5FBF9]" : "bg-[#f4f6f8]"
                }`}
              >
                {entry.text}
              </li>
            ))}
          </ul>
        ) : null}
        {columns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-left text-sm">
              <caption className="sr-only">{active.label}</caption>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.label}
                      scope="col"
                      className={`border-b border-[#e2e8f0] px-3 py-2 font-semibold text-[#0A2540] ${
                        referenceIndexes.has(column.index) ? "bg-[#f4f6f8]" : ""
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.tag}-${row.cells.join("|")}`}
                    className={isNewestTime(row.tag, currentTimepoint) ? "bg-[#E5FBF9]" : undefined}
                  >
                    {columns.map((column, displayIndex) => {
                      const cell = row.cells[column.index] ?? "";
                      const reference = referenceIndexes.has(column.index);
                      const Tag = displayIndex === 0 ? "th" : "td";
                      return (
                        <Tag
                          key={`${column.label}-${cell}`}
                          scope={displayIndex === 0 ? "row" : undefined}
                          className={`border-b border-[#e2e8f0] px-3 py-2 align-top text-[#0A2540] ${
                            reference ? "bg-[#f4f6f8] text-[#334155]" : ""
                          } ${displayIndex === 0 ? "font-medium" : ""}`}
                        >
                          {cell}
                        </Tag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ChartPanel(props: ChartPanelProps) {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-[#e2e8f0] bg-white p-4 sm:p-5" aria-label="Client chart">
      <ChartBody {...props} />
    </section>
  );
}

export function ChartSheet({
  open,
  onClose,
  ...props
}: ChartPanelProps & { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[#0A2540]/40 motion-reduce:transition-none"
        aria-label="Close chart"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Client chart"
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white p-4 shadow-2xl motion-reduce:transition-none"
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm font-medium text-[#0A2540] ${ngnFocus}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <ChartBody {...props} />
        </div>
      </div>
    </div>
  );
}
