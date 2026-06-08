"use client";

import {
  BarChart3,
  BookOpen,
  Brain,
  CircleDollarSign,
  MapPin,
  Pill,
} from "lucide-react";
import { LandingVisualSlot } from "@/components/home/LandingVisualSlot";

const benefits = [
  {
    icon: Brain,
    visualId: "feature-adaptive-learning",
    outcome: "Adaptive AI",
    title: "Practice what you miss — skip what you already know",
    description:
      "Adaptive sessions surface weak topics from your attempts so each block of study time targets gaps instead of repeating mastered content.",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    icon: CircleDollarSign,
    visualId: "pricing-value-stack",
    outcome: "One subscription",
    title: "All four boards without four separate bills",
    description:
      "NCLEX, USMLE Step 2 CK, NAPLEX, and MPJE live in one account — switch your primary exam anytime during your subscription.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: Pill,
    visualId: "feature-pharmacology",
    outcome: "Top 500 Drugs",
    title: "Pharmacology flashcards built for boards",
    description:
      "Class-organized deck with generic, brand, MOA, and adverse effects — shared across nursing and pharmacy prep.",
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: BookOpen,
    visualId: "screenshot-question-bank",
    outcome: "OER-backed",
    title: "Rationales you can actually learn from",
    description:
      "Missed-question explanations reference open educational sources and board blueprints — understand the why, not just the key.",
    accent: "from-teal-600 to-teal-400",
  },
  {
    icon: MapPin,
    visualId: null,
    outcome: "State MPJE",
    title: "Pharmacy law for your jurisdiction",
    description:
      "Drill uniform multistate content or focus on state-specific rules when you select your MPJE state in the app.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    visualId: "screenshot-analytics",
    outcome: "Progress tracking",
    title: "See weak areas — then drill them",
    description:
      "In-app practice metrics show accuracy trends and topic gaps. Metrics reflect activity on this platform only, not exam outcomes.",
    accent: "from-cyan-600 to-teal-500",
  },
];

export function LandingFeatures() {
  return (
    <section
      className="aee-landing-section-compact relative overflow-hidden border-b border-slate-100 bg-white"
      aria-labelledby="landing-features-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
            Why Any Exam Easy
          </p>
          <h2 id="landing-features-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Built for{" "}
            <span className="aee-display-accent-vibrant">serious licensing prep</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Board-style items, adaptive review, pharmacology tools, and timed simulations — without
            paying separately for each exam.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.title}
                className="aee-reveal"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <article className="aee-feature-card group flex h-full flex-col bg-white">
                  {benefit.visualId ? (
                    <LandingVisualSlot
                      visualId={benefit.visualId}
                      className="mb-3 aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/[0.04] sm:block"
                    />
                  ) : null}
                  <span
                    className={`aee-feature-icon bg-gradient-to-br ${benefit.accent}`}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </span>
                  <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-700">
                    {benefit.outcome}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                  <span
                    className="aee-feature-accent-bar bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500"
                    aria-hidden
                  />
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
