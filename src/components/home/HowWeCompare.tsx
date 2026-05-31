"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus, X } from "lucide-react";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

type CompetitorCell = {
  text: string;
  status: "yes" | "no" | "partial";
};

type CompareRow = {
  feature: string;
  aee: { text: string };
  competitors: CompetitorCell;
  priceRow?: boolean;
};

const rows: CompareRow[] = [
  {
    feature: "Starting price",
    priceRow: true,
    aee: { text: `${formatTrialIntroPrice()} trial` },
    competitors: { text: "$99–$329+ upfront", status: "no" },
  },
  {
    feature: "Monthly after trial",
    priceRow: true,
    aee: { text: `${formatMonthlyPrice()}/mo — listed upfront` },
    competitors: { text: "$39–$89+/mo or bundle tiers", status: "no" },
  },
  {
    feature: "Adaptive AI practice",
    aee: { text: "Targets weak areas automatically" },
    competitors: { text: "Limited or add-on pricing", status: "partial" },
  },
  {
    feature: "Top 500 Drug flashcards",
    aee: { text: "Dedicated mastery module included" },
    competitors: { text: "Scattered pharm content only", status: "no" },
  },
  {
    feature: "OER-backed rationales",
    aee: { text: "Citations you can verify" },
    competitors: { text: "Proprietary explanations only", status: "partial" },
  },
  {
    feature: "NCLEX · USMLE · NAPLEX",
    aee: { text: "All three on one platform" },
    competitors: { text: "Separate products or NCLEX-only", status: "no" },
  },
  {
    feature: "Cancel anytime",
    aee: { text: "Self-serve, no phone call" },
    competitors: { text: "Varies by provider", status: "partial" },
  },
];

export function HowWeCompare() {
  return (
    <section
      id="how-we-compare"
      className="aee-landing-section border-b border-black/[0.04] bg-white dark:border-white/[0.06] dark:bg-[var(--color-surface)]"
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-[880px] px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="compare-heading" className="aee-headline tracking-tight">
            Better Value.{" "}
            <span className="aee-display-accent">Better Results.</span>
          </h2>
          <p className="aee-section-lede mx-auto mt-4 max-w-xl">
            Same board exams. Fraction of the cost. See how Any Exam Easy compares
            to UWorld, Archer Review, and SimpleNursing.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="aee-compare-price-banner mt-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Any Exam Easy
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {formatTrialIntroPrice()}
            </p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {formatTrialLabel()}, then {formatMonthlyPrice()}/mo
            </p>
          </div>
          <div className="hidden h-12 w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden />
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Major competitors
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-400 line-through decoration-slate-300 dark:text-slate-500 sm:text-4xl">
              $99–$329+
            </p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Typical upfront or monthly bundles
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="aee-compare-table-wrap mt-8"
        >
          <table className="aee-compare-table aee-compare-table-3col w-full border-collapse text-left">
            <caption className="sr-only">
              Comparison of Any Exam Easy versus major board exam prep competitors
            </caption>
            <thead>
              <tr>
                <th scope="col" className="aee-compare-th">
                  Feature
                </th>
                <th scope="col" className="aee-compare-th aee-compare-th-aee">
                  Any Exam Easy
                </th>
                <th scope="col" className="aee-compare-th">
                  Major Competitors
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className={row.priceRow ? "aee-compare-row-highlight" : undefined}
                >
                  <th scope="row" className="aee-compare-td-label">
                    {row.feature}
                  </th>
                  <td className="aee-compare-td aee-compare-td-aee">
                    <StatusCell text={row.aee.text} status="yes" featured />
                  </td>
                  <td className="aee-compare-td">
                    <StatusCell text={row.competitors.text} status={row.competitors.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup?plan=trial"
            className="aee-btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base"
          >
            Start {formatTrialLabel()} — {formatTrialIntroPrice()}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
          >
            Full pricing
          </Link>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
          Competitor pricing reflects publicly listed UWorld, Archer Review, and SimpleNursing
          plans as of {new Date().getFullYear()} and may vary. Comparisons are for general
          information only — not guarantees of equivalent content or exam outcomes. Any Exam Easy
          is not affiliated with these providers.
        </p>
      </div>
    </section>
  );
}

function StatusCell({
  text,
  status,
  featured = false,
}: {
  text: string;
  status: "yes" | "no" | "partial";
  featured?: boolean;
}) {
  const Icon = status === "yes" ? Check : status === "no" ? X : Minus;
  const iconClass =
    status === "yes"
      ? "text-emerald-600 dark:text-emerald-400"
      : status === "no"
        ? "text-red-500 dark:text-red-400"
        : "text-amber-500 dark:text-amber-400";

  return (
    <span
      className={`inline-flex items-start gap-2.5 text-sm leading-snug ${
        featured
          ? "font-semibold text-slate-900 dark:text-white"
          : "text-slate-600 dark:text-slate-400"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          status === "yes"
            ? "bg-emerald-50 dark:bg-emerald-950/50"
            : status === "no"
              ? "bg-red-50 dark:bg-red-950/40"
              : "bg-amber-50 dark:bg-amber-950/40"
        }`}
        aria-hidden
      >
        <Icon className={`h-3 w-3 ${iconClass}`} strokeWidth={2.5} />
      </span>
      {text}
    </span>
  );
}
