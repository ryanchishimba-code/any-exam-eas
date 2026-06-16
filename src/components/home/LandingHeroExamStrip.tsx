import { LANDING_HERO_EXAMS } from "@/lib/landing/content";

type LandingHeroExamStripProps = {
  className?: string;
};

export function LandingHeroExamStrip({ className = "" }: LandingHeroExamStripProps) {
  return (
    <p
      className={`aee-hero-exam-strip ${className}`.trim()}
      aria-label="Board exams we cover: NCLEX, USMLE, NAPLEX, and PANCE"
    >
      {LANDING_HERO_EXAMS.map((exam, index) => (
        <span key={exam.label} className="aee-hero-exam-strip__item">
          {index > 0 ? (
            <span className="aee-hero-exam-strip__sep" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="aee-hero-exam-strip__name" style={{ color: exam.color }}>
            {exam.label}
          </span>
        </span>
      ))}
    </p>
  );
}
