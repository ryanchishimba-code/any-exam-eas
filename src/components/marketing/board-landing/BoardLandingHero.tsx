import { BoardHubHeroActions } from "@/components/marketing/board-landing/BoardHubHeroActions";
import type { BoardHeroTestimonial } from "@/lib/marketing/board-landing/board-hero-marketing";

export type BoardLandingHeroProps = {
  headline: string;
  subline: string;
  testimonial: BoardHeroTestimonial | null;
  trialHref: string;
  heroCtaName: string;
  heroCtaLocation: string;
};

export function BoardLandingHero({
  headline,
  subline,
  testimonial,
  trialHref,
  heroCtaName,
  heroCtaLocation,
}: BoardLandingHeroProps) {
  return (
    <section className="bl-hero bl-hero--single" aria-labelledby="board-hero-heading">
      <div className="bl-hero-copy">
        <h1 id="board-hero-heading">{headline}</h1>
        <p className="bl-hero-lede">{subline}</p>
        {testimonial ? (
          <figure className="bl-hero-quote">
            <blockquote>
              <p>{testimonial.quote}</p>
            </blockquote>
            <figcaption>{testimonial.name}</figcaption>
          </figure>
        ) : null}
        <BoardHubHeroActions
          trialHref={trialHref}
          ctaName={heroCtaName}
          ctaLocation={heroCtaLocation}
        />
      </div>
    </section>
  );
}
