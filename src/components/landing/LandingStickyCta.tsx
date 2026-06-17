"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatMonthlyPrice, formatTrialCtaLabel, formatLandingStickyDetail } from "@/lib/site";

/** Fixed bottom bar — appears after the hero scrolls out of view. */
export function LandingStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".aee-flagship-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="aee-landing-sticky-cta" role="region" aria-label="Start your free trial">
      <div className="aee-landing-sticky-cta__inner">
        <div className="aee-landing-sticky-cta__copy">
          <p className="aee-landing-sticky-cta__price">
            Basic {formatMonthlyPrice("basic")}
            <span className="aee-landing-sticky-cta__period">/mo</span>
            <span className="mx-1.5 opacity-50">·</span>
            Pro {formatMonthlyPrice("pro")}
            <span className="aee-landing-sticky-cta__period">/mo</span>
          </p>
          <p className="aee-landing-sticky-cta__detail">{formatLandingStickyDetail()}</p>
        </div>
        <Link href={LANDING_TRIAL_HREF} className="aee-landing-sticky-cta__btn group">
          {formatTrialCtaLabel()}
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
