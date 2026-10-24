import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";

/** Same trial CTA as the hero, placed mid-page for scrollers. */
export function HomeRepeatTrialCta({
  label,
  ctaName,
  location,
}: {
  label: string;
  ctaName: string;
  location: string;
}) {
  return (
    <div className="home-mid-cta home-rise">
      <LandingCta href={LANDING_TRIAL_HREF} ctaName={ctaName} location={location}>
        {label}
      </LandingCta>
    </div>
  );
}
