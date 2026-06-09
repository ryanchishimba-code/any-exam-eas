"use client";

import Link from "next/link";
import { ArrowRight, Check, HeartPulse, Pill, Scale, Stethoscope, type LucideIcon } from "lucide-react";
import { studyHubMpjeHref } from "@/lib/study-hub/config";
import {
  formatMonthlyPrice,
  formatTrialEntryPrice,
  formatTrialLabel,
} from "@/lib/site";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";

const exams: { id: string; title: string; href: string; icon: LucideIcon; benefit: string }[] = [
  {
    id: "nclex",
    title: "NCLEX",
    href: "/study/practice?field=nursing&mode=bank",
    icon: HeartPulse,
    benefit: "NGN cases, SATA & prioritization",
  },
  {
    id: "usmle",
    title: "USMLE",
    href: "/study/practice?field=usmle-step-2&mode=bank",
    icon: Stethoscope,
    benefit: "Clinical vignettes & management",
  },
  {
    id: "naplex",
    title: "NAPLEX",
    href: "/study/practice?field=pharmacy&mode=bank",
    icon: Pill,
    benefit: "Calculations & therapeutics",
  },
  {
    id: "mpje",
    title: "MPJE",
    href: studyHubMpjeHref(),
    icon: Scale,
    benefit: "Uniform & state pharmacy law",
  },
];

const subscriberValue = [
  {
    title: "Adaptive weak-area practice",
    detail: "Sessions prioritize topics you miss based on in-app attempt history.",
  },
  {
    title: "OER-backed rationales",
    detail: "Explanations grounded in Open RN, OpenStax, and official board outlines.",
  },
  {
    title: "Affordable full access",
    detail: `${formatTrialEntryPrice()} to start · payment required · ${formatMonthlyPrice()}/mo after trial — all four exams, no $99+ bundles.`,
  },
];

export function LandingEssentials() {
  return (
    <section
      id="essentials"
      className="aee-landing-section-compact border-y border-black/[0.04] bg-white"
      aria-labelledby="essentials-heading"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
            One subscription. Four exams.
          </p>
          <h2 id="essentials-heading" className="aee-headline mt-2 text-2xl sm:text-3xl">
            Everything you need for board exam prep.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            NCLEX, USMLE, NAPLEX, and MPJE — plus Top 500 Drugs and progress that
            follows you across devices.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {exams.map(({ id, title, href, icon: Icon, benefit }) => (
            <li key={id}>
              <Link
                href={href}
                className="aee-exam-chip group flex h-full flex-col rounded-2xl border border-black/[0.06] bg-[#fbfbfd] p-4 transition hover:border-teal-200 hover:bg-teal-50/50 hover:shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <span className="mt-3 font-semibold text-[var(--color-ink)] group-hover:text-teal-800">
                  {title}
                </span>
                <span className="mt-1 text-xs text-slate-500">{benefit}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {subscriberValue.map(({ title, detail }) => (
            <li
              key={title}
              className="rounded-xl border border-black/[0.05] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
            >
              <p className="font-semibold text-[var(--color-ink)]">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{detail}</p>
            </li>
          ))}
        </ul>

        <div className="aee-essentials-price mt-10 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="aee-value-badge">Best value</span>
              <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {formatTrialEntryPrice()}
              </p>
              <p className="mt-1 text-teal-100">
                {formatTrialLabel()} — NCLEX, USMLE, NAPLEX & MPJE, then {formatMonthlyPrice()}/mo
              </p>
              <p className="mt-2 text-sm text-teal-200/90">
                Start today. Build familiarity with board-style items before your test date.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <ul className="space-y-2 text-sm text-teal-50">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  {MARKETING_QUESTION_COUNTS.total} board-style questions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Top 500 Drugs mastery track
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  State-specific MPJE support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Cancel anytime — no phone call
                </li>
              </ul>
              <Link
                href="/signup?plan=trial"
                className="aee-btn-hero-xl aee-btn-hero-light group inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                Start {formatTrialLabel()}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Built for nursing, medical, and pharmacy students preparing for NCLEX, USMLE,
          NAPLEX, and MPJE.
        </p>
      </div>
    </section>
  );
}
