import { ArrowRight } from "lucide-react";
import {
  LANDING_HERO_CTA_DISCLOSURE,
  LANDING_HERO_EYEBROW,
  LANDING_HERO_HEADLINE,
  LANDING_HERO_SUBLINE_BODY,
  LANDING_TRIAL_HREF,
} from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

/** Lightweight hero shell shown while the flagship landing bundle loads client-side. */
export function LandingHeroSkeleton({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  const nclexCount =
    bankCounts.exams?.find((e) => e.slug === "nclex")?.countLabel ?? bankCounts.totalLabel;

  return (
    <section
      className="aee-hero-beat aee-hero-beat--practice relative w-full overflow-hidden"
      aria-labelledby="hero-heading"
      data-landing-hero
    >
      <div className="aee-hero-beat__atmosphere" aria-hidden />
      <div className="aee-hero-beat__vignette" aria-hidden />
      <div className="aee-hero-beat__shell">
        <div className="aee-hero-beat__copy">
          <p className="aee-hero-beat__brand">{LANDING_HERO_EYEBROW}</p>
          <h1 id="hero-heading" className="aee-hero-beat__headline">
            {LANDING_HERO_HEADLINE}
          </h1>
          {nclexCount ? (
            <p className="aee-hero-beat__countline">{nclexCount} serve-ready questions in this bank</p>
          ) : null}
          <p className="aee-hero-beat__subline">{LANDING_HERO_SUBLINE_BODY}</p>
          <div className="aee-hero-beat__actions">
            <a
              href="#try-a-question"
              className="aee-flagship-cta aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary aee-flagship-cta--on-dark group aee-hero-beat__cta inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold"
            >
              Try a free question
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a href={LANDING_TRIAL_HREF} className="aee-hero-beat__secondary aee-hero-beat__secondary--trial">
              Start free trial
            </a>
          </div>
          <p className="aee-hero-beat__meta">{LANDING_HERO_CTA_DISCLOSURE}</p>
        </div>
        <div className="aee-hero-beat__visual aee-hero-beat__visual--practice" aria-hidden>
          <div className="h-[28rem] w-full max-w-md animate-pulse rounded-3xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}
