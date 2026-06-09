"use client";

import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "I was paying for two separate banks before this. Having NCLEX and pharmacology flashcards in one place actually matches how I study.",
    name: "Maria L.",
    exam: "NCLEX-RN",
  },
  {
    quote:
      "The vignette rationales feel closer to UWorld than the free apps I tried — but I’m not buying Step 2 and MPJE as separate subscriptions anymore.",
    name: "Ben K.",
    exam: "USMLE Step 2 CK",
  },
  {
    quote:
      "Calculation cases plus law drills in one account is what sold me. State MPJE selection was the feature I couldn’t find bundled elsewhere.",
    name: "Priya S.",
    exam: "NAPLEX · MPJE",
  },
  {
    quote:
      "Bow-tie and matrix practice on the homepage convinced me the NGN formats were real — not just marketing copy.",
    name: "Alex T.",
    exam: "NCLEX-RN",
  },
] as const;

export function LandingTestimonials() {
  return (
    <section
      className="aee-landing-compact-section border-b border-slate-100 bg-slate-50/70"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
            Student feedback
          </p>
          <h2
            id="testimonials-heading"
            className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Built for people juggling{" "}
            <span className="aee-display-accent-vibrant">more than one board.</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Real comments from learners using Any Exam Easy — not paid endorsements.
          </p>
        </div>

        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:gap-3">
          {TESTIMONIALS.map(({ quote, name, exam }) => (
            <li key={name}>
              <figure className="aee-testimonial-card flex h-full flex-col">
                <Quote
                  className="h-5 w-5 text-teal-500/70"
                  strokeWidth={2}
                  aria-hidden
                />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-[0.6875rem] font-medium text-slate-500">{exam}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-4 max-w-xl text-center text-[0.625rem] leading-relaxed text-slate-400">
          Individual experiences vary. Any Exam Easy does not guarantee licensure exam results.
        </p>
      </div>
    </section>
  );
}
