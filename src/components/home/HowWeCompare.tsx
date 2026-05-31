"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  Minus,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

type CompareRow = {
  label: string;
  aee: string;
  uworld: string;
  archer: string;
  highlight?: boolean;
};

const rows: CompareRow[] = [
  {
    label: "Starting price",
    aee: `${formatTrialIntroPrice()} trial`,
    uworld: "$149–$329",
    archer: "$99–$199",
    highlight: true,
  },
  {
    label: "Monthly after trial",
    aee: `${formatMonthlyPrice()}/mo`,
    uworld: "Varies by exam",
    archer: "Varies by plan",
    highlight: true,
  },
  {
    label: "Question bank",
    aee: "12,000+",
    uworld: "Large (exam-specific)",
    archer: "Large (exam-specific)",
  },
  {
    label: "Content sourcing",
    aee: "OER-backed + citations",
    uworld: "Proprietary",
    archer: "Proprietary",
  },
  {
    label: "Adaptive AI engine",
    aee: "Included",
    uworld: "Limited / add-on",
    archer: "Varies",
  },
  {
    label: "Pricing transparency",
    aee: "Listed upfront",
    uworld: "Tiered bundles",
    archer: "Bundle packages",
  },
];

const highlights = [
  {
    icon: Sparkles,
    title: "Up to 90% less than UWorld",
    description: "Board-quality prep without the $300+ price tag.",
  },
  {
    icon: Shield,
    title: "No surprise fees",
    description: `${formatTrialIntroPrice()} to start, then ${formatMonthlyPrice()}/mo — always shown before checkout.`,
  },
  {
    icon: BookOpen,
    title: "Open, citable content",
    description: "Explanations tied to Open RN, OpenStax, and other trusted OER sources.",
  },
];

export function HowWeCompare() {
  return (
    <section
      id="how-we-compare"
      className="relative overflow-hidden border-y border-slate-200/60 bg-white py-[clamp(4rem,10vw,6.5rem)] dark:border-slate-800 dark:bg-slate-950"
      aria-labelledby="compare-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_100%,rgba(20,184,166,0.06),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">How we compare</p>
          <h2
            id="compare-heading"
            className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-slate-900 dark:text-white"
          >
            Same board prep.{" "}
            <span className="aee-display-accent">Fraction of the price.</span>
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400">
            Premium competitors charge hundreds upfront. We keep pricing simple,
            transparent, and accessible — with a full question bank and OER-backed
            explanations included.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="aee-compare-highlight"
              >
                <span className="aee-compare-highlight-icon" aria-hidden>
                  <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="aee-compare-table-wrap mt-10"
        >
          <div className="overflow-x-auto">
            <table className="aee-compare-table w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Price and feature comparison between Any Exam Easy, UWorld, and Archer Review
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="aee-compare-th">
                    Feature
                  </th>
                  <th scope="col" className="aee-compare-th aee-compare-th-aee">
                    <span className="inline-flex items-center gap-1.5">
                      <BadgeCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden />
                      Any Exam Easy
                    </span>
                  </th>
                  <th scope="col" className="aee-compare-th">
                    UWorld
                  </th>
                  <th scope="col" className="aee-compare-th">
                    Archer Review
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className={row.highlight ? "aee-compare-row-highlight" : undefined}>
                    <th scope="row" className="aee-compare-td-label">
                      {row.label}
                    </th>
                    <td className="aee-compare-td aee-compare-td-aee">
                      <CompareCell value={row.aee} featured />
                    </td>
                    <td className="aee-compare-td">
                      <CompareCell value={row.uworld} />
                    </td>
                    <td className="aee-compare-td">
                      <CompareCell value={row.archer} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            See full pricing details
          </Link>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
          Competitor pricing reflects publicly listed rates as of {new Date().getFullYear()} and
          may vary by exam, subscription length, and promotions. Any Exam Easy is not affiliated
          with UWorld or Archer Review.
        </p>
      </div>
    </section>
  );
}

function CompareCell({ value, featured = false }: { value: string; featured?: boolean }) {
  const isIncluded = value === "Included" || value === "Listed upfront" || value.startsWith("OER");
  const isLimited = value.startsWith("Limited") || value === "Varies" || value === "Varies by plan" || value === "Varies by exam";

  return (
    <span className={`inline-flex items-start gap-2 ${featured ? "font-semibold text-teal-900 dark:text-teal-100" : "text-slate-600 dark:text-slate-400"}`}>
      {featured && isIncluded ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
      ) : isLimited ? (
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden />
      ) : null}
      {value}
    </span>
  );
}
