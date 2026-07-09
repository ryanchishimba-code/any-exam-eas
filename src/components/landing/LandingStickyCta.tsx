"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { formatTrialCtaLabel, formatLandingStickyDetail, NO_PAYMENT_TRIAL_BADGE } from "@/lib/site";

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
    <div className="aee-landing-sticky-cta" role="region" aria-label={formatTrialCtaLabel()}>
      <div className="aee-landing-sticky-cta__inner">
        <div className="aee-landing-sticky-cta__copy">
          <p className="aee-landing-sticky-cta__price">
            <span className="mr-2 inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
              {NO_PAYMENT_TRIAL_BADGE}
            </span>
            Pro <HighlightedPrice size="sm" period="/mo" />
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
