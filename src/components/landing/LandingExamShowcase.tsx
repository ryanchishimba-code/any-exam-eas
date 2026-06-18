import type { CSSProperties } from "react";
import Link from "next/link";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { LANDING_EXAMS } from "@/lib/landing/content";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
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

const FALLBACK_QUESTIONS: Record<string, string> = {
  usmle: `${MARKETING_QUESTION_COUNTS.usmle} questions`,
  nclex: `${MARKETING_QUESTION_COUNTS.nursing} questions`,
  naplex: `${MARKETING_QUESTION_COUNTS.pharmacy} questions`,
  pance: `${MARKETING_QUESTION_COUNTS.pance} questions`,
  "aanp-fnp": `${MARKETING_QUESTION_COUNTS.aanpFnp} questions`,
  "npte-pt": `${MARKETING_QUESTION_COUNTS.nptePt} questions`,
};

function questionsLabelForExam(
  examId: string,
  shortLabel: string,
  bankCounts: LandingBankCountsDisplay
): string {
  const match = bankCounts.exams.find((row) => row.label === shortLabel);
  return match?.questionsLabel ?? FALLBACK_QUESTIONS[examId] ?? "— questions";
}

export function LandingExamShowcase({ bankCounts, className = "" }: LandingExamShowcaseProps) {
  const totalQuestions =
    bankCounts.totalQuestionsLabel ?? `${bankCounts.totalLabel} questions`;

  return (
    <div
      className={`aee-hero-exam-showcase aee-hero-exam-showcase--static aee-hero-exam-showcase--hero-stat ${className}`.trim()}
      aria-label="Board exams and question bank sizes"
    >
      <div className="aee-hero-exam-showcase__stat">
        <p className="aee-hero-exam-showcase__total">{totalQuestions}</p>
        <p className="aee-hero-exam-showcase__badge">QA-gated · serve-ready only</p>
      </div>
      <p className="aee-hero-exam-showcase__kicker">
        6 board exams · one subscription · starting at{" "}
        <HighlightedPrice size="sm" period="/mo" />
      </p>

      <ul className="aee-hero-exam-showcase__grid">
        {LANDING_EXAMS.map((exam) => {
          const shortLabel = EXAM_SHORT_LABEL[exam.id] ?? exam.label;
          const questionsLabel = questionsLabelForExam(exam.id, shortLabel, bankCounts);

          return (
            <li
              key={exam.id}
              className="aee-hero-exam-showcase__cell"
              style={{ "--exam-accent": exam.color } as CSSProperties}
            >
              <Link href={exam.href} className="aee-hero-exam-showcase__link group">
                <span className="aee-hero-exam-showcase__name">{shortLabel}</span>
                <span className="aee-hero-exam-showcase__count">{questionsLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
