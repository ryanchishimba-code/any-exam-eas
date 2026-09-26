"use client";

import { useMemo, useState } from "react";
import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import { SourcesDisclosure } from "@/components/ngn/SourcesDisclosure";
import { explainPointsLost, score } from "@/lib/assessment/scoring/registry";
import type { NgnItem, NgnReference, SourceRef } from "@/lib/assessment/types";

type RationalePanelProps = {
  item: NgnItem;
  response: unknown;
  sourcesById: Record<string, Pick<SourceRef, "title" | "url"> | undefined>;
  caseReferences?: NgnReference[];
};

function verdictChip(verdict: string | string[]): { label: string; className: string } {
  if (verdict === "key") {
    return { label: "Key", className: "bg-[#0A2540] text-white" };
  }
  if (verdict === "distractor") {
    return { label: "Not the key", className: "bg-white text-[#0A2540] ring-1 ring-[#0A2540]/20" };
  }
  const label = Array.isArray(verdict) ? verdict.join(", ") : verdict;
  return { label, className: "bg-[#E5FBF9] text-[#0A2540] ring-1 ring-[#00D4C8]/50" };
}

function lineTone(line: string): string {
  if (line.startsWith("+1")) return "text-[#0A2540]";
  if (line.startsWith("-1")) return "text-[#9f1239]";
  return "text-[#334155]";
}

export function RationalePanel({ item, response, sourcesById, caseReferences }: RationalePanelProps) {
  const [open, setOpen] = useState(false);
  const earned = useMemo(() => {
    try {
      return score(item, response);
    } catch {
      return 0;
    }
  }, [item, response]);
  const lines = useMemo(() => explainPointsLost(item, response), [item, response]);
  const perOption = item.rationale.expanded.perOption;

  return (
    <section className="rounded-3xl border border-[#e2e8f0] bg-[#f7fbfb] p-5 sm:p-6" aria-label="Rationale">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A2540]">Rationale</p>
      <p className="mt-3 text-[17px] leading-7 text-[#0A2540]">{item.rationale.short}</p>
      <div className="mt-5">
        <SourcesDisclosure
          itemReferences={item.references}
          caseReferences={caseReferences}
          sourcesById={sourcesById}
        />
      </div>
      <button
        type="button"
        className={`mt-4 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-medium text-[#0A2540] ring-1 ring-[#e2e8f0] ${ngnFocus}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Show less" : "Show more"}
      </button>
      {open ? (
        <div className="mt-5 space-y-6">
          <ul className="space-y-3">
            {Object.entries(perOption).map(([id, entry]) => {
              const chip = verdictChip(entry.verdict);
              return (
                <li key={id} className="rounded-2xl bg-white p-4 ring-1 ring-[#e2e8f0]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#334155]">{id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${chip.className}`}>
                      {chip.label}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-6 text-[#0A2540]">{entry.text}</p>
                </li>
              );
            })}
          </ul>

          <div>
            <p className="text-[17px] font-semibold text-[#0A2540]">
              Points: earned {earned} of {item.maxPoints}
            </p>
            <p className={`mt-1 text-sm leading-6 ${ngnMuted}`}>{item.rationale.expanded.pointsLost}</p>
            {lines.length > 0 ? (
              <ul className="mt-3 space-y-1 font-mono text-sm leading-6">
                {lines.map((line) => (
                  <li key={line} className={lineTone(line)}>
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A2540]">
              Clinical judgment
            </p>
            <p className="mt-2 text-[15px] leading-6 text-[#0A2540]">{item.rationale.expanded.cjmmCoaching}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A2540]">Takeaway</p>
            <p className="mt-2 text-[15px] leading-6 text-[#0A2540]">{item.rationale.expanded.takeaway}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
