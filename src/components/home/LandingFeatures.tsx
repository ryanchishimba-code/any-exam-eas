"use client";

import {
  BarChart3,
  Bone,
  BookOpen,
  Brain,
  CircleDollarSign,
  Layers,
  MapPin,
  Pill,
} from "lucide-react";
import { LandingVisualSlot } from "@/components/home/LandingVisualSlot";
import { Top500DrugsVisual } from "@/components/home/Top500DrugsVisual";

const benefits = [
  {
    icon: BookOpen,
    visualId: "screenshot-question-bank",
    outcome: "Curated banks",
    title: "Vignettes that match the answer choices",
    description:
      "QA-checked NCLEX and board items with aligned stems, options, and CJMM rationales — not template-swapped distractors.",
    accent: "from-teal-600 to-teal-400",
  },
  {
    icon: Brain,
    visualId: "feature-adaptive-learning",
    outcome: "Adaptive practice",
    title: "Practice what you miss — skip what you already know",
    description:
      "Adaptive sessions surface weak topics from your attempts so each block targets gaps instead of repeating mastered content.",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    icon: Layers,
    visualId: "hero-app-mockup",
    outcome: "Reference Hub",
    title: "Memory Cards & weak-area shortcuts",
    description:
      "Flip high-yield cards by subject, open linked Review Modules, and jump to drugs or anatomy from one study home base.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: BarChart3,
    visualId: "screenshot-analytics",
    outcome: "Review Modules",
    title: "Textbook-depth topics when you need them",
    description:
      "Eight-section modules on sepsis, heart failure, delegation, and more — linked from questions and Memory Cards.",
    accent: "from-cyan-600 to-teal-500",
  },
  {
    icon: CircleDollarSign,
    visualId: "pricing-value-stack",
    outcome: "One subscription",
    title: "All six boards without six separate bills",
    description:
      "NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT live in one account — switch your primary exam anytime during your subscription.",
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: Pill,
    visualId: "feature-pharmacology",
    outcome: "Top 500 Drugs",
    title: "Pharmacology flashcards built for boards",
    description:
      "Class-organized deck with generic, brand, MOA, and adverse effects — shared across nursing and pharmacy prep.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    icon: Bone,
    visualId: null,
    outcome: "Anatomy Studio",
    title: "3D anatomy, video & CT Atlas",
    description:
      "Interactive structures with clinical pearls, guided tours, scrollable CT slices, and one-click jumps to related practice.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    icon: MapPin,
    visualId: null,
    outcome: "PANCE roadmap",
    title: "NCCPA blueprint study plan",
    description:
      "Weighted roadmap across 15 medical content categories — ACS, sepsis, and infectious disease deep dives included.",
    accent: "from-emerald-500 to-teal-500",
  },
];

export function LandingFeatures() {
  return (
    <section
      className="aee-landing-section-compact relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
      aria-labelledby="landing-features-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
            Why Any Exam Easy
          </p>
          <h2 id="landing-features-heading" className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            Built for{" "}
            <span className="aee-display-accent-vibrant">serious licensing prep</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--color-ink-muted)]">
            Curated question banks, Reference Hub, Review Modules, Anatomy Studio, and timed
            simulations — without paying separately for each exam.
          </p>
        </div>

        <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.title}
                className="aee-reveal"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <article className="aee-feature-card group flex h-full flex-col bg-[var(--color-surface-elevated)]">
                  {benefit.visualId === "feature-pharmacology" ? (
                    <Top500DrugsVisual
                      variant="feature"
                      className="mb-3 aspect-[4/3] min-h-[8rem]"
                    />
                  ) : benefit.visualId ? (
                    <LandingVisualSlot
                      visualId={benefit.visualId}
                      className="mb-3 aspect-[4/3] min-h-[7.5rem] overflow-hidden rounded-xl ring-1 ring-black/[0.04]"
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
                  <h3 className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
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
