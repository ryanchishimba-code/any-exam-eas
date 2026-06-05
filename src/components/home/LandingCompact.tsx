"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CircleDollarSign,
  HeartPulse,
  Layers,
  Lightbulb,
  MapPin,
  Minus,
  Pill,
  Scale,
  Stethoscope,
  Tags,
  Target,
} from "lucide-react";
import { DRUG_CLASSES } from "@/lib/drugs300/drug-classes";
import { studyHubMpjeHref } from "@/lib/study-hub/config";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

const EXAMS = [
  { id: "nclex", label: "NCLEX", href: "/study/practice?field=nursing&mode=bank", icon: HeartPulse, color: "#0d9488" },
  { id: "usmle", label: "USMLE", href: "/study/practice?field=usmle-step-1&mode=bank", icon: Stethoscope, color: "#2563eb" },
  { id: "naplex", label: "NAPLEX", href: "/study/practice?field=pharmacy&mode=bank", icon: Pill, color: "#7c3aed" },
  { id: "mpje", label: "MPJE", href: studyHubMpjeHref(), icon: Scale, color: "#d97706" },
] as const;

const BENEFITS = [
  { icon: Brain, label: "Adaptive AI" },
  { icon: CircleDollarSign, label: "Affordable" },
  { icon: BookOpen, label: "OER rationales" },
  { icon: MapPin, label: "State MPJE" },
  { icon: Layers, label: "130K+ questions" },
] as const;

const COMPARE_ROWS = [
  { us: `${formatTrialIntroPrice()} trial`, them: "$99+ upfront" },
  { us: "NCLEX · USMLE · NAPLEX · MPJE", them: "Per-exam pricing" },
  { us: "Top 500 Drugs + Adaptive AI", them: "Add-ons & scattered banks" },
] as const;

const DRUG_CLASSES_PREVIEW = DRUG_CLASSES.filter((c) => c.id !== "all").slice(0, 6);

export function LandingCompact() {
  return (
    <div className="aee-landing-compact">
      {/* Exam coverage + benefits */}
      <section
        id="choose-exam"
        className="aee-landing-compact-section border-b border-slate-100 bg-white"
        aria-labelledby="landing-exams-heading"
      >
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
          <h2 id="landing-exams-heading" className="sr-only">
            Exam coverage and benefits
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {EXAMS.map((exam) => {
              const Icon = exam.icon;
              return (
                <li key={exam.id}>
                  <Link
                    href={exam.href}
                    className="aee-landing-exam-chip group"
                    aria-label={`Start ${exam.label} prep`}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-black/[0.04]"
                      style={{ color: exam.color }}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                      {exam.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Icon className="h-3.5 w-3.5 text-teal-600" strokeWidth={2} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Top 500 + comparison */}
      <section
        className="aee-landing-compact-section border-b border-slate-100 bg-slate-50/60"
        aria-labelledby="landing-drugs-heading"
      >
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            {/* Top 500 infographic — compact */}
            <article
              id="top-500-drugs"
              className="aee-landing-panel aee-landing-drugs-panel"
              aria-labelledby="landing-drugs-heading"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
                    Pharmacology mastery
                  </p>
                  <h2 id="landing-drugs-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                    Top 500 Drugs
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    One deck · NCLEX · USMLE · NAPLEX
                  </p>
                </div>
                <div className="aee-landing-drugs-hub shrink-0" aria-hidden>
                  <span className="text-2xl font-black text-teal-700">500</span>
                </div>
              </div>

              <ul className="mt-3 grid grid-cols-6 gap-1.5">
                {DRUG_CLASSES_PREVIEW.map((cls) => (
                  <li key={cls.id} title={cls.label}>
                    <span
                      className="block h-1.5 rounded-full"
                      style={{ backgroundColor: cls.color }}
                      aria-hidden
                    />
                    <span className="mt-1 block truncate text-[0.5625rem] font-bold text-slate-500">
                      {cls.shortLabel}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                <p className="text-sm font-semibold text-slate-900">
                  Lisinopril <span className="font-normal text-slate-400">· Prinivil®</span>
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.625rem] text-slate-600">
                  <li className="inline-flex items-center gap-1">
                    <Tags className="h-3 w-3 text-sky-500" aria-hidden />
                    Generic + brand
                  </li>
                  <li className="inline-flex items-center gap-1">
                    <Target className="h-3 w-3 text-teal-500" aria-hidden />
                    Indications
                  </li>
                  <li className="inline-flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-violet-500" aria-hidden />
                    Mnemonics
                  </li>
                </ul>
              </div>

              <Link
                href="/study/drugs300"
                className="aee-landing-inline-cta group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
              >
                Master the most prescribed medications
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </article>

            {/* Comparison — compact */}
            <article
              id="how-we-compare"
              className="aee-landing-panel"
              aria-labelledby="compare-heading"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
                Why students choose us
              </p>
              <h2 id="compare-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Four exams.{" "}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  A fraction of the cost.
                </span>
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <div>
                  <p className="text-[0.625rem] font-bold uppercase text-teal-700">Any Exam Easy</p>
                  <p className="text-2xl font-black text-teal-700">{formatTrialIntroPrice()}</p>
                  <p className="text-[0.625rem] text-slate-500">
                    {formatTrialLabel()}, then {formatMonthlyPrice()}/mo
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.625rem] font-bold uppercase text-slate-400">Typical</p>
                  <p className="text-2xl font-black text-slate-300 line-through">$99+</p>
                  <p className="text-[0.625rem] text-slate-400">Bundled plans</p>
                </div>
              </div>

              <ul className="mt-3 space-y-2" role="list">
                {COMPARE_ROWS.map(({ us, them }) => (
                  <li key={us} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                      {us}
                    </span>
                    <span className="text-[0.5625rem] font-bold uppercase text-slate-300">vs</span>
                    <span className="flex items-center justify-end gap-1.5 text-right text-slate-400">
                      {them}
                      <Minus className="h-3 w-3 shrink-0" aria-hidden />
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?plan=trial"
                className="aee-landing-inline-cta group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
              >
                Start {formatTrialLabel()} — {formatTrialIntroPrice()}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
