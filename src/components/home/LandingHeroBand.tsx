"use client";

import { Hero } from "@/components/Hero";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import { LiveBankStats } from "@/components/home/LiveBankStats";

/** Guest landing hero: copy left, compare aside right, live stats along the bottom. */
export function LandingHeroBand() {
  return (
    <div className="aee-landing-hero-band">
      <div className="aee-landing-hero-band__bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--1 pointer-events-none absolute" aria-hidden />
      <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--2 pointer-events-none absolute" aria-hidden />
      <div className="aee-hero-grid pointer-events-none absolute inset-0" aria-hidden />

      <Hero compareLayout />

      <aside className="aee-landing-hero-band__aside" aria-labelledby="compare-heading">
        <HowWeCompare variant="hero-inline" />
      </aside>

      <div className="aee-landing-hero-band__stats">
        <LiveBankStats compact />
      </div>
    </div>
  );
}
