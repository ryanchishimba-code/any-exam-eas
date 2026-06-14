import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatTrialCtaLabel } from "@/lib/site";

type LandingConversionBandProps = {
  title: string;
  subtitle?: string;
};

/** Mid-page CTA strip — one action, minimal copy. */
export function LandingConversionBand({ title, subtitle }: LandingConversionBandProps) {
  return (
    <section className="aee-landing-conversion-band" aria-label={title}>
      <div className="aee-flagship-inner aee-landing-conversion-band__inner">
        <div className="aee-landing-conversion-band__copy">
          <h2 className="aee-landing-conversion-band__title">{title}</h2>
          {subtitle ? <p className="aee-landing-conversion-band__subtitle">{subtitle}</p> : null}
        </div>
        <LandingCta
          href={LANDING_TRIAL_HREF}
          className="aee-flagship-cta--hero group shrink-0"
          icon={
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          }
        >
          {formatTrialCtaLabel()}
        </LandingCta>
      </div>
    </section>
  );
}
