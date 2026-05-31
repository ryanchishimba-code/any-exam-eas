"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, FileText } from "lucide-react";
import { AppleLink } from "@/components/ui/AppleLink";
import { PageMemberAccess } from "@/components/home/PageMemberAccess";

const highlights = [
  {
    icon: FileText,
    eyebrow: "Question bank",
    title: "Board-aligned. OER-backed.",
    desc: "RAG from Open RN, OpenStax, and NCSBN-style NGN prompts — with citations in every rationale.",
    href: "/study/practice",
    linkLabel: "Try question bank",
    span: "lg:col-span-2",
  },
  {
    icon: Brain,
    eyebrow: "Adaptive engine",
    title: "Difficulty that follows you.",
    desc: "Weak-area focus, mastery scoring, and remediation after every miss.",
    href: "/study/practice?mode=adaptive",
    linkLabel: "Start adaptive",
    span: "",
  },
  {
    icon: BarChart3,
    eyebrow: "Analytics",
    title: "Know when you're ready.",
    desc: "Accuracy trends, readiness score, streaks, and test history on one dashboard.",
    href: "/study/analytics",
    linkLabel: "View analytics",
    span: "",
  },
];

const disciplines = [
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Dentistry",
  "SAT",
  "Biology",
  "Chemistry",
  "Math",
];

export function FeatureGrid() {
  return (
    <section className="apple-section aee-section-alt">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
        <div className="text-center">
          <p className="aee-section-label">Why students choose us</p>
          <h2 className="apple-headline mt-3">Built for how you actually study.</h2>
          <p className="apple-subhead mx-auto mt-4 max-w-xl">
            No clutter. Just board-aligned prep, deep rationales, and performance
            you can trust on exam day.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`aee-card flex flex-col p-6 md:p-8 ${item.span}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <p className="aee-section-label mt-5 !text-[0.6875rem]">{item.eyebrow}</p>
                <h3 className="mt-2 text-[clamp(1.25rem,2.8vw,1.625rem)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {item.desc}
                </p>
                <div className="mt-5">
                  <AppleLink href={item.href}>{item.linkLabel}</AppleLink>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="aee-section-label">Eight disciplines</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2.5 sm:gap-x-8">
            {disciplines.map((d) => (
              <li
                key={d}
                className="rounded-full border border-teal-200/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-700 dark:border-teal-800/40 dark:bg-slate-900/40 dark:text-slate-300"
              >
                {d}
              </li>
            ))}
          </ul>
          <PageMemberAccess className="mt-10" />
        </div>
      </div>
    </section>
  );
}
