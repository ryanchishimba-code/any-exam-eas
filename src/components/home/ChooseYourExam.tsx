import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_EXAMS } from "@/lib/landing/content";

export function ChooseYourExam() {
  return (
    <section
      id="choose-exam"
      className="aee-landing-section aee-choose-exam--showcase aee-choose-exam--static scroll-mt-24"
      aria-labelledby="choose-exam-heading"
    >
      <div className="aee-flagship-inner">
        <div className="mx-auto max-w-3xl text-center">
          <p className="aee-flagship-eyebrow">Pick your board</p>
          <h2 id="choose-exam-heading" className="aee-choose-exam__headline">
            Six exams.{" "}
            <span className="aee-flagship-gradient-text">Zero extra checkout.</span>
          </h2>
          <p className="aee-flagship-subtitle mx-auto mt-4 max-w-2xl">
            Each track ships with blueprint Roadmaps, timed full exams, topic banks, and rationales
            grounded in open educational resources — switch boards anytime on one plan.
          </p>
        </div>

        <ul className="aee-choose-exam__grid mt-12">
          {LANDING_EXAMS.map((exam) => {
            const Icon = exam.icon;
            const theme = exam.id as "nclex" | "usmle" | "naplex" | "pance" | "aanp-fnp" | "npte-pt";
            const displayTitle =
              exam.id === "usmle" ? "USMLE" : exam.id === "aanp-fnp" ? "AANP FNP" : exam.label;

            return (
              <li key={exam.id}>
                <Link
                  href={exam.href}
                  data-theme={theme}
                  className="aee-exam-card aee-exam-card--showcase group block h-full"
                  aria-label={`Start ${displayTitle} prep`}
                >
                  <span className="aee-exam-card-bar" aria-hidden />
                  <span className="aee-exam-icon-wrap">
                    <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3
                    className="aee-exam-title aee-exam-title--accent mt-5"
                    style={{ color: exam.color }}
                  >
                    {displayTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{exam.blurb}</p>
                  <span className="aee-exam-cta mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                    Start studying
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
