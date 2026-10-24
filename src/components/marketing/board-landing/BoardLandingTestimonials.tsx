import { TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import type { LandingTestimonialCard } from "@/lib/testimonials/landing-stories";

function TestimonialStars({ rating }: { rating: number }) {
  return (
    <p className="bl-testimonials__stars" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
    </p>
  );
}

export function BoardLandingTestimonials({
  stories,
  prominent = false,
}: {
  stories: LandingTestimonialCard[];
  prominent?: boolean;
}) {
  if (stories.length === 0) return null;

  return (
    <section
      className={`bl-section bl-section--tight bl-testimonials${prominent ? " bl-testimonials--hero" : ""}`}
      aria-labelledby="bl-testimonials-heading"
    >
      <h2 id="bl-testimonials-heading">{prominent ? "What nursing students say" : "From students"}</h2>
      <p className="bl-testimonials__note">{TESTIMONIAL_RESULTS_NOTE}</p>
      <ul className="bl-testimonials__row">
        {stories.map((story) => (
          <li key={`${story.name}-${story.exam}`} className="bl-testimonials__card">
            {story.rating ? <TestimonialStars rating={story.rating} /> : null}
            <blockquote>
              <p>{story.quote}</p>
            </blockquote>
            <p className="bl-testimonials__by">
              <span className="bl-testimonials__initials" aria-hidden>{story.initials}</span>
              {story.name}
              <span> · {story.exam}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
