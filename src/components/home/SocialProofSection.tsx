"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANDING_SOCIAL_PROOF } from "@/lib/landing/content";

export function SocialProofSection() {
  const reduceMotion = useReducedMotion();

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
            More students pass with{" "}
            <span className="aee-flagship-gradient-text">one affordable plan.</span>
          </h2>
          <p className="aee-flagship-subtitle">
            One plan. Five boards. Integrated tools that help you study smarter — not harder.
          </p>
        </header>

        <ul className="aee-flagship-metrics mt-8" aria-label="Platform social proof">
          {LANDING_SOCIAL_PROOF.map((item, index) => (
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
