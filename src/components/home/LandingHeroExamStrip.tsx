import { LANDING_HERO_EXAMS } from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type LandingHeroExamStripProps = {
  className?: string;
  bankCounts?: LandingBankCountsDisplay;
};

export function LandingHeroExamStrip({ className = "", bankCounts }: LandingHeroExamStripProps) {
  const exams = bankCounts?.exams ?? LANDING_HERO_EXAMS.map(({ label, color }) => ({ label, color, countLabel: undefined as string | undefined }));
  return (
    <p
      className={`aee-hero-exam-strip ${className}`.trim()}
      aria-label="Board exams we cover: NCLEX, USMLE, NAPLEX, and PANCE"
    >
      {exams.map((exam, index) => (
        <span key={exam.label} className="aee-hero-exam-strip__item">
          {index > 0 ? (
            <span className="aee-hero-exam-strip__sep" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="aee-hero-exam-strip__name" style={{ color: exam.color }}>
            {exam.label}
            {exam.countLabel ? (
              <span className="aee-hero-exam-strip__count" aria-label={`${exam.countLabel} questions`}>
                {" "}
                {exam.countLabel}
              </span>
            ) : null}
          </span>
        </span>
      ))}
    </p>
  );
}
