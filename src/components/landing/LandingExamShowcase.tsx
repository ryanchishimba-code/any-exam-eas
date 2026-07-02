import type { CSSProperties } from "react";
import Link from "next/link";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { LANDING_EXAMS } from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type LandingExamShowcaseProps = {
  bankCounts: LandingBankCountsDisplay;
  className?: string;
};

const EXAM_SHORT_LABEL: Record<string, string> = {
  usmle: "USMLE",
  nclex: "NCLEX",
  naplex: "NAPLEX",
  pance: "PANCE",
  "aanp-fnp": "AANP FNP",
  "npte-pt": "NPTE-PT",
};

export function LandingExamShowcase({ bankCounts, className = "" }: LandingExamShowcaseProps) {
  return (
    <div
      className={`aee-hero-exam-showcase aee-hero-exam-showcase--static aee-hero-exam-showcase--hero-stat ${className}`.trim()}
      aria-label="Board exams and question bank sizes"
    >
      <div className="aee-hero-exam-showcase__stat">
        <p className="aee-hero-exam-showcase__total">
          <span className="aee-landing-question-count aee-landing-question-count--hero">
            {bankCounts.totalLabel}
          </span>
          <span className="mt-1 block text-lg font-bold text-[var(--flagship-navy,var(--color-ink))]">
            serve-ready questions
          </span>
        </p>
        <p className="aee-hero-exam-showcase__badge">QA-gated · serve-ready only</p>
      </div>
      <p className="aee-hero-exam-showcase__kicker">
        6 board exams · one subscription · starting at{" "}
        <HighlightedPrice size="sm" period="/mo" />
      </p>

      <ul className="aee-hero-exam-showcase__grid">
        {LANDING_EXAMS.map((exam) => {
          const shortLabel = EXAM_SHORT_LABEL[exam.id] ?? exam.label;
          const countLabel =
            bankCounts.exams.find((row) => row.slug === exam.id)?.countLabel ?? "—";

          return (
            <li
              key={exam.id}
              className="aee-hero-exam-showcase__cell"
              style={{ "--exam-accent": exam.color } as CSSProperties}
            >
              <Link href={exam.href} className="aee-hero-exam-showcase__link group">
                <span className="aee-hero-exam-showcase__name">{shortLabel}</span>
                <span className="aee-hero-exam-showcase__count">
                  <span className="aee-landing-question-count aee-landing-question-count--inline">
                    {countLabel}
                  </span>
                  <span className="font-semibold"> serve-ready</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
