"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  HeartPulse,
  Layers,
  MapPin,
  Pill,
  Scale,
  Stethoscope,
} from "lucide-react";
import { LandingVisualSlot } from "@/components/home/LandingVisualSlot";
import { Top500DrugsVisual } from "@/components/home/Top500DrugsVisual";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
import { studyHubMpjeHref } from "@/lib/study-hub/config";
import { formatTrialCtaLabel, formatTrialHeroOffer } from "@/lib/site";

const EXAMS = [
  {
    id: "nclex",
    label: "NCLEX",
    blurb: "Next-Gen clinical judgment",
    href: "/study/practice?field=nursing&mode=bank",
    icon: HeartPulse,
    color: "#0d9488",
  },
  {
    id: "usmle",
    label: "USMLE",
    blurb: "Step 2 CK vignettes",
    href: "/study/practice?field=usmle-step-2&mode=bank",
    icon: Stethoscope,
    color: "#2563eb",
  },
  {
    id: "naplex",
    label: "NAPLEX",
    blurb: "Calculations & cases",
    href: "/study/practice?field=pharmacy&mode=bank",
    icon: Pill,
    color: "#7c3aed",
  },
  {
    id: "mpje",
    label: "MPJE",
    blurb: "Federal + state law",
    href: studyHubMpjeHref(),
    icon: Scale,
    color: "#d97706",
  },
] as const;

const VALUE_PILLARS = [
  {
    icon: Layers,
    title: `${MARKETING_QUESTION_COUNTS.total} board-style items`,
    detail: "Large stratified banks across nursing, medicine, and pharmacy fields.",
  },
  {
    icon: Brain,
    title: "Adaptive practice",
    detail: "Sessions weight topics you miss so review time goes further.",
  },
  {
    icon: BookOpen,
    title: "OER-backed rationales",
    detail: "Explanations tied to open educational sources — not black-box memorization.",
  },
  {
    icon: MapPin,
    title: "State MPJE drills",
    detail: "Uniform multistate or state-specific pharmacy law when you need it.",
  },
] as const;

export function LandingCompact() {
  return (
    <div className="aee-landing-compact">
      {/* Exam coverage */}
      <section
        id="choose-exam"
        className="aee-landing-compact-section scroll-mt-24 border-b border-slate-100 bg-white"
        aria-labelledby="landing-exams-heading"
      >
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
          <div className="mb-4 max-w-2xl">
            <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
              All included in one plan
            </p>
            <h2
              id="landing-exams-heading"
              className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              Switch exams anytime — pay once, study everything.
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Pick your primary board in the app, then jump between NCLEX, USMLE, NAPLEX, and MPJE
              without buying separate question banks.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {EXAMS.map((exam) => {
              const Icon = exam.icon;
              return (
                <li key={exam.id}>
                  <Link
                    href={exam.href}
                    className="aee-landing-exam-chip group h-full flex-col items-start sm:flex-row sm:items-center"
                    aria-label={`Preview ${exam.label} practice`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-black/[0.04]"
                      style={{ color: exam.color }}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-900 group-hover:text-teal-700">
                        {exam.label}
                      </span>
                      <span className="block text-[0.625rem] font-medium text-slate-500">
                        {exam.blurb}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PILLARS.map(({ icon: Icon, title, detail }) => (
              <li
                key={title}
                className="flex gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-black/[0.04]">
                  <Icon className="h-4 w-4 text-teal-600" strokeWidth={2} aria-hidden />
                </span>
                <span>
                  <p className="text-xs font-semibold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-[0.6875rem] leading-snug text-slate-500">{detail}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Top 500 + pricing */}
      <section
        className="aee-landing-compact-section border-b border-slate-100 bg-slate-50/60"
        aria-labelledby="landing-drugs-heading"
      >
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
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
                  <h2
                    id="landing-drugs-heading"
                    className="mt-1 text-xl font-bold tracking-tight text-slate-900"
                  >
                    Top 500 Drugs
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    High-yield flashcards for NCLEX, USMLE, and NAPLEX — generic, brand, MOA, and
                    adverse effects in one deck.
                  </p>
                </div>
                <div className="aee-landing-drugs-hub shrink-0" aria-hidden>
                  <span className="text-2xl font-black text-teal-700">500</span>
                </div>
              </div>

              <Top500DrugsVisual variant="panel" className="mt-3" />

              <Link
                href="/study/drugs300"
                className="aee-landing-inline-cta group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
              >
                Open the Top 500 deck
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </article>

            <article
              id="landing-pricing-teaser"
              className="aee-landing-panel flex flex-col"
              aria-labelledby="pricing-teaser-heading"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
                Simple pricing
              </p>
              <h2
                id="pricing-teaser-heading"
                className="mt-1 text-xl font-bold tracking-tight text-slate-900"
              >
                Start free.{" "}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Study all four boards.
                </span>
              </h2>
              <p className="mt-1.5 text-xs text-slate-600">
                {formatTrialHeroOffer()} — no per-exam upgrade fees.
              </p>

              <LandingVisualSlot
                visualId="pricing-value-stack"
                fit="contain"
                className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.04]"
              />

              <div className="mt-auto pt-4">
                <Link
                  href="/signup?plan=trial"
                  className="aee-btn-hero-xl group inline-flex w-full items-center justify-center gap-2"
                >
                  {formatTrialCtaLabel()}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="#how-we-compare"
                  className="mt-3 block text-center text-xs font-semibold text-teal-700 hover:text-teal-600"
                >
                  See how we compare to UWorld &amp; others →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
