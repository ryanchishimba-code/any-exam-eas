"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus } from "lucide-react";
import {
  formatMonthlyPrice,
  formatTrialLabel,
  formatTrialTodayPrice,
} from "@/lib/site";

const competitorNames = ["UWorld", "Archer Review", "SimpleNursing"];

const rows = [
  { label: "Starting cost", us: `${formatTrialTodayPrice()} · payment at checkout`, them: "$99–329+ upfront" },
  { label: "Monthly", us: `${formatMonthlyPrice()}/mo after trial`, them: "$39–89+/mo tiers" },
  { label: "Exam coverage", us: "NCLEX · USMLE · NAPLEX · MPJE", them: "Often per-exam pricing" },
  { label: "Top 500 drugs", us: "Dedicated mastery", them: "Scattered in banks" },
  { label: "Adaptive practice", us: "Weak-area targeting built in", them: "Limited / add-on" },
  { label: "MPJE prep", us: "Uniform + state-specific", them: "Rare or generic only" },
  { label: "Rationales", us: "OER-backed (Open RN, OpenStax)", them: "Proprietary only" },
] as const;

const overlapRows = rows.slice(0, 4);

type HowWeCompareProps = {
  variant?: "default" | "hero-overlap";
};

export function HowWeCompare({ variant = "default" }: HowWeCompareProps) {
  const isOverlap = variant === "hero-overlap";
  const visibleRows = isOverlap ? overlapRows : rows;

  return (
    <section
      id="how-we-compare"
      className={
        isOverlap
          ? "aee-hero-compare-overlap scroll-mt-24"
          : "scroll-mt-24 border-b border-slate-100 bg-slate-50/80 py-6 sm:py-8"
      }
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-[880px] px-5 sm:px-6 lg:px-8">
        {!isOverlap && (
          <div className="mb-4 text-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal-600">
              Why students choose us
            </p>
            <h2
              id="compare-heading"
              className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
            >
              Four exams.{" "}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                A fraction of the cost.
              </span>
            </h2>
          </div>
        )}

        {isOverlap && (
          <h2 id="compare-heading" className="sr-only">
            Compare Any Exam Easy to typical competitors
          </h2>
        )}

        <motion.div
          initial={{ opacity: 0, y: isOverlap ? 24 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isOverlap ? "0px" : "-30px" }}
          transition={{ duration: 0.45 }}
          className="aee-hero-compare-grid grid gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {/* Us */}
          <article className="aee-hero-compare-card aee-hero-compare-card--us relative overflow-hidden rounded-2xl border-2 border-teal-500/35 bg-white/95 p-4 shadow-[0_8px_30px_rgba(13,148,136,0.12)] backdrop-blur-sm sm:p-5">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-teal-50/90 to-transparent"
              aria-hidden
            />
            <header className="relative">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Any Exam Easy
                </p>
                <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                  Best value
                </span>
              </div>
              <p className="mt-2 text-3xl font-black tracking-tight text-teal-700 sm:text-4xl">
                {formatTrialTodayPrice()}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatTrialLabel()} · payment required · then {formatMonthlyPrice()}/mo
              </p>
            </header>

            <ul className="relative mt-4 space-y-2 border-t border-teal-100 pt-4" role="list">
              {visibleRows.map(({ label, us }) => (
                <li key={label} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <Check className="h-3 w-3 text-emerald-600" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                      {label}
                    </span>
                    <span className="font-semibold text-slate-900">{us}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* Them */}
          <article className="aee-hero-compare-card aee-hero-compare-card--them rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm sm:p-5">
            <header>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Typical competitors
              </p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {competitorNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[0.6875rem] font-medium text-slate-500"
                  >
                    {name}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-slate-300 line-through decoration-slate-300 sm:text-4xl">
                $99+
              </p>
              <p className="mt-0.5 text-xs text-slate-400">Upfront or bundled plans</p>
            </header>

            <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4" role="list">
              {visibleRows.map(({ label, them }) => (
                <li key={label} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Minus className="h-3 w-3 text-slate-400" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-slate-300">
                      {label}
                    </span>
                    <span className="text-slate-500">{them}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </motion.div>

        <div
          className={
            isOverlap
              ? "mt-4 flex flex-col items-center gap-2 border-b border-slate-100 bg-white/90 pb-6 pt-2 text-center backdrop-blur-sm"
              : "mt-5 flex flex-col items-center gap-2 text-center"
          }
        >
          {isOverlap && (
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal-600">
              Four exams · a fraction of the cost
            </p>
          )}
          <Link
            href="/signup?plan=trial"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-600"
          >
            Start {formatTrialLabel()} — {formatTrialTodayPrice()} today
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <p className="max-w-md text-[0.625rem] leading-relaxed text-slate-400">
            Competitor pricing from public listings ({new Date().getFullYear()}); may vary. Not
            affiliated with UWorld, Archer Review, or SimpleNursing.
          </p>
        </div>
      </div>
    </section>
  );
}
