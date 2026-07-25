"use client";

/**
 * Exam chips for the beat hero — selecting a board updates ATF copy + sample
 * practice; links still deep-link trial signup with that exam preselected.
 */

import Link from "next/link";
import {
  LANDING_HERO_EXAMS,
  landingTrialHrefForExam,
} from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { analytics } from "@/lib/analytics";
import { useLandingExamSelection } from "@/components/landing/v2/LandingExamSelectionContext";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type LandingHeroExamStripProps = {
  className?: string;
  bankCounts?: LandingBankCountsDisplay;
  variant?: "hero" | "compact" | "chips";
  /** When true (chips default on V2), chips select exam for ATF/sample. */
  selectable?: boolean;
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
  selectable = variant === "chips",
}: LandingHeroExamStripProps) {
  const { selectedExam, setSelectedExam } = useLandingExamSelection();

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
        aria-label="Choose your board exam"
      >
        {exams.map((exam) => {
          const isSelected = selectable && selectedExam === exam.slug;
          return (
            <Link
              key={exam.slug}
              href={landingTrialHrefForExam(exam.slug)}
              prefetch={false}
              className={cn(
                "aee-hero-exam-chips__link",
                isSelected && "aee-hero-exam-chips__link--selected"
              )}
              style={{ color: exam.color }}
              aria-current={isSelected ? "true" : undefined}
              onClick={(e) => {
                if (selectable) {
                  e.preventDefault();
                  setSelectedExam(exam.slug as ExamSlug);
                  analytics.ctaClicked(`exam_chip_${exam.slug}`, "hero");
                  const sample = document.getElementById("try-a-question");
                  if (sample) {
                    sample.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }
                } else {
                  analytics.ctaClicked(`exam_chip_${exam.slug}`, "hero");
                }
              }}
            >
              {exam.label}
            </Link>
          );
        })}
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
