import { TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import type { BoardHeroTestimonial } from "@/lib/marketing/board-landing/board-hero-marketing";

type BoardHeroFootProps = {
  testimonial: BoardHeroTestimonial | null;
  proofFacts: readonly string[];
  boardName: string;
};

/**
 * Text-only foot of the board photo hero. A fixed box keeps the lower photo
 * from shifting, and there is no image so it does not add a fetch to LCP.
 */
export function BoardHeroFoot({ testimonial, proofFacts, boardName }: BoardHeroFootProps) {
  if (testimonial) {
    return (
      <div className="mkt-hero-foot">
        <div className="mkt-hero-foot__slot">
          <figure className="mkt-hero-foot__card">
            <p className="mkt-hero-foot__stars" aria-label="5 out of 5 stars">
              <span aria-hidden="true">★★★★★</span>
            </p>
            <blockquote className="mkt-hero-foot__quote">
              <p>{testimonial.quote}</p>
            </blockquote>
            <figcaption className="mkt-hero-foot__by">
              {testimonial.name}
              <span> · {testimonial.board}</span>
            </figcaption>
            <p className="mkt-hero-foot__note">{TESTIMONIAL_RESULTS_NOTE}</p>
          </figure>
        </div>
      </div>
    );
  }

  if (proofFacts.length === 0) return null;

  return (
    <div className="mkt-hero-foot">
      <div className="mkt-hero-foot__slot">
        <aside className="mkt-hero-foot__card" aria-label={`${boardName} practice facts`}>
          <p className="mkt-hero-foot__by">{boardName}</p>
          <ul className="mkt-hero-foot__facts">
            {proofFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
