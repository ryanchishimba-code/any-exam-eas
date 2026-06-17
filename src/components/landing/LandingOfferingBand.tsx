"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANDING_OFFERING_PILLARS } from "@/lib/landing/content";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

export function LandingOfferingBand() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="aee-landing-offering-band" aria-labelledby="offering-band-heading">
      <div className="aee-flagship-inner">
        <header className="aee-landing-offering-band__header">
          <p className="aee-flagship-eyebrow">What you get</p>
          <h2 id="offering-band-heading" className="aee-landing-offering-band__title">
            Premium board prep —{" "}
            <span className="aee-flagship-gradient-text">at a price that actually makes sense.</span>
          </h2>
          <p className="aee-landing-offering-band__lede">
            Basic from <HighlightedPrice size="md" period="/mo" /> · Pro from{" "}
            {formatMonthlyPrice("pro")}/mo · {formatTrialLabel()} on every plan
          </p>
        </header>

        <ul className="aee-landing-offering-band__grid">
          {LANDING_OFFERING_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.li
                key={pillar.title}
                className="aee-landing-offering-band__card"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <span className="aee-landing-offering-band__icon" aria-hidden>
                  <Icon className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <h3 className="aee-landing-offering-band__card-title">{pillar.title}</h3>
                <p className="aee-landing-offering-band__card-detail">{pillar.detail}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
