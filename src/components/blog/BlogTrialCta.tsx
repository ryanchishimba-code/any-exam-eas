import Link from "next/link";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatPricingCheckoutTrialOffer, formatTrialCtaLabel } from "@/lib/site";

/** On-article trial offer. The sentence is the approved pricing line, unchanged. */
export function BlogTrialCta() {
  return (
    <aside className="aee-blog-cta">
      <p className="aee-blog-cta-kicker">Practice on your exam</p>
      <p className="aee-blog-cta-title">Start with a short set, then keep the cases you miss.</p>
      <p className="aee-blog-cta-offer">{formatPricingCheckoutTrialOffer()}</p>
      <Link href={LANDING_TRIAL_HREF} className="aee-blog-cta-button">
        {formatTrialCtaLabel()}
      </Link>
    </aside>
  );
}
