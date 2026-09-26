"use client";

import { useEffect, useState } from "react";
import { ChartPanel, ChartSheet } from "@/components/ngn/ChartPanel";
import { ItemRenderer } from "@/components/ngn/ItemRenderer";
import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import { NCLEX_RN_2026_PROFILE } from "@/lib/assessment/profiles/nclex-rn-2026";
import type { NgnCase, NgnItem, SourceRef } from "@/lib/assessment/types";

type CaseStudyPlayerProps = {
  caseDoc: NgnCase;
  items?: NgnItem[];
  mode: "exam" | "review";
  attemptSeed?: string;
  initialStep?: number;
  sourcesById?: Record<string, Pick<SourceRef, "title" | "url">>;
};

function sexLabel(sex: string): string {
  if (!sex) return "";
  return sex.charAt(0).toUpperCase() + sex.slice(1);
}

export function CaseStudyPlayer({
  caseDoc,
  items,
  mode,
  attemptSeed = "preview",
  initialStep = 0,
  sourcesById = {},
}: CaseStudyPlayerProps) {
  const ordered = [...(items ?? caseDoc.items)].sort((a, b) => (a.caseStep ?? 0) - (b.caseStep ?? 0));
  const [step, setStep] = useState(() => Math.min(Math.max(initialStep, 0), Math.max(ordered.length - 1, 0)));
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [chartOpen, setChartOpen] = useState(false);
  const [showRationale, setShowRationale] = useState(false);
  const [large, setLarge] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(min-width: 1024px)");
    const apply = () => setLarge(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const item = ordered[step];
  if (!item) return null;
  const timepoint = caseDoc.timepoints.find((entry) => entry.id === item.timepoint);
  const stepMeta = NCLEX_RN_2026_PROFILE.stepTaxonomy.find((entry) => entry.step === item.caseStep);
  const patient = caseDoc.patient;
  const knownAllergy = patient.allergies && !/no known/i.test(patient.allergies);

  const chart = (
    <ChartPanel chart={caseDoc.chart} timepoints={caseDoc.timepoints} currentTimepoint={item.timepoint ?? ""} />
  );

  return (
    <div className="text-[#0A2540]">
      <header className="rounded-3xl bg-[#0A2540] px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D4C8]">Client</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">{patient.displayName}</h2>
          <p className="text-sm text-white/90">
            {patient.age} years · {sexLabel(patient.sex)} · {patient.weightKg} kg
          </p>
        </div>
        <p className="mt-3 text-sm leading-6">
          <span className="font-semibold">Allergies</span>
          <span className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 ${knownAllergy ? "bg-white text-[#0A2540]" : "bg-white/10 text-white"}`}>
            {patient.allergies}
          </span>
        </p>
      </header>

      <ol className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Clinical judgment steps">
        {ordered.map((entry, index) => {
          const meta = NCLEX_RN_2026_PROFILE.stepTaxonomy.find((stepEntry) => stepEntry.step === entry.caseStep);
          const current = index === step;
          const locked = mode === "exam" && index !== step;
          return (
            <li key={entry.id} className="shrink-0">
              <button
                type="button"
                disabled={locked}
                aria-current={current ? "step" : undefined}
                className={`min-h-11 rounded-full px-3 text-left text-sm motion-reduce:transition-none ${ngnFocus} ${
                  current
                    ? "bg-[#0A2540] text-white"
                    : "bg-white text-[#0A2540] ring-1 ring-[#e2e8f0] disabled:text-[#334155]"
                }`}
                onClick={() => {
                  if (!locked) setStep(index);
                }}
              >
                <span className="font-semibold">{entry.caseStep}</span> {meta?.label ?? "Step"}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 lg:grid lg:grid-cols-2 lg:gap-5">
        {large ? <div className="min-h-[28rem]">{chart}</div> : null}
        <section className="rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6" aria-label="Question">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#334155]">
            {stepMeta?.label}
            {timepoint ? ` · ${timepoint.label}` : ""}
          </p>
          <h3 className="mt-3 text-[19px] font-semibold leading-7 tracking-tight">{item.stem}</h3>
          <div className="mt-5">
            <ItemRenderer
              item={item}
              seed={`${attemptSeed}:${item.id}`}
              response={responses[item.id]}
              onChange={(next) => setResponses((current) => ({ ...current, [item.id]: next }))}
              showRationale={mode === "review" && showRationale}
              sourcesById={sourcesById}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {mode === "review" ? (
              <button
                type="button"
                className={`min-h-11 rounded-full bg-[#0A2540] px-4 text-sm font-medium text-white ${ngnFocus}`}
                aria-pressed={showRationale}
                onClick={() => setShowRationale((value) => !value)}
              >
                {showRationale ? "Hide rationale" : "Show rationale"}
              </button>
            ) : null}
            {mode === "exam" && step < ordered.length - 1 ? (
              <button
                type="button"
                className={`min-h-11 rounded-full bg-[#0A2540] px-4 text-sm font-medium text-white ${ngnFocus}`}
                onClick={() => setStep((value) => value + 1)}
              >
                Next
              </button>
            ) : null}
            {mode === "exam" && step === ordered.length - 1 ? (
              <p className={`text-sm ${ngnMuted}`}>Last question in this case. Earlier questions stay closed.</p>
            ) : null}
            {mode === "exam" && step > 0 ? (
              <p className={`text-sm ${ngnMuted}`}>You cannot go back.</p>
            ) : null}
          </div>
        </section>
      </div>

      {large ? null : (
        <>
          <button
            type="button"
            className={`fixed bottom-4 left-1/2 z-30 min-h-11 -translate-x-1/2 rounded-full bg-[#0A2540] px-5 text-sm font-medium text-white shadow-lg motion-reduce:transition-none ${ngnFocus}`}
            aria-expanded={chartOpen}
            onClick={() => setChartOpen(true)}
          >
            Client chart
          </button>
          <ChartSheet
            open={chartOpen}
            onClose={() => setChartOpen(false)}
            chart={caseDoc.chart}
            timepoints={caseDoc.timepoints}
            currentTimepoint={item.timepoint ?? ""}
          />
        </>
      )}
    </div>
  );
}
