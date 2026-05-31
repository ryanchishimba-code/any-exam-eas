"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  ClipboardCheck,
  Map,
  MessageSquareQuote,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive AI Questions",
    description:
      "Difficulty adjusts in real time based on your accuracy — harder when you're ready, supportive when you need it.",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    icon: MessageSquareQuote,
    title: "Expert AI Explanations",
    description:
      "Every answer includes deep rationales sourced from Open RN, OpenStax, and board-style references.",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    icon: Map,
    title: "Personalized Study Plans",
    description:
      "Smart recommendations route you to the topics that matter most for your exam date and discipline.",
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track readiness scores, accuracy trends, streaks, and test history on one clean dashboard.",
    accent: "from-teal-600 to-teal-400",
  },
  {
    icon: Target,
    title: "Weak Area Targeting",
    description:
      "Miss a concept once and the engine queues remediation — focused reps until mastery sticks.",
    accent: "from-cyan-600 to-teal-500",
  },
  {
    icon: ClipboardCheck,
    title: "Next-Gen NCLEX Ready",
    description:
      "NGN-style case studies, SATA, and clinical judgment items aligned with current NCSBN formats.",
    accent: "from-blue-500 to-cyan-500",
  },
];

export function LandingFeatures() {
  return (
    <section
      className="relative overflow-hidden border-y border-teal-100/60 bg-gradient-to-b from-white via-teal-50/30 to-white py-[clamp(4rem,10vw,6.5rem)] dark:border-teal-900/30 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950"
      aria-labelledby="landing-features-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(20,184,166,0.08),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Platform features</p>
          <h2
            id="landing-features-heading"
            className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-slate-900 dark:text-white"
          >
            Everything you need to pass —{" "}
            <span className="aee-display-accent">nothing you don&apos;t.</span>
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400">
            Clinical-grade prep tools built for nursing and medical students who
            want smarter study sessions, not more noise.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <article className="aee-feature-card group h-full">
                  <span
                    className={`aee-feature-icon bg-gradient-to-br ${feature.accent}`}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
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
