"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LANDING_EXAMS } from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type LandingExamShowcaseProps = {
  bankCounts?: LandingBankCountsDisplay;
  className?: string;
};

export function LandingExamShowcase({ bankCounts, className = "" }: LandingExamShowcaseProps) {
  const reduceMotion = useReducedMotion();

  const countByLabel = new Map(
    (bankCounts?.exams ?? []).map((exam) => [exam.label, exam.countLabel] as const)
  );

  return (
    <div
      className={`aee-hero-exam-showcase ${className}`.trim()}
      aria-label="Board exams included: USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT"
    >
      <p className="aee-hero-exam-showcase__kicker">All six boards · one subscription</p>
      <ul className="aee-hero-exam-showcase__grid">
        {LANDING_EXAMS.map((exam, index) => {
          const shortLabel =
            exam.id === "usmle"
              ? "USMLE"
              : exam.id === "aanp-fnp"
                ? "AANP FNP"
                : exam.label;
          const countLabel =
            countByLabel.get(shortLabel) ??
            countByLabel.get(exam.label) ??
            countByLabel.get(exam.label.replace(" Step 2 CK", ""));

          return (
            <motion.li
              key={exam.id}
              className="aee-hero-exam-showcase__cell"
              style={{ "--exam-accent": exam.color } as CSSProperties}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={exam.href} className="aee-hero-exam-showcase__link group">
                <span className="aee-hero-exam-showcase__name">{shortLabel}</span>
                {countLabel ? (
                  <span className="aee-hero-exam-showcase__count">{countLabel}</span>
                ) : null}
                <span className="aee-hero-exam-showcase__blurb">{exam.blurb}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
