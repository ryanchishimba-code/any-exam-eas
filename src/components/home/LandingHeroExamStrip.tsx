"use client";

/**
 * Quiet linked exam row for the beat hero — each board deep-links into trial signup
 * with that exam preselected. Not a pill cluster: text links with accent color only.
 */

import Link from "next/link";
import {
  LANDING_HERO_EXAMS,
  landingTrialHrefForExam,
} from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { analytics } from "@/lib/analytics";

type LandingHeroExamStripProps = {
  className?: string;
  bankCounts?: LandingBankCountsDisplay;
  variant?: "hero" | "compact" | "chips";
};

type HeroExamLink = {
  slug: string;
  label: string;
  color: string;
  countLabel?: string;
  questionsLabel?: string;
};

export function LandingHeroExamStrip({
  className = "",
  bankCounts,
  variant = "hero",
}: LandingHeroExamStripProps) {
  const exams: HeroExamLink[] =
    bankCounts?.exams ??
    LANDING_HERO_EXAMS.map(({ slug, label, color }) => ({
      slug,
      label,
      color,
    }));

  const stripClass =
    variant === "chips"
      ? "aee-hero-exam-chips"
      : variant === "compact"
        ? "aee-hero-exam-strip aee-hero-exam-strip--compact"
        : "aee-hero-exam-strip";

  if (variant === "chips") {
    return (
      <nav
        className={`${stripClass} ${className}`.trim()}
        aria-label="Start a free trial for your board exam"
      >
        {exams.map((exam) => (
          <Link
            key={exam.slug}
            href={landingTrialHrefForExam(exam.slug)}
            prefetch={false}
            className="aee-hero-exam-chips__link"
            style={{ color: exam.color }}
            onClick={() => analytics.ctaClicked(`exam_chip_${exam.slug}`, "hero")}
          >
            {exam.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <p
      className={`${stripClass} ${className}`.trim()}
      aria-label="Board exams we cover: USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT"
    >
      {exams.map((exam, index) => (
        <span key={exam.label} className="aee-hero-exam-strip__item">
          {index > 0 ? (
            <span className="aee-hero-exam-strip__sep" aria-hidden>
              |
            </span>
          ) : null}
          <Link
            href={landingTrialHrefForExam(exam.slug)}
            prefetch={false}
            className="aee-hero-exam-strip__name"
            style={{ color: exam.color }}
            onClick={() => analytics.ctaClicked(`exam_strip_${exam.slug}`, "hero")}
          >
            {exam.label}
            {exam.questionsLabel ?? exam.countLabel ? (
              <span
                className="aee-hero-exam-strip__count"
                aria-label={`${exam.questionsLabel ?? exam.countLabel} questions`}
              >
                {" · "}
                {exam.questionsLabel ?? `${exam.countLabel} questions`}
              </span>
            ) : null}
          </Link>
        </span>
      ))}
    </p>
  );
}
