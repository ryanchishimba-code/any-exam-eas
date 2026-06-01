"use client";

import Link from "next/link";
import { ArrowRight, Check, HeartPulse, Pill, Stethoscope, type LucideIcon } from "lucide-react";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

const exams: { id: string; title: string; href: string; icon: LucideIcon; benefit: string }[] = [
  {
    id: "nclex",
    title: "NCLEX NGN",
    href: "/study?field=nursing",
    icon: HeartPulse,
    benefit: "Bow-tie, matrix & case studies",
  },
  {
    id: "usmle",
    title: "USMLE",
    href: "/study?field=medicine",
    icon: Stethoscope,
    benefit: "Step 1 & 2 CK vignettes",
  },
  {
    id: "naplex",
    title: "NAPLEX",
    href: "/study?field=pharmacy",
    icon: Pill,
    benefit: "Calculations & therapeutics",
  },
];

const subscriberValue = [
  {
    title: "Study what you miss",
    detail: "Adaptive engine prioritizes weak topics so every minute counts.",
  },
  {
    title: "Real exam formats",
    detail: "NGN items, clinical vignettes, and pharm scenarios — not generic quizzes.",
  },
  {
    title: "Less than legacy banks",
    detail: `${formatTrialIntroPrice()} to start · ${formatMonthlyPrice()}/mo after — no $99+ upfront.`,
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
            Why students subscribe
          </p>
          <h2 id="essentials-heading" className="aee-headline mt-2 text-2xl sm:text-3xl">
            More prep. Less wasted time.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            One subscription covers NCLEX NGN, USMLE, and NAPLEX — with progress
            that follows you across devices.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
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
                {formatTrialIntroPrice()}
              </p>
              <p className="mt-1 text-teal-100">
                {formatTrialLabel()} full access, then {formatMonthlyPrice()}/mo
              </p>
              <p className="mt-2 text-sm text-teal-200/90">
                Start today — lock in intro pricing before your next study session slips.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <ul className="space-y-2 text-sm text-teal-50">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  130K+ board-style questions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Adaptive weak-area targeting
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
          Trusted by nursing, medical, and pharmacy students preparing for licensure exams.
        </p>
      </div>
    </section>
  );
}
