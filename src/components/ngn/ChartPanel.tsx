"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import { isNewestTime, isTimeVisible } from "@/lib/assessment/reveal";
import type { ChartTab, NgnChart, NgnTimepoint } from "@/lib/assessment/types";

type ChartPanelProps = {
  chart: NgnChart;
  timepoints: NgnTimepoint[];
  currentTimepoint: string;
  /** Mobile sheet: snap-scrolling tabs with an edge fade. Desktop panel leaves this off. */
  scrollTabs?: boolean;
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

function ChartTabs({
  tabs,
  activeId,
  onSelect,
  scrollCue,
}: {
  tabs: ChartTab[];
  activeId: string;
  onSelect: (id: string) => void;
  scrollCue: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: true });
  const tabKey = tabs.map((tab) => tab.id).join("|");

  useLayoutEffect(() => {
    if (!scrollCue) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const selected = scroller.querySelector<HTMLElement>('[aria-selected="true"]');
    if (selected) {
      const fade = 36;
      const left = selected.offsetLeft;
      const right = left + selected.offsetWidth;
      const viewRight = scroller.scrollLeft + scroller.clientWidth - fade;
      if (left < scroller.scrollLeft) {
        scroller.scrollLeft = Math.max(0, left - 4);
      } else if (right > viewRight) {
        scroller.scrollLeft = Math.max(0, right - scroller.clientWidth + fade);
      }
    }

    const measure = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      setEdges({
        start: scroller.scrollLeft > 2,
        end: max - scroller.scrollLeft > 2,
      });
    };
    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", measure);
      observer?.disconnect();
    };
  }, [scrollCue, activeId, tabKey]);

  if (!scrollCue) {
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
    <div className="relative mt-3 min-w-0">
      <div
        ref={scrollerRef}
        className="flex w-full min-w-0 snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain scroll-px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Chart sections"
      >
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
              title={tab.label}
              className={`inline-flex min-h-11 min-w-11 shrink-0 snap-start items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-medium motion-reduce:transition-none ${ngnFocus} ${
                selected ? "bg-[#0A2540] text-white" : "text-[#0A2540] hover:bg-[#E5FBF9]"
              }`}
              onClick={() => onSelect(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent ${
          edges.start ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent ${
          edges.end ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function ChartBody({ chart, timepoints, currentTimepoint, scrollTabs = false }: ChartPanelProps) {
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
    <div className={`flex h-full min-h-0 flex-col ${scrollTabs ? "w-full min-w-0" : ""}`}>
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-sm font-semibold tracking-tight text-[#0A2540]">Chart</h2>
        {currentLabel ? <p className={`text-xs ${ngnMuted}`}>Showing through {currentLabel}</p> : null}
      </div>
      <ChartTabs tabs={tabs} activeId={active.id} onSelect={setTabId} scrollCue={scrollTabs} />
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
    <div className="fixed inset-0 z-[52] lg:hidden" role="presentation">
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
        className="absolute inset-x-0 bottom-0 flex max-h-[calc(100dvh-var(--nav-height)-0.75rem)] flex-col overflow-hidden rounded-t-3xl bg-white pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-2xl motion-reduce:transition-none"
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
          <ChartBody {...props} scrollTabs />
        </div>
      </div>
    </div>
  );
}
