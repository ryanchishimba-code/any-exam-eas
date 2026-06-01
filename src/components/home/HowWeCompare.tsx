"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

const highlights = [
  "Adaptive AI targets your weak areas",
  "NCLEX NGN · USMLE · NAPLEX in one place",
  "Cancel anytime — no phone call",
];

export function HowWeCompare() {
  return (
    <section
      id="how-we-compare"
      className="aee-landing-section aee-compare-section"
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-[880px] px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="compare-heading" className="aee-headline tracking-tight">
            Premium prep.{" "}
            <span className="aee-display-accent">Not premium prices.</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="aee-compare-price-banner aee-compare-price-banner-vibrant mt-10"
        >
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Any Exam Easy
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {formatTrialIntroPrice()}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {formatTrialLabel()}, then {formatMonthlyPrice()}/mo
            </p>
          </div>
          <div className="hidden h-14 w-px bg-teal-200/80 sm:block" aria-hidden />
          <ul className="space-y-2.5 sm:text-left">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.5} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup?plan=trial"
            className="aee-btn-hero-xl group inline-flex items-center justify-center gap-2"
          >
            Start {formatTrialLabel()} — {formatTrialIntroPrice()}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        <p className="mx-auto mt-6 max-w-md text-center text-xs text-slate-400">
          Study support only. No guarantee of exam outcomes.
        </p>
      </div>
    </section>
  );
}
