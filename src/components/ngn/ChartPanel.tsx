"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import { isNewestTime, isTimeVisible } from "@/lib/assessment/reveal";
import type { ChartTab, NgnChart, NgnTimepoint } from "@/lib/assessment/types";

type ChartPanelProps = {
  chart: NgnChart;
  timepoints: NgnTimepoint[];
  currentTimepoint: string;
  /** Mobile sheet: tabs wrap onto full-label pills. Desktop panel leaves this off. */
  wrapTabs?: boolean;
};

/** Fallback until the live mobile dock is measured. Matches its min height plus safe area. */
const MOBILE_DOCK_OFFSET = "calc(3.8125rem + env(safe-area-inset-bottom, 0px))";

function useMobileDockOffset(active: boolean): string {
  const [offset, setOffset] = useState(MOBILE_DOCK_OFFSET);
  useLayoutEffect(() => {
    if (!active || typeof document === "undefined") return;
    const nav = document.querySelector<HTMLElement>('nav[aria-label="Mobile study navigation"]');
    if (!nav) return;
    const apply = () => {
      const top = nav.getBoundingClientRect().top;
      const bottom = window.innerHeight - top;
      if (bottom > 0) setOffset(`${bottom}px`);
    };
    apply();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(apply);
    observer?.observe(nav);
    return () => observer?.disconnect();
  }, [active]);
  return offset;
}

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

function ChartTabs({
  tabs,
  activeId,
  onSelect,
  wrap,
}: {
  tabs: ChartTab[];
  activeId: string;
  onSelect: (id: string) => void;
  wrap: boolean;
}) {
  if (!wrap) {
    return (
      <div className="mt-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="Chart sections">
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
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
              onClick={() => onSelect(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Chart sections">
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`chart-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`chart-panel-${tab.id}`}
            className={`inline-flex min-h-11 min-w-11 max-w-full items-center justify-center rounded-full px-3.5 py-2 text-center text-sm font-medium leading-5 motion-reduce:transition-none ${ngnFocus} ${
              selected ? "bg-[#0A2540] text-white" : "text-[#0A2540] hover:bg-[#E5FBF9]"
            }`}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ChartBody({ chart, timepoints, currentTimepoint, wrapTabs = false }: ChartPanelProps) {
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
    <div className={`flex h-full min-h-0 flex-col ${wrapTabs ? "w-full min-w-0" : ""}`}>
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-sm font-semibold tracking-tight text-[#0A2540]">Chart</h2>
        {currentLabel ? <p className={`text-xs ${ngnMuted}`}>Showing through {currentLabel}</p> : null}
      </div>
      <ChartTabs tabs={tabs} activeId={active.id} onSelect={setTabId} wrap={wrapTabs} />
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
  const dockOffset = useMobileDockOffset(open);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-x-0 top-[var(--nav-height)] z-[60] flex flex-col lg:hidden"
      style={{ bottom: dockOffset }}
      role="presentation"
    >
      <button
        type="button"
        className="min-h-0 w-full flex-1 bg-[#0A2540]/40 motion-reduce:transition-none"
        aria-label="Close chart"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Client chart"
        className="flex max-h-[calc(100%-0.75rem)] w-full shrink-0 flex-col overflow-hidden rounded-t-3xl bg-white pb-3 shadow-2xl motion-reduce:transition-none"
      >
        <div className="flex shrink-0 justify-end px-4 pt-2">
          <button
            type="button"
            className={`min-h-11 rounded-full px-3 text-sm font-medium text-[#0A2540] ${ngnFocus}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4">
          <ChartBody {...props} wrapTabs />
        </div>
      </div>
    </div>,
    document.body
  );
}
