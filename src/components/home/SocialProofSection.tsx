"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANDING_SOCIAL_PROOF } from "@/lib/landing/content";
import { formatMonthlyPrice } from "@/lib/site";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

export function SocialProofSection({
  bankCounts,
}: {
  bankCounts?: LandingBankCountsDisplay;
}) {
  const reduceMotion = useReducedMotion();
  const basicPrice = formatMonthlyPrice("basic");

  // Keep the headline stat in lockstep with the live hero count, never the static floor.
  const stats = LANDING_SOCIAL_PROOF.map((item) => {
    if (item.label === "Board-style questions" && bankCounts) {
      return { ...item, value: bankCounts.totalLabel };
    }
    if (item.label === "Starting plan") {
      return { ...item, value: `From ${basicPrice}` };
    }
    return item;
  });

  return (
    <section
      id="social-proof"
      className="aee-flagship-section aee-flagship-section--alt scroll-mt-24"
      aria-labelledby="social-proof-heading"
    >
      <div className="aee-flagship-inner">
        <header className="aee-flagship-header aee-flagship-header--center mx-auto max-w-2xl text-center">
          <p className="aee-flagship-eyebrow">Proven results</p>
          <h2 id="social-proof-heading" className="aee-flagship-title">
            Board-caliber quality —{" "}
            <span className="aee-flagship-gradient-text">without the premium price tag.</span>
          </h2>
          <p className="aee-flagship-subtitle">
            Every session draws from QA-gated, serve-ready items — six boards, one subscription.
          </p>
        </header>

        <ul className="aee-flagship-metrics mt-8" aria-label="Platform social proof">
          {stats.map((item, index) => (
            <motion.li
              key={item.label}
              className="aee-flagship-metric"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <span className="aee-flagship-metric__value">{item.value}</span>
              <span className="aee-flagship-metric__label">{item.label}</span>
              <span className="mt-1 block text-[0.6875rem] leading-snug text-[var(--color-ink-muted)]">
                {item.detail}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
