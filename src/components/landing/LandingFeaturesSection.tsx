"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANDING_UNIQUE_FEATURES } from "@/lib/landing/content";

export function LandingFeaturesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="aee-flagship-section scroll-mt-24"
      aria-labelledby="features-heading"
    >
      <div className="aee-flagship-inner">
        <header className="aee-flagship-header aee-flagship-header--center mx-auto max-w-2xl text-center">
          <p className="aee-flagship-eyebrow">What makes us different</p>
          <h2 id="features-heading" className="aee-flagship-title aee-flagship-title--lg">
            Tools you won&apos;t find in a{" "}
            <span className="aee-flagship-gradient-text">question bank alone.</span>
          </h2>
          <p className="aee-flagship-subtitle">
            Roadmaps, Deep Dives, and analytics — built in, not bolted on.
          </p>
        </header>

        <ul className="aee-platform-advantages mt-10" aria-label="Platform differentiators">
          {LANDING_UNIQUE_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.li
                key={feature.title}
                className="aee-platform-advantage"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.38, delay: index * 0.05 }}
              >
                <span className="aee-platform-advantage__icon" aria-hidden>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                </span>
                <h3 className="aee-platform-advantage__title">{feature.title}</h3>
                <p className="aee-platform-advantage__detail">{feature.detail}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
