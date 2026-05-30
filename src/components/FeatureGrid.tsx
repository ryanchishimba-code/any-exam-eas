"use client";

import { motion } from "framer-motion";
import { AppleLink } from "@/components/ui/AppleLink";

const highlights = [
  {
    eyebrow: "Questions",
    title: "Best-in-class. OER-backed.",
    desc: "RAG from Open RN, OpenStax, and NCSBN-style NGN prompts — with citations in every rationale.",
    href: "/study/practice",
    linkLabel: "Try question bank",
    span: "lg:col-span-2",
  },
  {
    eyebrow: "Adaptive",
    title: "Difficulty that follows you.",
    desc: "Weak-area focus, mastery scoring, and remediation after every miss.",
    href: "/study/practice?mode=adaptive",
    linkLabel: "Start adaptive",
    span: "",
  },
  {
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
    <section className="apple-section apple-section-alt">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="text-center">
          <h2 className="apple-headline">Built for how you actually study.</h2>
          <p className="apple-subhead mx-auto mt-4 max-w-xl">
            No clutter. Just board-aligned prep, deep rationales, and performance
            you can trust on exam day.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {highlights.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`apple-bento flex flex-col ${item.span}`}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                {item.eyebrow}
              </p>
              <h3 className="mt-2 text-[clamp(1.375rem,3vw,1.75rem)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                {item.desc}
              </p>
              <div className="mt-5">
                <AppleLink href={item.href}>{item.linkLabel}</AppleLink>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            Eight disciplines
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {disciplines.map((d) => (
              <li
                key={d}
                className="text-[1.0625rem] font-medium tracking-tight text-[var(--color-ink)]"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
