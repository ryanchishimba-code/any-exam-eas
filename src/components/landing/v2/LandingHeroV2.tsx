"use client";

/**
 * LandingHeroV2 — visual ATF: darker full-bleed stage + floating product still.
 * Brand + benefit H1 + quiet exam links + trial CTA (no price in ATF) + laptop.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHeroExamStrip } from "@/components/home/LandingHeroExamStrip";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_EYEBROW,
  LANDING_HERO_HEADLINE,
  LANDING_TRIAL_HREF,
  formatFlagshipHeroSubline,
} from "@/lib/landing/content";
import {
  LANDING_HERO_LAPTOP_ALT,
  LANDING_HERO_LAPTOP_SRC,
} from "@/lib/marketing/landing-visuals";
import { formatTrialCtaLabel } from "@/lib/site";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

export function LandingHeroV2({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
        el.style.setProperty("--aee-hero-parallax", `${progress * 18}`);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      className="aee-hero-beat relative w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="aee-hero-beat__atmosphere" aria-hidden />
      <div className="aee-hero-beat__vignette" aria-hidden />

      <div className="aee-hero-beat__shell">
        <div className="aee-hero-beat__copy">
          <p className="aee-hero-beat__brand">{LANDING_HERO_EYEBROW}</p>

          <h1 id="hero-heading" className="aee-hero-beat__headline">
            {LANDING_HERO_HEADLINE}
          </h1>

          <p className="aee-hero-beat__subline">
            {formatFlagshipHeroSubline(bankCounts.totalLabel)}
          </p>

          <LandingHeroExamStrip variant="chips" bankCounts={bankCounts} className="aee-hero-beat__exams" />

          <div className="aee-hero-beat__actions">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              className="aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary aee-flagship-cta--on-dark group aee-hero-beat__cta"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              }
            >
              {formatTrialCtaLabel()}
            </LandingCta>
            <Link href="#pricing" prefetch={false} className="aee-hero-beat__secondary">
              See pricing
            </Link>
          </div>

          <p className="aee-hero-beat__meta">{LANDING_HERO_CTA_DISCLOSURE}</p>
        </div>

        <div ref={visualRef} className="aee-hero-beat__visual">
          <span className="aee-hero-beat__stage-glow" aria-hidden />
          <div className="aee-hero-beat__float">
            <div className="aee-hero-beat__product">
              <Image
                src={LANDING_HERO_LAPTOP_SRC}
                alt={LANDING_HERO_LAPTOP_ALT}
                width={1024}
                height={576}
                priority
                unoptimized
                className="aee-hero-beat__laptop"
                sizes="(max-width: 1024px) 94vw, 58vw"
              />
            </div>
            <span className="aee-hero-beat__shadow" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
