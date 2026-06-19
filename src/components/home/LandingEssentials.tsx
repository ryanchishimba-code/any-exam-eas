"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  formatMonthlyPrice,
  formatTrialEntryPrice,
  formatTrialLabel,
} from "@/lib/site";
import { LANDING_PRICING_FEATURES } from "@/lib/landing/content";

const exams: { id: string; title: string; href: string; icon: LucideIcon; benefit: string }[] = [
  {
    id: "nclex",
    title: "NCLEX",
    href: "/question-bank?field=nursing",
    icon: HeartPulse,
    benefit: "Curated vignettes · NGN · SATA",
  },
  {
    id: "usmle",
    title: "USMLE",
    href: "/question-bank?field=usmle-step-2",
    icon: Stethoscope,
    benefit: "Clinical vignettes & management",
  },
  {
    id: "naplex",
    title: "NAPLEX",
    href: "/question-bank?field=pharmacy",
    icon: Pill,
    benefit: "Calculations & therapeutics",
  },
  {
    id: "pance",
    title: "PANCE",
    href: "/question-bank?field=pance",
    icon: HeartPulse,
    benefit: "NCCPA blueprint & exam roadmap",
  },
  {
    id: "aanp-fnp",
    title: "AANP FNP",
    href: "/question-bank?field=aanp-fnp",
    icon: UserRound,
    benefit: "Primary care · AANPCB blueprint",
  },
  {
    id: "npte-pt",
    title: "NPTE-PT",
    href: "/question-bank?field=npte-pt",
    icon: Activity,
    benefit: "FSBPT blueprint · PT clinicals",
  },
];

const subscriberValue = [
  {
    title: "Library & Memory Cards",
    detail: "Flip high-yield cards, track weak areas, and open Review Modules from one study home base.",
  },
  {
    title: "Curated, aligned question banks",
    detail: "Vignettes, stems, and answer choices QA-checked — with OER-backed CJMM rationales.",
  },
  {
    title: "Affordable full access",
    detail: `${formatTrialEntryPrice()} to start · payment required · ${formatMonthlyPrice()}/mo after trial — all six exams, no $99+ bundles.`,
  },
];

export function LandingEssentials() {
  return (
    <section
      id="essentials"
      className="aee-landing-section-compact border-y border-black/[0.04] bg-[var(--color-surface-elevated)]"
      aria-labelledby="essentials-heading"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
            One subscription. Six exams.
          </p>
          <h2 id="essentials-heading" className="aee-headline mt-2 text-2xl sm:text-3xl">
            Everything you need for board exam prep.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--color-ink-muted)]">
            NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — plus Library, Review Modules,
            Anatomy Studio, and Top 503 Drugs that follow you across devices.
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
                <span className="mt-1 text-xs text-[var(--color-ink-muted)]">{benefit}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {subscriberValue.map(({ title, detail }) => (
            <li
              key={title}
              className="rounded-xl border border-black/[0.05] bg-[var(--color-surface-elevated)] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
            >
              <p className="font-semibold text-[var(--color-ink)]">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">{detail}</p>
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
                {formatTrialLabel()} — all six boards, then {formatMonthlyPrice()}/mo
              </p>
              <p className="mt-2 text-sm text-teal-200/90">
                Start today. Build familiarity with board-style items before your test date.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <ul className="space-y-2 text-sm text-teal-50">
                {LANDING_PRICING_FEATURES.slice(0, 5).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                    {item}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Cancel before trial ends — no charge
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

        <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
          Built for nursing, medical, pharmacy, PA, and physical therapy students preparing for
          NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT.
        </p>
      </div>
    </section>
  );
}
