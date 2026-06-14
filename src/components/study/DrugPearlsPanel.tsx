"use client";

import { ExternalLink, Stethoscope } from "lucide-react";
import type { EnrichedDrugView } from "@/lib/drugs300/enrichment";

type Props = {
  enrichment: EnrichedDrugView;
  /** Dark flashcard back vs light preview panel */
  variant?: "light" | "dark";
};

export function DrugPearlsPanel({ enrichment, variant = "light" }: Props) {
  const dark = variant === "dark";
  const hasContent =
    enrichment.mechanism ||
    enrichment.pearls.length > 0 ||
    enrichment.counseling ||
    enrichment.monitoring ||
    enrichment.contraindications ||
    enrichment.guidelines.length > 0;

  if (!hasContent) return null;

  const sectionLabel = dark
    ? "text-[0.625rem] font-bold uppercase tracking-wider text-cyan-200/75"
    : "text-[0.625rem] font-bold uppercase tracking-wider text-teal-700";
  const bodyText = dark ? "text-sm leading-relaxed text-teal-50/95" : "text-sm leading-relaxed text-slate-700";
  const boxBg = dark ? "rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm" : "rounded-xl border border-slate-200/80 bg-slate-50/80 p-3";

  return (
    <div className="space-y-4">
      {enrichment.mechanism && (
        <div>
          <p className={sectionLabel}>Mechanism</p>
          <p className={`mt-1 ${bodyText}`}>{enrichment.mechanism}</p>
        </div>
      )}

      {enrichment.pearls.length > 0 && (
        <div className={boxBg}>
          <p className={`flex items-center gap-1.5 ${sectionLabel}`}>
            <Stethoscope className="h-3.5 w-3.5" aria-hidden />
            High-yield pearls
          </p>
          <ul className={`mt-2 list-disc space-y-1.5 pl-4 ${bodyText}`}>
            {enrichment.pearls.map((pearl) => (
              <li key={pearl}>{pearl}</li>
            ))}
          </ul>
        </div>
      )}

      {enrichment.counseling && (
        <div>
          <p className={sectionLabel}>Patient counseling</p>
          <p className={`mt-1 ${bodyText}`}>{enrichment.counseling}</p>
        </div>
      )}

      {enrichment.monitoring && (
        <div>
          <p className={sectionLabel}>Monitoring</p>
          <p className={`mt-1 ${bodyText}`}>{enrichment.monitoring}</p>
        </div>
      )}

      {enrichment.contraindications && (
        <div>
          <p className={dark ? "text-[0.625rem] font-bold uppercase tracking-wider text-rose-200/80" : "text-[0.625rem] font-bold uppercase tracking-wider text-rose-700"}>
            Key contraindications
          </p>
          <p className={`mt-1 ${bodyText}`}>{enrichment.contraindications}</p>
        </div>
      )}

      {enrichment.guidelines.length > 0 && (
        <div>
          <p className={sectionLabel}>Guideline sources</p>
          <ul className="mt-2 space-y-1.5">
            {enrichment.guidelines.map((g) => (
              <li key={g.label}>
                {g.url ? (
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-sm font-medium underline-offset-2 hover:underline ${dark ? "text-cyan-200" : "text-teal-700"}`}
                  >
                    {g.label}
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                  </a>
                ) : (
                  <span className={bodyText}>{g.label}</span>
                )}
                {g.citation && (
                  <p className={`mt-0.5 text-xs ${dark ? "text-teal-100/70" : "text-slate-500"}`}>
                    {g.citation}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className={`mt-2 text-[0.6875rem] leading-snug ${dark ? "text-teal-100/60" : "text-slate-500"}`}>
            {enrichment.guidelineNote}
          </p>
        </div>
      )}
    </div>
  );
}
