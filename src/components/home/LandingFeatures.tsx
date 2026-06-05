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
    outcome: "Focused prep",
    title: "Track your progress over time",
    description:
      "Practice trends and topic summaries help you see where you are improving in-app — so you can study with more intention, not more guesswork.",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    icon: CalendarClock,
    outcome: "Efficient sessions",
    title: "Spend time on what you miss",
    description:
      "Practice modes can emphasize weaker areas so you spend less time on topics you already know and more on what needs review.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: ShieldCheck,
    outcome: "Exam familiarity",
    title: "Practice that mirrors board formats",
    description:
      "Board-style vignettes and NCLEX item types help you get comfortable with question formats used on licensing exams.",
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: Sparkles,
    outcome: "Clear feedback",
    title: "Understand why — not just what",
    description:
      "Rationales aim to explain the reasoning behind each answer so missed questions become learning opportunities.",
    accent: "from-teal-600 to-teal-400",
  },
  {
    icon: TrendingUp,
    outcome: "Visible momentum",
    title: "See your effort add up",
    description:
      "Track accuracy, streaks, and topic coverage in one place as you work through your study plan.",
    accent: "from-cyan-600 to-teal-500",
  },
];

export function LandingFeatures() {
  return (
    <section
      className="aee-landing-section relative overflow-hidden bg-white"
      aria-labelledby="landing-features-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Why learners use Any Exam Easy</p>
          <h2 id="landing-features-heading" className="aee-headline mt-4">
            Better prep habits.{" "}
            <span className="aee-display-accent">Less overwhelm.</span>
          </h2>
          <p className="aee-section-lede mx-auto max-w-xl">
            Focused tools that support consistent, self-directed board exam
            preparation — not a substitute for accredited instruction.
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
