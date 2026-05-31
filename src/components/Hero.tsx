import { formatPricingHeadline } from "@/lib/site";
import { ReturningUserHeroBanner } from "@/components/home/ReturningUserHeroBanner";
import { HeroPrimaryCta } from "@/components/home/HeroPrimaryCta";
import { HeroTrustSignals } from "@/components/home/HeroTrustSignals";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { Award } from "lucide-react";

export function Hero() {
  return (
    <section
      className="aee-hero aee-hero-premium relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 apple-hero-premium" aria-hidden />

      <ReturningUserHeroBanner />

      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-24">
          <header className="text-center lg:text-left">
            <div className="aee-reveal mx-auto flex flex-wrap items-center justify-center gap-2.5 lg:mx-0 lg:justify-start">
              <p className="aee-badge">NCLEX NGN · USMLE · NAPLEX</p>
              <span className="aee-hero-trust-pill">
                <Award className="h-3.5 w-3.5 text-[var(--a11y-info)]" aria-hidden />
                Board-exam focused
              </span>
            </div>

            <h1
              id="hero-heading"
              className="aee-display-xl aee-reveal aee-reveal-delay-1 mt-8"
            >
              Pass your board exam{" "}
              <span className="aee-display-accent">the first time.</span>
            </h1>

            <p className="aee-lede aee-reveal aee-reveal-delay-2 mx-auto mt-6 max-w-xl lg:mx-0">
              Adaptive AI question banks with OER-backed rationales — built
              exclusively for NCLEX NGN, USMLE, and NAPLEX students who need
              results, not another generic study app.
            </p>

            <p className="aee-pricing-note aee-reveal aee-reveal-delay-2 mt-4 text-base font-semibold">
              {formatPricingHeadline()}
            </p>

            <div className="aee-reveal aee-reveal-delay-3 mx-auto mt-10 max-w-lg lg:mx-0 lg:max-w-none">
              <HeroPrimaryCta callbackUrl="/dashboard" />
            </div>

            <HeroTrustSignals className="aee-reveal aee-reveal-delay-4 mt-8" />

            <p className="aee-reveal aee-reveal-delay-5 mt-6 text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
              Free account · Payment required for exam features · Cancel anytime · 18+
            </p>
          </header>

          <div className="aee-reveal aee-reveal-delay-3 mx-auto w-full lg:mx-0">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
