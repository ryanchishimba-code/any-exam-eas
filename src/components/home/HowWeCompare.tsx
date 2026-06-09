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
  { label: "Starting cost", us: `${formatTrialTodayPrice()} today`, them: "$99–329+ upfront" },
  { label: "Monthly", us: `${formatMonthlyPrice()}/mo after trial`, them: "$39–89+/mo tiers" },
  { label: "Exam coverage", us: "NCLEX · USMLE · NAPLEX · MPJE", them: "Often per-exam pricing" },
  { label: "Top 500 drugs", us: "Dedicated mastery deck", them: "Scattered in banks" },
  { label: "Adaptive practice", us: "Weak-area targeting", them: "Limited / add-on" },
  { label: "MPJE prep", us: "Uniform + state-specific", them: "Rare or generic only" },
  { label: "Rationales", us: "OER-backed (Open RN, OpenStax)", them: "Proprietary only" },
] as const;

const inlineRows = rows.slice(0, 4);

export function CompareSectionHeading({
  id = "compare-heading",
  className = "",
  align = "center",
}: {
  id?: string;
  className?: string;
  align?: "center" | "left" | "right";
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center";

  return (
    <div className={`${alignClass} ${className}`.trim()}>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal-600">
        Why students choose us
      </p>
      <h2
        id={id}
        className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl"
      >
        Four exams.{" "}
        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          A fraction of the cost.
        </span>
      </h2>
    </div>
  );
}

type HowWeCompareProps = {
  variant?: "default" | "hero-overlap" | "hero-inline";
};

export function HowWeCompare({ variant = "default" }: HowWeCompareProps) {
  const isInline = variant === "hero-inline";
  const isOverlap = variant === "hero-overlap";
  const visibleRows = isInline ? inlineRows : rows;

  return (
    <section
      id="how-we-compare"
      className={
        isInline
          ? "aee-landing-hero-band__compare scroll-mt-24"
          : isOverlap
            ? "aee-hero-compare-overlap scroll-mt-24"
            : "scroll-mt-24 border-b border-slate-100 bg-slate-50/80 py-6 sm:py-8"
      }
      aria-labelledby="compare-heading"
    >
      <div className={isInline ? "" : "mx-auto max-w-[880px] px-5 sm:px-6 lg:px-8"}>
        {isInline ? (
          <CompareSectionHeading align="left" className="mb-3 text-center sm:mb-4 lg:text-left" />
        ) : (
          <CompareSectionHeading className="mb-4" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isInline ? "0px" : "-30px" }}
          transition={{ duration: 0.35 }}
          className={
            isInline
              ? "aee-hero-compare-grid aee-hero-compare-grid--inline grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 lg:grid-cols-1"
              : "aee-hero-compare-grid grid gap-3 sm:grid-cols-2 sm:gap-4"
          }
        >
          <CompareUsCard rows={visibleRows} compact={isInline} />
          <CompareThemCard rows={visibleRows} compact={isInline} />
        </motion.div>

        <CompareFooter isInline={isInline} isOverlap={isOverlap} />
      </div>
    </section>
  );
}

function CompareUsCard({
  rows: visibleRows,
  compact,
}: {
  rows: typeof rows | typeof inlineRows;
  compact?: boolean;
}) {
  return (
    <article className="aee-hero-compare-card aee-hero-compare-card--us relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-teal-500/40 bg-white p-4 shadow-[0_8px_28px_rgba(13,148,136,0.1)] sm:p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-teal-50/90 to-transparent"
        aria-hidden
      />
      <header className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Any Exam Easy</p>
          <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
            Best value
          </span>
        </div>
        <p className={`font-black tracking-tight text-teal-700 ${compact ? "mt-2 text-2xl" : "mt-2 text-3xl sm:text-4xl"}`}>
          {formatTrialTodayPrice()}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {formatTrialLabel()} · then {formatMonthlyPrice()}/mo
        </p>
      </header>

      <ul className="relative mt-3 flex-1 space-y-2 border-t border-teal-100 pt-3" role="list">
        {visibleRows.map(({ label, us }) => (
          <CompareRow key={label} label={label} value={us} variant="us" compact={compact} />
        ))}
      </ul>
    </article>
  );
}

function CompareThemCard({
  rows: visibleRows,
  compact,
}: {
  rows: typeof rows | typeof inlineRows;
  compact?: boolean;
}) {
  return (
    <article className="aee-hero-compare-card aee-hero-compare-card--them flex h-full flex-col rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-4">
      <header>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Typical competitors
        </p>
        <p className="mt-2 flex flex-wrap gap-1.5">
          {competitorNames.map((name) => (
            <span
              key={name}
              className="rounded-md bg-white px-2 py-0.5 text-[0.6875rem] font-medium text-slate-500 ring-1 ring-slate-200/80"
            >
              {name}
            </span>
          ))}
        </p>
        <p className={`font-black tracking-tight text-slate-300 line-through ${compact ? "mt-2 text-2xl" : "mt-3 text-3xl sm:text-4xl"}`}>
          $99+
        </p>
        <p className="mt-0.5 text-xs text-slate-400">Upfront or bundled plans</p>
      </header>

      <ul className="mt-3 flex-1 space-y-2 border-t border-slate-200/80 pt-3" role="list">
        {visibleRows.map(({ label, them }) => (
          <CompareRow key={label} label={label} value={them} variant="them" compact={compact} />
        ))}
      </ul>
    </article>
  );
}

function CompareRow({
  label,
  value,
  variant,
  compact,
}: {
  label: string;
  value: string;
  variant: "us" | "them";
  compact?: boolean;
}) {
  const isUs = variant === "us";

  return (
    <li className={`flex items-start gap-2 ${compact ? "text-xs" : "gap-2.5 text-sm"}`}>
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          isUs ? "bg-emerald-50" : "bg-slate-100"
        }`}
      >
        {isUs ? (
          <Check className="h-3 w-3 text-emerald-600" strokeWidth={2.5} aria-hidden />
        ) : (
          <Minus className="h-3 w-3 text-slate-400" strokeWidth={2.5} aria-hidden />
        )}
      </span>
      <span className="min-w-0">
        <span
          className={`block text-[0.65rem] font-semibold uppercase tracking-wide ${
            isUs ? "text-slate-400" : "text-slate-300"
          }`}
        >
          {label}
        </span>
        <span className={isUs ? "font-semibold text-slate-900" : "text-slate-500"}>{value}</span>
      </span>
    </li>
  );
}

function CompareFooter({ isInline, isOverlap }: { isInline: boolean; isOverlap: boolean }) {
  if (isInline) {
    return (
      <div className="mt-3 space-y-1.5 lg:mt-4">
        <Link
          href="/signup?plan=trial"
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-600"
        >
          Start {formatTrialLabel()} — {formatTrialTodayPrice()} today
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <p className="text-[0.625rem] leading-relaxed text-slate-400">
          Competitor pricing from public listings ({new Date().getFullYear()}); may vary.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        isOverlap
          ? "mt-4 flex flex-col items-center gap-2 border-b border-slate-100 bg-white/90 pb-6 pt-2 text-center backdrop-blur-sm"
          : "mt-5 flex flex-col items-center gap-2 text-center"
      }
    >
      <Link
        href="/signup?plan=trial"
        className="group inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-600"
      >
        Start {formatTrialLabel()} — {formatTrialTodayPrice()} today
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
      <p className="max-w-md text-[0.625rem] leading-relaxed text-slate-400">
        Competitor pricing from public listings ({new Date().getFullYear()}); may vary. Not
        affiliated with UWorld, Archer Review, or SimpleNursing.
      </p>
    </div>
  );
}
