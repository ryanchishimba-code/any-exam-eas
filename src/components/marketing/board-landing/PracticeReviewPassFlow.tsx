import type { ReactElement } from "react";
import { boardPracticeFlowSteps } from "@/lib/marketing/board-landing/board-theme";

const ICONS: Record<string, () => ReactElement> = {
  practice: () => (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
      <rect x="6" y="8" width="20" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M11 14h10M11 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  review: () => (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
      <path d="M8 16l5 5 11-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  pass: () => (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
      <path d="M8 20l4 4 12-14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 26h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export function PracticeReviewPassFlow() {
  const steps = boardPracticeFlowSteps();
  return (
    <section className="bl-flow" aria-label="Practice, review, and pass">
      <ol className="bl-flow__steps">
        {steps.map((step, index) => {
          const Icon = ICONS[step.id] ?? ICONS.practice;
          return (
            <li key={step.id} className="bl-flow__step">
              <span className="bl-flow__node" aria-hidden>
                <Icon />
              </span>
              <span className="bl-flow__label">{step.label}</span>
              {index < steps.length - 1 ? (
                <span className="bl-flow__arrow" aria-hidden>
                  <svg viewBox="0 0 24 12" width="24" height="12">
                    <path d="M0 6h20m0 0l-4-4m4 4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
              ) : null}
              <span className="sr-only">{step.detail}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
