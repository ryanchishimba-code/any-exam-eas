"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, Pill, Scale, Stethoscope } from "lucide-react";
import { STUDY_HUB_EXAM_BANKS, studyHubMpjeHref } from "@/lib/study-hub/config";
import { examHref } from "@/lib/routes";
import { StudyHubMpjePicker } from "./StudyHubMpjePicker";
import { cn } from "@/lib/utils";

const EXAM_ICONS: Record<string, typeof Activity> = {
  nclex: Activity,
  usmle: Stethoscope,
  naplex: Pill,
  mpje: Scale,
};

export function StudyHubExamBanks() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mpjeOpen, setMpjeOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("exam") === "mpje") {
      setMpjeOpen(true);
      requestAnimationFrame(() => {
        document.getElementById("mpje-picker")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }, [searchParams]);

  function openMpje() {
    setMpjeOpen(true);
    router.replace(studyHubMpjeHref(), { scroll: false });
  }

  function closeMpje() {
    setMpjeOpen(false);
    router.replace("/study-hub", { scroll: false });
  }

  return (
    <section aria-labelledby="exam-banks-heading">
      <h2 id="exam-banks-heading" className="text-lg font-semibold text-slate-900">
        Question banks
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Pick your board — NCLEX, USMLE, NAPLEX, or MPJE.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STUDY_HUB_EXAM_BANKS.map((exam) => {
          const Icon = EXAM_ICONS[exam.slug] ?? Activity;
          const isMpje = exam.slug === "mpje";
          const isSelected = isMpje && mpjeOpen;

          if (isMpje) {
            return (
              <button
                key={exam.slug}
                type="button"
                onClick={() => (mpjeOpen ? closeMpje() : openMpje())}
                aria-expanded={mpjeOpen}
                aria-controls="mpje-picker"
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  exam.accentClass,
                  isSelected && "ring-2 ring-amber-500/50 ring-offset-2"
                )}
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-amber-700 shadow-sm">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{exam.label}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {exam.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)]">
                  {mpjeOpen ? "Hide options" : "Select exam type"}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      mpjeOpen ? "rotate-90" : "group-hover:translate-x-0.5"
                    )}
                    aria-hidden
                  />
                </span>
              </button>
            );
          }

          return (
            <Link
              key={exam.slug}
              href={examHref(exam.slug as "nclex" | "naplex" | "usmle" | "mpje")}
              onClick={() => setMpjeOpen(false)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                exam.accentClass
              )}
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-slate-700 shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{exam.label}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                {exam.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)]">
                Open bank
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          );
        })}
      </div>

      {mpjeOpen && (
        <div className="mt-5">
          <StudyHubMpjePicker onClose={closeMpje} />
        </div>
      )}
    </section>
  );
}
