"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CircleDollarSign,
  MapPin,
  Pill,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    outcome: "Adaptive AI",
    title: "Study what you miss — not what you already know",
    description:
      "Our engine surfaces weak topics and adjusts your practice so every session moves the needle toward exam-day confidence.",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    icon: CircleDollarSign,
    outcome: "Affordable",
    title: "Elite prep without the $300 price tag",
    description:
      "Full access to NCLEX, USMLE, NAPLEX, and MPJE for a fraction of what legacy question banks charge upfront.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: Pill,
    outcome: "Top 500 Drugs",
    title: "High-yield pharmacology in one place",
    description:
      "Dedicated drug mastery with flashcards by class — generic, brand, MOA, and adverse effects for NCLEX and NAPLEX.",
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: BookOpen,
    outcome: "OER-backed",
    title: "Understand why — with sources you can trust",
    description:
      "Rationales draw on Open RN, OpenStax, and board blueprints so missed questions become real learning — not memorization.",
    accent: "from-teal-600 to-teal-400",
  },
  {
    icon: MapPin,
    outcome: "State MPJE",
    title: "Uniform or state-specific pharmacy law",
    description:
      "Prep for UMPJE multistate jurisprudence or drill down into your state's practice act — California to Texas and beyond.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    outcome: "Pass the first time",
    title: "Walk in prepared — not panicking",
    description:
      "Board-realistic vignettes, timed simulations, and progress tracking designed to build the confidence you earned in school.",
    accent: "from-cyan-600 to-teal-500",
  },
];

export function LandingFeatures() {
  return (
    <section
      className="aee-landing-section relative overflow-hidden border-y border-slate-100 bg-slate-50/50"
      aria-labelledby="landing-features-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Why Any Exam Easy</p>
          <h2 id="landing-features-heading" className="aee-headline mt-4">
            Built to help you{" "}
            <span className="aee-display-accent">pass the first time.</span>
          </h2>
          <p className="aee-section-lede mx-auto max-w-xl">
            Powerful tools, honest pricing, and professional-grade content across
            NCLEX, USMLE, NAPLEX, and MPJE.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.li
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <article className="aee-feature-card group h-full bg-white">
                  <span
                    className={`aee-feature-icon bg-gradient-to-br ${benefit.accent}`}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </span>
                  <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-700">
                    {benefit.outcome}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                  <span
                    className="aee-feature-accent-bar bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500"
                    aria-hidden
                  />
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
