"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
  const totalQuestions =
    bankCounts.totalQuestionsLabel ??
    `${bankCounts.totalLabel} questions`;

  return (
    <div
      className={`aee-hero-exam-showcase ${className}`.trim()}
      aria-label="Board exams and question bank sizes"
    >
      <p className="aee-hero-exam-showcase__total">{totalQuestions}</p>
      <p className="aee-hero-exam-showcase__kicker">Six board exams · one subscription</p>

      <ul className="aee-hero-exam-showcase__grid">
        {LANDING_EXAMS.map((exam, index) => {
          const shortLabel = EXAM_SHORT_LABEL[exam.id] ?? exam.label;
          const questionsLabel = questionsLabelForExam(exam.id, shortLabel, bankCounts);

          return (
            <motion.li
              key={exam.id}
              className="aee-hero-exam-showcase__cell"
              style={{ "--exam-accent": exam.color } as CSSProperties}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={exam.href} className="aee-hero-exam-showcase__link group">
                <span className="aee-hero-exam-showcase__name">{shortLabel}</span>
                <span className="aee-hero-exam-showcase__count">{questionsLabel}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
