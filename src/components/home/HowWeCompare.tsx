"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus } from "lucide-react";
import {
  LANDING_TRIAL_HREF,
  PLATFORM_TAGLINE,
  UWORLD_COMPARE_ROWS,
} from "@/lib/landing/content";
import {
  COMPARE_HONESTY_DISCLAIMER,
  COMPETITOR_MAY_WIN,
} from "@/lib/seo/competitor-comparison";
import {
  formatTrialCtaLabel,
  formatTrialPlanDetail,
  formatTrialTodayPrice,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";

const inlineRows = UWORLD_COMPARE_ROWS.slice(0, 4);

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
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal-600 dark:text-teal-400">
        Honest comparison
      </p>
      <h2
        id={id}
        className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-2xl lg:text-3xl"
      >
        How we compare{" "}
        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-300">
          on multi-exam value
        </span>
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {PLATFORM_TAGLINE} We win on one plan for six boards — not by claiming UWorld parity or
        unverified pass rates.
      </p>
    </div>
  );
}

type HowWeCompareProps = {
  variant?: "default" | "hero-overlap" | "hero-inline";
};

export function HowWeCompare({ variant = "default" }: HowWeCompareProps) {
  const isInline = variant === "hero-inline";
  const isOverlap = variant === "hero-overlap";
  const visibleRows = isInline ? inlineRows : UWORLD_COMPARE_ROWS;

  return (
    <section
      id="how-we-compare"
      className={
        isInline
          ? "aee-landing-hero-band__compare scroll-mt-24"
          : isOverlap
            ? "aee-hero-compare-overlap scroll-mt-24"
            : "scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-surface)] py-6 sm:py-8"
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
          <CompareUWorldCard rows={visibleRows} compact={isInline} />
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
  rows: typeof UWORLD_COMPARE_ROWS | typeof inlineRows;
  compact?: boolean;
}) {
  return (
    <article className="aee-hero-compare-card aee-hero-compare-card--us relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-teal-500/40 p-4 shadow-[0_8px_28px_rgba(13,148,136,0.1)] dark:border-teal-400/35 dark:shadow-[0_8px_28px_rgba(0,212,200,0.12)] sm:p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-teal-50/90 to-transparent dark:from-teal-950/60"
        aria-hidden
      />
      <header className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Any Exam Easy
          </p>
          <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white dark:bg-teal-500">
            Best value
          </span>
        </div>
        <p
          className={`font-black tracking-tight text-teal-700 dark:text-teal-300 ${compact ? "mt-2 text-2xl" : "mt-2 text-3xl sm:text-4xl"}`}
        >
          {formatTrialTodayPrice()}
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
          {formatTrialPlanDetail()} · all 6 exams
        </p>
      </header>

      <ul
        className="relative mt-3 flex-1 space-y-2 border-t border-teal-100 pt-3 dark:border-teal-900/50"
        role="list"
      >
        {visibleRows.map(({ label, us }) => (
          <CompareRow key={label} label={label} value={us} variant="us" compact={compact} />
        ))}
      </ul>
    </article>
  );
}

function CompareUWorldCard({
  rows: visibleRows,
  compact,
}: {
  rows: typeof UWORLD_COMPARE_ROWS | typeof inlineRows;
  compact?: boolean;
}) {
  return (
    <article className="aee-hero-compare-card aee-hero-compare-card--them flex h-full flex-col rounded-2xl border p-4 sm:p-4">
      <header>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Typical UWorld pricing
        </p>
        <p className="mt-2">
          <span className="rounded-md bg-[var(--color-surface-elevated)] px-2.5 py-1 text-sm font-semibold text-[var(--color-ink-muted)] ring-1 ring-[var(--color-border)]">
            UWorld
          </span>
        </p>
        <p
          className={`font-black tracking-tight text-[var(--color-ink-muted)] line-through ${compact ? "mt-2 text-2xl" : "mt-3 text-3xl sm:text-4xl"}`}
        >
          $200–400+
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">Per exam · separate subscriptions</p>
      </header>

      <ul
        className="mt-3 flex-1 space-y-2 border-t border-[var(--color-border)] pt-3"
        role="list"
      >
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
          isUs ? "bg-emerald-50 dark:bg-emerald-950/50" : "bg-[var(--color-surface)]"
        }`}
      >
        {isUs ? (
          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden />
        ) : (
          <Minus className="h-3 w-3 text-[var(--color-ink-muted)]" strokeWidth={2.5} aria-hidden />
        )}
      </span>
      <span className="min-w-0">
        <span
          className={`block text-[0.65rem] font-semibold uppercase tracking-wide ${
            isUs ? "text-[var(--color-ink-muted)]" : "text-[var(--color-ink-muted)]/70"
          }`}
        >
          {label}
        </span>
        <span
          className={
            isUs ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"
          }
        >
          {value}
        </span>
      </span>
    </li>
  );
}

function WhenTheyWin({ compact }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3 text-left"
          : "mt-5 w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 text-left sm:p-5"
      }
    >
      <p
        className={`font-semibold uppercase tracking-wide text-[var(--color-ink-muted)] ${
          compact ? "text-[0.6rem]" : "text-xs"
        }`}
      >
        When UWorld (or another specialist) may win
      </p>
      <ul className={`mt-2 space-y-1.5 ${compact ? "text-[0.7rem]" : "text-sm"}`} role="list">
        {COMPETITOR_MAY_WIN.map((item) => (
          <li key={item} className="flex gap-2 leading-relaxed text-[var(--color-ink-muted)]">
            <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompareFooter({ isInline, isOverlap }: { isInline: boolean; isOverlap: boolean }) {
  if (isInline) {
    return (
      <div className="mt-3 space-y-2 lg:mt-4">
        <WhenTheyWin compact />
        <Link
          href={LANDING_TRIAL_HREF}
          className="aee-flagship-cta aee-flagship-cta--primary group inline-flex w-full items-center justify-center sm:w-auto"
        >
          {formatTrialCtaLabel()}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <p className="text-[0.625rem] leading-relaxed text-[var(--color-ink-muted)]">
          {COMPARE_HONESTY_DISCLAIMER}
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        isOverlap
          ? "mt-4 flex flex-col items-center gap-3 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-elevated)_90%,transparent)] pb-6 pt-2 text-center backdrop-blur-sm"
          : "mt-5 flex flex-col items-center gap-3 text-center"
      }
    >
      <WhenTheyWin />
      <Link
        href={LANDING_TRIAL_HREF}
        className="aee-flagship-cta aee-flagship-cta--primary aee-flagship-cta--hero group inline-flex w-full max-w-md items-center justify-center sm:w-auto"
      >
        {formatTrialCtaLabel()}
        <ArrowRight
          className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
      <p className="max-w-md text-xs text-[var(--color-ink-muted)]">
        {formatTrialPlanDetail()} · all six exams
      </p>
      <p className="max-w-md text-[0.625rem] leading-relaxed text-[var(--color-ink-muted)] dark:text-[var(--color-ink-muted)]">
        {TRIAL_PAYMENT_DISCLOSURE}
      </p>
      <p className="max-w-2xl text-[0.625rem] leading-relaxed text-[var(--color-ink-muted)] dark:text-[var(--color-ink-muted)]">
        {COMPARE_HONESTY_DISCLAIMER}
      </p>
    </div>
  );
}
