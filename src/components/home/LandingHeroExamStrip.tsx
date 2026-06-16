import { LANDING_HERO_EXAMS } from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type LandingHeroExamStripProps = {
  className?: string;
  bankCounts?: LandingBankCountsDisplay;
  variant?: "hero" | "compact";
};

export function LandingHeroExamStrip({
  className = "",
  bankCounts,
  variant = "hero",
}: LandingHeroExamStripProps) {
  const exams =
    bankCounts?.exams ??
    LANDING_HERO_EXAMS.map(({ label, color }) => ({
      label,
      color,
      countLabel: undefined as string | undefined,
      questionsLabel: undefined as string | undefined,
    }));

  const stripClass =
    variant === "compact"
      ? "aee-hero-exam-strip aee-hero-exam-strip--compact"
      : "aee-hero-exam-strip";

  return (
    <p
      className={`${stripClass} ${className}`.trim()}
      aria-label="Board exams we cover: USMLE, NCLEX, NAPLEX, PANCE, and AANP FNP"
    >
      {exams.map((exam, index) => (
        <span key={exam.label} className="aee-hero-exam-strip__item">
          {index > 0 ? (
            <span className="aee-hero-exam-strip__sep" aria-hidden>
              |
            </span>
          ) : null}
          <span className="aee-hero-exam-strip__name" style={{ color: exam.color }}>
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
          </span>
        </span>
      ))}
    </p>
  );
}
