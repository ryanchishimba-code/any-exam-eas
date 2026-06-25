"use client";

import { BookOpen, Pill, X } from "lucide-react";
import type { DrugSearchHit } from "@/lib/drugs300/search";
import { TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import { enrichDrug } from "@/lib/drugs300/enrichment";
import { DrugClinicalBridge } from "@/components/anatomy/DrugClinicalBridge";
import { DrugPearlsPanel } from "@/components/study/DrugPearlsPanel";

type Props = {
  drug: DrugSearchHit;
  onClose: () => void;
};

export function DrugSearchPreview({ drug, onClose }: Props) {
  const entry = TOP_500_DRUGS.find((d) => d.id === drug.id);
  const enrichment = entry ? enrichDrug(entry) : null;

  return (
    <div className="aee-drug-search-preview">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: drug.drugClassColor }}
              aria-hidden
            />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-700">
              {drug.drugClassLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.625rem] font-bold tabular-nums text-slate-500">
              #{drug.rank}
            </span>
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            {drug.generic}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{drug.brand}</p>
          <p className="mt-1 text-sm text-slate-500">
            {drug.therapeuticClass}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          aria-label="Close drug preview"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {entry && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-teal-700">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Indications
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {entry.indications}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-amber-700">
              <Pill className="h-3.5 w-3.5" aria-hidden />
              Key side effects
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {entry.sideEffects}
            </p>
          </div>
        </div>
      )}

      {entry?.mnemonic && (
        <p className="mt-4 rounded-xl border border-dashed border-teal-200 bg-teal-50/60 px-4 py-3 text-sm text-teal-900">
          <span className="font-semibold">Mnemonic: </span>
          {entry.mnemonic}
        </p>
      )}

      {enrichment && (
        <div className="mt-4">
          <DrugPearlsPanel enrichment={enrichment} variant="light" />
        </div>
      )}

      <DrugClinicalBridge drugId={drug.id} collapsible />
    </div>
  );
}
