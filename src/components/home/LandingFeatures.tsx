"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  CircleCheckBig,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const benefits = [
  {
    icon: CircleCheckBig,
    outcome: "First-attempt ready",
    title: "Know when you're ready to pass",
    description:
      "Readiness scores and practice trends show when your prep is solid — so you can schedule with confidence, not guesswork.",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    icon: CalendarClock,
    outcome: "Hours back every week",
    title: "Spend time only on what you miss",
    description:
      "Adaptive practice skips what you've mastered and doubles down on weak areas — less re-reading, more progress per session.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: ShieldCheck,
    outcome: "Exam-day calm",
    title: "Practice that feels like the real thing",
    description:
      "Board-style vignettes and NCLEX NGN formats build familiarity before test day — so the actual exam feels familiar, not frightening.",
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: Sparkles,
    outcome: "Confidence after every question",
    title: "Understand why — not just what",
    description:
      "Every answer comes with a clear rationale, so wrong choices become learning moments instead of lingering doubt.",
    accent: "from-teal-600 to-teal-400",
  },
  {
    icon: TrendingUp,
    outcome: "Momentum you can see",
    title: "Watch your score climb",
    description:
      "Track accuracy, streaks, and topic mastery in one place — proof that your effort is paying off as exam day approaches.",
    accent: "from-cyan-600 to-teal-500",
  },
];

export function LandingFeatures() {
  return (
    <section
      className="aee-landing-section relative overflow-hidden bg-white dark:bg-black"
      aria-labelledby="landing-features-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Why students stick with us</p>
          <h2 id="landing-features-heading" className="aee-headline mt-4">
            Better outcomes.{" "}
            <span className="aee-display-accent">Less overwhelm.</span>
          </h2>
          <p className="aee-section-lede mx-auto max-w-xl">
            You don&apos;t need another app full of buttons — you need prep that
            saves time, builds confidence, and helps you pass.
          </p>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.li
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={
                  i === benefits.length - 1
                    ? "sm:col-span-2 sm:max-w-lg sm:justify-self-center sm:w-full lg:col-span-1 lg:max-w-none lg:justify-self-auto"
                    : undefined
                }
              >
                <article className="aee-feature-card group h-full">
                  <span
                    className={`aee-feature-icon bg-gradient-to-br ${benefit.accent}`}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </span>
                  <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {benefit.outcome}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
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
