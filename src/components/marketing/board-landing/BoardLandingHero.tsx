import { BoardHubHeroActions } from "@/components/marketing/board-landing/BoardHubHeroActions";
import { MarketingPhotoHero } from "@/components/marketing/MarketingPhotoHero";
import type { BoardHeroTestimonial } from "@/lib/marketing/board-landing/board-hero-marketing";
import type { MarketingPhotoHeroId } from "@/lib/marketing/marketing-photo-heroes";

export type BoardLandingHeroProps = {
  photoHeroId: MarketingPhotoHeroId;
  headline: string;
  subline: string;
  testimonial: BoardHeroTestimonial | null;
  trialHref: string;
  heroCtaName: string;
  heroCtaLocation: string;
};

export function BoardLandingHero({
  photoHeroId,
  headline,
  subline,
  testimonial,
  trialHref,
  heroCtaName,
  heroCtaLocation,
}: BoardLandingHeroProps) {
  return (
    <MarketingPhotoHero
      heroId={photoHeroId}
      className="bl-hero bl-hero--single"
      ariaLabelledBy="board-hero-heading"
    >
      <div className="bl-hero-copy">
        <h1 id="board-hero-heading" className="mkt-photo-hero__stagger mkt-photo-hero__stagger--lcp">
          {headline}
        </h1>
        <p className="bl-hero-lede mkt-photo-hero__stagger mkt-photo-hero__stagger--lcp">{subline}</p>
        {testimonial ? (
          <figure className="bl-hero-quote mkt-photo-hero__stagger">
            <blockquote>
              <p>{testimonial.quote}</p>
            </blockquote>
            <figcaption>{testimonial.name}</figcaption>
          </figure>
        ) : null}
        <div className="mkt-photo-hero__stagger">
          <BoardHubHeroActions
            trialHref={trialHref}
            ctaName={heroCtaName}
            ctaLocation={heroCtaLocation}
          />
        </div>
      </div>
    </MarketingPhotoHero>
  );
}
