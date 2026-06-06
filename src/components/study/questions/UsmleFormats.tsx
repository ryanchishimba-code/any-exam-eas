"use client";

import type { SequentialSetContext } from "@/lib/questions/sequential-sets";
import { getSequentialPayload } from "@/lib/questions/sequential-sets";
import type { StudyQuestion } from "@/lib/questions/types";
import { BookOpen, ClipboardList, FileText, Pill, Stethoscope } from "lucide-react";
import { ExhibitTable } from "./NaplexFormats";

/** NBME-style scrollable clinical vignette (2026 shorter-block friendly). */
export function UsmleCaseVignette({ text }: { text: string }) {
  return (
    <div className="mb-4 max-h-52 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50/95 px-4 py-3 sm:max-h-64">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        <Stethoscope className="h-3 w-3" aria-hidden />
        Clinical vignette
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">{text}</p>
    </div>
  );
}

export function SequentialItemBanner({
  question,
  context,
}: {
  question: StudyQuestion;
  context?: SequentialSetContext | null;
}) {
  const payload = getSequentialPayload(question);
  const stepIndex = context?.stepIndex ?? payload?.stepIndex;
  const totalSteps = context?.totalSteps ?? payload?.totalSteps;
  const priorStepUnanswered = context?.priorStepUnanswered ?? false;

  if (!stepIndex || !totalSteps || totalSteps < 2) return null;

  return (
    <div className="mb-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-indigo-200/80 bg-indigo-50/70 px-3 py-2 text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Sequential item set — Question {stepIndex} of {totalSteps}
            <span className="text-indigo-700/80"> (same patient scenario)</span>
          </span>
        </div>
        <div className="flex items-center gap-1" aria-label="Set progress">
          {Array.from({ length: totalSteps }, (_, i) => {
            const n = i + 1;
            const active = n === stepIndex;
            const done = n < stepIndex;
            return (
              <span
                key={n}
                className={`h-2 w-2 rounded-full ${
                  active
                    ? "bg-indigo-600 ring-2 ring-indigo-300"
                    : done
                      ? "bg-indigo-400"
                      : "bg-indigo-200"
                }`}
                title={`Question ${n} of ${totalSteps}`}
              />
            );
          })}
        </div>
      </div>

      {priorStepUnanswered && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Answer question {stepIndex - 1} in this set first for the best Step 2 CK experience — items
          build on the same case.
        </p>
      )}

      {stepIndex > 1 && context?.vignette && (
        <p className="text-[11px] text-indigo-800/90">
          Scenario continues from the prior question in this set.
        </p>
      )}
    </div>
  );
}

export function AbstractBlock({ question }: { question: StudyQuestion }) {
  const abs = (question.ngnPayload as { abstract?: { title: string; source: string; body: string } })
    ?.abstract;
  if (!abs) return null;
  return (
    <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-slate-300 bg-white px-4 py-3 shadow-sm">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <BookOpen className="h-3 w-3" aria-hidden />
        Journal abstract
      </div>
      <p className="text-sm font-semibold text-slate-900">{abs.title}</p>
      <p className="mt-0.5 text-xs italic text-slate-600">{abs.source}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{abs.body}</p>
    </div>
  );
}

export function DrugAdBlock({ question }: { question: StudyQuestion }) {
  const ad = (
    question.ngnPayload as {
      ad?: { drug: string; headline: string; indications: string; warnings: string };
    }
  )?.ad;
  if (!ad) return null;
  return (
    <div className="mb-4 rounded-lg border-2 border-amber-200/90 bg-amber-50/40 px-4 py-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
        <Pill className="h-3 w-3" aria-hidden />
        Pharmaceutical advertisement
      </div>
      <p className="text-base font-bold text-slate-900">{ad.drug}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{ad.headline}</p>
      <p className="mt-2 text-xs text-slate-700">
        <span className="font-semibold">Indications:</span> {ad.indications}
      </p>
      <p className="mt-2 rounded border border-rose-200 bg-rose-50/80 px-2 py-1.5 text-xs font-medium text-rose-900">
        {ad.warnings}
      </p>
    </div>
  );
}

export function CcsPromptPanel({ question }: { question: StudyQuestion }) {
  const data = (
    question.ngnPayload as {
      caseData?: { setting: string; presentation: string; vitals: string; timeline: string };
    }
  )?.caseData;
  if (!data) return null;
  return (
    <div className="mb-4 rounded-xl border border-teal-200 bg-gradient-to-b from-teal-50/80 to-white p-4">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-800">
        <FileText className="h-3 w-3" aria-hidden />
        Step 3 — Case simulation (CCS-style)
      </div>
      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase text-teal-700/80">Setting</dt>
          <dd className="text-slate-800">{data.setting}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-teal-700/80">Presentation</dt>
          <dd className="text-slate-800">{data.presentation}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-teal-700/80">Vitals</dt>
          <dd className="font-mono text-slate-800">{data.vitals}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-teal-700/80">Timeline</dt>
          <dd className="text-slate-800">{data.timeline}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-teal-900/80">
        Select the single best next management step — as in Day 2 CCS order prioritization.
      </p>
    </div>
  );
}

export function UsmleExhibitBlock({ question }: { question: StudyQuestion }) {
  const kind = question.ngnPayload?.kind;
  if (kind === "exhibit" || kind === "biostats") {
    return <ExhibitTable question={question} />;
  }
  return null;
}

export function isUsmleField(field?: string): boolean {
  return Boolean(
    field &&
      (field.startsWith("usmle") || field === "usmle-step-1" || field === "usmle-step-2" || field === "usmle-step-3")
  );
}
