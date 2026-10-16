import { LandingCta } from "@/components/landing/LandingCta";
import { HomePassVideo } from "@/components/marketing/elevation/HomePassVideo";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { HOME_NO_PAYMENT_LINE, homeTrialCloseHeading, homeTrialCtaLabel } from "@/lib/marketing/home-cta";
import { howToPassSharePath } from "@/lib/marketing/home-video";
import { buildHowToPassMetadata } from "@/lib/marketing/how-to-pass-metadata";
import { absoluteUrl } from "@/lib/seo";
import "@/styles/home-visual.css";

export function generateMetadata() {
  return buildHowToPassMetadata();
}

export default function HowToPassPage() {
  return (
    <div className="home-visual home-share-page">
      <HomePassVideo shareUrl={absoluteUrl(howToPassSharePath())} heading="h1" anchored />
      <section className="home-close" aria-labelledby="pass-cta-heading">
        <h2 id="pass-cta-heading">{homeTrialCloseHeading()}</h2>
        <p>{HOME_NO_PAYMENT_LINE}</p>
        <LandingCta href={LANDING_TRIAL_HREF} ctaName="how_to_pass_trial" location="how_to_pass">
          {homeTrialCtaLabel()}
        </LandingCta>
      </section>
    </div>
  );
}
